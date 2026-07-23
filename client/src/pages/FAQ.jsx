import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import SEO from '../components/common/SEO';

const faqItems = [
  {
    q: "How long does a project usually take?",
    a: "Typically 2–3 months, depending on the level of detailing and customization involved in your project.",
    img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
    tag: "Timeline"
  },
  {
    q: "Do you provide turnkey interior solutions?",
    a: "Yes. Every project we take on, residential or commercial, is delivered turnkey, with design, materials, execution, and finishing handled entirely by our team.",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    tag: "Services"
  },
  {
    q: "What is your consultation process?",
    a: "We begin with a free consultation to understand your space, requirements, and vision, before moving into detailed design and planning.",
    img: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
    tag: "Process"
  },
  {
    q: "Which locations do you currently serve?",
    a: "We're proudly based in Hyderabad and have delivered residential and commercial projects across the city.",
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    tag: "Location"
  },
  {
    q: "How can customers request a quotation?",
    a: "Simply fill out our contact form on the website, and our team will get back to you to discuss your project.",
    img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    tag: "Pricing"
  },
  {
    q: "Do you sell materials separately from design services?",
    a: "Yes. Our materials including WPC panels, polygranite sheets, acrylic sheets, and more are available for standalone purchase, without needing to book a full design or execution project with us.",
    img: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    tag: "Materials"
  },
  {
    q: "Do I need to be involved throughout the project, or can it be handled remotely?",
    a: "We keep you informed at every key stage with regular updates and site visits, so you're never left in the dark, but you don't need to manage day-to-day execution yourself. That's what turnkey means.",
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
    tag: "Involvement"
  },
  {
    q: "What if I already have a design in mind, can you just execute it?",
    a: "Absolutely. Whether you come with a finalized design or need us to design from scratch, we can adapt to execution-only or full design-and-build depending on what you need.",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    tag: "Custom"
  },
  {
    q: "Can I customize designs, or do you offer fixed packages?",
    a: "Every project is fully customized around your space and preferences — we don't work off fixed templates or set packages.",
    img: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80",
    tag: "Design"
  },
  {
    q: "What happens if something needs repair after project completion?",
    a: "Any issues within our warranty period are addressed directly by our team. Reach out through the contact form and we'll take care of it.",
    img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    tag: "Support"
  }
];

/* ── Floating Particle ─────────────────────────────────────────────────── */
const Particle = ({ x, y, size, delay, duration, color }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ left: x, top: y, width: size, height: size, background: color }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 0.6, 0],
      scale: [0, 1.2, 0],
      y: [0, -80, -160],
      x: [0, Math.random() * 40 - 20, Math.random() * 80 - 40],
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      ease: "easeOut",
    }}
  />
);

/* ── 3D Tilt Card ─────────────────────────────────────────────────────── */
const TiltCard = ({ children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouse = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ── Magnetic Item ─────────────────────────────────────────────────────── */
const MagneticItem = ({ children, className, onClick, isOpen, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouse = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.08;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.08;
    x.set(dx);
    y.set(dy);
  }, [x, y]);

  return (
    <motion.div
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      initial={{ opacity: 0, x: 60, rotateY: 15 }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      animate={{
        backgroundColor: isOpen ? 'rgba(197,165,114,0.06)' : 'transparent',
        borderRadius: isOpen ? '16px' : '0px',
        scale: isOpen ? 1.02 : 1,
        boxShadow: isOpen
          ? '0 0 0 1.5px rgba(197,165,114,0.4), 0 20px 60px -20px rgba(197,165,114,0.3)'
          : '0 0 0 0px transparent',
      }}
      whileHover={{ scale: isOpen ? 1.02 : 1.015 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

/* ── Glowing number badge ─────────────────────────────────────────────── */
const Badge = ({ num, isOpen }) => (
  <motion.span
    className="shrink-0 font-sans text-[10px] font-bold tracking-widest uppercase rounded-full px-2.5 py-1 mt-0.5"
    animate={{
      background: isOpen
        ? 'linear-gradient(135deg, #c5a572 0%, #a07845 100%)'
        : 'rgba(0,0,0,0.06)',
      color: isOpen ? '#fff' : '#9ca3af',
      boxShadow: isOpen
        ? '0 0 12px rgba(197,165,114,0.6), 0 0 24px rgba(197,165,114,0.3)'
        : '0 0 0 transparent',
    }}
    transition={{ duration: 0.4 }}
  >
    {String(num + 1).padStart(2, '0')}
  </motion.span>
);

/* ── Main FAQ Component ─────────────────────────────────────────────────── */
const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [particles, setParticles] = useState([]);
  const autoCloseRef = useRef(null);

  // Generate particles
  useEffect(() => {
    setParticles(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${40 + Math.random() * 60}%`,
        size: Math.random() * 5 + 2,
        delay: Math.random() * 4,
        duration: Math.random() * 4 + 4,
        color: i % 3 === 0
          ? 'rgba(197,165,114,0.5)'
          : i % 3 === 1
          ? 'rgba(197,165,114,0.25)'
          : 'rgba(160,120,69,0.3)',
      }))
    );
  }, []);

  // Auto-advance image slider
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % faqItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    return () => { if (autoCloseRef.current) clearTimeout(autoCloseRef.current); };
  }, []);

  const toggleFAQ = (index) => {
    if (autoCloseRef.current) { clearTimeout(autoCloseRef.current); autoCloseRef.current = null; }
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
      setActiveImageIdx(index);
      autoCloseRef.current = setTimeout(() => setOpenIndex(null), 6000);
    }
  };

  return (
    <div className="relative bg-[#F8F5F0] min-h-screen pt-24 pb-14 overflow-hidden">
      <SEO
        title="FAQ — ESPACIO Interiors"
        description="Frequently asked questions about design process, timeline, turnkey execution, and custom materials by ESPACIO."
        url="/faqs"
      />

      {/* ── Animated grain / noise overlay ── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px',
        }}
      />

      {/* ── Large ambient gold gradient orb ── */}
      <motion.div
        className="pointer-events-none absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(197,165,114,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute bottom-0 -left-20 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(197,165,114,0.08) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* ── Floating Particles ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {particles.map((p) => (
          <Particle key={p.id} {...p} />
        ))}
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12">

        {/* ── Page Header ── */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-ink text-bg px-5 py-2 rounded-full text-[11px] font-semibold tracking-widest uppercase mb-4 shadow-lg"
            animate={{ boxShadow: ['0 0 0 0 rgba(197,165,114,0)', '0 0 0 8px rgba(197,165,114,0.15)', '0 0 0 0 rgba(197,165,114,0)'] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <motion.span
              className="w-2 h-2 rounded-full bg-gold"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            Frequently Asked
          </motion.div>

          <motion.h1
            className="font-display text-[clamp(36px,5vw,72px)] font-medium leading-[1.08] tracking-tight text-ink"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Got{' '}
            <motion.span
              className="relative inline-block"
              style={{ color: 'transparent', WebkitTextStroke: '1.5px #c5a572' }}
              whileHover={{ WebkitTextStroke: '0px', color: '#c5a572' }}
              transition={{ duration: 0.3 }}
            >
              Questions?
            </motion.span>
            <br />We Have Answers.
          </motion.h1>

          <motion.p
            className="font-sans text-[15px] text-ink-soft mt-5 max-w-[520px] mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            Everything you need to know about working with ESPACIO — from first call to final handover.
          </motion.p>
        </motion.div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* ── LEFT: Sticky 3D Image + Tag Cloud ── */}
          <div className="lg:col-span-4 max-w-[380px] lg:max-w-none mx-auto lg:mx-0">
            <motion.div
              className="lg:sticky lg:top-[120px]"
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* 3D Tilt Image Card */}
              <TiltCard className="relative w-full">
                <div className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] min-h-[440px] lg:min-h-[520px] w-full overflow-hidden rounded-[28px] shadow-2xl bg-stone-100 cursor-pointer">
                  <AnimatePresence mode="sync">
                    <motion.img
                      key={activeImageIdx}
                      src={faqItems[activeImageIdx].img}
                      alt={faqItems[activeImageIdx].q}
                      initial={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 0.96, filter: 'blur(6px)' }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Active tag */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeImageIdx}
                      className="absolute bottom-5 left-5 right-5"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="inline-block bg-gold/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-2">
                        {faqItems[activeImageIdx].tag}
                      </span>
                      <p className="text-white font-display text-[16px] font-medium leading-snug line-clamp-2">
                        {faqItems[activeImageIdx].q}
                      </p>
                    </motion.div>
                  </AnimatePresence>

                  {/* Gloss shimmer */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)',
                      backgroundSize: '200% 100%',
                    }}
                    animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
                  />
                </div>

                {/* Floating 3D layer depth effect */}
                <div
                  className="absolute -inset-3 rounded-[36px] -z-10 opacity-30 blur-xl"
                  style={{ background: 'linear-gradient(135deg, #c5a572, #a07845)' }}
                />
              </TiltCard>

              {/* Progress dots */}
              <div className="flex justify-center gap-1.5 mt-6">
                {faqItems.map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => { setActiveImageIdx(i); if (openIndex !== i) setOpenIndex(null); }}
                    className="h-1.5 rounded-full bg-ink/20 transition-all"
                    animate={{ width: activeImageIdx === i ? 24 : 6, background: activeImageIdx === i ? '#c5a572' : 'rgba(0,0,0,0.15)' }}
                    transition={{ duration: 0.4 }}
                  />
                ))}
              </div>

              {/* Tag cloud */}
              <div className="flex flex-wrap gap-2 mt-8 justify-center">
                {faqItems.map((item, i) => (
                  <motion.button
                    key={i}
                    onClick={() => toggleFAQ(i)}
                    className="font-sans text-[11px] font-semibold tracking-wider uppercase px-3 py-1.5 rounded-full border transition-all duration-300"
                    animate={{
                      borderColor: openIndex === i ? '#c5a572' : 'rgba(0,0,0,0.12)',
                      background: openIndex === i ? 'rgba(197,165,114,0.12)' : 'transparent',
                      color: openIndex === i ? '#c5a572' : '#9ca3af',
                      scale: openIndex === i ? 1.05 : 1,
                    }}
                    whileHover={{ scale: 1.08, borderColor: '#c5a572' }}
                    transition={{ duration: 0.25 }}
                  >
                    {item.tag}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: FAQ Accordion ── */}
          <div className="lg:col-span-8 flex flex-col justify-start lg:pt-4">
            <div className="border-t border-ink/10">
              {faqItems.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <MagneticItem
                    key={idx}
                    index={idx}
                    isOpen={isOpen}
                    className="border-b border-ink/10 px-3 py-3.5 cursor-pointer transition-colors"
                    onClick={() => toggleFAQ(idx)}
                  >
                    <button className="w-full flex items-start gap-4 text-left group bg-transparent border-0 cursor-pointer py-1">
                      {/* Animated badge */}
                      <Badge num={idx} isOpen={isOpen} />

                      {/* Question text */}
                      <motion.span
                        className="font-sans text-[15px] md:text-[16px] font-medium leading-snug flex-1"
                        animate={{ color: isOpen ? '#c5a572' : '#101014' }}
                        transition={{ duration: 0.3 }}
                      >
                        {faq.q}
                      </motion.span>

                      {/* Animated chevron */}
                      <motion.div
                        className="shrink-0 mt-0.5 w-7 h-7 rounded-full flex items-center justify-center border"
                        animate={{
                          borderColor: isOpen ? '#c5a572' : 'rgba(0,0,0,0.12)',
                          background: isOpen ? '#c5a572' : 'transparent',
                          rotate: isOpen ? 180 : 0,
                          boxShadow: isOpen ? '0 0 12px rgba(197,165,114,0.5)' : '0 0 0 transparent',
                        }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <motion.path
                            d="M2 4L5.5 7.5L9 4"
                            stroke={isOpen ? 'white' : '#9ca3af'}
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.div>
                    </button>

                    {/* Answer panel */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0, y: -10 }}
                          animate={{ height: 'auto', opacity: 1, y: 0 }}
                          exit={{ height: 0, opacity: 0, y: -10 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <motion.div
                            className="pl-10 pr-4 pb-4 pt-2"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                          >
                            {/* Gold accent bar */}
                            <div className="flex gap-3 items-start">
                              <motion.div
                                className="w-0.5 rounded-full bg-gold shrink-0 mt-1"
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                transition={{ duration: 0.4, delay: 0.15 }}
                                style={{ minHeight: 40 }}
                              />
                              <p className="font-sans text-[13.5px] text-walnut leading-relaxed">
                                {faq.a}
                              </p>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Ripple on open */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          className="absolute inset-0 rounded-[16px] pointer-events-none"
                          initial={{ opacity: 0.4, scale: 0.95 }}
                          animate={{ opacity: 0, scale: 1.04 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.6 }}
                          style={{ border: '1.5px solid rgba(197,165,114,0.6)', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                        />
                      )}
                    </AnimatePresence>
                  </MagneticItem>
                );
              })}
            </div>

            {/* CTA at bottom */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <p className="font-sans text-[14px] text-ink-soft mb-5">
                Still have questions? We're happy to help.
              </p>
              <motion.a
                href="/contact"
                className="inline-flex items-center gap-2 bg-ink text-bg font-sans text-[13px] font-semibold uppercase tracking-widest px-7 py-3.5 rounded-full"
                whileHover={{ scale: 1.05, boxShadow: '0 0 0 4px rgba(197,165,114,0.3)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
              >
                Contact Us
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  →
                </motion.span>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
