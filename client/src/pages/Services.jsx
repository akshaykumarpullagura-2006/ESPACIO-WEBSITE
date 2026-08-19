import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, CheckCircle2, MessageSquare, Compass, Layers, Palette, Settings } from 'lucide-react';
import SEO from '../components/common/SEO';
import { Button as MovingBorderButton } from '../components/ui/moving-border';
import { BorderDrawingCard } from '../components/ui/BorderDrawingCard';

const Reveal = ({ children, delay = 0, className = '', direction = 'up' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-10% 0px -10% 0px' });
  const getInitial = () => {
    if (direction === 'left') return { opacity: 0, x: -100, scale: 0.96 };
    if (direction === 'right') return { opacity: 0, x: 100, scale: 0.96 };
    return { opacity: 0, y: 40 };
  };
  const getAnimate = () => {
    if (direction === 'left' || direction === 'right') {
      return inView 
        ? { opacity: 1, x: 0, scale: 1 } 
        : { opacity: 0, x: direction === 'left' ? -100 : 100, scale: 0.96 };
    }
    return inView 
      ? { opacity: 1, y: 0 } 
      : { opacity: 0, y: 40 };
  };
  return (
    <motion.div ref={ref} className={className}
      initial={getInitial()} animate={getAnimate()}
      transition={{ 
        type: 'tween',
        duration: 1.6,
        ease: [0.16, 1, 0.3, 1],
        delay: inView ? Math.min(delay, 0.25) : 0
      }}>
      {children}
    </motion.div>
  );
};

const services = [
  { 
    num: '01', 
    title: 'Full Home Interior Design & Execution', 
    tag: 'Turnkey Design & Build', 
    desc: 'Bespoke residential interior architecture engineered from concept to final handover. We integrate custom modular joinery, lighting layouts, and premium wall finishes into a seamless turnkey execution.', 
    includes: ['Living & Dining Spatial Architecture', 'Custom Modular Wardrobe Systems', 'Ergonomic Modular Kitchen Layouts', 'Ambient Cove & Architectural Lighting', 'Curated Wall & Surface Textures', 'Turnkey Execution & Project Oversight'], 
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
    ctaText: 'Enquire About Interior Design'
  },
  { 
    num: '02', 
    title: 'Commercial & Office Interiors', 
    tag: 'Workspaces & Retail', 
    desc: 'High-tolerance commercial fit-outs for corporate offices, experience centers, and retail environments. Engineered for acoustic optimization, brand elevation, and maximum workspace efficiency.', 
    includes: ['Corporate Office Spatial Planning', 'Retail & Studio Flow Optimization', 'Acoustic WPC Conference Suites', 'Ergonomic Workstation Clusters', 'Tech & AV Concealed Channels', 'Turnkey Commercial Buildout'], 
    img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=90',
    ctaText: 'Enquire About Modular Solutions'
  },
  { 
    num: '03', 
    title: 'Styling & Decor Curation', 
    tag: 'Curated Styling', 
    desc: 'Tailored aesthetic curation, soft furnishings, and architectural accent styling. Designed to harmonize color palettes, art installations, and spatial lighting into a cohesive luxury statement.', 
    includes: ['Bespoke Art & Wall Installations', 'Luxury Soft Furnishing Selection', 'Architectural Accent & Mood Lighting', 'Indoor Botanical & Greenery Curation', 'Harmonized Color & Texture Audits', 'Turnkey Final Styling Installation'], 
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
    ctaText: 'Enquire About Styling & Decor'
  },
  { 
    num: '04', 
    title: 'Turnkey Renovation & Remodeling', 
    tag: 'Upgrade Existing Spaces', 
    desc: 'Transforming existing residential and commercial properties into modern architectural showcases. Complete structural upgrades, re-wiring, and finish overhauls handled without multi-vendor hassle.', 
    includes: ['Full Kitchen & Bath Overhauls', 'Living Area Structural Spatial Redesign', 'Precision Electrical & Plumbing Re-lay', 'Italian Marble & Flooring Replacement', 'Custom Ceiling & Louver Upgrades', 'Complete Turnkey Project Management'], 
    img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80',
    ctaText: 'Enquire About Turnkey Renovation'
  },
  { 
    num: '05', 
    title: 'Materials Supply (Standalone Purchase)', 
    tag: 'Direct Warehouse Sourcing', 
    desc: 'Direct access to our extensive inventory of WPC wall & ceiling panels, polygranite sheets, acrylic fluted louvers, and hardware. Available for standalone purchase directly from our Aziznagar warehouse.', 
    includes: ['WPC Wall & Exterior Cladding Panels', 'Polygranite & High-Gloss Acrylic Sheets', 'Charcoal & Wood Grain Fluted Louvers', 'Architectural Trim & Edge Hardware', 'Standalone Wholesale & Retail Purchase', 'Rapid Delivery from Hyderabad Godowns'], 
    img: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=900&q=80',
    ctaText: 'Enquire About Materials',
    hasSecondaryLink: true
  },
];

const processSteps = [
  { step: '01', name: 'Initial Consultation', desc: 'We understand your vision, lifestyle, and budget constraints with absolute clarity.' },
  { step: '02', name: 'Site Visit & Measurement', desc: 'Our team surveys site dimensions, structural constraints, and wiring channels.' },
  { step: '03', name: '3D Concept Design', desc: 'Photorealistic 3D renders of your space before a single nail goes in.' },
  { step: '04', name: 'Material Selection', desc: 'Walk through our material library. Touch, see, and confirm every finish.' },
  { step: '05', name: 'Production & Execution', desc: 'On-time, on-spec execution with regular progress photo updates.' },
  { step: '06', name: 'Quality Handover', desc: 'Final punch-list inspection, clean-up, and keys handover on your timeline.' },
];

const getStepIcon = (step) => {
  switch (step) {
    case '01': return MessageSquare;
    case '02': return Compass;
    case '03': return Layers;
    case '04': return Palette;
    case '05': return Settings;
    case '06': return CheckCircle2;
    default: return CheckCircle2;
  }
};

const heroImages = [
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1920&q=90',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90',
  'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1920&q=90',
  'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1920&q=90',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=90',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1920&q=90',
];

import { getCMSData, STORAGE_KEYS } from '../utils/cmsStore';

const getNonEmpty = (val, fallback) => (val && typeof val === 'string' && val.trim().length > 0 ? val : fallback);

const defaultTestimonials = [
  { name: 'Rajesh & Ananya Sharma', designation: 'Jubilee Hills Villa • Full Interiors', body: 'ESPACIO delivered our 3BHK villa turnkey interior ahead of schedule. Their transparent BOQ quotation had zero hidden surprises, and the fluted acrylic finish is breathtaking.', rating: 5 },
  { name: 'Dr. Vikram Reddy', designation: 'Gachibowli Residence • Kitchen & Louvers', body: 'The modular kitchen and charcoal louver wall in our living room turned out exactly like the 3D renders. The quotation matched down to the last rupee.', rating: 5 },
  { name: 'Siddharth Mehta', designation: 'HITECH City • Corporate Office', body: 'We fitted our 4,000 sq.ft executive office with ESPACIO PVC ceiling panels and glass partitions. Professional project management and impeccable finishing.', rating: 5 }
];

const Services = () => {
  const heroRef = useRef(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const [heroContent, setHeroContent] = useState(() => {
    const s = getCMSData(STORAGE_KEYS.SETTINGS);
    return {
      badge: getNonEmpty(s?.services_hero_badge, 'Services'),
      title: getNonEmpty(s?.services_hero_title, 'Our Services'),
      subtitle: getNonEmpty(s?.services_hero_subtitle, 'Turnkey design and build with engineering tolerances. No templates. No hidden package tricks.'),
      images: (Array.isArray(s?.services_hero_images) && s.services_hero_images.length > 0) ? s.services_hero_images : heroImages,
      visible: true
    };
  });

  const [servicesList, setServicesList] = useState(() => {
    const s = getCMSData(STORAGE_KEYS.SETTINGS);
    return (Array.isArray(s?.services_list) && s.services_list.length > 0) ? s.services_list : services;
  });

  const [testimonialsList, setTestimonialsList] = useState(() => {
    const stored = getCMSData(STORAGE_KEYS.TESTIMONIALS);
    if (Array.isArray(stored) && stored.length > 0) {
      const filtered = stored.filter(t => t.visible !== false && t.featured);
      return filtered.length > 0 ? filtered.slice(0, 3) : defaultTestimonials;
    }
    return defaultTestimonials;
  });

  useEffect(() => {
    const syncCMS = () => {
      const settings = getCMSData(STORAGE_KEYS.SETTINGS);
      if (settings) {
        setHeroContent({
          badge: getNonEmpty(settings.services_hero_badge, 'Services'),
          title: getNonEmpty(settings.services_hero_title, 'Our Services'),
          subtitle: getNonEmpty(settings.services_hero_subtitle, 'Turnkey design and build with engineering tolerances. No templates. No hidden package tricks.'),
          images: (Array.isArray(settings.services_hero_images) && settings.services_hero_images.length > 0)
            ? settings.services_hero_images
            : heroImages,
          visible: settings.services_hero_visible !== false
        });
        if (Array.isArray(settings.services_list) && settings.services_list.length > 0) {
          setServicesList(settings.services_list);
        }
      }

      const storedTestimonials = getCMSData(STORAGE_KEYS.TESTIMONIALS);
      if (Array.isArray(storedTestimonials) && storedTestimonials.length > 0) {
        const filtered = storedTestimonials.filter(t => t.visible !== false && t.featured);
        if (filtered.length > 0) {
          setTestimonialsList(filtered.slice(0, 3));
        }
      }
    };

    syncCMS();

    window.addEventListener('espacio_cms_update', syncCMS);
    window.addEventListener('storage', syncCMS);
    return () => {
      window.removeEventListener('espacio_cms_update', syncCMS);
      window.removeEventListener('storage', syncCMS);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % ((heroContent.images || heroImages).length));
    }, 5000);
    return () => clearInterval(timer);
  }, [heroContent.images]);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 0.95]);
  const bgY     = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);

  return (
    <div className="bg-bg overflow-x-hidden">
      <SEO title="Services — ESPACIO Interiors" description="Full home interiors, modular kitchens, commercial spaces, and renovations. Engineering-first luxury design executed by ESPACIO." url="/services" />

      {heroContent.visible !== false && (
        <section ref={heroRef} className="relative h-[66vh] lg:h-[78vh] min-h-[530px] px-5 pt-5 pb-[10px] lg:px-12">
          <div className="relative w-full h-full overflow-hidden will-change-transform rounded-[24px] lg:rounded-[40px]">
            <motion.div style={{ scale: bgScale, y: bgY }} className="absolute inset-0 will-change-transform overflow-hidden">
              <AnimatePresence initial={false}>
                <motion.img key={currentImageIdx} src={(heroContent.images && heroContent.images[currentImageIdx % heroContent.images.length]) || heroImages[0]} alt="ESPACIO Services" initial={{ x: '15%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '-15%', opacity: 0 }} transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1] }} className="absolute inset-0 w-full h-full object-cover" />
              </AnimatePresence>
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/25 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 z-20 flex flex-col justify-end pointer-events-none">
              <div className="w-full px-8 md:px-12 pb-10 md:pb-12 pointer-events-auto">
                <div className="flex flex-col items-start gap-3">
                  <div className="inline-flex items-center gap-2 bg-black/55 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                    <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em]">{heroContent.badge}</span>
                  </div>
                  <h1 className="font-display font-bold leading-none tracking-tight text-white" style={{ fontSize: 'clamp(40px, 6vw, 84px)' }}>
                    {heroContent.title}
                  </h1>
                  <p className="font-sans text-[14px] md:text-[15px] text-white/70 max-w-[500px] leading-relaxed">
                    {heroContent.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="pt-6 md:pt-8 pb-16 md:pb-20 px-6 md:px-10 overflow-hidden">
        <div className="max-w-[1440px] mx-auto divide-y divide-ink-border">
          {servicesList.filter((s) => s.visible !== false).map((s, i) => {
            const isOdd = i % 2 === 1;
            return (
              <div key={s.num || i} className="py-12 md:py-14 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <Reveal delay={0.05} direction={isOdd ? 'right' : 'left'} className={isOdd ? 'lg:order-2' : ''}>
                  <div className="aspect-[4/3] rounded-card overflow-hidden bg-bg-card">
                    <img src={s.img} alt={s.title} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                </Reveal>
                <Reveal delay={0.15} direction={isOdd ? 'left' : 'right'} className={`space-y-6 ${isOdd ? 'lg:order-1' : ''}`}>
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-[11px] font-semibold text-gold">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-ink-muted bg-bg-card px-3 py-1 rounded-pill">{s.tag}</span>
                  </div>
                  <h2 className="font-display text-[clamp(28px,3vw,42px)] font-bold tracking-tight text-ink leading-tight">{s.title}</h2>
                  <p className="font-sans text-[15px] text-ink-soft leading-relaxed">{s.desc}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(Array.isArray(s.includes) ? s.includes : []).map((item, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 font-sans text-[13px] text-ink-soft">
                        <CheckCircle2 size={14} className="text-gold shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  {s.ctaVisible !== false && (
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <Link to={s.ctaLink || "/contact"} className="btn-primary w-fit">
                        {s.ctaText || "Enquire About This"} <ArrowUpRight size={13} />
                      </Link>
                      {(s.hasSecondaryLink || s.num === '05' || s.title.includes('Materials')) && (
                        <Link to="/products" className="inline-flex items-center gap-1.5 font-sans text-[13px] font-bold text-gold hover:text-gold/80 transition-colors uppercase tracking-wider">
                          Browse Materials →
                        </Link>
                      )}
                    </div>
                  )}
                </Reveal>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-24 px-6 md:px-10 bg-bg-card border-t border-ink-border">
        <div className="max-w-[1440px] mx-auto">
          <Reveal>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-gold mb-3">How We Work</p>
            <h2 className="font-display text-[clamp(28px,3vw,44px)] font-bold tracking-tight text-ink mb-14">Our Process</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {processSteps.map((p, i) => {
              const Icon = getStepIcon(p.step);
              return (
                <Reveal key={p.step} delay={i * 0.07} className="h-full">
                  <MovingBorderButton as="div" borderRadius="24px" duration={3000 + i * 500} containerClassName="w-full h-full" className="group relative bg-bg border border-ink-border/10 rounded-card p-8 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(16,16,20,0.04)] transition-all duration-500 flex flex-col justify-between h-full overflow-hidden text-left items-stretch">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-pill bg-black/10 flex items-center justify-center text-black group-hover:bg-black group-hover:text-cream transition-all duration-500">
                          <Icon size={20} className="stroke-[1.5]" />
                        </div>
                        <span className="font-display text-[44px] font-bold text-ink-muted/15 group-hover:text-black/20 transition-colors duration-500 select-none">{p.step}</span>
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-display text-[19px] font-bold text-ink group-hover:text-black transition-colors duration-300">{p.name}</h3>
                        <p className="font-sans text-[13.5px] text-ink-soft leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  </MovingBorderButton>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INSTANT ESTIMATION & QUOTATION CALCULATOR ──────────────────────────── */}
      <section className="py-20 px-6 md:px-10 bg-offwhite">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <Reveal>
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Project Planner</span>
                <h2 className="font-display text-[clamp(32px,3.5vw,48px)] font-bold text-charcoal leading-tight">Instant Project Estimate</h2>
                <p className="font-sans text-sm text-walnut leading-relaxed">
                  Select your property type, scope, and finish tier below. Since actual site conditions affect final BOQ significantly, our principal design team will share your personalized range on a quick call.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <QuotationCalculator />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLIENT REVIEWS & TESTIMONIALS ────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-10 bg-cream">
        <div className="max-w-[1440px] mx-auto">
          <Reveal className="text-center max-w-[600px] mx-auto mb-14 space-y-3">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Client Feedback</span>
            <h2 className="font-display text-[clamp(28px,3.5vw,44px)] font-bold text-charcoal">What Our Clients Say</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsList.map((t, idx) => (
              <Reveal key={t.id || idx} delay={idx * 0.08} className="bg-offwhite border border-walnut/10 rounded-card p-8 shadow-sm space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex text-gold text-sm gap-1">
                    {'★'.repeat(t.rating || 5)}
                  </div>
                  <p className="font-sans text-xs text-charcoal/80 leading-relaxed italic">
                    “{t.body || t.reviewText || ''}”
                  </p>
                </div>
                <div className="pt-4 border-t border-walnut/10 flex items-center space-x-3">
                  {t.avatar && (
                    <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-gold/30" />
                  )}
                  <div>
                    <h4 className="font-sans text-xs font-bold text-charcoal">{t.name}</h4>
                    <p className="font-sans text-[10px] text-walnut">{t.designation || t.role || 'ESPACIO Client'}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// ── QUOTATION CALCULATOR COMPONENT ─────────────────────────────────────────
const QuotationCalculator = () => {
  const [propertyType, setPropertyType] = useState('3bhk');
  const [scope, setScope] = useState('full');
  const [finishGrade, setFinishGrade] = useState('premium');
  const [submitted, setSubmitted] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phone || phone.trim().replace(/\s+/g, '').length < 10) return;
    
    // Save to CMS enquiries
    try {
      import('../utils/cmsStore').then(({ getCMSData, setCMSData, STORAGE_KEYS, notifyCMSUpdate }) => {
        const existing = getCMSData(STORAGE_KEYS.ENQUIRIES) || [];
        const count = existing.length + 1;
        const enquiryId = `ESP-EST-${String(count).padStart(5, '0')}`;
        const scopeLabel = scope === 'full' ? 'Turnkey Full Home' : scope === 'kitchen' ? 'Modular Kitchen' : 'Panelling & Louvers';
        const propLabel = propertyType === '2bhk' ? '2 BHK' : propertyType === '3bhk' ? '3 BHK' : propertyType === 'villa' ? 'Villa' : 'Office';

        const newRecord = {
          id: enquiryId,
          enquiryId: enquiryId,
          type: 'INSTANT_ESTIMATE',
          source: 'INSTANT_PROJECT_ESTIMATE',
          requirementType: 'INSTANT_ESTIMATE',
          name: name ? name.trim() : 'Valued Client',
          phone: phone.trim(),
          email: '',
          location: `Property: ${propLabel}`,
          propertyType: propLabel,
          scopeOfWork: scopeLabel,
          finishGrade: finishGrade,
          notesText: `Instant Project Estimate Submission — Property: ${propLabel}, Scope: ${scopeLabel}, Grade: ${finishGrade}`,
          notes: [{ id: `n-${Date.now()}`, text: `Captured via Instant Project Estimate calculator on Services page. Property: ${propLabel}, Scope: ${scopeLabel}.`, createdAt: new Date().toISOString() }],
          status: 'NEW',
          read: false,
          submittedAt: new Date().toISOString(),
          followUp: null
        };
        setCMSData(STORAGE_KEYS.ENQUIRIES, [newRecord, ...existing]);
        notifyCMSUpdate();
      });
    } catch {}

    setSubmitted(true);
  };

  return (
    <div className="bg-cream border border-walnut/15 rounded-card p-6 md:p-8 shadow-xl space-y-6">
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1 pb-3 border-b border-walnut/10">
            <h3 className="font-display text-xl font-bold text-charcoal">Instant Project Estimate</h3>
            <p className="font-sans text-xs text-walnut">Configure your project details to unlock your personalized estimate</p>
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <label className="font-sans text-xs font-bold uppercase tracking-wider text-charcoal">1. Property Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: '2bhk', label: '2 BHK' },
                { id: '3bhk', label: '3 BHK' },
                { id: 'villa', label: 'Villa' },
                { id: 'office', label: 'Office' }
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setPropertyType(item.id)}
                  className={`py-2.5 px-3 rounded-card text-xs font-sans font-medium transition-all ${
                    propertyType === item.id 
                      ? 'bg-charcoal text-cream shadow-md font-bold' 
                      : 'bg-offwhite text-walnut border border-walnut/10 hover:border-walnut/30'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scope */}
          <div className="space-y-2">
            <label className="font-sans text-xs font-bold uppercase tracking-wider text-charcoal">2. Scope of Work</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'full', label: 'Turnkey Full Home' },
                { id: 'kitchen', label: 'Modular Kitchen' },
                { id: 'louvers', label: 'Panelling & Louvers' }
              ].map(item => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setScope(item.id)}
                  className={`py-2.5 px-3 rounded-card text-xs font-sans font-medium transition-all ${
                    scope === item.id 
                      ? 'bg-charcoal text-cream shadow-md font-bold' 
                      : 'bg-offwhite text-walnut border border-walnut/10 hover:border-walnut/30'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Input for Lead Capture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <input
              type="text"
              placeholder="Your Name (Optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-walnut/20 bg-white text-xs font-sans focus:outline-none focus:border-gold"
            />
            <input
              type="tel"
              placeholder="Mobile / WhatsApp Number *"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-walnut/20 bg-white text-xs font-sans focus:outline-none focus:border-gold"
            />
          </div>

          <button
            type="submit"
            className="w-full text-center bg-gold text-charcoal font-sans text-xs font-bold uppercase tracking-wider px-6 py-4 rounded-xl hover:bg-charcoal hover:text-cream transition-all shadow-md cursor-pointer"
          >
            Unlock Personalized Estimate →
          </button>
        </form>
      ) : (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-gold/15 text-gold flex items-center justify-center mx-auto border border-gold/30">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="font-display text-xl font-bold text-charcoal">Your Estimate is Ready</h3>
          <p className="font-sans text-xs text-walnut leading-relaxed max-w-[420px] mx-auto">
            Your estimate is ready — we'll share your personalized range on a quick call, since site conditions affect final BOQ significantly.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setSubmitted(false)}
              className="px-6 py-2.5 rounded-full border border-walnut/20 text-charcoal font-sans text-xs font-bold hover:bg-charcoal hover:text-cream transition-all"
            >
              Configure Another Estimate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
