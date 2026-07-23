import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Eye, CheckCircle, Clock, XCircle, AlertCircle, Mail, Building2, DollarSign, Phone, MapPin, Download } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const statusConfig = {
  new: { label: 'New', color: 'text-gold', bg: 'bg-gold/15', icon: AlertCircle },
  in_progress: { label: 'In Progress', color: 'text-blue-400', bg: 'bg-blue-400/15', icon: Clock },
  closed: { label: 'Closed', color: 'text-emerald-400', bg: 'bg-emerald-400/15', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-400/15', icon: XCircle },
};

const mockLeads = [
  { _id: '1', name: 'Arjun Reddy', email: 'arjun.r@gmail.com', projectType: 'Full Home Interior', budget: '₹25L – ₹50L', status: 'new', createdAt: new Date().toISOString(), message: 'Looking for complete interior for 3BHK apartment in Banjara Hills. Premium finish preferred.' },
  { _id: '2', name: 'Priya Nair', email: 'priya.nair@infosys.com', projectType: 'Modular Kitchen', budget: '₹10L – ₹25L', status: 'in_progress', createdAt: new Date(Date.now() - 86400000).toISOString(), message: 'Need a modern modular kitchen with island counter.' },
  { _id: '3', name: 'Sanjay Mehta', email: 's.mehta@business.in', projectType: 'Commercial Office', budget: '₹50L – ₹1Cr', status: 'new', createdAt: new Date(Date.now() - 172800000).toISOString(), message: 'Complete office fitout for 5000 sqft IT company in HITEC City.' },
  { _id: '4', name: 'Kavitha Sharma', email: 'kavitha@email.com', projectType: 'Master Bedroom', budget: '₹5L – ₹10L', status: 'closed', createdAt: new Date(Date.now() - 259200000).toISOString(), message: 'Want to redesign master bedroom with walk-in wardrobe.' },
  { _id: '5', name: 'Rahul Gupta', email: 'rahul.g@startup.io', projectType: 'Full Home Interior', budget: '₹1Cr+', status: 'in_progress', createdAt: new Date(Date.now() - 345600000).toISOString(), message: 'Villa interior design for 6BHK property in Jubilee Hills.' },
];

const AdminEnquiries = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        if (supabase && supabase.from) {
          const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            setLeads(data.map(item => ({
              _id: item.id,
              name: item.name,
              email: item.email,
              phone: item.mobile,
              projectType: item.project_type,
              budget: item.budget,
              status: item.status || 'new',
              createdAt: item.created_at,
              message: item.message
            })));
            setLoading(false);
            return;
          }
        }
        const res = await axios.get('/leads');
        if (res.data.success) {
          setLeads(res.data.data.leads || res.data.data || []);
        } else {
          setLeads(mockLeads);
        }
      } catch {
        setLeads(mockLeads);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      if (supabase && supabase.from) {
        await supabase.from('leads').update({ status }).eq('id', id);
      }
      await axios.patch(`/leads/${id}/status`, { status });
      setLeads((prev) => prev.map((l) => l._id === id ? { ...l, status } : l));
      if (selectedLead?._id === id) setSelectedLead((prev) => ({ ...prev, status }));
    } catch {
      setLeads((prev) => prev.map((l) => l._id === id ? { ...l, status } : l));
      if (selectedLead?._id === id) setSelectedLead((prev) => ({ ...prev, status }));
    }
  };

  const filtered = leads.filter((l) => {
    const matchSearch = !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const exportToExcel = () => {
    const dataToExport = filtered.length > 0 ? filtered : leads;
    const headers = ['Name', 'Email', 'Phone', 'Project Type', 'Budget', 'Location', 'Status', 'Date', 'Message'];
    
    const rows = dataToExport.map(l => [
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.serviceType || l.projectType || 'interior_design').replace(/_/g, ' ')}"`,
      `"${(l.projectDetails?.budget || l.budget || 'N/A').replace(/"/g, '""')}"`,
      `"${(l.propertyDetails?.location || l.location || 'N/A').replace(/"/g, '""')}"`,
      `"${(l.status || 'new')}"`,
      `"${new Date(l.createdAt).toLocaleDateString('en-IN')}"`,
      `"${(l.projectDetails?.notes || l.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Espacio_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="font-editorial text-3xl font-bold text-white">Enquiries</h1>
          <p className="font-sans text-xs text-white/40 uppercase tracking-widest">Client consultation requests</p>
        </div>
        <button
          onClick={exportToExcel}
          className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs font-bold px-4 py-2.5 rounded-lg transition-all shadow-md"
        >
          <Download size={14} />
          <span>Export to Excel (.csv)</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-[360px]">
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1A1C20] border border-white/10 rounded-lg text-xs font-sans text-white px-10 py-3 placeholder:text-white/30 focus:outline-none focus:border-gold" />
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        </div>
        <div className="flex items-center space-x-2">
          {['all', 'new', 'in_progress', 'closed'].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-[10px] font-sans uppercase tracking-wide font-bold transition-all ${statusFilter === s ? 'bg-gold text-charcoal' : 'bg-[#1A1C20] border border-white/10 text-white/50 hover:text-white'}`}>
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Lead list */}
        <div className="xl:col-span-2 bg-[#1A1C20] border border-white/5 rounded-xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {loading ? (
              [1,2,3].map((n) => <div key={n} className="p-6 animate-pulse space-y-2">
                <div className="h-2 bg-white/5 rounded w-1/3" />
                <div className="h-2 bg-white/5 rounded w-1/2" />
              </div>)
            ) : filtered.length === 0 ? (
              <div className="p-12 text-center">
                <AlertCircle size={28} className="text-white/20 mx-auto mb-3" />
                <p className="font-sans text-xs text-white/30">No enquiries found.</p>
              </div>
            ) : filtered.map((lead) => {
              const sc = statusConfig[lead.status] || statusConfig.new;
              const isSelected = selectedLead?._id === lead._id;
              return (
                <div key={lead._id} onClick={() => setSelectedLead(lead)}
                  className={`px-6 py-5 cursor-pointer flex items-center gap-4 hover:bg-white/3 transition-all ${isSelected ? 'border-l-2 border-gold bg-gold/5' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center font-editorial font-bold text-gold shrink-0">
                    {(lead.name || '?').charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-xs font-bold text-white truncate">{lead.name}</p>
                    <p className="font-sans text-[10px] text-white/40 truncate">
                      {(lead.serviceType || lead.projectType || 'interior_design').replace('_', ' ').toUpperCase()} • {lead.projectDetails?.budget || lead.budget || 'N/A'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-1.5 shrink-0">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-sans uppercase tracking-wide font-bold ${sc.bg} ${sc.color}`}>
                      {sc.label}
                    </span>
                    <span className="font-sans text-[9px] text-white/30">{formatDate(lead.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead detail panel */}
        <div className="bg-[#1A1C20] border border-white/5 rounded-xl overflow-hidden">
          {selectedLead ? (
            <div className="p-6 space-y-5">
              <div className="space-y-1">
                <h3 className="font-editorial text-xl font-bold text-white">{selectedLead.name}</h3>
                <p className="font-sans text-[10px] text-white/40 uppercase tracking-widest">Enquiry Detail</p>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Mail, label: 'Email', value: selectedLead.email },
                  { icon: Phone, label: 'Phone', value: selectedLead.phone || 'Not provided' },
                  { icon: Building2, label: 'Service/Project Type', value: (selectedLead.serviceType || selectedLead.projectType || 'interior_design').replace('_', ' ').toUpperCase() },
                  { icon: DollarSign, label: 'Budget', value: selectedLead.projectDetails?.budget || selectedLead.budget || 'Not specified' },
                  { icon: MapPin, label: 'Location', value: selectedLead.propertyDetails?.location || selectedLead.location || 'Not specified' },
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <row.icon size={12} className="text-white/40" />
                    </div>
                    <div>
                      <p className="font-sans text-[9px] text-white/30 uppercase tracking-wide">{row.label}</p>
                      <p className="font-sans text-xs text-white">{row.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5">
                <p className="font-sans text-[9px] text-white/30 uppercase tracking-wide">Message</p>
                <p className="font-sans text-xs text-white/70 leading-relaxed bg-white/3 rounded-lg p-3">
                  {selectedLead.projectDetails?.notes || selectedLead.message || 'No message.'}
                </p>
              </div>
              {/* Status update */}
              <div className="space-y-2">
                <p className="font-sans text-[9px] text-white/30 uppercase tracking-wide">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(statusConfig).map(([key, val]) => (
                    <button key={key} onClick={() => updateStatus(selectedLead._id, key)}
                      className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-[9px] font-sans uppercase tracking-wide font-bold border transition-all ${selectedLead.status === key ? `${val.bg} ${val.color} border-transparent` : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white'}`}>
                      <val.icon size={10} />
                      <span>{val.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full p-6 flex items-center justify-center">
              <div className="text-center space-y-2">
                <Eye size={28} className="text-white/10 mx-auto" />
                <p className="font-sans text-xs text-white/25">Select an enquiry to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEnquiries;
