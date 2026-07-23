import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Save, Trash2, Plus, Loader2, ArrowLeft, Image as ImageIcon, X, CheckCircle } from 'lucide-react';

const AdminInput = (props) => (
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
const Field = ({ label, required, children }) => (
  <div className="space-y-1.5">
    <label className="font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold">{label}{required && <span className="text-gold ml-1">*</span>}</label>
    {children}
  </div>
);

const mockProducts = [
  { _id: '1', title: 'WPC Wall Panels', slug: 'wpc-wall-panels', category: 'wpc_wall_panels', status: 'published', heroImage: '/images/materials/wpc_panels.jpg' },
  { _id: '2', title: 'Fluted Panels', slug: 'fluted-panels', category: 'fluted_panels', status: 'published', heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=200&q=60' },
  { _id: '3', title: 'Polygranite Sheets', slug: 'polygranite-sheets', category: 'polygranite_sheets', status: 'draft', heroImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=200&q=60' },
];

const CATEGORIES = [
  'wpc_wall_panels',
  'pvc_ceiling_panels',
  'fluted_panels',
  'polygranite_sheets',
  'acrylic_sheets',
  'charcoal_panels',
  'mosaic_tiles',
  'decorative_panels',
  'surface_sheets',
  'korean_collection',
  'louvers',
  'ceiling_systems'
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [view, setView] = useState('list');
  const [editing, setEditing] = useState(null);
  const [heroPreview, setHeroPreview] = useState(null);
  const imgRef = useRef();

  const emptyForm = {
    title: '',
    slug: '',
    category: 'wpc_wall_panels',
    description: '',
    heroImage: '',
    features: '',
    applications: '',
    status: 'published',
    gallery: '',
    specifications: ''
  };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/products?limit=50');
        setProducts(res.data.data?.products || res.data.data || mockProducts);
      } catch { setProducts(mockProducts); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleEdit = (p) => {
    setEditing(p);
    setForm({
      ...emptyForm,
      ...p,
      features: (p.features || []).join(', '),
      applications: (p.applications || []).join(', '),
      gallery: (p.gallery || []).join(', '),
      specifications: (p.specifications || []).map(s => `${s.label}: ${s.value}`).join('\n')
    });
    setHeroPreview(p.heroImage || null);
    setView('form');
  };

  const handleNew = () => { setEditing(null); setForm(emptyForm); setHeroPreview(null); setView('form'); };

  const handleDelete = async (pid) => {
    if (!window.confirm('Archive this product?')) return;
    try { await axios.delete(`/products/${pid}`); } catch {}
    setProducts((prev) => prev.filter((p) => p._id !== pid));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.slug || form.title.toLowerCase().replace(/\s+/g, '-');
    const specsParsed = form.specifications.split('\n')
      .map(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          return { label: parts[0].trim(), value: parts.slice(1).join(':').trim() };
        }
        return null;
      })
      .filter(Boolean);

    const payload = {
      ...form,
      slug,
      features: form.features.split(',').map((t) => t.trim()).filter(Boolean),
      applications: form.applications.split(',').map((t) => t.trim()).filter(Boolean),
      gallery: form.gallery.split(',').map((t) => t.trim()).filter(Boolean),
      specifications: specsParsed
    };
    try {
      if (editing) {
        await axios.put(`/products/${editing._id}`, payload);
        setProducts((prev) => prev.map((p) => p._id === editing._id ? { ...p, ...payload } : p));
      } else {
        const res = await axios.post('/products', payload);
        setProducts((prev) => [res.data.data || { _id: Date.now(), ...payload }, ...prev]);
      }
    } catch {
      if (!editing) setProducts((prev) => [{ _id: String(Date.now()), ...payload }, ...prev]);
    }
    setSaving(false); setSaved(true);
    setTimeout(() => { setSaved(false); setView('list'); }, 1500);
  };

  if (view === 'form') return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button onClick={() => setView('list')} className="text-white/40 hover:text-white transition-colors"><ArrowLeft size={20} /></button>
        <h1 className="font-editorial text-2xl font-bold text-white">{editing ? 'Edit Material' : 'Add New Material'}</h1>
      </div>
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5 bg-[#1A1C20] border border-white/5 rounded-xl p-6">
          <Field label="Material Name" required><AdminInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="WPC Wall Panels" required /></Field>
          <Field label="URL Slug"><AdminInput value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="wpc-wall-panels" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category" required>
              <AdminSelect value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ').toUpperCase()}</option>)}
              </AdminSelect>
            </Field>
            <Field label="Status">
              <AdminSelect value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </AdminSelect>
            </Field>
          </div>
          <Field label="Description"><AdminTextarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Premium material description..." /></Field>
          <Field label="Key Features (comma separated)"><AdminInput value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Waterproof, Fire Retardant, UV Resistant" /></Field>
          <Field label="Applications (comma separated)"><AdminInput value={form.applications} onChange={(e) => setForm({ ...form, applications: e.target.value })} placeholder="Kitchen Cabinets, Accent Walls, Ceilings" /></Field>
          <Field label="Gallery Images (comma separated URLs)"><AdminTextarea rows={3} value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} placeholder="https://images.unsplash.com/..., https://..." /></Field>
          <Field label="Technical Specifications (Label: Value, one per line)"><AdminTextarea rows={6} value={form.specifications} onChange={(e) => setForm({ ...form, specifications: e.target.value })} placeholder="Standard Dimensions: 2900mm x 122mm x 12mm&#10;Core Weight: 1.8 kg/m&#10;Water Resistance: 100% Waterproof" /></Field>
        </div>
        <div className="space-y-5">
          <div className="bg-[#1A1C20] border border-white/5 rounded-xl p-5 space-y-4">
            <h3 className="font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold">Hero Image</h3>
            {heroPreview ? (
              <div className="relative rounded-lg overflow-hidden aspect-video">
                <img src={heroPreview} alt="preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { setHeroPreview(null); setForm({ ...form, heroImage: '' }); }}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500"><X size={10} /></button>
              </div>
            ) : (
              <div className="aspect-video rounded-lg border-2 border-dashed border-white/10 flex flex-col items-center justify-center space-y-2 cursor-pointer hover:border-gold/40 transition-colors" onClick={() => imgRef.current.click()}>
                <ImageIcon size={20} className="text-white/20" />
                <span className="font-sans text-xs text-white/30">Upload image</span>
              </div>
            )}
            <input ref={imgRef} type="file" className="hidden" accept="image/*" onChange={(e) => { const f = e.target.files[0]; if (f) { const u = URL.createObjectURL(f); setHeroPreview(u); setForm({ ...form, heroImage: u }); } }} />
            <Field label="Or Image URL">
              <AdminInput value={form.heroImage} onChange={(e) => { setForm({ ...form, heroImage: e.target.value }); setHeroPreview(e.target.value); }} placeholder="https://..." />
            </Field>
          </div>
          <div className="bg-[#1A1C20] border border-white/5 rounded-xl p-5">
            <button type="submit" disabled={saving || saved}
              className="w-full flex items-center justify-center space-x-2 bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3.5 rounded-lg transition-all disabled:opacity-60">
              {saved ? <><CheckCircle size={14} /><span>Saved!</span></> : saving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /><span>Save Material</span></>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-editorial text-3xl font-bold text-white">Materials</h1><p className="font-sans text-xs text-white/40 mt-1">{products.length} materials listed</p></div>
        <button onClick={handleNew} className="flex items-center space-x-2 bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3 px-5 rounded-lg transition-all hover:opacity-90">
          <Plus size={14} /><span>Add Material</span>
        </button>
      </div>
      <div className="bg-[#1A1C20] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-white/5">{['Material', 'Category', 'Status', 'Actions'].map((h) => (
            <th key={h} className="px-5 py-4 text-left font-sans text-[9px] uppercase tracking-widest text-white/30 font-bold">{h}</th>
          ))}</tr></thead>
          <tbody className="divide-y divide-white/5">
            {loading ? [1,2,3].map((n) => (<tr key={n}><td colSpan={4} className="px-5 py-4"><div className="h-3 bg-white/5 rounded animate-pulse w-1/3" /></td></tr>)) :
            products.map((p) => (
              <tr key={p._id} className="hover:bg-white/2 transition-colors">
                <td className="px-5 py-4"><div className="flex items-center space-x-3">{p.heroImage && <img src={p.heroImage} alt="" className="w-10 h-10 rounded-lg object-cover" />}<span className="font-sans text-xs font-bold text-white">{p.title}</span></div></td>
                <td className="px-5 py-4"><span className="font-sans text-xs text-white/50 capitalize">{(p.category || '').replace(/_/g, ' ')}</span></td>
                <td className="px-5 py-4"><span className={`px-2.5 py-1 rounded-full text-[9px] font-bold font-sans uppercase ${p.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-white/30'}`}>{p.status}</span></td>
                <td className="px-5 py-4"><div className="flex items-center space-x-2">
                  <button onClick={() => handleEdit(p)} className="font-sans text-xs text-white/40 hover:text-white px-2 py-1 rounded hover:bg-white/5">Edit</button>
                  <button onClick={() => handleDelete(p._id)} className="text-red-400/40 hover:text-red-400 p-1.5 rounded hover:bg-red-500/10"><Trash2 size={13} /></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
