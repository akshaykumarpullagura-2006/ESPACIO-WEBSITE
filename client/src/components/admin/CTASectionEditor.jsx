import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Save, CheckCircle, Loader2, Image as ImageIcon, Sliders, Eye, EyeOff, Upload, HelpCircle } from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS, uploadImageFile } from '../../utils/cmsStore';
import { PAGE_CTAS, DEFAULT_CTA_BG } from '../../utils/siteData';
import MediaPickerModal from './MediaPickerModal';

const getInitialCtaData = (pageKey) => {
  const upperKey = (pageKey || 'home').toUpperCase();
  const fallback = PAGE_CTAS[upperKey] || PAGE_CTAS.HOME;

  return {
    heading: fallback.headline || "Ready to Transform Your Space?",
    description: fallback.subtext || "Every great space starts with a single conversation. Let's talk about your vision and bring it to life together.",
    buttonText: fallback.buttonText || "LET'S TALK ↗",
    buttonLink: fallback.path || "/contact",
    bgImage: fallback.bgImage || DEFAULT_CTA_BG,
    opacity: fallback.opacity ?? 80,
    enabled: fallback.enabled !== false,
  };
};

const CTASectionEditor = ({ pageKey = 'home', pageTitle = 'Home', onSaveSuccess }) => {
  const [ctaData, setCtaData] = useState(() => getInitialCtaData(pageKey));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pickerOpen, setPickerOpen] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadSettings = async () => {
      const storageKey = `cta_${pageKey}`;
      const defaultData = getInitialCtaData(pageKey);
      
      const storedSettings = getCMSData(STORAGE_KEYS.SETTINGS);
      if (storedSettings && storedSettings[storageKey]) {
        setCtaData({
          ...defaultData,
          ...storedSettings[storageKey],
        });
        setLoading(false);
      }

      try {
        const res = await axios.get('/settings');
        if (res.data.success && res.data.data) {
          const apiVal = res.data.data[storageKey];
          if (apiVal) {
            setCtaData({
              ...defaultData,
              ...apiVal,
            });
            // sync with local store
            const merged = { ...storedSettings, [storageKey]: apiVal };
            setCMSData(STORAGE_KEYS.SETTINGS, merged);
          }
        }
      } catch (err) {
        console.warn(`Could not load API settings for cta_${pageKey}`, err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [pageKey]);

  const updateField = (field, value) => {
    setCtaData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP, etc.)');
      return;
    }
    const uploadedUrl = await uploadImageFile(file);
    if (uploadedUrl) {
      updateField('bgImage', uploadedUrl);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    const storageKey = `cta_${pageKey}`;
    const existingSettings = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    const updatedSettings = {
      ...existingSettings,
      [storageKey]: ctaData,
    };

    // Immediately save to local CMS store and broadcast live event
    setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);

    try {
      await axios.put('/settings', updatedSettings);
    } catch (err) {
      console.warn('API sync failed, saved in local CMS store', err);
    }

    setSaving(false);
    setSaved(true);
    if (onSaveSuccess) onSaveSuccess();
    setTimeout(() => setSaved(false), 2000);
  };

  const inpClass = "w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 transition-all";
  const labelClass = "font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-1.5";

  if (loading) {
    return (
      <div className="p-8 text-center text-white/40 font-sans text-xs flex items-center justify-center space-x-2">
        <Loader2 size={16} className="animate-spin text-gold" />
        <span>Loading {pageTitle} CTA settings...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Header & Toggle */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <h3 className="font-editorial text-xl font-bold text-white flex items-center space-x-2">
            <span>CTA Section — {pageTitle} Page</span>
          </h3>
          <p className="font-sans text-xs text-white/40 mt-1">
            Independently customize the bottom Call-To-Action banner shown on the {pageTitle} page.
          </p>
        </div>

        {/* Enable / Disable Toggle */}
        <label className="flex items-center space-x-3 cursor-pointer bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-gold/30 transition-all select-none">
          <span className="font-sans text-xs font-bold text-white/70">
            {ctaData.enabled ? 'Section Enabled' : 'Section Hidden'}
          </span>
          <div
            onClick={() => updateField('enabled', !ctaData.enabled)}
            className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
              ctaData.enabled ? 'bg-gold' : 'bg-white/20'
            }`}
          >
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                ctaData.enabled ? 'translate-x-5' : 'translate-x-0.5'
              }`}
            />
          </div>
        </label>
      </div>

      {/* Section 1: Content */}
      <div className="space-y-4">
        <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold block">
          1. Text & Content
        </span>

        <div>
          <label className={labelClass}>Heading</label>
          <input
            type="text"
            value={ctaData.heading}
            onChange={(e) => updateField('heading', e.target.value)}
            className={inpClass}
            placeholder="Ready to Transform Your Space?"
          />
        </div>

        <div>
          <label className={labelClass}>Description Text</label>
          <textarea
            rows={3}
            value={ctaData.description}
            onChange={(e) => updateField('description', e.target.value)}
            className={`${inpClass} resize-none`}
            placeholder="Every great space starts with a single conversation..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Button Text</label>
            <input
              type="text"
              value={ctaData.buttonText}
              onChange={(e) => updateField('buttonText', e.target.value)}
              className={inpClass}
              placeholder="LET'S TALK ↗"
            />
          </div>
          <div>
            <label className={labelClass}>Button Link Target</label>
            <input
              type="text"
              value={ctaData.buttonLink}
              onChange={(e) => updateField('buttonLink', e.target.value)}
              className={inpClass}
              placeholder="/contact"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Background Image & Media Picker */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold block">
          2. Background Media
        </span>

        <div>
          <label className={labelClass}>Background Image URL</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={ctaData.bgImage}
              onChange={(e) => updateField('bgImage', e.target.value)}
              className={inpClass}
              placeholder="https://images.unsplash.com/..."
            />
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="flex items-center space-x-1.5 bg-gold/15 hover:bg-gold text-gold hover:text-charcoal border border-gold/40 px-3.5 py-3 rounded-lg font-sans text-xs font-bold uppercase tracking-wider transition-all shrink-0"
            >
              <ImageIcon size={14} />
              <span>Select from Gallery</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-bold uppercase tracking-wider py-3 px-4 rounded-lg transition-all shrink-0 border border-white/10"
            >
              <Upload size={14} />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* Image Preview Thumbnail */}
        {ctaData.bgImage && (
          <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-[16/5] bg-black/50 group">
            <img
              src={ctaData.bgImage}
              alt="CTA Background Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div
              className="absolute inset-0 bg-black pointer-events-none transition-opacity"
              style={{ opacity: (ctaData.opacity ?? 80) / 100 }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10 pointer-events-none">
              <span className="font-editorial text-sm md:text-base font-bold text-white drop-shadow-md whitespace-pre-line">
                {ctaData.heading || 'Heading Preview'}
              </span>
              <span className="font-sans text-[10px] text-white/80 mt-1 max-w-md line-clamp-1">
                {ctaData.description || 'Description Preview'}
              </span>
            </div>
            <span className="absolute bottom-2 right-2 font-mono text-[9px] bg-black/70 text-white/70 px-2 py-0.5 rounded border border-white/10">
              Live Overlay: {ctaData.opacity}%
            </span>
          </div>
        )}
      </div>

      {/* Section 3: Appearance & Overlay Slider */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold block">
          3. Appearance & Dark Overlay
        </span>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={labelClass}>Overlay Opacity</label>
            <span className="font-mono text-xs text-gold font-bold">{ctaData.opacity}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={ctaData.opacity}
            onChange={(e) => updateField('opacity', Number(e.target.value))}
            className="w-full accent-gold bg-[#0E0F11] cursor-pointer"
          />
          <p className="font-sans text-[10px] text-white/30 mt-1">
            Adjusts dark backdrop tint over the background architectural photo for optimal text contrast.
          </p>
        </div>
      </div>

      {/* Save Action */}
      <div className="pt-6 border-t border-white/5 flex items-center justify-end">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-8 rounded-lg transition-all duration-300 disabled:opacity-60 shadow-lg"
        >
          {saved ? (
            <>
              <CheckCircle size={15} />
              <span>Saved & Published Live!</span>
            </>
          ) : saving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <>
              <Save size={15} />
              <span>Save {pageTitle} CTA Section</span>
            </>
          )}
        </button>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        multiple={false}
        initialSelection={ctaData.bgImage || ''}
        title={`Select Background Image for ${pageTitle} CTA Section`}
        onSelect={(selectedUrl) => {
          if (typeof selectedUrl === 'string') {
            updateField('bgImage', selectedUrl);
          }
        }}
      />
    </form>
  );
};

export default CTASectionEditor;
