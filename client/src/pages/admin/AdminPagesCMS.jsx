import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Layout, Eye, Save, CheckCircle, Loader2, Plus, Trash2,
  ChevronUp, ChevronDown, Image as ImageIcon, Sliders, Layers,
  Globe, Navigation, Share2, HelpCircle, AlertCircle
} from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS } from '../../utils/cmsStore';

const AdminPagesCMS = () => {
  const [activeTab, setActiveTab] = useState('hero'); // 'hero' | 'about' | 'stats' | 'cta' | 'nav' | 'footer'
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Settings State
  const [settings, setSettings] = useState({
    hero_title: 'Engineering. Elegance. Experience.',
    hero_subtitle: 'Bespoke Luxury Interiors & Turned-Key Executions in Hyderabad',
    hero_cta_text: 'Get Free Estimate',
    hero_cta_link: '/contact',
    hero_visible: true,
    hero_images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    ],

    about_title: 'Four Decades of Structural Excellence',
    about_subtitle: 'HERITAGE & CRAFTSMANSHIP',
    about_description: 'Born out of a multi-generational legacy in civil construction, ESPACIO brings structural rigor and high-tolerance engineering to luxury interior architecture across Hyderabad.',
    about_experience_years: '40+',
    about_visible: true,

    stats_item1_value: '25+',
    stats_item1_label: 'Projects Completed',
    stats_item2_value: '100+',
    stats_item2_label: 'Happy Clients',
    stats_item3_value: '40+',
    stats_item3_label: 'Years Combined Legacy',

    cta_headline: 'Ready to Transform Your Space?',
    cta_subtext: 'Schedule a private consultation at our Aziznagar experience store or request a custom turnkey quotation.',
    cta_button_text: 'Book Free Consultation',
    cta_phone: '+91 90000 00000',
    cta_visible: true,

    nav_items: [
      { label: 'Home', path: '/', visible: true },
      { label: 'About', path: '/about', visible: true },
      { label: 'What We Do', path: '/what-we-do', visible: true },
      { label: 'Projects', path: '/projects', visible: true },
      { label: 'Materials Library', path: '/products', visible: true },
      { label: 'FAQ', path: '/faq', visible: true },
      { label: 'Contact', path: '/contact', visible: true },
    ],

    footer_description: 'Turnkey interior design and luxury material supply across Hyderabad. Crafted with structural legacy.',
    footer_address: '1st floor, H.No. 6-63/14B, Moinabad Road, Aziznagar, Hyderabad, Telangana 500075',
    footer_hours: '10:00 AM – 7:30 PM (Mon - Sat)',
    footer_email: 'Espacio.hyd@gmail.com',
    footer_instagram: 'https://www.instagram.com/theespacio.in',
    footer_copyright: '© 2026 ESPACIO Interiors & Modular. All Rights Reserved.',

    projects_hero_badge: 'Portfolio & Case Studies',
    projects_hero_title: 'Our Projects',
    projects_hero_subtitle: 'Every space reflects thoughtful layouts, structural precision, custom material procurement, and meticulous attention to detail.',
    projects_hero_images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=90',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=90',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=90'
    ],

    services_hero_badge: 'Services & Offerings',
    services_hero_title: 'Our Services',
    services_hero_subtitle: 'Turnkey design and build with engineering tolerances. No templates. No hidden package tricks.',
    services_hero_images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1920&q=90',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1920&q=90',
      'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1920&q=90',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=90'
    ],
    services_list: [
      {
        num: '01',
        title: 'Full Home Interior Design & Execution',
        tag: 'Turnkey Design & Build',
        desc: 'From concept to handover, we design and build your home end-to-end — delivered turnkey, so you\'re never juggling multiple vendors or contractors.',
        includes: ['Living & Dining Design', 'Bedroom & Wardrobe Systems', 'Modular Kitchen Layouts', 'Ceilings & Ambient Lighting', 'Material & Texture Curation', 'Turnkey Project Execution'],
        img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'
      },
      {
        num: '02',
        title: 'Commercial Interiors',
        tag: 'Workspaces & Retail',
        desc: 'Interior design and fit-out for offices, retail, and commercial spaces, delivered turnkey with a single team managing design, materials, and execution from start to finish.',
        includes: ['Office Layout Optimization', 'Retail Flow Planning', 'Conference & Meeting Rooms', 'Ergonomic Workstations', 'AV & Tech Integration', 'Turnkey Construction'],
        img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=90'
      },
      {
        num: '03',
        title: 'Styling & Decor',
        tag: 'Curated Styling',
        desc: 'Curated styling, accessories, and finishing touches that bring a space to life — offered as a standalone service or as the final turnkey step on any Espacio project.',
        includes: ['Art & Wall Decor Curation', 'Custom Soft Furnishings', 'Lighting & Accessory Styling', 'Plants & Greenery Selection', 'Color Palette Harmony', 'Bespoke Styling Audits'],
        img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80'
      },
      {
        num: '04',
        title: 'Renovation',
        tag: 'Upgrade Existing Spaces',
        desc: 'Redesigning and upgrading existing spaces, residential or commercial, without starting from scratch — delivered turnkey, with design, materials, and execution handled entirely by us.',
        includes: ['Kitchen & Bath Upgrades', 'Living Space Redesign', 'Structural Alterations', 'Flooring Replacement', 'Electrical & Plumbing Re-lay', 'Turnkey Execution'],
        img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80'
      },
      {
        num: '05',
        title: 'Materials Supply (Sold Separately)',
        tag: 'Premium Sourced Supply',
        desc: 'We source globally to bring you WPC wall & ceiling panels, polygranite sheets, and more warehoused in our own godowns for faster availability.',
        includes: ['WPC Wall & Ceiling Panels', 'Polygranite & Acrylic Sheets', 'Fluted & Charcoal Louvers', 'Bespoke Wall Finishes', 'Stand-alone Purchasing', 'Fast Delivery from Godowns'],
        img: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=900&q=80'
      }
    ],
  });

  useEffect(() => {
    const fetchCMSData = async () => {
      const stored = getCMSData(STORAGE_KEYS.SETTINGS);
      if (stored) {
        setSettings((prev) => ({ ...prev, ...stored }));
        setLoading(false);
      }
      try {
        const res = await axios.get('/settings');
        if (res.data.success && res.data.data && Object.keys(res.data.data).length > 0 && !stored) {
          setSettings((prev) => {
            const updated = { ...prev, ...res.data.data };
            setCMSData(STORAGE_KEYS.SETTINGS, updated);
            return updated;
          });
        }
      } catch {}
      finally {
        setLoading(false);
      }
    };
    fetchCMSData();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/settings', settings);
    } catch {}
    setCMSData(STORAGE_KEYS.SETTINGS, settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  const updateSetting = (key, val) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
  };

  const handleNavItemChange = (index, field, val) => {
    const updated = [...settings.nav_items];
    updated[index][field] = val;
    setSettings((prev) => ({ ...prev, nav_items: updated }));
  };

  const addNavItem = () => {
    setSettings((prev) => ({
      ...prev,
      nav_items: [...prev.nav_items, { label: 'New Link', path: '/', visible: true }]
    }));
  };

  const deleteNavItem = (index) => {
    setSettings((prev) => ({
      ...prev,
      nav_items: prev.nav_items.filter((_, i) => i !== index)
    }));
  };

  const moveNavItem = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= settings.nav_items.length) return;
    const updated = [...settings.nav_items];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setSettings((prev) => ({ ...prev, nav_items: updated }));
  };

  const inpClass = "w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 transition-all";
  const labelClass = "font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-1.5";

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Save Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="font-editorial text-3xl font-bold text-white">Page & Section CMS</h1>
          <p className="font-sans text-xs text-white/40 mt-1">
            Manage live website sections, text, navigation, and visual layout parameters.
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
              <span>Published Live!</span>
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

      {/* Tabs Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/5">
        {[
          { id: 'hero', label: 'Home Hero', icon: Layers },
          { id: 'projects_hero', label: 'Projects Hero', icon: ImageIcon },
          { id: 'services_hero', label: 'Services Hero', icon: ImageIcon },
          { id: 'services_list', label: 'Services Sections', icon: Sliders },
          { id: 'about', label: 'About Section', icon: Globe },
          { id: 'stats', label: 'Stats & Counters', icon: Sliders },
          { id: 'cta', label: 'Call to Action', icon: HelpCircle },
          { id: 'nav', label: 'Header Navigation', icon: Navigation },
          { id: 'footer', label: 'Footer & Contacts', icon: Share2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-sans uppercase tracking-widest font-bold whitespace-nowrap transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gold/15 text-gold border border-gold/25'
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Grid: Editor Left + Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Editor Form Panel */}
        <div className="lg:col-span-7 space-y-6 bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8">
          
          {/* TAB 1: HERO SECTION */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="font-editorial text-xl font-bold text-white">Homepage Hero Section</h2>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <span className="font-sans text-xs text-white/50">Section Visible</span>
                  <div
                    onClick={() => updateSetting('hero_visible', !settings.hero_visible)}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                      settings.hero_visible ? 'bg-gold' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        settings.hero_visible ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </label>
              </div>

              <div>
                <label className={labelClass}>Main Hero Headline</label>
                <input
                  type="text"
                  value={settings.hero_title}
                  onChange={(e) => updateSetting('hero_title', e.target.value)}
                  className={inpClass}
                  placeholder="Engineering. Elegance. Experience."
                />
              </div>

              <div>
                <label className={labelClass}>Hero Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={settings.hero_subtitle}
                  onChange={(e) => updateSetting('hero_subtitle', e.target.value)}
                  className={`${inpClass} resize-none`}
                  placeholder="Bespoke Luxury Interiors..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>CTA Button Text</label>
                  <input
                    type="text"
                    value={settings.hero_cta_text}
                    onChange={(e) => updateSetting('hero_cta_text', e.target.value)}
                    className={inpClass}
                    placeholder="Get Free Estimate"
                  />
                </div>
                <div>
                  <label className={labelClass}>CTA Button Link</label>
                  <input
                    type="text"
                    value={settings.hero_cta_link}
                    onChange={(e) => updateSetting('hero_cta_link', e.target.value)}
                    className={inpClass}
                    placeholder="/contact"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROJECTS HERO */}
          {activeTab === 'projects_hero' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="font-editorial text-xl font-bold text-white">Projects Page Hero Section</h2>
              </div>

              <div>
                <label className={labelClass}>Hero Tagline / Pill Badge</label>
                <input
                  type="text"
                  value={settings.projects_hero_badge || ''}
                  onChange={(e) => updateSetting('projects_hero_badge', e.target.value)}
                  className={inpClass}
                  placeholder="Portfolio & Case Studies"
                />
              </div>

              <div>
                <label className={labelClass}>Hero Main Title</label>
                <input
                  type="text"
                  value={settings.projects_hero_title || ''}
                  onChange={(e) => updateSetting('projects_hero_title', e.target.value)}
                  className={inpClass}
                  placeholder="Our Projects"
                />
              </div>

              <div>
                <label className={labelClass}>Hero Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={settings.projects_hero_subtitle || ''}
                  onChange={(e) => updateSetting('projects_hero_subtitle', e.target.value)}
                  className={`${inpClass} resize-none`}
                  placeholder="Every space reflects thoughtful layouts, structural precision..."
                />
              </div>

              {/* Hero Carousel Background Images */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <label className={labelClass}>Hero Background Carousel Images</label>
                {(settings.projects_hero_images || []).map((img, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => {
                        const updated = [...(settings.projects_hero_images || [])];
                        updated[i] = e.target.value;
                        updateSetting('projects_hero_images', updated);
                      }}
                      className={inpClass}
                      placeholder="https://images.unsplash.com/..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (settings.projects_hero_images || []).filter((_, idx) => idx !== i);
                        updateSetting('projects_hero_images', updated);
                      }}
                      className="p-3 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...(settings.projects_hero_images || []), 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90'];
                    updateSetting('projects_hero_images', updated);
                  }}
                  className="flex items-center space-x-2 text-gold text-xs font-sans font-bold uppercase pt-2"
                >
                  <Plus size={14} />
                  <span>Add Background Image</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: SERVICES HERO */}
          {activeTab === 'services_hero' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="font-editorial text-xl font-bold text-white">Services Page Hero Section</h2>
              </div>

              <div>
                <label className={labelClass}>Hero Tagline / Pill Badge</label>
                <input
                  type="text"
                  value={settings.services_hero_badge || ''}
                  onChange={(e) => updateSetting('services_hero_badge', e.target.value)}
                  className={inpClass}
                  placeholder="Services & Offerings"
                />
              </div>

              <div>
                <label className={labelClass}>Hero Main Title</label>
                <input
                  type="text"
                  value={settings.services_hero_title || ''}
                  onChange={(e) => updateSetting('services_hero_title', e.target.value)}
                  className={inpClass}
                  placeholder="Our Services"
                />
              </div>

              <div>
                <label className={labelClass}>Hero Subtitle / Description</label>
                <textarea
                  rows={3}
                  value={settings.services_hero_subtitle || ''}
                  onChange={(e) => updateSetting('services_hero_subtitle', e.target.value)}
                  className={`${inpClass} resize-none`}
                  placeholder="Turnkey design and build with engineering tolerances..."
                />
              </div>

              {/* Hero Carousel Background Images */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <label className={labelClass}>Hero Background Carousel Images</label>
                {(settings.services_hero_images || []).map((img, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={img}
                      onChange={(e) => {
                        const updated = [...(settings.services_hero_images || [])];
                        updated[i] = e.target.value;
                        updateSetting('services_hero_images', updated);
                      }}
                      className={inpClass}
                      placeholder="https://images.unsplash.com/..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (settings.services_hero_images || []).filter((_, idx) => idx !== i);
                        updateSetting('services_hero_images', updated);
                      }}
                      className="p-3 text-red-400 hover:bg-red-500/10 rounded-lg shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...(settings.services_hero_images || []), 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1920&q=90'];
                    updateSetting('services_hero_images', updated);
                  }}
                  className="flex items-center space-x-2 text-gold text-xs font-sans font-bold uppercase pt-2"
                >
                  <Plus size={14} />
                  <span>Add Background Image</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: SERVICES SECTIONS & LIST */}
          {activeTab === 'services_list' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h2 className="font-editorial text-xl font-bold text-white">All Service Sections & Cards</h2>
                  <p className="font-sans text-xs text-white/40 mt-1">Configure service cards, descriptions, tags, and bullet points on /services.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextNum = String((settings.services_list || []).length + 1).padStart(2, '0');
                    const updated = [
                      ...(settings.services_list || []),
                      {
                        num: nextNum,
                        title: 'New Custom Service',
                        tag: 'Bespoke Offering',
                        desc: 'Description of custom interior design or execution service provided by Espacio.',
                        includes: ['Consultation & Planning', 'Turnkey Execution', 'Quality Inspection'],
                        img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'
                      }
                    ];
                    updateSetting('services_list', updated);
                  }}
                  className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-2.5 px-4 rounded-lg transition-all"
                >
                  <Plus size={14} />
                  <span>Add Service</span>
                </button>
              </div>

              {(settings.services_list || []).map((s, index) => (
                <div key={index} className="bg-[#0E0F11] border border-white/10 rounded-xl p-5 space-y-4 relative">
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="font-sans text-xs font-bold text-gold uppercase tracking-wider">Service #{index + 1} (No. {s.num})</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (settings.services_list || []).filter((_, i) => i !== index);
                        updateSetting('services_list', updated);
                      }}
                      className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg text-xs flex items-center space-x-1"
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>Number Tag</label>
                      <input
                        type="text"
                        value={s.num}
                        onChange={(e) => {
                          const updated = [...(settings.services_list || [])];
                          updated[index] = { ...updated[index], num: e.target.value };
                          updateSetting('services_list', updated);
                        }}
                        className={inpClass}
                        placeholder="01"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Service Title</label>
                      <input
                        type="text"
                        value={s.title}
                        onChange={(e) => {
                          const updated = [...(settings.services_list || [])];
                          updated[index] = { ...updated[index], title: e.target.value };
                          updateSetting('services_list', updated);
                        }}
                        className={inpClass}
                        placeholder="Service Title"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Sub-Tag / Category</label>
                      <input
                        type="text"
                        value={s.tag}
                        onChange={(e) => {
                          const updated = [...(settings.services_list || [])];
                          updated[index] = { ...updated[index], tag: e.target.value };
                          updateSetting('services_list', updated);
                        }}
                        className={inpClass}
                        placeholder="Turnkey Design & Build"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Service Description</label>
                    <textarea
                      rows={2}
                      value={s.desc}
                      onChange={(e) => {
                        const updated = [...(settings.services_list || [])];
                        updated[index] = { ...updated[index], desc: e.target.value };
                        updateSetting('services_list', updated);
                      }}
                      className={`${inpClass} resize-none`}
                      placeholder="Service details..."
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Cover Image URL</label>
                    <input
                      type="text"
                      value={s.img}
                      onChange={(e) => {
                        const updated = [...(settings.services_list || [])];
                        updated[index] = { ...updated[index], img: e.target.value };
                        updateSetting('services_list', updated);
                      }}
                      className={inpClass}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Included Points (Comma Separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(s.includes) ? s.includes.join(', ') : (s.includes || '')}
                      onChange={(e) => {
                        const points = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
                        const updated = [...(settings.services_list || [])];
                        updated[index] = { ...updated[index], includes: points };
                        updateSetting('services_list', updated);
                      }}
                      className={inpClass}
                      placeholder="Living & Dining, Modular Kitchen, Wardrobes"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: ABOUT SECTION */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="font-editorial text-xl font-bold text-white">About Section</h2>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <span className="font-sans text-xs text-white/50">Section Visible</span>
                  <div
                    onClick={() => updateSetting('about_visible', !settings.about_visible)}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                      settings.about_visible ? 'bg-gold' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        settings.about_visible ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </label>
              </div>

              <div>
                <label className={labelClass}>Sub-Tag / Eyebrow</label>
                <input
                  type="text"
                  value={settings.about_subtitle}
                  onChange={(e) => updateSetting('about_subtitle', e.target.value)}
                  className={inpClass}
                  placeholder="HERITAGE & CRAFTSMANSHIP"
                />
              </div>

              <div>
                <label className={labelClass}>About Headline</label>
                <input
                  type="text"
                  value={settings.about_title}
                  onChange={(e) => updateSetting('about_title', e.target.value)}
                  className={inpClass}
                  placeholder="Four Decades of Structural Excellence"
                />
              </div>

              <div>
                <label className={labelClass}>About Description</label>
                <textarea
                  rows={4}
                  value={settings.about_description}
                  onChange={(e) => updateSetting('about_description', e.target.value)}
                  className={`${inpClass} resize-none`}
                  placeholder="Born out of a multi-generational legacy..."
                />
              </div>

              <div>
                <label className={labelClass}>Experience Counter Value</label>
                <input
                  type="text"
                  value={settings.about_experience_years}
                  onChange={(e) => updateSetting('about_experience_years', e.target.value)}
                  className={inpClass}
                  placeholder="40+"
                />
              </div>
            </div>
          )}

          {/* TAB 3: STATS & COUNTERS */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h2 className="font-editorial text-xl font-bold text-white border-b border-white/5 pb-4">
                Stats & Counter Badges
              </h2>

              {[1, 2, 3].map((num) => (
                <div key={num} className="bg-[#0E0F11] border border-white/10 rounded-xl p-4 space-y-3">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold">
                    Counter Metric #{num}
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-1">
                      <label className={labelClass}>Value</label>
                      <input
                        type="text"
                        value={settings[`stats_item${num}_value`]}
                        onChange={(e) => updateSetting(`stats_item${num}_value`, e.target.value)}
                        className={inpClass}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className={labelClass}>Label Description</label>
                      <input
                        type="text"
                        value={settings[`stats_item${num}_label`]}
                        onChange={(e) => updateSetting(`stats_item${num}_label`, e.target.value)}
                        className={inpClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: CTA SECTION */}
          {activeTab === 'cta' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="font-editorial text-xl font-bold text-white">Call To Action Banner</h2>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <span className="font-sans text-xs text-white/50">Section Visible</span>
                  <div
                    onClick={() => updateSetting('cta_visible', !settings.cta_visible)}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                      settings.cta_visible ? 'bg-gold' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                        settings.cta_visible ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </label>
              </div>

              <div>
                <label className={labelClass}>CTA Headline</label>
                <input
                  type="text"
                  value={settings.cta_headline}
                  onChange={(e) => updateSetting('cta_headline', e.target.value)}
                  className={inpClass}
                  placeholder="Ready to Transform Your Space?"
                />
              </div>

              <div>
                <label className={labelClass}>CTA Description</label>
                <textarea
                  rows={3}
                  value={settings.cta_subtext}
                  onChange={(e) => updateSetting('cta_subtext', e.target.value)}
                  className={`${inpClass} resize-none`}
                  placeholder="Schedule a private consultation..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Button Label</label>
                  <input
                    type="text"
                    value={settings.cta_button_text}
                    onChange={(e) => updateSetting('cta_button_text', e.target.value)}
                    className={inpClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Contact Phone Number</label>
                  <input
                    type="text"
                    value={settings.cta_phone}
                    onChange={(e) => updateSetting('cta_phone', e.target.value)}
                    className={inpClass}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: HEADER NAVIGATION */}
          {activeTab === 'nav' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="font-editorial text-xl font-bold text-white">Website Navigation Bar</h2>
                <button
                  type="button"
                  onClick={addNavItem}
                  className="flex items-center space-x-1.5 bg-gold/15 text-gold border border-gold/30 px-3 py-1.5 rounded-lg text-xs font-sans uppercase font-bold hover:bg-gold/25 transition-all"
                >
                  <Plus size={13} />
                  <span>Add Link</span>
                </button>
              </div>

              <div className="space-y-3">
                {settings.nav_items.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3 bg-[#0E0F11] border border-white/10 rounded-xl p-3">
                    <div className="flex flex-col space-y-1">
                      <button
                        type="button"
                        onClick={() => moveNavItem(idx, -1)}
                        disabled={idx === 0}
                        className="text-white/30 hover:text-white disabled:opacity-20"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveNavItem(idx, 1)}
                        disabled={idx === settings.nav_items.length - 1}
                        className="text-white/30 hover:text-white disabled:opacity-20"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => handleNavItemChange(idx, 'label', e.target.value)}
                      placeholder="Label"
                      className="w-1/3 bg-[#141518] border border-white/10 rounded-lg text-xs px-3 py-2 text-white"
                    />

                    <input
                      type="text"
                      value={item.path}
                      onChange={(e) => handleNavItemChange(idx, 'path', e.target.value)}
                      placeholder="URL Path"
                      className="flex-1 bg-[#141518] border border-white/10 rounded-lg text-xs px-3 py-2 text-white"
                    />

                    <button
                      type="button"
                      onClick={() => handleNavItemChange(idx, 'visible', !item.visible)}
                      className={`px-2.5 py-1.5 rounded text-[10px] font-sans font-bold uppercase ${
                        item.visible ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-white/40'
                      }`}
                    >
                      {item.visible ? 'Visible' : 'Hidden'}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteNavItem(idx)}
                      className="text-red-400/40 hover:text-red-400 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: FOOTER & CONTACTS */}
          {activeTab === 'footer' && (
            <div className="space-y-6">
              <h2 className="font-editorial text-xl font-bold text-white border-b border-white/5 pb-4">
                Footer & Contact Information
              </h2>

              <div>
                <label className={labelClass}>Footer Brand Bio / Description</label>
                <textarea
                  rows={3}
                  value={settings.footer_description}
                  onChange={(e) => updateSetting('footer_description', e.target.value)}
                  className={`${inpClass} resize-none`}
                />
              </div>

              <div>
                <label className={labelClass}>Physical Address</label>
                <input
                  type="text"
                  value={settings.footer_address}
                  onChange={(e) => updateSetting('footer_address', e.target.value)}
                  className={inpClass}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Business Hours</label>
                  <input
                    type="text"
                    value={settings.footer_hours}
                    onChange={(e) => updateSetting('footer_hours', e.target.value)}
                    className={inpClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Contact Email</label>
                  <input
                    type="email"
                    value={settings.footer_email}
                    onChange={(e) => updateSetting('footer_email', e.target.value)}
                    className={inpClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Instagram Profile URL</label>
                <input
                  type="text"
                  value={settings.footer_instagram}
                  onChange={(e) => updateSetting('footer_instagram', e.target.value)}
                  className={inpClass}
                />
              </div>

              <div>
                <label className={labelClass}>Footer Copyright Text</label>
                <input
                  type="text"
                  value={settings.footer_copyright}
                  onChange={(e) => updateSetting('footer_copyright', e.target.value)}
                  className={inpClass}
                />
              </div>
            </div>
          )}

        </div>

        {/* Live Website Preview Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-sans text-xs uppercase tracking-widest text-gold font-bold flex items-center space-x-2">
              <Eye size={14} />
              <span>Live Website Component Preview</span>
            </span>
            <span className="font-sans text-[10px] text-white/40">Real-time styling engine</span>
          </div>

          <div className="bg-[#0E0F11] border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl relative overflow-hidden">
            
            {/* Live Preview: Hero */}
            {activeTab === 'hero' && (
              <div className="space-y-4 py-4">
                <span className="font-sans text-[10px] text-gold uppercase tracking-widest font-bold">
                  {settings.hero_visible ? '● SECTION ACTIVE' : '○ SECTION HIDDEN'}
                </span>
                <h2 className="font-editorial text-2xl font-bold text-white leading-tight">
                  {settings.hero_title || 'Hero Title Here'}
                </h2>
                <p className="font-sans text-xs text-white/60 leading-relaxed">
                  {settings.hero_subtitle || 'Hero Subtitle Here'}
                </p>
                <div className="pt-2">
                  <button className="bg-gold text-charcoal font-sans text-[11px] uppercase tracking-widest font-bold py-3 px-6 rounded-full shadow-lg">
                    {settings.hero_cta_text || 'CTA Button'}
                  </button>
                </div>
              </div>
            )}

            {/* Live Preview: About */}
            {activeTab === 'about' && (
              <div className="space-y-3 py-4 bg-[#141518] rounded-xl p-5 border border-white/5">
                <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold">
                  {settings.about_subtitle || 'SUBTITLE'}
                </span>
                <h3 className="font-editorial text-xl font-bold text-white">
                  {settings.about_title || 'About Title'}
                </h3>
                <p className="font-sans text-xs text-white/60 leading-relaxed">
                  {settings.about_description || 'About description text...'}
                </p>
                <div className="pt-2 flex items-center space-x-3">
                  <span className="font-editorial text-2xl font-bold text-gold">
                    {settings.about_experience_years}
                  </span>
                  <span className="font-sans text-[10px] uppercase tracking-wider text-white/50">
                    Years Legacy
                  </span>
                </div>
              </div>
            )}

            {/* Live Preview: Stats */}
            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 gap-3 py-2">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="bg-[#141518] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-editorial text-2xl font-bold text-gold">
                        {settings[`stats_item${num}_value`]}
                      </p>
                      <p className="font-sans text-[10px] text-white/60">
                        {settings[`stats_item${num}_label`]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Live Preview: CTA */}
            {activeTab === 'cta' && (
              <div className="bg-gradient-to-br from-charcoal via-charcoal/90 to-[#18191c] border border-gold/20 rounded-xl p-6 text-center space-y-4">
                <h3 className="font-editorial text-xl font-bold text-white">
                  {settings.cta_headline}
                </h3>
                <p className="font-sans text-xs text-white/60 max-w-xs mx-auto">
                  {settings.cta_subtext}
                </p>
                <button className="bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3 px-6 rounded-lg">
                  {settings.cta_button_text}
                </button>
              </div>
            )}

            {/* Live Preview: Navigation */}
            {activeTab === 'nav' && (
              <div className="bg-[#141518] border border-white/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="font-editorial text-sm font-bold text-gold">ESPACIO</span>
                  <span className="text-[9px] bg-gold/15 text-gold px-2 py-0.5 rounded font-sans font-bold">NAVBAR</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {settings.nav_items.filter(i => i.visible).map((item, idx) => (
                    <span key={idx} className="font-sans text-[11px] text-white/80 bg-white/5 px-2.5 py-1 rounded">
                      {item.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Live Preview: Footer */}
            {activeTab === 'footer' && (
              <div className="bg-[#141518] border border-white/10 rounded-xl p-5 space-y-4 text-xs">
                <span className="font-editorial text-base font-bold text-gold">ESPACIO Interiors</span>
                <p className="text-white/60 text-[11px] leading-relaxed">{settings.footer_description}</p>
                <div className="border-t border-white/5 pt-3 space-y-1 text-white/40 text-[10px]">
                  <p>📍 {settings.footer_address}</p>
                  <p>✉️ {settings.footer_email}</p>
                  <p>🕒 {settings.footer_hours}</p>
                </div>
                <p className="text-[9px] text-white/30 pt-2 border-t border-white/5">{settings.footer_copyright}</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminPagesCMS;
