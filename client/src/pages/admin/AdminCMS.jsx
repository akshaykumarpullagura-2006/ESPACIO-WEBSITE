import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Plus, Trash2, Save, Loader2, Upload, CheckCircle, X } from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS, notifyCMSUpdate } from '../../utils/cmsStore';
import { logAuditEvent } from '../../utils/auditStore';

// ─── Admin Testimonials ───────────────────────────────────────────────────────
export const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const mockTestimonials = [
    { _id: '1', clientName: 'Paladugu Raju', project: 'Full Home Interior', rating: 5, review: 'Good work and good communication 👍 The team at Espacio delivered our project smoothly and transparently.', status: 'published' },
    { _id: '2', clientName: 'Kishor Kumar', project: 'Modular Kitchen & Interior', rating: 5, review: 'Good experience & good working skills. The team at Espacio Interiors & Modular is dedicated and skilled.', status: 'published' },
    { _id: '3', clientName: 'Shaik BOB', project: 'Commercial & Residential', rating: 5, review: 'Recently visited the store they have wide range of varieties and the customer service was very good they were very patient and understanding.', status: 'published' },
    { _id: '4', clientName: 'Lovely boy Laxman', project: 'Luxury Villa Turnkey', rating: 5, review: 'Good equipment and well staff my house is now completely become luxurious with reasonable prices and thanks to espacio.', status: 'published' },
    { _id: '5', clientName: 'imtiyaz shaik', project: 'Apartment Fitout', rating: 5, review: 'Superb design variety and flawless material quality provided by Espacio Interiors & Modular.', status: 'published' },
    { _id: '6', clientName: 'Amresh Kumar', project: 'Master Bedroom Suite', rating: 5, review: 'Good experience and excellent service provided by Espacio Interiors & Modular.', status: 'published' },
    { _id: '7', clientName: 'KoteswaraRao Alaparthi', project: 'Material Sourcing', rating: 5, review: 'Good quality of materials and affordable prices. Great experience working with ESPACIO Interiors & Modular.', status: 'published' },
    { _id: '8', clientName: 'G Rakesh', project: 'Living Room Renovation', rating: 5, review: 'Good work and very polite team at Espacio Interiors & Modular. Highly recommended!', status: 'published' },
    { _id: '9', clientName: 'Ajayreddy Gowreddy123', project: 'Turnkey Workspace', rating: 5, review: 'Good service and excellent quality materials offered at competitive pricing by Espacio.', status: 'published' },
    { _id: '10', clientName: 'Jani Basha', project: 'Villa Interior', rating: 5, review: 'Good service excellent work 👍👏 Very happy with Espacio Interiors & Modular service quality.', status: 'published' },
    { _id: '11', clientName: 'Shaik Hussain', project: 'Office & Home Interior', rating: 5, review: 'Excellent materials for interior at home or office so pls visit this Espacio interiors and modular. Thank you...! ❤️', status: 'published' },
    { _id: '12', clientName: 'Venkatesh Mudhiraj', project: 'WPC & Fluted Panel Decor', rating: 5, review: 'Great experience ❣️ Looking forward to working with Espacio Interiors & Modular again.', status: 'published' }
  ];

  const emptyForm = { clientName: '', project: '', location: '', rating: 5, review: '', status: 'published' };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const fetch = async () => {
      const stored = getCMSData(STORAGE_KEYS.TESTIMONIALS);
      if (stored && stored.length > 0) {
        setTestimonials(stored);
        setLoading(false);
      } else {
        setTestimonials(mockTestimonials);
        setCMSData(STORAGE_KEYS.TESTIMONIALS, mockTestimonials);
        setLoading(false);
      }
      try {
        const res = await axios.get('/testimonials?limit=50');
        const fetched = res.data.data?.testimonials || res.data.data;
        if (fetched && fetched.length > 0 && !stored) {
          setTestimonials(fetched);
          setCMSData(STORAGE_KEYS.TESTIMONIALS, fetched);
        }
      } catch {}
    };
    fetch();
  }, []);

  const handleEdit = (t) => { setEditing(t); setForm({ ...emptyForm, ...t }); };
  const handleNew = () => { setEditing(null); setForm(emptyForm); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) await axios.put(`/testimonials/${editing._id}`, form);
      else await axios.post('/testimonials', form);
    } catch {}

    setTestimonials((prev) => {
      let updated;
      if (editing) {
        updated = prev.map((t) => (t._id === editing._id ? { ...t, ...form } : t));
      } else {
        updated = [{ _id: String(Date.now()), ...form }, ...prev];
      }
      setCMSData(STORAGE_KEYS.TESTIMONIALS, updated);
      return updated;
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); setEditing(null); setForm(emptyForm); }, 1200);
  };

  const handleDelete = async (id) => {
    try { await axios.delete(`/testimonials/${id}`); } catch {}
    setTestimonials((prev) => {
      const updated = prev.filter((t) => t._id !== id);
      setCMSData(STORAGE_KEYS.TESTIMONIALS, updated);
      return updated;
    });
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
    { _id: '1', question: 'How long does a project usually take?', answer: 'Typically 2–3 months, depending on the level of detailing and customization involved in your project.', category: 'timeline', order: 1 },
    { _id: '2', question: 'Do you provide turnkey interior solutions?', answer: 'Yes. Every project we take on, residential or commercial, is delivered turnkey, with design, materials, execution, and finishing handled entirely by our team.', category: 'services', order: 2 },
    { _id: '3', question: 'What is your consultation process?', answer: 'We begin with a free consultation to understand your space, requirements, and vision, before moving into detailed design and planning.', category: 'process', order: 3 },
    { _id: '4', question: 'Which locations do you currently serve?', answer: "We're proudly based in Hyderabad and have delivered residential and commercial projects across the city.", category: 'general', order: 4 },
    { _id: '5', question: 'How can customers request a quotation?', answer: 'Simply fill out our contact form on the website, and our team will get back to you to discuss your project.', category: 'pricing', order: 5 },
    { _id: '6', question: 'Do you sell materials separately from design services?', answer: 'Yes. Our materials including WPC panels, polygranite sheets, acrylic sheets, and more are available for standalone purchase, without needing to book a full design or execution project with us.', category: 'materials', order: 6 },
    { _id: '7', question: 'Do I need to be involved throughout the project, or can it be handled remotely?', answer: "We keep you informed at every key stage with regular updates and site visits, so you're never left in the dark, but you don't need to manage day-to-day execution yourself. That's what turnkey means.", category: 'process', order: 7 },
    { _id: '8', question: 'What if I already have a design in mind, can you just execute it?', answer: 'Absolutely. Whether you come with a finalized design or need us to design from scratch, we can adapt to execution-only or full design-and-build depending on what you need.', category: 'services', order: 8 },
    { _id: '9', question: 'Can I customize designs, or do you offer fixed packages?', answer: "Every project is fully customized around your space and preferences — we don't work off fixed templates or set packages.", category: 'process', order: 9 },
    { _id: '10', question: 'What happens if something needs repair after project completion?', answer: "Any issues within our warranty period are addressed directly by our team. Reach out through the contact form and we'll take care of it.", category: 'general', order: 10 }
  ];
  const emptyForm = { question: '', answer: '', category: 'process', order: 1 };
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    const fetch = async () => {
      const stored = getCMSData(STORAGE_KEYS.FAQS);
      if (stored && stored.length > 0) {
        setFaqs(stored);
        setLoading(false);
      } else {
        setFaqs(mockFAQs);
        setCMSData(STORAGE_KEYS.FAQS, mockFAQs);
        setLoading(false);
      }
      try {
        const res = await axios.get('/faqs');
        const fetched = res.data.data?.faqs || res.data.data;
        if (fetched && fetched.length > 0 && !stored) {
          setFaqs(fetched);
          setCMSData(STORAGE_KEYS.FAQS, fetched);
        }
      } catch {}
    };
    fetch();
  }, []);

  const handleEdit = (f) => { setEditing(f); setForm({ ...emptyForm, ...f }); };
  const handleNew = () => { setEditing(null); setForm(emptyForm); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await axios.put(`/faqs/${editing._id}`, form);
      else await axios.post('/faqs', form);
    } catch {}

    setFaqs((prev) => {
      let updated;
      if (editing) {
        updated = prev.map((f) => (f._id === editing._id ? { ...f, ...form } : f));
      } else {
        updated = [...prev, { _id: String(Date.now()), ...form }];
      }
      setCMSData(STORAGE_KEYS.FAQS, updated);
      return updated;
    });

    setSaving(false); setSaved(true);
    setTimeout(() => { setSaved(false); setEditing(null); setForm(emptyForm); }, 1200);
  };

  const handleDelete = async (id) => {
    try { await axios.delete(`/faqs/${id}`); } catch {}
    setFaqs((prev) => {
      const updated = prev.filter((f) => f._id !== id);
      setCMSData(STORAGE_KEYS.FAQS, updated);
      return updated;
    });
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

        <div data-lenis-prevent className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gold/40 scrollbar-track-white/5 hover:scrollbar-thumb-gold transition-all">
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
  const [settings, setSettings] = useState({
    siteName: 'ESPACIO Interiors',
    tagline: 'Engineering. Elegance. Experience.',
    adminEmail: 'tarunuttupulusu@gmail.com',
    instagram: 'https://www.instagram.com/theespacio.in',
    pinterest: '',
    youtube: '',
    enableChat: false,
    maintenanceMode: false,
    maintenance_title: "We're Upgrading Your Experience!",
    maintenance_message: "ESPACIO website is currently undergoing scheduled maintenance & enhancements. Our flagship experience center studio remains open for visits and immediate consultations.",
    maintenance_time: "Estimated Back Online: Today at 8:00 PM",
    maintenance_phone: "+91 95051 51116"
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = getCMSData(STORAGE_KEYS.SETTINGS);
    if (stored) {
      setSettings(prev => ({ ...prev, ...stored }));
    }
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Save to CMS store instantly
    setCMSData(STORAGE_KEYS.SETTINGS, settings);
    notifyCMSUpdate();

    // Non-blocking backend save
    axios.put('/settings', settings).catch(() => {});

    try {
      await logAuditEvent(
        settings.maintenanceMode ? 'Enabled Maintenance Mode' : 'Disabled Maintenance Mode',
        'Settings',
        `Maintenance Mode status: ${settings.maintenanceMode ? 'ACTIVE (Website hidden)' : 'INACTIVE (Website live)'}`
      );
    } catch {}

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inp = "w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 transition-colors";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-editorial text-3xl font-bold text-white">Site Settings & Maintenance Control</h1>
          <p className="font-sans text-xs text-white/40 mt-1">Configure global site settings and toggle website Maintenance Mode</p>
        </div>
        {settings.maintenanceMode && (
          <span className="font-sans text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-full font-bold uppercase animate-pulse">
            ⚠️ MAINTENANCE MODE ACTIVE
          </span>
        )}
      </div>

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

          <h2 className="font-editorial text-lg font-bold text-white pt-4 border-t border-white/10">Social Links</h2>
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

        <div className="space-y-5">
          {/* Maintenance Mode Controls */}
          <div className={`border rounded-xl p-6 space-y-4 transition-all ${settings.maintenanceMode ? 'bg-amber-500/10 border-amber-500/40' : 'bg-[#1A1C20] border-white/5'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-editorial text-lg font-bold text-white">Maintenance Mode</h2>
                <p className="font-sans text-xs text-white/50">When turned ON, the public website is replaced by your custom Maintenance screen.</p>
              </div>
              <div 
                onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                className={`w-12 h-6 rounded-full transition-colors duration-200 relative cursor-pointer ${settings.maintenanceMode ? 'bg-amber-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </div>
            </div>

            {settings.maintenanceMode && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="space-y-1.5">
                  <label className="font-sans text-[10px] text-amber-300 uppercase tracking-widest font-bold">Maintenance Heading / Title</label>
                  <input 
                    type="text"
                    value={settings.maintenance_title || ''}
                    onChange={(e) => setSettings({ ...settings, maintenance_title: e.target.value })}
                    placeholder="We're Upgrading Your Experience!"
                    className={inp}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-sans text-[10px] text-amber-300 uppercase tracking-widest font-bold">Maintenance Message</label>
                  <textarea 
                    rows={3}
                    value={settings.maintenance_message || ''}
                    onChange={(e) => setSettings({ ...settings, maintenance_message: e.target.value })}
                    placeholder="Explain maintenance details to site visitors..."
                    className={`${inp} resize-none`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="font-sans text-[10px] text-amber-300 uppercase tracking-widest font-bold">Estimated Back Online</label>
                    <input 
                      type="text"
                      value={settings.maintenance_time || ''}
                      onChange={(e) => setSettings({ ...settings, maintenance_time: e.target.value })}
                      placeholder="Estimated Back Online: Today at 8:00 PM"
                      className={inp}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-sans text-[10px] text-amber-300 uppercase tracking-widest font-bold">Emergency Phone / WhatsApp</label>
                    <input 
                      type="text"
                      value={settings.maintenance_phone || ''}
                      onChange={(e) => setSettings({ ...settings, maintenance_phone: e.target.value })}
                      placeholder="+91 95051 51116"
                      className={inp}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={saving || saved} className="w-full flex items-center justify-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-4 rounded-xl disabled:opacity-60 transition-all shadow-lg">
            {saved ? <><CheckCircle size={14} /><span>Settings Saved!</span></> : saving ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /><span>Save All Settings</span></>}
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
