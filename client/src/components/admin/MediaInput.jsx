import React, { useState, useRef } from 'react';
import { Image as ImageIcon, Upload, Link as LinkIcon, X, Check, Eye } from 'lucide-react';
import MediaPickerModal from './MediaPickerModal';

const MediaInput = ({
  label,
  value,
  onChange,
  placeholder = "https://... or select from gallery",
  helpText,
  required = false
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef(null);

  const handleSelectFromGallery = (selectedUrl) => {
    if (selectedUrl) {
      onChange(selectedUrl);
    }
  };

  const handleDirectUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="font-sans text-[10px] uppercase text-white/50 tracking-widest font-bold">
            {label} {required && <span className="text-amber-400">*</span>}
          </label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="font-sans text-[10px] text-gold hover:underline flex items-center space-x-1"
          >
            <LinkIcon size={10} />
            <span>{showUrlInput ? 'Hide URL Input' : 'Paste Direct URL'}</span>
          </button>
        </div>
      )}

      {/* Control Box */}
      <div className="bg-[#14161A] border border-white/10 rounded-xl p-3 space-y-3">
        {/* Current Image Preview & Quick Actions */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-lg bg-black/40 border border-white/10 overflow-hidden shrink-0 relative group flex items-center justify-center">
            {value ? (
              <img
                src={value}
                alt="CMS Field Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=60';
                }}
              />
            ) : (
              <ImageIcon size={20} className="text-white/20" />
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="flex items-center space-x-1.5 bg-gold/15 hover:bg-gold text-gold hover:text-charcoal border border-gold/40 font-sans text-[11px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg transition-all"
              >
                <ImageIcon size={13} />
                <span>Select from Gallery</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-1.5 bg-white/5 hover:bg-white/15 text-white/80 border border-white/10 font-sans text-[11px] font-bold uppercase tracking-wider px-3 py-2 rounded-lg transition-all"
              >
                <Upload size={13} />
                <span>Upload New</span>
              </button>

              {value && (
                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
                  title="Clear Image"
                >
                  <X size={14} />
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleDirectUpload}
              />
            </div>

            {value && (
              <p className="font-sans text-[10px] text-white/40 truncate max-w-md" title={value}>
                URL: {value}
              </p>
            )}
          </div>
        </div>

        {/* Manual URL Input Dropdown */}
        {showUrlInput && (
          <div className="pt-2 border-t border-white/10">
            <input
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-3 py-2 text-white placeholder:text-white/25"
            />
          </div>
        )}
      </div>

      {helpText && (
        <p className="font-sans text-[10px] text-white/40">{helpText}</p>
      )}

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelectFromGallery}
        initialSelection={value}
        multiple={false}
      />
    </div>
  );
};

export default MediaInput;
