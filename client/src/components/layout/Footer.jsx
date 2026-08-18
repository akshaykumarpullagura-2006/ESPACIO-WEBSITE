import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { SocialLightButton } from '../ui/SocialLightButton';
import { PAGE_CTAS } from '../../utils/siteData';

const renderSocialIcon = (iconName) => {
  const iconLower = (iconName || '').toLowerCase();
  if (iconLower === 'facebook') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
      </svg>
    );
  }
  if (iconLower === 'youtube') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
      </svg>
    );
  }
  if (iconLower === 'whatsapp') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
      </svg>
    );
  }
  if (iconLower === 'linkedin') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    );
  }
  if (iconLower === 'twitter' || iconLower === 'x') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
      </svg>
    );
  }
  // Default to Instagram icon
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
};

const Footer = () => {
  const location = useLocation();
  const year = new Date().getFullYear();
  const espRef = useRef(null);
  const inView = useInView(espRef, { once: false, margin: '-60px' });

  // Get current page key for page-specific CTA
  const getPageKey = () => {
    const path = location.pathname;
    if (path.startsWith('/projects')) return 'projects';
    if (path.startsWith('/services')) return 'services';
    if (path.startsWith('/what-we-do')) return 'spaces';
    if (path.startsWith('/products')) return 'materials';
    if (path.startsWith('/faq')) return 'faqs';
    if (path.startsWith('/about')) return 'about';
    if (path.startsWith('/contact')) return 'contact';
    return 'home';
  };

  const pageKey = getPageKey();
  const defaultCta = PAGE_CTAS[pageKey.toUpperCase()] || PAGE_CTAS.HOME;

  const [cmsSettings, setCmsSettings] = React.useState({});

  React.useEffect(() => {
    const fetchFooterSettings = async () => {
      try {
        const { getCMSData, STORAGE_KEYS } = await import('../../utils/cmsStore');
        const stored = getCMSData(STORAGE_KEYS.SETTINGS);
        if (stored) {
          setCmsSettings(stored);
        }
      } catch {}

      try {
        const { default: axios } = await import('axios');
        const res = await axios.get('/settings');
        if (res.data.success && res.data.data) {
          setCmsSettings(res.data.data);
        }
      } catch {}
    };

    fetchFooterSettings();

    const handleSync = () => fetchFooterSettings();
    window.addEventListener('espacio_cms_update', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('espacio_cms_update', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [year]);

  // Compute active page CTA settings
  const activePageCta = cmsSettings[`cta_${pageKey}`] || {};
  const ctaHeadline = activePageCta.heading || defaultCta.headline;
  const ctaSubtext = activePageCta.description || defaultCta.subtext;
  const ctaButtonText = activePageCta.buttonText || defaultCta.buttonText;
  const ctaButtonLink = activePageCta.buttonLink || defaultCta.path || '/contact';
  const ctaBgImage = activePageCta.bgImage || defaultCta.bgImage || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80';
  const ctaOpacity = activePageCta.opacity !== undefined ? Number(activePageCta.opacity) : (defaultCta.opacity ?? 80);
  const ctaEnabled = activePageCta.enabled !== false;

  const overlayOpacityVal = ctaOpacity / 100;
  const overlayGradient = `linear-gradient(to bottom, rgba(16, 16, 20, ${overlayOpacityVal}), rgba(16, 16, 20, ${Math.min(1, overlayOpacityVal + 0.12)}))`;

  // Scroll animations for the CTA banner
  const ctaRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ctaRef,
    offset: ["start 95%", "center center"]
  });

  const clipPath = useTransform(
    scrollYProgress, 
    [0, 1], 
    ["inset(15% 10% 15% 10% round 40px)", "inset(0% 0% 0% 0% round 0px)"]
  );
  
  const contentY = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, 1]);

  // Dynamic CMS fields with defaults
  const locationTitle = cmsSettings.footer_location_title || 'LOCATION';
  const locationAddress = cmsSettings.footer_address || cmsSettings.office_info?.address || '1st floor, H.No. 6-63/14B, Moinabad Road, Aziznagar, Hyderabad, Telangana 500075';
  const locationMapUrl = cmsSettings.footer_map_url || 'https://maps.app.goo.gl/q3zbxWmEt5wvRKbZ6';

  const contactTitle = cmsSettings.footer_contact_title || 'CONTACT';
  const phoneText = cmsSettings.footer_phone || cmsSettings.cta_phone || '+91 95051 51116';
  const whatsappText = cmsSettings.footer_whatsapp || '+91 95051 51116';
  const emailText = cmsSettings.footer_email || cmsSettings.office_info?.email || 'Espacio.hyd@gmail.com';

  const exploreTitle = cmsSettings.footer_explore_title || 'EXPLORE';
  
  const defaultNavLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Projects', path: '/projects' },
    { label: 'Spaces', path: '/what-we-do' },
    { label: 'Materials', path: '/products' },
    { label: 'About', path: '/about' },
  ];

  const navLinks = Array.isArray(cmsSettings.footer_nav_items) && cmsSettings.footer_nav_items.length > 0
    ? cmsSettings.footer_nav_items
    : defaultNavLinks;

  const defaultSocialItems = [
    { label: 'Instagram', name: 'Instagram', href: 'https://www.instagram.com/theespacio.in', icon: 'instagram', color: '#E4405F', beamColor: 'rgba(228, 64, 95, 0.4)' },
    { label: 'Facebook', name: 'Facebook', href: 'https://facebook.com', icon: 'facebook', color: '#1877F2', beamColor: 'rgba(24, 119, 242, 0.4)' },
    { label: 'YouTube', name: 'YouTube', href: 'https://youtube.com', icon: 'youtube', color: '#FF0000', beamColor: 'rgba(255, 0, 0, 0.4)' },
    { label: 'WhatsApp', name: 'WhatsApp', href: 'https://wa.me/919505151116', icon: 'whatsapp', color: '#25D366', beamColor: 'rgba(37, 211, 102, 0.4)' },
  ];

  const socialItems = Array.isArray(cmsSettings.footer_social_items) && cmsSettings.footer_social_items.length > 0
    ? cmsSettings.footer_social_items
    : defaultSocialItems;

  const brandLeft = cmsSettings.footer_brand_left !== undefined 
    ? cmsSettings.footer_brand_left 
    : (cmsSettings.footer_brand_text ? cmsSettings.footer_brand_text.slice(0, 3) : 'ESP');

  const brandRight = cmsSettings.footer_brand_right !== undefined 
    ? cmsSettings.footer_brand_right 
    : (cmsSettings.footer_brand_text ? cmsSettings.footer_brand_text.slice(3) : 'ACIO.');

  const brandWeight = cmsSettings.footer_brand_weight !== undefined ? Number(cmsSettings.footer_brand_weight) : 500;
  const brandOpacity = cmsSettings.footer_brand_opacity !== undefined ? Number(cmsSettings.footer_brand_opacity) / 100 : 1;

  const copyrightText = cmsSettings.footer_copyright || `© ${year} ESPACIO. All rights reserved.`;
  const privacyLabel = cmsSettings.footer_privacy_label || 'Privacy Policy';
  const termsLabel = cmsSettings.footer_terms_label || 'Terms of Service';

  // Compute clean hrefs
  const phoneHref = `tel:${phoneText.replace(/[^\d+]/g, '')}`;
  const whatsappHref = whatsappText.startsWith('http')
    ? whatsappText
    : `https://wa.me/${whatsappText.replace(/[^\d]/g, '')}`;
  const emailHref = `mailto:${emailText}`;

  return (
    <footer className="bg-bg-dark text-bg pb-10">
      {/* 1. Center CTA Banner with Dusk Architectural Background */}
      {ctaEnabled && (
        <motion.div 
          ref={ctaRef}
          style={{ clipPath }}
          className="relative pt-24 pb-32 px-6 md:px-12 text-center mb-16 overflow-hidden bg-cover bg-center"
        >
          {/* Background Image Layer */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-500"
            style={{
              backgroundImage: `${overlayGradient}, url('${ctaBgImage}')`
            }}
          />

          {/* Top/bottom soft fades */}
          <div className="absolute inset-0 bg-gradient-to-b from-bg-dark via-transparent to-bg-dark pointer-events-none z-0" />

          <motion.div 
            className="relative z-10 max-w-[1440px] mx-auto flex flex-col items-center justify-center"
            style={{ y: contentY, opacity: contentOpacity }}
          >
            <h2 className="font-display text-[clamp(32px,5vw,60px)] font-medium leading-[1.1] tracking-tight text-bg mb-6 whitespace-pre-line">
              {ctaHeadline}
            </h2>
            <p className="font-sans text-[15px] text-bg/60 max-w-[480px] mx-auto leading-relaxed mb-10">
              {ctaSubtext}
            </p>
            <Link 
              to={ctaButtonLink}
              className="btn-sliding-cta"
            >
              <span className="btn-sliding-cta-text-one">{ctaButtonText}</span>
              <span className="btn-sliding-cta-text-two">{ctaButtonText}</span>
            </Link>
          </motion.div>
        </motion.div>
      )}

      {/* Thin Divider line */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 border-t border-white/10 mb-12" />

      {/* 2. Combined Footer Info Row */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row lg:justify-between items-start gap-12 pb-16 mb-4">
        
        {/* Left Side Group (Location, Gmail, and Explore on desktop) */}
        <div className="flex flex-col items-start gap-8 w-full lg:max-w-[480px]">
          
          {/* A. Location */}
          <div>
            <p className="font-sans text-[13px] text-white/40 mb-1 select-none uppercase tracking-wider">
              {locationTitle}
            </p>
            <a 
              href={locationMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[15px] text-bg/60 hover:text-bg transition-colors block leading-relaxed hover:underline decoration-white/20 underline-offset-4 whitespace-pre-line"
            >
              {locationAddress}
            </a>
          </div>

          {/* B. Contact Info */}
          <div>
            <p className="font-sans text-[13px] text-white/40 mb-1 select-none uppercase tracking-wider">
              {contactTitle}
            </p>
            <div className="space-y-1">
              <a 
                href={phoneHref} 
                className="font-sans text-[15px] text-bg/60 hover:text-bg transition-colors block hover:underline decoration-white/20 underline-offset-4"
              >
                {phoneText}
              </a>
              <a 
                href={whatsappHref} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-sans text-[15px] text-bg/60 hover:text-bg transition-colors block hover:underline decoration-white/20 underline-offset-4"
              >
                WhatsApp: {whatsappText}
              </a>
              <a 
                href={emailHref} 
                className="font-sans text-[15px] text-bg/60 hover:text-bg transition-colors block hover:underline decoration-white/20 underline-offset-4"
              >
                {emailText}
              </a>
            </div>
          </div>

          {/* C. Explore Links (Desktop-only inside this column) */}
          <div className="hidden lg:block w-full">
            <p className="font-sans text-[13px] text-white/40 mb-3 select-none uppercase tracking-wider">
              {exploreTitle}
            </p>
            <div className="flex flex-row flex-wrap gap-x-5 gap-y-2">
              {navLinks.map((link, i) => (
                <Link key={i} to={link.path || link.href || '/'} className="font-sans text-[14px] font-medium text-bg/60 hover:text-bg transition-colors">
                  {link.label || link.name}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Mobile-only Link Section: 2 columns (Explore on left, Social text links on right) */}
        <div className="grid grid-cols-2 w-full gap-8 lg:hidden pb-4">
          {/* Left Column: Nav links */}
          <div>
            <div className="flex flex-col gap-3">
              {navLinks.map((link, i) => (
                <Link key={i} to={link.path || link.href || '/'} className="font-sans text-[14px] font-medium text-bg/60 hover:text-bg transition-colors">
                  {link.label || link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Social text links (right-aligned) */}
          <div className="flex flex-col items-end gap-3 text-right">
            {socialItems.map((s, i) => (
              <a key={i} href={s.href || '#'} target="_blank" rel="noopener noreferrer" className="font-sans text-[14px] font-medium text-bg/60 hover:text-bg transition-colors">
                {s.label || s.name}
              </a>
            ))}
          </div>
        </div>

        {/* Desktop-only: Social Logos (hidden on mobile) */}
        <div className="hidden lg:flex flex-row flex-wrap gap-4 items-center justify-end lg:mt-4">
          {socialItems.map((s, i) => (
            <SocialLightButton 
              key={i}
              label={s.label || s.name}
              href={s.href || '#'}
              color={s.color || '#C5A572'}
              beamColor={s.beamColor || 'rgba(197, 165, 114, 0.4)'}
              icon={renderSocialIcon(s.icon || s.name)}
            />
          ))}
        </div>
      </div>

      {/* 4. Massive Animated ESPACIO Typography */}
      <div ref={espRef} className="w-full select-none overflow-hidden flex items-center justify-center mt-6 mb-2">
        <div className="flex items-center justify-center gap-[3px] sm:gap-[10px]" style={{ transform: 'translateX(-0.35em)' }}>
          {/* Left Group - slides in dynamically from LEFT */}
          <motion.span
            className="text-[clamp(55px,11vw,235px)] leading-none uppercase text-white flex flex-row items-center gap-[6px] sm:gap-[20px]"
            style={{
              fontFamily: "'Gotham Medium', 'Gotham Book', 'Gotham', 'Montserrat', sans-serif",
              fontWeight: brandWeight,
              opacity: brandOpacity,
              marginRight: 'var(--logo-kerning)'
            }}
            initial={{ x: '-85%', opacity: 0, scale: 0.95 }}
            animate={inView ? { x: 0, opacity: 1, scale: 1 } : { x: '-85%', opacity: 0, scale: 0.95 }}
            transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
          >
            {brandLeft.split('').map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </motion.span>
          
          {/* Right Group — Slides in from Right */}
          <motion.span
            className="text-[clamp(55px,11vw,235px)] leading-none uppercase text-white flex flex-row items-center gap-[6px] sm:gap-[20px]"
            style={{
              fontFamily: "'Gotham Medium', 'Gotham Book', 'Gotham', 'Montserrat', sans-serif",
              fontWeight: brandWeight,
              opacity: brandOpacity,
            }}
            initial={{ x: '85%', opacity: 0, scale: 0.95 }}
            animate={inView ? { 
              x: 0, 
              opacity: 1, 
              scale: 1
            } : { x: '85%', opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 2.0, 
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {brandRight.split('').map((char, i) => {
              if (char === '.') {
                return (
                  <span key={i} style={{ fontSize: '0.45em', display: 'inline-block', verticalAlign: 'baseline' }}>.</span>
                );
              }
              return <span key={i}>{char}</span>;
            })}
          </motion.span>
        </div>
      </div>

      {/* 5. Copyright Strip */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col items-center justify-center gap-2 pt-6 pb-4 border-t border-white/5 text-center">
        <p className="font-sans text-[12px] text-bg/40">
          {copyrightText}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[12px] text-bg/40 mt-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('open-privacy-modal'));
            }}
            className="hover:text-bg transition-colors bg-transparent border-0 cursor-pointer text-inherit p-0 font-sans text-[12px]"
          >
            {privacyLabel}
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('open-terms-modal'));
            }}
            className="hover:text-bg transition-colors bg-transparent border-0 cursor-pointer text-inherit p-0 font-sans text-[12px]"
          >
            {termsLabel}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
