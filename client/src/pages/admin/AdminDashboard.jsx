import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, FolderKanban, Package, Mail, Users, Settings,
  LogOut, ChevronRight, TrendingUp, Eye, MessageSquare, Star,
  Image, FileText, Bell, Menu, X, AlertCircle, Layers, HelpCircle, Activity, Shield
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
  { icon: Layers, label: 'Home Hero CMS', path: '/admin/hero' },
  { icon: Package, label: 'Services CMS', path: '/admin/services' },
  { icon: Layers, label: 'Spaces CMS', path: '/admin/spaces' },
  { icon: Package, label: 'Materials CMS', path: '/admin/materials' },
  { icon: FileText, label: 'About CMS', path: '/admin/about' },
  { icon: HelpCircle, label: 'FAQ CMS', path: '/admin/faqs' },
  { icon: Mail, label: 'Contact CMS', path: '/admin/contact' },
  { icon: Star, label: 'Testimonials CMS', path: '/admin/testimonials' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: Mail, label: 'Enquiries', path: '/admin/enquiries' },
  { icon: Image, label: 'Gallery', path: '/admin/gallery' },
  { icon: Users, label: 'Admin Users', path: '/admin/users' },
  { icon: Activity, label: 'Audit Logs', path: '/admin/audit' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthenticated = useAdminAuth();

  // Get active admin user profile & role
  const activeUser = React.useMemo(() => {
    try {
      const u = sessionStorage.getItem('active_admin_user');
      if (u) return JSON.parse(u);
    } catch {}
    return { name: 'Tarun (Super Admin)', email: 'tarunuttupulusu@gmail.com', role: 'Super Admin' };
  }, []);

  const userRole = activeUser.role || 'Super Admin';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      const { logAuditEvent } = await import('../../utils/auditStore');
      await logAuditEvent('User Logged Out', 'Authentication', `User ${activeUser.email} logged out of Admin Panel`);
    } catch {}
    localStorage.removeItem('espacio_token');
    sessionStorage.removeItem('active_admin_user');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/admin');
  };

  if (!isAuthenticated) {
    return null;
  }

  // Filter sidebar navigation items based on Role
  const filteredNavItems = navItems.filter(item => {
    if (userRole === 'Super Admin') return true;
    if (userRole === 'Editor') {
      return !['/admin/users', '/admin/audit', '/admin/settings'].includes(item.path);
    }
    if (userRole === 'Manager') {
      return ['/admin/dashboard', '/admin/enquiries', '/admin/projects', '/admin/products'].includes(item.path);
    }
    return true;
  });

  // Check route access authorization
  const isRouteAllowed = () => {
    if (userRole === 'Super Admin') return true;
    const currentPath = location.pathname;
    if (userRole === 'Editor') {
      return !['/admin/users', '/admin/audit', '/admin/settings'].includes(currentPath);
    }
    if (userRole === 'Manager') {
      return ['/admin/dashboard', '/admin/enquiries', '/admin/projects', '/admin/products'].includes(currentPath);
    }
    return true;
  };

  const allowed = isRouteAllowed();

  return (
    <div className="min-h-screen bg-[#0E0F11] flex select-none">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#141518] border-r border-white/5 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand */}
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <span className="font-editorial text-lg font-bold text-gold tracking-widest block">ESPACIO</span>
            <span className="font-sans text-[9px] bg-gold/15 text-gold border border-gold/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider inline-block mt-1">
              {userRole}
            </span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* User Info Card */}
        <div className="px-4 py-3 mx-3 mt-3 bg-white/5 border border-white/5 rounded-xl">
          <p className="font-sans text-xs font-bold text-white truncate">{activeUser.name}</p>
          <p className="font-sans text-[10px] text-white/40 truncate">{activeUser.email}</p>
        </div>

        {/* Nav */}
        <nav data-lenis-prevent className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-sans uppercase tracking-wide font-bold transition-all duration-200 ${isActive ? 'bg-gold/15 text-gold border border-gold/20 shadow-md' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                <item.icon size={16} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/5">
          <button onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-xs font-sans uppercase tracking-wide font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-14 bg-[#141518]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/60 hover:text-white">
            <Menu size={20} />
          </button>

          <div className="flex items-center space-x-3 ml-auto">
            <div className="text-right hidden sm:block">
              <span className="font-sans text-xs font-bold text-white block">{activeUser.name}</span>
              <span className="font-sans text-[10px] text-gold font-bold uppercase">{userRole}</span>
            </div>

            <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center font-editorial font-bold text-gold">
              {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Content Body with Route Guard Access Check */}
        <main className="flex-1 p-6 md:p-8">
          {!allowed ? (
            <div className="bg-[#141518] border border-red-500/30 rounded-2xl p-10 max-w-xl mx-auto text-center space-y-5 my-12 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
                <Shield size={32} />
              </div>
              <h2 className="font-editorial text-2xl font-bold text-white">Access Restricted</h2>
              <p className="font-sans text-xs text-white/60 leading-relaxed">
                Your current account role (<span className="text-gold font-bold">{userRole}</span>) does not have permission to access this module.
              </p>
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg"
              >
                <span>Return to Dashboard</span>
              </Link>
            </div>
          ) : (
            children || <AdminDashboardHome />
          )}
        </main>
      </div>
    </div>
  );
};

// ── DASHBOARD HOME ────────────────────────────────────────────────────────────
const AdminDashboardHome = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [stats, setStats] = useState({ projects: 30, products: 9, enquiries: 0, testimonials: 49 });

  const loadRealtimeData = () => {
    try {
      const storedEnquiries = getCMSData(STORAGE_KEYS.ENQUIRIES) || [];
      const storedTestimonials = getCMSData(STORAGE_KEYS.TESTIMONIALS) || [];
      const storedProjects = getCMSData(STORAGE_KEYS.PROJECTS) || [];
      const storedProducts = getCMSData(STORAGE_KEYS.PRODUCTS) || [];

      setEnquiries(storedEnquiries);
      setStats({
        projects: storedProjects.length > 0 ? storedProjects.length : 30,
        products: storedProducts.length > 0 ? storedProducts.length : 9,
        enquiries: storedEnquiries.length,
        testimonials: storedTestimonials.length > 0 ? storedTestimonials.length : 49
      });
    } catch (err) {
      console.warn('Failed to load realtime dashboard stats:', err);
    }
  };

  useEffect(() => {
    loadRealtimeData();
    window.addEventListener('espacio_cms_update', loadRealtimeData);
    window.addEventListener('storage', loadRealtimeData);
    return () => {
      window.removeEventListener('espacio_cms_update', loadRealtimeData);
      window.removeEventListener('storage', loadRealtimeData);
    };
  }, []);

  const statCards = [
    { label: 'Materials Listed', value: stats.products, icon: Package, trend: 'Premium collection', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'New Enquiries', value: stats.enquiries, icon: MessageSquare, trend: `${stats.enquiries} Total Submissions`, color: 'text-gold', bg: 'bg-gold/10' },
    { label: 'Testimonials', value: stats.testimonials, icon: Star, trend: '5.0 ⭐ Rating', color: 'text-purple-400', bg: 'bg-purple-400/10' },
  ];

  return (
    <div className="space-y-8 select-none">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="font-editorial text-3xl font-bold text-white">Dashboard</h1>
        <p className="font-sans text-xs text-white/40 uppercase tracking-widest">ESPACIO Admin Control Panel • Live Real-time Overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-[#1A1C20] border border-white/5 rounded-xl p-6 space-y-4 hover:border-white/10 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[10px] uppercase tracking-widest text-white/40 font-bold">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon size={15} className={card.color} />
              </div>
            </div>
            <p className="font-editorial text-4xl font-bold text-white">{card.value}</p>
            <p className={`font-sans text-[10px] font-bold ${card.color}`}>{card.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Real-time Recent Enquiries */}
        <div className="xl:col-span-2 bg-[#1A1C20] border border-white/5 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
            <h2 className="font-editorial text-lg font-bold text-white">Recent Enquiries ({enquiries.length})</h2>
            <Link to="/admin/enquiries" className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold hover:underline">View All Enquiries</Link>
          </div>
          <div className="divide-y divide-white/5">
            {enquiries.length > 0 ? enquiries.slice(0, 6).map((item, idx) => (
              <div key={item.id || idx} className="px-6 py-4 flex items-center space-x-4 hover:bg-white/2 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center font-editorial font-bold text-gold text-sm shrink-0">
                  {(item.name || 'C').charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="font-sans text-xs font-bold text-white truncate">{item.name || 'Client'}</p>
                    <span className="font-mono text-[9px] text-white/40">({item.enquiryId || item.id})</span>
                  </div>
                  <p className="font-sans text-[10px] text-white/40 truncate">
                    {item.phone} • {item.location || 'Location Not Specified'}
                  </p>
                </div>
                <span className="shrink-0 px-2 py-0.5 rounded text-[9px] font-sans font-bold uppercase tracking-wider bg-gold/15 text-gold border border-gold/30">
                  {item.type ? item.type.replace('_', ' ') : 'ENQUIRY'}
                </span>
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-[9px] font-sans uppercase tracking-wide font-bold ${
                  item.status === 'CONTACTED' ? 'bg-blue-500/15 text-blue-400' :
                  item.status === 'CONVERTED' ? 'bg-emerald-500/15 text-emerald-400' :
                  item.status === 'FOLLOW_UP' ? 'bg-amber-500/15 text-amber-400' :
                  'bg-gold/15 text-gold border border-gold/20'
                }`}>
                  {item.status || 'NEW'}
                </span>
              </div>
            )) : (
              <div className="px-6 py-12 text-center space-y-3">
                <AlertCircle size={24} className="text-white/20 mx-auto" />
                <p className="font-sans text-xs text-white/40">No customer enquiries received yet.</p>
                <p className="font-sans text-[11px] text-white/30">Enquiries submitted on the website will appear here instantly in real-time.</p>
              </div>
            )}
          </div>
        </div>

        {/* Customized Quick Actions */}
        <div className="bg-[#1A1C20] border border-white/5 rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/5">
            <h2 className="font-editorial text-lg font-bold text-white">Quick Actions</h2>
          </div>
          <div className="p-5 space-y-3">
            {[
              { label: '1. Homepage CMS', path: '/admin/hero', icon: Layers },
              { label: '2. Services CMS', path: '/admin/services', icon: Package },
              { label: '3. Spaces CMS', path: '/admin/spaces', icon: Layers },
              { label: '4. Materials CMS', path: '/admin/materials', icon: Package },
              { label: '5. Admin Users', path: '/admin/users', icon: Users },
            ].map((action, idx) => (
              <Link key={idx} to={action.path}
                className="flex items-center space-x-3 p-3.5 rounded-xl bg-white/3 hover:bg-white/10 border border-white/5 hover:border-gold/30 transition-all duration-200 group">
                <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/30 flex items-center justify-center">
                  <action.icon size={15} className="text-gold" />
                </div>
                <span className="font-sans text-xs text-white/80 group-hover:text-gold font-bold transition-colors">{action.label}</span>
                <ChevronRight size={14} className="ml-auto text-white/20 group-hover:text-gold transition-colors" />
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
