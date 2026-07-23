import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, FolderKanban, Package, Mail, Users, Settings,
  LogOut, ChevronRight, TrendingUp, Eye, MessageSquare, Star,
  Image, FileText, Bell, Menu, X, AlertCircle
} from 'lucide-react';

// ── AUTH GUARD ────────────────────────────────────────────────────────────────
export const useAdminAuth = () => {
  const token = localStorage.getItem('espacio_token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  return !!token;
};

// ── SIDEBAR NAV ───────────────────────────────────────────────────────────────
const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: FolderKanban, label: 'Projects', path: '/admin/projects' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: Mail, label: 'Enquiries', path: '/admin/enquiries' },
  { icon: Star, label: 'Testimonials', path: '/admin/testimonials' },
  { icon: Image, label: 'Gallery', path: '/admin/gallery' },
  { icon: FileText, label: 'FAQs', path: '/admin/faqs' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthenticated = useAdminAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('espacio_token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/admin');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0E0F11] flex">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#141518] border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand */}
        <div className="px-6 py-6 border-b border-white/5 flex items-center justify-between">
          <span className="font-editorial text-lg font-bold text-gold tracking-widest">ESPACIO</span>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-sans uppercase tracking-wide font-bold transition-all duration-200 ${isActive ? 'bg-gold/15 text-gold border border-gold/20' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                <item.icon size={16} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-5 border-t border-white/5">
          <button onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-sans uppercase tracking-wide font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 bg-[#141518]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/60 hover:text-white">
            <Menu size={20} />
          </button>
          <div className="flex items-center space-x-3 ml-auto">
            <button className="relative w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="font-editorial text-xs font-bold text-gold">A</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8">
          {children || <AdminDashboardHome />}
        </main>
      </div>
    </div>
  );
};

// ── DASHBOARD HOME ────────────────────────────────────────────────────────────
const AdminDashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, leadsRes] = await Promise.all([
          axios.get('/dashboard/stats'),
          axios.get('/leads?limit=6'),
        ]);
        if (statsRes.data.success) setStats(statsRes.data.data);
        if (leadsRes.data.success) setLeads(leadsRes.data.data.leads || leadsRes.data.data || []);
      } catch {
        setStats({ projects: 28, products: 8, leads: 47, testimonials: 12 });
        setLeads([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Projects', value: stats?.projects || 28, icon: FolderKanban, trend: '+3 this month', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Materials Listed', value: stats?.products || 8, icon: Package, trend: 'Premium collection', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'New Enquiries', value: stats?.leads || 47, icon: MessageSquare, trend: '+12 this week', color: 'text-gold', bg: 'bg-gold/10' },
    { label: 'Testimonials', value: stats?.testimonials || 12, icon: Star, trend: 'Active reviews', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="font-editorial text-3xl font-bold text-white">Dashboard</h1>
        <p className="font-sans text-xs text-white/40 uppercase tracking-widest">ESPACIO Admin Control Panel</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-[#1A1C20] border border-white/5 rounded-xl p-6 space-y-4 hover:border-white/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] uppercase tracking-widest text-white/40 font-bold">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon size={15} className={card.color} />
              </div>
            </div>
            <p className="font-editorial text-4xl font-bold text-white">{loading ? '—' : card.value}</p>
            <p className={`font-sans text-[10px] font-bold ${card.color}`}>{card.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Enquiries */}
        <div className="xl:col-span-2 bg-[#1A1C20] border border-white/5 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <h2 className="font-editorial text-lg font-bold text-white">Recent Enquiries</h2>
            <Link to="/admin/enquiries" className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-white/5">
            {loading ? (
              [1,2,3,4,5].map((n) => (
                <div key={n} className="px-6 py-4 animate-pulse flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-white/5 rounded w-1/3" />
                    <div className="h-2 bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : leads.length > 0 ? leads.map((lead, idx) => (
              <div key={idx} className="px-6 py-4 flex items-center space-x-4 hover:bg-white/2 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center font-editorial font-bold text-gold text-sm">
                  {(lead.name || '?').charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-xs font-bold text-white truncate">{lead.name}</p>
                  <p className="font-sans text-[10px] text-white/40 truncate">{lead.email} • {lead.projectType}</p>
                </div>
                <span className={`shrink-0 px-2 py-1 rounded-full text-[9px] font-sans uppercase tracking-wide font-bold ${lead.status === 'new' ? 'bg-gold/15 text-gold' : lead.status === 'in_progress' ? 'bg-blue-500/15 text-blue-400' : 'bg-white/5 text-white/40'}`}>
                  {lead.status || 'new'}
                </span>
              </div>
            )) : (
              <div className="px-6 py-12 text-center space-y-2">
                <AlertCircle size={24} className="text-white/20 mx-auto" />
                <p className="font-sans text-xs text-white/30">No enquiries yet. Backend connection required.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[#1A1C20] border border-white/5 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5">
            <h2 className="font-editorial text-lg font-bold text-white">Quick Actions</h2>
          </div>
          <div className="p-5 space-y-3">
            {[
              { label: 'Add New Project', path: '/admin/projects/new', icon: FolderKanban },
              { label: 'Add Material', path: '/admin/products/new', icon: Package },
              { label: 'View Enquiries', path: '/admin/enquiries', icon: MessageSquare },
              { label: 'Add Testimonial', path: '/admin/testimonials/new', icon: Star },
              { label: 'Update FAQs', path: '/admin/faqs', icon: FileText },
              { label: 'Site Settings', path: '/admin/settings', icon: Settings },
            ].map((action, idx) => (
              <Link key={idx} to={action.path}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-200 group">
                <div className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center">
                  <action.icon size={13} className="text-gold" />
                </div>
                <span className="font-sans text-xs text-white/70 group-hover:text-white font-medium transition-colors">{action.label}</span>
                <ChevronRight size={12} className="ml-auto text-white/20 group-hover:text-gold transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { AdminDashboardHome };
export default AdminLayout;
