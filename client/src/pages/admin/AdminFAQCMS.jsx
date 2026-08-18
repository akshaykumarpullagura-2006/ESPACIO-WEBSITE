import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  HelpCircle, Save, CheckCircle, Loader2, Plus, Trash2,
  Eye, Sliders, ArrowUp, ArrowDown, Filter, Layers,
  CheckCircle2, Search, SlidersHorizontal, Image as ImageIcon
} from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS } from '../../utils/cmsStore';
import CTASectionEditor from '../../components/admin/CTASectionEditor';

const defaultFaqCategories = [
  { id: 'cat-1', name: 'TIMELINE', slug: 'timeline', visible: true, order: 1 },
  { id: 'cat-2', name: 'SERVICES', slug: 'services', visible: true, order: 2 },
  { id: 'cat-3', name: 'PROCESS', slug: 'process', visible: true, order: 3 },
  { id: 'cat-4', name: 'LOCATION', slug: 'location', visible: true, order: 4 },
  { id: 'cat-5', name: 'PRICING', slug: 'pricing', visible: true, order: 5 },
  { id: 'cat-6', name: 'MATERIALS', slug: 'materials', visible: true, order: 6 },
  { id: 'cat-7', name: 'INVOLVEMENT', slug: 'involvement', visible: true, order: 7 },
  { id: 'cat-8', name: 'CUSTOM', slug: 'custom', visible: true, order: 8 },
  { id: 'cat-9', name: 'DESIGN', slug: 'design', visible: true, order: 9 },
  { id: 'cat-10', name: 'SUPPORT', slug: 'support', visible: true, order: 10 }
];

const defaultSharedFaqs = [
  {
    id: 'faq-1',
    question: 'How long does a project usually take?',
    answer: 'Typically 2–3 months, depending on the level of detailing and customization involved in your project.',
    category: 'TIMELINE',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    imageLabel: 'TIMELINE',
    imageCaption: 'How long does a project usually take?',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 1,
    homeOrder: 1,
    status: 'Published'
  },
  {
    id: 'faq-2',
    question: 'Do you provide turnkey interior solutions?',
    answer: 'Yes. Every project we take on, residential or commercial, is delivered turnkey, with design, materials, execution, and finishing handled entirely by our team.',
    category: 'SERVICES',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    imageLabel: 'SERVICES',
    imageCaption: 'Do you provide turnkey interior solutions?',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 2,
    homeOrder: 2,
    status: 'Published'
  },
  {
    id: 'faq-3',
    question: 'What is your consultation process?',
    answer: 'We begin with a free consultation to understand your space, requirements, and vision, before moving into detailed design and planning.',
    category: 'PROCESS',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    imageLabel: 'PROCESS',
    imageCaption: 'What is your consultation process?',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 3,
    homeOrder: 3,
    status: 'Published'
  },
  {
    id: 'faq-4',
    question: 'Which locations do you currently serve?',
    answer: "We're proudly based in Hyderabad and have delivered residential and commercial projects across the city.",
    category: 'LOCATION',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    imageLabel: 'LOCATION',
    imageCaption: 'Which locations do you currently serve?',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 4,
    homeOrder: 4,
    status: 'Published'
  },
  {
    id: 'faq-5',
    question: 'How can customers request a quotation?',
    answer: 'Simply fill out our contact form on the website, and our team will get back to you to discuss your project.',
    category: 'PRICING',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    imageLabel: 'PRICING',
    imageCaption: 'How can customers request a quotation?',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 5,
    homeOrder: 5,
    status: 'Published'
  },
  {
    id: 'faq-6',
    question: 'Do you sell materials separately from design services?',
    answer: 'Yes. Our materials including WPC panels, polygranite sheets, acrylic sheets, and more are available for standalone purchase, without needing to book a full design or execution project with us.',
    category: 'MATERIALS',
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
    imageLabel: 'MATERIALS',
    imageCaption: 'Do you sell materials separately from design services?',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 6,
    homeOrder: 6,
    status: 'Published'
  },
  {
    id: 'faq-7',
    question: 'Do I need to be involved throughout the project, or can it be handled remotely?',
    answer: "We keep you informed at every key stage with regular updates and site visits, so you're never left in the dark, but you don't need to manage day-to-day execution yourself. That's what turnkey means.",
    category: 'INVOLVEMENT',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
    imageLabel: 'INVOLVEMENT',
    imageCaption: 'Do I need to be involved throughout the project?',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 7,
    homeOrder: 7,
    status: 'Published'
  },
  {
    id: 'faq-8',
    question: 'What if I already have a design in mind, can you just execute it?',
    answer: 'Absolutely. Whether you come with a finalized design or need us to design from scratch, we can adapt to execution-only or full design-and-build depending on what you need.',
    category: 'CUSTOM',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    imageLabel: 'CUSTOM',
    imageCaption: 'What if I already have a design in mind?',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 8,
    homeOrder: 8,
    status: 'Published'
  },
  {
    id: 'faq-9',
    question: 'Can I customize designs, or do you offer fixed packages?',
    answer: "Every project is fully customized around your space and preferences — we don't work off fixed templates or set packages.",
    category: 'DESIGN',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    imageLabel: 'DESIGN',
    imageCaption: 'Can I customize designs, or do you offer fixed packages?',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 9,
    homeOrder: 9,
    status: 'Published'
  },
  {
    id: 'faq-10',
    question: 'What happens if something needs repair after project completion?',
    answer: "Any issues within our warranty period are addressed directly by our team. Reach out through the contact form and we'll take care of it.",
    category: 'SUPPORT',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    imageLabel: 'SUPPORT',
    imageCaption: 'What happens if something needs repair after project completion?',
    showOnFaqPage: true,
    showOnHome: true,
    faqPageOrder: 10,
    homeOrder: 10,
    status: 'Published'
  }
];

const defaultShowcaseSlides = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
    tag: 'TIMELINE',
    caption: 'How long does a project usually take?'
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    tag: 'SERVICES',
    caption: 'Do you provide turnkey interior solutions?'
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    tag: 'PROCESS',
    caption: 'What is your consultation process?'
  },
  {
    id: 'slide-4',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    tag: 'LOCATION',
    caption: 'Which locations do you currently serve?'
  },
  {
    id: 'slide-5',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    tag: 'PRICING',
    caption: 'How can customers request a quotation?'
  }
];

const getNonEmpty = (val, fallback) => (val && typeof val === 'string' && val.trim().length > 0 ? val : fallback);

const AdminFAQCMS = () => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'slides' | 'categories' | 'header'
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedFaqIdx, setSelectedFaqIdx] = useState(0);

  const fileInputImageRef = useRef(null);

  // Header & Settings State
  const [faqHeaderState, setFaqHeaderState] = useState({
    faq_eyebrow: 'Frequently Asked',
    faq_title: 'Got Questions?\nWe Have Answers.',
    faq_description: 'Everything you need to know about working with ESPACIO — from first call to final handover.'
  });

  const [categories, setCategories] = useState(defaultFaqCategories);
  const [faqsList, setFaqsList] = useState(defaultSharedFaqs);
  const [showcaseSlides, setShowcaseSlides] = useState(defaultShowcaseSlides);

  useEffect(() => {
    const fetchCMSData = async () => {
      const storedFaqs = getCMSData(STORAGE_KEYS.FAQS);
      const storedSettings = getCMSData(STORAGE_KEYS.SETTINGS);

      if (storedSettings) {
        setFaqHeaderState({
          faq_eyebrow: getNonEmpty(storedSettings.faq_eyebrow, 'Frequently Asked'),
          faq_title: getNonEmpty(storedSettings.faq_title, 'Got Questions?\nWe Have Answers.'),
          faq_description: getNonEmpty(storedSettings.faq_description, 'Everything you need to know about working with ESPACIO — from first call to final handover.')
        });

        if (Array.isArray(storedSettings.faq_categories) && storedSettings.faq_categories.length > 0) {
          setCategories(storedSettings.faq_categories);
        }

        if (Array.isArray(storedSettings.faq_showcase_slides) && storedSettings.faq_showcase_slides.length > 0) {
          setShowcaseSlides(storedSettings.faq_showcase_slides);
        }
      }

      if (Array.isArray(storedFaqs) && storedFaqs.length > 0) {
        setFaqsList(storedFaqs);
      }

      try {
        const res = await axios.get('/faqs');
        if (res.data.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setFaqsList(res.data.data);
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

  const handleHeaderChange = (key, val) => {
    setFaqHeaderState((prev) => {
      const updated = { ...prev, [key]: val };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...updated, faq_categories: categories });
      return updated;
    });
  };

  const handleFaqChange = (idx, key, val) => {
    setFaqsList((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [key]: val };
      setCMSData(STORAGE_KEYS.FAQS, updated);
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
      ...faqHeaderState,
      faq_categories: categories,
      faq_showcase_slides: showcaseSlides
    };

    try {
      await axios.put('/settings', updatedSettings);
      await axios.put('/faqs', { faqs: faqsList });
    } catch (err) {
      console.warn('Database sync offline, updated in local CMS store.');
    }

    setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);
    setCMSData(STORAGE_KEYS.FAQS, faqsList);
    setSaving(false);
    setSaved(true);
    showNotification('FAQ system & Showcase Slides updated successfully.');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: `slide-${Date.now().toString().slice(-4)}`,
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      tag: 'NEW FEATURE',
      caption: 'New Custom Showcase Slide Caption'
    };
    const updated = [...showcaseSlides, newSlide];
    setShowcaseSlides(updated);
    const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, faq_showcase_slides: updated });
    showNotification('New Showcase Slide added.');
  };

  const handleDeleteSlide = (idx) => {
    if (showcaseSlides.length <= 1) {
      alert('You must keep at least one showcase slide.');
      return;
    }
    if (window.confirm('Delete this showcase slide?')) {
      const updated = showcaseSlides.filter((_, i) => i !== idx);
      setShowcaseSlides(updated);
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, faq_showcase_slides: updated });
      showNotification('Showcase Slide removed.');
    }
  };

  const handleMoveSlide = (idx, direction) => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === showcaseSlides.length - 1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...showcaseSlides];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setShowcaseSlides(updated);
    const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, faq_showcase_slides: updated });
  };

  const handleSlideChange = (idx, key, val) => {
    setShowcaseSlides((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [key]: val };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, faq_showcase_slides: updated });
      return updated;
    });
  };

  const handleAddFaq = () => {
    const newFaq = {
      id: `faq-${Date.now().toString().slice(-4)}`,
      question: 'New Custom FAQ Question?',
      answer: 'ESPACIO provides comprehensive turnkey design and engineering solutions tailored for luxury spaces.',
      category: categories[0]?.name || 'GENERAL',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      imageLabel: categories[0]?.name || 'GENERAL',
      imageCaption: 'New Custom FAQ Question?',
      showOnFaqPage: true,
      showOnHome: true,
      faqPageOrder: faqsList.length + 1,
      homeOrder: faqsList.length + 1,
      status: 'Published'
    };
    const updated = [...faqsList, newFaq];
    setFaqsList(updated);
    setSelectedFaqIdx(faqsList.length);
    setCMSData(STORAGE_KEYS.FAQS, updated);
    showNotification('New FAQ added.');
  };

  const handleDeleteFaq = (idx) => {
    if (faqsList.length <= 1) {
      alert('You must keep at least one FAQ record.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete "${faqsList[idx].question}"?`)) {
      const updated = faqsList.filter((_, i) => i !== idx);
      setFaqsList(updated);
      setSelectedFaqIdx(0);
      setCMSData(STORAGE_KEYS.FAQS, updated);
      showNotification('FAQ removed.');
    }
  };

  const handleMoveFaq = (idx, direction) => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === faqsList.length - 1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...faqsList];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    // Resequence order
    const resequenced = updated.map((item, i) => ({
      ...item,
      faqPageOrder: i + 1
    }));

    setFaqsList(resequenced);
    setSelectedFaqIdx(targetIdx);
    setCMSData(STORAGE_KEYS.FAQS, resequenced);
  };

  const handleAddCategory = () => {
    const catName = prompt('Enter New Category Name (e.g. WARRANTY):');
    if (!catName || catName.trim().length === 0) return;
    const upper = catName.trim().toUpperCase();
    const newCat = {
      id: `cat-${Date.now().toString().slice(-4)}`,
      name: upper,
      slug: upper.toLowerCase(),
      visible: true,
      order: categories.length + 1
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, faq_categories: updated });
    showNotification(`Category "${upper}" added.`);
  };

  const handleDeleteCategory = (catIdx) => {
    if (categories.length <= 1) {
      alert('You must keep at least one category.');
      return;
    }
    if (window.confirm(`Delete category "${categories[catIdx].name}"?`)) {
      const updated = categories.filter((_, i) => i !== catIdx);
      setCategories(updated);
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, faq_categories: updated });
      showNotification('Category removed.');
    }
  };

  const inpClass = "w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 transition-all";
  const labelClass = "font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-white/50">
        <Loader2 size={24} className="animate-spin text-gold mr-3" />
        <span className="font-sans text-xs font-bold uppercase tracking-widest">Loading FAQ CMS...</span>
      </div>
    );
  }

  const currentFaq = faqsList[selectedFaqIdx] || faqsList[0];

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
          <h1 className="font-editorial text-3xl font-bold text-white">FAQ CMS & Shared Database</h1>
          <p className="font-sans text-xs text-white/40 mt-1">
            One Shared FAQ Database feeding both the dedicated FAQ Page (/faqs) and Home Page FAQ section with independent display controls.
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
              <span>FAQ System Published Live!</span>
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
          <HelpCircle size={16} />
          <span>Manage FAQs ({faqsList.length} Questions)</span>
        </button>
        <button
          onClick={() => setActiveTab('slides')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-md ${
            activeTab === 'slides'
              ? 'bg-gold text-charcoal border border-gold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
              : 'bg-[#141518] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          <ImageIcon size={16} />
          <span>Showcase Image Slides ({showcaseSlides.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-md ${
            activeTab === 'categories'
              ? 'bg-gold text-charcoal border border-gold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
              : 'bg-[#141518] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          <Filter size={16} />
          <span>Categories & Filters ({categories.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('header')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-md ${
            activeTab === 'header'
              ? 'bg-gold text-charcoal border border-gold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
              : 'bg-[#141518] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          <SlidersHorizontal size={16} />
          <span>FAQ Page Header Text</span>
        </button>
        <button
          onClick={() => setActiveTab('cta')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-md ${
            activeTab === 'cta'
              ? 'bg-gold text-charcoal border border-gold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
              : 'bg-[#141518] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          <HelpCircle size={16} />
          <span>CTA Section</span>
        </button>
      </div>

      {/* TAB: CTA SECTION EDITOR */}
      {activeTab === 'cta' && (
        <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 max-w-4xl">
          <CTASectionEditor pageKey="faqs" pageTitle="FAQs" />
        </div>
      )}

      {/* TAB 1: FAQ MANAGER (SHARED DATABASE) */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: FAQ Selector List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-sans text-xs font-bold uppercase tracking-wider text-white/60">FAQ Database ({faqsList.length})</span>
              <button
                type="button"
                onClick={handleAddFaq}
                className="flex items-center space-x-1 bg-gold/15 text-gold border border-gold/30 hover:bg-gold hover:text-charcoal px-3 py-1.5 rounded-lg font-sans text-xs font-bold uppercase transition-all"
              >
                <Plus size={13} />
                <span>Add FAQ</span>
              </button>
            </div>

            <div data-lenis-prevent className="space-y-2 max-h-[500px] overflow-y-auto pr-3 scrollbar-thin scrollbar-thumb-gold/60 scrollbar-track-white/5 hover:scrollbar-thumb-gold transition-all">
              {faqsList.map((faq, idx) => {
                const isSelected = idx === selectedFaqIdx;
                const seq = String(idx + 1).padStart(2, '0');
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedFaqIdx(idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-gold/15 border-gold/40 shadow-lg'
                        : 'bg-[#141518] border-white/5 hover:border-white/20 hover:bg-white/2'
                    }`}
                  >
                    <div className="flex items-center space-x-3 truncate">
                      <span className="font-sans text-xs font-bold text-gold shrink-0">{seq}</span>
                      <div className="truncate">
                        <h4 className="font-sans text-xs font-bold text-white truncate">{faq.question || faq.q}</h4>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="font-sans text-[9px] bg-white/10 text-white/60 px-2 py-0.5 rounded font-bold uppercase">{faq.category || faq.tag || 'General'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0 ml-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleMoveFaq(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-white/30 hover:text-white disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveFaq(idx, 'down')}
                        disabled={idx === faqsList.length - 1}
                        className="p-1 text-white/30 hover:text-white disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(idx)}
                        className="p-1 text-red-400/40 hover:text-red-400"
                        title="Delete FAQ"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected FAQ Editor */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <span className="font-sans text-[10px] font-bold text-gold uppercase tracking-widest">
                    Editing FAQ {String(selectedFaqIdx + 1).padStart(2, '0')} (ID: {currentFaq.id || 'shared'})
                  </span>
                  <h3 className="font-editorial text-xl font-bold text-white truncate max-w-[450px]">{currentFaq.question || currentFaq.q}</h3>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className={labelClass}>FAQ Question Text</label>
                  <input
                    type="text"
                    value={currentFaq.question || currentFaq.q || ''}
                    onChange={(e) => {
                      handleFaqChange(selectedFaqIdx, 'question', e.target.value);
                      handleFaqChange(selectedFaqIdx, 'q', e.target.value);
                    }}
                    className={inpClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>FAQ Answer Text</label>
                  <textarea
                    rows={4}
                    value={currentFaq.answer || currentFaq.a || ''}
                    onChange={(e) => {
                      handleFaqChange(selectedFaqIdx, 'answer', e.target.value);
                      handleFaqChange(selectedFaqIdx, 'a', e.target.value);
                    }}
                    className={`${inpClass} resize-none`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Category Filter</label>
                    <select
                      value={(currentFaq.category || currentFaq.tag || 'TIMELINE').toUpperCase()}
                      onChange={(e) => {
                        handleFaqChange(selectedFaqIdx, 'category', e.target.value);
                        handleFaqChange(selectedFaqIdx, 'tag', e.target.value);
                      }}
                      className={inpClass}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name.toUpperCase()}>{c.name.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      value={currentFaq.status || 'Published'}
                      onChange={(e) => handleFaqChange(selectedFaqIdx, 'status', e.target.value)}
                      className={inpClass}
                    >
                      <option value="Published">Published</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: SHOWCASE IMAGE SLIDES (3D Card Slider Above Filters) */}
      {activeTab === 'slides' && (
        <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <h2 className="font-editorial text-xl font-bold text-white">Showcase Image Cards (Above Filter Pills)</h2>
              <p className="font-sans text-xs text-white/40 mt-0.5">
                Manage the images, tag labels (e.g. SERVICES), and caption questions displayed inside the left 3D Tilt Card slider on /faqs.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddSlide}
              className="flex items-center space-x-1.5 bg-gold text-charcoal px-4 py-2 rounded-lg font-sans text-xs font-bold uppercase shadow-md shrink-0"
            >
              <Plus size={14} />
              <span>Add Showcase Slide</span>
            </button>
          </div>

          <div className="space-y-6">
            {showcaseSlides.map((slide, sIdx) => (
              <div key={slide.id || sIdx} className="bg-[#0E0F11] border border-white/10 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="font-sans text-xs font-bold text-gold uppercase tracking-wider">
                    Slide {String(sIdx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleMoveSlide(sIdx, 'up')}
                      disabled={sIdx === 0}
                      className="p-1.5 text-white/40 hover:text-white disabled:opacity-20"
                      title="Move Up"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveSlide(sIdx, 'down')}
                      disabled={sIdx === showcaseSlides.length - 1}
                      className="p-1.5 text-white/40 hover:text-white disabled:opacity-20"
                      title="Move Down"
                    >
                      <ArrowDown size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(sIdx)}
                      className="p-1.5 text-red-400/50 hover:text-red-400"
                      title="Delete Slide"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  {/* Image Preview & Upload */}
                  <div className="lg:col-span-5 space-y-2">
                    <label className={labelClass}>Slide Image</label>
                    <div className="flex items-center space-x-3">
                      <img
                        src={slide.image || 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'}
                        alt="Slide preview"
                        className="w-24 h-16 object-cover rounded-xl border border-white/10 shrink-0 shadow-md"
                      />
                      <input
                        type="text"
                        value={slide.image || ''}
                        onChange={(e) => handleSlideChange(sIdx, 'image', e.target.value)}
                        className={inpClass}
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>

                  {/* Tag Overlay Label */}
                  <div className="lg:col-span-3 space-y-2">
                    <label className={labelClass}>Tag Label on Image (e.g. SERVICES)</label>
                    <input
                      type="text"
                      value={slide.tag || ''}
                      onChange={(e) => handleSlideChange(sIdx, 'tag', e.target.value.toUpperCase())}
                      className={inpClass}
                      placeholder="SERVICES"
                    />
                  </div>

                  {/* Caption Question Overlay */}
                  <div className="lg:col-span-4 space-y-2">
                    <label className={labelClass}>Caption / Question Text on Image</label>
                    <input
                      type="text"
                      value={slide.caption || ''}
                      onChange={(e) => handleSlideChange(sIdx, 'caption', e.target.value)}
                      className={inpClass}
                      placeholder="Do you provide turnkey interior solutions?"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: CATEGORY MANAGER */}
      {activeTab === 'categories' && (
        <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <h2 className="font-editorial text-xl font-bold text-white">Category & Filter Pills Manager</h2>
              <p className="font-sans text-xs text-white/40 mt-0.5">Edit category tags used on the /faqs filter bar.</p>
            </div>
            <button
              type="button"
              onClick={handleAddCategory}
              className="flex items-center space-x-1.5 bg-gold text-charcoal px-4 py-2 rounded-lg font-sans text-xs font-bold uppercase shadow-md"
            >
              <Plus size={14} />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, cIdx) => (
              <div key={cat.id || cIdx} className="bg-[#0E0F11] border border-white/10 p-4 rounded-xl flex items-center justify-between">
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => {
                    const updated = [...categories];
                    const val = e.target.value.toUpperCase();
                    updated[cIdx] = { ...updated[cIdx], name: val, slug: val.toLowerCase() };
                    setCategories(updated);
                  }}
                  className={inpClass}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(cIdx)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg ml-2 shrink-0"
                  title="Remove Category"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FAQ PAGE HEADER */}
      {activeTab === 'header' && (
        <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">
          <h2 className="font-editorial text-xl font-bold text-white border-b border-white/5 pb-3">FAQ Page Header Text</h2>

          <div className="space-y-5">
            <div>
              <label className={labelClass}>Header Eyebrow Tag</label>
              <input
                type="text"
                value={faqHeaderState.faq_eyebrow}
                onChange={(e) => handleHeaderChange('faq_eyebrow', e.target.value)}
                className={inpClass}
                placeholder="Frequently Asked"
              />
            </div>

            <div>
              <label className={labelClass}>Header Main Title</label>
              <textarea
                rows={2}
                value={faqHeaderState.faq_title}
                onChange={(e) => handleHeaderChange('faq_title', e.target.value)}
                className={`${inpClass} resize-none`}
                placeholder="Got Questions?\nWe Have Answers."
              />
            </div>

            <div>
              <label className={labelClass}>Header Subtitle / Description</label>
              <textarea
                rows={3}
                value={faqHeaderState.faq_description}
                onChange={(e) => handleHeaderChange('faq_description', e.target.value)}
                className={`${inpClass} resize-none`}
                placeholder="Everything you need to know..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFAQCMS;
