import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Upload, Search, Copy, CheckCircle, Trash2, Eye, Edit3,
  Filter, Image as ImageIcon, AlertTriangle, X, Check, FileText, Layers, Tag
} from 'lucide-react';
import { getMediaItems, saveMediaItems, checkImageUsageInCMS, setCMSData, STORAGE_KEYS } from '../../utils/cmsStore';
import { logAuditEvent } from '../../utils/auditStore';

const CATEGORIES = ['All', 'Home', 'Services', 'Projects', 'Materials', 'Spaces', 'About', 'General'];
const FILE_TYPES = ['All', 'JPG', 'PNG', 'WEBP', 'AVIF'];

const AdminGallery = () => {
  const [mediaItems, setMediaItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [toastMessage, setToastMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Modals
  const [previewItem, setPreviewItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteWarningModal, setDeleteWarningModal] = useState({ open: false, item: null, locations: [] });

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchMedia = async () => {
      const items = getMediaItems();
      setMediaItems(items);

      try {
        const res = await axios.get('/settings');
        if (res.data && res.data.success && res.data.data && Array.isArray(res.data.data.media_gallery_items)) {
          const dbItems = res.data.data.media_gallery_items;
          if (dbItems.length > 0) {
            const itemMap = new Map();
            items.forEach(i => itemMap.set(i.id || i.imageUrl, i));
            dbItems.forEach(i => itemMap.set(i.id || i.imageUrl, i));
            const merged = Array.from(itemMap.values());
            setMediaItems(merged);
            setCMSData(STORAGE_KEYS.MEDIA, merged);
          }
        }
      } catch {}
    };

    fetchMedia();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleCopyUrl = (e, url) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    showToast('Image URL copied successfully.');
  };

  // Upload Processing
  const processUploadFiles = async (files) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/jpg'];
    const validFiles = Array.from(files).filter(f => validTypes.includes(f.type) || /\.(jpg|jpeg|png|webp|avif)$/i.test(f.name));

    if (validFiles.length === 0) {
      alert('Please select supported image files: JPG, JPEG, PNG, WebP, AVIF.');
      return;
    }

    setUploading(true);

    const newItems = await Promise.all(
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
              caption: 'Uploaded photo: ' + file.name,
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

    const updated = [...newItems, ...mediaItems];
    setMediaItems(updated);
    saveMediaItems(updated);

    try {
      logAuditEvent('Uploaded Media to Gallery', 'Media Library', `Uploaded ${newItems.length} new image(s)`);
    } catch {}

    setUploading(false);
    showToast(`Successfully uploaded ${newItems.length} image(s) to Media Library!`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadFiles(e.dataTransfer.files);
    }
  };

  // Safe Deletion Handler
  const handleDeleteAttempt = (item) => {
    const usage = checkImageUsageInCMS(item.imageUrl);
    if (usage.length > 0) {
      setDeleteWarningModal({
        open: true,
        item: item,
        locations: usage
      });
    } else {
      if (window.confirm(`Are you sure you want to delete "${item.fileName}" from the Media Library?`)) {
        performDelete(item.id);
      }
    }
  };

  const performDelete = (id) => {
    const updated = mediaItems.filter(i => i.id !== id);
    setMediaItems(updated);
    saveMediaItems(updated);
    showToast('Image deleted successfully.');
    setDeleteWarningModal({ open: false, item: null, locations: [] });
    if (previewItem?.id === id) setPreviewItem(null);
  };

  // Save Metadata Edits
  const handleSaveMetadata = (e) => {
    e.preventDefault();
    if (!editingItem) return;

    const updated = mediaItems.map(i => i.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : i);
    setMediaItems(updated);
    saveMediaItems(updated);
    showToast('Image metadata updated!');
    setEditingItem(null);
  };

  // Filter List
  const filteredList = mediaItems.filter(item => {
    const matchesSearch =
      (item.fileName || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.altText || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.caption || '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesType = selectedType === 'All' || (item.fileType || '').toUpperCase().includes(selectedType);

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-[9999] bg-gold text-charcoal font-sans text-xs font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-editorial text-3xl font-bold text-white">Centralized Media Library</h1>
          <p className="font-sans text-xs text-white/40 mt-1">
            Upload client photos once and select/reuse permanent image URLs anywhere across the ESPACIO CMS.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg disabled:opacity-60"
          >
            <Upload size={14} />
            <span>{uploading ? 'Processing...' : '+ Upload Images'}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif,image/jpg"
            className="hidden"
            onChange={(e) => e.target.files && processUploadFiles(e.target.files)}
          />
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${dragActive ? 'border-gold bg-gold/10' : 'border-white/10 bg-[#14161A] hover:border-gold/40'}`}
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold shrink-0">
            <Upload size={22} />
          </div>
          <div className="text-left space-y-0.5">
            <h3 className="font-editorial text-lg font-bold text-white">Drag & Drop Client Photos Here</h3>
            <p className="font-sans text-xs text-white/40">Supported Formats: <strong className="text-white">JPG, JPEG, PNG, WebP, AVIF</strong></p>
          </div>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-5 py-2.5 rounded-xl border border-white/20 hover:border-gold hover:text-gold text-white font-sans text-xs uppercase tracking-widest font-bold transition-all shrink-0"
        >
          Browse Files
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-[#14161A] border border-white/10 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media by filename, alt text, or category..."
            className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-xl pl-9 pr-4 py-2.5 font-sans text-xs text-white placeholder:text-white/25"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <span className="font-sans text-[10px] uppercase text-white/40 tracking-wider font-bold">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#0E0F11] border border-white/10 focus:border-gold text-white font-sans text-xs rounded-xl px-3 py-2 outline-none"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Format Filter */}
        <div className="flex items-center space-x-2">
          <span className="font-sans text-[10px] uppercase text-white/40 tracking-wider font-bold">Format:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-[#0E0F11] border border-white/10 focus:border-gold text-white font-sans text-xs rounded-xl px-3 py-2 outline-none"
          >
            {FILE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="font-sans text-xs text-white/40 font-medium">
          Showing <strong className="text-white font-bold">{filteredList.length}</strong> of {mediaItems.length} photos
        </div>
      </div>

      {/* Media Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {filteredList.map((item) => (
          <div
            key={item.id}
            className="group bg-[#1A1C20] border border-white/10 hover:border-gold/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-1 flex flex-col"
          >
            {/* Thumbnail */}
            <div className="aspect-[4/3] relative overflow-hidden bg-black/40 cursor-pointer" onClick={() => setPreviewItem(item)}>
              <img
                src={item.imageUrl}
                alt={item.altText || item.fileName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Format Badge */}
              <span className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-gold font-sans text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border border-gold/30">
                {item.fileType || 'IMG'}
              </span>

              {/* Action Bar Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setPreviewItem(item); }}
                  className="p-2 rounded-xl bg-white/15 hover:bg-white text-white hover:text-charcoal transition-colors"
                  title="Preview Image"
                >
                  <Eye size={15} />
                </button>
                <button
                  onClick={(e) => handleCopyUrl(e, item.imageUrl)}
                  className="p-2 rounded-xl bg-gold hover:bg-gold-hover text-charcoal transition-colors font-bold"
                  title="Copy Permanent Image URL"
                >
                  <Copy size={15} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setEditingItem(item); }}
                  className="p-2 rounded-xl bg-white/15 hover:bg-white text-white hover:text-charcoal transition-colors"
                  title="Edit Metadata"
                >
                  <Edit3 size={15} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteAttempt(item); }}
                  className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white transition-colors"
                  title="Delete Image"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-sans text-xs font-bold text-white truncate" title={item.fileName}>
                  {item.fileName}
                </h4>
                <p className="font-sans text-[10px] text-white/40 line-clamp-1 mt-0.5">
                  {item.altText || item.caption || 'No alt text provided'}
                </p>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-sans">
                <span className="bg-white/5 px-2 py-0.5 rounded text-white/60 font-semibold">{item.category || 'General'}</span>
                <span>{item.fileSize || ''}</span>
              </div>
            </div>
          </div>
        ))}

        {filteredList.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/30">
              <ImageIcon size={32} />
            </div>
            <h3 className="font-editorial text-xl font-bold text-white">No Images Found</h3>
            <p className="font-sans text-xs text-white/40">Upload photos or adjust search keywords to view gallery assets.</p>
          </div>
        )}
      </div>

      {/* ── 1. PREVIEW LIGHTBOX MODAL ────────────────────────────────────────── */}
      {previewItem && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setPreviewItem(null)}>
          <div className="bg-[#14161A] border border-white/10 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#1A1C20]">
              <h3 className="font-editorial text-lg font-bold text-white">{previewItem.fileName}</h3>
              <button onClick={() => setPreviewItem(null)} className="p-1 text-white/50 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <img src={previewItem.imageUrl} alt={previewItem.altText} className="w-full max-h-[50vh] object-contain rounded-xl bg-black/50" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
                <div><span className="text-white/40 block">Category</span><span className="text-white font-bold">{previewItem.category}</span></div>
                <div><span className="text-white/40 block">Format</span><span className="text-white font-bold">{previewItem.fileType}</span></div>
                <div><span className="text-white/40 block">Size</span><span className="text-white font-bold">{previewItem.fileSize}</span></div>
                <div><span className="text-white/40 block">Alt Text</span><span className="text-white font-bold">{previewItem.altText || 'None'}</span></div>
              </div>
              <div className="pt-2">
                <button
                  onClick={(e) => handleCopyUrl(e, previewItem.imageUrl)}
                  className="w-full flex items-center justify-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3 rounded-xl shadow-lg transition-all"
                >
                  <Copy size={14} />
                  <span>Copy Permanent Storage Image URL</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. EDIT METADATA MODAL ───────────────────────────────────────────── */}
      {editingItem && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[#14161A] border border-white/10 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#1A1C20]">
              <h3 className="font-editorial text-lg font-bold text-white">Edit Image Metadata</h3>
              <button onClick={() => setEditingItem(null)} className="p-1 text-white/50 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSaveMetadata} className="p-6 space-y-4 font-sans text-xs">
              <div className="space-y-1.5">
                <label className="text-white/50 uppercase tracking-widest text-[10px]">File Name</label>
                <input
                  type="text"
                  value={editingItem.fileName || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, fileName: e.target.value })}
                  className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white/50 uppercase tracking-widest text-[10px]">Alt Text (SEO & Accessibility)</label>
                <input
                  type="text"
                  value={editingItem.altText || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, altText: e.target.value })}
                  placeholder="e.g. Modernist Penthouse Living Lounge Hyderabad"
                  className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-white/50 uppercase tracking-widest text-[10px]">Category</label>
                <select
                  value={editingItem.category || 'General'}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold rounded-lg px-3 py-2 text-white"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 rounded-lg border border-white/15 text-white">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-lg bg-gold text-charcoal font-bold">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── 3. DELETE SAFETY WARNING MODAL ────────────────────────────────────── */}
      {deleteWarningModal.open && (
        <div className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-[#14161A] border border-amber-500/40 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold text-white">Cannot Silently Delete Active Image</h3>
              <p className="font-sans text-xs text-white/60 mt-1">
                The image <strong className="text-white">"{deleteWarningModal.item?.fileName}"</strong> is currently in active use across <strong>{deleteWarningModal.locations.length}</strong> CMS location(s):
              </p>
            </div>

            <div className="bg-[#0E0F11] border border-amber-500/20 rounded-xl p-3 max-h-36 overflow-y-auto space-y-1.5 font-sans text-xs text-amber-300">
              {deleteWarningModal.locations.map((loc, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <span>•</span>
                  <span>{loc}</span>
                </div>
              ))}
            </div>

            <p className="font-sans text-[11px] text-white/40">
              Deleting this image will cause broken links on your live website. Please replace or remove the image reference in those sections first.
            </p>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteWarningModal({ open: false, item: null, locations: [] })}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-bold"
              >
                Keep Image (Cancel)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
