import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Lenis from 'lenis';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CustomCursor from './components/common/CustomCursor';
import QuoteModal from './components/common/QuoteModal';
import PrivacyModal from './components/common/PrivacyModal';
import TermsModal from './components/common/TermsModal';
import Logo from './components/common/Logo';

// Public Pages (Lazy-loaded for code-splitting & optimal performance)
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Services = React.lazy(() => import('./pages/Services'));
const Projects = React.lazy(() => import('./pages/Projects'));
const ProjectDetails = React.lazy(() => import('./pages/ProjectDetails'));
const WhatWeDo = React.lazy(() => import('./pages/WhatWeDo'));
const Products = React.lazy(() => import('./pages/Products'));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails'));
const Contact = React.lazy(() => import('./pages/Contact'));

// Lazy-loaded Admin Components for Bundle & Performance Isolation
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminDashboardHome = React.lazy(() => import('./pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboardHome })));
const AdminHomeHeroCMS = React.lazy(() => import('./pages/admin/AdminHomeHeroCMS'));
const AdminServicesCMS = React.lazy(() => import('./pages/admin/AdminServicesCMS'));
const AdminSpacesCMS = React.lazy(() => import('./pages/admin/AdminSpacesCMS'));
const AdminMaterialsCMS = React.lazy(() => import('./pages/admin/AdminMaterialsCMS'));
const AdminAboutCMS = React.lazy(() => import('./pages/admin/AdminAboutCMS'));
const AdminFAQCMS = React.lazy(() => import('./pages/admin/AdminFAQCMS'));
const AdminContactCMS = React.lazy(() => import('./pages/admin/AdminContactCMS'));
const AdminTestimonialsCMS = React.lazy(() => import('./pages/admin/AdminTestimonialsCMS'));
const AdminPagesCMS = React.lazy(() => import('./pages/admin/AdminPagesCMS'));
const AdminFooterCMS = React.lazy(() => import('./pages/admin/AdminFooterCMS'));
const AdminEnquiries = React.lazy(() => import('./pages/admin/AdminEnquiries'));
const AdminProjects = React.lazy(() => import('./pages/admin/AdminProjects'));
const AdminProducts = React.lazy(() => import('./pages/admin/AdminProducts'));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'));
const AdminAuditLogs = React.lazy(() => import('./pages/admin/AdminAuditLogs'));
const AdminMedia = React.lazy(() => import('./pages/admin/AdminCMS').then(m => ({ default: m.AdminMedia })));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminCMS').then(m => ({ default: m.AdminSettings })));

const AdminLoaderFallback = () => (
  <div className="min-h-screen bg-[#0E0F11] flex items-center justify-center">
    <div className="flex flex-col items-center space-y-3">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      <span className="font-sans text-xs text-white/50 uppercase tracking-widest">Loading Admin Portal...</span>
    </div>
  </div>
);
// ── Scroll to top on every route change ─────────────────────────────────────
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);
  return null;
};

// Floating CTA Triggers: Desktop Floating Button + Mobile Right-Edge Vertical "GET FREE ESTIMATE" Tab
const FloatingLogo = () => {
  const shouldReduceMotion = useReducedMotion();

  const handleOpenModal = () => {
    window.dispatchEvent(new CustomEvent('open-quote-modal'));
  };

  return (
    <>
      {/* DESKTOP ONLY: Fixed Floating Button with Continuous Rotating Icon & Animated "CLICK HERE" Tag */}
      <div className="hidden lg:flex fixed bottom-6 right-6 z-[9999] pointer-events-auto items-center gap-2.5">
        {/* CLICK HERE Tag (Desktop Only) */}
        {!shouldReduceMotion && (
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{
              x: [25, 0, 0, 14, 25, 25],
              opacity: [0, 1, 1, 0.7, 0, 0]
            }}
            transition={{
              duration: 4.5,
              times: [0, 0.267, 0.444, 0.667, 0.778, 1],
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="pointer-events-none select-none flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#101014]/90 backdrop-blur-md border border-gold/40 text-gold shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          >
            <span className="font-sans text-[10px] font-bold tracking-[0.18em] uppercase whitespace-nowrap text-gold">
              CLICK HERE
            </span>
            <span className="text-xs text-gold font-bold transition-transform duration-300">
              →
            </span>
          </motion.div>
        )}

        <motion.button
          onClick={handleOpenModal}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-14 h-14 rounded-full bg-bg-dark border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.6)] flex items-center justify-center cursor-pointer hover:border-gold/50 hover:shadow-[0_0_25px_rgba(201,169,110,0.35)] hover:bg-[#0c0c0f] select-none transition-all duration-300 group outline-none"
          aria-label="Get Free Estimate"
        >
          <motion.div 
            className="scale-90 flex items-center justify-center w-full h-full"
            animate={{ rotate: 360 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <Logo showText={false} scrolled={false} size="small" />
          </motion.div>
        </motion.button>
      </div>

      {/* MOBILE ONLY: Small Fixed Vertical "GET FREE ESTIMATE" Tab on Right Edge */}
      <div className="lg:hidden fixed right-0 top-1/2 -translate-y-1/2 z-[9999] pointer-events-auto">
        <motion.button
          onClick={handleOpenModal}
          whileTap={{ scale: 0.94 }}
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#121316]/95 backdrop-blur-md border-l border-t border-b border-gold/40 text-gold shadow-[0_4px_20px_rgba(0,0,0,0.6)] rounded-l-xl py-3.5 px-2 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:bg-[#1a1b20] active:bg-[#1f2026] transition-all select-none group outline-none"
          aria-label="Get Free Estimate"
        >
          <span 
            className="font-display text-[9.5px] font-bold tracking-[0.2em] text-gold uppercase whitespace-nowrap"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Get Free Estimate
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse mt-0.5" />
        </motion.button>
      </div>
    </>
  );
};

import MaintenanceMode from './components/common/MaintenanceMode';
import { getCMSData, STORAGE_KEYS } from './utils/cmsStore';

// Shared Layout Wrapper with Page Transitions
const MainLayout = () => {
  const location = useLocation();
  const isContactSuccess = location.pathname === '/contact' && location.search.includes('success=true');
  const [settings, setSettings] = React.useState(() => getCMSData(STORAGE_KEYS.SETTINGS) || {});

  React.useEffect(() => {
    const syncSettings = () => {
      const s = getCMSData(STORAGE_KEYS.SETTINGS);
      if (s) setSettings(s);
    };
    syncSettings();
    window.addEventListener('espacio_cms_update', syncSettings);
    window.addEventListener('storage', syncSettings);
    return () => {
      window.removeEventListener('espacio_cms_update', syncSettings);
      window.removeEventListener('storage', syncSettings);
    };
  }, []);

  if (settings?.maintenanceMode) {
    return <MaintenanceMode settings={settings} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isContactSuccess && <Footer />}
      <QuoteModal />
      <PrivacyModal />
      <TermsModal />
      <FloatingLogo />
    </div>
  );
};

function App() {
  useEffect(() => {
    // Initialize Lenis smooth scrolling with optimized settings
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.8,
      infinite: false,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <CustomCursor />
          <React.Suspense fallback={<AdminLoaderFallback />}>
            <Routes>
              {/* ── Public Routes (Animated) ────────────────────────── */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectDetails />} />
                <Route path="/what-we-do" element={<WhatWeDo />} />
                <Route path="/what-we-do/:slug" element={<WhatWeDo />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:slug" element={<ProductDetails />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* 404 fallback */}
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* ── Admin Routes (No Navbar/Footer) ───────────────────── */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboardHome /></AdminLayout>} />
              <Route path="/admin/hero" element={<AdminLayout><AdminHomeHeroCMS /></AdminLayout>} />
              <Route path="/admin/services" element={<AdminLayout><AdminServicesCMS /></AdminLayout>} />
              <Route path="/admin/spaces" element={<AdminLayout><AdminSpacesCMS /></AdminLayout>} />
              <Route path="/admin/materials" element={<AdminLayout><AdminMaterialsCMS /></AdminLayout>} />
              <Route path="/admin/about" element={<AdminLayout><AdminAboutCMS /></AdminLayout>} />
              <Route path="/admin/faqs" element={<AdminLayout><AdminFAQCMS /></AdminLayout>} />
              <Route path="/admin/contact" element={<AdminLayout><AdminContactCMS /></AdminLayout>} />
              <Route path="/admin/testimonials" element={<AdminLayout><AdminTestimonialsCMS /></AdminLayout>} />
              <Route path="/admin/pages" element={<AdminLayout><AdminPagesCMS /></AdminLayout>} />
              <Route path="/admin/footer" element={<AdminLayout><AdminFooterCMS /></AdminLayout>} />
              <Route path="/admin/enquiries" element={<AdminLayout><AdminEnquiries /></AdminLayout>} />
              <Route path="/admin/projects" element={<AdminLayout><AdminProjects /></AdminLayout>} />
              <Route path="/admin/products" element={<AdminLayout><AdminMaterialsCMS /></AdminLayout>} />
              <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
              <Route path="/admin/audit" element={<AdminLayout><AdminAuditLogs /></AdminLayout>} />
              <Route path="/admin/gallery" element={<AdminLayout><AdminMedia /></AdminLayout>} />
              <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
            </Routes>
          </React.Suspense>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

const NotFound = () => (
  <div className="min-h-screen bg-cream flex items-center justify-center text-center px-6 space-y-5">
    <div>
      <p className="font-sans text-xs uppercase tracking-widest text-gold font-bold mb-4">404</p>
      <h1 className="font-editorial text-5xl font-bold text-charcoal mb-4">Page Not Found</h1>
      <p className="font-sans text-sm text-walnut mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="inline-flex items-center space-x-2 bg-charcoal text-cream font-sans text-xs uppercase tracking-widest font-bold py-4 px-8 rounded-button hover:bg-gold hover:text-charcoal transition-all duration-300">
        Back to Home
      </a>
    </div>
  </div>
);

export default App;
