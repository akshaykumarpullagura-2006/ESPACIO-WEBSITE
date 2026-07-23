import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import axios from 'axios';
import { Search, ArrowUpRight } from 'lucide-react';
import SEO from '../components/common/SEO';
import GooeyInput from '../components/ui/gooey-input';

const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}>
      {children}
    </motion.div>
  );
};

const heroImages = [
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=90',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=90',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=90',
];

const Projects = () => {
  const [projects, setProjects]               = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeFilter, setActiveFilter]       = useState('all');
  const [searchQuery, setSearchQuery]         = useState('');
  const [loading, setLoading]                 = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const heroRef = useRef(null);

  // Auto-cycle hero images every 3s
  useEffect(() => {
    const t = setInterval(() => setCurrentImageIdx(p => (p + 1) % heroImages.length), 3000);
    return () => clearInterval(t);
  }, []);

  // Page-level parallax (same as Home & Services)
  const { scrollYProgress } = useScroll();
  const bgScale = useTransform(scrollYProgress, [0, 0.2], [1.05, 0.97]);
  const bgY     = useTransform(scrollYProgress, [0, 0.2], ['0%', '6%']);
  const textY   = useTransform(scrollYProgress, [0, 0.15], ['0px', '-30px']);
  const textOp  = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const filterChips = [
    { label: 'All Projects',       value: 'all'        },
    { label: 'Villas',             value: 'villa'       },
    { label: 'Apartments',         value: 'apartment'   },
    { label: 'Commercial Offices', value: 'office'      },
    { label: 'Commercial',         value: 'commercial'  },
    { label: 'Renovations',        value: 'renovation'  },
    { label: 'Luxury Homes',       value: 'luxury_home' },
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/projects');
        if (response.data.success) {
          setProjects(response.data.data);
          setFilteredProjects(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Unsplash image pools for each category type to ensure realistic real-world images
  const unsplashPool = {
    villa: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ],
    apartment: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80'
    ],
    office: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=800&q=80'
    ],
    commercial: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'
    ],
    renovation: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'
    ],
    luxury_home: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ]
  };

  const categoriesList = ['villa', 'apartment', 'office', 'commercial', 'renovation', 'luxury_home'];
  const neighborhoods = ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Kondapur', 'HITEC City', 'Kokapet', 'Begumpet', 'Madhapur', 'Gandipet', 'Financial District'];
  const styles = ['Japandi Minimal', 'Warm Editorial', 'Clean Contemporary', 'Luxury Architectural', 'Scandinavian Crafted', 'Modern Classic', 'Warm Contemporary', 'Industrial Editorial'];

  const generatedMockProjects = [];
  categoriesList.forEach((cat) => {
    for (let index = 0; index < 8; index++) {
      const hood = neighborhoods[(cat.charCodeAt(0) + index) % neighborhoods.length];
      const style = styles[(cat.charCodeAt(1) + index) % styles.length];
      const year = 2023 + (index % 3);
      
      const label = cat === 'luxury_home' ? 'Residence' : cat.charAt(0).toUpperCase() + cat.slice(1);
      const title = `${style} ${label} ${index + 1}`;
      
      const heroImage = unsplashPool[cat][index % 8];
      const slug = `${cat}-${index + 1}`;
      
      generatedMockProjects.push({
        title,
        location: `${hood}, Hyd`,
        category: cat,
        style,
        heroImage,
        slug,
        year
      });
    }
  });

  const mockProjects = generatedMockProjects;

  const sourceData = projects.length > 0 ? projects : mockProjects;

  useEffect(() => {
    let result = sourceData;
    if (activeFilter !== 'all') result = result.filter(p => p.category === activeFilter);
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.style?.toLowerCase().includes(q)
      );
    }
    setFilteredProjects(result);
  }, [activeFilter, searchQuery, projects]);

  return (
    <div className="bg-bg overflow-x-hidden">
      <SEO
        title="Portfolio & Case Studies — ESPACIO"
        description="Browse ESPACIO's luxury portfolio. Apartments, Independent Villas, Penthouse projects, and commercial offices executed to perfection in Hyderabad."
        url="/projects"
      />

      {/* ── ROUNDED CARD HERO (same as Home & Services) ── */}
      <section
        ref={heroRef}
        className="relative h-[80vh] lg:h-[95vh] px-5 pt-5 pb-[10px] lg:px-12"
      >
        <div
          className="relative w-full h-full overflow-hidden will-change-transform rounded-[24px] lg:rounded-[40px]"
        >
          {/* Parallax background + auto-cycling images */}
          <motion.div
            style={{ scale: bgScale, y: bgY }}
            className="absolute inset-0 will-change-transform overflow-hidden"
          >
            <AnimatePresence initial={false}>
              <motion.img
                key={currentImageIdx}
                src={heroImages[currentImageIdx]}
                alt="ESPACIO Projects"
                initial={{ x: '15%', opacity: 0 }}
                animate={{ x: 0,     opacity: 1 }}
                exit={{ x: '-15%',   opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
          </motion.div>

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 to-transparent z-10 pointer-events-none" />

          {/* Text — pinned bottom-left */}
          <motion.div
            style={{ y: textY, opacity: textOp }}
            className="absolute inset-0 z-20 flex flex-col justify-end"
          >
            <div className="w-full px-8 md:px-12 pb-10 md:pb-14">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start gap-4"
              >
                {/* Pill label */}
                <div className="inline-flex items-center gap-2 bg-black/55 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em]">Portfolio</span>
                </div>

                {/* Heading */}
                <h1
                  className="font-display font-bold leading-none tracking-tight text-white"
                  style={{ fontSize: 'clamp(48px, 8vw, 108px)' }}
                >
                  Our Projects
                </h1>

                <p className="font-sans text-[14px] md:text-[15px] text-white/60 max-w-[420px] leading-relaxed">
                  Every space reflects thoughtful layouts, structural precision, custom material procurement, and meticulous attention to detail.
                </p>

                {/* Image dot indicators */}
                <div className="flex items-center gap-2 mt-1">
                  {heroImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIdx(i)}
                      className={`rounded-full transition-all duration-500 ${
                        i === currentImageIdx
                          ? 'w-6 h-1.5 bg-gold'
                          : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PORTFOLIO GRID ── */}
      <div className="bg-bg pb-24">
        <div className="max-w-[1440px] mx-auto px-6 md:px-10 pt-16">

          {/* Filter & Search Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between border-b border-ink-border pb-8 mb-12 gap-6">
            <div className="flex items-center gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-none shrink-0">
              {filterChips.map((chip) => (
                <button
                  key={chip.value}
                  onClick={() => setActiveFilter(chip.value)}
                  className={`font-sans text-[11px] font-semibold uppercase tracking-widest px-4.5 py-2 rounded-pill transition-all duration-200 shrink-0 ${
                    activeFilter === chip.value
                      ? 'bg-ink text-bg'
                      : 'bg-bg-card text-ink-soft border border-ink-border hover:text-ink'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <GooeyInput
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="lg:max-w-[320px]"
            />
          </div>

          {/* Project Grid */}
          {loading && projects.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="aspect-[4/3] bg-bg-card animate-pulse rounded-card" />
              ))}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20 bg-bg-card rounded-card border border-ink-border">
              <p className="font-sans text-sm text-ink-soft">No projects found matching your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, idx) => {
                return (
                  <Reveal key={idx} delay={(idx % 3) * 0.08}>
                    <Link
                      to={`/projects/${project.slug}`}
                      className="group block rounded-card overflow-hidden bg-bg-card card-lift"
                    >
                      <div className="relative overflow-hidden aspect-[4/3]">
                        <img
                          src={project.heroImage}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-expo-out"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold">
                            {project.style || 'Luxury build'}
                          </span>
                          <span className="font-sans text-[11px] text-ink-muted">{project.year}</span>
                        </div>
                        <h3 className="font-display text-[22px] font-bold text-ink group-hover:text-ink-soft transition-colors mb-2 leading-snug">
                          {project.title}
                        </h3>
                        <p className="font-sans text-[13px] text-ink-soft">{project.location}</p>
                        <div className="pt-4 flex items-center gap-1 text-[11px] text-ink font-semibold uppercase tracking-wider group-hover:translate-x-0.5 transition-transform">
                          <span>View case study</span>
                          <ArrowUpRight size={13} />
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
