import React, { useState, useEffect } from 'react';
import { ShieldAlert, MapPin, Search, Filter, Download, RefreshCw, Clock, User, ExternalLink, Activity } from 'lucide-react';
import { getAuditLogs } from '../../utils/auditStore';

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const loadAuditData = () => {
    try {
      const data = getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    }
  };

  useEffect(() => {
    loadAuditData();
    window.addEventListener('espacio_cms_update', loadAuditData);
    window.addEventListener('storage', loadAuditData);
    return () => {
      window.removeEventListener('espacio_cms_update', loadAuditData);
      window.removeEventListener('storage', loadAuditData);
    };
  }, []);

  const filteredLogs = logs.filter(item => {
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchAction = item.action?.toLowerCase().includes(q);
      const matchDetails = item.details?.toLowerCase().includes(q);
      const matchUser = item.user?.toLowerCase().includes(q);
      const matchIp = item.ip?.toLowerCase().includes(q);
      if (!matchAction && !matchDetails && !matchUser && !matchIp) return false;
    }
    return true;
  });

  const categories = ['ALL', ...Array.from(new Set(logs.map(l => l.category).filter(Boolean)))];

  const handleExportCSV = () => {
    const dataToExport = filteredLogs.length > 0 ? filteredLogs : logs;
    const headers = ['Audit ID', 'Action', 'Category', 'Performed By User', 'IP Address', 'Timestamp', 'Details'];
    const rows = dataToExport.map(l => [
      `"${l.id}"`,
      `"${(l.action || '').replace(/"/g, '""')}"`,
      `"${(l.category || '').replace(/"/g, '""')}"`,
      `"${(l.user || '').replace(/"/g, '""')}"`,
      `"${(l.ip || '').replace(/"/g, '""')}"`,
      `"${l.timestamp ? new Date(l.timestamp).toLocaleString('en-IN') : 'N/A'}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ESPACIO_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl font-bold text-white flex items-center gap-3">
            <span>System Audit Logs</span>
            <Activity size={22} className="text-gold" />
          </h1>
          <p className="font-sans text-xs text-white/40 uppercase tracking-widest mt-1">
            Real-time security audit trail & IP location tracking for all CMS administrative actions
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadAuditData}
            className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl border border-white/10 font-sans text-xs font-bold transition-all"
          >
            <RefreshCw size={14} />
            <span>Refresh Logs</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-lg transition-all"
          >
            <Download size={14} />
            <span>Export Audit Log</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#141518] p-4 rounded-xl border border-white/5">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by action, user, or IP address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0E0F11] border border-white/10 rounded-xl px-10 py-2.5 font-sans text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold"
          />
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto scrollbar-none">
          <span className="font-sans text-[10px] text-white/40 uppercase font-bold tracking-widest shrink-0 mr-1">Category:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-sans text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-gold text-charcoal shadow-md'
                  : 'bg-white/5 text-white/50 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-[#141518] border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider">Recorded System Events</h3>
          <span className="font-sans text-[10px] text-white/40">{filteredLogs.length} Events Recorded</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs text-white">
            <thead className="bg-[#0E0F11] text-[10px] uppercase font-bold text-white/40 border-b border-white/10">
              <tr>
                <th className="p-4">Action Event</th>
                <th className="p-4">Category</th>
                <th className="p-4">Performed By</th>
                <th className="p-4">Client IP (Google Maps)</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-white/40">
                    No matching audit log entries.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => {
                  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(log.ip || 'Hyderabad, India')}`;

                  return (
                    <tr key={log.id} className="hover:bg-white/2 transition-all">
                      <td className="p-4 font-bold text-white whitespace-nowrap">
                        {log.action}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-gold/15 text-gold border border-gold/30">
                          {log.category || 'General'}
                        </span>
                      </td>
                      <td className="p-4 text-white/80 whitespace-nowrap">
                        {log.user}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded font-mono text-[11px] font-bold transition-all group"
                          title="Click to view IP location on Google Maps"
                        >
                          <MapPin size={12} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span>{log.ip}</span>
                          <ExternalLink size={10} className="opacity-60" />
                        </a>
                      </td>
                      <td className="p-4 text-white/50 text-[11px] whitespace-nowrap">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString('en-IN') : 'N/A'}
                      </td>
                      <td className="p-4 text-white/70 max-w-xs truncate">
                        {log.details || '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
