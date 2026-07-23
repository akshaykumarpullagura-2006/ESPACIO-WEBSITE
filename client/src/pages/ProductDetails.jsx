import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle, Lock, ArrowRight, ChevronLeft, ChevronRight as ChevronRightIcon } from 'lucide-react';
import SEO from '../components/common/SEO';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeColor, setActiveColor] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  const mockProduct = {
    title: 'WPC Wall Panels',
    slug: 'wpc-wall-panels',
    category: 'wpc_wall_panels',
    description: 'Co-extruded composite panels offering absolute water resistance and rich wood grain textures. Built for residential and commercial environments demanding premium finishes.',
    heroImage: '/images/materials/wpc_panels.jpg',
    gallery: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    ],
    specifications: [
      { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
      { label: 'Core Weight', value: '1.8 kg/m' },
      { label: 'Water Resistance', value: '100% Waterproof' },
      { label: 'Installation Type', value: 'Interlocking Tongue & Groove' },
      { label: 'Surface Finish', value: 'Deep Embossed Wood Grain' },
      { label: 'Warranty', value: '10 Year Manufacturer' },
    ],
    features: ['100% Waterproof', 'Termite Proof', 'Flame Retardant', 'Eco-Friendly E0 Grade', 'UV Resistant', 'Easy Maintenance'],
    colors: [
      { name: 'Natural Oak', hex: '#D2B48C' },
      { name: 'Smoked Walnut', hex: '#5C4033' },
      { name: 'Ashen Grey', hex: '#808080' },
      { name: 'Slate Charcoal', hex: '#2F4F4F' },
      { name: 'White Ash', hex: '#F5F0EB' },
    ],
    previewPages: [
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
    ],
    applications: ['Modular Kitchen Cabinets', 'Living Room Feature Walls', 'Bedroom Headboards', 'Office Ceilings', 'Bathroom Panels', 'Commercial Reception'],
  };

  const mockProductsList = [
    {
      title: 'Fluted Acrylic Luxe - Irish',
      slug: 'fluted-acrylic-luxe-irish',
      category: 'fluted_panels',
      description: 'Premium NX-GEN 1 Irish fluted acrylic wall panel with rich relief lines and a contemporary matte off-white finish.',
      heroImage: '/images/materials/irish.png',
      gallery: ['/images/materials/irish.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Core Weight', value: '1.8 kg/m' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Irish Off-White' },
        { label: 'Installation Type', value: 'Interlocking Tongue & Groove' },
        { label: 'Surface Finish', value: 'Matte Acrylic fluted relief' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Irish Finish', '100% Waterproof', 'Termite Proof', 'Flame Retardant'],
      colors: [{ name: 'Irish Off-White', hex: '#EAE6DF' }],
      previewPages: ['/images/materials/irish.png'],
      applications: ['Modular Wardrobes', 'Living Room Accent Panels', 'Bedroom Headboards']
    },
    {
      title: 'Fluted Acrylic Luxe - Azzurro',
      slug: 'fluted-acrylic-luxe-azzurro',
      category: 'fluted_panels',
      description: 'Elegant NX-GEN 1 Azzurro fluted accent panel in a beautiful sky-blue finish, perfect for premium master bedrooms and lounges.',
      heroImage: '/images/materials/azzurro.png',
      gallery: ['/images/materials/azzurro.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Core Weight', value: '1.8 kg/m' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Azzurro Sky Blue' },
        { label: 'Installation Type', value: 'Interlocking Tongue & Groove' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Azzurro Blue', '100% Waterproof', 'Termite Proof', 'Flame Retardant'],
      colors: [{ name: 'Azzurro Blue', hex: '#87B5C8' }],
      previewPages: ['/images/materials/azzurro.png'],
      applications: ['Master Bedroom Headboard', 'Living Room Feature Wall', 'Creative Studio Lounge']
    },
    {
      title: 'Fluted Acrylic Luxe - Giallo',
      slug: 'fluted-acrylic-luxe-giallo',
      category: 'fluted_panels',
      description: 'NX-GEN 1 Giallo fluted panel. Professional workspace accent element with clean textured lines in a medium-gray tone.',
      heroImage: '/images/materials/giallo.png',
      gallery: ['/images/materials/giallo.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Core Weight', value: '1.8 kg/m' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Giallo Slate Gray' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Giallo Gray', '100% Waterproof', 'Flame Retardant'],
      colors: [{ name: 'Giallo Slate Gray', hex: '#8E8D8A' }],
      previewPages: ['/images/materials/giallo.png'],
      applications: ['Home Office Desks Backdrop', 'Executive Meeting Rooms', 'Reception counters']
    },
    {
      title: 'Fluted Acrylic Luxe - Marbo',
      slug: 'fluted-acrylic-luxe-marbo',
      category: 'fluted_panels',
      description: 'NX-GEN 1 Marbo panel. Curator-selected sandy-beige fluted cladding for warm light-diffused luxury dining environments.',
      heroImage: '/images/materials/marbo.png',
      gallery: ['/images/materials/marbo.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Marbo Sandy Beige' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Marbo Sand', '100% Waterproof', 'Eco E0 Grade'],
      colors: [{ name: 'Marbo Sand', hex: '#D2C1AE' }],
      previewPages: ['/images/materials/marbo.png'],
      applications: ['Dining Room Feature Wall', 'Kitchen backsplash partitions', 'Hotel lobby lounges']
    },
    {
      title: 'Fluted Acrylic Luxe - Florida',
      slug: 'fluted-acrylic-luxe-florida',
      category: 'fluted_panels',
      description: 'Premium NX-GEN 1 Florida fluted surface displaying high-fidelity white marble texture running with golden veins.',
      heroImage: '/images/materials/florida.png',
      gallery: ['/images/materials/florida.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Florida Golden Marble' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Florida Marble', 'Anti-Scratch', 'Waterproof'],
      colors: [{ name: 'Florida Marble', hex: '#ECEAE6' }],
      previewPages: ['/images/materials/florida.png'],
      applications: ['Luxury Living TV panels', 'Master Suite backdrop elevation', 'Retail luxury boutique backdrop']
    },
    {
      title: 'Fluted Acrylic Luxe - Menta',
      slug: 'fluted-acrylic-luxe-menta',
      category: 'fluted_panels',
      description: 'NX-GEN 1 Menta fluted wall panel. Restful and organic mint green vertical textures, perfect for calming bedroom designs.',
      heroImage: '/images/materials/menta.png',
      gallery: ['/images/materials/menta.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Menta Mint Green' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Menta Green', 'Waterproof', 'Eco E0 Grade'],
      colors: [{ name: 'Menta Green', hex: '#A2C2B3' }],
      previewPages: ['/images/materials/menta.png'],
      applications: ['Bed Headboards backdrop', 'Spas & Wellness centers', 'Living room calming walls']
    },
    {
      title: 'Fluted Acrylic Luxe - Giallo Dining',
      slug: 'fluted-acrylic-luxe-giallo-dining',
      category: 'fluted_panels',
      description: 'NX-GEN 1 Giallo Dining panel. Modern sand-tinted vertical lines styling luxury family dining partitions and ambient layouts.',
      heroImage: '/images/materials/giallo_dining.png',
      gallery: ['/images/materials/giallo_dining.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Giallo Sand' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Giallo Sand', 'Heat Resistant', 'Termite Proof'],
      colors: [{ name: 'Giallo Sand', hex: '#D7CBBD' }],
      previewPages: ['/images/materials/giallo_dining.png'],
      applications: ['Dining Space feature panels', 'Restaurant ambient divisions', 'Luxury kitchen partitions']
    },
    {
      title: 'Fluted Acrylic Luxe - Ash',
      slug: 'fluted-acrylic-luxe-ash',
      category: 'fluted_panels',
      description: 'NX-GEN 1 Ash fluted element. Clean industrial slate ash tones, offering a sophisticated background for media consoles and screens.',
      heroImage: '/images/materials/ash.png',
      gallery: ['/images/materials/ash.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 1 Luxe' },
        { label: 'Color Shade', value: 'Ash Gray-Blue' },
      ],
      features: ['Luxe Collection', 'NX-GEN 1', 'Ash Gray', 'Waterproof', 'Termite Proof'],
      colors: [{ name: 'Ash Gray-Blue', hex: '#9CAAB6' }],
      previewPages: ['/images/materials/ash.png'],
      applications: ['Living room TV Backdrop', 'Smart Entertainment Units', 'Office lounge focus wall']
    },
    {
      title: 'Fluted Acrylic Luxe - Linia',
      slug: 'fluted-acrylic-luxe-linia',
      category: 'fluted_panels',
      description: 'Luxury NX-GEN 2 Linia panel. Delicate warm marble surface patterns detailed with rich gold veins for premium bathroom vanity accenting.',
      heroImage: '/images/materials/linia.png',
      gallery: ['/images/materials/linia.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Linia Gold Marble' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Linia Gold', 'Waterproof', 'Anti-Scratch'],
      colors: [{ name: 'Linia Gold Marble', hex: '#F0ECE1' }],
      previewPages: ['/images/materials/linia.png'],
      applications: ['Luxury Bathroom basins wall', 'Premium vanity units elevation', 'Spa backdrop dividers']
    },
    {
      title: 'Fluted Acrylic Luxe - Florida Vanity',
      slug: 'fluted-acrylic-luxe-florida-vanity',
      category: 'fluted_panels',
      description: 'NX-GEN 2 Florida Vanity layout. Elegant vertical marble and gold trim detailing designed for high-end boutique powder rooms and dressing spaces.',
      heroImage: '/images/materials/florida_vanity.png',
      gallery: ['/images/materials/florida_vanity.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Florida Vanity Marble' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Florida Gold Marble', 'Anti-Scratch', 'Waterproof'],
      colors: [{ name: 'Florida Vanity Marble', hex: '#ECEAE6' }],
      previewPages: ['/images/materials/florida_vanity.png'],
      applications: ['Boutique Powder Room', 'Walk-in Wardrobe Dressing vanity', 'Luxury bathroom partitions']
    },
    {
      title: 'Fluted Acrylic Luxe - Gracia',
      slug: 'fluted-acrylic-luxe-gracia',
      category: 'fluted_panels',
      description: 'Premium NX-GEN 2 Gracia fluted wall panel. Fine off-white marble relief details with standard interlocking installation.',
      heroImage: '/images/materials/gracia.png',
      gallery: ['/images/materials/gracia.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Gracia Marble White' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Gracia Finish', 'Waterproof', 'Easy Install'],
      colors: [{ name: 'Gracia Marble White', hex: '#EBEAE6' }],
      previewPages: ['/images/materials/gracia.png'],
      applications: ['Living room sofa wall backdrop', 'Reception lobbies', 'Executive meeting lounges']
    },
    {
      title: 'Fluted Acrylic Luxe - Irish Gen 2',
      slug: 'fluted-acrylic-luxe-irish-gen2',
      category: 'fluted_panels',
      description: 'NX-GEN 2 Irish fluted panel. Next-generation contemporary off-white finish styling luxury executive workspaces and desks.',
      heroImage: '/images/materials/irish_gen2.png',
      gallery: ['/images/materials/irish_gen2.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Irish Off-White Gen 2' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Irish Finish', 'Anti-Scratch', 'Eco E0 Grade'],
      colors: [{ name: 'Irish Off-White Gen 2', hex: '#E6E3DB' }],
      previewPages: ['/images/materials/irish_gen2.png'],
      applications: ['Executive Workstation desks backdrop', 'Study room accent elevations', 'Luxury library panels']
    },
    {
      title: 'Fluted Acrylic Luxe - Blanco',
      slug: 'fluted-acrylic-luxe-blanco',
      category: 'fluted_panels',
      description: 'NX-GEN 2 Blanco panel. Minimalist crisp-white fluted texture, perfect for styling bunk beds and modern children\'s bedrooms.',
      heroImage: '/images/materials/blanco.png',
      gallery: ['/images/materials/blanco.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Blanco White' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Blanco White', 'Waterproof', 'Termite Proof'],
      colors: [{ name: 'Blanco White', hex: '#FFFFFF' }],
      previewPages: ['/images/materials/blanco.png'],
      applications: ['Kids Bed backdrop wall', 'Bunk bed structural cladding', 'Bright minimalist lounges']
    },
    {
      title: 'Fluted Acrylic Luxe - Formic',
      slug: 'fluted-acrylic-luxe-formic',
      category: 'fluted_panels',
      description: 'Premium NX-GEN 2 Formic panel. Warm vertical oak-grained relief lines detailing high-ceiling staircases and open spaces.',
      heroImage: '/images/materials/formic.png',
      gallery: ['/images/materials/formic.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Formic Oak' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Formic Oak', 'Waterproof', 'Eco E0 Grade'],
      colors: [{ name: 'Formic Oak', hex: '#E4D6BD' }],
      previewPages: ['/images/materials/formic.png'],
      applications: ['Staircase high-ceiling walls', 'Luxury lobby dividers', 'Bespoke divider screens']
    },
    {
      title: 'Fluted Acrylic Luxe - Ash Gen 2',
      slug: 'fluted-acrylic-luxe-ash-gen2',
      category: 'fluted_panels',
      description: 'NX-GEN 2 Ash panel. Light gray contemporary fluted textures, providing a premium backdrop for master suite bed elevations.',
      heroImage: '/images/materials/ash_gen2.png',
      gallery: ['/images/materials/ash_gen2.png'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Collection Name', value: 'NX-GEN 2 Luxe' },
        { label: 'Color Shade', value: 'Ash Gray Gen 2' },
      ],
      features: ['Luxe Collection', 'NX-GEN 2', 'Ash Gray', 'Waterproof', 'Termite Proof'],
      colors: [{ name: 'Ash Gray Gen 2', hex: '#A8B4BD' }],
      previewPages: ['/images/materials/ash_gen2.png'],
      applications: ['Master suite bed headboard wall', 'Luxury TV lounges elevations', 'Hotel rooms key-walls']
    }
  ];

  const categoryDict = {
    'acrylic-luxe-collection': {
      title: 'Acrylic Luxe Collection',
      category: 'acrylic_luxe',
      description: 'Ultra-gloss anti-scratch cabinet overlays creating glass-like modern kitchen cabinet fronts.',
      heroImage: '/images/materials/luminous_grid_8313.jpg',
      features: ['High-Gloss', 'Anti-Scratch', 'UV Stable', 'Seamless Finish'],
      specifications: [
        { label: 'Sheet Size', value: '2440mm × 1220mm × 2mm' },
        { label: 'Surface', value: 'Hard-coated Acrylic' },
        { label: 'Finishes', value: 'Luminous Grid (8313), Crema Imperiale (8302), Elysian Vein (8303), Vector Grid (8306), Crema Radiance (8309), Sylvan Gold (8314)' }
      ],
      totalShades: 23,
      previewLimit: 6,
      previewPages: [
        '/images/materials/luminous_grid_8313.jpg',
        '/images/materials/crema_imperiale_8302.jpg',
        '/images/materials/elysian_vein_8303.jpg',
        '/images/materials/vector_grid_8306.jpg',
        '/images/materials/crema_radiance_8309.jpg',
        '/images/materials/sylvan_gold_8314.jpg'
      ],
      gallery: [
        '/images/materials/luminous_grid_8313.jpg',
        '/images/materials/crema_imperiale_8302.jpg',
        '/images/materials/elysian_vein_8303.jpg',
        '/images/materials/vector_grid_8306.jpg',
        '/images/materials/crema_radiance_8309.jpg',
        '/images/materials/sylvan_gold_8314.jpg'
      ],
      applications: ['Modular Kitchen Shutters', 'Wardrobe Sliding Doors', 'Bathroom Vanity']
    },
    'fluted-pvc-luxe': {
      title: 'Fluted PVC Luxe Collection',
      category: 'fluted_pvc',
      description: 'Premium fluted PVC wall panels with rich relief lines and contemporary finishes.',
      heroImage: '/images/materials/irish.png',
      features: ['Waterproof', 'Easy Install', 'Flame Retardant', 'Anti-Scratch'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Material Composition', value: 'Polymer PVC Resin' }
      ],
      previewPages: [
        '/images/materials/irish.png',
        '/images/materials/azzurro.png',
        '/images/materials/giallo.png',
        '/images/materials/marbo.png',
        '/images/materials/florida.png',
        '/images/materials/menta.png'
      ],
      gallery: [
        '/images/materials/irish.png',
        '/images/materials/azzurro.png',
        '/images/materials/giallo.png',
        '/images/materials/marbo.png'
      ],
      applications: ['Living Room Accent Walls', 'TV Consoles & Partitions', 'Powder Room Vanity Backdrops']
    },
    'digital-korean-poly-granite': {
      title: 'Digital Korean Poly Granite',
      category: 'poly_granite',
      description: 'High-gloss stone surface overlays offering scratch-proof marble elevations.',
      heroImage: '/images/materials/florida.png',
      features: ['Scratch-Proof', 'Marble Finish', 'High-Gloss', 'Zero Seams'],
      specifications: [
        { label: 'Sheet Size', value: '2440mm × 1220mm × 3mm' },
        { label: 'Gloss Rating', value: '95+ GU' }
      ],
      previewPages: [
        '/images/materials/florida.png',
        '/images/materials/linia.png',
        '/images/materials/florida_vanity.png',
        '/images/materials/gracia.png',
        '/images/materials/marbo.png',
        '/images/materials/giallo_dining.png'
      ],
      gallery: [
        '/images/materials/florida.png',
        '/images/materials/linia.png',
        '/images/materials/florida_vanity.png'
      ],
      applications: ['TV Unit Backdrops', 'Dining Room Accent Walls', 'Lobby Elevations']
    },
    'charcoal-panels-luxe': {
      title: 'Charcoal Panels Luxe Collection',
      category: 'charcoal_panels',
      description: 'Richly textured wall panels infused with active charcoal for unique luxury accent walls.',
      heroImage: '/images/materials/charcoal_luxe_4015.jpg',
      features: ['Air Purifying', 'Premium Texture', 'Sound Dampening'],
      specifications: [
        { label: 'Dimensions', value: '2900mm × 120mm × 12mm' },
        { label: 'Finishes', value: 'LUXE Edition 4015, Tone 4009/4011, Tone 4001/4003, LUXE Edition 6015, Tone 4018/4017/4016, Tone 6083/6082/6081' }
      ],
      previewPages: [
        '/images/materials/charcoal_luxe_4015.jpg',
        '/images/materials/charcoal_luxe_4009_4011.jpg',
        '/images/materials/charcoal_luxe_4001_4003.jpg',
        '/images/materials/charcoal_luxe_6015.jpg',
        '/images/materials/charcoal_luxe_4018_4017_4016.jpg',
        '/images/materials/charcoal_luxe_6083_6082_6081.jpg'
      ],
      gallery: [
        '/images/materials/charcoal_luxe_4015.jpg',
        '/images/materials/charcoal_luxe_4009_4011.jpg',
        '/images/materials/charcoal_luxe_4001_4003.jpg',
        '/images/materials/charcoal_luxe_6015.jpg',
        '/images/materials/charcoal_luxe_4018_4017_4016.jpg',
        '/images/materials/charcoal_luxe_6083_6082_6081.jpg'
      ],
      applications: ['Home Theatre Acoustic Wall', 'Master Bedroom Headboard', 'Executive Lounge']
    },
    'charcoal-panels-luxe-1': {
      title: 'Espacio Charcoal Panels Luxe Collection (1)',
      category: 'charcoal_panels_1',
      description: 'Additional selection of richly textured wall panels infused with active charcoal.',
      heroImage: '/images/materials/charcoal_luxe_1_6015.jpg',
      features: ['Premium Texture', 'Acoustic Relief', 'Air Purifying'],
      specifications: [
        { label: 'Dimensions', value: '2900mm × 120mm × 12mm' },
        { label: 'Finishes', value: 'LUXE Edition 6015, Tone 6085/4009, Tone 5005/5006/5002, Tone 6049/6052/6050/6051, Tone 4001/4003' }
      ],
      previewPages: [
        '/images/materials/charcoal_luxe_1_6015.jpg',
        '/images/materials/charcoal_luxe_1_6085_4009.jpg',
        '/images/materials/charcoal_luxe_1_5005_5006_5002.jpg',
        '/images/materials/charcoal_luxe_1_6049_6052_6050_6051.jpg',
        '/images/materials/charcoal_luxe_1_4001_4003.jpg',
        '/images/materials/charcoal_luxe_1_6015.jpg'
      ],
      gallery: [
        '/images/materials/charcoal_luxe_1_6015.jpg',
        '/images/materials/charcoal_luxe_1_6085_4009.jpg',
        '/images/materials/charcoal_luxe_1_5005_5006_5002.jpg',
        '/images/materials/charcoal_luxe_1_6049_6052_6050_6051.jpg',
        '/images/materials/charcoal_luxe_1_4001_4003.jpg'
      ],
      applications: ['Master Bedroom Headboard', 'Executive Lounge']
    },
    'lvt-luxe-flooring': {
      title: 'LVT Luxe Flooring',
      category: 'lvt_flooring',
      description: 'Premium luxury vinyl flooring offering durability with authentic wood and stone textures.',
      heroImage: '/images/materials/giallo_dining.png',
      features: ['Durable', 'Water-Resistant', 'Easy Install', 'Noise Reduction'],
      specifications: [
        { label: 'Plank Size', value: '1220mm × 180mm × 5mm' }
      ],
      previewPages: [
        '/images/materials/giallo_dining.png',
        '/images/materials/giallo.png',
        '/images/materials/marbo.png',
        '/images/materials/florida.png',
        '/images/materials/menta.png',
        '/images/materials/linia.png'
      ],
      gallery: [
        '/images/materials/giallo_dining.png',
        '/images/materials/giallo.png'
      ],
      applications: ['Living Room Flooring', 'Bedroom Flooring', 'Office Workspace']
    },
    'pvc-luxe-collection': {
      title: 'PVC Luxe Collection',
      category: 'pvc_luxe',
      description: 'Lightweight, versatile PVC panels for ceiling and wall applications with rich wood and textured finishes.',
      heroImage: '/images/materials/pvc_luxe_5003_5004.jpg',
      features: ['Lightweight', 'Fire Retardant', 'Waterproof'],
      specifications: [
        { label: 'Dimensions', value: '3000mm × 200mm × 8mm' },
        { label: 'Finishes', value: 'Tone 5003/5004, Tone 4010/4013/2007, Tone 1202/1206/2013, Tone 1201/1204/1203, Tone 2003/1205/3012' }
      ],
      previewPages: [
        '/images/materials/pvc_luxe_5003_5004.jpg',
        '/images/materials/pvc_luxe_4010_4013_2007.jpg',
        '/images/materials/pvc_luxe_1202_1206_2013.jpg',
        '/images/materials/pvc_luxe_1201_1204_1203.jpg',
        '/images/materials/pvc_luxe_2003_1205_3012.jpg',
        '/images/materials/pvc_luxe_5003_5004.jpg'
      ],
      gallery: [
        '/images/materials/pvc_luxe_5003_5004.jpg',
        '/images/materials/pvc_luxe_4010_4013_2007.jpg',
        '/images/materials/pvc_luxe_1202_1206_2013.jpg',
        '/images/materials/pvc_luxe_1201_1204_1203.jpg',
        '/images/materials/pvc_luxe_2003_1205_3012.jpg'
      ],
      applications: ['Ceiling Panels', 'Wall Cladding', 'Reception Desk Backdrops']
    },
    'wpc-luxe-collection': {
      title: 'WPC Luxe Collection',
      category: 'wpc_luxe',
      description: 'Co-extruded composite panels offering absolute water resistance and rich wood grain textures.',
      heroImage: '/images/materials/wpc_luxe_1701_1606.jpg',
      features: ['100% Waterproof', 'Termite Proof', 'UV Resistant'],
      specifications: [
        { label: 'Dimensions', value: '2900mm × 160mm × 24mm' },
        { label: 'Finishes', value: 'Tone 1701/1606, Tone 1718/1717/1701, Tone 1401/1410/1411, Tone 1503/1502/1504, Tone 1506/1505' }
      ],
      previewPages: [
        '/images/materials/wpc_luxe_1701_1606.jpg',
        '/images/materials/wpc_luxe_1718_1717_1701.jpg',
        '/images/materials/wpc_luxe_1401_1410_1411.jpg',
        '/images/materials/wpc_luxe_1503_1502_1504.jpg',
        '/images/materials/wpc_luxe_1506_1505.jpg',
        '/images/materials/wpc_luxe_1701_1606.jpg'
      ],
      gallery: [
        '/images/materials/wpc_luxe_1701_1606.jpg',
        '/images/materials/wpc_luxe_1718_1717_1701.jpg',
        '/images/materials/wpc_luxe_1401_1410_1411.jpg',
        '/images/materials/wpc_luxe_1503_1502_1504.jpg',
        '/images/materials/wpc_luxe_1506_1505.jpg'
      ],
      applications: ['Kitchen Shutters', 'Living Room Walls', 'Bedroom Headboards']
    },

    'fluted-acrylic-luxe': {
      title: 'Fluted Acrylic Luxe Panels',
      category: 'fluted_panels',
      description: 'Premium NX-GEN 1 & 2 fluted acrylic wall panels with rich relief lines, contemporary matte, and gold-veined marble textures.',
      heroImage: '/images/materials/fluted_acrylic_florida.jpg',
      features: ['NX-GEN 1 & 2', 'Curated Shades', '100% Waterproof', 'Anti-Scratch', 'Flame Retardant'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 122mm × 12mm' },
        { label: 'Core Weight', value: '1.8 kg/m' },
        { label: 'Material Composition', value: 'Polymer Acrylic Resin' },
        { label: 'Finishes', value: 'NX-GEN 2 Florida, NX-GEN 1 Giallo (Desk), NX-GEN 1 Azzurro, NX-GEN 1 Giallo (Dining), NX-GEN 1 Gracia' },
        { label: 'Installation Type', value: 'Interlocking Tongue & Groove' }
      ],
      previewPages: [
        '/images/materials/fluted_acrylic_florida.jpg',
        '/images/materials/fluted_acrylic_giallo_desk.jpg',
        '/images/materials/fluted_acrylic_azzurro.jpg',
        '/images/materials/fluted_acrylic_giallo_dining.jpg',
        '/images/materials/fluted_acrylic_gracia.jpg',
        '/images/materials/fluted_acrylic_florida.jpg'
      ],
      gallery: [
        '/images/materials/fluted_acrylic_florida.jpg',
        '/images/materials/fluted_acrylic_giallo_desk.jpg',
        '/images/materials/fluted_acrylic_azzurro.jpg',
        '/images/materials/fluted_acrylic_giallo_dining.jpg',
        '/images/materials/fluted_acrylic_gracia.jpg'
      ],
      applications: ['Master Suite Headboards', 'Living Room Accent Walls', 'TV Consoles & Partitions', 'Powder Room Vanity Backdrops']
    },
    '3d-panels': {
      title: '3D Wall Panels',
      category: '3d_panels',
      description: 'Geometric and organic 3D relief panels creating dynamic shadow play on living room and reception feature walls.',
      heroImage: '/images/materials/gracia.png',
      features: ['3D Relief Texture', '12 Sculptural Designs', 'Paintable Surface', 'Acoustic Relief'],
      specifications: [
        { label: 'Tile Dimensions', value: '500mm × 500mm × 25mm' },
        { label: 'Material', value: 'Molded Mineral Fiber' },
        { label: 'Fire Rating', value: 'Class A' }
      ],
      previewPages: [
        '/images/materials/gracia.png',
        '/images/materials/formic.png',
        '/images/materials/blanco.png',
        '/images/materials/irish_gen2.png',
        '/images/materials/ash_gen2.png',
        '/images/materials/marbo.png',
        '/images/materials/giallo_dining.png',
        '/images/materials/florida.png',
        '/images/materials/linia.png',
        '/images/materials/ash.png'
      ],
      applications: ['Living Room TV Feature Wall', 'Corporate Reception Backdrop', 'Lounge Accent Wall']
    },
    'wpc-wall-panels': {
      title: 'WPC Wall Panels',
      category: 'wpc_wall_panels',
      description: 'Co-extruded composite panels offering absolute water resistance and rich wood grain textures. Built for residential and commercial environments demanding premium finishes.',
      heroImage: '/images/materials/formic.png',
      features: ['100% Waterproof', 'Termite Proof', 'Flame Retardant', 'Eco-Friendly E0 Grade', 'UV Resistant'],
      specifications: [
        { label: 'Standard Dimensions', value: '2900mm × 160mm × 24mm' },
        { label: 'Core Weight', value: '2.4 kg/m' },
        { label: 'Water Resistance', value: '100% Waterproof' },
        { label: 'Installation Type', value: 'Interlocking Tongue & Groove' }
      ],
      previewPages: [
        '/images/materials/formic.png',
        '/images/materials/irish.png',
        '/images/materials/marbo.png',
        '/images/materials/giallo_dining.png',
        '/images/materials/gracia.png',
        '/images/materials/blanco.png',
        '/images/materials/ash_gen2.png',
        '/images/materials/florida.png',
        '/images/materials/linia.png',
        '/images/materials/ash.png'
      ],
      applications: ['Modular Kitchen Cabinets', 'Living Room Feature Walls', 'Bedroom Headboards', 'Office Ceilings']
    },
    'pvc-ceiling-panels': {
      title: 'PVC Ceiling Panels',
      category: 'pvc_ceiling_panels',
      description: 'Lightweight Class-A fire retardant ceiling elements integrating with smart lighting tracks seamlessly.',
      heroImage: '/images/materials/azzurro.png',
      features: ['Lightweight', 'Fire Class-A', 'Cove Lighting Track Ready', 'Easy Maintenance'],
      specifications: [
        { label: 'Standard Dimensions', value: '3000mm × 200mm × 8mm' },
        { label: 'Fire Rating', value: 'Class A' },
        { label: 'Installation', value: 'Click-lock grid' }
      ],
      previewPages: [
        '/images/materials/azzurro.png',
        '/images/materials/blanco.png',
        '/images/materials/irish_gen2.png',
        '/images/materials/ash_gen2.png',
        '/images/materials/marbo.png',
        '/images/materials/menta.png',
        '/images/materials/linia.png',
        '/images/materials/florida.png',
        '/images/materials/giallo.png'
      ],
      applications: ['Living Room False Ceilings', 'Bedrooms Cove Lighting', 'Office Corridors']
    },
    'polygranite-sheets': {
      title: 'Polygranite Sheets',
      category: 'polygranite_sheets',
      description: 'High-gloss stone surface overlays offering scratch-proof marble elevations without the structural weight.',
      heroImage: '/images/materials/florida.png',
      features: ['Scratch-Proof', 'High-Gloss Marble', 'Heat Resistant', 'Zero Seams'],
      specifications: [
        { label: 'Sheet Size', value: '2440mm × 1220mm × 3mm' },
        { label: 'Gloss Rating', value: '95+ GU' },
        { label: 'Weight', value: '12 kg per sheet' }
      ],
      previewPages: [
        '/images/materials/florida.png',
        '/images/materials/linia.png',
        '/images/materials/florida_vanity.png',
        '/images/materials/gracia.png',
        '/images/materials/marbo.png',
        '/images/materials/giallo_dining.png',
        '/images/materials/irish.png',
        '/images/materials/ash.png',
        '/images/materials/blanco.png'
      ],
      applications: ['TV Unit Backdrops', 'Dining Room Accent Walls', 'Lobby Elevations']
    },
    'acrylic-sheets': {
      title: 'Acrylic Sheets',
      category: 'acrylic_sheets',
      description: 'Ultra-gloss anti-scratch cabinet overlays creating glass-like modern kitchen cabinet fronts.',
      heroImage: '/images/materials/linia.png',
      features: ['Anti-Scratch', 'UV Stable', 'Mirror Gloss', 'Seamless Finish'],
      specifications: [
        { label: 'Sheet Size', value: '2440mm × 1220mm × 2mm' },
        { label: 'Surface', value: 'Hard-coated Acrylic' }
      ],
      previewPages: [
        '/images/materials/linia.png',
        '/images/materials/irish.png',
        '/images/materials/azzurro.png',
        '/images/materials/menta.png',
        '/images/materials/blanco.png',
        '/images/materials/gracia.png',
        '/images/materials/florida_vanity.png',
        '/images/materials/giallo.png',
        '/images/materials/ash_gen2.png'
      ],
      applications: ['Modular Kitchen Shutters', 'Wardrobe Sliding Doors', 'Bathroom Vanity']
    },
    'charcoal-panels': {
      title: 'Charcoal Panels',
      category: 'charcoal_panels',
      description: 'Richly textured wall panels infused with active charcoal for unique luxury accent wall applications.',
      heroImage: '/images/materials/ash.png',
      features: ['Air Purifying', 'Premium Texture', 'Matte Finish', 'Sound Dampening'],
      specifications: [
        { label: 'Dimensions', value: '2900mm × 120mm × 12mm' },
        { label: 'Material', value: 'Activated Charcoal Composite' }
      ],
      previewPages: [
        '/images/materials/ash.png',
        '/images/materials/ash_gen2.png',
        '/images/materials/giallo.png',
        '/images/materials/marbo.png',
        '/images/materials/formic.png',
        '/images/materials/irish_gen2.png',
        '/images/materials/florida.png',
        '/images/materials/blanco.png'
      ],
      applications: ['Home Theatre Acoustic Wall', 'Master Bedroom Headboard', 'Executive Lounge']
    },
    'mosaic-tiles': {
      title: 'Mosaic Tiles',
      category: 'mosaic_tiles',
      description: 'Curated natural stone and matte metallic mosaic details for premium powder rooms and kitchen backsplashes.',
      heroImage: '/images/materials/florida_vanity.png',
      features: ['Natural Stone', 'Non-Slip', 'Handcrafted', 'Bespoke Motifs'],
      specifications: [
        { label: 'Mesh Sheet Size', value: '300mm × 300mm' },
        { label: 'Tile Thickness', value: '8mm' }
      ],
      previewPages: [
        '/images/materials/florida_vanity.png',
        '/images/materials/linia.png',
        '/images/materials/gracia.png',
        '/images/materials/marbo.png',
        '/images/materials/giallo_dining.png',
        '/images/materials/florida.png',
        '/images/materials/menta.png',
        '/images/materials/irish.png'
      ],
      applications: ['Powder Room Basin Niche', 'Kitchen Backsplash', 'Bar Counter Front']
    },
    'decorative-louvers': {
      title: 'Decorative Louvers',
      category: 'louvers',
      description: 'Bespoke walnut and charcoal vertical dividers engineered for light diffusion and open layout zoning.',
      heroImage: '/images/materials/gracia.png',
      features: ['Light Diffusing', 'Custom Heights', 'Modular Fit', 'Acoustic Relief'],
      specifications: [
        { label: 'Louver Height', value: 'Up to 3600mm' },
        { label: 'Profile Size', value: '50mm × 50mm' }
      ],
      previewPages: [
        '/images/materials/gracia.png',
        '/images/materials/formic.png',
        '/images/materials/marbo.png',
        '/images/materials/giallo_dining.png',
        '/images/materials/blanco.png',
        '/images/materials/irish_gen2.png',
        '/images/materials/ash.png',
        '/images/materials/florida.png'
      ],
      applications: ['Foyer Room Divider', 'Living-Dining Partition', 'Staircase Screen']
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${slug}`);
        let backendProduct = null;
        if (response.data.success && response.data.data) {
          backendProduct = response.data.data;
        }
        const localFound = categoryDict[slug] || mockProductsList.find(m => m.slug === slug);
        setProduct(backendProduct ? { ...backendProduct, ...localFound } : (localFound || mockProduct));
      } catch {
        const found = categoryDict[slug] || mockProductsList.find(m => m.slug === slug);
        setProduct(found || mockProduct);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const localProduct = categoryDict[slug] || mockProductsList.find(m => m.slug === slug);
  const p = localProduct || product || mockProduct;
  const previewLimit = 6;
  
  const basePages = (p.previewPages && p.previewPages.length > 0) ? p.previewPages : mockProduct.previewPages;
  const allPages = [];
  for (let i = 0; i < 12; i++) {
    allPages.push(basePages[i % basePages.length]);
  }
  
  const totalShades = p.totalShades || 12;

  return (
    <div className="bg-cream min-h-screen pb-24">
      <SEO title={`${p.title} — Material Details`} description={p.description ? p.description.substring(0, 150) : 'Material details...'} image={p.heroImage} url={`/products/${p.slug}`} />
      {/* Hero */}
      <section className="relative h-[65vh] bg-black mb-0 pt-28">
        <img src={p.heroImage} alt={p.title} className="absolute inset-0 w-full h-full object-cover opacity-65" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 to-transparent pointer-events-none" />
        
        {/* Back */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 pb-4">
          <Link to="/products" className="inline-flex items-center space-x-2 text-xs font-sans uppercase tracking-widest text-cream hover:text-gold font-bold transition-colors drop-shadow-sm">
            <ArrowLeft size={14} />
            <span>Back to Material Library</span>
          </Link>
        </div>

        <div className="absolute bottom-12 left-0 w-full z-10">
          <div className="max-w-[1440px] mx-auto px-6 md:px-12 space-y-2">
            <span className="font-sans text-xs uppercase tracking-widest text-gold font-bold">Premium Material</span>
            <h1 className="text-white text-4xl md:text-5xl font-editorial font-bold">{p.title}</h1>
          </div>
        </div>
      </section>

      {/* Overview + Features */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-6">
          <h2 className="font-editorial text-3xl font-bold text-charcoal">Material Overview</h2>
          <p className="font-sans text-sm text-walnut leading-relaxed">{p.description}</p>

          {/* Feature Tags */}
          <div className="space-y-3">
            <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Key Features</h3>
            <div className="grid grid-cols-2 gap-3">
              {(p.features || mockProduct.features).map((feat, idx) => (
                <div key={idx} className="flex items-center space-x-2 text-xs font-sans text-walnut">
                  <CheckCircle size={14} className="text-gold shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Color Swatches */}
        <div className="space-y-6">
          <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Available Finishes</h3>
          <div className="flex flex-wrap gap-4">
            {(p.colors || mockProduct.colors).map((color, idx) => (
              <button key={idx} onClick={() => setActiveColor(idx)}
                className={`flex flex-col items-center space-y-2 group transition-all duration-200 ${activeColor === idx ? 'scale-105' : ''}`}>
                <div
                  className={`w-12 h-12 rounded-full border-2 shadow-sm transition-all ${activeColor === idx ? 'border-gold scale-110 shadow-md' : 'border-walnut/20 group-hover:border-walnut/50'}`}
                  style={{ backgroundColor: color.hex }}
                />
                <span className="font-sans text-[9px] text-walnut uppercase tracking-wide text-center max-w-[60px]">{color.name}</span>
              </button>
            ))}
          </div>

          {/* Specifications Table */}
          <div className="mt-6 space-y-3">
            <h3 className="font-sans text-xs uppercase tracking-widest text-charcoal font-bold">Technical Specifications</h3>
            <div className="border border-walnut/10 rounded-card overflow-hidden">
              {(p.specifications || mockProduct.specifications).map((spec, idx) => (
                <div key={idx} className={`flex items-center px-5 py-3.5 text-xs font-sans ${idx % 2 === 0 ? 'bg-offwhite' : 'bg-cream'}`}>
                  <span className="text-walnut font-medium w-1/2">{spec.label}</span>
                  <span className="text-charcoal font-bold w-1/2">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      {/* Applications */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pb-20">
        <h2 className="font-editorial text-2xl font-bold mb-8">Applications</h2>
        <div className="flex flex-wrap gap-3">
          {(p.applications || mockProduct.applications).map((app, idx) => (
            <span key={idx} className="bg-offwhite border border-walnut/10 text-walnut font-sans text-xs px-4 py-2 rounded-full">
              {app}
            </span>
          ))}
        </div>
      </section>

      {/* ── CATALOGUE PREVIEW GATE ──────────────────────────────────────────── */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="font-sans text-xs uppercase tracking-widest text-gold font-bold">Catalog & Shades</span>
            <h2 className="font-editorial text-3xl font-bold text-charcoal">Catalogue Preview</h2>
          </div>
          <span className="bg-charcoal text-cream font-sans text-[11px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full">
            {Math.min(previewLimit, allPages.length)} Unlocked / {totalShades} Total Shades
          </span>
        </div>

        <div className="relative overflow-hidden rounded-card border border-walnut/10 bg-offwhite shadow-sm">
          {/* Grid of pages */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5 p-6">
            {allPages.map((pageImg, idx) => {
              const isLocked = idx >= previewLimit;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (isLocked) {
                      window.dispatchEvent(new CustomEvent('open-quote-modal', {
                        detail: {
                          mode: 'catalogue',
                          title: 'To Unlock More Catalogs, Fill the Details',
                          productName: p.title
                        }
                      }));
                    } else {
                      setLightboxIdx(idx % (p.gallery || mockProduct.gallery).length);
                      setLightboxOpen(true);
                    }
                  }}
                  className={`relative rounded-card overflow-hidden aspect-[3/4] border cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                    idx >= 10 ? 'hidden md:block' : ''
                  } ${
                    isLocked 
                      ? 'border-walnut/10 select-none bg-stone-950/20' 
                      : 'border-walnut/10'
                  }`}
                >
                  <img
                    src={pageImg}
                    alt={`Catalogue Page ${idx + 1}`}
                    className={`w-full h-full object-cover transition-all duration-500 ${
                      isLocked ? 'blur-lg scale-110 opacity-40' : ''
                    }`}
                  />

                  {/* Locked Overlay */}
                  {isLocked && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center space-y-2">
                      <div className="w-11 h-11 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shadow-lg backdrop-blur-md">
                        <Lock size={20} />
                      </div>
                      <span className="font-sans text-[10px] uppercase tracking-widest text-gold font-bold">Locked</span>
                    </div>
                  )}

                  {/* Page Badge */}
                  <div className={`absolute bottom-0 left-0 right-0 py-1.5 text-center font-sans text-[10px] uppercase tracking-widest font-bold ${
                    isLocked ? 'bg-black/70 text-gold/80' : 'bg-cream/90 text-charcoal'
                  }`}>
                    Page {idx + 1} {isLocked ? '(Locked)' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Banner overlay for locked pages */}
        <div className="mt-8 relative z-20 bg-charcoal text-cream p-8 md:p-12 text-center flex flex-col items-center justify-center space-y-4 border border-gold/20 rounded-card shadow-lg">
          <div className="max-w-[500px] space-y-2">
            <h3 className="font-editorial text-2xl font-bold text-white">Want to Unlock the Remaining Catalogue?</h3>
            <p className="font-sans text-xs text-cream/75 leading-relaxed">
              Contact ESPACIO to receive full digital access to all {allPages.length} shade variations, high-resolution textures, and physical sample boxes.
            </p>
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-quote-modal', {
              detail: {
                mode: 'catalogue',
                title: 'To Unlock More Catalogs, Fill the Details',
                productName: p.title
              }
            }))}
            className="inline-flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-4 px-8 rounded-button transition-transform duration-300 hover:scale-105 shadow-lg cursor-pointer"
          >
            <span>Contact Us to Unlock Full Catalogue 🔒</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-charcoal/95 z-[100] flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIdx((prev) => Math.max(0, prev - 1)); }}
            className="absolute left-6 p-3 text-white hover:text-gold transition-colors">
            <ChevronLeft size={28} />
          </button>
          <img src={(p.gallery || mockProduct.gallery)[lightboxIdx]} alt="Fullscreen"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-card"
            onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); setLightboxIdx((prev) => Math.min((p.gallery || mockProduct.gallery).length - 1, prev + 1)); }}
            className="absolute right-6 p-3 text-white hover:text-gold transition-colors">
            <ChevronRightIcon size={28} />
          </button>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-6 right-6 text-white hover:text-gold text-2xl font-bold transition-colors">
            ✕
          </button>
          <span className="absolute bottom-6 font-sans text-xs text-cream/60 uppercase tracking-widest">
            {lightboxIdx + 1} / {(p.gallery || mockProduct.gallery).length}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
