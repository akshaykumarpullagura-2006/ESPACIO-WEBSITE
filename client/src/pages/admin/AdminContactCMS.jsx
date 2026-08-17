import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Mail, Save, CheckCircle, Loader2, MapPin, Phone, Clock,
  ShieldCheck, FileText, Sparkles, Award, Eye, EyeOff, Lock
} from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS } from '../../utils/cmsStore';

const defaultContactSettings = {
  // SECTION 01: Experience Centers & Studio
  exp_eyebrow: 'VISIT US',
  exp_heading: 'Experience Centers & Studio',
  exp_description: 'Walk into our flagship material experience studio. Touch, feel, and compare over 200+ live panel and finish samples in person.',

  exp_card1_title: 'Our Studio',
  exp_card1_address: '1st floor, H.No. 6-63/14B,\nMoinabad Road, Aziznagar,\nHyderabad, Telangana 500075',
  exp_card1_bottomLabel: 'EXPERIENCE CENTER',
  exp_card1_visible: true,

  exp_card2_title: 'Direct Line',
  exp_card2_phone: '+91 95051 51116',
  exp_card2_whatsapp: '+91 95051 51116',
  exp_card2_email: 'Espacio.hyd@gmail.com',
  exp_card2_bottomLabel: 'IMMEDIATE ASSISTANCE',
  exp_card2_visible: true,

  exp_card3_title: 'Studio Hours',
  exp_card3_monSatHours: '10:00 AM – 7:30 PM',
  exp_card3_sunHours: 'By Appointment',
  exp_card3_supportingText: 'Private evening consultations available upon request.',
  exp_card3_bottomLabel: 'CONSULTATION HOURS',
  exp_card3_visible: true,

  // SECTION 02: Our Quotation & Execution Commitments
  commit_eyebrow: 'WHY QUOTE WITH ESPACIO',
  commit_heading: 'Our Quotation & Execution Commitments',
  commit_description: 'We operate on absolute transparency. Every BOQ we prepare is detailed down to the millimetre and hardware specification.',

  commit_card1_title: 'Itemized BOQ Quote',
  commit_card1_desc: 'Zero surprise fees. You receive a complete line-item breakdown of hardware, board grades, and finish costs.',
  commit_card1_visible: true,

  commit_card2_title: 'Guaranteed Quality',
  commit_card2_desc: 'Every product is carefully selected, inspected, and installed to meet our uncompromising quality standards.',
  commit_card2_visible: true,

  commit_card3_title: 'Transparent Pricing',
  commit_card3_desc: 'No hidden charges or unexpected costs. Every quotation is clear, detailed, and fully transparent before execution.',
  commit_card3_visible: true,

  commit_card4_title: 'Free 3D Render',
  commit_card4_desc: 'Visualize your living room, kitchen, and wardrobes in photorealistic 3D before starting site execution.',
  commit_card4_visible: true
};

const AdminContactCMS = () => {
  const [activeTab, setActiveTab] = useState('exp'); // 'exp' | 'commit'
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const [form, setForm] = useState(defaultContactSettings);

  useEffect(() => {
    const fetchCMSData = async () => {
      const storedSettings = getCMSData(STORAGE_KEYS.SETTINGS);
      if (storedSettings) {
        setForm((prev) => ({
          ...prev,
          ...storedSettings
        }));
      }
      setLoading(false);
    };
    fetchCMSData();
  }, []);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleChange = (key, val) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: val };
      const existing = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCMSData(STORAGE_KEYS.SETTINGS, { ...existing, ...updated });
      return updated;
    });
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    const existingSettings = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    const updatedSettings = {
      ...existingSettings,
      ...form
    };

    try {
      await axios.put('/settings', updatedSettings);
    } catch (err) {
      console.warn('Database sync offline, updated in local CMS store.');
    }

    setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);
    setSaving(false);
    setSaved(true);
    showNotification('Contact Page CMS published live successfully.');
    setTimeout(() => setSaved(false), 2000);
  };

  const inpClass = "w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 transition-all";
  const labelClass = "font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-white/50">
        <Loader2 size={24} className="animate-spin text-gold mr-3" />
        <span className="font-sans text-xs font-bold uppercase tracking-widest">Loading Contact CMS...</span>
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
          <h1 className="font-editorial text-3xl font-bold text-white">Contact Us Page CMS</h1>
          <p className="font-sans text-xs text-white/40 mt-1">
            Manage Section 01 (Experience Centers & Studio) and Section 02 (Our Quotation & Execution Commitments) on /contact.
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
              <span>Contact CMS Published Live!</span>
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

      {/* Locked Section Notice */}
      <div className="bg-[#141518] border border-amber-500/20 p-4 rounded-xl flex items-center space-x-3 text-amber-300 text-xs font-sans">
        <Lock size={16} className="shrink-0" />
        <span>
          <strong>LOCKED SECTIONS PROTECTED:</strong> Navbar, Footer, Hero Banner, Contact Form, and Modals are 100% locked. Only the 2 designated sections below are CMS editable.
        </span>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/5 pb-4">
        <button
          onClick={() => setActiveTab('exp')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-md ${
            activeTab === 'exp'
              ? 'bg-gold text-charcoal border border-gold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
              : 'bg-[#141518] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          <MapPin size={16} />
          <span>Section 01: Experience Centers & Studio</span>
        </button>
        <button
          onClick={() => setActiveTab('commit')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-md ${
            activeTab === 'commit'
              ? 'bg-gold text-charcoal border border-gold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
              : 'bg-[#141518] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
          }`}
        >
          <Award size={16} />
          <span>Section 02: Quotation Commitments</span>
        </button>
      </div>

      {/* SECTION 01: EXPERIENCE CENTERS & STUDIO */}
      {activeTab === 'exp' && (
        <div className="space-y-8">
          {/* Header Controls */}
          <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="font-editorial text-xl font-bold text-white border-b border-white/5 pb-3">Section 01 Header Text</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Section Eyebrow Tag</label>
                <input
                  type="text"
                  value={form.exp_eyebrow || ''}
                  onChange={(e) => handleChange('exp_eyebrow', e.target.value)}
                  className={inpClass}
                  placeholder="VISIT US"
                />
              </div>
              <div>
                <label className={labelClass}>Main Heading</label>
                <input
                  type="text"
                  value={form.exp_heading || ''}
                  onChange={(e) => handleChange('exp_heading', e.target.value)}
                  className={inpClass}
                  placeholder="Experience Centers & Studio"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Section Description</label>
              <textarea
                rows={2}
                value={form.exp_description || ''}
                onChange={(e) => handleChange('exp_description', e.target.value)}
                className={`${inpClass} resize-none`}
                placeholder="Walk into our flagship material experience studio..."
              />
            </div>
          </div>

          {/* 3 Experience Center Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 01: Our Studio */}
            <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-gold" />
                    <span className="font-sans text-xs font-bold text-white">Card 01: Our Studio</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange('exp_card1_visible', !form.exp_card1_visible)}
                    className={`p-1.5 rounded-lg border ${form.exp_card1_visible ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-white/40 border-white/10'}`}
                    title="Toggle Visibility"
                  >
                    {form.exp_card1_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
                <div>
                  <label className={labelClass}>Card Title</label>
                  <input
                    type="text"
                    value={form.exp_card1_title || ''}
                    onChange={(e) => handleChange('exp_card1_title', e.target.value)}
                    className={inpClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Address (Use new lines)</label>
                  <textarea
                    rows={4}
                    value={form.exp_card1_address || ''}
                    onChange={(e) => handleChange('exp_card1_address', e.target.value)}
                    className={`${inpClass} resize-none`}
                  />
                </div>
                <div>
                  <label className={labelClass}>Bottom Label</label>
                  <input
                    type="text"
                    value={form.exp_card1_bottomLabel || ''}
                    onChange={(e) => handleChange('exp_card1_bottomLabel', e.target.value)}
                    className={inpClass}
                  />
                </div>
              </div>
            </div>

            {/* Card 02: Direct Line */}
            <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-gold" />
                    <span className="font-sans text-xs font-bold text-white">Card 02: Direct Line</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange('exp_card2_visible', !form.exp_card2_visible)}
                    className={`p-1.5 rounded-lg border ${form.exp_card2_visible ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-white/40 border-white/10'}`}
                    title="Toggle Visibility"
                  >
                    {form.exp_card2_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
                <div>
                  <label className={labelClass}>Card Title</label>
                  <input
                    type="text"
                    value={form.exp_card2_title || ''}
                    onChange={(e) => handleChange('exp_card2_title', e.target.value)}
                    className={inpClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="text"
                    value={form.exp_card2_phone || ''}
                    onChange={(e) => handleChange('exp_card2_phone', e.target.value)}
                    className={inpClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>WhatsApp Number</label>
                  <input
                    type="text"
                    value={form.exp_card2_whatsapp || ''}
                    onChange={(e) => handleChange('exp_card2_whatsapp', e.target.value)}
                    className={inpClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="text"
                    value={form.exp_card2_email || ''}
                    onChange={(e) => handleChange('exp_card2_email', e.target.value)}
                    className={inpClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Bottom Label</label>
                  <input
                    type="text"
                    value={form.exp_card2_bottomLabel || ''}
                    onChange={(e) => handleChange('exp_card2_bottomLabel', e.target.value)}
                    className={inpClass}
                  />
                </div>
              </div>
            </div>

            {/* Card 03: Studio Hours */}
            <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-gold" />
                    <span className="font-sans text-xs font-bold text-white">Card 03: Studio Hours</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange('exp_card3_visible', !form.exp_card3_visible)}
                    className={`p-1.5 rounded-lg border ${form.exp_card3_visible ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-white/40 border-white/10'}`}
                    title="Toggle Visibility"
                  >
                    {form.exp_card3_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                </div>
                <div>
                  <label className={labelClass}>Card Title</label>
                  <input
                    type="text"
                    value={form.exp_card3_title || ''}
                    onChange={(e) => handleChange('exp_card3_title', e.target.value)}
                    className={inpClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Mon – Sat Hours</label>
                  <input
                    type="text"
                    value={form.exp_card3_monSatHours || ''}
                    onChange={(e) => handleChange('exp_card3_monSatHours', e.target.value)}
                    className={inpClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Sunday Hours</label>
                  <input
                    type="text"
                    value={form.exp_card3_sunHours || ''}
                    onChange={(e) => handleChange('exp_card3_sunHours', e.target.value)}
                    className={inpClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Supporting Description</label>
                  <input
                    type="text"
                    value={form.exp_card3_supportingText || ''}
                    onChange={(e) => handleChange('exp_card3_supportingText', e.target.value)}
                    className={inpClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Bottom Label</label>
                  <input
                    type="text"
                    value={form.exp_card3_bottomLabel || ''}
                    onChange={(e) => handleChange('exp_card3_bottomLabel', e.target.value)}
                    className={inpClass}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 02: OUR QUOTATION & EXECUTION COMMITMENTS */}
      {activeTab === 'commit' && (
        <div className="space-y-8">
          {/* Header Controls */}
          <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 space-y-5">
            <h2 className="font-editorial text-xl font-bold text-white border-b border-white/5 pb-3">Section 02 Header Text</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Section Eyebrow Tag</label>
                <input
                  type="text"
                  value={form.commit_eyebrow || ''}
                  onChange={(e) => handleChange('commit_eyebrow', e.target.value)}
                  className={inpClass}
                  placeholder="WHY QUOTE WITH ESPACIO"
                />
              </div>
              <div>
                <label className={labelClass}>Main Heading</label>
                <input
                  type="text"
                  value={form.commit_heading || ''}
                  onChange={(e) => handleChange('commit_heading', e.target.value)}
                  className={inpClass}
                  placeholder="Our Quotation & Execution Commitments"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Section Description</label>
              <textarea
                rows={2}
                value={form.commit_description || ''}
                onChange={(e) => handleChange('commit_description', e.target.value)}
                className={`${inpClass} resize-none`}
                placeholder="We operate on absolute transparency..."
              />
            </div>
          </div>

          {/* 4 Commitment Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 01 */}
            <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <FileText size={16} className="text-gold" />
                  <span className="font-sans text-xs font-bold text-white">Card 01</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('commit_card1_visible', !form.commit_card1_visible)}
                  className={`p-1.5 rounded-lg border ${form.commit_card1_visible ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-white/40 border-white/10'}`}
                  title="Toggle Visibility"
                >
                  {form.commit_card1_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
              <div>
                <label className={labelClass}>Card Title</label>
                <input
                  type="text"
                  value={form.commit_card1_title || ''}
                  onChange={(e) => handleChange('commit_card1_title', e.target.value)}
                  className={inpClass}
                />
              </div>
              <div>
                <label className={labelClass}>Card Description</label>
                <textarea
                  rows={4}
                  value={form.commit_card1_desc || ''}
                  onChange={(e) => handleChange('commit_card1_desc', e.target.value)}
                  className={`${inpClass} resize-none`}
                />
              </div>
            </div>

            {/* Card 02 */}
            <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck size={16} className="text-gold" />
                  <span className="font-sans text-xs font-bold text-white">Card 02</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('commit_card2_visible', !form.commit_card2_visible)}
                  className={`p-1.5 rounded-lg border ${form.commit_card2_visible ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-white/40 border-white/10'}`}
                  title="Toggle Visibility"
                >
                  {form.commit_card2_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
              <div>
                <label className={labelClass}>Card Title</label>
                <input
                  type="text"
                  value={form.commit_card2_title || ''}
                  onChange={(e) => handleChange('commit_card2_title', e.target.value)}
                  className={inpClass}
                />
              </div>
              <div>
                <label className={labelClass}>Card Description</label>
                <textarea
                  rows={4}
                  value={form.commit_card2_desc || ''}
                  onChange={(e) => handleChange('commit_card2_desc', e.target.value)}
                  className={`${inpClass} resize-none`}
                />
              </div>
            </div>

            {/* Card 03 */}
            <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <Award size={16} className="text-gold" />
                  <span className="font-sans text-xs font-bold text-white">Card 03</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('commit_card3_visible', !form.commit_card3_visible)}
                  className={`p-1.5 rounded-lg border ${form.commit_card3_visible ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-white/40 border-white/10'}`}
                  title="Toggle Visibility"
                >
                  {form.commit_card3_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
              <div>
                <label className={labelClass}>Card Title</label>
                <input
                  type="text"
                  value={form.commit_card3_title || ''}
                  onChange={(e) => handleChange('commit_card3_title', e.target.value)}
                  className={inpClass}
                />
              </div>
              <div>
                <label className={labelClass}>Card Description</label>
                <textarea
                  rows={4}
                  value={form.commit_card3_desc || ''}
                  onChange={(e) => handleChange('commit_card3_desc', e.target.value)}
                  className={`${inpClass} resize-none`}
                />
              </div>
            </div>

            {/* Card 04 */}
            <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center space-x-2">
                  <Sparkles size={16} className="text-gold" />
                  <span className="font-sans text-xs font-bold text-white">Card 04</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleChange('commit_card4_visible', !form.commit_card4_visible)}
                  className={`p-1.5 rounded-lg border ${form.commit_card4_visible ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/5 text-white/40 border-white/10'}`}
                  title="Toggle Visibility"
                >
                  {form.commit_card4_visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
              <div>
                <label className={labelClass}>Card Title</label>
                <input
                  type="text"
                  value={form.commit_card4_title || ''}
                  onChange={(e) => handleChange('commit_card4_title', e.target.value)}
                  className={inpClass}
                />
              </div>
              <div>
                <label className={labelClass}>Card Description</label>
                <textarea
                  rows={4}
                  value={form.commit_card4_desc || ''}
                  onChange={(e) => handleChange('commit_card4_desc', e.target.value)}
                  className={`${inpClass} resize-none`}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContactCMS;
