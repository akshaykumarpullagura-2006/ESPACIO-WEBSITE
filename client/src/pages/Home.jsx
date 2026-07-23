import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import SEO from '../components/common/SEO';
import Logo from '../components/common/Logo';
import DecryptedText from '../components/ui/DecryptedText';
import { StickyScroll } from '../components/ui/sticky-scroll-reveal';
import { HeroParallax } from '../components/ui/hero-parallax';
import Testimonials from '../components/ui/Testimonials';

const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
};

/* ── Magnetic Item for FAQ ──────────────────────────────────────────────── */
const MagneticItem = ({ children, className, onClick, isOpen }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 25 });
  const ref = useRef(null);

  const handleMouse = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 1000 }}
      className={className}
      whileHover={{ scale: isOpen ? 1.02 : 1.015 }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

/* ── Glowing number badge for FAQ ────────────────────────────────────────── */
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

const AUTO_SCROLL_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=600&q=80'
];

const AutoScrollingInteriorBox = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % AUTO_SCROLL_IMAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-[4/5] rounded-[24px] overflow-hidden shadow-lg border border-black/10">
      <AnimatePresence initial={false}>
        <motion.img
          key={index}
          src={AUTO_SCROLL_IMAGES[index]}
          alt="ESPACIO Luxury Interior Style"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
    </div>
  );
};

const teamProjectsData = [
  {
    projectImg: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
    memberImg: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    name: "Sarah Jenkins",
    role: "Principal Designer",
    projectLabel: "Banjara Hills Villa"
  },
  {
    projectImg: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80",
    memberImg: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    name: "Marcus Chen",
    role: "Kitchen Specialist",
    projectLabel: "Italian Kitchen Fitout"
  },
  {
    projectImg: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    memberImg: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    name: "Vikram Malhotra",
    role: "Structural Lead",
    projectLabel: "Jubilee Hills Penthouse"
  },
  {
    projectImg: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
    memberImg: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    name: "Elena Rostova",
    role: "Workspace Director",
    projectLabel: "Gachibowli Tech Hub"
  }
];

const TeamProjectsShowcase = () => {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const INTERVAL = 1981;

  const startProgress = () => {
    setProgress(0);
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const pct = Math.min(((ts - start) / INTERVAL) * 100, 100);
      setProgress(pct);
      if (pct < 100) progressRef.current = requestAnimationFrame(tick);
    };
    if (progressRef.current) cancelAnimationFrame(progressRef.current);
    progressRef.current = requestAnimationFrame(tick);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    startProgress();
    timerRef.current = setInterval(() => {
      setDirection(1);
      setIdx((prev) => (prev + 1) % teamProjectsData.length);
      startProgress();
    }, INTERVAL);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) cancelAnimationFrame(progressRef.current);
    };
  }, []);

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setDirection(1);
    setIdx((prev) => (prev + 1) % teamProjectsData.length);
    resetTimer();
  };

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setDirection(-1);
    setIdx((prev) => (prev - 1 + teamProjectsData.length) % teamProjectsData.length);
    resetTimer();
  };

  const current = teamProjectsData[idx];

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? '60%' : '-60%',
      opacity: 0,
      scale: 1.08,
      filter: 'blur(6px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    },
    exit: (dir) => ({
      x: dir < 0 ? '40%' : '-40%',
      opacity: 0,
      scale: 0.96,
      filter: 'blur(4px)',
    }),
  };

  return (
    <div className="relative w-[85%] sm:w-[80%] mx-auto aspect-[4/3.2] group">

      {/* ── Main Card ── */}
      <div className="w-full h-full rounded-[24px] overflow-hidden shadow-2xl border border-ink-border/10 relative z-10">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={`proj-${idx}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.35,
              ease: [0.25, 0.46, 0.45, 0.94],
              opacity: { duration: 0.25 },
              filter: { duration: 0.3 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={(e, info) => {
              if (info.offset.x < -50) handleNext();
              else if (info.offset.x > 50) handlePrev();
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing select-none"
          >
            {/* Ken Burns zoom-pan */}
            <motion.img
              src={current.projectImg}
              alt={current.projectLabel}
              className="w-full h-full object-cover select-none pointer-events-none"
              draggable="false"
              initial={{ scale: 1.12, x: '2%' }}
              animate={{ scale: 1.0, x: '0%' }}
              transition={{ duration: INTERVAL / 1000 + 0.5, ease: 'linear' }}
            />

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

            {/* Gloss shimmer sweep */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.07) 50%, transparent 65%)',
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ duration: 1.6, ease: 'linear', repeat: Infinity, repeatDelay: 0.4 }}
            />

            {/* Animated label badge */}
            <motion.div
              className="absolute bottom-4 right-4 bg-black/75 backdrop-blur-md !text-white group-hover:text-white text-[11px] uppercase tracking-widest px-4 py-2 rounded-full font-bold border border-white/20 z-20 shadow-md flex items-center gap-1.5 select-none"
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-gold"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <span className="!text-white group-hover:text-white">{current.projectLabel}</span>
            </motion.div>


          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/10 z-30">
          <motion.div
            className="h-full bg-gold"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0 }}
          />
        </div>
      </div>

      {/* ── Dot indicators ── */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {teamProjectsData.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => { setDirection(i > idx ? 1 : -1); setIdx(i); resetTimer(); }}
            className="rounded-full bg-ink/20 transition-all"
            animate={{ width: i === idx ? 20 : 6, background: i === idx ? '#c5a572' : 'rgba(0,0,0,0.18)' }}
            style={{ height: 6 }}
            transition={{ duration: 0.35 }}
          />
        ))}
      </div>

      {/* ── Nav Buttons ── */}
      <motion.button
        onClick={handlePrev}
        whileHover={{ scale: 1.12, backgroundColor: 'white', color: '#101014' }}
        whileTap={{ scale: 0.95 }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-white flex items-center justify-center transition-colors duration-300 shadow-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        transition={{ duration: 0.2 }}
        aria-label="Previous Project"
      >
        <motion.span
          className="text-[14px]"
          animate={{ x: [0, -2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >←</motion.span>
      </motion.button>

      <motion.button
        onClick={handleNext}
        whileHover={{ scale: 1.12, backgroundColor: 'white', color: '#101014' }}
        whileTap={{ scale: 0.95 }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full border border-white/10 bg-black/40 backdrop-blur-md text-white flex items-center justify-center transition-colors duration-300 shadow-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        transition={{ duration: 0.2 }}
        aria-label="Next Project"
      >
        <motion.span
          className="text-[14px]"
          animate={{ x: [0, 2, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >→</motion.span>
      </motion.button>

    </div>
  );
};


const AnimatedCounter = ({ value, duration = 0.8 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.1 });

  const hasNumbers = /[0-9]/.test(value);

  useEffect(() => {
    if (!inView) {
      setCount(0);
      return;
    }
    if (!hasNumbers) {
      return;
    }

    const end = parseInt(value.replace(/\D/g, ''), 10);
    let startTime = null;
    let animationFrameId = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Ease out quad: f(t) = t * (2 - t)
      const easedProgress = progress * (2 - progress);
      
      const currentCount = Math.floor(easedProgress * end);
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [inView, value, duration, hasNumbers]);

  if (!hasNumbers) {
    return (
      <span ref={ref} className="font-display">
        {value}
      </span>
    );
  }

  const suffix = value.replace(/[0-9]/g, '');

  return (
    <span ref={ref} className="font-display">
      {count}
      {suffix}
    </span>
  );
};


const statsData = [
  {
    value: "25+",
    label: "Projects Completed",
    progressWidth: "60%",
    dots: [true, false, false]
  },
  {
    value: "100+",
    label: "Happy Clients (including materials clients)",
    progressWidth: "80%",
    dots: [false, true, false]
  },
  {
    value: "40+",
    label: "Years Combined Legacy",
    progressWidth: "90%",
    dots: [false, false, true]
  }
];

const faqListVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const faqItemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=90',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=90',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=90'
];

const Home = () => {
  const [projects, setProjects] = useState([]);
  const heroRef = useRef(null);
  const faqSectionRef = useRef(null);
  const [openFaqIdx, setOpenFaqIdx] = useState(null);
  const [showIntro, setShowIntro] = useState(() => !sessionStorage.getItem('espacio_intro_played'));
  const [hoveredStatIdx, setHoveredStatIdx] = useState(null);


  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('espacio_intro_played', 'true');
  };

  useEffect(() => {
    if (sessionStorage.getItem('espacio_intro_played')) {
      return;
    }
    // Safety fallback timer if onComplete doesn't fire (e.g. background tab)
    const timer = setTimeout(() => {
      handleIntroComplete();
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const faqData = [
    {
      q: "How long does a project usually take?",
      a: "Typically 2–3 months, depending on the level of detailing and customization involved in your project."
    },
    {
      q: "Do you provide turnkey interior solutions?",
      a: "Yes. Every project we take on, residential or commercial, is delivered turnkey, with design, materials, execution, and finishing handled entirely by our team."
    },
    {
      q: "What is your consultation process?",
      a: "We begin with a free consultation to understand your space, requirements, and vision, before moving into detailed design and planning."
    },
    {
      q: "Which locations do you currently serve?",
      a: "We're proudly based in Hyderabad and have delivered residential and commercial projects across the city."
    },
    {
      q: "How can customers request a quotation?",
      a: "Simply fill out our contact form on the website, and our team will get back to you to discuss your project."
    },
    {
      q: "Do you sell materials separately from design services?",
      a: "Yes. Our materials including WPC panels, polygranite sheets, acrylic sheets, and more are available for standalone purchase, without needing to book a full design or execution project with us."
    },
    {
      q: "Do I need to be involved throughout the project, or can it be handled remotely?",
      a: "We keep you informed at every key stage with regular updates and site visits, so you're never left in the dark, but you don't need to manage day-to-day execution yourself. That's what turnkey means."
    },
    {
      q: "What if I already have a design in mind, can you just execute it?",
      a: "Absolutely. Whether you come with a finalized design or need us to design from scratch, we can adapt to execution-only or full design-and-build depending on what you need."
    },
    {
      q: "Can I customize designs, or do you offer fixed packages?",
      a: "Every project is fully customized around your space and preferences — we don't work off fixed templates or set packages."
    },
    {
      q: "What happens if something needs repair after project completion?",
      a: "Any issues within our warranty period are addressed directly by our team. Reach out through the contact form and we'll take care of it."
    }
  ];

  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIdx((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Page-level scroll for subtle parallax on the background image
  const { scrollYProgress } = useScroll();
  const bgScale = useTransform(scrollYProgress, [0, 0.2], [1.05, 0.97]);
  const bgY     = useTransform(scrollYProgress, [0, 0.2], ['0%', '6%']);

  // Hero exit scroll animation (scales down and fades as user scrolls past it)
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroExitScale = useTransform(heroScroll, [0, 1], [1, 0.85]);
  const heroExitOpacity = useTransform(heroScroll, [0, 1], [1, 0]);
  const heroExitY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);

  useEffect(() => {
    axios.get('/projects?limit=6&featured=true')
      .then(r => { if (r.data.success) setProjects(r.data.data); })
      .catch(() => {});
  }, []);

  const mockProjects = [
    { 
      title: 'The Lakeside Sanctuary', location: 'Banjara Hills', category: 'Villa', 
      heroImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=85', 
      slug: 'lakeside-sanctuary' 
    },
    { 
      title: 'Modernist Penthouse', location: 'Jubilee Hills', category: 'Apartment', 
      heroImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85', 
      slug: 'modernist-penthouse' 
    },
    { 
      title: 'Executive Office Hub', location: 'HITEC City', category: 'Commercial', 
      heroImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=85', 
      slug: 'exec-office' 
    },
    { 
      title: 'The Lumen Apartment', location: 'Gachibowli', category: 'Apartment', 
      heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85', 
      slug: 'lumen-apartment' 
    },
    { 
      title: 'Slate Residence', location: 'Kondapur', category: 'Luxury Home', 
      heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85', 
      slug: 'slate-residence' 
    },
    { 
      title: 'The Granite Villa', location: 'Shamshabad', category: 'Villa', 
      heroImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=85', 
      slug: 'granite-villa' 
    },
  ];

  const displayProjects = projects.length > 0 ? projects : mockProjects;

  const stickyContent = displayProjects.slice(0, 6).map((p) => ({
    title: p.title,
    description: (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-sans text-[12px] lg:text-[13px] font-bold uppercase tracking-widest text-gold">{p.category}</span>
          <span className="text-ink-soft/40">•</span>
          <span className="font-sans text-[13px] lg:text-[14px] text-ink-soft font-medium">{p.location}</span>
        </div>
        <p className="font-sans text-[15px] lg:text-[17px] text-ink-soft leading-relaxed font-normal">
          A luxury {p.category.toLowerCase()} interior design in {p.location}. ESPACIO redefines living spaces through premium material integration and custom modular craftsmanship.
        </p>
        <Link 
          to={`/projects/${p.slug}`}
          className="inline-flex items-center gap-2 font-sans text-[13px] lg:text-[14px] font-bold uppercase tracking-wider text-gold hover:text-gold/80 transition-colors pt-2"
        >
          View Case Study <ArrowUpRight size={15} />
        </Link>
      </div>
    ),
    content: (
      <Link to={`/projects/${p.slug}`} className="block h-full w-full relative overflow-hidden group cursor-pointer">
        <img
          src={p.heroImage}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          alt={p.title}
        />
      </Link>
    )
  }));


  const parallaxProducts = [
    {
      title: "Lakeside Villa Interior",
      category: "Residential Villa",
      link: "/projects/lakeside-sanctuary",
      thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Italian Modular Kitchen",
      category: "Modular Kitchen",
      link: "/what-we-do/modular-kitchen",
      thumbnail: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Jubilee Hills Penthouse",
      category: "Penthouse Apartment",
      link: "/projects/modernist-penthouse",
      thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Corporate Office Hub",
      category: "Commercial Fitout",
      link: "/projects/exec-office",
      thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Bespoke Dining Hall",
      category: "Residential Space",
      link: "/what-we-do",
      thumbnail: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "The Lumen Suite",
      category: "Luxury Apartment",
      link: "/projects/lumen-apartment",
      thumbnail: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Slate Living Room",
      category: "Residential Living",
      link: "/projects/slate-residence",
      thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Executive Conference Room",
      category: "Commercial Office",
      link: "/projects/exec-office",
      thumbnail: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Contemporary Bedroom Design",
      category: "Bespoke Bedroom",
      link: "/what-we-do",
      thumbnail: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Cozy Open Floor Studio",
      category: "Luxury Apartment",
      link: "/projects",
      thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Fluted Panel Accent Hall",
      category: "Residential Space",
      link: "/what-we-do",
      thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Luxury Washroom Suite",
      category: "Bespoke Bath",
      link: "/what-we-do",
      thumbnail: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Corporate Reception Lounge",
      category: "Commercial Space",
      link: "/projects",
      thumbnail: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Vibrant Lounge Living Room",
      category: "Residential Space",
      link: "/what-we-do",
      thumbnail: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Panoramic Penthouse Lounge",
      category: "Luxury Penthouse",
      link: "/projects",
      thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Luxury Living Room",
      category: "Luxury Apartment",
      link: "/projects/lumen-apartment",
      thumbnail: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Marble Dining Area",
      category: "Residential Dining",
      link: "/what-we-do",
      thumbnail: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Master Suite Sanctuary",
      category: "Bespoke Bedroom",
      link: "/what-we-do",
      thumbnail: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Sleek Workspace Studio",
      category: "Commercial Office",
      link: "/projects/exec-office",
      thumbnail: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Minimalist Walk-in Closet",
      category: "Residential Space",
      link: "/what-we-do",
      thumbnail: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Designer Penthouse Terrace",
      category: "Luxury Penthouse",
      link: "/projects",
      thumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Cozy Fireplace Den",
      category: "Residential Space",
      link: "/what-we-do",
      thumbnail: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Bespoke Wine Cellar",
      category: "Luxury Home",
      link: "/projects",
      thumbnail: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Luxury Bathroom Oasis",
      category: "Bespoke Bath",
      link: "/what-we-do",
      thumbnail: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80",
    },
  ];

  return (
    <div className="bg-bg overflow-x-clip">
      <SEO title="Premium Interior Design, Hyderabad" description="ESPACIO is Hyderabad's premier interior design studio. Full-home interiors, modular kitchens, commercial offices, and premium material supply." url="/" />

      {/* Premium Fullscreen Logo Intro Preloader */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ 
              y: '-100%',
              transition: { duration: 2.2, ease: [0.16, 1, 0.3, 1] }
            }}
            className="fixed inset-0 bg-bg-dark z-[9999] flex flex-col items-center justify-center cursor-pointer select-none"
            onClick={() => setShowIntro(false)}
          >
            <motion.div
              initial={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ 
                opacity: 0,
                y: -180,
                scale: 0.8,
                transition: { duration: 1.9, ease: [0.16, 1, 0.3, 1] }
              }}
              className="flex flex-col items-center"
            >
              <Logo scrolled={false} size="large" onComplete={handleIntroComplete} />
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.25 }}
              transition={{ delay: 2.3, duration: 1 }}
              className="absolute bottom-12 font-sans text-[10px] text-white uppercase tracking-[0.25em]"
            >
              Click to skip
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 1. HERO (Rounded Card — matches Services) ── */}
      <section ref={heroRef} className="relative h-[90vh] lg:h-[95vh] min-h-[640px] lg:min-h-0 px-5 pt-5 pb-2 lg:px-12 z-0">
        {/* Rounded card — fills the section */}
        <motion.div
          style={{ scale: heroExitScale, opacity: heroExitOpacity, y: heroExitY }}
          className="relative w-full h-full overflow-hidden will-change-transform rounded-[24px] lg:rounded-[40px] origin-top"
        >
          {/* Background Image Layer */}
          <motion.div 
            style={{ scale: bgScale, y: bgY }}
            className="absolute inset-0 will-change-transform overflow-hidden"
            initial={{ opacity: 0, scale: 1.15 }}
            animate={showIntro ? { opacity: 0, scale: 1.15 } : { opacity: 1, scale: 1.05 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={currentImageIdx}
                src={HERO_IMAGES[currentImageIdx]}
                alt="ESPACIO Luxury Background"
                initial={{ x: '15%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '-15%', opacity: 0 }}
                transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1] }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/5 z-10" />
          </motion.div>

          {/* ─── Foreground Glass Cards (pinned to bottom) ─── */}
          <div className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none">
              <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 pb-8 md:pb-14 lg:pb-10 pointer-events-auto">
              
              <motion.div 
                className="flex flex-col lg:flex-row items-end gap-4 lg:gap-6"
                initial="hidden"
                animate={showIntro ? "hidden" : "visible"}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.22,
                      delayChildren: 0.15
                    }
                  }
                }}
              >

                {/* ─── LEFT: Craft Card ─── */}
                <motion.div
                  className="w-full max-w-[290px] sm:max-w-[345px] mx-auto lg:mx-0 lg:max-w-[345px]"
                >
                  <motion.div 
                    className="relative rounded-[20px] md:rounded-[26px] overflow-hidden border border-white/15 shadow-2xl"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(24px)',
                      WebkitBackdropFilter: 'blur(24px)',
                    }}
                    variants={{
                      hidden: { opacity: 0, y: 35 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] }
                      }
                    }}
                  >
                    {/* Top glass highlight */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                    
                    <div className="p-4 sm:p-5.5 md:p-6">
                      {/* Large interior thumbnail - slides in sync with background */}
                      <div className="w-full aspect-[16/10] sm:aspect-[16/9] rounded-[14px] overflow-hidden mb-5 relative">
                        <AnimatePresence initial={false}>
                          <motion.img
                            key={currentImageIdx}
                            src={HERO_IMAGES[currentImageIdx]}
                            alt="Luxury interior showcase"
                            initial={{ x: '15%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '-15%', opacity: 0 }}
                            transition={{ duration: 1.6, ease: [0.25, 1, 0.5, 1] }}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </AnimatePresence>
                      </div>

                      {/* Headline */}
                      <h2 className="font-display text-[28px] sm:text-[36px] lg:text-[32px] font-semibold leading-tight tracking-tight text-white mb-6 text-center">
                        We Craft the Future Dwelling
                      </h2>

                      {/* Bottom Row */}
                      <div className="flex items-center justify-center">
                        <Link 
                          to="/projects"
                          className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/15 backdrop-blur-md px-5 py-2.5 text-[11px] md:text-[12px] font-bold text-white hover:bg-white hover:text-[#101014] shadow-md transition-all duration-300 shrink-0"
                        >
                          {/* Sizing span (invisible, sets exact container width for Discover Our Works ↗) */}
                          <span className="inline-flex items-center gap-1.5 opacity-0 pointer-events-none select-none whitespace-nowrap">
                            <span>Discover Our Works</span>
                            <ArrowUpRight size={14} className="shrink-0" />
                          </span>

                          {/* Default State: Our Projects ↗ */}
                          <span className="absolute inset-0 flex items-center justify-center gap-1.5 transition-all duration-300 group-hover:-translate-y-full group-hover:opacity-0 text-white whitespace-nowrap">
                            <span>Our Projects</span>
                            <ArrowUpRight size={14} className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </span>

                          {/* Hover State: Discover Our Works ↗ */}
                          <span className="absolute inset-0 flex items-center justify-center gap-1.5 transition-all duration-300 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 text-[#101014] font-bold whitespace-nowrap">
                            <span style={{ color: '#101014' }}>Discover Our Works</span>
                            <ArrowUpRight size={14} className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: '#101014', stroke: '#101014', strokeWidth: 2.5 }} />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* ─── RIGHT: Stats + Description ─── */}
                <motion.div
                  className="w-full lg:flex-1"
                >
                  <motion.div
                    className="flex flex-col gap-6 md:gap-8 w-full"
                    variants={{
                      hidden: { opacity: 0, y: 25 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: { duration: 1.3, ease: [0.16, 1, 0.3, 1] }
                      }
                    }}
                  >
                  
                  {/* Stats Row */}
                  <div className="hidden sm:flex flex-row gap-3 md:gap-4 justify-center lg:justify-end items-center h-26 translate-y-0 lg:-translate-y-10 mt-2 lg:mt-0">
                    {[
                      { val: '25+', desc: 'Projects Completed', hoverLabel: '25+ Projects Completed' },
                      { val: '1 Year', desc: 'Since 2025', hoverLabel: 'Established Since 2025' },
                      { val: '40+', desc: 'Years of Family Legacy', hoverLabel: '40+ Years of Family Construction Legacy' },
                    ].map((s, index) => {
                      const isHovered = hoveredStatIdx === index;
                      return (
                        <motion.div 
                          key={index} 
                          layout
                          onMouseEnter={() => setHoveredStatIdx(index)}
                          onMouseLeave={() => setHoveredStatIdx(null)}
                          onClick={() => setHoveredStatIdx(isHovered ? null : index)}
                          variants={{
                            hidden: { opacity: 0, y: 30, scale: 0.92 },
                            visible: {
                              opacity: 1,
                              y: 0,
                              scale: 1,
                              transition: {
                                type: 'spring',
                                stiffness: 100,
                                damping: 15,
                                delay: index * 0.12
                              }
                            }
                          }}
                          whileHover={{
                            scale: 1.02,
                            borderColor: 'rgba(255, 255, 255, 0.45)',
                            backgroundColor: 'rgba(255, 255, 255, 0.12)',
                            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.35)'
                          }}
                          className={`flex items-center rounded-[14px] md:rounded-[20px] border shadow-xl cursor-pointer transition-all duration-500 overflow-hidden ${
                            isHovered 
                              ? "flex-row justify-between w-[215px] sm:w-[255px] md:w-[300px] h-14 sm:h-18 md:h-20 px-4 md:px-5.5 border-white/35 bg-white/12" 
                              : "flex-col justify-center items-center w-[80px] sm:w-[90px] md:w-[100px] h-[70px] sm:h-[80px] md:h-[88px] border-white/15 bg-white/8 text-center px-2"
                          }`}
                          style={{
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                          }}
                        >
                          <AnimatePresence mode="wait">
                            {!isHovered ? (
                              <motion.div
                                key="normal"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 15 }}
                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-col items-center justify-center text-center w-full"
                              >
                                <span className="font-display font-semibold text-white leading-none tracking-tight text-[18px] sm:text-[22px] md:text-[26px] mb-1">
                                  {s.val}
                                </span>
                                <span className="font-sans text-[8px] sm:text-[9px] text-white/70 font-semibold uppercase tracking-[0.1em] leading-tight text-center max-w-full">
                                  {s.desc}
                                </span>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="hover"
                                initial={{ opacity: 0, y: -15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 15 }}
                                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                className="flex flex-row items-center justify-between w-full"
                              >
                                <span className="font-display font-semibold text-white text-[20px] sm:text-[24px] md:text-[30px] mr-1.5 leading-none">
                                  {s.val}
                                </span>
                                <div className="flex-1 flex justify-end">
                                  <div className="bg-white text-bg-dark rounded-[14px] px-3 py-1 sm:px-4 sm:py-1.5 text-[9px] sm:text-[11px] md:text-[12px] font-semibold text-center leading-tight shadow-md flex items-center justify-center max-w-[110px] sm:max-w-[130px] md:max-w-[150px]">
                                    {s.hoverLabel}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>



                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>

      {/* ── 2. INTRO TEXT (Concept-to-Handover Luxury Showcase) ── */}
      <section className="relative z-10 bg-bg w-full">
        <div className="py-12 px-6 md:px-12 max-w-[1440px] mx-auto overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Text & Story (lg:col-span-6) */}
          <div className="lg:col-span-6 space-y-8 text-left">
            
            <Reveal delay={0.1}>
              <h2 className="font-display text-[clamp(34px,4.2vw,56px)] font-medium leading-[1.1] tracking-tight text-ink">
                From Concept to Handover — ESPACIO Delivers Complete Interiors.
              </h2>
            </Reveal>
            
            <Reveal delay={0.2}>
              <p className="font-sans text-[15.5px] text-ink-soft leading-relaxed max-w-[520px]">
                We bring 40+ years of family construction heritage to luxury interior design. Every space we create is backed by structural thinking, premium materials sourced directly from our own warehouses, and meticulous execution.
              </p>
            </Reveal>
            
            <Reveal delay={0.3}>
              <Link to="/about" className="btn-sliding-cta-dark">
                <span className="btn-sliding-cta-dark-text-one">Our Story ↗</span>
                <span className="btn-sliding-cta-dark-text-two">Read More ↗</span>
              </Link>
            </Reveal>
          </div>
          
          {/* Right Column: Visual Team & Projects Showcase (lg:col-span-6) */}
          <div className="lg:col-span-6">
            <TeamProjectsShowcase />
          </div>
          
        </div>
        </div>
      </section>

      {/* ── 2.5 STATS GRID SECTION ── */}
      <section className="pb-12 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          {statsData.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="border border-ink-border/20 bg-bg rounded-[20px] p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px] w-full max-w-[550px] mx-auto lg:max-w-none lg:mx-0 group hover:border-gold hover:shadow-md transition-all duration-300"
            >
              {/* Top Row: Empty Left, Indicators Right */}
              <div className="flex justify-end items-center gap-1">
                {stat.dots.map((active, dIdx) => (
                  <span 
                    key={dIdx} 
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      active ? 'bg-ink' : 'bg-ink-border/30'
                    }`} 
                  />
                ))}
              </div>

              {/* Middle Row: Large Value Left */}
              <div className="flex items-baseline justify-between mt-3 mb-2">
                <h3 className={`font-display font-medium text-ink leading-none ${
                  stat.value.length > 5 ? 'text-[24px] md:text-[28px] tracking-tight' : 'text-[44px] md:text-[48px]'
                }`}>
                  <AnimatedCounter value={stat.value} />
                </h3>
                
                {/* Bottom Right Label */}
                <p className="font-sans text-[12.5px] font-semibold text-ink-soft text-right leading-snug max-w-[180px] select-none">
                  {stat.label}
                </p>
              </div>

              {/* Bottom Decorative Line */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-ink-border/10">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: stat.progressWidth }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: i * 0.1 }}
                  className={`h-full bg-ink ${i === 3 ? 'ml-auto' : ''}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* ── 4. PROJECTS GRID ────────────────────────────────────────────────── */}
      <section className="py-14 px-4 md:px-8 lg:px-12 max-w-[1720px] mx-auto border-t border-ink-border">
        <div className="flex items-end justify-between mb-6">
          <Reveal>
            <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-gold mb-4">Selected Work</p>
            <h2 className="font-display text-[clamp(26px,2.8vw,44px)] font-medium tracking-tight text-ink">Our Projects</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/projects" className="btn-sliding-cta-dark">
              <span className="btn-sliding-cta-dark-text-one">All Projects ↗</span>
              <span className="btn-sliding-cta-dark-text-two">View All ↗</span>
            </Link>
          </Reveal>
        </div>

        <Reveal>
          <StickyScroll content={stickyContent} />
        </Reveal>
      </section>


      {/* ── 5. SERVICES PARALLAX ────────────────────────────────────────────── */}
      <section className="border-t border-ink-border bg-bg-card/10">
        <HeroParallax products={parallaxProducts} />
      </section>





      {/* ── FAQ SECTION (Premium Resentii Animations) ── */}
      <motion.section
        ref={faqSectionRef}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="pt-6 pb-14 px-6 md:px-12 max-w-[1440px] mx-auto border-t border-ink-border"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-stretch relative">
          
          {/* Left Column Container (Stretches to allow sticky child) */}
          <div className="lg:col-span-5 relative h-full">
            {/* Sticky Content Wrapper */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:sticky lg:top-[120px] flex flex-col items-center text-center pb-10"
            >
              <div className="inline-flex items-center gap-1.5 bg-ink text-bg px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-wider uppercase mb-8 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                FAQ
              </div>

              <h2 className="font-display text-[clamp(28px,3.5vw,44px)] font-medium leading-[1.12] tracking-tight text-ink mb-5 text-center">
                <DecryptedText text="Got Questions?" animateOn="view" revealDirection="center" />
                <br />
                <DecryptedText text="We Have Answers." animateOn="view" revealDirection="center" />
              </h2>

              <p className="font-sans text-[14px] text-ink-soft leading-relaxed mb-2 max-w-[400px] mx-auto text-center">
                From first consultation to final installation, we know you want to understand exactly what to expect. Here's everything you need to know about working with ESPACIO.
              </p>

              {/* FAQ Portrait Auto-Scrolling Projects Carousel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="hidden lg:block w-full max-w-[400px] mt-6"
              >
                <AutoScrollingInteriorBox />
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column: FAQ Accordion List (Staggered Entrance) */}
          <motion.div
            variants={faqListVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="lg:col-span-7 flex flex-col justify-start"
          >
            <div className="border-t border-ink-border/20">
              {faqData.map((faq, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <MagneticItem
                    key={idx}
                    isOpen={isOpen}
                    className="border-b border-ink-border/20 px-4 py-6 cursor-pointer transition-all duration-300 relative"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
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
                              <p className="font-sans text-[14.5px] text-walnut leading-relaxed">
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
          </motion.div>
          
        </div>
      </motion.section>

      {/* Testimonials Marquee Section */}
      <Testimonials />

    </div>
  );
};

export default Home;
