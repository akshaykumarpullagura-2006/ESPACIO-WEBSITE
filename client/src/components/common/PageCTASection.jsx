import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { getCMSData, STORAGE_KEYS, getCtaDataForPage } from '../../utils/cmsStore';
import { PAGE_CTAS, DEFAULT_CTA_BG } from '../../utils/siteData';

const getInitialCtaData = (pageKey) => {
  const upperKey = (pageKey || 'home').toUpperCase();
  const fallback = PAGE_CTAS[upperKey] || PAGE_CTAS.HOME;

  return {
    heading: fallback?.headline || "Ready to Transform Your Space?",
    description: fallback?.subtext || "Every great space starts with a single conversation. Let's talk about your vision and bring it to life together.",
    buttonText: fallback?.buttonText || "LET'S TALK ↗",
    buttonLink: fallback?.path || "/contact",
    bgImage: fallback?.bgImage || DEFAULT_CTA_BG,
    opacity: fallback?.opacity ?? 80,
    enabled: fallback?.enabled !== false,
  };
};

const PageCTASection = ({ pageKey = 'home', className = '' }) => {
  const [ctaData, setCtaData] = useState(() => {
    const initialFallback = getInitialCtaData(pageKey);
    const settings = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    return getCtaDataForPage(settings, pageKey, initialFallback);
  });

  useEffect(() => {
    const initialFallback = getInitialCtaData(pageKey);

    const syncCtaSettings = () => {
      const settings = getCMSData(STORAGE_KEYS.SETTINGS) || {};
      setCtaData(getCtaDataForPage(settings, pageKey, initialFallback));
    };

    const fetchApiSettings = async () => {
      try {
        const res = await axios.get('/settings');
        if (res.data.success && res.data.data) {
          const merged = { ...(getCMSData(STORAGE_KEYS.SETTINGS) || {}), ...res.data.data };
          setCtaData(getCtaDataForPage(merged, pageKey, initialFallback));
        }
      } catch (err) {
        // Fallback to local CMS store if API fails
      }
    };

    syncCtaSettings();
    fetchApiSettings();

    window.addEventListener('espacio_cms_update', syncCtaSettings);
    window.addEventListener('storage', syncCtaSettings);
    return () => {
      window.removeEventListener('espacio_cms_update', syncCtaSettings);
      window.removeEventListener('storage', syncCtaSettings);
    };
  }, [pageKey]);

  if (ctaData.enabled === false) {
    return null;
  }

  const bgImg = ctaData.bgImage || DEFAULT_CTA_BG;
  const darkOpacity = (ctaData.opacity ?? 80) / 100;

  return (
    <section className={`relative w-full overflow-hidden my-8 px-4 sm:px-6 lg:px-12 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[1440px] mx-auto min-h-[380px] md:min-h-[460px] rounded-[28px] md:rounded-[36px] overflow-hidden flex flex-col items-center justify-center text-center p-8 md:p-16 border border-white/10 shadow-2xl"
      >
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={bgImg}
            alt="ESPACIO CTA Background"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
            onError={(e) => {
              e.currentTarget.src = DEFAULT_CTA_BG;
            }}
          />
          {/* Dynamic Dark Overlay Tint */}
          <div
            className="absolute inset-0 bg-black pointer-events-none transition-opacity duration-300"
            style={{ opacity: darkOpacity }}
          />
          {/* Subtle Radial Vignette Gradient */}
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-[11px] font-sans font-semibold text-white tracking-[0.15em] uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span>Transform Your Space</span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-editorial text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-[1.15] tracking-tight whitespace-pre-line drop-shadow-lg"
          >
            {ctaData.heading}
          </motion.h2>

          {/* Description */}
          {ctaData.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-sans text-sm sm:text-base md:text-lg font-normal text-white/90 leading-relaxed max-w-2xl mx-auto drop-shadow"
            >
              {ctaData.description}
            </motion.p>
          )}

          {/* Action CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="pt-2"
          >
            <Link
              to={ctaData.buttonLink || '/contact'}
              className="inline-flex items-center justify-center space-x-2 bg-gold hover:bg-white text-charcoal font-sans text-xs sm:text-sm font-bold uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-98 group cursor-pointer"
            >
              <span>{ctaData.buttonText || "LET'S TALK ↗"}</span>
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default PageCTASection;
