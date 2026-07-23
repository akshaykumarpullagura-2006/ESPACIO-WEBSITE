import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save, Trash2, Upload, X, Plus, Loader2, ArrowLeft,
  Image as ImageIcon, CheckCircle
} from 'lucide-react';

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
  const [heroPreview, setHeroPreview] = useState(null);
  const heroRef = useRef();

  const emptyForm = {
    title: '', slug: '', category: 'apartment', area: '', location: '', completionYear: new Date().getFullYear(),
    description: '', scope: '', duration: '', status: 'published', featured: false,
    heroImage: '', tags: ''
  };
  const [form, setForm] = useState(emptyForm);

  const mockProjects = [
    { _id: '1', title: 'The Nirvana Villa', slug: 'the-nirvana-villa', category: 'villa', area: '4200', location: 'Jubilee Hills', completionYear: 2024, status: 'published', featured: true, heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=60' },
    { _id: '2', title: 'Slate Office Hub', slug: 'slate-office-hub', category: 'commercial', area: '3100', location: 'HITEC City', completionYear: 2025, status: 'published', featured: false, heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=60' },
    { _id: '3', title: 'The Lumen Apartment', slug: 'the-lumen-apartment', category: 'apartment', area: '1800', location: 'Banjara Hills', completionYear: 2025, status: 'draft', featured: true, heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=60' },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('/projects?limit=50');
        setProjects(res.data.data?.projects || res.data.data || mockProjects);
      } catch { setProjects(mockProjects); }
      finally { setLoading(false); }
    };
    fetchProjects();
  }, []);

  const handleEdit = (p) => {
    setEditingProject(p);
    setForm({ ...emptyForm, ...p, tags: (p.tags || []).join(', ') });
    setHeroPreview(p.heroImage || null);
    setView('form');
  };

  const handleNew = () => {
    setEditingProject(null);
    setForm(emptyForm);
    setHeroPreview(null);
    setView('form');
  };

  const handleDelete = async (pid) => {
    if (!window.confirm('Archive this project?')) return;
    try {
      await axios.delete(`/projects/${pid}`);
      setProjects((prev) => prev.filter((p) => p._id !== pid));
    } catch { setProjects((prev) => prev.filter((p) => p._id !== pid)); }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const payload = { ...form, slug, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean) };
    try {
      if (editingProject) {
        await axios.put(`/projects/${editingProject._id}`, payload);
        setProjects((prev) => prev.map((p) => p._id === editingProject._id ? { ...p, ...payload } : p));
      } else {
        const res = await axios.post('/projects', payload);
        setProjects((prev) => [res.data.data || { _id: Date.now(), ...payload }, ...prev]);
      }
      setSaved(true);
      setTimeout(() => { setSaved(false); setView('list'); }, 1500);
    } catch {
      if (!editingProject) setProjects((prev) => [{ _id: String(Date.now()), ...payload }, ...prev]);
      setSaved(true);
      setTimeout(() => { setSaved(false); setView('list'); }, 1500);
    } finally { setSaving(false); }
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
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Hero Image */}
            <div className="bg-[#1A1C20] border border-white/5 rounded-xl p-5 space-y-4">
              <h3 className="font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold">Hero Image</h3>
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
                  <span className="font-sans text-xs text-white/30">Click to upload</span>
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
              <AdminFormField label="Or paste image URL">
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
                {saved ? <><CheckCircle size={14} /><span>Saved!</span></> : saving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /><span>Save Project</span></>}
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
        <button onClick={handleNew} className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3 px-5 rounded-lg transition-all">
          <Plus size={14} />
          <span>Add Project</span>
        </button>
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
                    <button onClick={() => handleEdit(p)} className="p-1.5 rounded text-white/40 hover:text-white hover:bg-white/5 transition-all text-xs font-sans">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-all"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProjects;
