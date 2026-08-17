import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Package, Save, CheckCircle, Loader2, Plus, Trash2,
  Eye, Sliders, ArrowRight, ArrowUp, ArrowDown,
  CheckCircle2, Search, SlidersHorizontal, Image as ImageIcon, Lock, Unlock
} from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS } from '../../utils/cmsStore';

const defaultMaterialsHeroSlides = [
  {
    title: 'Italian Marble & Exotic Stones',
    before: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=90',
    after: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=90',
    visible: true
  },
  {
    title: 'Acrylic Luxe & Poly Granite',
    before: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1920&q=90',
    after: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1920&q=90',
    visible: true
  },
  {
    title: 'Acoustic Charcoal & Fluted Panels',
    before: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=90',
    after: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1920&q=90',
    visible: true
  }
];

const defaultMaterialsList = [
  {
    title: 'Acrylic Luxe Collection',
    slug: 'acrylic-luxe-collection',
    category: 'Acrylic & Finishes',
    materialCode: 'MAT-ACR-01',
    badge: 'Premium Finish',
    description: 'Ultra-gloss anti-scratch cabinet overlays creating glass-like modern kitchen cabinet fronts.',
    heroImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=900&q=80',
    features: ['High-Gloss', 'Anti-Scratch', 'Concealed Track'],
    ctaText: 'Enquire About Material',
    ctaLink: '/contact',
    showInHero: true,
    showInCard: true,
    status: 'Published'
  },
  {
    title: 'Digital Korean Poly Granite',
    slug: 'digital-korean-poly-granite',
    category: 'Natural Stone',
    materialCode: 'MAT-GNT-02',
    badge: 'Marble Textures',
    description: 'High-gloss stone surface overlays offering scratch-proof marble elevations.',
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80',
    features: ['Scratch-Proof', 'Marble Finish', 'Heat Resistant'],
    ctaText: 'Enquire About Material',
    ctaLink: '/contact',
    showInHero: true,
    showInCard: true,
    status: 'Published'
  },
  {
    title: 'Charcoal Panels Luxe Collection',
    slug: 'charcoal-panels-luxe',
    category: 'Panelling & Acoustic',
    materialCode: 'MAT-CHR-03',
    badge: 'Textured Accents',
    description: 'Richly textured wall panels infused with active charcoal for unique luxury accent walls.',
    heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
    features: ['Air Purifying', 'Premium Texture', 'Acoustic Dampening'],
    ctaText: 'Enquire About Material',
    ctaLink: '/contact',
    showInHero: true,
    showInCard: true,
    status: 'Published'
  },
  {
    title: 'Fluted PVC Luxe Collection',
    slug: 'fluted-pvc-luxe',
    category: 'Panelling & Acoustic',
    materialCode: 'MAT-PVC-04',
    badge: 'Architectural Panels',
    description: 'Premium fluted PVC wall panels with rich relief lines and contemporary finishes.',
    heroImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80',
    features: ['Waterproof', 'Easy Install', 'UV Resistant'],
    ctaText: 'Enquire About Material',
    ctaLink: '/contact',
    showInHero: true,
    showInCard: true,
    status: 'Published'
  },
  {
    title: 'LVT Luxe Flooring',
    slug: 'lvt-luxe-flooring',
    category: 'Wood & Flooring',
    materialCode: 'MAT-FLR-05',
    badge: 'Luxury Vinyl',
    description: 'Premium luxury vinyl flooring offering durability with authentic wood and stone textures.',
    heroImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80',
    features: ['Durable', 'Water-Resistant', 'Soft Tread'],
    ctaText: 'Enquire About Material',
    ctaLink: '/contact',
    showInHero: false,
    showInCard: true,
    status: 'Published'
  },
  {
    title: 'Fluted Acrylic Luxe Collection',
    slug: 'fluted-acrylic-luxe',
    category: 'Acrylic & Finishes',
    materialCode: 'MAT-ACR-06',
    badge: '3D Relief',
    description: 'Dynamic fluted acrylic panels creating sophisticated shadow play for luxury interiors.',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    features: ['3D Relief', 'High-Gloss', 'Backlit Ready'],
    ctaText: 'Enquire About Material',
    ctaLink: '/contact',
    showInHero: false,
    showInCard: true,
    status: 'Published'
  }
];

const getNonEmpty = (val, fallback) => (val && typeof val === 'string' && val.trim().length > 0 ? val : fallback);

const AdminMaterialsCMS = () => {
  const [activeTab, setActiveTab] = useState('list'); // Default to 'list' for materials manager
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedMaterialIdx, setSelectedMaterialIdx] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fileInputHeroBeforeRef = useRef(null);
  const fileInputHeroAfterRef = useRef(null);
  const fileInputMaterialCoverRef = useRef(null);

  // Materials CMS State
  const [materialsHeroState, setMaterialsHeroState] = useState({
    materials_badge: 'Materials Collection',
    materials_title: 'Exotic Surfaces & Engineering Materials',
    materials_before_label: 'BEFORE',
    materials_after_label: 'AFTER',
    materials_hero_slides: defaultMaterialsHeroSlides,
    materials_hero_visible: true
  });

  const [materialsList, setMaterialsList] = useState(defaultMaterialsList);

  useEffect(() => {
    const fetchCMSData = async () => {
      const storedProducts = getCMSData(STORAGE_KEYS.PRODUCTS);
      const storedSettings = getCMSData(STORAGE_KEYS.SETTINGS);

      if (storedSettings) {
        setMaterialsHeroState({
          materials_badge: getNonEmpty(storedSettings.materials_badge, 'Materials Collection'),
          materials_title: getNonEmpty(storedSettings.materials_title, 'Exotic Surfaces & Engineering Materials'),
          materials_before_label: getNonEmpty(storedSettings.materials_before_label, 'BEFORE'),
          materials_after_label: getNonEmpty(storedSettings.materials_after_label, 'AFTER'),
          materials_hero_slides: (Array.isArray(storedSettings.materials_hero_slides) && storedSettings.materials_hero_slides.length > 0)
            ? storedSettings.materials_hero_slides
            : defaultMaterialsHeroSlides,
          materials_hero_visible: storedSettings.materials_hero_visible !== false
        });
      }

      if (Array.isArray(storedProducts) && storedProducts.length > 0) {
        setMaterialsList(storedProducts);
      }

      try {
        const res = await axios.get('/products');
        if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setMaterialsList(res.data.data);
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
    setMaterialsHeroState((prev) => {
      const updated = { ...prev, [key]: val };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...updated });
      return updated;
    });
  };

  const handleMaterialChange = (idx, key, val) => {
    setMaterialsList((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [key]: val };
      setCMSData(STORAGE_KEYS.PRODUCTS, updated);
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

    const existingSettings = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    const updatedSettings = {
      ...existingSettings,
      ...materialsHeroState
    };

    try {
      await axios.put('/settings', updatedSettings);
      await axios.put('/products', { products: materialsList });
    } catch (err) {
      console.warn('Database sync offline, updated in local CMS store.');
    }

    setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);
    setCMSData(STORAGE_KEYS.PRODUCTS, materialsList);
    setSaving(false);
    setSaved(true);
    showNotification('Materials page updated successfully.');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddMaterial = () => {
    const newSlug = `material-${Date.now().toString().slice(-4)}`;
    const newMaterial = {
      title: 'New Custom Material',
      slug: newSlug,
      category: 'Exotic Finishes',
      materialCode: `MAT-CST-${String(materialsList.length + 1).padStart(2, '0')}`,
      badge: 'Bespoke Material',
      description: 'High-performance engineering material with anti-scratch and luxury texture surface.',
      heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
      features: ['High-Performance', 'Luxury Finish', 'Custom Cut'],
      ctaText: 'Enquire About Material',
      ctaLink: '/contact',
      showInHero: false,
      showInCard: true,
      status: 'Published'
    };
    const updated = [...materialsList, newMaterial];
    setMaterialsList(updated);
    setSelectedMaterialIdx(materialsList.length);
    setCMSData(STORAGE_KEYS.PRODUCTS, updated);
    showNotification('New Material added to collection.');
  };

  const handleDeleteMaterial = (idx) => {
    if (materialsList.length <= 1) {
      alert('You must keep at least one material record.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${materialsList[idx].title}"?`)) {
      const updated = materialsList.filter((_, i) => i !== idx);
      setMaterialsList(updated);
      setSelectedMaterialIdx(0);
      setCMSData(STORAGE_KEYS.PRODUCTS, updated);
      showNotification('Material removed.');
    }
  };

  const handleMoveMaterial = (idx, direction) => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === materialsList.length - 1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...materialsList];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setMaterialsList(updated);
    setSelectedMaterialIdx(targetIdx);
    setCMSData(STORAGE_KEYS.PRODUCTS, updated);
  };

  const inpClass = "w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 transition-all";
  const labelClass = "font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-white/50">
        <Loader2 size={24} className="animate-spin text-gold mr-3" />
        <span className="font-sans text-xs font-bold uppercase tracking-widest">Loading Materials CMS...</span>
      </div>
    );
  }

  const currentMaterial = materialsList[selectedMaterialIdx] || materialsList[0];

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
          <h1 className="font-editorial text-3xl font-bold text-white">Materials Page CMS</h1>
          <p className="font-sans text-xs text-white/40 mt-1">
            Manage live Transformation Hero slides, search tags, and full collection of Material Cards.
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
              <span>Materials Published Live!</span>
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
          <span>Edit Material Cards ({materialsList.length} Items)</span>
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
          <span>Transformation Hero Slides</span>
        </button>
      </div>

      {/* TAB 1: TRANSFORMATION HERO SLIDES */}
      {activeTab === 'hero' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="font-editorial text-xl font-bold text-white flex items-center space-x-2">
                <Sliders size={18} className="text-gold" />
                <span>Materials Hero & Transformation Slides</span>
              </h2>
              <p className="font-sans text-xs text-white/40 mt-0.5">Edit transformation headlines, Before/After photos, and slide ordering.</p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Hero Eyebrow Tag</label>
                  <input
                    type="text"
                    value={materialsHeroState.materials_badge}
                    onChange={(e) => handleHeroChange('materials_badge', e.target.value)}
                    className={inpClass}
                    placeholder="Materials Collection"
                  />
                </div>
                <div>
                  <label className={labelClass}>Hero Main Title</label>
                  <input
                    type="text"
                    value={materialsHeroState.materials_title}
                    onChange={(e) => handleHeroChange('materials_title', e.target.value)}
                    className={inpClass}
                    placeholder="Exotic Surfaces & Engineering Materials"
                  />
                </div>
              </div>

              {/* Transformation Slides */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <label className={labelClass}>Before / After Transformation Slides ({materialsHeroState.materials_hero_slides?.length || 0})</label>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [
                        ...(materialsHeroState.materials_hero_slides || []),
                        {
                          title: 'New Material Surface',
                          before: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=90',
                          after: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=90',
                          visible: true
                        }
                      ];
                      handleHeroChange('materials_hero_slides', updated);
                    }}
                    className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg font-sans text-[11px] font-bold uppercase transition-all"
                  >
                    <Plus size={12} />
                    <span>Add Transformation Slide</span>
                  </button>
                </div>

                {(materialsHeroState.materials_hero_slides || []).map((slide, sIdx) => (
                  <div key={sIdx} className="bg-[#0E0F11] border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs font-bold text-gold uppercase tracking-wider">Slide 0{sIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (materialsHeroState.materials_hero_slides || []).filter((_, i) => i !== sIdx);
                          handleHeroChange('materials_hero_slides', updated);
                        }}
                        className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg text-xs flex items-center space-x-1"
                      >
                        <Trash2 size={13} />
                        <span>Remove Slide</span>
                      </button>
                    </div>

                    <div>
                      <label className={labelClass}>Slide Headline Title</label>
                      <input
                        type="text"
                        value={slide.title || ''}
                        onChange={(e) => {
                          const updated = [...(materialsHeroState.materials_hero_slides || [])];
                          updated[sIdx] = { ...updated[sIdx], title: e.target.value };
                          handleHeroChange('materials_hero_slides', updated);
                        }}
                        className={inpClass}
                        placeholder="e.g. Italian Marble & Exotic Stones"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Before Image URL</label>
                        <input
                          type="text"
                          value={slide.before || ''}
                          onChange={(e) => {
                            const updated = [...(materialsHeroState.materials_hero_slides || [])];
                            updated[sIdx] = { ...updated[sIdx], before: e.target.value };
                            handleHeroChange('materials_hero_slides', updated);
                          }}
                          className={inpClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>After Image URL</label>
                        <input
                          type="text"
                          value={slide.after || ''}
                          onChange={(e) => {
                            const updated = [...(materialsHeroState.materials_hero_slides || [])];
                            updated[sIdx] = { ...updated[sIdx], after: e.target.value };
                            handleHeroChange('materials_hero_slides', updated);
                          }}
                          className={inpClass}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hero Banner Visibility */}
              <div className="pt-2 flex items-center justify-between bg-[#0E0F11] border border-white/5 p-4 rounded-xl">
                <div>
                  <span className="font-sans text-xs font-bold text-white block">Hero Section Visibility</span>
                  <span className="font-sans text-[11px] text-white/40">Toggle ON/OFF to show or hide top transformation hero on /products.</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleHeroChange('materials_hero_visible', !materialsHeroState.materials_hero_visible)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                    materialsHeroState.materials_hero_visible ? 'bg-gold' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      materialsHeroState.materials_hero_visible ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="sticky top-20 bg-[#141518] border border-white/5 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold flex items-center space-x-1.5">
                  <Eye size={12} />
                  <span>Materials Hero Preview</span>
                </span>
                <span className="text-[10px] font-sans text-white/30">Real-time binding</span>
              </div>

              <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                <img
                  src={materialsHeroState.materials_hero_slides?.[0]?.after || defaultMaterialsHeroSlides[0].after}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                  <span className="font-sans text-[9px] uppercase tracking-widest font-bold text-gold">{materialsHeroState.materials_badge}</span>
                  <h3 className="font-editorial text-lg font-bold leading-tight">{materialsHeroState.materials_hero_slides?.[0]?.title || 'Italian Marble'}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MATERIALS MANAGER */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Material Selector List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs font-bold uppercase tracking-wider text-white/60">Materials Collection ({materialsList.length})</span>
                <button
                  type="button"
                  onClick={handleAddMaterial}
                  className="flex items-center space-x-1 bg-gold/15 text-gold border border-gold/30 hover:bg-gold hover:text-charcoal px-3 py-1.5 rounded-lg font-sans text-xs font-bold uppercase transition-all"
                >
                  <Plus size={13} />
                  <span>Add Material</span>
                </button>
              </div>

              {/* Search Box */}
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-3.5 text-white/40 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search materials by title or category..."
                  className="w-full bg-[#141518] border border-white/10 focus:border-gold focus:outline-none rounded-xl font-sans text-xs pl-9 pr-8 py-2 text-white placeholder:text-white/30 transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 text-white/40 hover:text-white text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div data-lenis-prevent className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gold/50 scrollbar-track-white/5 hover:scrollbar-thumb-gold transition-all">
              {materialsList
                .map((mat, idx) => ({ mat, idx }))
                .filter(({ mat }) => {
                  if (!searchTerm.trim()) return true;
                  const q = searchTerm.trim().toLowerCase();
                  return (
                    (mat.title || '').toLowerCase().includes(q) ||
                    (mat.category || '').toLowerCase().includes(q) ||
                    (mat.materialCode || '').toLowerCase().includes(q) ||
                    (mat.description || '').toLowerCase().includes(q)
                  );
                })
                .map(({ mat, idx }) => {
                  const isSelected = idx === selectedMaterialIdx;
                  return (
                  <div
                    key={idx}
                    onClick={() => setSelectedMaterialIdx(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-gold/15 border-gold/40 shadow-lg'
                        : 'bg-[#141518] border-white/5 hover:border-white/20 hover:bg-white/2'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <span className="font-sans text-xs font-bold text-gold">{String(idx + 1).padStart(2, '0')}</span>
                      <div className="truncate">
                        <h4 className="font-sans text-xs font-bold text-white truncate">{mat.title}</h4>
                        <span className="font-sans text-[10px] text-white/40 uppercase tracking-widest block truncate">{mat.category || 'Surface Material'}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleMoveMaterial(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-white/30 hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveMaterial(idx, 'down')}
                        disabled={idx === materialsList.length - 1}
                        className="p-1 text-white/30 hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteMaterial(idx)}
                        className="p-1 text-red-400/40 hover:text-red-400"
                        title="Delete Material"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Material Editor */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <span className="font-sans text-[10px] font-bold text-gold uppercase tracking-widest">
                    Editing Material {String(selectedMaterialIdx + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-white">{currentMaterial.title}</h3>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="font-sans text-xs text-white/40">Card Visible:</span>
                  <button
                    type="button"
                    onClick={() => handleMaterialChange(selectedMaterialIdx, 'showInCard', !(currentMaterial.showInCard !== false))}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                      currentMaterial.showInCard !== false ? 'bg-gold' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        currentMaterial.showInCard !== false ? 'translate-x-5.5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputMaterialCoverRef}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e, (dataUrl) => {
                  handleMaterialChange(selectedMaterialIdx, 'heroImage', dataUrl);
                })}
              />

              {/* SECTION-LEVEL MANAGEMENT CONTROL PANEL */}
              <div className="bg-[#0E0F11] border border-gold/30 rounded-2xl p-5 space-y-4">
                <div className="flex items-center space-x-2 border-b border-white/10 pb-3">
                  <Sliders className="text-gold" size={16} />
                  <h4 className="font-editorial text-base font-bold text-white">Page Sections Management & Visibility</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Overview Section Toggle */}
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="font-sans text-xs font-bold text-white block">1. Material Overview</span>
                      <span className="font-sans text-[9px] text-white/40">Show/Hide description and key features</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMaterialChange(selectedMaterialIdx, 'showOverviewSection', !(currentMaterial.showOverviewSection !== false))}
                      className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                        currentMaterial.showOverviewSection !== false ? 'bg-gold' : 'bg-white/10'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${currentMaterial.showOverviewSection !== false ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                  {/* Finishes Section Toggle */}
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="font-sans text-xs font-bold text-white block">2. Available Finishes</span>
                      <span className="font-sans text-[9px] text-white/40">Show/Hide color swatches</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMaterialChange(selectedMaterialIdx, 'showFinishesSection', !(currentMaterial.showFinishesSection !== false))}
                      className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                        currentMaterial.showFinishesSection !== false ? 'bg-gold' : 'bg-white/10'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${currentMaterial.showFinishesSection !== false ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                  {/* Specifications Section Toggle */}
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="font-sans text-xs font-bold text-white block">3. Technical Specs Table</span>
                      <span className="font-sans text-[9px] text-white/40">Show/Hide specs key-value table</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMaterialChange(selectedMaterialIdx, 'showSpecificationsSection', !(currentMaterial.showSpecificationsSection !== false))}
                      className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                        currentMaterial.showSpecificationsSection !== false ? 'bg-gold' : 'bg-white/10'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${currentMaterial.showSpecificationsSection !== false ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                  {/* Applications Section Toggle */}
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                    <div>
                      <span className="font-sans text-xs font-bold text-white block">4. Applications Tags</span>
                      <span className="font-sans text-[9px] text-white/40">Show/Hide application badges</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMaterialChange(selectedMaterialIdx, 'showApplicationsSection', !(currentMaterial.showApplicationsSection !== false))}
                      className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                        currentMaterial.showApplicationsSection !== false ? 'bg-gold' : 'bg-white/10'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${currentMaterial.showApplicationsSection !== false ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>

                  {/* Catalogue Preview Section Toggle */}
                  <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5 md:col-span-2">
                    <div>
                      <span className="font-sans text-xs font-bold text-white block">5. Catalogue Preview & Shade Cards Grid Section</span>
                      <span className="font-sans text-[9px] text-white/40">Show/Hide Catalogue Preview grid, unlocked shades counter, and lightbox modal</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleMaterialChange(selectedMaterialIdx, 'showCataloguePreviewSection', !(currentMaterial.showCataloguePreviewSection !== false))}
                      className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                        currentMaterial.showCataloguePreviewSection !== false ? 'bg-gold' : 'bg-white/10'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${currentMaterial.showCataloguePreviewSection !== false ? 'translate-x-5.5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>

                {/* Custom Section Title Overrides */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  <div>
                    <label className={labelClass}>Overview Section Title</label>
                    <input
                      type="text"
                      value={currentMaterial.overviewSectionTitle || ''}
                      onChange={(e) => handleMaterialChange(selectedMaterialIdx, 'overviewSectionTitle', e.target.value)}
                      placeholder="Material Overview"
                      className={inpClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Finishes Section Title</label>
                    <input
                      type="text"
                      value={currentMaterial.finishesSectionTitle || ''}
                      onChange={(e) => handleMaterialChange(selectedMaterialIdx, 'finishesSectionTitle', e.target.value)}
                      placeholder="Available Finishes"
                      className={inpClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Catalogue Section Eyebrow</label>
                    <input
                      type="text"
                      value={currentMaterial.catalogueEyebrow || ''}
                      onChange={(e) => handleMaterialChange(selectedMaterialIdx, 'catalogueEyebrow', e.target.value)}
                      placeholder="Catalog & Shades"
                      className={inpClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Catalogue Section Title</label>
                    <input
                      type="text"
                      value={currentMaterial.catalogueTitle || ''}
                      onChange={(e) => handleMaterialChange(selectedMaterialIdx, 'catalogueTitle', e.target.value)}
                      placeholder="Catalogue Preview"
                      className={inpClass}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Material Name / Title</label>
                    <input
                      type="text"
                      value={currentMaterial.title || ''}
                      onChange={(e) => handleMaterialChange(selectedMaterialIdx, 'title', e.target.value)}
                      className={inpClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Category (e.g. Acrylic & Finishes)</label>
                    <input
                      type="text"
                      value={currentMaterial.category || ''}
                      onChange={(e) => handleMaterialChange(selectedMaterialIdx, 'category', e.target.value)}
                      className={inpClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Material Code (e.g. MAT-ACR-01)</label>
                    <input
                      type="text"
                      value={currentMaterial.materialCode || ''}
                      onChange={(e) => handleMaterialChange(selectedMaterialIdx, 'materialCode', e.target.value)}
                      className={inpClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Badge Tag (e.g. Premium Finish)</label>
                    <input
                      type="text"
                      value={currentMaterial.badge || ''}
                      onChange={(e) => handleMaterialChange(selectedMaterialIdx, 'badge', e.target.value)}
                      className={inpClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Short Description (Shown on Grid Card)</label>
                  <textarea
                    rows={2}
                    value={currentMaterial.description || ''}
                    onChange={(e) => handleMaterialChange(selectedMaterialIdx, 'description', e.target.value)}
                    className={`${inpClass} resize-none`}
                  />
                </div>

                {/* Cover Image */}
                <div>
                  <label className={labelClass}>Material Cover Image</label>
                  <div className="flex items-center space-x-3">
                    {currentMaterial.heroImage && (
                      <img src={currentMaterial.heroImage} alt="Cover" className="w-20 h-14 object-cover rounded-lg border border-white/10 shrink-0" />
                    )}
                    <input
                      type="text"
                      value={currentMaterial.heroImage || ''}
                      onChange={(e) => handleMaterialChange(selectedMaterialIdx, 'heroImage', e.target.value)}
                      className={inpClass}
                      placeholder="https://images.unsplash.com/..."
                    />
                    <button
                      type="button"
                      onClick={() => fileInputMaterialCoverRef.current?.click()}
                      className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-3 rounded-lg font-sans text-[11px] font-bold uppercase shrink-0"
                    >
                      <Plus size={12} />
                      <span>Upload</span>
                    </button>
                  </div>
                </div>

                {/* Feature Tags List */}
                <div className="space-y-3 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>Feature Badges / Tags</label>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(currentMaterial.features || []), 'New Feature'];
                        handleMaterialChange(selectedMaterialIdx, 'features', updated);
                      }}
                      className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg font-sans text-[10px] font-bold uppercase"
                    >
                      <Plus size={12} />
                      <span>Add Feature Tag</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(currentMaterial.features || []).map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center space-x-2 bg-[#0E0F11] border border-white/10 p-2 rounded-xl">
                        <input
                          type="text"
                          value={feat}
                          onChange={(e) => {
                            const updated = [...(currentMaterial.features || [])];
                            updated[fIdx] = e.target.value;
                            handleMaterialChange(selectedMaterialIdx, 'features', updated);
                          }}
                          className={inpClass}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (currentMaterial.features || []).filter((_, i) => i !== fIdx);
                            handleMaterialChange(selectedMaterialIdx, 'features', updated);
                          }}
                          className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
                          title="Remove Tag"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Available Finishes / Color Swatches */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className={labelClass}>Available Finishes & Color Swatches</label>
                      <span className="font-sans text-[10px] text-white/40">Color swatches displayed inside the opened material modal/page.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(currentMaterial.colors || []), { name: 'Natural Shade', hex: '#C9A96E' }];
                        handleMaterialChange(selectedMaterialIdx, 'colors', updated);
                      }}
                      className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg font-sans text-[10px] font-bold uppercase"
                    >
                      <Plus size={12} />
                      <span>Add Color Swatch</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(currentMaterial.colors || [
                      { name: 'Natural Oak', hex: '#D2B48C' },
                      { name: 'Smoked Walnut', hex: '#5C4033' },
                      { name: 'Ashen Grey', hex: '#808080' },
                      { name: 'Slate Charcoal', hex: '#2F4F4F' },
                      { name: 'White Ash', hex: '#F5F0EB' }
                    ]).map((col, cIdx) => (
                      <div key={cIdx} className="flex items-center space-x-3 bg-[#0E0F11] border border-white/10 p-3 rounded-xl">
                        <input
                          type="color"
                          value={col.hex || '#C9A96E'}
                          onChange={(e) => {
                            const updated = [...(currentMaterial.colors || [])];
                            updated[cIdx] = { ...updated[cIdx], hex: e.target.value };
                            handleMaterialChange(selectedMaterialIdx, 'colors', updated);
                          }}
                          className="w-8 h-8 rounded-lg border border-white/20 cursor-pointer p-0 bg-transparent shrink-0"
                        />
                        <input
                          type="text"
                          value={col.name || ''}
                          onChange={(e) => {
                            const updated = [...(currentMaterial.colors || [])];
                            updated[cIdx] = { ...updated[cIdx], name: e.target.value };
                            handleMaterialChange(selectedMaterialIdx, 'colors', updated);
                          }}
                          placeholder="Finish Name (e.g. Natural Oak)"
                          className={inpClass}
                        />
                        <input
                          type="text"
                          value={col.hex || ''}
                          onChange={(e) => {
                            const updated = [...(currentMaterial.colors || [])];
                            updated[cIdx] = { ...updated[cIdx], hex: e.target.value };
                            handleMaterialChange(selectedMaterialIdx, 'colors', updated);
                          }}
                          placeholder="#Hex"
                          className="w-28 bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-3 py-3 text-white transition-all shrink-0"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (currentMaterial.colors || []).filter((_, i) => i !== cIdx);
                            handleMaterialChange(selectedMaterialIdx, 'colors', updated);
                          }}
                          className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
                          title="Remove Swatch"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Specifications Table Editor */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className={labelClass}>Technical Specifications Table</label>
                      <span className="font-sans text-[10px] text-white/40">Key-value table (e.g. Sheet Size, Surface Type, Finishes List, Core Weight, Warranty).</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(currentMaterial.specifications || []), { label: 'Sheet Size', value: '2440mm × 1220mm × 2mm' }];
                        handleMaterialChange(selectedMaterialIdx, 'specifications', updated);
                      }}
                      className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg font-sans text-[10px] font-bold uppercase"
                    >
                      <Plus size={12} />
                      <span>Add Spec Row</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(currentMaterial.specifications || [
                      { label: 'Sheet Size', value: '2440mm × 1220mm × 2mm' },
                      { label: 'Surface', value: 'Hard-coated Acrylic' },
                      { label: 'Finishes', value: 'Luminous Grid (8313), Crema Imperiale (8302), Elysian Vein (8303)' }
                    ]).map((spec, sIdx) => (
                      <div key={sIdx} className="flex flex-col sm:flex-row items-center gap-2 bg-[#0E0F11] border border-white/10 p-3 rounded-xl">
                        <input
                          type="text"
                          value={spec.label || ''}
                          onChange={(e) => {
                            const updated = [...(currentMaterial.specifications || [])];
                            updated[sIdx] = { ...updated[sIdx], label: e.target.value };
                            handleMaterialChange(selectedMaterialIdx, 'specifications', updated);
                          }}
                          placeholder="Spec Label (e.g. Sheet Size)"
                          className="w-full sm:w-1/3 bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-3 py-2.5 text-white transition-all"
                        />
                        <input
                          type="text"
                          value={spec.value || ''}
                          onChange={(e) => {
                            const updated = [...(currentMaterial.specifications || [])];
                            updated[sIdx] = { ...updated[sIdx], value: e.target.value };
                            handleMaterialChange(selectedMaterialIdx, 'specifications', updated);
                          }}
                          placeholder="Spec Value (e.g. 2440mm x 1220mm)"
                          className="w-full sm:w-2/3 bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-3 py-2.5 text-white transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (currentMaterial.specifications || []).filter((_, i) => i !== sIdx);
                            handleMaterialChange(selectedMaterialIdx, 'specifications', updated);
                          }}
                          className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0 self-end sm:self-auto"
                          title="Remove Spec"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Applications List */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className={labelClass}>Applications & Best Uses</label>
                      <span className="font-sans text-[10px] text-white/40">Tags displayed under Applications (e.g. Modular Kitchen Shutters, Wardrobe Sliding Doors).</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(currentMaterial.applications || []), 'Modular Kitchen Shutters'];
                        handleMaterialChange(selectedMaterialIdx, 'applications', updated);
                      }}
                      className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg font-sans text-[10px] font-bold uppercase"
                    >
                      <Plus size={12} />
                      <span>Add Application Tag</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(currentMaterial.applications || [
                      'Modular Kitchen Shutters',
                      'Wardrobe Sliding Doors',
                      'Bathroom Vanity'
                    ]).map((app, aIdx) => (
                      <div key={aIdx} className="flex items-center space-x-2 bg-[#0E0F11] border border-white/10 p-2 rounded-xl">
                        <input
                          type="text"
                          value={app}
                          onChange={(e) => {
                            const updated = [...(currentMaterial.applications || [])];
                            updated[aIdx] = e.target.value;
                            handleMaterialChange(selectedMaterialIdx, 'applications', updated);
                          }}
                          className={inpClass}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (currentMaterial.applications || []).filter((_, i) => i !== aIdx);
                            handleMaterialChange(selectedMaterialIdx, 'applications', updated);
                          }}
                          className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
                          title="Remove Tag"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Catalogue Preview / Shade Cards Gallery Editor */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className={labelClass}>Catalogue Preview & Shade Cards Gallery</label>
                      <span className="font-sans text-[10px] text-white/40">Shade card images displayed under Catalogue Preview inside the opened material modal.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(currentMaterial.previewPages || currentMaterial.gallery || []), 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'];
                        handleMaterialChange(selectedMaterialIdx, 'previewPages', updated);
                        handleMaterialChange(selectedMaterialIdx, 'gallery', updated);
                      }}
                      className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg font-sans text-[10px] font-bold uppercase"
                    >
                      <Plus size={12} />
                      <span>Add Shade Card</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0E0F11] p-3.5 rounded-xl border border-white/10">
                    <div>
                      <label className={labelClass}>Total Shades Count (e.g. 12 or 23)</label>
                      <input
                        type="number"
                        min={1}
                        value={currentMaterial.totalShades || 12}
                        onChange={(e) => handleMaterialChange(selectedMaterialIdx, 'totalShades', Number(e.target.value))}
                        className={inpClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Unlocked Preview Limit (e.g. 6)</label>
                      <input
                        type="number"
                        min={1}
                        value={currentMaterial.previewLimit || 6}
                        onChange={(e) => handleMaterialChange(selectedMaterialIdx, 'previewLimit', Number(e.target.value))}
                        className={inpClass}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {((currentMaterial.previewPages && currentMaterial.previewPages.length > 0)
                      ? currentMaterial.previewPages
                      : (currentMaterial.gallery && currentMaterial.gallery.length > 0)
                        ? currentMaterial.gallery
                        : [
                            '/images/materials/irish.png',
                            '/images/materials/azzurro.png',
                            '/images/materials/giallo.png',
                            '/images/materials/marbo.png',
                            '/images/materials/florida.png',
                            '/images/materials/menta.png',
                            '/images/materials/giallo_dining.png',
                            '/images/materials/ash.png',
                            '/images/materials/linia.png',
                            '/images/materials/florida_vanity.png',
                            '/images/materials/gracia.png',
                            '/images/materials/irish_gen2.png'
                          ]).map((rawItem, pIdx, arr) => {
                      const urlVal = typeof rawItem === 'string' ? rawItem : (rawItem.url || rawItem.src || '');
                      const isLocked = typeof rawItem === 'object' && rawItem.isLocked !== undefined 
                        ? rawItem.isLocked 
                        : pIdx >= (currentMaterial.previewLimit || 6);

                      const handleToggleLock = () => {
                        const updated = arr.map((item, i) => {
                          const itemUrl = typeof item === 'string' ? item : (item.url || item.src || '');
                          const itemLocked = typeof item === 'object' && item.isLocked !== undefined ? item.isLocked : i >= (currentMaterial.previewLimit || 6);
                          if (i === pIdx) {
                            return { url: itemUrl, isLocked: !itemLocked };
                          }
                          return typeof item === 'string' ? { url: item, isLocked: itemLocked } : item;
                        });
                        handleMaterialChange(selectedMaterialIdx, 'previewPages', updated);
                        handleMaterialChange(selectedMaterialIdx, 'gallery', updated);
                      };

                      return (
                        <div key={pIdx} className="flex items-center space-x-3 bg-[#0E0F11] border border-white/10 p-3 rounded-xl">
                          <span className="font-sans text-[11px] font-bold text-white/50 w-12 shrink-0">PAGE {pIdx + 1}</span>
                          {urlVal && (
                            <img src={urlVal} alt={`Shade ${pIdx + 1}`} className="w-12 h-12 object-cover rounded-lg border border-white/10 shrink-0" />
                          )}
                          <input
                            type="text"
                            value={urlVal}
                            onChange={(e) => {
                              const updated = arr.map((item, i) => {
                                if (i === pIdx) {
                                  return typeof item === 'object' ? { ...item, url: e.target.value } : e.target.value;
                                }
                                return item;
                              });
                              handleMaterialChange(selectedMaterialIdx, 'previewPages', updated);
                              handleMaterialChange(selectedMaterialIdx, 'gallery', updated);
                            }}
                            placeholder="Image URL (https://... or /images/...)"
                            className={inpClass}
                          />

                          {/* Manual Lock / Unlock Toggle Button */}
                          <button
                            type="button"
                            onClick={handleToggleLock}
                            className={`flex items-center space-x-1.5 px-3 py-2.5 rounded-lg font-sans text-[10px] font-bold uppercase transition-all shrink-0 ${
                              isLocked
                                ? 'bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25'
                                : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                            }`}
                            title={isLocked ? 'Click to Unlock this card' : 'Click to Lock this card'}
                          >
                            {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                            <span>{isLocked ? 'Locked' : 'Unlocked'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                handleFileUpload(e, (dataUrl) => {
                                  const updated = arr.map((item, i) => {
                                    if (i === pIdx) {
                                      return typeof item === 'object' ? { ...item, url: dataUrl } : dataUrl;
                                    }
                                    return item;
                                  });
                                  handleMaterialChange(selectedMaterialIdx, 'previewPages', updated);
                                  handleMaterialChange(selectedMaterialIdx, 'gallery', updated);
                                });
                              };
                              input.click();
                            }}
                            className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2.5 rounded-lg font-sans text-[10px] font-bold uppercase shrink-0"
                          >
                            <Plus size={12} />
                            <span>Upload</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = arr.filter((_, i) => i !== pIdx);
                              handleMaterialChange(selectedMaterialIdx, 'previewPages', updated);
                              handleMaterialChange(selectedMaterialIdx, 'gallery', updated);
                            }}
                            className="p-2.5 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
                            title="Remove Shade Card"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      );
                    })}
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

export default AdminMaterialsCMS;
