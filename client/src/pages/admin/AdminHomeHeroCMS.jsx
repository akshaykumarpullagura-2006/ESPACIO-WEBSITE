import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  ImageIcon, Save, CheckCircle, Loader2, Plus, Trash2,
  Eye, Sliders, ArrowUpRight, Check, AlertCircle, RefreshCw
} from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS, uploadImageFile } from '../../utils/cmsStore';
import CTASectionEditor from '../../components/admin/CTASectionEditor';
import MediaPickerModal from '../../components/admin/MediaPickerModal';

const AdminHomeHeroCMS = () => {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [bgPickerOpen, setBgPickerOpen] = useState(false);
  const [cardPickerOpen, setCardPickerOpen] = useState(false);
  const fileInputBgRef = useRef(null);
  const fileInputCardRef = useRef(null);

  // Home Hero CMS State
  const [heroState, setHeroState] = useState({
    hero_bg_images: [
      '/images/user_uploaded_bedroom.jpg',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1920&q=90',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=90'
    ],
    hero_card_image: '',
    hero_card_heading: 'We Craft the Future Dwelling',
    hero_card_cta_text: 'Our Projects',
    hero_card_cta_link: '/projects',
    hero_card_cta_visible: true,

    hero_stat1_value: '25+',
    hero_stat1_label: 'Projects Completed',
    hero_stat1_visible: true,
    hero_stat1_order: 1,

    hero_stat2_value: '1 Year',
    hero_stat2_label: 'Since 2025',
    hero_stat2_visible: true,
    hero_stat2_order: 2,

    hero_stat3_value: '40+',
    hero_stat3_label: 'Years of Family Legacy',
    hero_stat3_visible: true,
    hero_stat3_order: 3,

    // Concept to Handover Intro Section
    intro_heading: 'From Concept to Handover — ESPACIO Delivers Complete Interiors.',
    intro_description: 'We bring 40+ years of family construction heritage to luxury interior design. Every space we create is backed by structural thinking, premium materials sourced directly from our own warehouses, and meticulous execution.',
    intro_cta_text1: 'Our Story ↗',
    intro_cta_text2: 'Read More ↗',
    intro_cta_link: '/about',

    // Main Stats Grid Section
    grid_stat1_val: '25+',
    grid_stat1_label: 'Projects Completed',
    grid_stat2_val: '100+',
    grid_stat2_label: 'Happy Clients (including materials clients)',
    grid_stat3_val: '40+',
    grid_stat3_label: 'Years Combined Legacy',

    // Showcase Carousel Slides
    showcase_slides: [
      { projectImg: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80", projectLabel: "Banjara Hills Villa" },
      { projectImg: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80", projectLabel: "Italian Kitchen Fitout" },
      { projectImg: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80", projectLabel: "Jubilee Hills Penthouse" },
      { projectImg: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", projectLabel: "Gachibowli Tech Hub" }
    ]
  });

  useEffect(() => {
    const fetchCMSData = async () => {
      const storedSettings = getCMSData(STORAGE_KEYS.SETTINGS);
      if (storedSettings && Object.keys(storedSettings).length > 0) {
        setHeroState((prev) => ({ ...prev, ...storedSettings }));
        setLoading(false);
      }
      try {
        const res = await axios.get('/settings');
        if (res.data && res.data.success && res.data.data && Object.keys(res.data.data).length > 0) {
          const apiData = res.data.data;
          setHeroState((prev) => {
            const merged = { ...prev, ...apiData };
            const bgImgs = (Array.isArray(apiData.hero_bg_images) && apiData.hero_bg_images.length > 0)
              ? apiData.hero_bg_images
              : (Array.isArray(apiData.hero_images) && apiData.hero_images.length > 0)
                ? apiData.hero_images
                : (Array.isArray(prev.hero_bg_images) && prev.hero_bg_images.length > 0)
                  ? prev.hero_bg_images
                  : merged.hero_bg_images;

            const finalMerged = {
              ...merged,
              hero_bg_images: bgImgs,
              hero_images: bgImgs
            };
            setCMSData(STORAGE_KEYS.SETTINGS, finalMerged);
            return finalMerged;
          });
        }
      } catch (err) {
        console.warn('API load settings warning:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCMSData();
  }, []);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    
    // Clean up empty strings or invalid items from hero_bg_images while preserving full URLs and query params
    const cleanedBgImages = (heroState.hero_bg_images || [])
      .map(url => (typeof url === 'string' ? url.trim() : ''))
      .filter(Boolean);

    const updatedHeroState = {
      ...heroState,
      hero_bg_images: cleanedBgImages,
      hero_images: cleanedBgImages
    };

    setHeroState(updatedHeroState);

    // Merge with any existing settings in store
    const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    const updatedSettings = { ...existing, ...updatedHeroState };

    // Immediately persist to local storage and broadcast to open tabs
    setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);

    try {
      await axios.put('/settings', updatedSettings);
    } catch (err) {
      console.warn('Database sync offline, updated in local CMS store.', err);
    }

    setSaving(false);
    setSaved(true);
    showNotification('Hero section updated successfully.');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFieldChange = (key, val) => {
    setHeroState((prev) => ({ ...prev, [key]: val }));
  };

  // Image Upload helper (converts uploaded file to clean short URL & allows replacement)
  const handleFileUpload = async (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }
    const uploadedUrl = await uploadImageFile(file);
    if (uploadedUrl) {
      callback(uploadedUrl);
    }
  };

  const inpClass = "w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 transition-all";
  const labelClass = "font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-white/50">
        <Loader2 size={24} className="animate-spin text-gold mr-3" />
        <span className="font-sans text-xs font-bold uppercase tracking-widest">Loading Hero CMS...</span>
      </div>
    );
  }

  // Active stats sorted by order
  const activeStats = [
    { key: 1, val: heroState.hero_stat1_value, label: heroState.hero_stat1_label, visible: heroState.hero_stat1_visible, order: Number(heroState.hero_stat1_order) || 1 },
    { key: 2, val: heroState.hero_stat2_value, label: heroState.hero_stat2_label, visible: heroState.hero_stat2_visible, order: Number(heroState.hero_stat2_order) || 2 },
    { key: 3, val: heroState.hero_stat3_value, label: heroState.hero_stat3_label, visible: heroState.hero_stat3_visible, order: Number(heroState.hero_stat3_order) || 3 },
  ].filter(s => s.visible).sort((a, b) => a.order - b.order);

  const heroBgPreview = (heroState.hero_bg_images?.[0] === '/api/user-uploaded-bedroom.jpg') ? '/images/user_uploaded_bedroom.jpg' : (heroState.hero_bg_images?.[0] || '/images/user_uploaded_bedroom.jpg');
  const cardImgPreview = (heroState.hero_card_image === '/api/user-uploaded-bedroom.jpg' || !heroState.hero_card_image) ? heroBgPreview : heroState.hero_card_image;

  return (
    <div className="space-y-8 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500/90 text-white px-5 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center space-x-2 font-sans text-xs font-bold animate-bounce">
          <CheckCircle size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Save Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-editorial text-3xl font-bold text-white">Home Page Hero CMS</h1>
          <p className="font-sans text-xs text-white/40 mt-1">
            Manage live background images, left floating feature card, and stats counters for the ESPACIO Homepage Hero.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-7 rounded-lg transition-all duration-300 disabled:opacity-60 shrink-0"
        >
          {saved ? (
            <>
              <CheckCircle size={15} />
              <span>Hero Published Live!</span>
            </>
          ) : saving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <>
              <Save size={15} />
              <span>Save & Publish Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Editor Grid: Left Form (7 cols) + Right Live Component Preview (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Editor Form */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* SECTION 1: HERO BACKGROUND IMAGES */}
          <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="font-editorial text-xl font-bold text-white flex items-center space-x-2">
                  <ImageIcon size={18} className="text-gold" />
                  <span>Hero Background Images</span>
                </h2>
                <p className="font-sans text-xs text-white/40 mt-0.5">Manage luxury interior background images for the Hero carousel slider.</p>
              </div>
            </div>

            {/* Hidden File Input for Background Upload */}
            <input
              type="file"
              ref={fileInputBgRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, (dataUrl) => {
                const updated = [dataUrl, ...(heroState.hero_bg_images || [])];
                handleFieldChange('hero_bg_images', updated);
              })}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className={labelClass}>Background Carousel Image URLs</label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setBgPickerOpen(true)}
                    className="flex items-center space-x-1.5 bg-gold/15 hover:bg-gold text-gold hover:text-charcoal border border-gold/40 px-3 py-1.5 rounded-lg font-sans text-[11px] font-bold uppercase transition-all"
                  >
                    <ImageIcon size={12} />
                    <span>Select from Gallery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputBgRef.current?.click()}
                    className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg font-sans text-[11px] font-bold uppercase transition-all"
                  >
                    <Plus size={12} />
                    <span>Upload File</span>
                  </button>
                </div>
              </div>

              {(heroState.hero_bg_images || []).map((imgUrl, i) => (
                <div key={i} className="flex items-center space-x-2 bg-[#0E0F11] border border-white/10 p-2 rounded-xl">
                  {imgUrl && (
                    <img src={imgUrl} alt={`Bg ${i+1}`} className="w-12 h-10 object-cover rounded-lg shrink-0 border border-white/10" />
                  )}
                  <input
                    type="text"
                    value={imgUrl}
                    onChange={(e) => {
                      const updated = [...(heroState.hero_bg_images || [])];
                      updated[i] = e.target.value;
                      handleFieldChange('hero_bg_images', updated);
                    }}
                    className={inpClass}
                    placeholder="https://images.unsplash.com/..."
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (heroState.hero_bg_images || []).filter((_, idx) => idx !== i);
                      handleFieldChange('hero_bg_images', updated);
                    }}
                    className="p-3 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
                    title="Remove Image"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const updated = [
                    ...(heroState.hero_bg_images || []),
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90'
                  ];
                  handleFieldChange('hero_bg_images', updated);
                }}
                className="flex items-center space-x-2 text-gold text-xs font-sans font-bold uppercase pt-2"
              >
                <Plus size={14} />
                <span>Add Unsplash Background URL</span>
              </button>
            </div>
          </div>

          {/* SECTION 2: LEFT FLOATING FEATURE CARD */}
          <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="font-editorial text-xl font-bold text-white flex items-center space-x-2">
                  <Sliders size={18} className="text-gold" />
                  <span>Left Floating Hero Feature Card</span>
                </h2>
                <p className="font-sans text-xs text-white/40 mt-0.5">Manage heading, card photo, and CTA button inside the lower-left glass card.</p>
              </div>
            </div>

            {/* Card Custom Image Upload */}
            <input
              type="file"
              ref={fileInputCardRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, (dataUrl) => {
                handleFieldChange('hero_card_image', dataUrl);
              })}
            />

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Card Image Thumbnail (Optional Custom Photo)</label>
                <div className="flex items-center space-x-3">
                  {cardImgPreview && (
                    <img src={cardImgPreview} alt="Card preview" className="w-20 h-14 object-cover rounded-lg border border-white/10" />
                  )}
                  <input
                    type="text"
                    value={heroState.hero_card_image || ''}
                    onChange={(e) => handleFieldChange('hero_card_image', e.target.value)}
                    className={inpClass}
                    placeholder="Leave empty to auto-sync with main background carousel"
                  />
                  <button
                    type="button"
                    onClick={() => setCardPickerOpen(true)}
                    className="flex items-center space-x-1 bg-gold/15 hover:bg-gold text-gold hover:text-charcoal border border-gold/40 px-3 py-3 rounded-lg font-sans text-[11px] font-bold uppercase shrink-0 transition-all"
                  >
                    <ImageIcon size={12} />
                    <span>Gallery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputCardRef.current?.click()}
                    className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-3 rounded-lg font-sans text-[11px] font-bold uppercase shrink-0"
                  >
                    <Plus size={12} />
                    <span>Upload</span>
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>Hero Card Heading</label>
                <input
                  type="text"
                  value={heroState.hero_card_heading}
                  onChange={(e) => handleFieldChange('hero_card_heading', e.target.value)}
                  className={inpClass}
                  placeholder="We Craft the Future Dwelling"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className={labelClass}>CTA Button Text</label>
                  <input
                    type="text"
                    value={heroState.hero_card_cta_text}
                    onChange={(e) => handleFieldChange('hero_card_cta_text', e.target.value)}
                    className={inpClass}
                    placeholder="Our Projects"
                  />
                </div>

                <div>
                  <label className={labelClass}>CTA Button Link</label>
                  <input
                    type="text"
                    value={heroState.hero_card_cta_link}
                    onChange={(e) => handleFieldChange('hero_card_cta_link', e.target.value)}
                    className={inpClass}
                    placeholder="/projects"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between bg-[#0E0F11] border border-white/5 p-4 rounded-xl">
                <div>
                  <span className="font-sans text-xs font-bold text-white block">CTA Button Visibility</span>
                  <span className="font-sans text-[11px] text-white/40">Toggle ON/OFF to show or hide the CTA button on the card.</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleFieldChange('hero_card_cta_visible', !heroState.hero_card_cta_visible)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                    heroState.hero_card_cta_visible ? 'bg-gold' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      heroState.hero_card_cta_visible ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 3: HERO STATISTICS CARDS */}
          <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="font-editorial text-xl font-bold text-white flex items-center space-x-2">
                  <Sliders size={18} className="text-gold" />
                  <span>Hero Statistics Cards (Lower Right)</span>
                </h2>
                <p className="font-sans text-xs text-white/40 mt-0.5">Manage value, label, visibility, and order for the three stat counter badges.</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Stat Card 1 */}
              <div className="bg-[#0E0F11] border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="font-sans text-xs font-bold text-gold uppercase tracking-wider">Statistic 01</span>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="font-sans text-[11px] text-white/50">Visible:</span>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('hero_stat1_visible', !heroState.hero_stat1_visible)}
                      className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${
                        heroState.hero_stat1_visible ? 'bg-gold' : 'bg-white/10'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        heroState.hero_stat1_visible ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Value</label>
                    <input
                      type="text"
                      value={heroState.hero_stat1_value}
                      onChange={(e) => handleFieldChange('hero_stat1_value', e.target.value)}
                      className={inpClass}
                      placeholder="25+"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Label</label>
                    <input
                      type="text"
                      value={heroState.hero_stat1_label}
                      onChange={(e) => handleFieldChange('hero_stat1_label', e.target.value)}
                      className={inpClass}
                      placeholder="Projects Completed"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Display Order</label>
                    <input
                      type="number"
                      value={heroState.hero_stat1_order}
                      onChange={(e) => handleFieldChange('hero_stat1_order', e.target.value)}
                      className={inpClass}
                      placeholder="1"
                    />
                  </div>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-[#0E0F11] border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="font-sans text-xs font-bold text-gold uppercase tracking-wider">Statistic 02</span>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="font-sans text-[11px] text-white/50">Visible:</span>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('hero_stat2_visible', !heroState.hero_stat2_visible)}
                      className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${
                        heroState.hero_stat2_visible ? 'bg-gold' : 'bg-white/10'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        heroState.hero_stat2_visible ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Value</label>
                    <input
                      type="text"
                      value={heroState.hero_stat2_value}
                      onChange={(e) => handleFieldChange('hero_stat2_value', e.target.value)}
                      className={inpClass}
                      placeholder="1 Year"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Label</label>
                    <input
                      type="text"
                      value={heroState.hero_stat2_label}
                      onChange={(e) => handleFieldChange('hero_stat2_label', e.target.value)}
                      className={inpClass}
                      placeholder="Since 2025"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Display Order</label>
                    <input
                      type="number"
                      value={heroState.hero_stat2_order}
                      onChange={(e) => handleFieldChange('hero_stat2_order', e.target.value)}
                      className={inpClass}
                      placeholder="2"
                    />
                  </div>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-[#0E0F11] border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="font-sans text-xs font-bold text-gold uppercase tracking-wider">Statistic 03</span>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="font-sans text-[11px] text-white/50">Visible:</span>
                    <button
                      type="button"
                      onClick={() => handleFieldChange('hero_stat3_visible', !heroState.hero_stat3_visible)}
                      className={`w-9 h-5 rounded-full relative transition-colors duration-200 ${
                        heroState.hero_stat3_visible ? 'bg-gold' : 'bg-white/10'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        heroState.hero_stat3_visible ? 'translate-x-4.5' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Value</label>
                    <input
                      type="text"
                      value={heroState.hero_stat3_value}
                      onChange={(e) => handleFieldChange('hero_stat3_value', e.target.value)}
                      className={inpClass}
                      placeholder="40+"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Label</label>
                    <input
                      type="text"
                      value={heroState.hero_stat3_label}
                      onChange={(e) => handleFieldChange('hero_stat3_label', e.target.value)}
                      className={inpClass}
                      placeholder="Years of Family Legacy"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Display Order</label>
                    <input
                      type="number"
                      value={heroState.hero_stat3_order}
                      onChange={(e) => handleFieldChange('hero_stat3_order', e.target.value)}
                      className={inpClass}
                      placeholder="3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: INTRO & HERITAGE SHOWCASE ("From Concept to Handover") */}
          <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="font-editorial text-xl font-bold text-white flex items-center space-x-2">
                  <Sliders size={18} className="text-gold" />
                  <span>Homepage Intro Section ("From Concept to Handover")</span>
                </h2>
                <p className="font-sans text-xs text-white/40 mt-0.5">Manage heading, description paragraph, and "Our Story ↗ / Read More ↗" button.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Section Main Heading</label>
                <textarea
                  rows={2}
                  value={heroState.intro_heading}
                  onChange={(e) => handleFieldChange('intro_heading', e.target.value)}
                  className={`${inpClass} resize-none`}
                  placeholder="From Concept to Handover — ESPACIO Delivers Complete Interiors."
                />
              </div>

              <div>
                <label className={labelClass}>Description Paragraph</label>
                <textarea
                  rows={3}
                  value={heroState.intro_description}
                  onChange={(e) => handleFieldChange('intro_description', e.target.value)}
                  className={`${inpClass} resize-none`}
                  placeholder="We bring 40+ years of family construction heritage to luxury interior design..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Button Text 1 (Primary)</label>
                  <input
                    type="text"
                    value={heroState.intro_cta_text1}
                    onChange={(e) => handleFieldChange('intro_cta_text1', e.target.value)}
                    className={inpClass}
                    placeholder="Our Story ↗"
                  />
                </div>

                <div>
                  <label className={labelClass}>Button Text 2 (Hover)</label>
                  <input
                    type="text"
                    value={heroState.intro_cta_text2}
                    onChange={(e) => handleFieldChange('intro_cta_text2', e.target.value)}
                    className={inpClass}
                    placeholder="Read More ↗"
                  />
                </div>

                <div>
                  <label className={labelClass}>Button Link Destination</label>
                  <input
                    type="text"
                    value={heroState.intro_cta_link}
                    onChange={(e) => handleFieldChange('intro_cta_link', e.target.value)}
                    className={inpClass}
                    placeholder="/about"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5: MAIN HOMEPAGE STATS GRID (25+, 100+, 40+) */}
          <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="font-editorial text-xl font-bold text-white flex items-center space-x-2">
                  <Sliders size={18} className="text-gold" />
                  <span>Homepage Main Stats Grid (25+, 100+, 40+)</span>
                </h2>
                <p className="font-sans text-xs text-white/40 mt-0.5">Manage counters and labels for the 3-column stats cards below the intro section.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Stat 1 */}
              <div className="bg-[#0E0F11] border border-white/10 rounded-xl p-4 space-y-3">
                <span className="font-sans text-xs font-bold text-gold uppercase tracking-wider block">Grid Stat 01</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Value</label>
                    <input
                      type="text"
                      value={heroState.grid_stat1_val}
                      onChange={(e) => handleFieldChange('grid_stat1_val', e.target.value)}
                      className={inpClass}
                      placeholder="25+"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Label</label>
                    <input
                      type="text"
                      value={heroState.grid_stat1_label}
                      onChange={(e) => handleFieldChange('grid_stat1_label', e.target.value)}
                      className={inpClass}
                      placeholder="Projects Completed"
                    />
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-[#0E0F11] border border-white/10 rounded-xl p-4 space-y-3">
                <span className="font-sans text-xs font-bold text-gold uppercase tracking-wider block">Grid Stat 02</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Value</label>
                    <input
                      type="text"
                      value={heroState.grid_stat2_val}
                      onChange={(e) => handleFieldChange('grid_stat2_val', e.target.value)}
                      className={inpClass}
                      placeholder="100+"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Label</label>
                    <input
                      type="text"
                      value={heroState.grid_stat2_label}
                      onChange={(e) => handleFieldChange('grid_stat2_label', e.target.value)}
                      className={inpClass}
                      placeholder="Happy Clients (including materials clients)"
                    />
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bg-[#0E0F11] border border-white/10 rounded-xl p-4 space-y-3">
                <span className="font-sans text-xs font-bold text-gold uppercase tracking-wider block">Grid Stat 03</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Value</label>
                    <input
                      type="text"
                      value={heroState.grid_stat3_val}
                      onChange={(e) => handleFieldChange('grid_stat3_val', e.target.value)}
                      className={inpClass}
                      placeholder="40+"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Label</label>
                    <input
                      type="text"
                      value={heroState.grid_stat3_label}
                      onChange={(e) => handleFieldChange('grid_stat3_label', e.target.value)}
                      className={inpClass}
                      placeholder="Years Combined Legacy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6: SHOWCASE CAROUSEL SLIDES ("From Concept to Handover" Card) */}
          <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="font-editorial text-xl font-bold text-white flex items-center space-x-2">
                  <ImageIcon size={18} className="text-gold" />
                  <span>Showcase Carousel Images & Badges</span>
                </h2>
                <p className="font-sans text-xs text-white/40 mt-0.5">Manage the luxury interior images and project labels for the "From Concept to Handover" slider card.</p>
              </div>
            </div>

            <div className="space-y-4">
              {(heroState.showcase_slides || []).map((slide, idx) => (
                <div key={idx} className="bg-[#0E0F11] border border-white/10 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-xs font-bold text-gold uppercase tracking-wider">Slide 0{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (heroState.showcase_slides || []).filter((_, i) => i !== idx);
                        handleFieldChange('showcase_slides', updated);
                      }}
                      className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg text-xs flex items-center space-x-1"
                    >
                      <Trash2 size={13} />
                      <span>Remove Slide</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                    <div className="md:col-span-3">
                      {slide.projectImg && (
                        <img src={slide.projectImg} alt={`Slide ${idx+1}`} className="w-full aspect-[16/10] object-cover rounded-lg border border-white/10" />
                      )}
                    </div>

                    <div className="md:col-span-9 space-y-3">
                      <div>
                        <label className={labelClass}>Image URL</label>
                        <input
                          type="text"
                          value={slide.projectImg || ''}
                          onChange={(e) => {
                            const updated = [...(heroState.showcase_slides || [])];
                            updated[idx] = { ...updated[idx], projectImg: e.target.value };
                            handleFieldChange('showcase_slides', updated);
                          }}
                          className={inpClass}
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Project Badge Label</label>
                        <input
                          type="text"
                          value={slide.projectLabel || ''}
                          onChange={(e) => {
                            const updated = [...(heroState.showcase_slides || [])];
                            updated[idx] = { ...updated[idx], projectLabel: e.target.value };
                            handleFieldChange('showcase_slides', updated);
                          }}
                          className={inpClass}
                          placeholder="e.g. Banjara Hills Villa"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => {
                  const updated = [
                    ...(heroState.showcase_slides || []),
                    {
                      projectImg: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
                      projectLabel: "New Showcase Project"
                    }
                  ];
                  handleFieldChange('showcase_slides', updated);
                }}
                className="flex items-center space-x-2 text-gold text-xs font-sans font-bold uppercase pt-2"
              >
                <Plus size={14} />
                <span>Add Showcase Slide</span>
              </button>
            </div>
          </div>

          {/* SECTION 7: HOME CTA SECTION */}
          <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8">
            <CTASectionEditor pageKey="home" pageTitle="Home" />
          </div>
        </div>

        {/* Live Website Component Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-20 bg-[#141518] border border-white/5 rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold flex items-center space-x-1.5">
                <Eye size={12} />
                <span>Live Hero Preview</span>
              </span>
              <span className="text-[10px] font-sans text-white/30">Real-time CMS data binding</span>
            </div>

            {/* Preview Card Mock Container */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
              {/* Background Image Preview */}
              <img
                src={heroBgPreview}
                alt="Background Preview"
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Floating Feature Card Preview */}
              <div className="absolute bottom-3 left-3 w-[65%] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 shadow-xl">
                <img
                  src={cardImgPreview}
                  alt="Thumbnail"
                  className="w-full aspect-[16/9] object-cover rounded-lg mb-2 border border-white/10"
                />
                <h3 className="font-display text-xs font-bold text-white leading-tight mb-2">
                  {heroState.hero_card_heading || 'We Craft the Future Dwelling'}
                </h3>
                {heroState.hero_card_cta_visible && (
                  <div className="inline-flex items-center space-x-1 bg-white/20 text-white font-sans text-[9px] font-bold px-2.5 py-1 rounded-full border border-white/30">
                    <span>{heroState.hero_card_cta_text || 'Our Projects'}</span>
                    <ArrowUpRight size={10} />
                  </div>
                )}
              </div>

              {/* Statistics Cards Preview */}
              <div className="absolute bottom-3 right-3 flex flex-col space-y-1.5 items-end">
                {activeStats.map((s, i) => (
                  <div
                    key={i}
                    className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-2.5 py-1 text-right max-w-[90px]"
                  >
                    <span className="font-display text-xs font-bold text-white block leading-none">{s.val}</span>
                    <span className="font-sans text-[7px] text-white/70 uppercase tracking-tight block truncate">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/5 font-sans text-[11px] text-white/40 leading-relaxed">
              <p className="flex items-center text-emerald-400 font-bold space-x-1">
                <Check size={12} />
                <span>Connected to Public Homepage</span>
              </p>
              <p>Saving changes updates <code className="text-gold">Home.jsx</code> in real time via live CMS listeners.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Media Picker Modal for Background Slider */}
      <MediaPickerModal
        isOpen={bgPickerOpen}
        onClose={() => setBgPickerOpen(false)}
        multiple={true}
        initialSelection={heroState.hero_bg_images || []}
        title="Select Hero Background Carousel Images"
        onSelect={(selectedUrls) => {
          if (Array.isArray(selectedUrls) && selectedUrls.length > 0) {
            handleFieldChange('hero_bg_images', selectedUrls);
          }
        }}
      />

      {/* Media Picker Modal for Feature Card Photo */}
      <MediaPickerModal
        isOpen={cardPickerOpen}
        onClose={() => setCardPickerOpen(false)}
        multiple={false}
        initialSelection={heroState.hero_card_image || ''}
        title="Select Feature Card Custom Photo"
        onSelect={(selectedUrl) => {
          if (typeof selectedUrl === 'string') {
            handleFieldChange('hero_card_image', selectedUrl);
          }
        }}
      />
    </div>
  );
};

export default AdminHomeHeroCMS;
