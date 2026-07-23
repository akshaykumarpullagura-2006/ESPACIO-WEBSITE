
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, MapPin, Calendar, LayoutGrid, Layers, CheckCircle } from 'lucide-react';
import SEO from '../components/common/SEO';

const ProjectDetails = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);

  // Before/After drag slider state
  const [sliderPos, setSliderPos] = useState(50);
  const sliderContainerRef = useRef(null);

  const handleSliderMove = (clientX) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleMouseMove = (e) => {
    handleSliderMove(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleSliderMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(`/projects/${slug}`);
        if (response.data.success) {
          setProject(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching project case study:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [slug]);

  // Offline mock project metadata fallbacks matching display expectations
  // Offline mock project metadata fallbacks matching display expectations
  const getMockFallback = () => {
    // Standard image pools for real-world look
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

    // Parse dynamic slug categories e.g. villa-3, renovation-5
    let category = 'villa';
    let index = 1;
    if (slug && slug.includes('-')) {
      const parts = slug.split('-');
      if (unsplashPool[parts[0]]) {
        category = parts[0];
        index = parseInt(parts[1], 10) || 1;
      }
    } else {
      // Compatibility fallback map
      const compatMap = {
        'lakeside-sanctuary': { cat: 'villa', idx: 1 },
        'modernist-penthouse': { cat: 'apartment', idx: 1 },
        'minimalist-office': { cat: 'office', idx: 1 },
        'bespoke-residence': { cat: 'luxury_home', idx: 1 },
        'lakeside-renovation': { cat: 'renovation', idx: 1 },
        'urban-loft-apartment': { cat: 'apartment', idx: 2 },
        'canopy-villa': { cat: 'villa', idx: 2 },
        'nexus-coworking': { cat: 'commercial', idx: 1 }
      };
      if (compatMap[slug]) {
        category = compatMap[slug].cat;
        index = compatMap[slug].idx;
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
      beforeImages: ["https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"],
      afterImages: [pool[(index - 1) % pool.length]],
      testimonial: {
        name: `Owner of ${label} Case Study`,
        text: "The sheer professionalism and attention to tolerances shown by Espacio was exemplary. Our expectations were fully surpassed.",
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
            <span className="font-sans font-bold text-sm text-charcoal">{p.year}</span>
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
        {/* Core Vision */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="font-editorial text-2xl font-bold text-charcoal md:col-span-1">The Vision</div>
          <div className="font-sans text-sm text-walnut leading-relaxed md:col-span-2">
            {p.story?.vision || p.description}
          </div>
        </div>

        {/* Challenges & Engineering */}
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

      {/* Before / After Slider (Render only if before/after images exist) */}
      {p.beforeImages?.length > 0 && p.afterImages?.length > 0 && (
        <section className="max-w-[1000px] mx-auto px-6 py-12">
          <h2 className="font-editorial text-2xl font-bold text-center mb-8">Before & After Transformation</h2>
          <div
            ref={sliderContainerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative w-full aspect-[16/9] rounded-img overflow-hidden select-none cursor-ew-resize border border-walnut/10 shadow-lg"
          >
            {/* After Image */}
            <img
              src={p.afterImages[0]}
              alt="Transformation After"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
            <div className="absolute bottom-4 right-4 bg-charcoal/80 text-white text-[10px] uppercase font-sans font-bold px-3 py-1.5 rounded-full">After</div>

            {/* Before Image */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none z-10"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src={p.beforeImages[0]}
                alt="Transformation Before"
                className="absolute inset-0 w-full h-full object-cover max-w-none"
                style={{ width: sliderContainerRef.current ? sliderContainerRef.current.getBoundingClientRect().width : '100%' }}
              />
              <div className="absolute bottom-4 left-4 bg-charcoal/80 text-white text-[10px] uppercase font-sans font-bold px-3 py-1.5 rounded-full">Before</div>
            </div>

            {/* Drag handle line */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-gold z-20"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gold shadow-md flex items-center justify-center text-charcoal font-bold text-sm">
                ↔
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Editorial Masonry Gallery */}
      {p.gallery?.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-20">
          <h2 className="font-editorial text-3xl font-bold mb-12 text-center">Project Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {p.gallery.map((imgUrl, index) => (
              <div key={index} className="rounded-card overflow-hidden border border-walnut/5 shadow-sm group">
                <img
                  src={imgUrl}
                  alt={`Project Gallery ${index + 1}`}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-103 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Client Testimonial (Quote block) */}
      {p.testimonial?.text && (
        <section className="max-w-[800px] mx-auto px-6 py-20 text-center bg-offwhite rounded-card border border-walnut/5">
          <div className="w-12 h-12 rounded-full bg-cream border border-walnut/15 flex items-center justify-center text-gold mx-auto mb-6">
            ★
          </div>
          <p className="font-editorial text-xl italic text-charcoal leading-relaxed mb-6">
            "{p.testimonial.text}"
          </p>
          <h4 className="font-sans font-bold text-sm uppercase tracking-wider text-charcoal">
            {p.testimonial.name}
          </h4>
          <span className="font-sans text-xs text-walnut">Hyderabad Project Client</span>
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
