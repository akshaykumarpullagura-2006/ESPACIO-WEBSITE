import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Layers, Save, CheckCircle, Loader2, Plus, Trash2,
  Eye, Sliders, ArrowUpRight, Check, ImageIcon, ArrowUp, ArrowDown,
  CheckCircle2, SlidersHorizontal
} from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS } from '../../utils/cmsStore';

const defaultSlides = [
  {
    before: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=90',
    after: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=90',
    title: 'Living Rooms'
  },
  {
    before: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1920&q=90',
    after: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1920&q=90',
    title: 'Modular Kitchens'
  },
  {
    before: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=90',
    after: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1920&q=90',
    title: 'Master Bedrooms'
  }
];

const defaultSpacesCategories = [
  { 
    name: 'Modular Kitchen', 
    slug: 'modular-kitchen', 
    description: 'Precision-engineered kitchens with high-gloss acrylic, polygranite surfaces, and concealed lighting tracks.', 
    heroImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    visible: true,
    details: {
      tag: 'Precision-Engineered',
      headline: 'Kitchens Built Around the Way You Cook',
      body: 'Every ESPACIO modular kitchen is designed around your workflow — not the other way around. We use premium Hettich and Hafele hardware, soft-close mechanisms, and direct-sourced shutters.',
      includes: ['Layout & Workflow Planning', 'Island / Parallel / L-Shape / U-Shape', 'Premium Hardware (Hettich / Hafele)', 'Granite / Quartz / Sintered Countertops', 'Chimney & Appliance Integration', 'Backsplash Tiling', 'Soft-Close Shutters & Drawers', 'Under-Cabinet LED Lighting']
    }
  },
  { 
    name: 'Master Bedroom', 
    slug: 'master-bedroom', 
    description: 'Sanctuary interiors with walnut wood headboards, warm lighting zones, and bespoke built-in wardrobes.', 
    heroImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', 
    visible: true,
    details: {
      tag: 'Restful Luxury',
      headline: 'Your Bedroom, Designed for Deep Rest',
      body: 'We design bedrooms that are equal parts beautiful and functional — where the bed is the centrepiece and the storage is invisible.',
      includes: ['Custom Bed & Upholstered Headboard', 'Wardrobe & Walk-in Design', 'Bedside Niche & Shelf Units', 'Ambient & Task Lighting', 'False Ceiling with Cove Light']
    }
  },
  { 
    name: 'Living Room', 
    slug: 'living-room', 
    description: 'Editorial living zones crafted around natural light, marble accents, and low-profile custom furniture.', 
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', 
    visible: true,
    details: {
      tag: 'Curated Spaces',
      headline: 'Living Rooms That Make a Statement',
      body: 'A living room is the first thing guests experience and the last space you unwind in. We design living rooms that command attention.',
      includes: ['Feature Wall & Textured Panelling', 'Custom Sofa & Seating Configuration', 'TV Unit & Entertainment Wall', 'Pendant & Cove Lighting Design']
    }
  },
  { 
    name: 'Wardrobe Systems', 
    slug: 'wardrobes', 
    description: 'Bespoke floor-to-ceiling storage with velvet drawer linings, mirror panels, and hidden pull-out trays.', 
    heroImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', 
    visible: true,
    details: {
      tag: 'Organised Living',
      headline: 'Storage That Disappears Into the Design',
      body: 'Our wardrobes are engineered to give you more space while taking up less visual room. Floor-to-ceiling builds and walk-in dressing rooms.',
      includes: ['Sliding & Hinged Door Options', 'Walk-in Dressing Room Design', 'Custom Internal Organizers', 'Shoe Racks & Accessory Trays']
    }
  },
  { 
    name: 'Home Office', 
    slug: 'home-office', 
    description: 'Focus zones with sound-dampening fluted panels, ergonomic wall shelving and concealed cable management.', 
    heroImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', 
    visible: true,
    details: {
      tag: 'Focus First',
      headline: 'A Home Office Built for Deep Work',
      body: 'Your home office should reduce friction, not create it. We design distraction-free work zones with ergonomic desk setups.',
      includes: ['Ergonomic Desk & Chair Zone', 'Built-in Shelving & Storage', 'Concealed Cable Management', 'Fluted Acoustic Panels']
    }
  }
];

const getNonEmpty = (val, fallback) => (val && typeof val === 'string' && val.trim().length > 0 ? val : fallback);

const AdminSpacesCMS = () => {
  const [activeTab, setActiveTab] = useState('list'); // Default to 'list' for spaces manager
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedSpaceIdx, setSelectedSpaceIdx] = useState(0);

  const fileInputBeforeRef = useRef(null);
  const fileInputAfterRef = useRef(null);
  const fileInputSpaceCoverRef = useRef(null);

  // Spaces CMS State
  const [spacesHeroState, setSpacesHeroState] = useState({
    spaces_badge: 'Spaces',
    spaces_title: 'Bespoke Interior Spaces',
    spaces_subtitle: 'Interactive Before & After Transformation Explorer',
    spaces_before_label: 'BEFORE',
    spaces_after_label: 'AFTER',
    spaces_before_after_slides: defaultSlides,
    spaces_hero_visible: true
  });

  const [spacesList, setSpacesList] = useState(defaultSpacesCategories);

  useEffect(() => {
    const fetchCMSData = async () => {
      const storedSettings = getCMSData(STORAGE_KEYS.SETTINGS);
      if (storedSettings) {
        setSpacesHeroState({
          spaces_badge: getNonEmpty(storedSettings.spaces_badge, 'Spaces'),
          spaces_title: getNonEmpty(storedSettings.spaces_title, 'Bespoke Interior Spaces'),
          spaces_subtitle: getNonEmpty(storedSettings.spaces_subtitle, 'Interactive Before & After Transformation Explorer'),
          spaces_before_label: getNonEmpty(storedSettings.spaces_before_label, 'BEFORE'),
          spaces_after_label: getNonEmpty(storedSettings.spaces_after_label, 'AFTER'),
          spaces_before_after_slides: (Array.isArray(storedSettings.spaces_before_after_slides) && storedSettings.spaces_before_after_slides.length > 0)
            ? storedSettings.spaces_before_after_slides
            : defaultSlides,
          spaces_hero_visible: storedSettings.spaces_hero_visible !== false
        });

        if (Array.isArray(storedSettings.spaces_list) && storedSettings.spaces_list.length > 0) {
          setSpacesList(storedSettings.spaces_list);
        }
      }
      try {
        const res = await axios.get('/settings');
        if (res.data.success && res.data.data) {
          const d = res.data.data;
          setSpacesHeroState((prev) => ({
            ...prev,
            spaces_badge: getNonEmpty(d.spaces_badge, prev.spaces_badge),
            spaces_title: getNonEmpty(d.spaces_title, prev.spaces_title),
            spaces_subtitle: getNonEmpty(d.spaces_subtitle, prev.spaces_subtitle),
            spaces_before_label: getNonEmpty(d.spaces_before_label, prev.spaces_before_label),
            spaces_after_label: getNonEmpty(d.spaces_after_label, prev.spaces_after_label),
            spaces_before_after_slides: (Array.isArray(d.spaces_before_after_slides) && d.spaces_before_after_slides.length > 0)
              ? d.spaces_before_after_slides
              : prev.spaces_before_after_slides
          }));
          if (Array.isArray(d.spaces_list) && d.spaces_list.length > 0) {
            setSpacesList(d.spaces_list);
          }
        }
      } catch {}
      finally {
        setLoading(false);
      }
    };
    fetchCMSData();
  }, []);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleHeroChange = (key, val) => {
    setSpacesHeroState((prev) => {
      const updated = { ...prev, [key]: val };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...updated, spaces_list: spacesList });
      return updated;
    });
  };

  const handleSpaceChange = (idx, key, val) => {
    setSpacesList((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [key]: val };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...spacesHeroState, spaces_list: updated });
      return updated;
    });
  };

  const handleSpaceDetailChange = (idx, subKey, val) => {
    setSpacesList((prev) => {
      const updated = [...prev];
      const currentDetails = updated[idx].details || {};
      updated[idx] = {
        ...updated[idx],
        details: { ...currentDetails, [subKey]: val }
      };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...spacesHeroState, spaces_list: updated });
      return updated;
    });
  };

  const handleFileUpload = (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target?.result) {
        callback(evt.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    const updatedSettings = {
      ...existing,
      ...spacesHeroState,
      spaces_list: spacesList
    };

    try {
      await axios.put('/settings', updatedSettings);
    } catch (err) {
      console.warn('Database sync offline, updated in local CMS store.');
    }

    setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);
    setSaving(false);
    setSaved(true);
    showNotification('Spaces page updated successfully.');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddSpace = () => {
    const newSlug = `space-${Date.now().toString().slice(-4)}`;
    const newSpace = {
      name: 'New Custom Space',
      slug: newSlug,
      description: 'Detailed description of your new custom interior space domain.',
      heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      visible: true,
      details: {
        tag: 'Bespoke Domain',
        headline: 'Custom Tailored Interior Space',
        body: 'Detailed craftsmanship narrative for this custom interior space domain.',
        includes: ['Custom Layout Planning', 'Material Selection', 'Turnkey Execution']
      }
    };
    const updated = [...spacesList, newSpace];
    setSpacesList(updated);
    setSelectedSpaceIdx(spacesList.length);
    const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...spacesHeroState, spaces_list: updated });
    showNotification('New Space card added.');
  };

  const handleDeleteSpace = (idx) => {
    if (spacesList.length <= 1) {
      alert('You must keep at least one Space card record.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${spacesList[idx].name}"?`)) {
      const updated = spacesList.filter((_, i) => i !== idx);
      setSpacesList(updated);
      setSelectedSpaceIdx(0);
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...spacesHeroState, spaces_list: updated });
      showNotification('Space card removed.');
    }
  };

  const handleMoveSpace = (idx, direction) => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === spacesList.length - 1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...spacesList];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSpacesList(updated);
    setSelectedSpaceIdx(targetIdx);
    const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...spacesHeroState, spaces_list: updated });
  };

  const inpClass = "w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 transition-all";
  const labelClass = "font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-white/50">
        <Loader2 size={24} className="animate-spin text-gold mr-3" />
        <span className="font-sans text-xs font-bold uppercase tracking-widest">Loading Spaces CMS...</span>
      </div>
    );
  }

  const currentSpace = spacesList[selectedSpaceIdx] || spacesList[0];

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
          <h1 className="font-editorial text-3xl font-bold text-white">Spaces Page CMS</h1>
          <p className="font-sans text-xs text-white/40 mt-1">
            Manage live Before/After slider cards, hero headings, and full list of Space domain cards.
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
              <span>Spaces Published Live!</span>
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

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/5 pb-4">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-md ${
            activeTab === 'list'
              ? 'bg-gold text-charcoal border border-gold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
              : 'bg-[#141518] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          <Layers size={16} />
          <span>Edit Space Cards ({spacesList.length} Domains)</span>
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-md ${
            activeTab === 'hero'
              ? 'bg-gold text-charcoal border border-gold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
              : 'bg-[#141518] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          <SlidersHorizontal size={16} />
          <span>Before / After Hero Slider</span>
        </button>
      </div>

      {/* TAB 1: BEFORE/AFTER HERO SLIDER */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="font-editorial text-xl font-bold text-white flex items-center space-x-2">
                <Sliders size={18} className="text-gold" />
                <span>Spaces Hero & Before/After Slider Content</span>
              </h2>
              <p className="font-sans text-xs text-white/40 mt-0.5">Edit hero pill label, Before/After photos, and comparison labels.</p>
            </div>

            <div className="space-y-5">
              {/* Hidden File Inputs for Before & After */}
              <input
                type="file"
                ref={fileInputBeforeRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, (dataUrl) => handleHeroChange('spaces_before_image', dataUrl))}
              />
              <input
                type="file"
                ref={fileInputAfterRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, (dataUrl) => handleHeroChange('spaces_after_image', dataUrl))}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Before Badge Label</label>
                  <input
                    type="text"
                    value={spacesHeroState.spaces_before_label || 'BEFORE'}
                    onChange={(e) => handleHeroChange('spaces_before_label', e.target.value)}
                    className={inpClass}
                    placeholder="BEFORE"
                  />
                </div>
                <div>
                  <label className={labelClass}>After Badge Label</label>
                  <input
                    type="text"
                    value={spacesHeroState.spaces_after_label || 'AFTER'}
                    onChange={(e) => handleHeroChange('spaces_after_label', e.target.value)}
                    className={inpClass}
                    placeholder="AFTER"
                  />
                </div>
              </div>

              {/* Before Photo */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className={labelClass}>Before Transformation Image</label>
                <div className="flex items-center space-x-3">
                  <img
                    src={spacesHeroState.spaces_before_image || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=90'}
                    alt="Before"
                    className="w-20 h-14 object-cover rounded-lg border border-white/10 shrink-0"
                  />
                  <input
                    type="text"
                    value={spacesHeroState.spaces_before_image || ''}
                    onChange={(e) => handleHeroChange('spaces_before_image', e.target.value)}
                    className={inpClass}
                    placeholder="https://images.unsplash.com/..."
                  />
                  <button
                    type="button"
                    onClick={() => fileInputBeforeRef.current?.click()}
                    className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-3 rounded-lg font-sans text-[11px] font-bold uppercase shrink-0"
                  >
                    <Plus size={12} />
                    <span>Upload Before</span>
                  </button>
                </div>
              </div>

              {/* After Photo */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <label className={labelClass}>After Transformation Image</label>
                <div className="flex items-center space-x-3">
                  <img
                    src={spacesHeroState.spaces_after_image || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=90'}
                    alt="After"
                    className="w-20 h-14 object-cover rounded-lg border border-white/10 shrink-0"
                  />
                  <input
                    type="text"
                    value={spacesHeroState.spaces_after_image || ''}
                    onChange={(e) => handleHeroChange('spaces_after_image', e.target.value)}
                    className={inpClass}
                    placeholder="https://images.unsplash.com/..."
                  />
                  <button
                    type="button"
                    onClick={() => fileInputAfterRef.current?.click()}
                    className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-3 rounded-lg font-sans text-[11px] font-bold uppercase shrink-0"
                  >
                    <Plus size={12} />
                    <span>Upload After</span>
                  </button>
                </div>
              </div>

              {/* Hero Banner Visibility */}
              <div className="pt-2 flex items-center justify-between bg-[#0E0F11] border border-white/5 p-4 rounded-xl">
                <div>
                  <span className="font-sans text-xs font-bold text-white block">Hero Banner Visibility</span>
                  <span className="font-sans text-[11px] text-white/40">Toggle ON/OFF to show or hide the Before/After hero section on /what-we-do.</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleHeroChange('spaces_hero_visible', !spacesHeroState.spaces_hero_visible)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                    spacesHeroState.spaces_hero_visible ? 'bg-gold' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      spacesHeroState.spaces_hero_visible ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Hero Live Preview */}
          <div className="lg:col-span-5 space-y-4">
            <div className="sticky top-20 bg-[#141518] border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold flex items-center space-x-1.5">
                  <Eye size={12} />
                  <span>Spaces Hero Preview</span>
                </span>
                <span className="text-[10px] font-sans text-white/30">Real-time binding</span>
              </div>

              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <img
                  src={spacesHeroState.spaces_after_image || 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=90'}
                  alt="Hero Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute left-4 bottom-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-white">{spacesHeroState.spaces_before_label || 'BEFORE'}</span>
                </div>
                <div className="absolute right-4 bottom-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                  <span className="font-sans text-[10px] uppercase font-bold tracking-widest text-white">{spacesHeroState.spaces_after_label || 'AFTER'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SPACES CARDS MANAGER */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Space Selector List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-white/60">Space Domains List</span>
              <button
                type="button"
                onClick={handleAddSpace}
                className="flex items-center space-x-1 bg-gold/15 text-gold border border-gold/30 hover:bg-gold hover:text-charcoal px-3 py-1.5 rounded-lg font-sans text-xs font-bold uppercase transition-all"
              >
                <Plus size={13} />
                <span>Add Space</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
              {spacesList.map((space, idx) => {
                const isSelected = idx === selectedSpaceIdx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedSpaceIdx(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-gold/15 border-gold/40 shadow-lg'
                        : 'bg-[#141518] border-white/5 hover:border-white/20 hover:bg-white/2'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <span className="font-sans text-xs font-bold text-gold">{String(idx + 1).padStart(2, '0')}</span>
                      <div className="truncate">
                        <h4 className="font-sans text-xs font-bold text-white truncate">{space.name}</h4>
                        <span className="font-sans text-[10px] text-white/40 uppercase tracking-widest block truncate">{space.details?.tag || 'Space Domain'}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleMoveSpace(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-white/30 hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSpace(idx, 'down')}
                        disabled={idx === spacesList.length - 1}
                        className="p-1 text-white/30 hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSpace(idx)}
                        className="p-1 text-red-400/40 hover:text-red-400"
                        title="Delete Space"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Space Editor */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <span className="font-sans text-[10px] font-bold text-gold uppercase tracking-widest">
                    Editing Space {String(selectedSpaceIdx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-white">{currentSpace.name}</h3>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-sans text-xs text-white/40">Visible:</span>
                  <button
                    type="button"
                    onClick={() => handleSpaceChange(selectedSpaceIdx, 'visible', !(currentSpace.visible !== false))}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                      currentSpace.visible !== false ? 'bg-gold' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        currentSpace.visible !== false ? 'translate-x-5.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputSpaceCoverRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, (dataUrl) => {
                  handleSpaceChange(selectedSpaceIdx, 'heroImage', dataUrl);
                })}
              />

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Space Name / Title</label>
                    <input
                      type="text"
                      value={currentSpace.name || ''}
                      onChange={(e) => handleSpaceChange(selectedServiceIdx, 'name', e.target.value)}
                      className={inpClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Category Tag (e.g. Precision-Engineered)</label>
                    <input
                      type="text"
                      value={currentSpace.details?.tag || ''}
                      onChange={(e) => handleSpaceDetailChange(selectedSpaceIdx, 'tag', e.target.value)}
                      className={inpClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Short Description (Shown on Grid Card)</label>
                  <textarea
                    rows={2}
                    value={currentSpace.description || ''}
                    onChange={(e) => handleSpaceChange(selectedSpaceIdx, 'description', e.target.value)}
                    className={`${inpClass} resize-none`}
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className={labelClass}>Space Cover Image</label>
                  <div className="flex items-center space-x-3">
                    {currentSpace.heroImage && (
                      <img src={currentSpace.heroImage} alt="Cover" className="w-20 h-14 object-cover rounded-lg border border-white/10 shrink-0" />
                    )}
                    <input
                      type="text"
                      value={currentSpace.heroImage || ''}
                      onChange={(e) => handleSpaceChange(selectedSpaceIdx, 'heroImage', e.target.value)}
                      className={inpClass}
                      placeholder="https://images.unsplash.com/..."
                    />
                    <button
                      type="button"
                      onClick={() => fileInputSpaceCoverRef.current?.click()}
                      className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-3 rounded-lg font-sans text-[11px] font-bold uppercase shrink-0"
                    >
                      <Plus size={12} />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>

                {/* Detailed Page Headline & Narrative */}
                <div className="space-y-4 pt-2 border-t border-white/5">
                  <span className="font-sans text-xs font-bold text-gold uppercase tracking-wider block">Detailed Inner Domain Page Content</span>
                  
                  <div>
                    <label className={labelClass}>Detail Headline (e.g. Kitchens Built Around the Way You Cook)</label>
                    <input
                      type="text"
                      value={currentSpace.details?.headline || ''}
                      onChange={(e) => handleSpaceDetailChange(selectedSpaceIdx, 'headline', e.target.value)}
                      className={inpClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Detail Body Narrative</label>
                    <textarea
                      rows={3}
                      value={currentSpace.details?.body || ''}
                      onChange={(e) => handleSpaceDetailChange(selectedSpaceIdx, 'body', e.target.value)}
                      className={`${inpClass} resize-none`}
                    />
                  </div>

                  {/* Included Items */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className={labelClass}>What's Included Bullet Points</label>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...(currentSpace.details?.includes || []), 'New Included Feature'];
                          handleSpaceDetailChange(selectedSpaceIdx, 'includes', updated);
                        }}
                        className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg font-sans text-[10px] font-bold uppercase"
                      >
                        <Plus size={12} />
                        <span>Add Bullet Point</span>
                      </button>
                    </div>

                    {(currentSpace.details?.includes || []).map((item, fIdx) => (
                      <div key={fIdx} className="flex items-center space-x-2 bg-[#0E0F11] border border-white/10 p-2 rounded-xl">
                        <CheckCircle2 size={15} className="text-gold shrink-0 ml-1" />
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => {
                            const updated = [...(currentSpace.details?.includes || [])];
                            updated[fIdx] = e.target.value;
                            handleSpaceDetailChange(selectedSpaceIdx, 'includes', updated);
                          }}
                          className={inpClass}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (currentSpace.details?.includes || []).filter((_, i) => i !== fIdx);
                            handleSpaceDetailChange(selectedSpaceIdx, 'includes', updated);
                          }}
                          className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
                          title="Remove Bullet Point"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSpacesCMS;
