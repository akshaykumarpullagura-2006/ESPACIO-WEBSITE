import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, ArrowRight, ChevronRight, ArrowUpRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import SEO from '../components/common/SEO';
import DomeGallery from '../components/ui/DomeGallery';
import GooeyInput from '../components/ui/gooey-input';

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

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const mockProducts = [
    {
      title: 'Acrylic Luxe Collection',
      slug: 'acrylic-luxe-collection',
      category: 'acrylic_luxe',
      badge: 'Premium Finish',
      description: 'Ultra-gloss anti-scratch cabinet overlays creating glass-like modern kitchen cabinet fronts.',
      heroImage: '/images/materials/luminous_grid_8313.jpg',
      features: ['High-Gloss', 'Anti-Scratch']
    },
    {
      title: 'Digital Korean Poly Granite',
      slug: 'digital-korean-poly-granite',
      category: 'poly_granite',
      badge: 'Marble Textures',
      description: 'High-gloss stone surface overlays offering scratch-proof marble elevations.',
      heroImage: '/images/materials/florida.png',
      features: ['Scratch-Proof', 'Marble Finish']
    },
    {
      title: 'Charcoal Panels Luxe Collection',
      slug: 'charcoal-panels-luxe',
      category: 'charcoal_panels',
      badge: 'Textured Accents',
      description: 'Richly textured wall panels infused with active charcoal for unique luxury accent walls.',
      heroImage: '/images/materials/charcoal_luxe_4015.jpg',
      features: ['Air Purifying', 'Premium Texture']
    },
    {
      title: 'Fluted PVC Luxe Collection',
      slug: 'fluted-pvc-luxe',
      category: 'fluted_pvc',
      badge: 'Architectural Panels',
      description: 'Premium fluted PVC wall panels with rich relief lines and contemporary finishes.',
      heroImage: '/images/materials/irish.png',
      features: ['Waterproof', 'Easy Install']
    },
    {
      title: 'LVT Luxe Flooring',
      slug: 'lvt-luxe-flooring',
      category: 'lvt_flooring',
      badge: 'Luxury Vinyl',
      description: 'Premium luxury vinyl flooring offering durability with authentic wood and stone textures.',
      heroImage: '/images/materials/giallo_dining.png',
      features: ['Durable', 'Water-Resistant']
    },
    {
      title: 'Fluted Acrylic Luxe Collection',
      slug: 'fluted-acrylic-luxe',
      category: 'fluted_acrylic',
      badge: '3D Relief',
      description: 'Dynamic fluted acrylic panels creating sophisticated shadow play for luxury interiors.',
      heroImage: '/images/materials/fluted_acrylic_florida.jpg',
      features: ['3D Relief', 'High-Gloss']
    },
    {
      title: 'PVC Luxe Collection',
      slug: 'pvc-luxe-collection',
      category: 'pvc_luxe',
      badge: 'Versatile Panels',
      description: 'Lightweight, versatile PVC panels for ceiling and wall applications with rich wood and textured finishes.',
      heroImage: '/images/materials/pvc_luxe_5003_5004.jpg',
      features: ['Lightweight', 'Fire Retardant']
    },
    {
      title: 'WPC Luxe Collection',
      slug: 'wpc-luxe-collection',
      category: 'wpc_luxe',
      badge: 'Wood Composite',
      description: 'Co-extruded composite panels offering absolute water resistance and rich wood grain textures.',
      heroImage: '/images/materials/wpc_luxe_1701_1606.jpg',
      features: ['100% Waterproof', 'Termite Proof']
    },
    {
      title: 'Espacio Charcoal Panels Luxe Collection (1)',
      slug: 'charcoal-panels-luxe-1',
      category: 'charcoal_panels_1',
      badge: 'Textured Accents',
      description: 'Additional selection of richly textured wall panels infused with active charcoal.',
      heroImage: '/images/materials/charcoal_luxe_1_6015.jpg',
      features: ['Premium Texture', 'Acoustic Relief']
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products');
        if (response.data.success && response.data.data.length > 0) {
          const merged = response.data.data.map(bp => {
            const mock = mockProducts.find(m => m.slug === bp.slug);
            return mock ? { ...bp, ...mock } : bp;
          });
          setProducts(merged);
        } else {
          setProducts(mockProducts);
        }
      } catch {
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const sourceData = (products.length > 0 ? products : mockProducts).filter(
    (p) => p.slug !== 'espacio-master-catalogue'
  );

  const filteredProducts = searchQuery.trim()
    ? sourceData.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sourceData;

  const fallbacks = [
    '/images/materials/irish.png',
    '/images/materials/azzurro.png',
    '/images/materials/giallo.png',
    '/images/materials/marbo.png',
    '/images/materials/florida.png',
    '/images/materials/menta.png',
    '/images/materials/giallo_dining.png',
    '/images/materials/ash.png',
    '/images/materials/linia.png',
    '/images/materials/florida_vanity.png',
    '/images/materials/gracia.png',
    '/images/materials/irish_gen2.png',
    '/images/materials/blanco.png',
    '/images/materials/formic.png',
    '/images/materials/ash_gen2.png'
  ];

  return (
    <div className="bg-bg min-h-screen pb-24">
      <SEO title="Premium Material Library — WPC, Fluted, Acrylic Panels" description="Explore ESPACIO's curated material library. WPC wall panels, fluted panels, polygranite, acrylic sheets, mosaic tiles and more. Request samples and catalogue." url="/products" />
      
      {/* Hero with Dome Gallery — same framed-card pattern as Home & Projects */}
      <section className="relative h-[73vh] lg:h-[86vh] px-5 pt-5 pb-[10px] lg:px-12">
        {/* Rounded dark card */}
        <div className="relative w-full h-full overflow-hidden rounded-[24px] lg:rounded-[40px] bg-[#120F17]">
        {/* Dome Gallery Container */}
        <div className="absolute inset-0 w-full h-full z-0">
          <DomeGallery 
            images={sourceData.map((p, idx) => ({ 
              src: p.heroImage || fallbacks[idx % fallbacks.length], 
              alt: p.title 
            }))}
            fit={0.45}
            fitBasis="auto"
            overlayBlurColor="#120F17"
            grayscale={false}
            openedImageWidth="220px"
            openedImageHeight="300px"
            imageBorderRadius="12px"
            openedImageBorderRadius="18px"
          />
        </div>

        {/* Bottom vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#120F17] via-transparent to-transparent pointer-events-none z-10" />

        </div>{/* end rounded card */}
      </section>

      {/* Search Bar */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 pt-16 pb-8 flex items-center justify-between gap-6 flex-wrap">
        <div className="space-y-2">
          <span className="font-sans text-xs uppercase tracking-widest text-gold font-bold">Premium Collection</span>
          <h2 className="font-editorial text-3xl font-bold text-charcoal">Browse Materials</h2>
        </div>
        <GooeyInput
          placeholder="Search materials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-[360px]"
        />
      </div>

      {/* Material Cards Grid */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pb-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1,2,3,4,5,6,7,8].map((n) => <div key={n} className="aspect-[3/4] bg-offwhite animate-pulse rounded-card" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, idx) => (
              <Link key={idx} to={`/products/${product.slug}`}
                className="group block rounded-card overflow-hidden bg-offwhite border border-walnut/5 hover:-translate-y-2 transition-all duration-400 shadow-sm">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={product.heroImage || fallbacks[idx % fallbacks.length]} alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Feature badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                    {(product.features || []).slice(0, 2).map((feat, fi) => (
                      <span key={fi} className="bg-cream/90 text-charcoal font-sans text-[9px] uppercase tracking-wide font-bold px-2 py-1 rounded-full">
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <h3 className="font-editorial text-lg font-bold text-charcoal group-hover:text-gold transition-colors">{product.title}</h3>
                  <p className="font-sans text-xs text-walnut leading-relaxed line-clamp-2">{product.description}</p>
                  <div className="pt-2 flex items-center space-x-1.5 text-[10px] text-gold uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore Material</span>
                    <ArrowRight size={10} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>


    </div>
  );
};

export default Products;
