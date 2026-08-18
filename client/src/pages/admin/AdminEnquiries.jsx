import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, Filter, Eye, CheckCircle, Clock, XCircle, AlertCircle, Mail, Phone, 
  MapPin, Download, MessageSquare, Calendar, ChevronRight, User, Layers, FileText, 
  Sparkles, Package, ArrowUpRight, CheckCircle2, UserCheck, PhoneCall, RefreshCw, Send, Calculator
} from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS, notifyCMSUpdate } from '../../utils/cmsStore';
import { db, collection, getDocs, updateDoc, doc, query, orderBy } from '../../lib/firebaseClient';

// Status Configuration
const statusConfig = {
  NEW: { label: 'NEW', color: 'text-gold', bg: 'bg-gold/15 border-gold/30', icon: AlertCircle },
  CONTACTED: { label: 'CONTACTED', color: 'text-blue-400', bg: 'bg-blue-400/15 border-blue-400/30', icon: PhoneCall },
  IN_PROGRESS: { label: 'IN PROGRESS', color: 'text-purple-400', bg: 'bg-purple-400/15 border-purple-400/30', icon: Clock },
  FOLLOW_UP: { label: 'FOLLOW UP', color: 'text-amber-400', bg: 'bg-amber-400/15 border-amber-400/30', icon: Calendar },
  CONVERTED: { label: 'CONVERTED', color: 'text-emerald-400', bg: 'bg-emerald-400/15 border-emerald-400/30', icon: CheckCircle },
  CLOSED: { label: 'CLOSED', color: 'text-stone-400', bg: 'bg-stone-400/15 border-stone-400/30', icon: CheckCircle2 },
  CANCELLED: { label: 'CANCELLED', color: 'text-red-400', bg: 'bg-red-400/15 border-red-400/30', icon: XCircle }
};

// Main Type Badges
const typeConfig = {
  INSTANT_ESTIMATE: { label: 'INSTANT PROJECT ESTIMATE', color: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/30', prefix: 'ESP-EST' },
  FREE_ESTIMATE: { label: 'FREE ESTIMATE', color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/30', prefix: 'ESP-FE' },
  CATALOGUE_REQUEST: { label: 'CATALOGUE REQUEST', color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/30', prefix: 'ESP-CR' },
  DESIGN_ENQUIRY: { label: 'DESIGN ENQUIRY', color: 'text-gold', bg: 'bg-gold/15 border-gold/30', prefix: 'ESP-DE' },
  INDIVIDUAL_ENQUIRY: { label: 'INDIVIDUAL', color: 'text-purple-400', bg: 'bg-purple-500/15 border-purple-500/30', prefix: 'ESP-IN' }
};

// Initial Seed Dataset
const seedEnquiries = [
  {
    id: 'ESP-EST-00001',
    enquiryId: 'ESP-EST-00001',
    type: 'INSTANT_ESTIMATE',
    source: 'INSTANT_PROJECT_ESTIMATE',
    requirementType: 'INSTANT_ESTIMATE',
    name: 'Vikram Rao',
    email: 'vikram.rao@gmail.com',
    phone: '+91 98490 12345',
    location: 'Property: 3 BHK',
    propertyType: '3 BHK',
    scopeOfWork: 'Turnkey Full Home',
    finishGrade: 'Premium',
    status: 'NEW',
    read: false,
    submittedAt: new Date(Date.now() - 1800000).toISOString(),
    notesText: 'Instant Project Estimate Submission — Property: 3 BHK, Scope: Turnkey Full Home, Grade: Premium',
    notes: [{ id: 'n-est-1', text: 'Captured via Instant Project Estimate calculator on Services page.', createdAt: new Date(Date.now() - 1800000).toISOString() }],
    followUp: null
  },
  {
    id: 'ESP-DE-00001',
    enquiryId: 'ESP-DE-00001',
    type: 'DESIGN_ENQUIRY',
    source: 'LET_S_DESIGN_SOMETHING_REMARKABLE',
    requirementType: 'TURNKEY_INTERIORS',
    name: 'Rahul Varma',
    email: 'rahul.v@gmail.com',
    phone: '+91 98765 43210',
    location: 'Banjara Hills, Hyderabad',
    propertyType: '3BHK Villa',
    spaces: 'Living Room, Master Bedroom, Modular Kitchen',
    size: '2800 sq ft',
    stage: 'Possession in 1 month',
    status: 'NEW',
    read: false,
    submittedAt: new Date(Date.now() - 3600000).toISOString(),
    notesText: 'Looking for full turnkey interior design and execution with Italian marble & veneer finishes.',
    notes: [{ id: 'n1', text: 'Initial lead captured via design wizard.', createdAt: new Date(Date.now() - 3600000).toISOString() }],
    followUp: null
  },
  {
    id: 'ESP-FE-00001',
    enquiryId: 'ESP-FE-00001',
    type: 'FREE_ESTIMATE',
    source: 'GET_FREE_ESTIMATE',
    name: 'Priya Sharma',
    email: 'priya.sharma@techcorp.in',
    phone: '+91 91234 56789',
    phone2: '+91 91234 00000',
    location: 'Jubilee Hills, Hyderabad',
    status: 'CONTACTED',
    read: true,
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    notesText: 'Requested a free estimate for a 4BHK duplex apartment in Jubilee Hills.',
    notes: [{ id: 'n2', text: 'Sent initial BOQ estimate template on WhatsApp.', createdAt: new Date(Date.now() - 40000000).toISOString() }],
    followUp: { date: '2026-08-20', time: '11:00', note: 'Call to review BOQ line items' }
  },
  {
    id: 'ESP-CR-00001',
    enquiryId: 'ESP-CR-00001',
    type: 'CATALOGUE_REQUEST',
    source: 'CATALOGUE_REQUEST',
    name: 'Sanjay Mehta',
    email: 'sanjay.m@business.com',
    phone: '+91 98888 77777',
    location: 'Gachibowli, Hyderabad',
    catalogueMaterial: 'WPC Louvers & Acrylic Fluted Panels',
    status: 'IN_PROGRESS',
    read: true,
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
    notesText: 'Downloaded material catalog for WPC panels & Charcoal sheets.',
    notes: [],
    followUp: null
  },
  {
    id: 'ESP-IN-00001',
    enquiryId: 'ESP-IN-00001',
    type: 'INDIVIDUAL_ENQUIRY',
    source: 'INDIVIDUAL',
    name: 'Kavitha Rao',
    email: 'kavitha.rao@gmail.com',
    phone: '+91 97000 11223',
    location: 'Kondapur, Hyderabad',
    individualRequirement: 'Island Modular Kitchen with acrylic gloss finish and Blum soft-close hardware.',
    status: 'NEW',
    read: false,
    submittedAt: new Date(Date.now() - 259200000).toISOString(),
    notesText: 'Only interested in Modular Kitchen design and installation.',
    notes: [],
    followUp: null
  },
  {
    id: 'ESP-DE-00002',
    enquiryId: 'ESP-DE-00002',
    type: 'DESIGN_ENQUIRY',
    source: 'LET_S_DESIGN_SOMETHING_REMARKABLE',
    requirementType: 'MATERIALS',
    name: 'Arjun Reddy',
    email: 'arjun.reddy@realestate.in',
    phone: '+91 95555 44433',
    location: 'Financial District, Nanakramguda',
    materialCategories: 'Polygranite Sheets, WPC Panels, Louvers',
    quantity: '50 Sheets',
    status: 'FOLLOW_UP',
    read: true,
    submittedAt: new Date(Date.now() - 345600000).toISOString(),
    notesText: 'Commercial builder sourcing materials directly for luxury apartment lobby.',
    notes: [{ id: 'n3', text: 'Quoted bulk discount rate for 50 polygranite sheets.', createdAt: new Date(Date.now() - 200000000).toISOString() }],
    followUp: { date: '2026-08-22', time: '15:30', note: 'Site visit for sample handover' }
  }
];

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'OVERVIEW' | 'ALL' | 'FREE_ESTIMATE' | 'CATALOGUE_REQUEST' | 'DESIGN_ENQUIRY' | 'INDIVIDUAL_ENQUIRY'
  const [designSubFilter, setDesignSubFilter] = useState('ALL'); // 'ALL' | 'TURNKEY_INTERIORS' | 'DESIGN_ONLY' | 'RENOVATION' | 'MATERIALS' | 'SOMETHING_ELSE'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL_TIME'); // 'ALL_TIME' | 'TODAY' | 'YESTERDAY' | 'THIS_WEEK' | 'THIS_MONTH'
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  // Notes state
  const [newNoteText, setNewNoteText] = useState('');
  // Follow-up state
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpTime, setFollowUpTime] = useState('');
  const [followUpNote, setFollowUpNote] = useState('');

  // ── Load & Normalize Enquiries Data ──────────────────────────────────────
  const loadData = () => {
    try {
      let stored = getCMSData(STORAGE_KEYS.ENQUIRIES);
      if (!Array.isArray(stored) || stored.length === 0) {
        stored = seedEnquiries;
        setCMSData(STORAGE_KEYS.ENQUIRIES, seedEnquiries);
      }

      // Perform strict migration & cleanup:
      // 1. Convert any legacy requirementType === 'INDIVIDUAL' inside DESIGN_ENQUIRY to type: 'INDIVIDUAL_ENQUIRY'
      // 2. Filter out any legacy CONTACT_ENQUIRY entries
      const cleaned = stored
        .filter(item => item.type !== 'CONTACT_ENQUIRY' && item.source !== 'CONTACT_US')
        .map(item => {
          if (item.type === 'DESIGN_ENQUIRY' && item.requirementType === 'INDIVIDUAL') {
            return {
              ...item,
              type: 'INDIVIDUAL_ENQUIRY',
              source: 'INDIVIDUAL',
              enquiryId: item.enquiryId ? item.enquiryId.replace('ESP-DE', 'ESP-IN') : `ESP-IN-${Math.floor(10000 + Math.random() * 90000)}`,
              requirementType: undefined
            };
          }
          return item;
        });

      setEnquiries(cleaned);
      setCMSData(STORAGE_KEYS.ENQUIRIES, cleaned);
    } catch (err) {
      console.error('Error loading enquiries:', err);
      setEnquiries(seedEnquiries);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('espacio_cms_update', loadData);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('espacio_cms_update', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  // ── Mark as Read when selected ───────────────────────────────────────────
  const handleSelectEnquiry = (item) => {
    setSelectedEnquiry(item);
    if (!item.read) {
      const updated = enquiries.map(e => e.id === item.id || e.enquiryId === item.enquiryId ? { ...e, read: true } : e);
      setEnquiries(updated);
      setCMSData(STORAGE_KEYS.ENQUIRIES, updated);
      notifyCMSUpdate();
    }
  };

  // ── Update Status ────────────────────────────────────────────────────────
  const handleUpdateStatus = async (id, newStatus) => {
    const updated = enquiries.map(e => (e.id === id || e.enquiryId === id) ? { ...e, status: newStatus } : e);
    setEnquiries(updated);
    setCMSData(STORAGE_KEYS.ENQUIRIES, updated);
    notifyCMSUpdate();
    if (selectedEnquiry && (selectedEnquiry.id === id || selectedEnquiry.enquiryId === id)) {
      setSelectedEnquiry(prev => ({ ...prev, status: newStatus }));
    }
    try {
      const { logAuditEvent } = await import('../../utils/auditStore');
      await logAuditEvent('Updated Enquiry Status', 'Enquiries', `Changed status of enquiry ${id} for ${selectedEnquiry?.name || 'Client'} to ${newStatus}`);
    } catch {}
  };

  // ── Add Internal Note ───────────────────────────────────────────────────
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedEnquiry) return;
    const noteObj = {
      id: `note_${Date.now()}`,
      text: newNoteText.trim(),
      createdAt: new Date().toISOString()
    };
    const updatedNotes = [...(selectedEnquiry.notes || []), noteObj];
    const updated = enquiries.map(item => 
      (item.id === selectedEnquiry.id || item.enquiryId === selectedEnquiry.enquiryId) 
        ? { ...item, notes: updatedNotes } 
        : item
    );
    setEnquiries(updated);
    setCMSData(STORAGE_KEYS.ENQUIRIES, updated);
    notifyCMSUpdate();
    setSelectedEnquiry(prev => ({ ...prev, notes: updatedNotes }));
    setNewNoteText('');
  };

  // ── Set Follow-Up Reminder ────────────────────────────────────────────────
  const handleSaveFollowUp = (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    const followUpObj = {
      date: followUpDate,
      time: followUpTime,
      note: followUpNote
    };
    const updated = enquiries.map(item => 
      (item.id === selectedEnquiry.id || item.enquiryId === selectedEnquiry.enquiryId) 
        ? { ...item, followUp: followUpObj, status: item.status === 'NEW' ? 'FOLLOW_UP' : item.status } 
        : item
    );
    setEnquiries(updated);
    setCMSData(STORAGE_KEYS.ENQUIRIES, updated);
    notifyCMSUpdate();
    setSelectedEnquiry(prev => ({ ...prev, followUp: followUpObj }));
  };

  // ── Filtered Records Calculation ──────────────────────────────────────────
  const filteredEnquiries = enquiries.filter(item => {
    // 1. Tab Filter
    if (activeTab === 'FREE_ESTIMATE' && item.type !== 'FREE_ESTIMATE') return false;
    if (activeTab === 'INSTANT_ESTIMATE' && item.type !== 'INSTANT_ESTIMATE') return false;
    if (activeTab === 'CATALOGUE_REQUEST' && item.type !== 'CATALOGUE_REQUEST') return false;
    if (activeTab === 'DESIGN_ENQUIRY' && item.type !== 'DESIGN_ENQUIRY') return false;
    if (activeTab === 'INDIVIDUAL_ENQUIRY' && item.type !== 'INDIVIDUAL_ENQUIRY') return false;

    // 2. Design Sub-filter (only applies inside DESIGN_ENQUIRY)
    if (activeTab === 'DESIGN_ENQUIRY' && designSubFilter !== 'ALL') {
      if (item.requirementType !== designSubFilter) return false;
    }

    // 3. Status Filter
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;

    // 4. Date Filter
    if (dateFilter !== 'ALL_TIME' && item.submittedAt) {
      const date = new Date(item.submittedAt);
      const now = new Date();
      if (dateFilter === 'TODAY' && date.toDateString() !== now.toDateString()) return false;
      if (dateFilter === 'YESTERDAY') {
        const yest = new Date(now);
        yest.setDate(yest.getDate() - 1);
        if (date.toDateString() !== yest.toDateString()) return false;
      }
    }

    // 5. Search Filter
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = item.name?.toLowerCase().includes(q);
      const matchEmail = item.email?.toLowerCase().includes(q);
      const matchPhone = item.phone?.toLowerCase().includes(q);
      const matchLoc = item.location?.toLowerCase().includes(q);
      const matchId = (item.enquiryId || item.id)?.toLowerCase().includes(q);
      const matchNotes = item.notesText?.toLowerCase().includes(q) || item.notes?.some(n => n.text.toLowerCase().includes(q));
      if (!matchName && !matchEmail && !matchPhone && !matchLoc && !matchId && !matchNotes) return false;
    }

    return true;
  });

  // ── Stats Overview Calculations ───────────────────────────────────────────
  const stats = {
    total: enquiries.length,
    freeEstimates: enquiries.filter(e => e.type === 'FREE_ESTIMATE').length,
    instantEstimates: enquiries.filter(e => e.type === 'INSTANT_ESTIMATE').length,
    catalogues: enquiries.filter(e => e.type === 'CATALOGUE_REQUEST').length,
    designEnquiries: enquiries.filter(e => e.type === 'DESIGN_ENQUIRY').length,
    individualEnquiries: enquiries.filter(e => e.type === 'INDIVIDUAL_ENQUIRY').length,
    newCount: enquiries.filter(e => e.status === 'NEW').length,
    unreadCount: enquiries.filter(e => e.read === false).length,
    // Design Breakdown
    designTurnkey: enquiries.filter(e => e.type === 'DESIGN_ENQUIRY' && e.requirementType === 'TURNKEY_INTERIORS').length,
    designOnly: enquiries.filter(e => e.type === 'DESIGN_ENQUIRY' && e.requirementType === 'DESIGN_ONLY').length,
    designRenovation: enquiries.filter(e => e.type === 'DESIGN_ENQUIRY' && e.requirementType === 'RENOVATION').length,
    designMaterials: enquiries.filter(e => e.type === 'DESIGN_ENQUIRY' && e.requirementType === 'MATERIALS').length,
    designSomethingElse: enquiries.filter(e => e.type === 'DESIGN_ENQUIRY' && e.requirementType === 'SOMETHING_ELSE').length
  };

  // ── CSV Export ────────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    const dataToExport = filteredEnquiries.length > 0 ? filteredEnquiries : enquiries;
    const headers = ['Enquiry ID', 'Type', 'Source', 'Requirement Type', 'Customer Name', 'Phone', 'Email', 'Location', 'Status', 'Read', 'Submitted At', 'Notes / Details'];
    const rows = dataToExport.map(item => [
      `"${item.enquiryId || item.id}"`,
      `"${item.type}"`,
      `"${item.source || ''}"`,
      `"${item.requirementType || 'N/A'}"`,
      `"${(item.name || '').replace(/"/g, '""')}"`,
      `"${(item.phone || '').replace(/"/g, '""')}"`,
      `"${(item.email || '').replace(/"/g, '""')}"`,
      `"${(item.location || '').replace(/"/g, '""')}"`,
      `"${item.status || 'NEW'}"`,
      `"${item.read ? 'READ' : 'UNREAD'}"`,
      `"${item.submittedAt ? new Date(item.submittedAt).toLocaleString('en-IN') : 'N/A'}"`,
      `"${(item.notesText || item.individualRequirement || item.catalogueMaterial || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ESPACIO_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 select-none">
      {/* ─── Top Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl font-bold text-white flex items-center gap-3">
            <span>Enquiries & Leads CMS</span>
            {stats.unreadCount > 0 && (
              <span className="font-sans text-xs bg-gold text-charcoal px-2.5 py-0.5 rounded-full font-bold uppercase">
                {stats.unreadCount} New Unread
              </span>
            )}
          </h1>
          <p className="font-sans text-xs text-white/40 uppercase tracking-widest mt-1">
            Real-time client consultation requests & lead management console
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadData}
            className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl border border-white/10 font-sans text-xs font-bold transition-all"
            title="Refresh list"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg transition-all"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ─── Top Metric Overview Cards ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        <div 
          onClick={() => setActiveTab('ALL')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'ALL' ? 'bg-gold/15 border-gold shadow-lg' : 'bg-[#141518] border-white/5 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-white/40 uppercase font-bold tracking-widest">Total Enquiries</span>
            <Layers size={14} className="text-gold" />
          </div>
          <p className="font-editorial text-2xl font-bold text-white mt-2">{stats.total}</p>
        </div>

        <div 
          onClick={() => setActiveTab('INSTANT_ESTIMATE')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'INSTANT_ESTIMATE' ? 'bg-cyan-500/20 border-cyan-400 shadow-lg' : 'bg-[#141518] border-white/5 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-white/40 uppercase font-bold tracking-widest">Instant Estimates</span>
            <Calculator size={14} className="text-cyan-400" />
          </div>
          <p className="font-editorial text-2xl font-bold text-cyan-400 mt-2">{stats.instantEstimates}</p>
        </div>

        <div 
          onClick={() => setActiveTab('FREE_ESTIMATE')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'FREE_ESTIMATE' ? 'bg-amber-500/20 border-amber-400 shadow-lg' : 'bg-[#141518] border-white/5 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-white/40 uppercase font-bold tracking-widest">Free Estimates</span>
            <FileText size={14} className="text-amber-400" />
          </div>
          <p className="font-editorial text-2xl font-bold text-amber-400 mt-2">{stats.freeEstimates}</p>
        </div>

        <div 
          onClick={() => setActiveTab('CATALOGUE_REQUEST')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'CATALOGUE_REQUEST' ? 'bg-emerald-500/20 border-emerald-400 shadow-lg' : 'bg-[#141518] border-white/5 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-white/40 uppercase font-bold tracking-widest">Catalogue Requests</span>
            <Package size={14} className="text-emerald-400" />
          </div>
          <p className="font-editorial text-2xl font-bold text-emerald-400 mt-2">{stats.catalogues}</p>
        </div>

        <div 
          onClick={() => setActiveTab('DESIGN_ENQUIRY')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'DESIGN_ENQUIRY' ? 'bg-gold/20 border-gold shadow-lg' : 'bg-[#141518] border-white/5 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-white/40 uppercase font-bold tracking-widest">Design Enquiries</span>
            <Sparkles size={14} className="text-gold" />
          </div>
          <p className="font-editorial text-2xl font-bold text-gold mt-2">{stats.designEnquiries}</p>
        </div>

        <div 
          onClick={() => setActiveTab('INDIVIDUAL_ENQUIRY')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeTab === 'INDIVIDUAL_ENQUIRY' ? 'bg-purple-500/20 border-purple-400 shadow-lg' : 'bg-[#141518] border-white/5 hover:border-white/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] text-white/40 uppercase font-bold tracking-widest">Individual</span>
            <User size={14} className="text-purple-400" />
          </div>
          <p className="font-editorial text-2xl font-bold text-purple-400 mt-2">{stats.individualEnquiries}</p>
        </div>
      </div>

      {/* ─── Main Tabs Navigation ─── */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 overflow-x-auto gap-2 scrollbar-none">
        <div className="flex items-center space-x-2 shrink-0">
          {[
            { key: 'ALL', label: `All Enquiries (${stats.total})` },
            { key: 'INSTANT_ESTIMATE', label: `Instant Estimates (${stats.instantEstimates})` },
            { key: 'FREE_ESTIMATE', label: `Get Free Estimates (${stats.freeEstimates})` },
            { key: 'CATALOGUE_REQUEST', label: `Catalogue Requests (${stats.catalogues})` },
            { key: 'DESIGN_ENQUIRY', label: `Design Enquiries (${stats.designEnquiries})` },
            { key: 'INDIVIDUAL_ENQUIRY', label: `Individual Enquiries (${stats.individualEnquiries})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setDesignSubFilter('ALL'); }}
              className={`px-4 py-2 rounded-xl font-sans text-xs font-bold uppercase transition-all whitespace-nowrap ${
                activeTab === tab.key 
                  ? 'bg-gold text-charcoal shadow-md' 
                  : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Design Sub-Filters (only visible when activeTab === 'DESIGN_ENQUIRY') ─── */}
      {activeTab === 'DESIGN_ENQUIRY' && (
        <div className="bg-[#141518] p-3 rounded-xl border border-gold/30 flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <span className="font-sans text-[10px] text-gold font-bold uppercase tracking-wider shrink-0 mr-2">Design Sub-Types:</span>
          {[
            { key: 'ALL', label: `ALL (${stats.designEnquiries})` },
            { key: 'TURNKEY_INTERIORS', label: `Turnkey Interiors (${stats.designTurnkey})` },
            { key: 'DESIGN_ONLY', label: `Design Only (${stats.designOnly})` },
            { key: 'RENOVATION', label: `Renovation (${stats.designRenovation})` },
            { key: 'MATERIALS', label: `Materials (${stats.designMaterials})` },
            { key: 'SOMETHING_ELSE', label: `Something Else (${stats.designSomethingElse})` }
          ].map(sub => (
            <button
              key={sub.key}
              onClick={() => setDesignSubFilter(sub.key)}
              className={`px-3 py-1.5 rounded-lg font-sans text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                designSubFilter === sub.key
                  ? 'bg-gold/20 text-gold border border-gold/40'
                  : 'bg-white/5 text-white/50 hover:text-white border border-white/5'
              }`}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}

      {/* ─── Search & Date Filter Bar ─── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#141518] p-4 rounded-xl border border-white/5">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by name, phone, email, ID, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0E0F11] border border-white/10 rounded-xl px-10 py-2.5 font-sans text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          {/* Status Filter Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0E0F11] border border-white/10 rounded-xl px-3 py-2 font-sans text-xs text-white font-medium focus:outline-none focus:border-gold"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="CONTACTED">CONTACTED</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="FOLLOW_UP">FOLLOW UP</option>
            <option value="CONVERTED">CONVERTED</option>
            <option value="CLOSED">CLOSED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          {/* Date Filter Dropdown */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-[#0E0F11] border border-white/10 rounded-xl px-3 py-2 font-sans text-xs text-white font-medium focus:outline-none focus:border-gold"
          >
            <option value="ALL_TIME">All Dates</option>
            <option value="TODAY">Submitted Today</option>
            <option value="YESTERDAY">Submitted Yesterday</option>
          </select>
        </div>
      </div>

      {/* ─── Main Content Grid: Left List (2 Cols) & Right Detail Drawer (1 Col) ─── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Enquiries List */}
        <div className="xl:col-span-2 space-y-3">
          {loading ? (
            <div className="bg-[#141518] p-12 rounded-xl text-center border border-white/5">
              <RefreshCw size={24} className="animate-spin text-gold mx-auto mb-3" />
              <p className="font-sans text-xs text-white/40">Loading database records...</p>
            </div>
          ) : filteredEnquiries.length === 0 ? (
            <div className="bg-[#141518] p-12 rounded-xl text-center border border-white/5 space-y-3">
              <AlertCircle size={32} className="text-white/20 mx-auto" />
              <p className="font-sans text-xs text-white/40">No matching enquiry records found.</p>
            </div>
          ) : (
            filteredEnquiries.map((item) => {
              const isSelected = selectedEnquiry && (selectedEnquiry.id === item.id || selectedEnquiry.enquiryId === item.enquiryId);
              const tc = typeConfig[item.type] || typeConfig.DESIGN_ENQUIRY;
              const sc = statusConfig[item.status] || statusConfig.NEW;

              return (
                <div
                  key={item.enquiryId || item.id}
                  onClick={() => handleSelectEnquiry(item)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-gold/15 border-gold shadow-lg'
                      : item.read === false
                      ? 'bg-[#181A1F] border-gold/40'
                      : 'bg-[#141518] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 truncate">
                    <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center font-editorial text-sm font-bold text-gold shrink-0">
                      {(item.name || 'C').charAt(0).toUpperCase()}
                    </div>

                    <div className="truncate space-y-1">
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="font-mono text-[10px] text-white/50 bg-white/5 px-1.5 py-0.5 rounded font-bold">
                          {item.enquiryId || item.id}
                        </span>
                        <h3 className="font-sans text-xs font-bold text-white truncate">{item.name}</h3>
                        {item.read === false && (
                          <span className="w-2 h-2 rounded-full bg-gold animate-pulse shrink-0" title="Unread Enquiry" />
                        )}
                      </div>

                      <div className="flex items-center space-x-2 flex-wrap text-[11px] text-white/50">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${tc.bg} ${tc.color}`}>
                          {tc.label}
                        </span>
                        {item.type === 'DESIGN_ENQUIRY' && item.requirementType && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-white/10 text-white/80 border border-white/10">
                            {item.requirementType.replace('_', ' ')}
                          </span>
                        )}
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end space-x-4 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-white/5">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border ${sc.bg} ${sc.color}`}>
                      {sc.label}
                    </span>

                    <span className="font-sans text-[10px] text-white/30 whitespace-nowrap">
                      {item.submittedAt ? new Date(item.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recently'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Selected Enquiry Detail Drawer */}
        <div className="bg-[#141518] border border-white/10 rounded-xl p-5 space-y-6">
          {selectedEnquiry ? (
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="border-b border-white/10 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-gold font-bold bg-gold/10 border border-gold/30 px-2.5 py-1 rounded">
                    {selectedEnquiry.enquiryId || selectedEnquiry.id}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase border ${statusConfig[selectedEnquiry.status]?.bg || 'bg-gold/15'} ${statusConfig[selectedEnquiry.status]?.color || 'text-gold'}`}>
                    {selectedEnquiry.status}
                  </span>
                </div>
                <h2 className="font-editorial text-2xl font-bold text-white">{selectedEnquiry.name}</h2>
                <p className="font-sans text-xs text-white/40 flex items-center gap-2">
                  <Clock size={13} />
                  <span>Submitted: {selectedEnquiry.submittedAt ? new Date(selectedEnquiry.submittedAt).toLocaleString('en-IN') : 'Recently'}</span>
                </p>
              </div>

              {/* Status Manager Dropdown */}
              <div className="space-y-2">
                <label className="font-sans text-[10px] text-white/40 uppercase font-bold tracking-widest block">Update Status</label>
                <select
                  value={selectedEnquiry.status || 'NEW'}
                  onChange={(e) => handleUpdateStatus(selectedEnquiry.id || selectedEnquiry.enquiryId, e.target.value)}
                  className="w-full bg-[#0E0F11] border border-gold/40 text-gold rounded-xl px-3 py-2.5 font-sans text-xs font-bold uppercase focus:outline-none"
                >
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="FOLLOW_UP">FOLLOW UP</option>
                  <option value="CONVERTED">CONVERTED</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              {/* Quick Action Contact Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`tel:${(selectedEnquiry.phone || '').replace(/\s+/g, '')}`}
                  className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-emerald-500/20 text-white hover:text-emerald-400 border border-white/10 hover:border-emerald-500/30 rounded-xl transition-all"
                >
                  <Phone size={16} className="mb-1" />
                  <span className="font-sans text-[10px] font-bold uppercase">Call</span>
                </a>
                <a
                  href={(() => {
                    const phone = (selectedEnquiry.phone || '').replace(/\D/g, '');
                    let msg = `Hello ${selectedEnquiry.name || 'Client'},\n\nThank you for reaching out to ESPACIO Interiors & Modular regarding your enquiry (${selectedEnquiry.enquiryId || selectedEnquiry.id}).\n\n`;
                    if (selectedEnquiry.type === 'INSTANT_ESTIMATE') {
                      msg += `We received your Instant Project Estimate request for a ${selectedEnquiry.propertyType || 'Property'} (${selectedEnquiry.scopeOfWork || 'Interiors'}). We would love to share your personalized estimate details.`;
                    } else if (selectedEnquiry.type === 'FREE_ESTIMATE') {
                      msg += `We received your request for a Free Estimate at ${selectedEnquiry.location || 'your location'}. We would love to discuss your BOQ and design requirements.`;
                    } else if (selectedEnquiry.type === 'CATALOGUE_REQUEST') {
                      msg += `We received your request for our Material & Product Catalogues (${selectedEnquiry.catalogueMaterial || 'Product Catalogue'}).`;
                    } else if (selectedEnquiry.type === 'DESIGN_ENQUIRY') {
                      msg += `We received your Design Enquiry for ${selectedEnquiry.requirementType ? selectedEnquiry.requirementType.replace('_', ' ') : 'Interiors'} (${selectedEnquiry.propertyType || 'Property'}).`;
                    } else if (selectedEnquiry.type === 'INDIVIDUAL_ENQUIRY') {
                      msg += `We received your enquiry for Individual Service (${selectedEnquiry.individualRequirement || 'Custom requirement'}).`;
                    } else {
                      msg += `We received your consultation enquiry and would like to assist you further.`;
                    }
                    msg += `\n\nWhen would be a good time for a quick call or studio visit?`;
                    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
                  })()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-emerald-500/20 text-white hover:text-emerald-400 border border-white/10 hover:border-emerald-500/30 rounded-xl transition-all"
                >
                  <MessageSquare size={16} className="mb-1" />
                  <span className="font-sans text-[10px] font-bold uppercase">WhatsApp</span>
                </a>
                <a
                  href={(() => {
                    const subject = `ESPACIO Interiors & Modular — Response to Enquiry ${selectedEnquiry.enquiryId || selectedEnquiry.id}`;
                    let body = `Dear ${selectedEnquiry.name || 'Client'},\n\nThank you for reaching out to ESPACIO Interiors & Modular.\n\n`;
                    if (selectedEnquiry.type === 'INSTANT_ESTIMATE') {
                      body += `We received your Instant Project Estimate request for a ${selectedEnquiry.propertyType || 'Property'} (${selectedEnquiry.scopeOfWork || 'Interiors'}).\n\nOur principal design team is preparing your personalized estimate details.`;
                    } else if (selectedEnquiry.type === 'FREE_ESTIMATE') {
                      body += `We received your request for a Free Estimate at ${selectedEnquiry.location || 'your location'}.\n\nOur design team is preparing your initial consultation details.`;
                    } else if (selectedEnquiry.type === 'CATALOGUE_REQUEST') {
                      body += `We received your request for our material & product catalogues (${selectedEnquiry.catalogueMaterial || 'Product Catalogue'}).`;
                    } else if (selectedEnquiry.type === 'DESIGN_ENQUIRY') {
                      body += `We received your Design Enquiry for ${selectedEnquiry.requirementType ? selectedEnquiry.requirementType.replace('_', ' ') : 'Interiors'} (${selectedEnquiry.propertyType || 'Property'}).`;
                    } else if (selectedEnquiry.type === 'INDIVIDUAL_ENQUIRY') {
                      body += `We received your request for Individual Service (${selectedEnquiry.individualRequirement || 'Custom requirement'}).`;
                    } else {
                      body += `We received your consultation enquiry and would like to assist you further.`;
                    }
                    body += `\n\nPlease let us know your convenient time for a detailed discussion or studio visit.\n\nBest regards,\nESPACIO Interiors & Modular Team\n+91 95051 51116`;
                    return `mailto:${selectedEnquiry.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  })()}
                  className="flex flex-col items-center justify-center p-3 bg-white/5 hover:bg-gold/20 text-white hover:text-gold border border-white/10 hover:border-gold/30 rounded-xl transition-all"
                >
                  <Mail size={16} className="mb-1" />
                  <span className="font-sans text-[10px] font-bold uppercase">Email</span>
                </a>
              </div>

              {/* Structured Submission Details */}
              <div className="space-y-4 bg-[#0E0F11] p-4 rounded-xl border border-white/10">
                <h4 className="font-sans text-xs font-bold text-gold uppercase tracking-wider border-b border-white/10 pb-2">
                  Submission Details
                </h4>

                <div className="space-y-3 font-sans text-xs">
                  <div>
                    <span className="text-white/40 block text-[10px] uppercase font-bold">Contact Info</span>
                    <span className="text-white font-bold block">{selectedEnquiry.phone}</span>
                    <span className="text-white/70 block">{selectedEnquiry.email}</span>
                  </div>

                  <div>
                    <span className="text-white/40 block text-[10px] uppercase font-bold">Project Location</span>
                    <span className="text-white">{selectedEnquiry.location || 'Not specified'}</span>
                  </div>

                  {selectedEnquiry.type === 'DESIGN_ENQUIRY' && (
                    <>
                      <div>
                        <span className="text-white/40 block text-[10px] uppercase font-bold">Requirement Type</span>
                        <span className="text-gold font-bold uppercase">{selectedEnquiry.requirementType?.replace('_', ' ')}</span>
                      </div>
                      {selectedEnquiry.propertyType && (
                        <div>
                          <span className="text-white/40 block text-[10px] uppercase font-bold">Property Type</span>
                          <span className="text-white">{selectedEnquiry.propertyType}</span>
                        </div>
                      )}
                      {selectedEnquiry.spaces && (
                        <div>
                          <span className="text-white/40 block text-[10px] uppercase font-bold">Spaces to Design</span>
                          <span className="text-white">{selectedEnquiry.spaces}</span>
                        </div>
                      )}
                    </>
                  )}

                  {selectedEnquiry.type === 'INDIVIDUAL_ENQUIRY' && (
                    <div>
                      <span className="text-purple-400 block text-[10px] uppercase font-bold">Individual Service Details</span>
                      <p className="text-white leading-relaxed bg-purple-500/10 p-3 rounded-lg border border-purple-500/20 mt-1">
                        {selectedEnquiry.individualRequirement || selectedEnquiry.notesText || 'Individual service request'}
                      </p>
                    </div>
                  )}

                  {selectedEnquiry.type === 'INSTANT_ESTIMATE' && (
                    <div className="space-y-2 bg-cyan-500/10 p-3 rounded-lg border border-cyan-500/20">
                      <span className="text-cyan-400 block text-[10px] uppercase font-bold">Instant Project Estimate Details</span>
                      {selectedEnquiry.propertyType && (
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/50">1. Property Type:</span>
                          <span className="text-white font-bold">{selectedEnquiry.propertyType}</span>
                        </div>
                      )}
                      {selectedEnquiry.scopeOfWork && (
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/50">2. Scope of Work:</span>
                          <span className="text-gold font-bold">{selectedEnquiry.scopeOfWork}</span>
                        </div>
                      )}
                      {selectedEnquiry.finishGrade && (
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/50">Finish Tier:</span>
                          <span className="text-cyan-400 capitalize">{selectedEnquiry.finishGrade}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedEnquiry.type === 'CATALOGUE_REQUEST' && (
                    <div>
                      <span className="text-emerald-400 block text-[10px] uppercase font-bold">Catalogue Requested</span>
                      <span className="text-white font-bold">{selectedEnquiry.catalogueMaterial || 'General Product Catalogue'}</span>
                    </div>
                  )}

                  {selectedEnquiry.notesText && selectedEnquiry.type !== 'INDIVIDUAL_ENQUIRY' && (
                    <div>
                      <span className="text-white/40 block text-[10px] uppercase font-bold">Notes / Requirements</span>
                      <p className="text-white/80 bg-white/5 p-3 rounded-lg border border-white/5 mt-1 leading-relaxed">
                        {selectedEnquiry.notesText}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Private Admin Notes */}
              <div className="space-y-3 bg-[#0E0F11] p-4 rounded-xl border border-white/10">
                <h4 className="font-sans text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                  <span>Internal Admin Notes</span>
                  <span className="text-[10px] text-white/30">Private</span>
                </h4>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {selectedEnquiry.notes && selectedEnquiry.notes.length > 0 ? (
                    selectedEnquiry.notes.map((n, nIdx) => (
                      <div key={n.id || nIdx} className="bg-white/5 p-2.5 rounded-lg border border-white/5 font-sans text-xs">
                        <p className="text-white/90">{n.text}</p>
                        <span className="text-[9px] text-white/40 block mt-1">
                          {n.createdAt ? new Date(n.createdAt).toLocaleString('en-IN') : ''}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="font-sans text-[11px] text-white/30 italic">No notes added yet.</p>
                  )}
                </div>

                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add private note..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 bg-[#141518] border border-white/10 rounded-lg px-3 py-2 font-sans text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold"
                  />
                  <button
                    type="submit"
                    className="bg-gold text-charcoal px-3 py-2 rounded-lg font-sans text-xs font-bold uppercase shrink-0"
                  >
                    Add
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center space-y-3">
              <Eye size={32} className="text-white/20 mx-auto" />
              <p className="font-sans text-xs text-white/30">Select an enquiry row on the left to view complete submission details, notes, and actions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEnquiries;
