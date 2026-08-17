import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MapPin, Calendar, LayoutGrid, Layers } from 'lucide-react';
import SEO from '../components/common/SEO';

const ProjectDetails = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Before/After drag slider state
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const sliderContainerRef = useRef(null);

  const updateSliderPos = (clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
    if (!hasMoved) setHasMoved(true);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateSliderPos(e.clientX);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    if (e.touches && e.touches[0]) {
      updateSliderPos(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleGlobalMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateSliderPos(clientX);
    };

    const handleGlobalEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('mouseup', handleGlobalEnd);
      window.addEventListener('touchmove', handleGlobalMove);
      window.addEventListener('touchend', handleGlobalEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isDragging]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadProject = async () => {
      try {
        const { getCMSData, STORAGE_KEYS } = await import('../utils/cmsStore');
        const storedProjects = getCMSData(STORAGE_KEYS.PROJECTS);
        if (storedProjects && Array.isArray(storedProjects)) {
          const match = storedProjects.find(p => p.slug === slug || p._id === slug);
          if (match) setProject(match);
        }
      } catch {}

      try {
        const response = await axios.get(`/projects/${slug}`);
        if (response.data.success && response.data.data) {
          setProject(response.data.data);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    loadProject();

    const handleSync = () => loadProject();
    window.addEventListener('espacio_cms_update', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('espacio_cms_update', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [slug]);

  // Offline mock project metadata fallbacks matching display expectations
  const getMockFallback = () => {
    const unsplashPool = {
      villa: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80'
      ],
      apartment: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80'
      ],
      office: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80'
      ],
      commercial: [
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1517502884422-41eaaced0168?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80'
      ],
      renovation: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=80'
      ],
      luxury_home: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80'
      ]
    };

    let category = 'villa';
    let index = 1;
    if (slug && slug.includes('-')) {
      const parts = slug.split('-');
      if (unsplashPool[parts[0]]) {
        category = parts[0];
        index = parseInt(parts[1], 10) || 1;
      }
    }

    const pool = unsplashPool[category] || unsplashPool['villa'];
    const neighborhoods = ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Kondapur', 'HITEC City', 'Kokapet', 'Begumpet', 'Madhapur', 'Gandipet', 'Financial District'];
    const styles = ['Japandi Minimalist', 'Warm Editorial', 'Clean Contemporary', 'Luxury Architectural', 'Scandinavian Crafted', 'Modern Classic', 'Warm Contemporary', 'Industrial Editorial'];

    const hood = neighborhoods[(category.charCodeAt(0) + index) % neighborhoods.length];
    const style = styles[(category.charCodeAt(1) + index) % styles.length];
    const area = `${2800 + index * 420} sq.ft.`;
    const label = category === 'luxury_home' ? 'Residence' : category.charAt(0).toUpperCase() + category.slice(1);
    const title = `${style} ${label} ${index}`;

    const clientDemoPool = [
      { name: 'Dr. Ananya Reddy', profession: 'Senior Cardiologist & Villa Owner', mobile: '+91 98490 12345', text: 'The sheer structural rigor and high-tolerance wood joinery delivered by Espacio was benchmark quality. Every room feels engineered to perfection.' },
      { name: 'Vikram Malhotra', profession: 'Tech Entrepreneur & Penthouse Owner', mobile: '+91 98765 43210', text: 'Espacio handled everything from raw site shell to luxury Italian marble installation seamlessly. Their team met strict delivery timelines without compromising on finish.' },
      { name: 'Suresh K. Rao', profession: 'Managing Director, Horizon Infra', mobile: '+91 99890 67890', text: 'Outstanding execution! The acoustic insulation, double-height ceiling treatments, and custom lighting tracks converted our workspace into an architectural trophy.' },
      { name: 'Kavitha Varma', profession: 'Principal Architect & Homeowner', mobile: '+91 94400 55432', text: 'As an architect, I hold extremely high standards for material tolerances. Espacio surpassed my expectations in veneer grain matching and shadow-gap fittings.' },
      { name: 'Rajesh Goud', profession: 'Real Estate Developer', mobile: '+91 97000 88776', text: 'Espacio turned around our luxury residence within 5 months. Their material sourcing and on-site project management saved us both time and budget.' },
      { name: 'Meera Deshmukh', profession: 'Chartered Accountant & Homeowner', mobile: '+91 98660 33445', text: 'From initial 3D visualization to final hardware placement, the transparency and craftsmanship were phenomenal. Highly recommended for turnkey luxury homes.' },
      { name: 'Amitabh Saxena', profession: 'VP of Product Engineering', mobile: '+91 91212 99887', text: 'Implacable attention to detail! The hidden partition channels and integrated ambient lighting gave our apartment an ultra-modern Japandi aesthetic.' },
      { name: 'Sunita Agarwal', profession: 'Industrialist & Philanthropist', mobile: '+91 93939 11223', text: 'Extremely professional team. Their custom modular kitchen and walk-in wardrobe executions are unmatched in Hyderabad.' }
    ];
    const clientDemo = clientDemoPool[(index - 1) % clientDemoPool.length];

    return {
      title,
      location: `${hood}, Hyderabad`,
      category,
      area,
      year: 2023 + (index % 3),
      style,
      description: `A monumental design and construction project optimizing modern spatial flows, wood alignments, and high tolerances.`,
      story: {
        vision: `Deliver an inspiring space balancing structural purity, matched timber tones, and double-height ventilation systems.`,
        challenges: `Integrating cooling tracks and shadow joints into wall panel transitions without exposing standard frame anchors.`,
        solutions: `Engineered floating wall tracks with acoustic isolation buffers.`,
        engineering: `Calculated panel weight structures to withstand physical deflection limits.`,
        outcome: `An award-winning editorial case study highlighting true interior design and execution precision.`
      },
      heroImage: pool[(index - 1) % pool.length],
      gallery: pool,
      beforeImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
      afterImage: pool[(index - 1) % pool.length],
      testimonialName: clientDemo.name,
      testimonialMobile: clientDemo.mobile,
      testimonialProfession: clientDemo.profession,
      testimonialText: clientDemo.text,
      testimonialRating: 5,
      testimonial: {
        name: clientDemo.name,
        mobile: clientDemo.mobile,
        profession: clientDemo.profession,
        role: clientDemo.profession,
        text: clientDemo.text,
        rating: 5
      }
    };
  };

  const p = project || getMockFallback();

  return (
    <div className="bg-cream min-h-screen pb-24">
      <SEO title={`${p.title} — Luxury Case Study`} description={p.description ? p.description.substring(0, 150) : 'Case study description...'} image={p.heroImage} url={`/projects/${p.slug}`} />
      
      {/* Hero section */}
      <section className="relative h-[65vh] w-full bg-black pt-28">
        <img
          src={p.heroImage}
          alt={p.title}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 to-transparent pointer-events-none" />
        
        {/* Back button */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pb-4">
          <Link to="/projects" className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-widest text-cream hover:text-gold font-bold transition-colors drop-shadow-sm">
            <ArrowLeft size={14} />
            <span>Back to Case Studies</span>
          </Link>
        </div>

        <div className="absolute bottom-12 left-0 w-full z-10">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col space-y-3">
            <span className="font-sans text-xs uppercase tracking-widest text-gold font-bold">
              {p.style || 'Bespoke execution'}
            </span>
            <h1 className="text-white text-4xl md:text-5xl font-editorial font-bold leading-tight">
              {p.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Overview Block */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-walnut/10">
        <div className="flex items-center space-x-3">
          <MapPin className="text-gold shrink-0" size={20} />
          <div>
            <span className="font-sans text-[10px] text-walnut uppercase tracking-widest block">Location</span>
            <span className="font-sans font-bold text-sm text-charcoal">{p.location}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <LayoutGrid className="text-gold shrink-0" size={20} />
          <div>
            <span className="font-sans text-[10px] text-walnut uppercase tracking-widest block">Size</span>
            <span className="font-sans font-bold text-sm text-charcoal">{p.area || 'N/A'}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar className="text-gold shrink-0" size={20} />
          <div>
            <span className="font-sans text-[10px] text-walnut uppercase tracking-widest block">Year</span>
            <span className="font-sans font-bold text-sm text-charcoal">{p.year || p.completionYear || 2025}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Layers className="text-gold shrink-0" size={20} />
          <div>
            <span className="font-sans text-[10px] text-walnut uppercase tracking-widest block">Type</span>
            <span className="font-sans font-bold text-sm text-charcoal capitalize">{p.category?.replace('_', ' ')}</span>
          </div>
        </div>
      </section>

      {/* Story Sections */}
      <section className="max-w-[1000px] mx-auto px-6 py-20 space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="font-editorial text-2xl font-bold text-charcoal md:col-span-1">The Vision</div>
          <div className="font-sans text-sm text-walnut leading-relaxed md:col-span-2">
            {p.story?.vision || p.description}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-walnut/5 pt-12">
          <div className="font-editorial text-2xl font-bold text-charcoal md:col-span-1">The Challenge</div>
          <div className="font-sans text-sm text-walnut leading-relaxed md:col-span-2">
            {p.story?.challenges || 'Optimizing partition thresholds and hidden layout tracking slots.'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-walnut/5 pt-12">
          <div className="font-editorial text-2xl font-bold text-charcoal md:col-span-1">The Engineering</div>
          <div className="font-sans text-sm text-walnut leading-relaxed md:col-span-2">
            {p.story?.engineering || 'Mild steel reinforcement configurations and structural load-bearing tolerances checks.'}
          </div>
        </div>
      </section>

      {/* Before / After Slider (Interactive Drag Transformation) */}
      {(() => {
        const beforeImg = (Array.isArray(p.beforeImages) && p.beforeImages[0]) || p.beforeImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80';
        const afterImg = (Array.isArray(p.afterImages) && p.afterImages[0]) || p.afterImage || p.heroImage || (Array.isArray(p.gallery) && p.gallery[0]);
        if (!beforeImg || !afterImg) return null;

        return (
          <section className="max-w-[1100px] mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-2">Turnkey Execution Benchmark</span>
              <h2 className="font-editorial text-3xl md:text-4xl font-bold text-charcoal">Before & After Transformation</h2>
              <p className="font-sans text-xs text-walnut mt-2">Drag the handle horizontally to view the structural evolution from raw shell to luxury finish.</p>
            </div>

            <div
              ref={sliderContainerRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              className="relative w-full aspect-[16/9] rounded-card overflow-hidden select-none cursor-ew-resize border border-walnut/15 shadow-2xl bg-charcoal"
            >
              {/* After Image */}
              <img
                src={afterImg}
                alt="Transformation After"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* After Badge: Appears initially, and when sliding to the left side */}
              {(!hasMoved || sliderPos <= 50) && (
                <div className="absolute bottom-4 right-4 z-20 bg-gold text-charcoal font-sans text-xs uppercase font-bold tracking-widest px-4 py-2 rounded-full shadow-lg transition-opacity duration-300 pointer-events-none">
                  After Transformation
                </div>
              )}

              {/* Before Image */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none z-10"
                style={{ width: `${sliderPos}%` }}
              >
                <img
                  src={beforeImg}
                  alt="Transformation Before"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: sliderContainerRef.current ? sliderContainerRef.current.getBoundingClientRect().width : '100%' }}
                />
                
                {/* Before Badge: Appears initially, and when sliding to the right side */}
                {(!hasMoved || sliderPos > 50) && (
                  <div className="absolute bottom-4 left-4 z-20 bg-black/80 text-cream font-sans text-xs uppercase font-bold tracking-widest px-4 py-2 rounded-full shadow-lg border border-white/20 transition-opacity duration-300 pointer-events-none">
                    Before Raw Site
                  </div>
                )}
              </div>

              {/* Drag handle line */}
              <div
                className="absolute top-0 bottom-0 w-[3px] bg-gold z-20 shadow-[0_0_15px_rgba(197,165,114,0.8)]"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gold shadow-2xl flex items-center justify-center text-charcoal font-bold text-base border-2 border-cream">
                  ↔
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* Editorial Masonry Gallery */}
      {p.gallery?.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-editorial text-3xl md:text-4xl font-bold text-charcoal">Project Gallery & Room Photography</h2>
              <p className="font-sans text-xs text-walnut mt-1">Showing all {p.gallery.length} captured photos for this project entry.</p>
            </div>
            <span className="font-sans text-xs font-bold text-gold uppercase tracking-wider">Click photo to expand</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {p.gallery.map((imgUrl, index) => (
              <div
                key={index}
                onClick={() => { setActivePhotoIdx(index); setLightboxOpen(true); }}
                className="rounded-card overflow-hidden border border-walnut/10 shadow-sm group cursor-pointer relative bg-charcoal aspect-[4/3]"
              >
                <img
                  src={imgUrl}
                  alt={`Project Photo ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-gold text-charcoal font-sans text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full shadow-lg">
                    Expand Photo
                  </span>
                </div>
                <span className="absolute bottom-3 left-3 bg-black/60 text-white font-sans text-[10px] uppercase tracking-widest px-2.5 py-1 rounded">
                  Photo {index + 1} of {p.gallery.length}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && p.gallery && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 md:p-8">
          <div className="w-full max-w-[1440px] flex items-center justify-between text-white border-b border-white/10 pb-4">
            <div>
              <h3 className="font-editorial text-lg font-bold">{p.title}</h3>
              <p className="font-sans text-xs text-white/50">Photo {activePhotoIdx + 1} of {p.gallery.length}</p>
            </div>
            <button
              onClick={() => setLightboxOpen(false)}
              className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors font-bold text-xs uppercase px-4 py-2"
            >
              ✕ Close Viewer
            </button>
          </div>

          <div className="relative w-full max-w-5xl h-[70vh] flex items-center justify-center my-auto">
            <img
              src={p.gallery[activePhotoIdx]}
              alt={`Expanded view ${activePhotoIdx + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            {p.gallery.length > 1 && (
              <button
                onClick={() => setActivePhotoIdx((prev) => (prev === 0 ? p.gallery.length - 1 : prev - 1))}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-gold text-white hover:text-charcoal p-3.5 rounded-full transition-colors border border-white/20"
              >
                ◀
              </button>
            )}
            {p.gallery.length > 1 && (
              <button
                onClick={() => setActivePhotoIdx((prev) => (prev === p.gallery.length - 1 ? 0 : prev + 1))}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-gold text-white hover:text-charcoal p-3.5 rounded-full transition-colors border border-white/20"
              >
                ▶
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto max-w-full pt-4 scrollbar-none">
            {p.gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActivePhotoIdx(i)}
                className={`w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                  activePhotoIdx === i ? 'border-gold scale-105 opacity-100' : 'border-transparent opacity-40 hover:opacity-80'
                }`}
              >
                <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* What the Client Says About Our Work Section */}
      {(p.testimonial?.text || p.testimonialText) && (
        <section className="max-w-[900px] mx-auto px-6 py-16 my-16 text-center bg-offwhite rounded-2xl border border-walnut/10 shadow-xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />
          <span className="font-sans text-xs font-bold uppercase tracking-widest text-gold block mb-3">Client Endorsement & Feedback</span>
          <h2 className="font-editorial text-3xl font-bold text-charcoal mb-8">What the Client Says About Our Work</h2>
          
          <div className="flex justify-center space-x-1 text-gold mb-6">
            {Array.from({ length: Number(p.testimonial?.rating || p.testimonialRating || 5) }).map((_, idx) => (
              <span key={idx} className="text-xl">★</span>
            ))}
          </div>

          <blockquote className="font-editorial text-xl md:text-2xl italic text-charcoal leading-relaxed max-w-3xl mx-auto mb-8">
            "{p.testimonial?.text || p.testimonialText}"
          </blockquote>

          <div className="border-t border-walnut/10 pt-6 inline-flex flex-col items-center px-8">
            <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-charcoal">
              {p.testimonial?.name || p.testimonialName || 'Valued Client'}
            </h4>
            
            <div className="flex items-center space-x-3 text-xs text-walnut mt-1">
              <span className="font-medium text-gold">
                {p.testimonial?.profession || p.testimonialProfession || p.testimonial?.role || 'Homeowner'}
              </span>
              {(p.testimonial?.mobile || p.testimonialMobile) && (
                <>
                  <span>•</span>
                  <span className="font-mono text-[11px] text-charcoal/70">
                    📞 {p.testimonial?.mobile || p.testimonialMobile}
                  </span>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Final Lead CTA */}
      <section className="mt-24 text-center max-w-[700px] mx-auto px-6 space-y-6">
        <h2 className="font-editorial text-3xl font-bold">Inspired by this project?</h2>
        <p className="font-sans text-sm text-walnut">Let's create a customized home layout built around your preferences.</p>
        <div className="pt-2">
          <Link to="/contact" className="inline-flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-4 px-8 rounded-button transition-transform duration-300 hover:scale-105">
            <span>Book Consultation</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
