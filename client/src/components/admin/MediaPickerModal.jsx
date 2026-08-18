import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  X, Search, Upload, Copy, CheckCircle, Image as ImageIcon,
  Check, Filter, AlertTriangle, Layers, Tag
} from 'lucide-react';
import { getMediaItems, saveMediaItems, setCMSData, STORAGE_KEYS } from '../../utils/cmsStore';
import { logAuditEvent } from '../../utils/auditStore';

const CATEGORIES = ['All', 'Home', 'Services', 'Projects', 'Materials', 'Spaces', 'About', 'General'];
const FILE_TYPES = ['All', 'JPG', 'PNG', 'WEBP', 'AVIF'];

const MediaPickerModal = ({
  isOpen,
  onClose,
  onSelect,
  multiple = false,
  initialSelection = [],
  title = "Select Image from Media Library"
}) => {
  const [mediaList, setMediaList] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedItems, setSelectedItems] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'upload'
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const fetchMediaModal = async () => {
        const items = getMediaItems();
        setMediaList(items);

        try {
          const res = await axios.get('/settings');
          if (res.data && res.data.success && res.data.data && Array.isArray(res.data.data.media_gallery_items)) {
            const dbItems = res.data.data.media_gallery_items;
            if (dbItems.length > 0) {
              const itemMap = new Map();
              items.forEach(i => itemMap.set(i.id || i.imageUrl, i));
              dbItems.forEach(i => itemMap.set(i.id || i.imageUrl, i));
              const merged = Array.from(itemMap.values());
              setMediaList(merged);
              setCMSData(STORAGE_KEYS.MEDIA, merged);
            }
          }
        } catch {}
      };

      fetchMediaModal();

      if (multiple && Array.isArray(initialSelection)) {
        setSelectedItems(initialSelection);
      } else if (!multiple && initialSelection && typeof initialSelection === 'string') {
        setSelectedItems([initialSelection]);
      } else {
        setSelectedItems([]);
      }
    }
  }, [isOpen, multiple, initialSelection]);

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleCopyUrl = (e, url) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    showToast('Image URL copied successfully.');
  };

  const handleToggleSelect = (url) => {
    if (multiple) {
      if (selectedItems.includes(url)) {
        setSelectedItems(selectedItems.filter((item) => item !== url));
      } else {
        setSelectedItems([...selectedItems, url]);
      }
    } else {
      setSelectedItems([url]);
    }
  };

  const handleConfirmSelection = () => {
    if (multiple) {
      onSelect(selectedItems);
    } else {
      onSelect(selectedItems[0] || '');
    }
    onClose();
  };

  // Upload handler
  const processFiles = async (files) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
    const validFiles = Array.from(files).filter(f => validTypes.includes(f.type) || /\.(jpg|jpeg|png|webp|avif)$/i.test(f.name));
    
    if (validFiles.length === 0) {
      alert('Please upload valid image files (JPG, PNG, WEBP, AVIF).');
      return;
    }

    setUploading(true);

    const newMediaItems = await Promise.all(
      validFiles.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const dataUrl = e.target.result;
            const ext = file.name.split('.').pop().toUpperCase();
            let finalUrl = dataUrl;
            let finalName = file.name.replace(/\s+/g, '_');

            try {
              const res = await axios.post('/upload-media', { fileName: file.name, base64: dataUrl });
              if (res.data && res.data.success && res.data.url) {
                finalUrl = res.data.url;
                if (res.data.fileName) finalName = res.data.fileName;
              } else {
                finalUrl = `/uploads/${finalName}`;
              }
            } catch (err) {
              console.warn('Backend image upload endpoint fallback:', err);
              finalUrl = `/uploads/${finalName}`;
            }

            const newItem = {
              id: 'media-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
              fileName: finalName,
              originalName: file.name,
              imageUrl: finalUrl,
              thumbnailUrl: finalUrl,
              altText: file.name.replace(/\.[^/.]+$/, "").replace(/_/g, ' '),
              caption: 'Uploaded file: ' + file.name,
              category: selectedCategory === 'All' ? 'General' : selectedCategory,
              fileType: ext,
              fileSize: (file.size / 1024).toFixed(1) + ' KB',
              width: 1920,
              height: 1080,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            resolve(newItem);
          };
          reader.readAsDataURL(file);
        });
      })
    );

    const updatedList = [...newMediaItems, ...mediaList];
    setMediaList(updatedList);
    saveMediaItems(updatedList);

    try {
      logAuditEvent('Uploaded Images to Media Library', 'Gallery', `Uploaded ${newMediaItems.length} file(s)`);
    } catch {}

    setUploading(false);
    showToast(`Successfully uploaded ${newMediaItems.length} image(s)!`);
    setActiveTab('browse');

    // Auto-select uploaded items
    if (multiple) {
      setSelectedItems([...newMediaItems.map(i => i.imageUrl), ...selectedItems]);
    } else {
      setSelectedItems([newMediaItems[0].imageUrl]);
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Filter media items
  const filteredList = mediaList.filter((item) => {
    const matchesSearch =
      (item.fileName || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.altText || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.caption || '').toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesType = selectedType === 'All' || (item.fileType || '').toUpperCase().includes(selectedType);

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-hidden">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[10000] bg-gold text-charcoal font-sans text-xs font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="bg-[#14161A] border border-white/10 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#1A1C20]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <ImageIcon size={18} />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold text-white">{title}</h2>
              <p className="font-sans text-[11px] text-white/40">Select an existing photo from Gallery or upload a new image</p>
            </div>
          </div>

          {/* Tab Switcher & Close */}
          <div className="flex items-center space-x-3">
            <div className="flex bg-[#0E0F11] border border-white/10 rounded-lg p-1 space-x-1">
              <button
                onClick={() => setActiveTab('browse')}
                className={`px-3 py-1.5 rounded-md font-sans text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'browse' ? 'bg-gold text-charcoal' : 'text-white/60 hover:text-white'}`}
              >
                Browse Gallery ({mediaList.length})
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-3 py-1.5 rounded-md font-sans text-xs font-bold uppercase tracking-wider flex items-center space-x-1 transition-colors ${activeTab === 'upload' ? 'bg-gold text-charcoal' : 'text-white/60 hover:text-white'}`}
              >
                <Upload size={12} />
                <span>Upload New</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/15 text-white/60 hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'browse' ? (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Search & Filter Toolbar */}
            <div className="p-4 border-b border-white/10 bg-[#0E0F11]/60 flex flex-wrap gap-3 items-center justify-between">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[220px]">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search photos by filename, alt text, or category..."
                  className="w-full bg-[#1A1C20] border border-white/10 focus:border-gold focus:outline-none rounded-lg pl-9 pr-4 py-2 font-sans text-xs text-white placeholder:text-white/30"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <span className="font-sans text-[10px] uppercase text-white/40 tracking-wider">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-[#1A1C20] border border-white/10 focus:border-gold text-white font-sans text-xs rounded-lg px-3 py-2 outline-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Format Filter */}
              <div className="flex items-center space-x-2">
                <span className="font-sans text-[10px] uppercase text-white/40 tracking-wider">Format:</span>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-[#1A1C20] border border-white/10 focus:border-gold text-white font-sans text-xs rounded-lg px-3 py-2 outline-none"
                >
                  {FILE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredList.map((item) => {
                const isSelected = selectedItems.includes(item.imageUrl);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleToggleSelect(item.imageUrl)}
                    className={`group relative bg-[#1A1C20] border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${isSelected ? 'border-gold ring-2 ring-gold/40 shadow-lg scale-[1.02]' : 'border-white/10 hover:border-white/30 hover:scale-[1.01]'}`}
                  >
                    {/* Thumbnail Container */}
                    <div className="aspect-[4/3] relative overflow-hidden bg-black/40">
                      <img
                        src={item.imageUrl}
                        alt={item.altText || item.fileName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      
                      {/* Badge Selection Overlay */}
                      <div className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${isSelected ? 'bg-gold text-charcoal' : 'bg-black/50 text-white/40 border border-white/30 group-hover:bg-black/80'}`}>
                        <Check size={14} className={isSelected ? 'stroke-[3]' : ''} />
                      </div>

                      {/* Format Badge */}
                      <span className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-gold font-sans text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border border-gold/30">
                        {item.fileType || 'IMG'}
                      </span>

                      {/* Copy URL Hover Button */}
                      <button
                        onClick={(e) => handleCopyUrl(e, item.imageUrl)}
                        title="Copy Image URL"
                        className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-gold hover:text-charcoal text-white opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <Copy size={13} />
                      </button>
                    </div>

                    {/* Metadata Footer */}
                    <div className="p-2.5 space-y-1">
                      <p className="font-sans text-[11px] font-bold text-white truncate" title={item.fileName}>
                        {item.fileName}
                      </p>
                      <div className="flex items-center justify-between text-[9px] text-white/40 font-sans">
                        <span>{item.category || 'General'}</span>
                        <span>{item.fileSize || ''}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredList.length === 0 && (
                <div className="col-span-full py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/30">
                    <ImageIcon size={24} />
                  </div>
                  <p className="font-sans text-xs text-white/40 font-medium">No matching photos found in Media Library</p>
                  <button
                    onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedType('All'); }}
                    className="font-sans text-xs text-gold underline hover:text-gold-hover font-bold"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Upload Area Tab */
          <div className="flex-1 p-8 flex flex-col items-center justify-center bg-[#0E0F11]">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleFileDrop}
              className={`w-full max-w-2xl border-2 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-5 transition-all ${dragActive ? 'border-gold bg-gold/10' : 'border-white/15 bg-[#14161A] hover:border-gold/50'}`}
            >
              <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                <Upload size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="font-editorial text-2xl font-bold text-white">Drag & Drop Images Here</h3>
                <p className="font-sans text-xs text-white/40">Supported Formats: <strong className="text-white">JPG, JPEG, PNG, WebP, AVIF</strong> (Max 10MB per file)</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/avif,image/jpg"
                className="hidden"
                onChange={(e) => e.target.files && processFiles(e.target.files)}
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold px-6 py-3.5 rounded-xl disabled:opacity-60 transition-all shadow-lg"
              >
                <Upload size={14} />
                <span>{uploading ? 'Processing & Optimizing...' : 'Select Files from Computer'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#1A1C20] flex items-center justify-between">
          <div className="font-sans text-xs text-white/60">
            {selectedItems.length > 0 ? (
              <span>Selected: <strong className="text-gold font-bold">{selectedItems.length}</strong> image(s)</span>
            ) : (
              <span>No image selected</span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-white/15 hover:border-white/30 text-white font-sans text-xs uppercase tracking-widest font-bold transition-all"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmSelection}
              disabled={selectedItems.length === 0}
              className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold px-6 py-2.5 rounded-xl disabled:opacity-50 transition-all shadow-lg"
            >
              <CheckCircle size={15} />
              <span>Confirm & Use {selectedItems.length > 1 ? `(${selectedItems.length})` : 'Image'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPickerModal;
