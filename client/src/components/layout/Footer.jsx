import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { SocialLightButton } from '../ui/SocialLightButton';

const Footer = () => {
  const year = new Date().getFullYear();
  const espRef = useRef(null);
  const inView = useInView(espRef, { once: false, margin: '-60px' });

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

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Projects', href: '/projects' },
    { name: 'Spaces', href: '/what-we-do' },
    { name: 'Materials', href: '/products' },
    { name: 'About', href: '/about' },
    { name: 'FAQs', href: '/faq' },
  ];

  const socialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/theespacio.in' },
    { name: 'Facebook', href: 'https://facebook.com' },
    { name: 'Linkedin', href: 'https://linkedin.com' },
    { name: 'Twitter', href: 'https://twitter.com' },
  ];

  return (
    <footer className="bg-bg-dark text-bg pb-10">
      {/* 1. Center CTA Banner with Dusk Architectural Background */}
      <motion.div 
        ref={ctaRef}
        style={{ clipPath }}
        className="relative pt-24 pb-32 px-6 md:px-12 text-center mb-16 overflow-hidden bg-cover bg-center"
      >
        {/* Background Image Layer (absolute to allow clipping without affecting layout) */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(16, 16, 20, 0.75), rgba(16, 16, 20, 0.88)), url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1920&q=80')`
          }}
        />

        {/* Top/bottom soft fades */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-dark via-transparent to-bg-dark pointer-events-none z-0" />

        <motion.div 
          className="relative z-10 max-w-[1440px] mx-auto flex flex-col items-center justify-center"
          style={{ y: contentY, opacity: contentOpacity }}
        >
          <h2 className="font-display text-[clamp(32px,5vw,60px)] font-medium leading-[1.1] tracking-tight text-bg mb-6">
            Ready to Transform<br />Your Space?
          </h2>
          <p className="font-sans text-[15px] text-bg/60 max-w-[480px] mx-auto leading-relaxed mb-10">
            Every great space starts with a single conversation. Let's talk about your vision and bring it to life together.
          </p>
          <Link 
            to="/contact"
            className="btn-sliding-cta"
          >
            <span className="btn-sliding-cta-text-one">LET'S TALK ↗</span>
            <span className="btn-sliding-cta-text-two">LET'S TALK ↗</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Thin Divider line */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 border-t border-white/10 mb-12" />

      {/* 2. Combined Footer Info Row */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row lg:justify-between items-start gap-12 pb-16 mb-4">
        
        {/* Left Side Group (Location, Gmail, and Explore on desktop) */}
        <div className="flex flex-col items-start gap-8 w-full lg:max-w-[480px]">
          
          {/* A. Location */}
          <div>
            <p className="font-sans text-[13px] text-white/40 mb-1 select-none uppercase tracking-wider">
              Location
            </p>
            <a 
              href="https://maps.app.goo.gl/q3zbxWmEt5wvRKbZ6"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[15px] text-bg/60 hover:text-bg transition-colors block leading-relaxed hover:underline decoration-white/20 underline-offset-4"
            >
              1st floor, H.No. 6-63/14B, Moinabad Road, Aziznagar, Hyderabad, Telangana 500075
            </a>
          </div>

          {/* B. Contact Info */}
          <div>
            <p className="font-sans text-[13px] text-white/40 mb-1 select-none uppercase tracking-wider">
              Contact
            </p>
            <div className="space-y-1">
              <a 
                href="tel:+919505151116" 
                className="font-sans text-[15px] text-bg/60 hover:text-bg transition-colors block hover:underline decoration-white/20 underline-offset-4"
              >
                +91 95051 51116
              </a>
              <a 
                href="https://wa.me/919505151116" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-sans text-[15px] text-bg/60 hover:text-bg transition-colors block hover:underline decoration-white/20 underline-offset-4"
              >
                WhatsApp: +91 95051 51116
              </a>
              <a 
                href="mailto:Espacio.hyd@gmail.com" 
                className="font-sans text-[15px] text-bg/60 hover:text-bg transition-colors block hover:underline decoration-white/20 underline-offset-4"
              >
                Espacio.hyd@gmail.com
              </a>
            </div>
          </div>



          {/* C. Explore Links (Desktop-only inside this column) */}
          <div className="hidden lg:block w-full">
            <p className="font-sans text-[13px] text-white/40 mb-3 select-none uppercase tracking-wider">
              Explore
            </p>
            <div className="flex flex-row flex-wrap gap-x-5 gap-y-2">
              {navLinks.map((link) => (
                <Link key={link.name} to={link.href} className="font-sans text-[14px] font-medium text-bg/60 hover:text-bg transition-colors">
                  {link.name}
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
              {navLinks.map((link) => (
                <Link key={link.name} to={link.href} className="font-sans text-[14px] font-medium text-bg/60 hover:text-bg transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Social text links (right-aligned) */}
          <div className="flex flex-col items-end gap-3 text-right">
            <a href="https://www.instagram.com/theespacio.in" target="_blank" rel="noopener noreferrer" className="font-sans text-[14px] font-medium text-bg/60 hover:text-bg transition-colors">
              Instagram
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="font-sans text-[14px] font-medium text-bg/60 hover:text-bg transition-colors">
              Facebook
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="font-sans text-[14px] font-medium text-bg/60 hover:text-bg transition-colors">
              Linkedin
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="font-sans text-[14px] font-medium text-bg/60 hover:text-bg transition-colors">
              Twitter
            </a>
          </div>
        </div>

        {/* Desktop-only: Social Logos (hidden on mobile) */}
        <div className="hidden lg:flex flex-row flex-wrap gap-4 items-center justify-end lg:mt-4">
          <SocialLightButton 
            label="Instagram"
            href="https://www.instagram.com/theespacio.in"
            color="#E4405F"
            beamColor="rgba(228, 64, 95, 0.4)"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            }
          />
          <SocialLightButton 
            label="Facebook"
            href="https://facebook.com"
            color="#1877F2"
            beamColor="rgba(24, 119, 242, 0.4)"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            }
          />
          <SocialLightButton 
            label="LinkedIn"
            href="https://linkedin.com"
            color="#0A66C2"
            beamColor="rgba(10, 102, 194, 0.4)"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            }
          />
          <SocialLightButton 
            label="X"
            href="https://twitter.com"
            color="#ffffff"
            beamColor="rgba(255, 255, 255, 0.4)"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
            }
          />
        </div>
      </div>

      {/* 4. Massive Animated ESPACIO Typography (ESP comes from Left, ACIO comes from Right) */}
      <div ref={espRef} className="w-full select-none overflow-hidden flex items-center justify-center mt-6 mb-2">
        <div className="flex items-center justify-center gap-[3px] sm:gap-[10px]" style={{ transform: 'translateX(-0.35em)' }}>
          {/* ESP Group - slides in dynamically from LEFT */}
          <motion.span
            className="text-[clamp(55px,11vw,235px)] leading-none uppercase text-white flex flex-row items-center gap-[6px] sm:gap-[20px]"
            style={{
              fontFamily: "'Gotham Medium', 'Gotham Book', 'Gotham', 'Montserrat', sans-serif",
              fontWeight: 500,
              marginRight: 'var(--logo-kerning)'
            }}
            initial={{ x: '-85%', opacity: 0, scale: 0.95 }}
            animate={inView ? { x: 0, opacity: 1, scale: 1 } : { x: '-85%', opacity: 0, scale: 0.95 }}
            transition={{ duration: 2.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <span>E</span>
            <span>S</span>
            <span>P</span>
          </motion.span>{/* ACIO Group — Slides in from Right, Static White */}<motion.span
            className="text-[clamp(55px,11vw,235px)] leading-none uppercase text-white flex flex-row items-center gap-[6px] sm:gap-[20px]"
            style={{
              fontFamily: "'Gotham Medium', 'Gotham Book', 'Gotham', 'Montserrat', sans-serif",
              fontWeight: 500,
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
            <span>A</span>
            <span>C</span>
            <span>I</span>
            <span>O<span style={{ fontSize: '0.45em', display: 'inline-block', verticalAlign: 'baseline' }}>.</span></span>
          </motion.span>
        </div>
      </div>

      {/* 5. Copyright Strip */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col items-center justify-center gap-2 pt-6 pb-4 border-t border-white/5 text-center">
        <p className="font-sans text-[12px] text-bg/40">
          © {year} ESPACIO. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[12px] text-bg/40 mt-1">
          <button
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('open-privacy-modal'));
            }}
            className="hover:text-bg transition-colors bg-transparent border-0 cursor-pointer text-inherit p-0 font-sans text-[12px]"
          >
            Privacy Policy
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('open-terms-modal'));
            }}
            className="hover:text-bg transition-colors bg-transparent border-0 cursor-pointer text-inherit p-0 font-sans text-[12px]"
          >
            Terms of Service
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
