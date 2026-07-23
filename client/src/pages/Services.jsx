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
    desc: 'From concept to handover, we design and build your home end-to-end — delivered turnkey, so you\'re never juggling multiple vendors or contractors.', 
    includes: ['Living & Dining Design', 'Bedroom & Wardrobe Systems', 'Modular Kitchen Layouts', 'Ceilings & Ambient Lighting', 'Material & Texture Curation', 'Turnkey Project Execution'], 
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80' 
  },
  { 
    num: '02', 
    title: 'Commercial Interiors', 
    tag: 'Workspaces & Retail', 
    desc: 'Interior design and fit-out for offices, retail, and commercial spaces, delivered turnkey with a single team managing design, materials, and execution from start to finish.', 
    includes: ['Office Layout Optimization', 'Retail Flow Planning', 'Conference & Meeting Rooms', 'Ergonomic Workstations', 'AV & Tech Integration', 'Turnkey Construction'], 
    img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=90' 
  },
  { 
    num: '03', 
    title: 'Styling & Decor', 
    tag: 'Curated Styling', 
    desc: 'Curated styling, accessories, and finishing touches that bring a space to life — offered as a standalone service or as the final turnkey step on any Espacio project.', 
    includes: ['Art & Wall Decor Curation', 'Custom Soft Furnishings', 'Lighting & Accessory Styling', 'Plants & Greenery Selection', 'Color Palette Harmony', 'Bespoke Styling Audits'], 
    img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80' 
  },
  { 
    num: '04', 
    title: 'Renovation', 
    tag: 'Upgrade Existing Spaces', 
    desc: 'Redesigning and upgrading existing spaces, residential or commercial, without starting from scratch — delivered turnkey, with design, materials, and execution handled entirely by us.', 
    includes: ['Kitchen & Bath Upgrades', 'Living Space Redesign', 'Structural Alterations', 'Flooring Replacement', 'Electrical & Plumbing Re-lay', 'Turnkey Execution'], 
    img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80' 
  },
  { 
    num: '05', 
    title: 'Materials Supply (Sold Separately)', 
    tag: 'Premium Sourced Supply', 
    desc: 'We source globally to bring you WPC wall & ceiling panels, polygranite sheets, and more warehoused in our own godowns for faster availability. Note: Materials are also sold separately from our design and execution services, you can purchase materials on their own, without booking a full project with us.', 
    includes: ['WPC Wall & Ceiling Panels', 'Polygranite & Acrylic Sheets', 'Fluted & Charcoal Louvers', 'Bespoke Wall Finishes', 'Stand-alone Purchasing', 'Fast Delivery from Godowns'], 
    img: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=900&q=80' 
  },
];

const processSteps = [
  { step: '01', name: 'Free Consultation', desc: 'We understand your vision, lifestyle, and budget constraints — no pressure, no pitch.' },
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

const Services = () => {
  const heroRef = useRef(null);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 0.95]);
  const bgY     = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const textY   = useTransform(scrollYProgress, [0, 1], ['0px', '-40px']);
  const textOp  = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.9, 0]);

  return (
    <div className="bg-bg overflow-x-hidden">
      <SEO title="Services — ESPACIO Interiors" description="Full home interiors, modular kitchens, commercial spaces, and renovations. Engineering-first luxury design executed by ESPACIO." url="/services" />

      <section ref={heroRef} className="relative h-[80vh] lg:h-[95vh] px-5 pt-5 pb-[10px] lg:px-12">
        <div className="relative w-full h-full overflow-hidden will-change-transform rounded-[24px] lg:rounded-[40px]">
          <motion.div style={{ scale: bgScale, y: bgY }} className="absolute inset-0 will-change-transform overflow-hidden">
            <AnimatePresence initial={false}>
              <motion.img key={currentImageIdx} src={heroImages[currentImageIdx]} alt="ESPACIO Services" initial={{ x: '15%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '-15%', opacity: 0 }} transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1] }} className="absolute inset-0 w-full h-full object-cover" />
            </AnimatePresence>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 to-transparent z-10 pointer-events-none" />
          <motion.div style={{ y: textY, opacity: textOp }} className="absolute inset-0 z-20 flex flex-col justify-end">
            <div className="w-full px-8 md:px-12 pb-10 md:pb-14">
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col items-start gap-4">
                <div className="inline-flex items-center gap-2 bg-black/55 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em]">Services</span>
                </div>
                <h1 className="font-display font-bold leading-none tracking-tight text-white" style={{ fontSize: 'clamp(48px, 8vw, 108px)' }}>Our Services</h1>
                <p className="font-sans text-[14px] md:text-[15px] text-white/60 max-w-[420px] leading-relaxed">Turnkey design and build with engineering tolerances. No templates. No hidden package tricks.</p>
                <div className="flex items-center gap-2 mt-1">
                  {heroImages.map((_, i) => (
                    <button key={i} onClick={() => setCurrentImageIdx(i)} className={`rounded-full transition-all duration-500 ${i === currentImageIdx ? 'w-6 h-1.5 bg-gold' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'}`} />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-10 overflow-hidden">
        <div className="max-w-[1440px] mx-auto divide-y divide-ink-border">
          {services.map((s, i) => {
            const isOdd = i % 2 === 1;
            return (
              <div key={s.num} className="py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <Reveal delay={0.05} direction={isOdd ? 'right' : 'left'} className={isOdd ? 'lg:order-2' : ''}>
                  <div className="aspect-[4/3] rounded-card overflow-hidden bg-bg-card">
                    <img src={s.img} alt={s.title} loading="lazy" decoding="async" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                </Reveal>
                <Reveal delay={0.15} direction={isOdd ? 'left' : 'right'} className={`space-y-6 ${isOdd ? 'lg:order-1' : ''}`}>
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-[11px] font-semibold text-gold">{s.num}</span>
                    <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-ink-muted bg-bg-card px-3 py-1 rounded-pill">{s.tag}</span>
                  </div>
                  <h2 className="font-display text-[clamp(28px,3vw,42px)] font-bold tracking-tight text-ink leading-tight">{s.title}</h2>
                  <p className="font-sans text-[15px] text-ink-soft leading-relaxed">{s.desc}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {s.includes.map((item) => (
                      <li key={item} className="flex items-center gap-2 font-sans text-[13px] text-ink-soft">
                        <CheckCircle2 size={14} className="text-gold shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link to="/contact" className="btn-primary w-fit">Enquire About This <ArrowUpRight size={13} /></Link>
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

      {/* ── ARCHITECTURAL QUOTES & DESIGN PHILOSOPHY ────────────────────────────── */}
      <section className="py-24 px-6 md:px-10 bg-charcoal text-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto relative z-10">
          <Reveal>
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold mb-3 block">Design Philosophy</span>
            <h2 className="font-editorial text-[clamp(28px,4vw,52px)] font-bold text-white mb-16">Architectural Quotes & Wisdom</h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Reveal delay={0.05}>
              <BorderDrawingCard delay={0.05} className="w-full h-full">
                <div className="space-y-4">
                  <span className="text-gold font-editorial text-5xl leading-none">“</span>
                  <p className="font-editorial text-lg md:text-xl text-cream/90 italic leading-relaxed">
                    Architecture is the learned game, correct and magnificent, of forms assembled in the light.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-gold">Le Corbusier</span>
                  <span className="font-sans text-[10px] text-cream/40 uppercase tracking-widest">Master Architect</span>
                </div>
              </BorderDrawingCard>
            </Reveal>
 
            <Reveal delay={0.1}>
              <BorderDrawingCard delay={0.15} className="w-full h-full">
                <div className="space-y-4">
                  <span className="text-gold font-editorial text-5xl leading-none">“</span>
                  <p className="font-editorial text-lg md:text-xl text-cream/90 italic leading-relaxed">
                    God is in the details. True luxury is not complexity, but the absolute perfection of execution.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-gold">Ludwig Mies van der Rohe</span>
                  <span className="font-sans text-[10px] text-cream/40 uppercase tracking-widest">Modernism Pioneer</span>
                </div>
              </BorderDrawingCard>
            </Reveal>
 
            <Reveal delay={0.15}>
              <BorderDrawingCard delay={0.25} className="w-full h-full">
                <div className="space-y-4">
                  <span className="text-gold font-editorial text-5xl leading-none">“</span>
                  <p className="font-editorial text-lg md:text-xl text-cream/90 italic leading-relaxed">
                    Space, light, and order. Those are the things that human beings need just as much as bread or shelter.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-gold">Frank Lloyd Wright</span>
                  <span className="font-sans text-[10px] text-cream/40 uppercase tracking-widest">Visionary Architect</span>
                </div>
              </BorderDrawingCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── INSTANT ESTIMATION & QUOTATION CALCULATOR ──────────────────────────── */}
      <section className="py-24 px-6 md:px-10 bg-offwhite">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <Reveal>
                <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Budget Planner</span>
                <h2 className="font-editorial text-[clamp(32px,3.5vw,48px)] font-bold text-charcoal leading-tight">Instant Project Quotation Estimate</h2>
                <p className="font-sans text-sm text-walnut leading-relaxed">
                  Get a transparent baseline estimate for your residential or commercial project. Select your property type, scope, and finish tier below.
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

      {/* ── CLIENT QUOTES & TESTIMONIALS ────────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-10 bg-cream">
        <div className="max-w-[1440px] mx-auto">
          <Reveal className="text-center max-w-[600px] mx-auto mb-16 space-y-3">
            <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Client Feedback</span>
            <h2 className="font-editorial text-[clamp(28px,3.5vw,44px)] font-bold text-charcoal">What Our Clients Say</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Reveal delay={0.05} className="bg-offwhite border border-walnut/10 rounded-card p-8 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-gold text-sm gap-1">★★★★★</div>
                <p className="font-sans text-xs text-charcoal/80 leading-relaxed italic">
                  “ESPACIO delivered our 3BHK villa turnkey interior ahead of schedule. Their transparent BOQ quotation had zero hidden surprises, and the fluted acrylic finish is breathtaking.”
                </p>
              </div>
              <div className="pt-4 border-t border-walnut/10">
                <h4 className="font-sans text-xs font-bold text-charcoal">Rajesh & Ananya Sharma</h4>
                <p className="font-sans text-[10px] text-walnut">Jubilee Hills Villa • Full Interiors</p>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="bg-offwhite border border-walnut/10 rounded-card p-8 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-gold text-sm gap-1">★★★★★</div>
                <p className="font-sans text-xs text-charcoal/80 leading-relaxed italic">
                  “The modular kitchen and charcoal louver wall in our living room turned out exactly like the 3D renders. The quotation matched down to the last rupee.”
                </p>
              </div>
              <div className="pt-4 border-t border-walnut/10">
                <h4 className="font-sans text-xs font-bold text-charcoal">Dr. Vikram Reddy</h4>
                <p className="font-sans text-[10px] text-walnut">Gachibowli Residence • Kitchen & Louvers</p>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="bg-offwhite border border-walnut/10 rounded-card p-8 shadow-sm space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex text-gold text-sm gap-1">★★★★★</div>
                <p className="font-sans text-xs text-charcoal/80 leading-relaxed italic">
                  “We fitted our 4,000 sq.ft executive office with ESPACIO PVC ceiling panels and glass partitions. Professional project management and impeccable finishing.”
                </p>
              </div>
              <div className="pt-4 border-t border-walnut/10">
                <h4 className="font-sans text-xs font-bold text-charcoal">Siddharth Mehta</h4>
                <p className="font-sans text-[10px] text-walnut">HITECH City • Corporate Office</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── FINAL QUOTATION CTA BANNER ────────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-10 bg-charcoal text-cream text-center relative overflow-hidden">
        <div className="max-w-[700px] mx-auto space-y-6 relative z-10">
          <span className="font-sans text-[11px] uppercase tracking-widest text-gold font-bold">Request a Formal Quote</span>
          <h2 className="font-editorial text-3xl md:text-5xl font-bold text-white leading-tight">Ready for a Detailed BOQ & Quotation?</h2>
          <p className="font-sans text-xs md:text-sm text-cream/70 leading-relaxed">
            Schedule a free site survey or consultation with our senior interior architects today. We will prepare an exact itemised quotation within 24 hours.
          </p>
          <div className="pt-2">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-bold px-8 py-4 rounded-full hover:bg-white transition-all shadow-lg">
              Get Formal Quotation <ArrowUpRight size={16} />
            </Link>
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

  const basePrices = {
    '2bhk': { full: 650000, kitchen: 220000, louvers: 90000 },
    '3bhk': { full: 950000, kitchen: 300000, louvers: 140000 },
    'villa': { full: 1800000, kitchen: 500000, louvers: 250000 },
    'office': { full: 1200000, kitchen: 150000, louvers: 200000 }
  };

  const gradeMultipliers = {
    essential: 0.85,
    premium: 1.0,
    signature: 1.35
  };

  const calculatedBase = (basePrices[propertyType]?.[scope] || 800000) * (gradeMultipliers[finishGrade] || 1);
  const minEst = Math.round(calculatedBase * 0.95 / 10000) * 10000;
  const maxEst = Math.round(calculatedBase * 1.12 / 10000) * 10000;

  return (
    <div className="bg-cream border border-walnut/15 rounded-card p-6 md:p-8 shadow-xl space-y-6">
      <div className="space-y-2 pb-4 border-b border-walnut/10">
        <h3 className="font-editorial text-xl font-bold text-charcoal">Quick Quotation Estimator</h3>
        <p className="font-sans text-xs text-walnut">Instant range estimate for your upcoming project</p>
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

      {/* Finish Grade */}
      <div className="space-y-2">
        <label className="font-sans text-xs font-bold uppercase tracking-wider text-charcoal">3. Finish Grade</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'essential', label: 'Essential' },
            { id: 'premium', label: 'Premium Luxe' },
            { id: 'signature', label: 'Signature' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setFinishGrade(item.id)}
              className={`py-2.5 px-3 rounded-card text-xs font-sans font-medium transition-all ${
                finishGrade === item.id 
                  ? 'bg-charcoal text-cream shadow-md font-bold' 
                  : 'bg-offwhite text-walnut border border-walnut/10 hover:border-walnut/30'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Result Display */}
      <div className="pt-4 border-t border-walnut/10 bg-offwhite p-5 rounded-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-sans text-[10px] uppercase tracking-widest text-walnut font-semibold">Estimated Budget Range</span>
          <div className="font-editorial text-2xl md:text-3xl font-bold text-gold">
            ₹{(minEst / 100000).toFixed(2)} Lakhs – ₹{(maxEst / 100000).toFixed(2)} Lakhs
          </div>
        </div>

        <Link
          to={`/contact?property=${propertyType}&scope=${scope}&grade=${finishGrade}`}
          className="w-full sm:w-auto text-center bg-gold text-charcoal font-sans text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-full hover:bg-charcoal hover:text-cream transition-all shadow-md shrink-0"
        >
          Request BOQ Quote →
        </Link>
      </div>
    </div>
  );
};

export default Services;
