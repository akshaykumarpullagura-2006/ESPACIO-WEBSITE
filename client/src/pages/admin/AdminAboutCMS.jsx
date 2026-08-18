import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  FileText, Save, CheckCircle, Loader2, Plus, Trash2,
  Eye, Sliders, Lock, ArrowUp, ArrowDown, Image as ImageIcon,
  Sparkles, Layers
} from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS } from '../../utils/cmsStore';
import CTASectionEditor from '../../components/admin/CTASectionEditor';

const defaultStats = [
  { value: '25+', label: 'Projects Completed' },
  { value: '100+', label: 'Happy Clients' },
  { value: '40+', label: 'Years Legacy' }
];

const defaultGenerations = [
  {
    gen: 'Generation I',
    title: 'The Civil Foundation',
    company: 'Founding Stone Masonry & Engineering',
    desc: 'Our great-grandfather laid the structural foundation of our family construction legacy in Hyderabad. Built on load-bearing precision, structural integrity, and honest material sourcing.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f0?auto=format&fit=crop&w=1000&q=80'
  },
  {
    gen: 'Generation II',
    title: 'Mantana Constructions',
    company: 'Commercial & Multi-Family Residential',
    desc: 'Expanded into large-scale residential complexes and commercial landmarks across Hyderabad. Built a reputation for zero material compromises and strict engineering tolerances.',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80'
  },
  {
    gen: 'Generation III',
    title: 'Mastana Infra',
    company: 'Iconic Private Estates & Infrastructure',
    desc: 'Pioneered luxury architectural builds and bespoke private lakefront residences — including the lakeside estate chosen as a primary filming location in the movie Guntur Kaaram.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
  },
  {
    gen: 'Generation IV',
    title: 'ESPACIO Interiors & Modular',
    company: 'Engineering-First Bespoke Interiors',
    desc: 'Fusing structural construction mastery with luxury interior architecture. We don\'t just style spaces — we engineer every wall, cabinet, and finish for lifetime permanence.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
  }
];

const defaultGalleryImages = [
  {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    title: 'Bespoke Villa Interior',
    subtitle: 'Jubilee Hills Private Residence'
  },
  {
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
    title: 'Modular Precision Joinery',
    subtitle: 'ESPACIO Studio & Workshop'
  },
  {
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
    title: 'Italian Marble Architecture',
    subtitle: 'Gachibowli Modern Estate'
  },
  {
    url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80',
    title: 'Lakeside Architectural Build',
    subtitle: 'Featured in Guntur Kaaram'
  }
];

const getNonEmpty = (val, fallback) => (val && typeof val === 'string' && val.trim().length > 0 ? val : fallback);

const AdminAboutCMS = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const fileInputHeroRef = useRef(null);
  const fileInputStoryRef = useRef(null);
  const fileInputGalleryRef = useRef(null);

  // About CMS State
  const [aboutState, setAboutState] = useState({
    // Hero
    about_hero_badge: 'About ESPACIO',
    about_hero_title: 'Four generations of construction. One new standard for design.',
    about_hero_subtitle: 'Long before ESPACIO existed, our family was already building across Hyderabad through Mantana Constructions and Mastana Infra. We bring 40 years of load-bearing precision and structural engineering to luxury interior architecture.',
    about_hero_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    about_hero_stats: defaultStats,
    about_hero_visible: true,

    // Origin Story
    about_story_badge: 'OUR ORIGIN STORY',
    about_story_main: "Most interiors don't fail because of bad design. They fail because of what's hiding behind the design — walls that were never built right in the first place.",
    about_story_highlight: "We've spent four generations making sure that never happens.",
    about_story_p1: "Long before Espacio existed, our family was already building, as builders. Our great-grandfather laid the literal foundation of a construction legacy that would run four generations deep, through two companies, Mantana Constructions and Mastana Infra, and 40+ years of homes, commercial spaces, and landmark builds across Hyderabad.",
    about_story_p2: "One of those builds is the lakeside home which was later chosen as a filming location for the movie Guntur Kaaram. Not because it was decorated well. Because it was built to be unforgettable.",
    about_story_p3: "That's the world this brand comes from. Not showrooms. Job sites. Not mood boards. Load-bearing walls, material tolerances, what actually holds up over decades and what doesn't.",
    about_story_image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80',
    about_milestone_label: 'Engineering Milestone',
    about_milestone_text: 'Lakeside residence chosen as filming location for Guntur Kaaram',
    about_milestone_visible: true,

    // Four Generations
    about_gen_badge: 'The Evolution',
    about_gen_title: 'Four Generations of Mastery',
    about_gen_subtitle: 'Hover to Expand Era',
    about_generations: defaultGenerations,

    // Mission & Vision
    about_mission_quote: '"We design spaces with intention — engineered first, styled second — so every home we touch is as functional as it is beautiful."',
    about_vision_quote: '"To redefine what interior design means — proving that real craftsmanship, not trends, is what makes a space timeless."',

    // Gallery
    about_gallery_badge: 'Visual Standards',
    about_gallery_title: 'Craftsmanship in Detail',
    about_gallery_images: defaultGalleryImages,

    // Final CTA
    about_cta_badge: 'GET IN TOUCH',
    about_cta_title: 'Ready to Transform Your Space?',
    about_cta_desc: "Let's discuss your luxury interior design and engineering requirements with our master team.",
    about_cta_btn_text: "LET'S TALK ↗",
    about_cta_btn_link: '/contact'
  });

  useEffect(() => {
    const fetchCMSData = async () => {
      const storedSettings = getCMSData(STORAGE_KEYS.SETTINGS);
      if (storedSettings) {
        setAboutState({
          about_hero_badge: getNonEmpty(storedSettings.about_hero_badge, 'About ESPACIO'),
          about_hero_title: getNonEmpty(storedSettings.about_hero_title, 'Four generations of construction. One new standard for design.'),
          about_hero_subtitle: getNonEmpty(storedSettings.about_hero_subtitle, 'Long before ESPACIO existed, our family was already building across Hyderabad through Mantana Constructions and Mastana Infra...'),
          about_hero_image: getNonEmpty(storedSettings.about_hero_image, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'),
          about_hero_stats: (Array.isArray(storedSettings.about_hero_stats) && storedSettings.about_hero_stats.length > 0)
            ? storedSettings.about_hero_stats
            : defaultStats,
          about_hero_visible: storedSettings.about_hero_visible !== false,

          about_story_badge: getNonEmpty(storedSettings.about_story_badge, 'OUR ORIGIN STORY'),
          about_story_main: getNonEmpty(storedSettings.about_story_main, "Most interiors don't fail because of bad design..."),
          about_story_highlight: getNonEmpty(storedSettings.about_story_highlight, "We've spent four generations making sure that never happens."),
          about_story_p1: getNonEmpty(storedSettings.about_story_p1, 'Long before Espacio existed...'),
          about_story_p2: getNonEmpty(storedSettings.about_story_p2, 'One of those builds is the lakeside home...'),
          about_story_p3: getNonEmpty(storedSettings.about_story_p3, "That's the world this brand comes from..."),
          about_story_image: getNonEmpty(storedSettings.about_story_image, 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80'),
          about_milestone_label: getNonEmpty(storedSettings.about_milestone_label, 'Engineering Milestone'),
          about_milestone_text: getNonEmpty(storedSettings.about_milestone_text, 'Lakeside residence chosen as filming location for Guntur Kaaram'),
          about_milestone_visible: storedSettings.about_milestone_visible !== false,

          about_gen_badge: getNonEmpty(storedSettings.about_gen_badge, 'The Evolution'),
          about_gen_title: getNonEmpty(storedSettings.about_gen_title, 'Four Generations of Mastery'),
          about_gen_subtitle: getNonEmpty(storedSettings.about_gen_subtitle, 'Hover to Expand Era'),
          about_generations: (Array.isArray(storedSettings.about_generations) && storedSettings.about_generations.length > 0)
            ? storedSettings.about_generations
            : defaultGenerations,

          about_mission_quote: getNonEmpty(storedSettings.about_mission_quote, '"We design spaces with intention..."'),
          about_vision_quote: getNonEmpty(storedSettings.about_vision_quote, '"To redefine what interior design means..."'),

          about_gallery_badge: getNonEmpty(storedSettings.about_gallery_badge, 'Visual Standards'),
          about_gallery_title: getNonEmpty(storedSettings.about_gallery_title, 'Craftsmanship in Detail'),
          about_gallery_images: (Array.isArray(storedSettings.about_gallery_images) && storedSettings.about_gallery_images.length > 0)
            ? storedSettings.about_gallery_images
            : defaultGalleryImages,

          about_cta_badge: getNonEmpty(storedSettings.about_cta_badge, 'GET IN TOUCH'),
          about_cta_title: getNonEmpty(storedSettings.about_cta_title, 'Ready to Transform Your Space?'),
          about_cta_desc: getNonEmpty(storedSettings.about_cta_desc, "Let's discuss your luxury interior design and engineering requirements..."),
          about_cta_btn_text: getNonEmpty(storedSettings.about_cta_btn_text, "LET'S TALK ↗"),
          about_cta_btn_link: getNonEmpty(storedSettings.about_cta_btn_link, '/contact')
        });
      }

      try {
        const res = await axios.get('/settings');
        if (res.data.success && res.data.data) {
          const d = res.data.data;
          setAboutState((prev) => ({
            ...prev,
            about_hero_badge: getNonEmpty(d.about_hero_badge, prev.about_hero_badge),
            about_hero_title: getNonEmpty(d.about_hero_title, prev.about_hero_title),
            about_hero_subtitle: getNonEmpty(d.about_hero_subtitle, prev.about_hero_subtitle),
            about_hero_image: getNonEmpty(d.about_hero_image, prev.about_hero_image),
            about_hero_stats: (Array.isArray(d.about_hero_stats) && d.about_hero_stats.length > 0)
              ? d.about_hero_stats
              : prev.about_hero_stats,

            about_story_badge: getNonEmpty(d.about_story_badge, prev.about_story_badge),
            about_story_main: getNonEmpty(d.about_story_main, prev.about_story_main),
            about_story_highlight: getNonEmpty(d.about_story_highlight, prev.about_story_highlight),
            about_story_p1: getNonEmpty(d.about_story_p1, prev.about_story_p1),
            about_story_p2: getNonEmpty(d.about_story_p2, prev.about_story_p2),
            about_story_p3: getNonEmpty(d.about_story_p3, prev.about_story_p3),
            about_story_image: getNonEmpty(d.about_story_image, prev.about_story_image),
            about_milestone_label: getNonEmpty(d.about_milestone_label, prev.about_milestone_label),
            about_milestone_text: getNonEmpty(d.about_milestone_text, prev.about_milestone_text),

            about_gen_badge: getNonEmpty(d.about_gen_badge, prev.about_gen_badge),
            about_gen_title: getNonEmpty(d.about_gen_title, prev.about_gen_title),
            about_gen_subtitle: getNonEmpty(d.about_gen_subtitle, prev.about_gen_subtitle),
            about_generations: (Array.isArray(d.about_generations) && d.about_generations.length > 0)
              ? d.about_generations
              : prev.about_generations,

            about_mission_quote: getNonEmpty(d.about_mission_quote, prev.about_mission_quote),
            about_vision_quote: getNonEmpty(d.about_vision_quote, prev.about_vision_quote),

            about_gallery_badge: getNonEmpty(d.about_gallery_badge, prev.about_gallery_badge),
            about_gallery_title: getNonEmpty(d.about_gallery_title, prev.about_gallery_title),
            about_gallery_images: (Array.isArray(d.about_gallery_images) && d.about_gallery_images.length > 0)
              ? d.about_gallery_images
              : prev.about_gallery_images,

            about_cta_badge: getNonEmpty(d.about_cta_badge, prev.about_cta_badge),
            about_cta_title: getNonEmpty(d.about_cta_title, prev.about_cta_title),
            about_cta_desc: getNonEmpty(d.about_cta_desc, prev.about_cta_desc),
            about_cta_btn_text: getNonEmpty(d.about_cta_btn_text, prev.about_cta_btn_text),
            about_cta_btn_link: getNonEmpty(d.about_cta_btn_link, prev.about_cta_btn_link)
          }));
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

  const handleChange = (key, val) => {
    setAboutState((prev) => {
      const updated = { ...prev, [key]: val };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...updated });
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
      ...aboutState
    };

    // Immediately persist to local storage and broadcast live update
    setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);

    try {
      await axios.put('/settings', updatedSettings);
    } catch (err) {
      console.warn('Database sync offline, updated in local CMS store.', err);
    }

    setSaving(false);
    setSaved(true);
    showNotification('About page updated successfully.');
    setTimeout(() => setSaved(false), 2000);
  };

  const inpClass = "w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 transition-all";
  const labelClass = "font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-white/50">
        <Loader2 size={24} className="animate-spin text-gold mr-3" />
        <span className="font-sans text-xs font-bold uppercase tracking-widest">Loading About CMS...</span>
      </div>
    );
  }

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
          <h1 className="font-editorial text-3xl font-bold text-white">About Page CMS</h1>
          <p className="font-sans text-xs text-white/40 mt-1">
            Manage live About Hero, Origin Story, 4 Generations of Mastery, Mission & Vision, and Gallery content.
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
              <span>About Page Published Live!</span>
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

      {/* Locked Section Indicator Banner */}
      <div className="bg-[#181510] border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-amber-300">
          <Lock size={18} className="shrink-0 text-amber-400" />
          <div className="font-sans text-xs">
            <span className="font-bold block text-white">Locked Sections (Non-Editable):</span>
            <span className="text-amber-200/70">Navbar, Footer, and the "Uncompromising Design Principles" section are locked and preserved exactly as designed.</span>
          </div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
        {[
          { id: 'hero', label: '1. About Hero & Stats' },
          { id: 'story', label: '2. Origin Story' },
          { id: 'gen', label: '3. 4 Generations' },
          { id: 'mission', label: '4. Mission & Vision' },
          { id: 'gallery', label: '5. Gallery' },
          { id: 'cta', label: '6. CTA Section' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-md ${
              activeTab === tab.id
                ? 'bg-gold text-charcoal border border-gold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
                : 'bg-[#141518] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB: CTA SECTION */}
      {activeTab === 'cta' && (
        <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 max-w-4xl">
          <CTASectionEditor pageKey="about" pageTitle="About" />
        </div>
      )}

      {/* TAB 1: HERO & STATS */}
      {activeTab === 'hero' && (
        <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="font-editorial text-xl font-bold text-white border-b border-white/5 pb-3">1. Hero Section & Statistics</h2>

          <input
            type="file"
            ref={fileInputHeroRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, (dataUrl) => handleChange('about_hero_image', dataUrl))}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Hero Eyebrow Tag</label>
              <input
                type="text"
                value={aboutState.about_hero_badge}
                onChange={(e) => handleChange('about_hero_badge', e.target.value)}
                className={inpClass}
              />
            </div>
            <div>
              <label className={labelClass}>Hero Background Image</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={aboutState.about_hero_image || ''}
                  onChange={(e) => handleChange('about_hero_image', e.target.value)}
                  className={inpClass}
                />
                <button
                  type="button"
                  onClick={() => fileInputHeroRef.current?.click()}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-3 rounded-lg font-sans text-[11px] font-bold uppercase shrink-0"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Hero Main Title</label>
            <textarea
              rows={2}
              value={aboutState.about_hero_title}
              onChange={(e) => handleChange('about_hero_title', e.target.value)}
              className={`${inpClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>Hero Subtitle / Description</label>
            <textarea
              rows={3}
              value={aboutState.about_hero_subtitle}
              onChange={(e) => handleChange('about_hero_subtitle', e.target.value)}
              className={`${inpClass} resize-none`}
            />
          </div>

          {/* Statistics Editor */}
          <div className="space-y-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between">
              <label className={labelClass}>Hero Statistics Cards (4 Cards)</label>
              <button
                type="button"
                onClick={() => {
                  const updated = [...(aboutState.about_hero_stats || []), { value: '100+', label: 'New Metric' }];
                  handleChange('about_hero_stats', updated);
                }}
                className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg font-sans text-[10px] font-bold uppercase"
              >
                <Plus size={12} />
                <span>Add Stat Metric</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(aboutState.about_hero_stats || []).map((st, sIdx) => (
                <div key={sIdx} className="bg-[#0E0F11] border border-white/10 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[10px] font-bold text-gold uppercase tracking-wider">Stat 0{sIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (aboutState.about_hero_stats || []).filter((_, i) => i !== sIdx);
                        handleChange('about_hero_stats', updated);
                      }}
                      className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg text-xs"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelClass}>Value (e.g. 25+)</label>
                      <input
                        type="text"
                        value={st.value || ''}
                        onChange={(e) => {
                          const updated = [...(aboutState.about_hero_stats || [])];
                          updated[sIdx] = { ...updated[sIdx], value: e.target.value };
                          handleChange('about_hero_stats', updated);
                        }}
                        className={inpClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Label Text</label>
                      <input
                        type="text"
                        value={st.label || ''}
                        onChange={(e) => {
                          const updated = [...(aboutState.about_hero_stats || [])];
                          updated[sIdx] = { ...updated[sIdx], label: e.target.value };
                          handleChange('about_hero_stats', updated);
                        }}
                        className={inpClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORIGIN STORY */}
      {activeTab === 'story' && (
        <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="font-editorial text-xl font-bold text-white border-b border-white/5 pb-3">2. Origin Story Section</h2>

          <input
            type="file"
            ref={fileInputStoryRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, (dataUrl) => handleChange('about_story_image', dataUrl))}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Origin Story Eyebrow</label>
              <input
                type="text"
                value={aboutState.about_story_badge}
                onChange={(e) => handleChange('about_story_badge', e.target.value)}
                className={inpClass}
              />
            </div>
            <div>
              <label className={labelClass}>Story Feature Image</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={aboutState.about_story_image || ''}
                  onChange={(e) => handleChange('about_story_image', e.target.value)}
                  className={inpClass}
                />
                <button
                  type="button"
                  onClick={() => fileInputStoryRef.current?.click()}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-3 rounded-lg font-sans text-[11px] font-bold uppercase shrink-0"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className={labelClass}>Main Headline Statement</label>
            <textarea
              rows={2}
              value={aboutState.about_story_main}
              onChange={(e) => handleChange('about_story_main', e.target.value)}
              className={`${inpClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>Highlight Subheading</label>
            <input
              type="text"
              value={aboutState.about_story_highlight}
              onChange={(e) => handleChange('about_story_highlight', e.target.value)}
              className={inpClass}
            />
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <label className={labelClass}>Story Paragraph 1 (Heritage & Mantana / Mastana)</label>
              <textarea
                rows={3}
                value={aboutState.about_story_p1}
                onChange={(e) => handleChange('about_story_p1', e.target.value)}
                className={`${inpClass} resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>Story Paragraph 2 (Guntur Kaaram Lakeside Build)</label>
              <textarea
                rows={3}
                value={aboutState.about_story_p2}
                onChange={(e) => handleChange('about_story_p2', e.target.value)}
                className={`${inpClass} resize-none`}
              />
            </div>
            <div>
              <label className={labelClass}>Story Paragraph 3 (Engineering First Philosophy)</label>
              <textarea
                rows={3}
                value={aboutState.about_story_p3}
                onChange={(e) => handleChange('about_story_p3', e.target.value)}
                className={`${inpClass} resize-none`}
              />
            </div>
          </div>

          {/* Engineering Milestone Overlay Card */}
          <div className="pt-4 border-t border-white/5 space-y-4">
            <h3 className="font-sans text-xs font-bold text-gold uppercase tracking-wider">Engineering Milestone Overlay Card</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Milestone Eyebrow Tag</label>
                <input
                  type="text"
                  value={aboutState.about_milestone_label}
                  onChange={(e) => handleChange('about_milestone_label', e.target.value)}
                  className={inpClass}
                />
              </div>
              <div>
                <label className={labelClass}>Milestone Highlight Text</label>
                <input
                  type="text"
                  value={aboutState.about_milestone_text}
                  onChange={(e) => handleChange('about_milestone_text', e.target.value)}
                  className={inpClass}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 4 GENERATIONS */}
      {activeTab === 'gen' && (
        <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div>
              <h2 className="font-editorial text-xl font-bold text-white">3. Four Generations of Mastery</h2>
              <p className="font-sans text-xs text-white/40 mt-0.5">Edit title, era cards, description, and company names.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Section Eyebrow</label>
              <input
                type="text"
                value={aboutState.about_gen_badge}
                onChange={(e) => handleChange('about_gen_badge', e.target.value)}
                className={inpClass}
              />
            </div>
            <div>
              <label className={labelClass}>Section Main Heading</label>
              <input
                type="text"
                value={aboutState.about_gen_title}
                onChange={(e) => handleChange('about_gen_title', e.target.value)}
                className={inpClass}
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {(aboutState.about_generations || []).map((genCard, gIdx) => (
              <div key={gIdx} className="bg-[#0E0F11] border border-white/10 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="font-sans text-xs font-bold text-gold uppercase tracking-wider">{genCard.gen || `Generation 0${gIdx + 1}`}</span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (gIdx === 0) return;
                        const updated = [...(aboutState.about_generations || [])];
                        const temp = updated[gIdx];
                        updated[gIdx] = updated[gIdx - 1];
                        updated[gIdx - 1] = temp;
                        handleChange('about_generations', updated);
                      }}
                      disabled={gIdx === 0}
                      className="p-1 text-white/30 hover:text-white disabled:opacity-20"
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (gIdx === (aboutState.about_generations || []).length - 1) return;
                        const updated = [...(aboutState.about_generations || [])];
                        const temp = updated[gIdx];
                        updated[gIdx] = updated[gIdx + 1];
                        updated[gIdx + 1] = temp;
                        handleChange('about_generations', updated);
                      }}
                      disabled={gIdx === (aboutState.about_generations || []).length - 1}
                      className="p-1 text-white/30 hover:text-white disabled:opacity-20"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className={labelClass}>Generation Era Tag</label>
                    <input
                      type="text"
                      value={genCard.gen || ''}
                      onChange={(e) => {
                        const updated = [...(aboutState.about_generations || [])];
                        updated[gIdx] = { ...updated[gIdx], gen: e.target.value };
                        handleChange('about_generations', updated);
                      }}
                      className={inpClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Era Title / Name</label>
                    <input
                      type="text"
                      value={genCard.title || ''}
                      onChange={(e) => {
                        const updated = [...(aboutState.about_generations || [])];
                        updated[gIdx] = { ...updated[gIdx], title: e.target.value };
                        handleChange('about_generations', updated);
                      }}
                      className={inpClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Company Subtitle</label>
                    <input
                      type="text"
                      value={genCard.company || ''}
                      onChange={(e) => {
                        const updated = [...(aboutState.about_generations || [])];
                        updated[gIdx] = { ...updated[gIdx], company: e.target.value };
                        handleChange('about_generations', updated);
                      }}
                      className={inpClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Era Narrative Description</label>
                  <textarea
                    rows={3}
                    value={genCard.desc || ''}
                    onChange={(e) => {
                      const updated = [...(aboutState.about_generations || [])];
                      updated[gIdx] = { ...updated[gIdx], desc: e.target.value };
                      handleChange('about_generations', updated);
                    }}
                    className={`${inpClass} resize-none`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MISSION & VISION */}
      {activeTab === 'mission' && (
        <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="font-editorial text-xl font-bold text-white border-b border-white/5 pb-3">4. Mission & Vision Statements</h2>

          <div className="space-y-5">
            <div>
              <label className={labelClass}>Our Mission Quote</label>
              <textarea
                rows={3}
                value={aboutState.about_mission_quote}
                onChange={(e) => handleChange('about_mission_quote', e.target.value)}
                className={`${inpClass} resize-none`}
              />
            </div>

            <div>
              <label className={labelClass}>Our Vision Quote</label>
              <textarea
                rows={3}
                value={aboutState.about_vision_quote}
                onChange={(e) => handleChange('about_vision_quote', e.target.value)}
                className={`${inpClass} resize-none`}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GALLERY & CTA */}
      {activeTab === 'gallery' && (
        <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="font-editorial text-xl font-bold text-white border-b border-white/5 pb-3">5. Gallery & Final CTA Section</h2>

          <input
            type="file"
            ref={fileInputGalleryRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileUpload(e, (dataUrl) => {
              const updated = [
                ...(aboutState.about_gallery_images || []),
                { url: dataUrl, title: 'New Craftsmanship Photo', subtitle: 'ESPACIO Studio' }
              ];
              handleChange('about_gallery_images', updated);
            })}
          />

          {/* Gallery Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className={labelClass}>Craftsmanship Gallery Grid Images ({aboutState.about_gallery_images?.length || 0})</label>
              <button
                type="button"
                onClick={() => fileInputGalleryRef.current?.click()}
                className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg font-sans text-[11px] font-bold uppercase transition-all"
              >
                <Plus size={12} />
                <span>Upload Gallery Image</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(aboutState.about_gallery_images || []).map((gImg, gIdx) => (
                <div key={gIdx} className="bg-[#0E0F11] border border-white/10 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[10px] font-bold text-gold uppercase tracking-wider">Image 0{gIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (aboutState.about_gallery_images || []).filter((_, i) => i !== gIdx);
                        handleChange('about_gallery_images', updated);
                      }}
                      className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg text-xs"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <img src={gImg.url} alt="Preview" className="w-16 h-16 object-cover rounded-lg border border-white/10 shrink-0" />
                    <input
                      type="text"
                      value={gImg.url || ''}
                      onChange={(e) => {
                        const updated = [...(aboutState.about_gallery_images || [])];
                        updated[gIdx] = { ...updated[gIdx], url: e.target.value };
                        handleChange('about_gallery_images', updated);
                      }}
                      className={inpClass}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className={labelClass}>Image Title</label>
                      <input
                        type="text"
                        value={gImg.title || ''}
                        onChange={(e) => {
                          const updated = [...(aboutState.about_gallery_images || [])];
                          updated[gIdx] = { ...updated[gIdx], title: e.target.value };
                          handleChange('about_gallery_images', updated);
                        }}
                        className={inpClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Location / Subtitle</label>
                      <input
                        type="text"
                        value={gImg.subtitle || ''}
                        onChange={(e) => {
                          const updated = [...(aboutState.about_gallery_images || [])];
                          updated[gIdx] = { ...updated[gIdx], subtitle: e.target.value };
                          handleChange('about_gallery_images', updated);
                        }}
                        className={inpClass}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="pt-6 border-t border-white/5 space-y-4">
            <h3 className="font-sans text-xs font-bold text-gold uppercase tracking-wider">Final Call To Action (CTA) Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>CTA Eyebrow</label>
                <input
                  type="text"
                  value={aboutState.about_cta_badge}
                  onChange={(e) => handleChange('about_cta_badge', e.target.value)}
                  className={inpClass}
                />
              </div>
              <div>
                <label className={labelClass}>CTA Main Heading</label>
                <input
                  type="text"
                  value={aboutState.about_cta_title}
                  onChange={(e) => handleChange('about_cta_title', e.target.value)}
                  className={inpClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>CTA Description</label>
              <textarea
                rows={2}
                value={aboutState.about_cta_desc}
                onChange={(e) => handleChange('about_cta_desc', e.target.value)}
                className={`${inpClass} resize-none`}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Button Text</label>
                <input
                  type="text"
                  value={aboutState.about_cta_btn_text}
                  onChange={(e) => handleChange('about_cta_btn_text', e.target.value)}
                  className={inpClass}
                />
              </div>
              <div>
                <label className={labelClass}>Button Link</label>
                <input
                  type="text"
                  value={aboutState.about_cta_btn_link}
                  onChange={(e) => handleChange('about_cta_btn_link', e.target.value)}
                  className={inpClass}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAboutCMS;
