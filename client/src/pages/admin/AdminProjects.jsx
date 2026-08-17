import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save, Trash2, Upload, X, Plus, Loader2, ArrowLeft,
  Image as ImageIcon, CheckCircle
} from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS } from '../../utils/cmsStore';

// ─── Shared Admin Form Components ─────────────────────────────────────────────
const AdminFormField = ({ label, required, children, error }) => (
  <div className="space-y-1.5">
    <label className="font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold">
      {label}{required && <span className="text-gold ml-1">*</span>}
    </label>
    {children}
    {error && <p className="font-sans text-xs text-red-400">{error}</p>}
  </div>
);

const AdminInput = ({ ...props }) => (
  <input {...props} className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 transition-colors" />
);

const AdminTextarea = ({ rows = 4, ...props }) => (
  <textarea rows={rows} {...props} className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 transition-colors resize-none" />
);

const AdminSelect = ({ children, ...props }) => (
  <select {...props} className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white transition-colors">
    {children}
  </select>
);

// ─── Admin Projects Manager ────────────────────────────────────────────────────
const AdminProjects = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [view, setView] = useState(id ? 'form' : 'list'); // 'list' | 'form'
  const [editingProject, setEditingProject] = useState(null);
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [heroForm, setHeroForm] = useState({
    projects_hero_badge: 'Portfolio & Case Studies',
    projects_hero_title: 'Our Projects',
    projects_hero_subtitle: 'Every space reflects thoughtful layouts, structural precision, custom material procurement, and meticulous attention to detail.',
    projects_hero_images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=90',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=90',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=90'
    ]
  });

  const [heroPreview, setHeroPreview] = useState(null);
  const heroRef = useRef();
  const galleryRef = useRef();

  const emptyForm = {
    title: '', slug: '', category: 'apartment', area: '', location: '', completionYear: new Date().getFullYear(),
    description: '', scope: '', duration: '', status: 'published', featured: false,
    heroImage: '', beforeImage: '', afterImage: '', gallery: [], tags: '',
    visionStory: '', challengeStory: '', engineeringStory: '',
    testimonialName: '', testimonialMobile: '', testimonialProfession: '', testimonialText: '', testimonialRating: 5
  };
  const [form, setForm] = useState(emptyForm);

  const categoriesList = ['villa', 'apartment', 'office', 'commercial', 'renovation', 'luxury_home'];
  const neighborhoods = ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Kondapur', 'HITEC City', 'Kokapet', 'Begumpet', 'Madhapur', 'Gandipet', 'Financial District'];
  const styles = ['Japandi Minimal', 'Warm Editorial', 'Clean Contemporary', 'Luxury Architectural', 'Scandinavian Crafted', 'Modern Classic', 'Warm Contemporary', 'Industrial Editorial'];

  const unsplashPool = {
    villa: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
    ],
    apartment: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=800&q=80'
    ],
    office: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    commercial: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80'
    ],
    renovation: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
    ],
    luxury_home: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
    ]
  };

  const clientDemoPool = [
    { name: 'Dr. Ananya Reddy', profession: 'Senior Cardiologist & Villa Owner', mobile: '+91 98490 12345', text: 'The sheer structural rigor and high-tolerance wood joinery delivered by Espacio was benchmark quality. Every room feels engineered to perfection.' },
    { name: 'Vikram Malhotra', profession: 'Tech Entrepreneur & Penthouse Owner', mobile: '+91 98765 43210', text: 'Espacio handled everything from raw site shell to luxury Italian marble installation seamlessly. Their team met strict delivery timelines without compromising on finish.' },
    { name: 'Suresh K. Rao', profession: 'Managing Director, Horizon Infra', mobile: '+91 99890 67890', text: 'Outstanding execution! The acoustic insulation, double-height ceiling treatments, and custom lighting tracks converted our workspace into an architectural trophy.' },
    { name: 'Kavitha Varma', profession: 'Principal Architect & Homeowner', mobile: '+91 94400 55432', text: 'As an architect, I hold extremely high standards for material tolerances. Espacio surpassed my expectations in veneer grain matching and shadow-gap fittings.' },
    { name: 'Rajesh Goud', profession: 'Real Estate Developer', mobile: '+91 97000 88776', text: 'Espacio turned around our luxury residence within 5 months. Their material sourcing and on-site project management saved us both time and budget.' },
    { name: 'Meera Deshmukh', profession: 'Chartered Accountant & Homeowner', mobile: '+91 98660 33445', text: 'From initial 3D visualization to final hardware placement, the transparency and craftsmanship were phenomenal. Highly recommended for turnkey luxury homes.' },
    { name: 'Amitabh Saxena', profession: 'VP of Product Engineering', mobile: '+91 91212 99887', text: 'Implacable attention to detail! The hidden partition channels and integrated ambient lighting gave our apartment an ultra-modern Japandi aesthetic.' },
    { name: 'Sunita Agarwal', profession: 'Industrialist & Philanthropist', mobile: '+91 93939 11223', text: 'Extremely professional team. Their custom modular kitchen and walk-in wardrobe executions are unmatched in Hyderabad.' }
  ];

  const generatedMockProjects = [];
  let idCounter = 1;
  categoriesList.forEach((cat) => {
    for (let index = 0; index < 5; index++) {
      const hood = neighborhoods[(cat.charCodeAt(0) + index) % neighborhoods.length];
      const style = styles[(cat.charCodeAt(1) + index) % styles.length];
      const year = 2023 + (index % 3);
      const label = cat === 'luxury_home' ? 'Residence' : cat.charAt(0).toUpperCase() + cat.slice(1);
      const title = `${style} ${label} ${index + 1}`;
      const pool = unsplashPool[cat] || unsplashPool.villa;
      const heroImage = pool[index % pool.length];
      const gallery = pool;
      const slug = `${cat}-${index + 1}`;
      const clientDemo = clientDemoPool[(idCounter - 1) % clientDemoPool.length];
      
      generatedMockProjects.push({
        _id: String(idCounter++),
        title,
        slug,
        category: cat,
        area: String(2400 + index * 500),
        location: `${hood}, Hyd`,
        completionYear: year,
        status: 'published',
        featured: index === 0,
        heroImage,
        beforeImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
        afterImage: heroImage,
        gallery,
        description: `Bespoke ${style.toLowerCase()} interior design and turnkey execution in ${hood}, Hyderabad.`,
        visionStory: `Bespoke ${style.toLowerCase()} interior design and turnkey execution in ${hood}, Hyderabad.`,
        challengeStory: `Optimizing partition thresholds and hidden layout tracking slots in ${hood}.`,
        engineeringStory: `Mild steel reinforcement configurations and structural load-bearing tolerances checks for ${label}.`,
        testimonialName: clientDemo.name,
        testimonialMobile: clientDemo.mobile,
        testimonialProfession: clientDemo.profession,
        testimonialText: clientDemo.text,
        testimonialRating: 5,
        testimonial: {
          name: clientDemo.name,
          mobile: clientDemo.mobile,
          profession: clientDemo.profession,
          role: clientDemo.profession,
          text: clientDemo.text,
          rating: 5
        },
        scope: 'Full Home Interior & Material Sourcing',
        duration: '4-6 months'
      });
    }
  });

  const mockProjects = generatedMockProjects;

  useEffect(() => {
    const initProjects = async () => {
      const stored = getCMSData(STORAGE_KEYS.PROJECTS);
      if (stored && stored.length > 0) {
        setProjects(stored);
        setLoading(false);
      } else {
        setProjects(mockProjects);
        setCMSData(STORAGE_KEYS.PROJECTS, mockProjects);
        setLoading(false);
      }
      try {
        const res = await axios.get('/projects?admin=true&limit=50');
        const fetched = res.data.data?.projects || res.data.data;
        if (fetched && fetched.length > 0 && !stored) {
          setProjects(fetched);
          setCMSData(STORAGE_KEYS.PROJECTS, fetched);
        }
      } catch {}
    };
    initProjects();
  }, []);

  const handleEdit = (p) => {
    setEditingProject(p);
    const galleryArray = Array.isArray(p.gallery)
      ? p.gallery
      : (typeof p.gallery === 'string' && p.gallery.length > 0
          ? p.gallery.split(',').map(s => s.trim()).filter(Boolean)
          : [p.heroImage].filter(Boolean));
    setForm({
      ...emptyForm,
      ...p,
      visionStory: p.story?.vision || p.visionStory || p.description || '',
      challengeStory: p.story?.challenges || p.challengeStory || '',
      engineeringStory: p.story?.engineering || p.engineeringStory || '',
      testimonialName: p.testimonial?.name || p.testimonialName || '',
      testimonialMobile: p.testimonial?.mobile || p.testimonialMobile || '',
      testimonialProfession: p.testimonial?.profession || p.testimonialProfession || p.testimonial?.role || '',
      testimonialText: p.testimonial?.text || p.testimonialText || '',
      testimonialRating: p.testimonial?.rating || p.testimonialRating || 5,
      gallery: galleryArray,
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || '')
    });
    setHeroPreview(p.heroImage || null);
    setView('form');
  };

  const handleNew = () => {
    setEditingProject(null);
    setForm(emptyForm);
    setHeroPreview(null);
    setView('form');
  };

  const openHeroModal = () => {
    const settings = getCMSData(STORAGE_KEYS.SETTINGS);
    if (settings) {
      setHeroForm({
        projects_hero_badge: settings.projects_hero_badge || 'Portfolio & Case Studies',
        projects_hero_title: settings.projects_hero_title || 'Our Projects',
        projects_hero_subtitle: settings.projects_hero_subtitle || 'Every space reflects thoughtful layouts, structural precision, custom material procurement, and meticulous attention to detail.',
        projects_hero_images: (Array.isArray(settings.projects_hero_images) && settings.projects_hero_images.length > 0)
          ? settings.projects_hero_images
          : heroForm.projects_hero_images
      });
    }
    setShowHeroModal(true);
  };

  const handleSaveHero = async (e) => {
    e.preventDefault();
    const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    const updatedSettings = { ...existing, ...heroForm };
    setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);
    try {
      await axios.put('/settings', updatedSettings);
    } catch {}
    setShowHeroModal(false);
    alert('Projects Hero settings updated live!');
  };

  const handleToggleFeatured = async (p) => {
    const updatedFeatured = !p.featured;
    const updatedProjects = projects.map(item => item._id === p._id ? { ...item, featured: updatedFeatured } : item);
    setProjects(updatedProjects);
    setCMSData(STORAGE_KEYS.PROJECTS, updatedProjects);
    try {
      await axios.put(`/projects/${p._id}`, { ...p, featured: updatedFeatured });
    } catch {}
  };

  const handleDelete = async (pid) => {
    if (!window.confirm('Archive this project?')) return;
    try { await axios.delete(`/projects/${pid}`); } catch {}
    setProjects((prev) => {
      const updated = prev.filter((p) => p._id !== pid);
      setCMSData(STORAGE_KEYS.PROJECTS, updated);
      return updated;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const galleryClean = Array.isArray(form.gallery)
      ? form.gallery
      : (form.gallery ? form.gallery.split(',').map(s=>s.trim()).filter(Boolean) : []);
    const tagsClean = typeof form.tags === 'string'
      ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : (form.tags || []);
    
    const payload = {
      ...form,
      slug,
      story: {
        vision: form.visionStory || form.description,
        challenges: form.challengeStory || 'Optimizing partition thresholds and hidden layout tracking slots.',
        engineering: form.engineeringStory || 'Mild steel reinforcement configurations and structural load-bearing tolerances checks.'
      },
      testimonial: {
        name: form.testimonialName || `Client for ${form.title}`,
        mobile: form.testimonialMobile || '',
        profession: form.testimonialProfession || 'Homeowner',
        role: form.testimonialProfession || `${form.location || 'Hyderabad'} Homeowner`,
        text: form.testimonialText || "The sheer professionalism and attention to tolerances shown by Espacio was exemplary. Our expectations were fully surpassed.",
        rating: Number(form.testimonialRating || 5)
      },
      gallery: galleryClean,
      tags: tagsClean
    };
    
    try {
      if (editingProject) {
        await axios.put(`/projects/${editingProject._id}`, payload);
      } else {
        await axios.post('/projects', payload);
      }
    } catch {}

    setProjects((prev) => {
      let updated;
      if (editingProject) {
        updated = prev.map((p) => (p._id === editingProject._id ? { ...p, ...payload } : p));
      } else {
        updated = [{ _id: String(Date.now()), ...payload }, ...prev];
      }
      setCMSData(STORAGE_KEYS.PROJECTS, updated);
      return updated;
    });

    setSaved(true);
    setTimeout(() => { setSaved(false); setView('list'); }, 1200);
    setSaving(false);
  };

  if (view === 'form') {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button onClick={() => setView('list')} className="text-white/40 hover:text-white transition-colors"><ArrowLeft size={20} /></button>
          <div>
            <h1 className="font-editorial text-2xl font-bold text-white">{editingProject ? 'Edit Project' : 'Add New Project'}</h1>
            <p className="font-sans text-xs text-white/40 mt-0.5">{editingProject?.title || 'New project entry'}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main fields */}
          <div className="lg:col-span-2 space-y-5 bg-[#1A1C20] border border-white/5 rounded-xl p-6">
            <AdminFormField label="Project Title" required>
              <AdminInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. The Nirvana Villa" required />
            </AdminFormField>
            <AdminFormField label="URL Slug">
              <AdminInput value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="the-nirvana-villa" />
            </AdminFormField>
            <div className="grid grid-cols-2 gap-4">
              <AdminFormField label="Category" required>
                <AdminSelect value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {['apartment', 'villa', 'commercial', 'luxury_home', 'renovation', 'penthouse'].map((c) => (
                    <option key={c} value={c}>{c.replace('_', ' ').toUpperCase()}</option>
                  ))}
                </AdminSelect>
              </AdminFormField>
              <AdminFormField label="Status">
                <AdminSelect value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </AdminSelect>
              </AdminFormField>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <AdminFormField label="Area (sq ft)">
                <AdminInput value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="e.g. 3200" />
              </AdminFormField>
              <AdminFormField label="Location">
                <AdminInput value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Jubilee Hills" />
              </AdminFormField>
              <AdminFormField label="Year Completed">
                <AdminInput type="number" value={form.completionYear} onChange={(e) => setForm({ ...form, completionYear: e.target.value })} placeholder="2025" />
              </AdminFormField>
            </div>
            <AdminFormField label="Project Description">
              <AdminTextarea rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Editorial description of this project..." />
            </AdminFormField>
            <div className="grid grid-cols-2 gap-4">
              <AdminFormField label="Scope of Work">
                <AdminInput value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} placeholder="Full Home Interior" />
              </AdminFormField>
              <AdminFormField label="Duration">
                <AdminInput value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="6 months" />
              </AdminFormField>
            </div>
            <AdminFormField label="Tags (comma separated)">
              <AdminInput value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="luxury, marble, minimal, open-plan" />
            </AdminFormField>

            {/* Case Study Editorial Stories (The Vision, The Challenge, The Engineering) */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div>
                <h3 className="font-sans text-xs uppercase tracking-widest text-gold font-bold flex items-center space-x-2">
                  <ImageIcon size={14} />
                  <span>Case Study Editorial Stories (Vision, Challenge & Engineering)</span>
                </h3>
                <p className="font-sans text-[11px] text-white/40 mt-0.5">
                  Customize the story sections displayed on the case study page ("The Vision", "The Challenge", and "The Engineering").
                </p>
              </div>

              <AdminFormField label="The Vision (Project Design Intent)">
                <AdminTextarea
                  rows={3}
                  value={form.visionStory}
                  onChange={(e) => setForm({ ...form, visionStory: e.target.value })}
                  placeholder="Bespoke clean contemporary interior design and turnkey execution in Financial District, Hyderabad."
                />
              </AdminFormField>

              <AdminFormField label="The Challenge (Spatial & Structural Constraints)">
                <AdminTextarea
                  rows={3}
                  value={form.challengeStory}
                  onChange={(e) => setForm({ ...form, challengeStory: e.target.value })}
                  placeholder="Optimizing partition thresholds and hidden layout tracking slots."
                />
              </AdminFormField>

              <AdminFormField label="The Engineering (Materials & Tolerances)">
                <AdminTextarea
                  rows={3}
                  value={form.engineeringStory}
                  onChange={(e) => setForm({ ...form, engineeringStory: e.target.value })}
                  placeholder="Mild steel reinforcement configurations and structural load-bearing tolerances checks."
                />
              </AdminFormField>
            </div>

            {/* Before & After Transformation Section */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div>
                <h3 className="font-sans text-xs uppercase tracking-widest text-gold font-bold flex items-center space-x-2">
                  <ImageIcon size={14} />
                  <span>Before & After Transformation Photos</span>
                </h3>
                <p className="font-sans text-[11px] text-white/40 mt-0.5">
                  Configure raw site photo ("Before") and final execution photo ("After") for the interactive website slider.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminFormField label="Before (Raw Site Photo URL)">
                  <AdminInput
                    value={form.beforeImage}
                    onChange={(e) => setForm({ ...form, beforeImage: e.target.value })}
                    placeholder="https://images.unsplash.com/... (Raw site photo)"
                  />
                  {form.beforeImage && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-white/10 aspect-video bg-black/40 relative">
                      <img src={form.beforeImage} alt="Before preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 bg-black/80 text-white font-sans text-[10px] uppercase font-bold px-2 py-0.5 rounded">Before</span>
                    </div>
                  )}
                </AdminFormField>

                <AdminFormField label="After (Finished Space Photo URL)">
                  <AdminInput
                    value={form.afterImage}
                    onChange={(e) => setForm({ ...form, afterImage: e.target.value })}
                    placeholder="https://images.unsplash.com/... (Finished photo)"
                  />
                  {form.afterImage && (
                    <div className="mt-2 rounded-lg overflow-hidden border border-white/10 aspect-video bg-black/40 relative">
                      <img src={form.afterImage} alt="After preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-2 left-2 bg-gold text-charcoal font-sans text-[10px] uppercase font-bold px-2 py-0.5 rounded">After</span>
                    </div>
                  )}
                </AdminFormField>
              </div>
            </div>

            {/* What the Client Says About Our Work (Client Testimonial) */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div>
                <h3 className="font-sans text-xs uppercase tracking-widest text-gold font-bold flex items-center space-x-2">
                  <CheckCircle size={14} />
                  <span>What the Client Says About Our Work (Client Testimonial)</span>
                </h3>
                <p className="font-sans text-[11px] text-white/40 mt-0.5">
                  Configure the client endorsement quote, client name, role, and star rating shown on the project case study page.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AdminFormField label="Client Name">
                  <AdminInput
                    value={form.testimonialName}
                    onChange={(e) => setForm({ ...form, testimonialName: e.target.value })}
                    placeholder="e.g. Tarun Varma"
                  />
                </AdminFormField>

                <AdminFormField label="Client Mobile Number">
                  <AdminInput
                    value={form.testimonialMobile}
                    onChange={(e) => setForm({ ...form, testimonialMobile: e.target.value })}
                    placeholder="e.g. +91 98765 43210"
                  />
                </AdminFormField>

                <AdminFormField label="Client Profession">
                  <AdminInput
                    value={form.testimonialProfession}
                    onChange={(e) => setForm({ ...form, testimonialProfession: e.target.value })}
                    placeholder="e.g. Senior Architect / Doctor / Business Owner"
                  />
                </AdminFormField>

                <AdminFormField label="Star Rating">
                  <AdminSelect
                    value={form.testimonialRating}
                    onChange={(e) => setForm({ ...form, testimonialRating: e.target.value })}
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                  </AdminSelect>
                </AdminFormField>
              </div>

              <AdminFormField label="Client Review / Endorsement Quote">
                <AdminTextarea
                  rows={3}
                  value={form.testimonialText}
                  onChange={(e) => setForm({ ...form, testimonialText: e.target.value })}
                  placeholder="The sheer professionalism and attention to tolerances shown by Espacio was exemplary. Our expectations were fully surpassed."
                />
              </AdminFormField>
            </div>

            {/* Project Photos & Gallery Uploader */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-sans text-xs uppercase tracking-widest text-gold font-bold flex items-center space-x-2">
                    <ImageIcon size={14} />
                    <span>Project Photos & Gallery</span>
                  </h3>
                  <p className="font-sans text-[11px] text-white/40 mt-0.5">
                    Upload multiple high-resolution photos of rooms, elevations, and details for this project.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => galleryRef.current.click()}
                  className="flex items-center space-x-1.5 bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 px-3 py-2 rounded-lg text-xs font-sans font-bold uppercase transition-all"
                >
                  <Plus size={14} />
                  <span>Upload Photos</span>
                </button>
                <input
                  ref={galleryRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    if (files.length > 0) {
                      const newUrls = files.map(f => URL.createObjectURL(f));
                      const currentGallery = Array.isArray(form.gallery) ? form.gallery : (form.gallery ? form.gallery.split(',').map(s=>s.trim()) : []);
                      const updated = [...currentGallery, ...newUrls];
                      setForm({ ...form, gallery: updated });
                      if (!form.heroImage && newUrls.length > 0) {
                        setForm(prev => ({ ...prev, heroImage: newUrls[0], gallery: updated }));
                        setHeroPreview(newUrls[0]);
                      }
                    }
                  }}
                />
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                {(Array.isArray(form.gallery) ? form.gallery : (form.gallery ? form.gallery.split(',').map(s=>s.trim()) : [])).map((imgUrl, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden border border-white/10 aspect-video bg-black/40">
                    <img src={imgUrl} alt={`Project photo ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <button
                        type="button"
                        title="Set as Hero Cover"
                        onClick={() => {
                          setForm(prev => ({ ...prev, heroImage: imgUrl }));
                          setHeroPreview(imgUrl);
                        }}
                        className="bg-gold text-charcoal text-[10px] font-bold px-2 py-1 rounded shadow uppercase"
                      >
                        Set Hero
                      </button>
                      <button
                        type="button"
                        title="Remove Photo"
                        onClick={() => {
                          const current = Array.isArray(form.gallery) ? form.gallery : form.gallery.split(',').map(s=>s.trim());
                          const updated = current.filter((_, i) => i !== idx);
                          setForm(prev => ({ ...prev, gallery: updated }));
                        }}
                        className="bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-full transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    {form.heroImage === imgUrl && (
                      <span className="absolute top-1.5 left-1.5 bg-gold text-charcoal font-sans text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        COVER
                      </span>
                    )}
                  </div>
                ))}

                <div
                  onClick={() => galleryRef.current.click()}
                  className="border-2 border-dashed border-white/10 hover:border-gold/40 rounded-lg aspect-video flex flex-col items-center justify-center space-y-1 cursor-pointer transition-colors text-white/30 hover:text-white/60"
                >
                  <Plus size={20} />
                  <span className="font-sans text-[10px] uppercase tracking-wider font-bold">Add Photo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Hero Cover Image */}
            <div className="bg-[#1A1C20] border border-white/5 rounded-xl p-5 space-y-4">
              <h3 className="font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold">Main Hero Cover Photo</h3>
              {heroPreview ? (
                <div className="relative rounded-lg overflow-hidden aspect-video">
                  <img src={heroPreview} alt="Hero" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => { setHeroPreview(null); setForm({ ...form, heroImage: '' }); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="aspect-video rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-gold/40 transition-colors" onClick={() => heroRef.current.click()}>
                  <ImageIcon size={24} className="text-white/20" />
                  <span className="font-sans text-xs text-white/30">Click to upload cover photo</span>
                </div>
              )}
              <input ref={heroRef} type="file" className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setHeroPreview(url);
                  setForm({ ...form, heroImage: url });
                }
              }} />
              <AdminFormField label="Or paste cover image URL">
                <AdminInput value={form.heroImage} onChange={(e) => { setForm({ ...form, heroImage: e.target.value }); setHeroPreview(e.target.value); }} placeholder="https://..." />
              </AdminFormField>
            </div>

            {/* Publish */}
            <div className="bg-[#1A1C20] border border-white/5 rounded-xl p-5 space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <div onClick={() => setForm({ ...form, featured: !form.featured })}
                  className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${form.featured ? 'bg-gold' : 'bg-white/10'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
                <span className="font-sans text-xs text-white/70">Mark as Featured</span>
              </label>
              <button type="submit" disabled={saving || saved}
                className="w-full flex items-center justify-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-6 rounded-lg transition-all disabled:opacity-60">
                {saved ? <><CheckCircle size={14} /><span>Saved!</span></> : saving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /><span>Save Project & Photos</span></>}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-editorial text-3xl font-bold text-white">Projects</h1>
          <p className="font-sans text-xs text-white/40 mt-1">{projects.length} total projects</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={openHeroModal}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white font-sans text-xs uppercase tracking-widest font-bold py-3 px-4 rounded-lg transition-all border border-white/10"
          >
            <ImageIcon size={14} className="text-gold" />
            <span>Edit Hero Section</span>
          </button>
          <button onClick={handleNew} className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3 px-5 rounded-lg transition-all">
            <Plus size={14} />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      <div className="bg-[#1A1C20] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {['Project', 'Category', 'Location', 'Year', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-5 py-4 text-left font-sans text-[9px] uppercase tracking-widest text-white/30 font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? [1,2,3].map((n) => (
              <tr key={n}><td colSpan={6} className="px-5 py-4"><div className="h-3 bg-white/5 rounded animate-pulse w-1/2" /></td></tr>
            )) : projects.map((p) => (
              <tr key={p._id} className="hover:bg-white/2 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center space-x-3">
                    {p.heroImage && <img src={p.heroImage} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                    <div>
                      <p className="font-sans text-xs font-bold text-white">{p.title}</p>
                      {p.featured && <span className="text-[9px] font-sans text-gold uppercase tracking-wide">Featured</span>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4"><span className="font-sans text-xs text-white/50 capitalize">{(p.category || '').replace('_', ' ')}</span></td>
                <td className="px-5 py-4"><span className="font-sans text-xs text-white/50">{p.location}</span></td>
                <td className="px-5 py-4"><span className="font-sans text-xs text-white/50">{p.completionYear}</span></td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold font-sans uppercase tracking-wide ${p.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-white/30'}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      className={`px-2.5 py-1 rounded transition-all text-[10px] font-sans font-bold flex items-center space-x-1 ${p.featured ? 'bg-gold/20 text-gold border border-gold/40' : 'bg-white/5 text-white/40 hover:text-white hover:bg-white/10'}`}
                      title={p.featured ? "Featured on Homepage" : "Click to feature on Homepage"}
                    >
                      ★ {p.featured ? 'Featured' : 'Feature'}
                    </button>
                    <button onClick={() => handleEdit(p)} className="p-1.5 rounded text-white/40 hover:text-white hover:bg-white/5 transition-all text-xs font-sans">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Projects Hero Configurator Modal */}
      {showHeroModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div data-lenis-prevent className="bg-[#141518] border border-white/10 rounded-2xl w-full max-w-2xl p-6 md:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gold/50 scrollbar-track-white/5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="font-editorial text-2xl font-bold text-white">Edit Projects Page Hero Section</h2>
                <p className="font-sans text-xs text-white/40 mt-1">Configure live heading, subtitle, pill badge, and background images for /projects.</p>
              </div>
              <button
                onClick={() => setShowHeroModal(false)}
                className="text-white/40 hover:text-white text-lg font-bold p-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveHero} className="space-y-4">
              <AdminFormField label="Pill Badge Tagline">
                <AdminInput
                  value={heroForm.projects_hero_badge}
                  onChange={(e) => setHeroForm({ ...heroForm, projects_hero_badge: e.target.value })}
                  placeholder="Portfolio & Case Studies"
                />
              </AdminFormField>

              <AdminFormField label="Hero Main Title">
                <AdminInput
                  value={heroForm.projects_hero_title}
                  onChange={(e) => setHeroForm({ ...heroForm, projects_hero_title: e.target.value })}
                  placeholder="Our Projects"
                />
              </AdminFormField>

              <AdminFormField label="Hero Subtitle / Description">
                <AdminTextarea
                  rows={3}
                  value={heroForm.projects_hero_subtitle}
                  onChange={(e) => setHeroForm({ ...heroForm, projects_hero_subtitle: e.target.value })}
                  placeholder="Every space reflects thoughtful layouts, structural precision..."
                />
              </AdminFormField>

              {/* Carousel Background Images */}
              <div className="space-y-3 pt-4 border-t border-white/10">
                <label className="font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold block">
                  Background Carousel Image URLs
                </label>
                {(heroForm.projects_hero_images || []).map((img, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <AdminInput
                      value={img}
                      onChange={(e) => {
                        const updated = [...heroForm.projects_hero_images];
                        updated[i] = e.target.value;
                        setHeroForm({ ...heroForm, projects_hero_images: updated });
                      }}
                      placeholder="https://images.unsplash.com/..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = heroForm.projects_hero_images.filter((_, idx) => idx !== i);
                        setHeroForm({ ...heroForm, projects_hero_images: updated });
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
                    setHeroForm({
                      ...heroForm,
                      projects_hero_images: [
                        ...heroForm.projects_hero_images,
                        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90'
                      ]
                    });
                  }}
                  className="flex items-center space-x-2 text-gold text-xs font-sans font-bold uppercase pt-2"
                >
                  <Plus size={14} />
                  <span>Add Background Image URL</span>
                </button>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowHeroModal(false)}
                  className="px-5 py-2.5 rounded-lg bg-white/5 text-white/60 hover:text-white text-xs font-sans uppercase tracking-wider font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-gold hover:bg-gold-hover text-charcoal text-xs font-sans uppercase tracking-wider font-bold shadow-lg"
                >
                  Save Hero Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
