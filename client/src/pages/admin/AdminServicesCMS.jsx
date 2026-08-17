import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Package, Save, CheckCircle, Loader2, Plus, Trash2,
  Eye, Sliders, ArrowUpRight, Check, ImageIcon, ArrowUp, ArrowDown,
  Layers, CheckCircle2, Edit3, X
} from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS } from '../../utils/cmsStore';

const defaultHeroImages = [
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1920&q=90',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90',
  'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1920&q=90',
  'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1920&q=90'
];

const defaultServices = [
  { 
    num: '01', 
    title: 'Full Home Interior Design & Execution', 
    tag: 'Turnkey Design & Build', 
    desc: "From concept to handover, we design and build your home end-to-end — delivered turnkey, so you're never juggling multiple vendors or contractors.", 
    includes: ['Living & Dining Design', 'Bedroom & Wardrobe Systems', 'Modular Kitchen Layouts', 'Ceilings & Ambient Lighting', 'Material & Texture Curation', 'Turnkey Project Execution'], 
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    ctaText: 'Enquire About This',
    ctaLink: '/contact',
    ctaVisible: true,
    visible: true,
    order: 1
  },
  { 
    num: '02', 
    title: 'Commercial Interiors', 
    tag: 'Workspaces & Retail', 
    desc: 'Interior design and fit-out for offices, retail, and commercial spaces, delivered turnkey with a single team managing design, materials, and execution from start to finish.', 
    includes: ['Office Layout Optimization', 'Retail Flow Planning', 'Conference & Meeting Rooms', 'Ergonomic Workstations', 'AV & Tech Integration', 'Turnkey Construction'], 
    img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=90',
    ctaText: 'Enquire About This',
    ctaLink: '/contact',
    ctaVisible: true,
    visible: true,
    order: 2
  },
  { 
    num: '03', 
    title: 'Styling & Decor', 
    tag: 'Curated Styling', 
    desc: 'Curated styling, accessories, and finishing touches that bring a space to life — offered as a standalone service or as the final turnkey step on any Espacio project.', 
    includes: ['Art & Wall Decor Curation', 'Custom Soft Furnishings', 'Lighting & Accessory Styling', 'Plants & Greenery Selection', 'Color Palette Harmony', 'Bespoke Styling Audits'], 
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
    ctaText: 'Enquire About This',
    ctaLink: '/contact',
    ctaVisible: true,
    visible: true,
    order: 3
  },
  { 
    num: '04', 
    title: 'Renovation', 
    tag: 'Upgrade Existing Spaces', 
    desc: 'Redesigning and upgrading existing spaces, residential or commercial, without starting from scratch — delivered turnkey, with design, materials, and execution handled entirely by us.', 
    includes: ['Kitchen & Bath Upgrades', 'Living Space Redesign', 'Structural Alterations', 'Flooring Replacement', 'Electrical & Plumbing Re-lay', 'Turnkey Execution'], 
    img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80',
    ctaText: 'Enquire About This',
    ctaLink: '/contact',
    ctaVisible: true,
    visible: true,
    order: 4
  },
  { 
    num: '05', 
    title: 'Materials Supply (Sold Separately)', 
    tag: 'Premium Sourced Supply', 
    desc: 'We source globally to bring you WPC wall & ceiling panels, polygranite sheets, and more warehoused in our own godowns for faster availability. Note: Materials are also sold separately from our design and execution services, you can purchase materials on their own, without booking a full project with us.', 
    includes: ['WPC Wall & Ceiling Panels', 'Polygranite & Acrylic Sheets', 'Fluted & Charcoal Louvers', 'Bespoke Wall Finishes', 'Stand-alone Purchasing', 'Fast Delivery from Godowns'], 
    img: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=900&q=80',
    ctaText: 'Enquire About This',
    ctaLink: '/contact',
    ctaVisible: true,
    visible: true,
    order: 5
  }
];

const getNonEmpty = (val, fallback) => (val && typeof val === 'string' && val.trim().length > 0 ? val : fallback);

const AdminServicesCMS = () => {
  const [activeTab, setActiveTab] = useState('list'); // Default to 'list' so services are immediately editable
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedServiceIdx, setSelectedServiceIdx] = useState(0);

  const fileInputHeroRef = useRef(null);
  const fileInputServiceRef = useRef(null);

  // CMS State
  const [heroState, setHeroState] = useState({
    services_hero_badge: 'Services',
    services_hero_title: 'Our Services',
    services_hero_subtitle: 'Turnkey design and build with engineering tolerances. No templates. No hidden package tricks.',
    services_hero_images: defaultHeroImages,
    services_hero_visible: true
  });

  const [servicesList, setServicesList] = useState(defaultServices);

  useEffect(() => {
    const fetchCMSData = async () => {
      const storedSettings = getCMSData(STORAGE_KEYS.SETTINGS);
      if (storedSettings) {
        setHeroState({
          services_hero_badge: getNonEmpty(storedSettings.services_hero_badge, 'Services'),
          services_hero_title: getNonEmpty(storedSettings.services_hero_title, 'Our Services'),
          services_hero_subtitle: getNonEmpty(storedSettings.services_hero_subtitle, 'Turnkey design and build with engineering tolerances. No templates. No hidden package tricks.'),
          services_hero_images: (Array.isArray(storedSettings.services_hero_images) && storedSettings.services_hero_images.length > 0)
            ? storedSettings.services_hero_images
            : defaultHeroImages,
          services_hero_visible: storedSettings.services_hero_visible !== false
        });

        if (Array.isArray(storedSettings.services_list) && storedSettings.services_list.length > 0) {
          setServicesList(storedSettings.services_list);
        }
      }
      try {
        const res = await axios.get('/settings');
        if (res.data.success && res.data.data) {
          const d = res.data.data;
          setHeroState((prev) => ({
            ...prev,
            services_hero_badge: getNonEmpty(d.services_hero_badge, prev.services_hero_badge),
            services_hero_title: getNonEmpty(d.services_hero_title, prev.services_hero_title),
            services_hero_subtitle: getNonEmpty(d.services_hero_subtitle, prev.services_hero_subtitle),
            services_hero_images: (Array.isArray(d.services_hero_images) && d.services_hero_images.length > 0) ? d.services_hero_images : prev.services_hero_images
          }));
          if (Array.isArray(d.services_list) && d.services_list.length > 0) {
            setServicesList(d.services_list);
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

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    const updatedSettings = {
      ...existing,
      ...heroState,
      services_list: servicesList
    };

    try {
      await axios.put('/settings', updatedSettings);
    } catch (err) {
      console.warn('Database sync offline, updated in local CMS store.');
    }

    setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);
    setSaving(false);
    setSaved(true);
    showNotification('Services page updated successfully.');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleHeroChange = (key, val) => {
    setHeroState((prev) => {
      const updated = { ...prev, [key]: val };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...updated, services_list: servicesList });
      return updated;
    });
  };

  const handleServiceChange = (idx, key, val) => {
    setServicesList((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [key]: val };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...heroState, services_list: updated });
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

  const handleAddService = () => {
    const nextNum = String(servicesList.length + 1).padStart(2, '0');
    const newService = {
      num: nextNum,
      title: 'New Custom Service',
      tag: 'Bespoke Offering',
      desc: 'Detailed description of your new custom interior or engineering service.',
      includes: ['Feature Item 01', 'Feature Item 02', 'Feature Item 03'],
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
      ctaText: 'Enquire About This',
      ctaLink: '/contact',
      ctaVisible: true,
      visible: true,
      order: servicesList.length + 1
    };
    setServicesList((prev) => [...prev, newService]);
    setSelectedServiceIdx(servicesList.length);
    showNotification('New service added to list.');
  };

  const handleDeleteService = (idx) => {
    if (servicesList.length <= 1) {
      alert('You must keep at least one service record.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${servicesList[idx].title}"?`)) {
      setServicesList((prev) => prev.filter((_, i) => i !== idx));
      setSelectedServiceIdx(0);
      showNotification('Service removed.');
    }
  };

  const handleMoveService = (idx, direction) => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === servicesList.length - 1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...servicesList];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setServicesList(updated);
    setSelectedServiceIdx(targetIdx);
  };

  const inpClass = "w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 transition-all";
  const labelClass = "font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-white/50">
        <Loader2 size={24} className="animate-spin text-gold mr-3" />
        <span className="font-sans text-xs font-bold uppercase tracking-widest">Loading Services CMS...</span>
      </div>
    );
  }

  const currentService = servicesList[selectedServiceIdx] || servicesList[0];

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
          <h1 className="font-editorial text-3xl font-bold text-white">Services Page CMS</h1>
          <p className="font-sans text-xs text-white/40 mt-1">
            Manage live Services Hero banner text/carousel photos and full list of Service section cards.
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
              <span>Services Published Live!</span>
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
          <Package size={16} />
          <span>Edit Services List ({servicesList.length} Cards)</span>
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-md ${
            activeTab === 'hero'
              ? 'bg-gold text-charcoal border border-gold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
              : 'bg-[#141518] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          <ImageIcon size={16} />
          <span>Edit Services Hero Banner</span>
        </button>
      </div>

      {/* TAB 1: SERVICES HERO EDITOR */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="font-editorial text-xl font-bold text-white flex items-center space-x-2">
                <Sliders size={18} className="text-gold" />
                <span>Services Hero Banner Content</span>
              </h2>
              <p className="font-sans text-xs text-white/40 mt-0.5">Edit headline, badge pill tag, subtitle description, and background photos.</p>
            </div>

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputHeroRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, (dataUrl) => {
                const updated = [dataUrl, ...(heroState.services_hero_images || [])];
                handleHeroChange('services_hero_images', updated);
              })}
            />

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Badge / Eyebrow Pill Tag</label>
                <input
                  type="text"
                  value={heroState.services_hero_badge}
                  onChange={(e) => handleHeroChange('services_hero_badge', e.target.value)}
                  className={inpClass}
                  placeholder="Services"
                />
              </div>

              <div>
                <label className={labelClass}>Hero Main Title</label>
                <input
                  type="text"
                  value={heroState.services_hero_title}
                  onChange={(e) => handleHeroChange('services_hero_title', e.target.value)}
                  className={inpClass}
                  placeholder="Our Services"
                />
              </div>

              <div>
                <label className={labelClass}>Hero Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={heroState.services_hero_subtitle}
                  onChange={(e) => handleHeroChange('services_hero_subtitle', e.target.value)}
                  className={`${inpClass} resize-none`}
                  placeholder="Turnkey design and build with engineering tolerances..."
                />
              </div>

              {/* Hero Carousel Images */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className={labelClass}>Background Carousel Image URLs</label>
                  <button
                    type="button"
                    onClick={() => fileInputHeroRef.current?.click()}
                    className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg font-sans text-[11px] font-bold uppercase transition-all"
                  >
                    <Plus size={12} />
                    <span>Upload Image File</span>
                  </button>
                </div>

                {(heroState.services_hero_images || []).map((imgUrl, i) => (
                  <div key={i} className="flex items-center space-x-2 bg-[#0E0F11] border border-white/10 p-2 rounded-xl">
                    {imgUrl && (
                      <img src={imgUrl} alt={`Hero ${i+1}`} className="w-12 h-10 object-cover rounded-lg shrink-0 border border-white/10" />
                    )}
                    <input
                      type="text"
                      value={imgUrl}
                      onChange={(e) => {
                        const updated = [...(heroState.services_hero_images || [])];
                        updated[i] = e.target.value;
                        handleHeroChange('services_hero_images', updated);
                      }}
                      className={inpClass}
                      placeholder="https://images.unsplash.com/..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (heroState.services_hero_images || []).filter((_, idx) => idx !== i);
                        handleHeroChange('services_hero_images', updated);
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
                      ...(heroState.services_hero_images || []),
                      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1920&q=90'
                    ];
                    handleHeroChange('services_hero_images', updated);
                  }}
                  className="flex items-center space-x-2 text-gold text-xs font-sans font-bold uppercase pt-1"
                >
                  <Plus size={14} />
                  <span>Add Unsplash Image URL</span>
                </button>
              </div>

              {/* Hero Visibility */}
              <div className="pt-2 flex items-center justify-between bg-[#0E0F11] border border-white/5 p-4 rounded-xl">
                <div>
                  <span className="font-sans text-xs font-bold text-white block">Hero Banner Visibility</span>
                  <span className="font-sans text-[11px] text-white/40">Toggle ON/OFF to show or hide the top hero banner on /services.</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleHeroChange('services_hero_visible', !heroState.services_hero_visible)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                    heroState.services_hero_visible ? 'bg-gold' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      heroState.services_hero_visible ? 'translate-x-7' : 'translate-x-1'
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
                  <span>Services Hero Preview</span>
                </span>
                <span className="text-[10px] font-sans text-white/30">Real-time binding</span>
              </div>

              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <img
                  src={heroState.services_hero_images?.[0] || defaultHeroImages[0]}
                  alt="Hero Preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
                  <div className="inline-flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                    <span className="font-sans text-[9px] uppercase tracking-widest font-bold">{heroState.services_hero_badge || 'Services'}</span>
                  </div>
                  <h2 className="font-display text-xl font-bold leading-tight">{heroState.services_hero_title || 'Our Services'}</h2>
                  <p className="font-sans text-[11px] text-white/70 line-clamp-2">{heroState.services_hero_subtitle}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL SERVICES MANAGER */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Service Selector List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-white/60">Services List</span>
              <button
                type="button"
                onClick={handleAddService}
                className="flex items-center space-x-1 bg-gold/15 text-gold border border-gold/30 hover:bg-gold hover:text-charcoal px-3 py-1.5 rounded-lg font-sans text-xs font-bold uppercase transition-all"
              >
                <Plus size={13} />
                <span>Add Service</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {servicesList.map((service, idx) => {
                const isSelected = idx === selectedServiceIdx;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedServiceIdx(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-gold/15 border-gold/40 shadow-lg'
                        : 'bg-[#141518] border-white/5 hover:border-white/20 hover:bg-white/2'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <span className="font-sans text-xs font-bold text-gold">{String(idx + 1).padStart(2, '0')}</span>
                      <div className="truncate">
                        <h4 className="font-sans text-xs font-bold text-white truncate">{service.title}</h4>
                        <span className="font-sans text-[10px] text-white/40 uppercase tracking-widest block truncate">{service.tag}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleMoveService(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-white/30 hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveService(idx, 'down')}
                        disabled={idx === servicesList.length - 1}
                        className="p-1 text-white/30 hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(idx)}
                        className="p-1 text-red-400/40 hover:text-red-400"
                        title="Delete Service"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Service Editor */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <span className="font-sans text-[10px] font-bold text-gold uppercase tracking-widest">Editing Service {String(selectedServiceIdx + 1).padStart(2, '0')}</span>
                  <h3 className="font-editorial text-2xl font-bold text-white">{currentService.title}</h3>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-sans text-xs text-white/40">Visible:</span>
                  <button
                    type="button"
                    onClick={() => handleServiceChange(selectedServiceIdx, 'visible', !(currentService.visible !== false))}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                      currentService.visible !== false ? 'bg-gold' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        currentService.visible !== false ? 'translate-x-5.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Hidden File Input for Service Cover */}
              <input
                type="file"
                ref={fileInputServiceRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, (dataUrl) => {
                  handleServiceChange(selectedServiceIdx, 'img', dataUrl);
                })}
              />

              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Category / Eyebrow (e.g. TURNKEY DESIGN & BUILD)</label>
                  <input
                    type="text"
                    value={currentService.tag || ''}
                    onChange={(e) => handleServiceChange(selectedServiceIdx, 'tag', e.target.value)}
                    className={inpClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Service Title</label>
                  <input
                    type="text"
                    value={currentService.title || ''}
                    onChange={(e) => handleServiceChange(selectedServiceIdx, 'title', e.target.value)}
                    className={inpClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Service Description</label>
                  <textarea
                    rows={3}
                    value={currentService.desc || ''}
                    onChange={(e) => handleServiceChange(selectedServiceIdx, 'desc', e.target.value)}
                    className={`${inpClass} resize-none`}
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className={labelClass}>Cover Image</label>
                  <div className="flex items-center space-x-3">
                    {currentService.img && (
                      <img src={currentService.img} alt="Cover" className="w-20 h-14 object-cover rounded-lg border border-white/10 shrink-0" />
                    )}
                    <input
                      type="text"
                      value={currentService.img || ''}
                      onChange={(e) => handleServiceChange(selectedServiceIdx, 'img', e.target.value)}
                      className={inpClass}
                      placeholder="https://images.unsplash.com/..."
                    />
                    <button
                      type="button"
                      onClick={() => fileInputServiceRef.current?.click()}
                      className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-3 rounded-lg font-sans text-[11px] font-bold uppercase shrink-0"
                    >
                      <Plus size={12} />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>

                {/* Features / Included Items */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Included Features / Bullet Points</label>
                    <button
                      type="button"
                      onClick={() => {
                        const updatedIncludes = [...(currentService.includes || []), 'New Included Feature'];
                        handleServiceChange(selectedServiceIdx, 'includes', updatedIncludes);
                      }}
                      className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg font-sans text-[10px] font-bold uppercase"
                    >
                      <Plus size={12} />
                      <span>Add Feature</span>
                    </button>
                  </div>

                  {(currentService.includes || []).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center space-x-2 bg-[#0E0F11] border border-white/10 p-2 rounded-xl">
                      <CheckCircle2 size={15} className="text-gold shrink-0 ml-1" />
                      <input
                        type="text"
                        value={feat}
                        onChange={(e) => {
                          const updated = [...(currentService.includes || [])];
                          updated[fIdx] = e.target.value;
                          handleServiceChange(selectedServiceIdx, 'includes', updated);
                        }}
                        className={inpClass}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (currentService.includes || []).filter((_, i) => i !== fIdx);
                          handleServiceChange(selectedServiceIdx, 'includes', updated);
                        }}
                        className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
                        title="Remove Feature"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* CTA Settings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className={labelClass}>CTA Button Text</label>
                    <input
                      type="text"
                      value={currentService.ctaText || 'Enquire About This'}
                      onChange={(e) => handleServiceChange(selectedServiceIdx, 'ctaText', e.target.value)}
                      className={inpClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>CTA Button Link</label>
                    <input
                      type="text"
                      value={currentService.ctaLink || '/contact'}
                      onChange={(e) => handleServiceChange(selectedServiceIdx, 'ctaLink', e.target.value)}
                      className={inpClass}
                    />
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

export default AdminServicesCMS;
