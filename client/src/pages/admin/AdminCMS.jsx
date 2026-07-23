import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Plus, Trash2, Save, Loader2, Upload, CheckCircle, X } from 'lucide-react';

// ─── Admin Testimonials ───────────────────────────────────────────────────────
export const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const mockTestimonials = [
    { _id: '1', clientName: 'Aditya Rao', project: 'The Nirvana Villa', rating: 5, review: 'ESPACIO transformed our villa into something beyond our imagination. The material quality and design precision is outstanding.', status: 'published' },
    { _id: '2', clientName: 'Priya Mehta', project: 'Slate Office Hub', rating: 5, review: 'Our new workspace feels premium and professional. Every client who visits is impressed.', status: 'published' },
  ];

  const emptyForm = { clientName: '', project: '', location: '', rating: 5, review: '', status: 'published' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/testimonials?limit=50');
        setTestimonials(res.data.data?.testimonials || res.data.data || mockTestimonials);
      } catch { setTestimonials(mockTestimonials); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleEdit = (t) => { setEditing(t); setForm({ ...emptyForm, ...t }); };
  const handleNew = () => { setEditing(null); setForm(emptyForm); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) {
        await axios.put(`/testimonials/${editing._id}`, form);
        setTestimonials((prev) => prev.map((t) => t._id === editing._id ? { ...t, ...form } : t));
      } else {
        const res = await axios.post('/testimonials', form);
        setTestimonials((prev) => [res.data.data || { _id: Date.now(), ...form }, ...prev]);
      }
    } catch {
      if (!editing) setTestimonials((prev) => [{ _id: String(Date.now()), ...form }, ...prev]);
      else setTestimonials((prev) => prev.map((t) => t._id === editing._id ? { ...t, ...form } : t));
    }
    setSaving(false); setSaved(true);
    setTimeout(() => { setSaved(false); setEditing(null); setForm(emptyForm); }, 1200);
  };

  const handleDelete = async (id) => {
    try { await axios.delete(`/testimonials/${id}`); } catch {}
    setTestimonials((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="font-editorial text-3xl font-bold text-white">Testimonials</h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-[#1A1C20] border border-white/5 rounded-xl p-6 space-y-5 h-fit">
          <h2 className="font-editorial text-lg font-bold text-white">{editing ? 'Edit Review' : 'Add New Review'}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><label className="font-sans text-[10px] text-white/40 uppercase tracking-widest">Client Name</label>
                <input value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} placeholder="Aditya Rao" className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25" /></div>
              <div className="space-y-1.5"><label className="font-sans text-[10px] text-white/40 uppercase tracking-widest">Project</label>
                <input value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} placeholder="The Nirvana Villa" className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><label className="font-sans text-[10px] text-white/40 uppercase tracking-widest">Location</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Jubilee Hills" className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25" /></div>
              <div className="space-y-1.5"><label className="font-sans text-[10px] text-white/40 uppercase tracking-widest">Rating</label>
                <select value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white">
                  {[5,4,3].map((r) => <option key={r} value={r}>{r} Stars</option>)}
                </select></div>
            </div>
            <div className="space-y-1.5"><label className="font-sans text-[10px] text-white/40 uppercase tracking-widest">Review</label>
              <textarea rows={4} value={form.review} onChange={(e) => setForm({ ...form, review: e.target.value })} placeholder="Client's testimonial..." className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 resize-none" /></div>
            <div className="flex items-center space-x-3">
              <button type="submit" disabled={saving || saved} className="flex-1 flex items-center justify-center space-x-2 bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3 rounded-lg disabled:opacity-60">
                {saved ? <><CheckCircle size={13} /><span>Saved</span></> : saving ? <Loader2 size={13} className="animate-spin" /> : <><Save size={13} /><span>{editing ? 'Update' : 'Add'} Review</span></>}
              </button>
              {editing && <button type="button" onClick={handleNew} className="px-4 py-3 rounded-lg border border-white/10 text-white/40 hover:text-white font-sans text-xs transition-all"><X size={14} /></button>}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? [1,2,3].map((n) => <div key={n} className="bg-[#1A1C20] rounded-xl p-5 animate-pulse h-24" />) :
            testimonials.map((t) => (
              <div key={t._id} className={`bg-[#1A1C20] border rounded-xl p-5 space-y-2 cursor-pointer transition-all ${editing?._id === t._id ? 'border-gold/30' : 'border-white/5 hover:border-white/10'}`} onClick={() => handleEdit(t)}>
                <div className="flex items-start justify-between">
                  <div><p className="font-sans text-xs font-bold text-white">{t.clientName}</p><p className="font-sans text-[10px] text-white/40">{t.project}</p></div>
                  <div className="flex items-center space-x-2">
                    <span className="font-sans text-[10px] text-gold">{'★'.repeat(t.rating || 5)}</span>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(t._id); }} className="text-red-400/40 hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                  </div>
                </div>
                <p className="font-sans text-[11px] text-white/50 line-clamp-2">{t.review}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

// ─── Admin FAQs ────────────────────────────────────────────────────────────────
export const AdminFAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const mockFAQs = [
    { _id: '1', question: 'How long does a full home interior take?', answer: 'Typically 45–90 days depending on scope, customisation level, and floor area.', category: 'process', order: 1 },
    { _id: '2', question: 'Do you handle both design and execution?', answer: 'Yes. ESPACIO is a full-service studio — from concept design to final handover.', category: 'services', order: 2 },
  ];
  const emptyForm = { question: '', answer: '', category: 'process', order: 1 };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/faqs');
        setFaqs(res.data.data || mockFAQs);
      } catch { setFaqs(mockFAQs); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const handleEdit = (f) => { setEditing(f); setForm({ ...emptyForm, ...f }); };
  const handleNew = () => { setEditing(null); setForm(emptyForm); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) { await axios.put(`/faqs/${editing._id}`, form); setFaqs((prev) => prev.map((f) => f._id === editing._id ? { ...f, ...form } : f)); }
      else { const res = await axios.post('/faqs', form); setFaqs((prev) => [...prev, res.data.data || { _id: Date.now(), ...form }]); }
    } catch {
      if (editing) setFaqs((prev) => prev.map((f) => f._id === editing._id ? { ...f, ...form } : f));
      else setFaqs((prev) => [...prev, { _id: String(Date.now()), ...form }]);
    }
    setSaving(false); setSaved(true);
    setTimeout(() => { setSaved(false); setEditing(null); setForm(emptyForm); }, 1200);
  };

  const handleDelete = async (id) => {
    try { await axios.delete(`/faqs/${id}`); } catch {}
    setFaqs((prev) => prev.filter((f) => f._id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="font-editorial text-3xl font-bold text-white">FAQs</h1>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-[#1A1C20] border border-white/5 rounded-xl p-6 space-y-5 h-fit">
          <h2 className="font-editorial text-lg font-bold text-white">{editing ? 'Edit FAQ' : 'Add FAQ'}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5"><label className="font-sans text-[10px] text-white/40 uppercase tracking-widest">Question</label>
              <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="How long does...?" className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25" /></div>
            <div className="space-y-1.5"><label className="font-sans text-[10px] text-white/40 uppercase tracking-widest">Answer</label>
              <textarea rows={4} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Detailed answer..." className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 resize-none" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><label className="font-sans text-[10px] text-white/40 uppercase tracking-widest">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white">
                  {['process', 'services', 'pricing', 'materials', 'timeline', 'general'].map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                </select></div>
              <div className="space-y-1.5"><label className="font-sans text-[10px] text-white/40 uppercase tracking-widest">Order</label>
                <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white" /></div>
            </div>
            <div className="flex space-x-3">
              <button type="submit" disabled={saving || saved} className="flex-1 flex items-center justify-center space-x-2 bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3 rounded-lg disabled:opacity-60">
                {saved ? <><CheckCircle size={13} /><span>Saved</span></> : saving ? <Loader2 size={13} className="animate-spin" /> : <><Save size={13} /><span>{editing ? 'Update' : 'Add'} FAQ</span></>}
              </button>
              {editing && <button type="button" onClick={handleNew} className="px-4 py-3 rounded-lg border border-white/10 text-white/40 hover:text-white transition-all"><X size={14} /></button>}
            </div>
          </form>
        </div>

        <div className="space-y-3">
          {loading ? [1,2,3].map((n) => <div key={n} className="bg-[#1A1C20] rounded-xl p-5 animate-pulse h-20" />) :
            faqs.map((f) => (
              <div key={f._id} onClick={() => handleEdit(f)} className={`bg-[#1A1C20] border rounded-xl p-5 cursor-pointer transition-all ${editing?._id === f._id ? 'border-gold/30' : 'border-white/5 hover:border-white/10'}`}>
                <div className="flex items-start justify-between">
                  <p className="font-sans text-xs font-bold text-white pr-4">{f.question}</p>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(f._id); }} className="shrink-0 text-red-400/40 hover:text-red-400"><Trash2 size={12} /></button>
                </div>
                <p className="font-sans text-[11px] text-white/40 mt-2 line-clamp-2">{f.answer}</p>
                <span className="inline-block mt-2 text-[9px] bg-white/5 text-white/40 px-2 py-0.5 rounded font-sans uppercase tracking-wide">{f.category}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

// ─── Admin Settings ────────────────────────────────────────────────────────────
export const AdminSettings = () => {
  const [settings, setSettings] = useState({ siteName: 'ESPACIO Interiors', tagline: 'Engineering. Elegance. Experience.', adminEmail: 'tarunuttupulusu@gmail.com', instagram: 'https://www.instagram.com/theespacio.in', pinterest: '', youtube: '', enableChat: false, maintenanceMode: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try { const res = await axios.get('/settings'); if (res.data.success) setSettings((prev) => ({ ...prev, ...res.data.data })); } catch {}
    };
    fetch();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try { await axios.put('/settings', settings); } catch {}
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inp = "w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 transition-colors";

  return (
    <div className="space-y-6">
      <h1 className="font-editorial text-3xl font-bold text-white">Site Settings</h1>
      <form onSubmit={handleSave} className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-5 bg-[#1A1C20] border border-white/5 rounded-xl p-6">
          <h2 className="font-editorial text-lg font-bold text-white">Brand Identity</h2>
          {[
            { label: 'Site Name', key: 'siteName', placeholder: 'ESPACIO Interiors' },
            { label: 'Tagline', key: 'tagline', placeholder: 'Engineering. Elegance. Experience.' },
            { label: 'Admin Email', key: 'adminEmail', placeholder: 'tarunuttupulusu@gmail.com', type: 'email' },
          ].map(({ label, key, placeholder, type }) => (
            <div key={key} className="space-y-1.5">
              <label className="font-sans text-[10px] text-white/40 uppercase tracking-widest">{label}</label>
              <input type={type || 'text'} value={settings[key] || ''} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} placeholder={placeholder} className={inp} />
            </div>
          ))}
        </div>

        <div className="space-y-5">
          <div className="bg-[#1A1C20] border border-white/5 rounded-xl p-6 space-y-4">
            <h2 className="font-editorial text-lg font-bold text-white">Social Links</h2>
            {[
              { label: 'Instagram URL', key: 'instagram', placeholder: 'https://instagram.com/theespacio.in' },
              { label: 'Pinterest URL', key: 'pinterest', placeholder: 'https://pinterest.com/...' },
              { label: 'YouTube URL', key: 'youtube', placeholder: 'https://youtube.com/...' },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="space-y-1.5">
                <label className="font-sans text-[10px] text-white/40 uppercase tracking-widest">{label}</label>
                <input value={settings[key] || ''} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} placeholder={placeholder} className={inp} />
              </div>
            ))}
          </div>

          <div className="bg-[#1A1C20] border border-white/5 rounded-xl p-6 space-y-4">
            <h2 className="font-editorial text-lg font-bold text-white">Site Options</h2>
            {[
              { label: 'Enable Chat Widget', key: 'enableChat' },
              { label: 'Maintenance Mode', key: 'maintenanceMode' },
            ].map(({ label, key }) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="font-sans text-xs text-white/70">{label}</span>
                <div onClick={() => setSettings({ ...settings, [key]: !settings[key] })}
                  className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${settings[key] ? 'bg-gold' : 'bg-white/10'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${settings[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </label>
            ))}
          </div>

          <button type="submit" disabled={saving || saved} className="w-full flex items-center justify-center space-x-2 bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-4 rounded-lg disabled:opacity-60 transition-all">
            {saved ? <><CheckCircle size={14} /><span>Settings Saved!</span></> : saving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /><span>Save Settings</span></>}
          </button>
        </div>
      </form>
    </div>
  );
};

// ─── Admin Media Manager ───────────────────────────────────────────────────────
export const AdminMedia = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState([]);
  const fileRef = useRef();

  const mockImages = Array.from({ length: 12 }, (_, i) => ({
    _id: String(i + 1),
    url: `https://images.unsplash.com/photo-${['1600585154340-be6161a56a0c','1600596542815-ffad4c1539a9','1600210492486-724fe5c67fb0','1600607687939-ce8a6c25118c','1533090161767-e6ffed986c88','1618221195710-dd6b41faaea6','1556911220-e15b29be8c8f','1590490360182-c33d57733427','1524758631624-e2822e304c36','1497366216548-37526070297c','1565183997392-2f6f122e5912','1556909114-f6e7ad7d3136'][i]}?auto=format&fit=crop&w=300&q=60`,
    name: `espacio-image-${i + 1}.jpg`,
    size: '${(Math.random() * 2 + 0.5).toFixed(1)} MB',
  }));

  useEffect(() => { setImages(mockImages); }, []);

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    setTimeout(() => {
      const newImages = files.map((f, idx) => ({
        _id: String(Date.now() + idx),
        url: URL.createObjectURL(f),
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      }));
      setImages((prev) => [...newImages, ...prev]);
      setUploading(false);
    }, 1500);
  };

  const handleDelete = () => {
    if (!selected.length) return;
    if (!window.confirm(`Delete ${selected.length} image(s)?`)) return;
    setImages((prev) => prev.filter((img) => !selected.includes(img._id)));
    setSelected([]);
  };

  const toggleSelect = (id) => setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-editorial text-3xl font-bold text-white">Media Library</h1><p className="font-sans text-xs text-white/40 mt-1">{images.length} files</p></div>
        <div className="flex items-center space-x-3">
          {selected.length > 0 && (
            <button onClick={handleDelete} className="flex items-center space-x-2 bg-red-500/15 text-red-400 border border-red-500/20 font-sans text-xs uppercase tracking-widest font-bold py-3 px-4 rounded-lg hover:bg-red-500/25 transition-all">
              <Trash2 size={13} /><span>Delete {selected.length}</span>
            </button>
          )}
          <button onClick={() => fileRef.current.click()} disabled={uploading}
            className="flex items-center space-x-2 bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3 px-5 rounded-lg hover:opacity-90 disabled:opacity-60 transition-all">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            <span>{uploading ? 'Uploading...' : 'Upload Images'}</span>
          </button>
          <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map((img) => {
          const isSelected = selected.includes(img._id);
          return (
            <div key={img._id} onClick={() => toggleSelect(img._id)}
              className={`relative rounded-xl overflow-hidden cursor-pointer group transition-all duration-200 ${isSelected ? 'ring-2 ring-gold ring-offset-2 ring-offset-[#0E0F11]' : 'hover:ring-1 hover:ring-white/20'}`}>
              <img src={img.url} alt={img.name} className="w-full aspect-square object-cover" />
              <div className={`absolute inset-0 transition-opacity duration-200 ${isSelected ? 'bg-gold/20' : 'bg-black/0 group-hover:bg-black/30'}`} />
              {isSelected && <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold flex items-center justify-center"><CheckCircle size={12} className="text-charcoal" /></div>}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-sans text-[9px] text-white truncate">{img.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
