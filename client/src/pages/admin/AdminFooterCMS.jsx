import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Share2, Save, CheckCircle, Loader2, MapPin, Phone, Mail,
  Globe, ShieldCheck, FileText, Layers, Plus, Trash2, SlidersHorizontal, HelpCircle
} from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS } from '../../utils/cmsStore';

const defaultFooterData = {
  // Location
  footer_location_title: 'LOCATION',
  footer_address: '1st floor, H.No. 6-63/14B, Moinabad Road, Aziznagar, Hyderabad, Telangana 500075',
  footer_map_url: 'https://maps.app.goo.gl/q3zbxWmEt5wvRKbZ6',

  // Contact
  footer_contact_title: 'CONTACT',
  footer_phone: '+91 95051 51116',
  footer_whatsapp: '+91 95051 51116',
  footer_email: 'Espacio.hyd@gmail.com',

  // Explore Navigation
  footer_explore_title: 'EXPLORE',
  footer_nav_items: [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Projects', path: '/projects' },
    { label: 'Spaces', path: '/what-we-do' },
    { label: 'Materials', path: '/products' },
    { label: 'About', path: '/about' },
  ],

  // Social Media Items (Default: 4 items)
  footer_social_items: [
    {
      name: 'Instagram',
      label: 'Instagram',
      href: 'https://www.instagram.com/theespacio.in',
      icon: 'instagram',
      color: '#E4405F',
      beamColor: 'rgba(228, 64, 95, 0.4)'
    },
    {
      name: 'Facebook',
      label: 'Facebook',
      href: 'https://facebook.com',
      icon: 'facebook',
      color: '#1877F2',
      beamColor: 'rgba(24, 119, 242, 0.4)'
    },
    {
      name: 'YouTube',
      label: 'YouTube',
      href: 'https://youtube.com',
      icon: 'youtube',
      color: '#FF0000',
      beamColor: 'rgba(255, 0, 0, 0.4)'
    },
    {
      name: 'WhatsApp',
      label: 'WhatsApp',
      href: 'https://wa.me/919505151116',
      icon: 'whatsapp',
      color: '#25D366',
      beamColor: 'rgba(37, 211, 102, 0.4)'
    }
  ],

  // Branding
  footer_brand_left: 'ESP',
  footer_brand_right: 'ACIO.',
  footer_brand_weight: 500,
  footer_brand_opacity: 100,

  // Copyright & Legal Links & Modal Matter
  footer_copyright: '© 2026 ESPACIO. All rights reserved.',
  footer_privacy_label: 'Privacy Policy',
  footer_privacy_link: '#',
  footer_privacy_title: 'Privacy Policy',
  footer_privacy_date: 'Last updated: July 23, 2026',
  footer_privacy_body: `Espacio ("we," "us," "our") operates theespacio.in. This Privacy Policy explains how we collect, use, and protect your information when you visit our website or submit an enquiry.

1. INFORMATION WE COLLECT
- Personal details you provide via our contact/quotation form: name, mobile number, email address
- Project details you share: property type, location, requirements, and any additional information you provide
- Basic technical data (browser type, device, pages visited) collected automatically via cookies or analytics tools

2. HOW WE USE YOUR INFORMATION
- To respond to your enquiry and provide project quotations or consultations
- To follow up regarding services or materials you've expressed interest in
- To improve our website and understand visitor behavior
- We do not sell, rent, or trade your personal information to third parties

3. DATA SHARING
We may share information with trusted service providers who help us operate our business (e.g., hosting providers, analytics tools, CRM/communication tools), solely for the purposes above. We do not share your data with third parties for their own marketing purposes.

4. COOKIES
Our website may use cookies to improve your browsing experience and understand site traffic. You can disable cookies through your browser settings, though this may affect site functionality.

5. DATA RETENTION
We retain your information only as long as necessary to respond to your enquiry or fulfill a project engagement, unless a longer retention period is required by law.

6. YOUR RIGHTS
You may request access to, correction of, or deletion of your personal data by contacting us at Espacio.hyd@gmail.com.

7. CHANGES TO THIS POLICY
We may update this Privacy Policy periodically. Changes will be posted on this page with an updated revision date.

8. CONTACT US
For questions about this Privacy Policy, contact us at Espacio.hyd@gmail.com.`,

  footer_terms_label: 'Terms of Service',
  footer_terms_link: '#',
  footer_terms_title: 'Terms & Conditions',
  footer_terms_date: 'Last updated: July 23, 2026',
  footer_terms_body: `Welcome to theespacio.in. By accessing or using this website, you agree to the following terms and conditions.

1. GENERAL
Espacio provides interior design, turnkey execution, renovation, styling, and materials supply services, as described on this website. All information on this site is for general informational purposes and does not constitute a binding offer.

2. ENQUIRIES & QUOTATIONS
Submitting an enquiry or quotation request through our website does not constitute a contract or guarantee of service. All project quotations are subject to a formal consultation and mutually agreed terms between Espacio and the client.

3. PRICING
Pricing is determined based on individual project scope, materials, and customization, and is not published on this website. Any figures discussed during consultation are estimates until formalized in a signed agreement.

4. MATERIALS SUPPLY
Materials listed on this website (e.g., WPC panels, polygranite sheets, and other products) are sold separately from design and execution services, and are subject to availability. Product specifications are subject to change without prior notice.

5. INTELLECTUAL PROPERTY
All content on this website — including text, images, logos, and designs — is the property of Espacio unless otherwise stated, and may not be reproduced without prior written permission.

6. WARRANTIES
Espacio offers a standard warranty on build and craftsmanship as communicated at the time of project agreement. Hardware and fittings are covered as per the respective manufacturer's warranty. Warranty terms are detailed in individual client agreements.

7. LIMITATION OF LIABILITY
Espacio is not liable for any indirect, incidental, or consequential damages arising from the use of this website or reliance on its content. Nothing on this website should be considered professional or legal advice.

8. EXTERNAL LINKS
Our website may contain links to third-party websites. We are not responsible for the content or practices of those sites.

9. GOVERNING LAW
These terms are governed by the laws of India, and any disputes shall be subject to the jurisdiction of the courts in Hyderabad, Telangana.

10. CHANGES TO TERMS
We reserve the right to update these Terms & Conditions at any time. Continued use of the website constitutes acceptance of the revised terms.

11. CONTACT US
For questions about these Terms & Conditions, contact us at Espacio.hyd@gmail.com.`
};

const AdminFooterCMS = () => {
  const [activeTab, setActiveTab] = useState('location'); // 'location' | 'contact' | 'nav' | 'social' | 'brand' | 'legal'
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  const [footerState, setFooterState] = useState(defaultFooterData);

  useEffect(() => {
    const fetchCMSData = async () => {
      const stored = getCMSData(STORAGE_KEYS.SETTINGS);
      if (stored) {
        setFooterState((prev) => ({
          ...prev,
          ...stored,
          footer_privacy_body: stored.footer_privacy_body || prev.footer_privacy_body,
          footer_terms_body: stored.footer_terms_body || prev.footer_terms_body,
          footer_nav_items: Array.isArray(stored.footer_nav_items) && stored.footer_nav_items.length > 0 ? stored.footer_nav_items : prev.footer_nav_items,
          footer_social_items: Array.isArray(stored.footer_social_items) && stored.footer_social_items.length > 0 ? stored.footer_social_items : prev.footer_social_items,
        }));
      }

      try {
        const res = await axios.get('/settings');
        if (res.data.success && res.data.data) {
          const d = res.data.data;
          setFooterState((prev) => {
            const merged = {
              ...prev,
              ...d,
              footer_privacy_body: d.footer_privacy_body || prev.footer_privacy_body,
              footer_terms_body: d.footer_terms_body || prev.footer_terms_body,
              footer_nav_items: Array.isArray(d.footer_nav_items) && d.footer_nav_items.length > 0 ? d.footer_nav_items : prev.footer_nav_items,
              footer_social_items: Array.isArray(d.footer_social_items) && d.footer_social_items.length > 0 ? d.footer_social_items : prev.footer_social_items,
            };
            setCMSData(STORAGE_KEYS.SETTINGS, merged);
            return merged;
          });
        }
      } catch (err) {
        console.warn('Could not load settings from backend', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCMSData();
  }, []);

  const showNotification = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const updateField = (key, val) => {
    setFooterState((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    const existingSettings = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    const updatedSettings = {
      ...existingSettings,
      ...footerState,
      exp_card1_address: footerState.footer_address || existingSettings.exp_card1_address,
      exp_card2_phone: footerState.footer_phone || existingSettings.exp_card2_phone,
      exp_card2_whatsapp: footerState.footer_whatsapp || existingSettings.exp_card2_whatsapp,
      exp_card2_email: footerState.footer_email || existingSettings.exp_card2_email,
      contact_address: footerState.footer_address || existingSettings.contact_address,
      contact_phone: footerState.footer_phone || existingSettings.contact_phone,
      contact_whatsapp: footerState.footer_whatsapp || existingSettings.contact_whatsapp,
      contact_email: footerState.footer_email || existingSettings.contact_email,
    };

    try {
      await axios.put('/settings', updatedSettings);
    } catch (err) {
      console.warn('Backend sync offline, updated in local CMS store');
    }

    setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);
    setSaving(false);
    setSaved(true);
    showNotification('Footer updated successfully.');
    setTimeout(() => setSaved(false), 2500);
  };

  const inpClass = "w-full bg-[#0E0F11] border border-white/10 focus:border-gold focus:outline-none rounded-lg font-sans text-xs px-4 py-3 text-white placeholder:text-white/25 transition-all";
  const labelClass = "font-sans text-[10px] uppercase tracking-widest text-white/50 font-bold block mb-1.5";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-white/50 space-x-3">
        <Loader2 size={24} className="animate-spin text-gold" />
        <span className="font-sans text-xs font-bold uppercase tracking-widest">Loading Footer CMS...</span>
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
          <h1 className="font-editorial text-3xl font-bold text-white">Footer Management CMS</h1>
          <p className="font-sans text-xs text-white/40 mt-1">
            Manage live website footer text content, location, phone, email, WhatsApp, navigation, social media icons, branding, copyright, and legal links.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-7 rounded-lg transition-all duration-300 disabled:opacity-60 shrink-0 shadow-lg"
        >
          {saved ? (
            <>
              <CheckCircle size={15} />
              <span>Footer Published Live!</span>
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

      {/* Tab Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/5 pb-4">
        {[
          { id: 'location', label: '1. Location', icon: MapPin },
          { id: 'contact', label: '2. Contact Info', icon: Phone },
          { id: 'nav', label: '3. Explore Navigation', icon: Globe },
          { id: 'social', label: '4. Social Media', icon: Share2 },
          { id: 'brand', label: '5. Footer Branding', icon: SlidersHorizontal },
          { id: 'legal', label: '6. Copyright & Legal', icon: ShieldCheck },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-bold transition-all shadow-md ${
              activeTab === tab.id
                ? 'bg-gold text-charcoal border border-gold shadow-[0_0_20px_rgba(201,169,110,0.3)]'
                : 'bg-[#141518] text-white/70 hover:text-white hover:bg-white/5 border border-white/10'
            }`}
          >
            <tab.icon size={14} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Form Container */}
      <div className="bg-[#141518] border border-white/5 rounded-2xl p-6 md:p-8 max-w-4xl space-y-6">

        {/* TAB 1: LOCATION */}
        {activeTab === 'location' && (
          <div className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="font-editorial text-xl font-bold text-white flex items-center space-x-2">
                <MapPin size={18} className="text-gold" />
                <span>Location Section</span>
              </h2>
              <p className="font-sans text-xs text-white/40 mt-1">Configure the physical studio address and map link shown in the footer.</p>
            </div>

            <div>
              <label className={labelClass}>Location Title</label>
              <input
                type="text"
                value={footerState.footer_location_title || 'LOCATION'}
                onChange={(e) => updateField('footer_location_title', e.target.value)}
                className={inpClass}
                placeholder="LOCATION"
              />
            </div>

            <div>
              <label className={labelClass}>Location Address</label>
              <textarea
                rows={3}
                value={footerState.footer_address || ''}
                onChange={(e) => updateField('footer_address', e.target.value)}
                className={`${inpClass} resize-none`}
                placeholder="1st floor, H.No. 6-63/14B, Moinabad Road, Aziznagar, Hyderabad, Telangana 500075"
              />
            </div>

            <div>
              <label className={labelClass}>Google Maps Target URL</label>
              <input
                type="text"
                value={footerState.footer_map_url || ''}
                onChange={(e) => updateField('footer_map_url', e.target.value)}
                className={inpClass}
                placeholder="https://maps.app.goo.gl/..."
              />
            </div>
          </div>
        )}

        {/* TAB 2: CONTACT */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="font-editorial text-xl font-bold text-white flex items-center space-x-2">
                <Phone size={18} className="text-gold" />
                <span>Contact Section</span>
              </h2>
              <p className="font-sans text-xs text-white/40 mt-1">Configure live phone, WhatsApp, and email contacts. Link targets automatically update.</p>
            </div>

            <div>
              <label className={labelClass}>Contact Section Title</label>
              <input
                type="text"
                value={footerState.footer_contact_title || 'CONTACT'}
                onChange={(e) => updateField('footer_contact_title', e.target.value)}
                className={inpClass}
                placeholder="CONTACT"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Phone Number</label>
                <input
                  type="text"
                  value={footerState.footer_phone || ''}
                  onChange={(e) => updateField('footer_phone', e.target.value)}
                  className={inpClass}
                  placeholder="+91 95051 51116"
                />
              </div>

              <div>
                <label className={labelClass}>WhatsApp Number / Link</label>
                <input
                  type="text"
                  value={footerState.footer_whatsapp || ''}
                  onChange={(e) => updateField('footer_whatsapp', e.target.value)}
                  className={inpClass}
                  placeholder="+91 95051 51116"
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Email Address</label>
              <input
                type="email"
                value={footerState.footer_email || ''}
                onChange={(e) => updateField('footer_email', e.target.value)}
                className={inpClass}
                placeholder="Espacio.hyd@gmail.com"
              />
            </div>
          </div>
        )}

        {/* TAB 3: EXPLORE NAVIGATION */}
        {activeTab === 'nav' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h2 className="font-editorial text-xl font-bold text-white flex items-center space-x-2">
                  <Globe size={18} className="text-gold" />
                  <span>Explore Navigation Links</span>
                </h2>
                <p className="font-sans text-xs text-white/40 mt-1">Edit displayed labels and link targets for the footer navigation items.</p>
              </div>
            </div>

            <div>
              <label className={labelClass}>Navigation Section Title</label>
              <input
                type="text"
                value={footerState.footer_explore_title || 'EXPLORE'}
                onChange={(e) => updateField('footer_explore_title', e.target.value)}
                className={inpClass}
                placeholder="EXPLORE"
              />
            </div>

            <div className="space-y-4 pt-2">
              {(footerState.footer_nav_items || []).map((item, idx) => (
                <div key={idx} className="bg-[#0E0F11] border border-white/10 p-4 rounded-xl space-y-3">
                  <span className="font-sans text-[10px] font-bold text-gold uppercase tracking-wider">Navigation Item #{idx + 1}</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Displayed Label</label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => {
                          const updated = [...footerState.footer_nav_items];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          updateField('footer_nav_items', updated);
                        }}
                        className={inpClass}
                        placeholder="Home"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Link Route Path</label>
                      <input
                        type="text"
                        value={item.path}
                        onChange={(e) => {
                          const updated = [...footerState.footer_nav_items];
                          updated[idx] = { ...updated[idx], path: e.target.value };
                          updateField('footer_nav_items', updated);
                        }}
                        className={inpClass}
                        placeholder="/"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SOCIAL MEDIA SECTION */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="font-editorial text-xl font-bold text-white flex items-center space-x-2">
                <Share2 size={18} className="text-gold" />
                <span>Social Media Platforms</span>
              </h2>
              <p className="font-sans text-xs text-white/40 mt-1">
                Manage platform labels, URL links, and icons. Hover animations and light spotlight emitter beams remain active.
              </p>
            </div>

            <div className="space-y-4">
              {(footerState.footer_social_items || []).map((social, idx) => (
                <div key={idx} className="bg-[#0E0F11] border border-white/10 p-5 rounded-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="font-sans text-xs font-bold text-gold uppercase tracking-wider">
                      Platform #{idx + 1} — {social.name}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={labelClass}>Platform Name / Label</label>
                      <input
                        type="text"
                        value={social.label || social.name}
                        onChange={(e) => {
                          const updated = [...footerState.footer_social_items];
                          updated[idx] = { ...updated[idx], label: e.target.value, name: e.target.value };
                          updateField('footer_social_items', updated);
                        }}
                        className={inpClass}
                        placeholder="Instagram"
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Social URL / Number</label>
                      <input
                        type="text"
                        value={social.href || ''}
                        onChange={(e) => {
                          const updated = [...footerState.footer_social_items];
                          updated[idx] = { ...updated[idx], href: e.target.value };
                          updateField('footer_social_items', updated);
                        }}
                        className={inpClass}
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Icon Type</label>
                      <select
                        value={social.icon || 'instagram'}
                        onChange={(e) => {
                          const updated = [...footerState.footer_social_items];
                          const iconType = e.target.value;
                          let color = '#E4405F';
                          let beamColor = 'rgba(228, 64, 95, 0.4)';
                          if (iconType === 'facebook') { color = '#1877F2'; beamColor = 'rgba(24, 119, 242, 0.4)'; }
                          if (iconType === 'youtube') { color = '#FF0000'; beamColor = 'rgba(255, 0, 0, 0.4)'; }
                          if (iconType === 'whatsapp') { color = '#25D366'; beamColor = 'rgba(37, 211, 102, 0.4)'; }
                          if (iconType === 'linkedin') { color = '#0A66C2'; beamColor = 'rgba(10, 102, 194, 0.4)'; }
                          if (iconType === 'twitter' || iconType === 'x') { color = '#ffffff'; beamColor = 'rgba(255, 255, 255, 0.4)'; }

                          updated[idx] = { ...updated[idx], icon: iconType, color, beamColor };
                          updateField('footer_social_items', updated);
                        }}
                        className={inpClass}
                      >
                        <option value="instagram">Instagram</option>
                        <option value="facebook">Facebook</option>
                        <option value="youtube">YouTube</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="twitter">X / Twitter</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: BRANDING */}
        {activeTab === 'brand' && (
          <div className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="font-editorial text-xl font-bold text-white flex items-center space-x-2">
                <SlidersHorizontal size={18} className="text-gold" />
                <span>Footer Branding</span>
              </h2>
              <p className="font-sans text-xs text-white/40 mt-1">
                Configure the dual-sliding brand typography displayed in the footer. Left text slides in from the left, and Right text slides in from the right.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Left Brand Text (Slides from Left)</label>
                <input
                  type="text"
                  value={footerState.footer_brand_left !== undefined ? footerState.footer_brand_left : 'ESP'}
                  onChange={(e) => updateField('footer_brand_left', e.target.value)}
                  className={inpClass}
                  placeholder="ESP"
                />
                <p className="font-sans text-[10px] text-white/30 mt-1">
                  This text slides in dynamically from the left side.
                </p>
              </div>

              <div>
                <label className={labelClass}>Right Brand Text (Slides from Right)</label>
                <input
                  type="text"
                  value={footerState.footer_brand_right !== undefined ? footerState.footer_brand_right : 'ACIO.'}
                  onChange={(e) => updateField('footer_brand_right', e.target.value)}
                  className={inpClass}
                  placeholder="ACIO."
                />
                <p className="font-sans text-[10px] text-white/30 mt-1">
                  This text slides in dynamically from the right side.
                </p>
              </div>
            </div>

            {/* Dynamic Boldness (Font Weight) Control */}
            <div className="bg-[#0E0F11] border border-white/10 p-5 rounded-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className={labelClass}>Text Boldness (Font Weight)</label>
                  <p className="font-sans text-[10px] text-white/40">Smoothly adjust the dynamic stroke boldness value of the brand text (100–900).</p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <input
                    type="number"
                    min="100"
                    max="900"
                    step="1"
                    value={footerState.footer_brand_weight || 500}
                    onChange={(e) => {
                      const val = Math.min(900, Math.max(100, Number(e.target.value) || 100));
                      updateField('footer_brand_weight', val);
                    }}
                    className="w-20 bg-[#141518] border border-gold/40 text-gold text-center font-sans text-xs font-bold py-1.5 rounded-lg focus:outline-none"
                  />
                  <span className="font-sans text-xs text-white/50 font-bold">
                    {(footerState.footer_brand_weight || 500) <= 200 ? 'Extra Light' :
                     (footerState.footer_brand_weight || 500) <= 300 ? 'Light' :
                     (footerState.footer_brand_weight || 500) <= 400 ? 'Regular' :
                     (footerState.footer_brand_weight || 500) <= 500 ? 'Medium' :
                     (footerState.footer_brand_weight || 500) <= 600 ? 'Semi-Bold' :
                     (footerState.footer_brand_weight || 500) <= 700 ? 'Bold' :
                     (footerState.footer_brand_weight || 500) <= 800 ? 'Extra Bold' : 'Black'}
                  </span>
                </div>
              </div>

              <input
                type="range"
                min="100"
                max="900"
                step="1"
                value={footerState.footer_brand_weight || 500}
                onChange={(e) => updateField('footer_brand_weight', Number(e.target.value))}
                className="w-full h-2 bg-[#141518] rounded-lg appearance-none cursor-pointer accent-gold border border-white/10"
              />
              <div className="flex justify-between font-sans text-[10px] text-white/30">
                <span>100 (Thin)</span>
                <span>500 (Medium)</span>
                <span>900 (Black)</span>
              </div>
            </div>

            {/* Brand Text Opacity Slider */}
            <div className="bg-[#0E0F11] border border-white/10 p-5 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className={labelClass}>Text Opacity</label>
                  <p className="font-sans text-[10px] text-white/40">Adjust the opacity level of the footer brand typography.</p>
                </div>
                <span className="font-sans text-xs font-bold text-gold bg-gold/10 px-3 py-1 rounded-lg border border-gold/20 shrink-0">
                  {footerState.footer_brand_opacity !== undefined ? footerState.footer_brand_opacity : 100}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={footerState.footer_brand_opacity !== undefined ? footerState.footer_brand_opacity : 100}
                onChange={(e) => updateField('footer_brand_opacity', Number(e.target.value))}
                className="w-full h-2 bg-[#141518] rounded-lg appearance-none cursor-pointer accent-gold border border-white/10"
              />
            </div>

            {/* Live Boldness & Opacity Visual Preview Card */}
            <div className="bg-[#090A0C] border border-gold/30 rounded-xl p-6 text-center space-y-3 shadow-inner">
              <span className="font-sans text-[10px] text-gold uppercase tracking-widest font-bold block">
                Live Brand Text Boldness & Opacity Preview
              </span>
              <div 
                className="text-white uppercase tracking-tight flex items-center justify-center gap-3 py-4 select-none overflow-hidden"
                style={{
                  fontFamily: "'Gotham Medium', 'Gotham Book', 'Gotham', 'Montserrat', sans-serif",
                  fontWeight: footerState.footer_brand_weight || 500,
                  opacity: (footerState.footer_brand_opacity !== undefined ? footerState.footer_brand_opacity : 100) / 100,
                  fontSize: 'clamp(28px, 4.5vw, 54px)',
                  lineHeight: 1
                }}
              >
                <span>{footerState.footer_brand_left || 'ESP'}</span>
                <span>{footerState.footer_brand_right || 'ACIO.'}</span>
              </div>
              <p className="font-sans text-[11px] text-white/50">
                Font Weight: <span className="text-gold font-bold">{footerState.footer_brand_weight || 500}</span> | Opacity: <span className="text-gold font-bold">{footerState.footer_brand_opacity !== undefined ? footerState.footer_brand_opacity : 100}%</span>
              </p>
            </div>
          </div>
        )}

        {/* TAB 6: COPYRIGHT & LEGAL */}
        {activeTab === 'legal' && (
          <div className="space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="font-editorial text-xl font-bold text-white flex items-center space-x-2">
                <ShieldCheck size={18} className="text-gold" />
                <span>Copyright & Legal Links</span>
              </h2>
              <p className="font-sans text-xs text-white/40 mt-1">Configure the copyright strip and legal modal action labels.</p>
            </div>

            <div>
              <label className={labelClass}>Copyright Text</label>
              <input
                type="text"
                value={footerState.footer_copyright || ''}
                onChange={(e) => updateField('footer_copyright', e.target.value)}
                className={inpClass}
                placeholder="© 2026 ESPACIO. All rights reserved."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Privacy Policy Label</label>
                <input
                  type="text"
                  value={footerState.footer_privacy_label || 'Privacy Policy'}
                  onChange={(e) => updateField('footer_privacy_label', e.target.value)}
                  className={inpClass}
                  placeholder="Privacy Policy"
                />
              </div>

              <div>
                <label className={labelClass}>Terms of Service Label</label>
                <input
                  type="text"
                  value={footerState.footer_terms_label || 'Terms of Service'}
                  onChange={(e) => updateField('footer_terms_label', e.target.value)}
                  className={inpClass}
                  placeholder="Terms of Service"
                />
              </div>
            </div>

            {/* Privacy Policy Modal Content Editor */}
            <div className="bg-[#0E0F11] border border-white/10 p-5 rounded-xl space-y-4">
              <span className="font-sans text-xs font-bold text-gold uppercase tracking-wider block border-b border-white/5 pb-2">
                Privacy Policy Modal Content Matter
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Modal Title</label>
                  <input
                    type="text"
                    value={footerState.footer_privacy_title || 'Privacy Policy'}
                    onChange={(e) => updateField('footer_privacy_title', e.target.value)}
                    className={inpClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Last Updated Subtitle</label>
                  <input
                    type="text"
                    value={footerState.footer_privacy_date || 'Last updated: July 23, 2026'}
                    onChange={(e) => updateField('footer_privacy_date', e.target.value)}
                    className={inpClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Privacy Policy Document Body / Matter</label>
                <textarea
                  rows={8}
                  value={footerState.footer_privacy_body || ''}
                  onChange={(e) => updateField('footer_privacy_body', e.target.value)}
                  className={`${inpClass} font-mono text-[11px] leading-relaxed resize-y`}
                  placeholder="Privacy policy content matter..."
                />
              </div>
            </div>

            {/* Terms & Conditions Modal Content Editor */}
            <div className="bg-[#0E0F11] border border-white/10 p-5 rounded-xl space-y-4">
              <span className="font-sans text-xs font-bold text-gold uppercase tracking-wider block border-b border-white/5 pb-2">
                Terms & Conditions Modal Content Matter
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Modal Title</label>
                  <input
                    type="text"
                    value={footerState.footer_terms_title || 'Terms & Conditions'}
                    onChange={(e) => updateField('footer_terms_title', e.target.value)}
                    className={inpClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Last Updated Subtitle</label>
                  <input
                    type="text"
                    value={footerState.footer_terms_date || 'Last updated: July 23, 2026'}
                    onChange={(e) => updateField('footer_terms_date', e.target.value)}
                    className={inpClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Terms & Conditions Document Body / Matter</label>
                <textarea
                  rows={8}
                  value={footerState.footer_terms_body || ''}
                  onChange={(e) => updateField('footer_terms_body', e.target.value)}
                  className={`${inpClass} font-mono text-[11px] leading-relaxed resize-y`}
                  placeholder="Terms & conditions content matter..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Action */}
        <div className="pt-6 border-t border-white/5 flex items-center justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-8 rounded-lg transition-all duration-300 disabled:opacity-60 shadow-lg"
          >
            {saved ? (
              <>
                <CheckCircle size={15} />
                <span>Footer Published Live!</span>
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

      </div>
    </div>
  );
};

export default AdminFooterCMS;
