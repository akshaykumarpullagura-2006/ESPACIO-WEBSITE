import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Layers, Award, Sparkles, DraftingCompass, CheckCircle2 } from 'lucide-react';
import SEO from '../components/common/SEO';

/* ── Animated Counter Component ───────────────────────────────────── */
const Counter = ({ from = 0, to, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  useEffect(() => {
    if (!inView) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * (to - from) + from));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [inView, from, to, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

/* ── Scroll Reveal Wrapper ─────────────────────────────────────────── */
const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

const About = () => {
  const [activeTimeline, setActiveTimeline] = useState(null);

  const timelineEvents = [
    {
      gen: 'Generation I',
      title: 'The Civil Foundation',
      company: 'Founding Stone Masonry & Engineering',
      desc: 'Our great-grandfather laid the structural foundation of our family construction legacy in Hyderabad. Built on load-bearing precision, structural integrity, and honest material sourcing.'
    },
    {
      gen: 'Generation II',
      title: 'Mantana Constructions',
      company: 'Commercial & Multi-Family Residential',
      desc: 'Expanded into large-scale residential complexes and commercial landmarks across Hyderabad. Built a reputation for zero material compromises and strict engineering tolerances.'
    },
    {
      gen: 'Generation III',
      title: 'Mastana Infra',
      company: 'Iconic Private Estates & Infrastructure',
      desc: 'Pioneered luxury architectural builds and bespoke private lakefront residences — including the lakeside estate chosen as a primary filming location in the movie Guntur Kaaram.'
    },
    {
      gen: 'Generation IV',
      title: 'ESPACIO Interiors & Modular',
      company: 'Engineering-First Bespoke Interiors',
      desc: 'Fusing structural construction mastery with luxury interior architecture. We don\'t just style spaces — we engineer every wall, cabinet, and finish for lifetime permanence.'
    }
  ];

  const values = [
    {
      num: '01',
      title: 'Engineering First',
      icon: DraftingCompass,
      desc: 'Every design decision is backed by structural calculations, acoustic isolation, and load tolerances. We build spaces to thrive over decades — not just look good in photos.'
    },
    {
      num: '02',
      title: 'Material Honesty',
      icon: ShieldCheck,
      desc: 'We source premium materials globally from trusted manufacturers, ensuring exceptional quality, authentic craftsmanship, and uncompromising standards in every project.'
    },
    {
      num: '03',
      title: 'Turnkey Accountability',
      icon: Layers,
      desc: 'Design, civil modifications, electrical, procurement, bespoke joinery, and handover — managed by a single unified engineering team with zero blame-shifting.'
    },
    {
      num: '04',
      title: '40-Year Heritage',
      icon: Award,
      desc: 'Four generations of construction trust in Hyderabad — from Mantana & Mastana to ESPACIO. We stand behind every millimetre of our work.'
    }
  ];

  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80',
      title: 'Besoke Villa Interior',
      subtitle: 'Jubilee Hills Private Residence'
    },
    {
      url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
      title: 'Modular Precision Joinery',
      subtitle: 'ESPACIO Studio & Workshop'
    },
    {
      url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
      title: 'Italian Marble Architecture',
      subtitle: 'Gachibowli Modern Estate'
    },
    {
      url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=900&q=80',
      title: 'Lakeside Architectural Build',
      subtitle: 'Featured in Guntur Kaaram'
    }
  ];

  return (
    <div className="bg-bg text-ink min-h-screen selection:bg-gold selection:text-ink">
      <SEO
        title="About — ESPACIO Interiors"
        description="ESPACIO is Hyderabad's premier engineering-first interior design studio, backed by 40 years of family construction legacy across Mantana & Mastana."
        url="/about"
      />

      {/* ── 1. SIGNATURE HERO BANNER (Rounded Dark Hero Card) ────────────── */}
      <section className="px-5 pt-5 pb-2 lg:px-12 z-0">
        <div className="relative w-full overflow-hidden rounded-[24px] lg:rounded-[40px] bg-bg-dark text-white p-8 md:p-14 lg:p-20 shadow-2xl">
          
          {/* Hero Background Image with Overlay */}
          <div className="absolute inset-0 z-0 opacity-25">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
              alt="ESPACIO Luxury Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101014] via-[#101014]/80 to-transparent" />
          </div>

          <div className="relative z-10 max-w-[1280px] mx-auto space-y-8">
            {/* Tag Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-gold/40 bg-gold/10 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                About ESPACIO
              </span>
            </motion.div>

            {/* Editorial Title */}
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-[clamp(36px,5.5vw,76px)] font-normal leading-[1.08] tracking-tight text-white max-w-[950px]"
            >
              Four generations of construction.<br />
              <span className="italic text-gold font-light">One new standard</span> for design.
            </motion.h1>

            {/* Hero Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="font-sans text-[15px] md:text-[17px] text-white/70 max-w-[720px] leading-relaxed"
            >
              Long before ESPACIO existed, our family was already building across Hyderabad through Mantana Constructions and Mastana Infra. We bring 40 years of load-bearing precision and structural engineering to luxury interior architecture.
            </motion.p>

            <motion.div
              className="pt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 border-t border-white/10"
            >
              {/* Card 1: Projects Completed */}
              <div className="p-6 rounded-[20px] bg-white/[0.06] backdrop-blur-xl border border-white/10 flex flex-col justify-between">
                <div>
                  <p className="font-display text-[clamp(34px,3vw,48px)] font-bold text-gold leading-none tracking-tight">
                    <Counter to={25} suffix="+" />
                  </p>
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60 mt-3 leading-normal">
                    Projects Completed
                  </p>
                </div>
              </div>

              {/* Card 2: Years Active */}
              <div className="p-6 rounded-[20px] bg-white/[0.06] backdrop-blur-xl border border-white/10 flex flex-col justify-between">
                <div>
                  <p className="font-display text-[clamp(34px,3vw,48px)] font-bold text-gold leading-none tracking-tight">
                    <Counter to={1} /> Year
                  </p>
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60 mt-3 leading-normal">
                    Since 2025 (as Espacio)
                  </p>
                </div>
              </div>

              {/* Card 3: Happy Clients */}
              <div className="p-6 rounded-[20px] bg-white/[0.06] backdrop-blur-xl border border-white/10 flex flex-col justify-between">
                <div>
                  <p className="font-display text-[clamp(34px,3vw,48px)] font-bold text-gold leading-none tracking-tight">
                    <Counter to={100} suffix="+" />
                  </p>
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60 mt-3 leading-normal">
                    Happy Clients (incl. materials)
                  </p>
                </div>
              </div>

              {/* Card 4: Family Legacy */}
              <div className="p-6 rounded-[20px] bg-white/[0.06] backdrop-blur-xl border border-white/10 flex flex-col justify-between">
                <div>
                  <p className="font-display text-[clamp(34px,3vw,48px)] font-bold text-gold leading-none tracking-tight">
                    <Counter to={40} suffix="+" />
                  </p>
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.15em] text-white/60 mt-3 leading-normal">
                    Years Combined Family Legacy
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ── 2. OUR STORY SECTION (Warm Cream Background) ─────────────────── */}
      <section className="py-24 px-6 md:px-12 border-b border-ink-border bg-bg">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column — Sticky Showcase Card */}
          <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-xl border border-ink-border group">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80"
                alt="ESPACIO Studio Craft"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-[16px] bg-white/90 backdrop-blur-md border border-white/40">
                <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-gold">
                  Engineering Milestone
                </span>
                <p className="font-display text-base font-semibold text-ink mt-0.5">
                  Lakeside residence chosen as filming location for <em>Guntur Kaaram</em>
                </p>
              </div>
            </div>
          </Reveal>

          {/* Right Column — Narrative Story */}
          <Reveal delay={0.15} className="lg:col-span-7 space-y-6 pt-2">
            <h2 className="text-gold leading-tight" style={{ fontFamily: "'Lucy the Cat', sans-serif", fontSize: 'clamp(36px,5.5vw,64px)', fontWeight: 'normal', letterSpacing: '0.02em' }}>
              Our Origin Story
            </h2>
            <p className="text-ink leading-relaxed" style={{ fontFamily: "'Canela', 'Cormorant Garamond', 'Cinzel', serif", fontSize: 'clamp(18px,2.5vw,28px)', fontWeight: 700 }}>
              Most interiors don't fail because of bad design. They fail because of what's hiding behind the design — walls that were never built right in the first place.
            </p>
            <p className="text-gold" style={{ fontFamily: "'Manrope', sans-serif", fontSize: '20px', fontWeight: 700, lineHeight: 1.9, letterSpacing: '-0.01em' }}>
              We've spent four generations making sure that never happens.
            </p>
            <p className="text-ink-soft" style={{ fontFamily: "'Manrope', sans-serif", fontSize: '17px', fontWeight: 400, lineHeight: 1.9, letterSpacing: '-0.01em' }}>
              Long before Espacio existed, our family was already building, as builders. Our great-grandfather laid the literal foundation of a construction legacy that would run four generations deep, through two companies, <strong>Mantana Constructions</strong> and <strong>Mastana Infra</strong>, and 40+ years of homes, commercial spaces, and landmark builds across Hyderabad.
            </p>
            <p className="text-ink-soft" style={{ fontFamily: "'Manrope', sans-serif", fontSize: '17px', fontWeight: 400, lineHeight: 1.9, letterSpacing: '-0.01em' }}>
              One of those builds is the lakeside home which was later chosen as a filming location for the movie <strong className="text-gold italic" style={{ fontWeight: 800 }}>Guntur Kaaram</strong>. Not because it was decorated well. Because it was built to be unforgettable.
            </p>
            <p className="text-ink-soft" style={{ fontFamily: "'Manrope', sans-serif", fontSize: '17px', fontWeight: 400, lineHeight: 1.9, letterSpacing: '-0.01em' }}>
              That's the world this brand comes from. Not showrooms. Job sites. Not mood boards. Load-bearing walls, material tolerances, what actually holds up over decades and what doesn't.
            </p>
            <p className="text-ink-soft" style={{ fontFamily: "'Manrope', sans-serif", fontSize: '17px', fontWeight: 400, lineHeight: 1.9, letterSpacing: '-0.01em' }}>
              So when we started Espacio, we didn't start where most interior firms start. We didn't start with what looks good on Instagram. We started with what we already knew: that a beautiful interior means nothing if it isn't built right underneath.
            </p>
          </Reveal>

        </div>
      </section>

      {/* ── 3. INTERACTIVE 4-GENERATION EXPANDABLE ACCORDION (Soft Card Background) ──── */}
      <section className="py-24 px-6 md:px-12 border-b border-ink-border bg-bg-card">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-ink-border/60 pb-6">
            <div>
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-gold">The Evolution</span>
              <h2 className="font-display text-[clamp(28px,3.5vw,48px)] font-bold text-ink mt-1">Four Generations of Mastery</h2>
            </div>
            <span className="font-sans text-xs text-ink-muted tracking-widest uppercase font-semibold">Hover to Expand Era</span>
          </Reveal>

          {/* Expandable Accordion Container */}
          <div 
            className="flex flex-col lg:flex-row gap-5 min-h-[460px] items-stretch"
            onMouseLeave={() => setActiveTimeline(null)}
          >
            {timelineEvents.map((item, idx) => {
              const isActive = activeTimeline === idx;
              const isHoveringAny = activeTimeline !== null;
              const isDimmed = isHoveringAny && !isActive;

              return (
                <motion.div
                  key={idx}
                  layout
                  onMouseEnter={() => setActiveTimeline(idx)}
                  onClick={() => setActiveTimeline(idx)}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  className={`relative rounded-[24px] overflow-hidden transition-all duration-500 cursor-pointer flex flex-col justify-between border ${
                    isActive
                      ? 'lg:flex-[3.2] bg-bg text-ink border-gold shadow-2xl z-20 ring-1 ring-gold/40 p-8 md:p-10 scale-[1.01]'
                      : isDimmed
                      ? 'lg:flex-1 bg-bg/40 text-ink-soft border-ink-border/70 z-10 p-6 md:p-8 opacity-75'
                      : 'lg:flex-1 bg-bg/80 text-ink border-ink-border hover:border-gold/50 z-10 p-6 md:p-8 opacity-100'
                  }`}
                >
                  {/* Subtle Image Backdrop for Expanded Card */}
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.06 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 pointer-events-none"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
                        alt="Background Texture"
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-gold">
                        {item.gen}
                      </span>
                    </div>

                    <h3 className={`font-display font-bold text-ink transition-all ${
                      isActive ? 'text-2xl md:text-3xl mb-2' : 'text-xl md:text-2xl mb-1'
                    }`}>
                      {item.title}
                    </h3>

                    <p className="font-sans text-xs font-semibold text-gold uppercase tracking-wider mb-4">
                      {item.company}
                    </p>

                    <motion.p
                      layout
                      className={`font-sans text-sm text-ink-soft leading-relaxed transition-all ${
                        isActive ? 'opacity-100 max-w-[620px]' : 'opacity-80 line-clamp-3 lg:line-clamp-4'
                      }`}
                    >
                      {item.desc}
                    </motion.p>
                  </div>

                  <div className="relative z-10 pt-6 mt-6 border-t border-ink-border/40 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                    <span className={isActive ? 'text-gold' : 'text-ink-muted'}>
                      {isActive ? 'Active Era Details' : 'Hover to Expand'}
                    </span>
                    <span className={`w-2 h-2 rounded-full transition-all ${
                      isActive ? 'bg-gold scale-125 shadow-[0_0_10px_rgba(201,169,110,0.8)]' : 'bg-ink-line'
                    }`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. CORE PRINCIPLES GRID ───────────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 border-b border-ink-border bg-bg">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <Reveal className="text-center max-w-[700px] mx-auto">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-gold">Our Philosophy</span>
            <h2 className="font-display text-[clamp(28px,3.8vw,52px)] font-bold text-ink mt-1">
              Uncompromising Design Principles
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.num} delay={i * 0.1}>
                  <div className="p-8 md:p-10 rounded-[20px] bg-bg-card border border-ink-border shadow-sm hover:border-gold/50 hover:shadow-md transition-all duration-300 relative group overflow-hidden h-full flex flex-col justify-between">
                    <div className="absolute top-4 right-6 font-display text-5xl font-bold text-ink-border/40 group-hover:text-gold/20 transition-colors">
                      {v.num}
                    </div>

                    <div>
                      <div className="w-12 h-12 rounded-[14px] bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-6 group-hover:scale-105 transition-transform">
                        <Icon size={24} />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-ink mb-3">
                        {v.title}
                      </h3>
                      <p className="font-sans text-sm text-ink-soft leading-relaxed">
                        {v.desc}
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-ink-border/40 flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-wider">
                      <CheckCircle2 size={14} />
                      <span>ESPACIO Guarantee</span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. MISSION & VISION (Dual Cards) ─────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 border-b border-ink-border bg-bg-card">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <Reveal delay={0}>
            <div className="p-8 md:p-12 rounded-[20px] bg-bg border border-ink-border shadow-sm relative overflow-hidden group hover:border-gold/40 transition-all">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gold" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-gold">Our Mission</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-ink leading-snug mt-4">
                "We design spaces with intention — engineered first, styled second — so every home we touch is as functional as it is beautiful."
              </h3>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="p-8 md:p-12 rounded-[20px] bg-bg border border-ink-border shadow-sm relative overflow-hidden group hover:border-gold/40 transition-all">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gold" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-gold">Our Vision</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-ink leading-snug mt-4">
                "To redefine what interior design means — proving that real craftsmanship, not trends, is what makes a space timeless."
              </h3>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 6. CRAFTSMANSHIP GALLERY GRID ─────────────────────────────────── */}
      <section className="py-24 px-6 md:px-12 border-b border-ink-border bg-bg">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <Reveal className="text-center max-w-[650px] mx-auto">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-gold">Visual Standards</span>
            <h2 className="font-display text-[clamp(28px,3.5vw,48px)] font-bold text-ink mt-1">
              Craftsmanship in Detail
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryImages.map((img, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="group flex flex-col space-y-3 cursor-pointer">
                  <div className="relative aspect-[3/4] rounded-[20px] overflow-hidden border border-ink-border shadow-sm bg-bg-card">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="bg-cream/40 border border-walnut/10 rounded-[20px] p-6 relative overflow-hidden shadow-sm transition-all duration-300 group-hover:border-gold/30">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-gold" />
                    <p className="font-sans text-[11px] font-bold uppercase tracking-[0.22em] text-gold group-hover:text-ink transition-colors duration-300">
                      {img.subtitle}
                    </p>
                    <h3 className="font-display text-base md:text-lg font-bold text-ink leading-snug mt-2">
                      {img.title}
                    </h3>
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

export default About;
