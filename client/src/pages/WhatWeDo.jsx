import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SEO from '../components/common/SEO';

const Reveal = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '50px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 15 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: Math.min(delay, 0.15), ease: 'easeOut' }}>
      {children}
    </motion.div>
  );
};

const mockCategories = [
  { 
    name: 'Modular Kitchen', 
    slug: 'modular-kitchen', 
    description: 'Precision-engineered kitchens with high-gloss acrylic, polygranite surfaces, and concealed lighting tracks.', 
    heroImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80', 
    details: {
      tag: 'Precision-Engineered',
      headline: 'Kitchens Built Around the Way You Cook',
      body: 'Every ESPACIO modular kitchen is designed around your workflow — not the other way around. We use premium Hettich and Hafele hardware, soft-close mechanisms, and direct-sourced shutters to build kitchens that feel intuitive, look stunning, and last decades. From island layouts to compact parallel configurations, every centimetre is accounted for.',
      includes: ['Layout & Workflow Planning', 'Island / Parallel / L-Shape / U-Shape', 'Premium Hardware (Hettich / Hafele)', 'Granite / Quartz / Sintered Countertops', 'Chimney & Appliance Integration', 'Backsplash Tiling', 'Soft-Close Shutters & Drawers', 'Under-Cabinet LED Lighting', 'Custom Pantry & Tall Unit Design', '10-Year Workmanship Warranty'],
    },
    galleryImages: [
      '/images/materials/user_luxury_kitchen_6.jpg',
      '/images/materials/user_luxury_kitchen_7.jpg',
      '/images/materials/user_luxury_kitchen_8.jpg',
      '/images/materials/user_luxury_kitchen_1.jpg',
      '/images/materials/user_luxury_kitchen_2.jpg',
      '/images/materials/user_luxury_kitchen_3.jpg',
      '/images/materials/user_luxury_kitchen_4.jpg',
      '/images/materials/user_luxury_kitchen_5.jpg',
      '/images/materials/user_l_shape_kitchen_5.jpg',
      '/images/materials/user_l_shape_kitchen_6.jpg',
      '/images/materials/user_l_shape_kitchen_7.jpg',
      '/images/materials/user_l_shape_kitchen_8.jpg',
      '/images/materials/user_l_shape_kitchen_1.jpg',
      '/images/materials/user_l_shape_kitchen_2.jpg',
      '/images/materials/user_l_shape_kitchen_3.jpg',
      '/images/materials/user_l_shape_kitchen_4.jpg',
      '/images/materials/l_shape_kitchen_1.png',
      '/images/materials/l_shape_kitchen_2.png',
      '/images/materials/parallel_kitchen_6.jpg',
      '/images/materials/parallel_kitchen_7.jpg',
      '/images/materials/parallel_kitchen_8.jpg',
      '/images/materials/parallel_kitchen_9.png',
      '/images/materials/parallel_kitchen_1.jpg',
      '/images/materials/parallel_kitchen_2.jpg',
      '/images/materials/parallel_kitchen_3.jpg',
      '/images/materials/parallel_kitchen_4.jpg',
      '/images/materials/parallel_kitchen_5.jpg',
      '/images/materials/island_kitchen_10.jpg',
      '/images/materials/island_kitchen_5.jpg',
      '/images/materials/island_kitchen_6.jpg',
      '/images/materials/island_kitchen_7.jpg',
      '/images/materials/island_kitchen_8.jpg',
      '/images/materials/island_kitchen_9.jpg',
      '/images/materials/island_kitchen_1.jpg',
      '/images/materials/island_kitchen_2.jpg',
      '/images/materials/island_kitchen_3.jpg',
      '/images/materials/island_kitchen_4.jpg'
    ], 
    filters: ['Island Kitchen', 'Parallel Kitchen', 'L-Shape', 'Modern', 'Luxury'] 
  },
  { 
    name: 'Master Bedroom', 
    slug: 'master-bedroom', 
    description: 'Sanctuary interiors with walnut wood headboards, warm lighting zones, and bespoke built-in wardrobes.', 
    heroImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80', 
    details: {
      tag: 'Restful Luxury',
      headline: 'Your Bedroom, Designed for Deep Rest',
      body: 'We design bedrooms that are equal parts beautiful and functional — where the bed is the centrepiece, the storage is invisible, and the lighting shifts the mood from energising to deeply restful. Every element, from the headboard material to the wardrobe handle, is chosen to make the space feel distinctly yours.',
      includes: ['Custom Bed & Upholstered Headboard', 'Wardrobe & Walk-in Design', 'Bedside Niche & Shelf Units', 'Ambient & Task Lighting', 'False Ceiling with Cove Light', 'Study Nook or Seating Area', 'Flooring & Wall Finish Selection', 'Kids Room & Guest Room Variants'],
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      '/images/materials/bedroom_3.jpg',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80'
    ], 
    filters: ['Master Suite', 'Kids Room', 'Guest Room', 'Japandi', 'Luxury'] 
  },
  { 
    name: 'Living Room', 
    slug: 'living-room', 
    description: 'Editorial living zones crafted around natural light, marble accents, and low-profile custom furniture.', 
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80', 
    details: {
      tag: 'Curated Spaces',
      headline: 'Living Rooms That Make a Statement',
      body: 'A living room is the first thing guests experience and the last space you unwind in. We design living rooms that command attention — through feature walls, curated furniture arrangements, and lighting systems that create depth, warmth, and character in every corner.',
      includes: ['Feature Wall & Textured Panelling', 'Custom Sofa & Seating Configuration', 'TV Unit & Entertainment Wall', 'Pendant & Cove Lighting Design', 'Marble or Engineered Stone Accents', 'False Ceiling Design', 'Foyer & Entry Integration', 'Open Plan Layout Planning'],
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
    ], 
    filters: ['Minimal', 'Luxury', 'Japandi', 'TV Wall', 'Open Layout'] 
  },
  { 
    name: 'Wardrobe Systems', 
    slug: 'wardrobes', 
    description: 'Bespoke floor-to-ceiling storage with velvet drawer linings, mirror panels, and hidden pull-out trays.', 
    heroImage: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', 
    details: {
      tag: 'Organised Living',
      headline: 'Storage That Disappears Into the Design',
      body: 'Our wardrobes are engineered for one purpose — to give you more space while taking up less visual room. Floor-to-ceiling builds, walk-in dressing rooms, and sleek sliding panels are all delivered with velvet-lined drawers, mirror integration, and precision-fit internal organizers that work as hard as they look good.',
      includes: ['Sliding & Hinged Door Options', 'Walk-in Dressing Room Design', 'Custom Internal Organizers', 'Shoe Racks & Accessory Trays', 'Mirror Panel Integration', 'Soft-Close Hardware', 'Laminate / Lacquer / PU Finish', 'Loft & Overhead Storage'],
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1558882224-dda166733079?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
    ], 
    filters: ['Walk-in', 'Built-in', 'Sliding', 'Modern', 'Luxury'] 
  },
  { 
    name: 'Home Office', 
    slug: 'home-office', 
    description: 'Focus zones with sound-dampening fluted panels, ergonomic wall shelving and concealed cable management.', 
    heroImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80', 
    details: {
      tag: 'Focus First',
      headline: 'A Home Office Built for Deep Work',
      body: 'Your home office should reduce friction, not create it. We design distraction-free work zones with ergonomic desk setups, concealed cable runs, built-in shelving, and acoustic treatments that let you focus — while still looking like a space you are proud to be on camera in.',
      includes: ['Ergonomic Desk & Chair Zone', 'Built-in Shelving & Storage', 'Concealed Cable Management', 'Fluted Acoustic Panels', 'Task & Ambient Lighting', 'Monitor Arm & Hardware Integration', 'Bookshelf & Display Niches', 'Folding / Murphy Bed Option'],
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=800&q=80'
    ], 
    filters: ['Minimal', 'Executive', 'Creative', 'Storage'] 
  },
  { 
    name: 'Commercial Office', 
    slug: 'commercial-office', 
    description: 'Turnkey executive workspaces designed for efficient traffic flows, acoustic panels, and brand-aligned finishes.', 
    heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80', 
    details: {
      tag: 'Productivity-First',
      headline: 'Offices That Reflect Your Brand Standard',
      body: 'A well-designed commercial office increases output, attracts talent, and communicates who you are the moment someone walks in. We plan open floors, cabin clusters, meeting rooms, and collaboration zones with precision — integrating your brand identity into every surface, from reception to the boardroom.',
      includes: ['Open Plan & Cabin Zone Design', 'Ergonomic Workstation Systems', 'Meeting & Conference Room Build', 'Manager Cabin & Director Suite', 'Reception & Lobby Design', 'Pantry & Lounge Area', 'Acoustic Treatment', 'AV & Tech Integration'],
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=800&q=80'
    ], 
    filters: ['Executive', 'Open Plan', 'Reception', 'Collaborative'] 
  },
  { 
    name: 'Pooja Room', 
    slug: 'pooja-room', 
    description: 'Sacred sanctuaries merging ancestral stone textures with sleek back-lit marble panels and warm lighting.', 
    heroImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80', 
    details: {
      tag: 'Sacred Spaces',
      headline: 'Pooja Rooms That Honour Tradition',
      body: 'We craft pooja units and dedicated prayer rooms that hold both spiritual significance and design integrity. From carved wood mandirs to sleek marble platforms with backlit panels — each piece is built to become the most meaningful corner of your home.',
      includes: ['Marble & Granite Platforms', 'Carved Wood Temple Units', 'Backlit Jali Panels', 'Integrated Diya & Lamp Holders', 'Brass & Metal Accent Details', 'Storage for Puja Items', 'Dedicated Prayer Room Design', 'Custom Temple in Teak / Rosewood'],
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80'
    ], 
    filters: ['Traditional', 'Modern', 'Marble', 'Minimal'] 
  },
  { 
    name: 'Dining Room', 
    slug: 'dining-room', 
    description: 'Refined gathering spaces with custom hardwood dining tables, feature pendant lighting, and plaster wall finishes.', 
    heroImage: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80', 
    details: {
      tag: 'Gather & Dine',
      headline: 'Dining Rooms Designed for Every Occasion',
      body: 'From intimate family dinners to grand entertaining, our dining rooms are designed to be the heart of your home. We combine statement lighting, custom joinery, and carefully chosen materials to create spaces that feel warm for everyday use and spectacular when you need them to be.',
      includes: ['Dining Table & Chair Selection', 'Crockery Unit & Buffet Design', 'Feature Pendant & Chandelier', 'Wallpaper & Textured Accent Wall', 'Flooring Pattern & Material', 'Window Treatment & Drapes', 'Bar & Drinks Cabinet Integration', 'Open Plan Dining-Living Design'],
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565183997392-2f6f122e5912?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
    ], 
    filters: ['Formal', 'Casual', 'Luxury', 'Open Plan'] 
  },
  { 
    name: 'TV Units', 
    slug: 'tv-units', 
    description: 'Custom TV walls and entertainment units that serve as the centrepiece of your living space — built-in storage, LED niches, and seamless cable management.', 
    heroImage: 'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&w=1200&q=80', 
    details: {
      tag: 'Focal Point',
      headline: 'TV Units That Define the Room',
      body: 'The TV unit is the living room centrepiece — and it should look like one. We design custom entertainment walls with LED backlit niches, closed storage, open display shelves, and seamless cable management systems that make every inch purposeful and every viewing angle cinematic.',
      includes: ['Custom TV Panel & Wall Design', 'LED Backlit Display Niches', 'Integrated Cable Management', 'Open & Closed Storage Mix', 'Floating Console Options', 'Material & Finish Coordination', 'Side Column & Tower Units', 'Soundbar & AV Equipment Integration'],
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80'
    ], 
    filters: ['Wall-Mount', 'Console', 'Backlit', 'Minimal', 'Luxury'] 
  },
  { 
    name: 'False Ceilings', 
    slug: 'false-ceilings', 
    description: 'Architectural false ceilings that transform the fifth wall — gypsum coffers, cove lighting strips, and acoustic panels for every interior.', 
    heroImage: 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=1200&q=80', 
    details: {
      tag: 'Overhead Drama',
      headline: 'Ceilings That Complete the Room',
      body: 'A false ceiling transforms the entire character of a space — adding height illusion, depth, and the perfect canvas for lighting. We design gypsum and POP false ceilings with cove lighting, tray details, coffered panels, and acoustic variants for every room from bedrooms to commercial lobbies.',
      includes: ['Gypsum & POP Ceiling Systems', 'Cove Lighting & LED Strip Integration', 'Coffered & Tray Ceiling Designs', 'Fan & Fixture Positioning', 'Acoustic Panel Options', 'Moisture-Resistant Bathroom Variants', 'Multi-Level Dropped Ceiling Design', 'Coordination with Electrical & AC Points'],
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210491892-03d54bc0b4c8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    ], 
    filters: ['Gypsum', 'POP', 'Cove Lighting', 'Coffered', 'Tray'] 
  },
  { 
    name: 'Commercial Interiors', 
    slug: 'commercial-interiors', 
    description: 'Retail showrooms, clinics, salons, and brand spaces designed to communicate identity while maximising customer experience.', 
    heroImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80', 
    details: {
      tag: 'Brand Experience',
      headline: 'Commercial Spaces That Work as Hard as You Do',
      body: 'Retail showrooms, clinics, salons, and specialty stores — each built to communicate your brand identity the moment a customer walks in. We combine flow planning, feature lighting, bespoke joinery, and compliance-ready construction into commercial interiors that convert visitors into loyal clients.',
      includes: ['Retail Display & Merchandising Layout', 'Brand Integration Design', 'Customer Flow Zone Planning', 'Feature Lighting & Spotlighting', 'Signage & Identity Elements', 'Clinic & Salon Specific Fit-outs', 'Compliance-Ready Build', 'Custom Joinery & Counter Units'],
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80'
    ], 
    filters: ['Retail', 'Showroom', 'Clinic', 'Salon', 'Luxury'] 
  },
  { 
    name: 'Reception Areas', 
    slug: 'reception-areas', 
    description: 'Striking lobby and reception spaces that communicate professionalism and set the tone for the entire building experience.', 
    heroImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80', 
    details: {
      tag: 'First Impressions',
      headline: 'Receptions That Say Everything Before You Do',
      body: 'The reception is the first physical impression of your organisation. We design statement reception desks, feature walls, curated lounge seating, and dramatic lighting that communicates authority, trust, and quality — whether for a corporate office, luxury residential tower, or healthcare facility.',
      includes: ['Statement Reception Desk Design', 'Feature Wall & Logo Branding', 'Seating Lounge & Wait Area', 'Dramatic Lighting Design', 'Signage & Wayfinding System', 'Flooring & Ceiling Coordination', 'Security & Access Integration', 'Plant & Biophilic Design'],
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80'
    ], 
    filters: ['Corporate', 'Luxury Hotel', 'Medical', 'Residential'] 
  },
  { 
    name: 'Cafes & Restaurants', 
    slug: 'cafes-restaurants', 
    description: 'Atmospheric F&B spaces built for dwell time — bespoke seating zones, bar counters, acoustic treatment, and curated ambient lighting.', 
    heroImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80', 
    details: {
      tag: 'Hospitality Design',
      headline: 'F&B Spaces Built for Atmosphere and Dwell Time',
      body: 'Great cafes and restaurants are designed before they are staffed. We create atmospheric F&B interiors that balance seating density with comfort, acoustics with energy, and brand identity with guest experience — from intimate specialty coffee bars to large-format restaurant builds.',
      includes: ['Seating Zone & Table Planning', 'Bar Counter & Barista Station', 'Ambient & Task Lighting Design', 'Acoustic Treatment & Sound Zoning', 'Menu Display & Signage', 'Custom Furniture & Upholstery', 'Kitchen Pass & Service Design', 'Outdoor & Alfresco Seating'],
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559329007-40df8a9345d8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80'
    ], 
    filters: ['Cafe', 'Restaurant', 'Bar', 'Fast Casual', 'Fine Dining'] 
  },
  { 
    name: 'Villas', 
    slug: 'villas', 
    description: 'Bespoke multi-floor villa interiors with luxury material palettes, indoor-outdoor integration, and smart home readiness.', 
    heroImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80', 
    details: {
      tag: 'Luxury Living',
      headline: 'Villa Interiors Designed Floor to Ceiling',
      body: 'A villa is the ultimate canvas for interior design. We coordinate multi-floor design narratives — from ground floor living and entertainment zones to upper-level private suites and terraces — with a singular luxury material palette, smart home readiness, and indoor-outdoor living as a design principle, not an afterthought.',
      includes: ['Multi-Floor Design Coordination', 'Luxury Material & Stone Selection', 'Indoor-Outdoor Living Integration', 'Home Theatre & AV Room', 'Private Gym & Study Design', 'Smart Home Preparation', 'Staircase & Landing Design', 'Landscaping Coordination'],
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ], 
    filters: ['Luxury', 'Contemporary', 'Traditional', 'Smart Home'] 
  },
  { 
    name: 'Apartments', 
    slug: 'apartments', 
    description: 'Smart apartment interiors that maximise every square foot — optimised storage, multi-use furniture, and neutral versatile palettes.', 
    heroImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', 
    details: {
      tag: 'Optimised Spaces',
      headline: 'Apartment Interiors That Maximise Every Square Foot',
      body: 'Smart apartment design is about precision — making 1000 sq ft live like 1400 through clever storage, multi-use furniture, and layouts that open the space up visually. We design apartments from studio configurations to 3BHK full-home packages, all with the same commitment to quality and finish.',
      includes: ['Space Optimisation Floor Planning', 'Built-in Storage Throughout', 'Multi-Use & Convertible Furniture', 'Balcony & Utility Integration', 'Compact Modular Kitchen', 'Full Home Interior Package', 'Neutral & Versatile Palette', '2BHK & 3BHK Specialisation'],
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80'
    ], 
    filters: ['Studio', '2BHK', '3BHK', 'Minimal', 'Modern'] 
  },
  { 
    name: 'Luxury Homes', 
    slug: 'luxury-homes', 
    description: 'Ultra-premium residences where every material is hand-selected, every detail is bespoke, and the result is truly one of a kind.', 
    heroImage: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80', 
    details: {
      tag: 'Signature Collection',
      headline: 'Luxury Homes With No Compromise',
      body: 'For clients who demand the extraordinary — where Italian marble is the floor, the furniture is handcrafted to specification, and the lighting is designed by an engineer. Our luxury home collection is a white-glove service from concept to key handover, with every material choice and every detail validated against a single standard: excellence.',
      includes: ['Italian Marble & Exotic Stone Selection', 'Custom Artisan Furniture & Joinery', 'Private Gym, Spa & Wellness Room', 'Wine Cellar & Cigar Lounge Design', 'Home Theatre & Screening Room', 'Smart Home Full Integration', 'Bespoke Lighting Design', 'White-Glove Turnkey Delivery'],
    },
    galleryImages: [
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ], 
    filters: ['Penthouse', 'Villa', 'Bungalow', 'Italian Marble', 'Bespoke'] 
  },
];

const slides = [
  {
    before: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1920&q=90',
    after: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=90',
    title: 'Living Rooms'
  },
  {
    before: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=1920&q=90',
    after: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1920&q=90',
    title: 'Modular Kitchens'
  },
  {
    before: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=90',
    after: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1920&q=90',
    title: 'Master Bedrooms'
  }
];

const GALLERY_IMAGE_TAGS = {
  // Modular Kitchen
  'user_luxury_kitchen_6.jpg': ['Island Kitchen', 'Luxury'],
  'user_luxury_kitchen_7.jpg': ['L-Shape', 'Luxury'],
  'user_luxury_kitchen_8.jpg': ['L-Shape', 'Luxury'],
  'user_luxury_kitchen_1.jpg': ['Island Kitchen', 'Luxury'],
  'user_luxury_kitchen_2.jpg': ['Island Kitchen', 'Luxury'],
  'user_luxury_kitchen_3.jpg': ['Island Kitchen', 'Luxury'],
  'user_luxury_kitchen_4.jpg': ['Island Kitchen', 'Luxury'],
  'user_luxury_kitchen_5.jpg': ['Parallel Kitchen', 'Luxury'],
  'user_l_shape_kitchen_5.jpg': ['L-Shape'],
  'user_l_shape_kitchen_6.jpg': ['L-Shape'],
  'user_l_shape_kitchen_7.jpg': ['L-Shape'],
  'user_l_shape_kitchen_8.jpg': ['L-Shape'],
  'user_l_shape_kitchen_1.jpg': ['L-Shape'],
  'user_l_shape_kitchen_2.jpg': ['L-Shape'],
  'user_l_shape_kitchen_3.jpg': ['L-Shape'],
  'user_l_shape_kitchen_4.jpg': ['L-Shape'],
  'l_shape_kitchen_1.png': ['L-Shape'],
  'l_shape_kitchen_2.png': ['L-Shape'],
  'parallel_kitchen_6.jpg': ['Parallel Kitchen'],
  'parallel_kitchen_7.jpg': ['Parallel Kitchen'],
  'parallel_kitchen_8.jpg': ['Parallel Kitchen'],
  'parallel_kitchen_9.png': ['Parallel Kitchen'],
  'parallel_kitchen_1.jpg': ['Parallel Kitchen'],
  'parallel_kitchen_2.jpg': ['Parallel Kitchen', 'Modern'],
  'parallel_kitchen_3.jpg': ['Parallel Kitchen'],
  'parallel_kitchen_4.jpg': ['Parallel Kitchen', 'Modern'],
  'parallel_kitchen_5.jpg': ['Parallel Kitchen'],
  'island_kitchen_10.jpg': ['Island Kitchen'],
  'island_kitchen_5.jpg': ['Island Kitchen', 'Modern'],
  'island_kitchen_6.jpg': ['Island Kitchen', 'Modern'],
  'island_kitchen_7.jpg': ['Island Kitchen', 'Modern'],
  'island_kitchen_8.jpg': ['Island Kitchen', 'Modern'],
  'island_kitchen_9.jpg': ['Island Kitchen', 'Modern'],
  'island_kitchen_1.jpg': ['Island Kitchen'],
  'island_kitchen_2.jpg': ['Island Kitchen'],
  'island_kitchen_3.jpg': ['Island Kitchen', 'Modern'],
  'island_kitchen_4.jpg': ['Island Kitchen'],

  // Master Bedroom
  'photo-1590490360182-c33d57733427': ['Master Suite', 'Luxury'],
  'photo-1505693416388-ac5ce068fe85': ['Master Suite', 'Japandi'],
  'bedroom_3.jpg': ['Master Suite', 'Japandi', 'Luxury'],
  'photo-1595526114035-0d45ed16cfbf': ['Kids Room', 'Japandi'],
  'photo-1540518614846-7eded433c457': ['Guest Room', 'Luxury'],
  'photo-1566665797739-1674de7a421a': ['Guest Room', 'Japandi'],
  'photo-1522771739844-6a9f6d5f14af': ['Kids Room', 'Japandi'],
  'photo-1583847268964-b28dc8f51f92': ['Master Suite', 'Luxury'],

  // Living Room
  'photo-1600210492486-724fe5c67fb0': ['Minimal', 'Japandi'],
  'photo-1600596542815-ffad4c1539a9': ['Luxury', 'Open Layout'],
  'photo-1600585154340-be6161a56a0c': ['Minimal', 'Open Layout'],
  'photo-1600607687939-ce8a6c25118c': ['Japandi', 'TV Wall'],
  'photo-1600566753190-17f0baa2a6c3': ['Minimal', 'TV Wall'],
  'photo-1613490493576-7fde63acd811': ['Luxury', 'Open Layout'],
  'photo-1613977257363-707ba9348227': ['Japandi', 'Minimal'],
  'photo-1512917774080-9991f1c4c750': ['Luxury', 'Open Layout'],

  // Wardrobe Systems
  'photo-1558882224-dda166733079': ['Built-in', 'Modern'],
  'photo-1595428774223-ef52624120d2': ['Walk-in', 'Luxury'],
  'photo-1505693416388-ac5ce068fe85': ['Built-in', 'Modern'],
  'photo-1522771739844-6a9f6d5f14af': ['Built-in', 'Modern'],
  'photo-1583847268964-b28dc8f51f92': ['Walk-in', 'Luxury'],
  'photo-1600585154526-990dced4db0d': ['Walk-in', 'Luxury'],
  'photo-1618221195710-dd6b41faaea6': ['Sliding', 'Modern'],
  'photo-1560448204-e02f11c3d0e2': ['Sliding', 'Luxury'],

  // Home Office
  'photo-1524758631624-e2822e304c36': ['Minimal', 'Executive'],
  'photo-1497366216548-37526070297c': ['Minimal', 'Executive'],
  'photo-1497366412874-3415097a27e7': ['Executive', 'Storage'],
  'photo-1497215728101-856f4ea42174': ['Minimal', 'Executive'],
  'photo-1586023492125-27b2c045efd7': ['Creative', 'Storage'],
  'photo-1507679799987-c73779587ccf': ['Executive', 'Minimal'],
  'photo-1519389950473-47ba0277781c': ['Creative', 'Storage'],
  'photo-1531538606174-0f90ff5dce83': ['Creative', 'Minimal'],

  // Commercial Office
  'photo-1497366216548-37526070297c': ['Executive', 'Open Plan'],
  'photo-1497215728101-856f4ea42174': ['Executive', 'Open Plan'],
  'photo-1524758631624-e2822e304c36': ['Executive', 'Collaborative'],
  'photo-1497366811353-6870744d04b2': ['Open Plan', 'Collaborative'],
  'photo-1504384308090-c894fdcc538d': ['Open Plan', 'Reception'],
  'photo-1531973576160-7125cd663d86': ['Executive', 'Open Plan'],
  'photo-1519389950473-47ba0277781c': ['Collaborative', 'Reception'],
  'photo-1531538606174-0f90ff5dce83': ['Open Plan', 'Collaborative'],

  // Pooja Room
  'photo-1600566753190-17f0baa2a6c3': ['Traditional', 'Marble'],
  'photo-1600596542815-ffad4c1539a9': ['Modern', 'Marble'],
  'photo-1600210492486-724fe5c67fb0': ['Modern', 'Minimal'],
  'photo-1600585154340-be6161a56a0c': ['Modern', 'Minimal'],
  'photo-1600607687939-ce8a6c25118c': ['Traditional', 'Marble'],
  'photo-1618221195710-dd6b41faaea6': ['Modern', 'Minimal'],
  'photo-1600585154526-990dced4db0d': ['Modern', 'Marble'],
  'photo-1507089947368-19c1da9775ae': ['Modern', 'Minimal'],

  // Dining Room
  'photo-1600607687939-ce8a6c25118c': ['Formal', 'Luxury'],
  'photo-1600585154340-be6161a56a0c': ['Casual', 'Open Plan'],
  'photo-1560448204-e02f11c3d0e2': ['Casual', 'Open Plan'],
  'photo-1502672260266-1c1ef2d93688': ['Casual', 'Open Plan'],
  'photo-1484154218962-a197022b5858': ['Casual', 'Open Plan'],
  'photo-1556911220-e15b29be8c8f': ['Formal', 'Open Plan'],
  'photo-1565183997392-2f6f122e5912': ['Formal', 'Luxury'],
  'photo-1556909114-f6e7ad7d3136': ['Formal', 'Luxury'],
};

const getTagsForImage = (imgUrl) => {
  if (!imgUrl) return [];
  for (const [key, tags] of Object.entries(GALLERY_IMAGE_TAGS)) {
    if (imgUrl.includes(key)) {
      return tags;
    }
  }
  return [];
};

const WhatWeDo = () => {
  const { slug } = useParams();
  const [activeFilter, setActiveFilter] = useState('All');
  const heroRef = useRef(null);
  const [sliderPos, setSliderPos] = useState(50);
  const [containerWidth, setContainerWidth] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    setVisibleCount(6);
  }, [activeFilter, slug]);
  const isDragging = useRef(false);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlideIdx((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Measure container width for the absolute before image scaling
  useEffect(() => {
    if (!heroRef.current) return;
    setContainerWidth(heroRef.current.clientWidth);

    const handleResize = () => {
      if (heroRef.current) {
        setContainerWidth(heroRef.current.clientWidth);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [slug]);

  const handleMove = (clientX) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pos);
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const onTouchMove = (e) => {
    if (!isDragging.current) return;
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const onStart = () => {
    isDragging.current = true;
  };

  const onEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchend', onEnd);
    };
  }, []);

  // Scroll-driven parallax — same as Home
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end end'],
  });
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 0.95]);
  const bgY     = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);
  const textY   = useTransform(scrollYProgress, [0, 1], ['0px', '-40px']);
  const textOp  = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.9, 0]);

  const displayCategories = mockCategories;
  const activeCategory = slug ? displayCategories.find(c => c.slug === slug) : null;

  // ── CATEGORY DETAIL PAGE ───────────────────────────────────────────────────
  if (activeCategory) {
    const filters = ['All', ...(activeCategory.filters || [])];
    const filteredImages = (activeCategory.galleryImages || []).filter(img => {
      if (activeFilter === 'All') return true;
      const tags = getTagsForImage(img);
      return tags.includes(activeFilter);
    });
    const visibleImages = activeFilter === 'All' ? filteredImages.slice(0, visibleCount) : filteredImages;
    return (
      <div className="bg-bg min-h-screen">
        <SEO title={`${activeCategory.name} Interiors — ESPACIO`} description={activeCategory.description} url={`/what-we-do/${activeCategory.slug}`} />

        {/* Hero */}
        <section className="relative h-[70vh] bg-bg-dark flex items-end">
          <img src={activeCategory.heroImage} alt={activeCategory.name} className="absolute inset-0 w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/40 to-transparent" />
          <div className="relative max-w-[1440px] w-full mx-auto px-6 md:px-10 pb-16 z-10">
            <nav className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-widest text-bg/50 mb-5">
              <Link to="/" className="hover:text-gold transition-colors">Home</Link>
              <span>/</span>
              <Link to="/what-we-do" className="hover:text-gold transition-colors">Spaces</Link>
              <span>/</span>
              <span className="text-gold">{activeCategory.name}</span>
            </nav>
            <h1 className="font-display text-[clamp(36px,5vw,64px)] font-bold text-bg leading-tight tracking-tight mb-4">{activeCategory.name}</h1>
            <p className="font-sans text-[14px] text-bg/60 max-w-[500px] leading-relaxed">{activeCategory.description}</p>
          </div>
        </section>

        {/* Filter Chips */}
        <div className="sticky top-[68px] z-30 bg-bg/95 backdrop-blur-xl border-b border-ink-border py-4">
          <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex items-center gap-2 overflow-x-auto">
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)}
                className={`shrink-0 font-sans text-[11px] font-semibold uppercase tracking-widest px-4 py-2 rounded-pill transition-all duration-200 ${
                  activeFilter === f ? 'bg-ink text-bg' : 'bg-bg-card text-ink-soft hover:text-ink border border-ink-border'
                }`}>{f}</button>
            ))}
          </div>
        </div>

        {/* Category Info Block */}
        {activeCategory.details && (
          <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-16 border-b border-ink-border">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <Reveal>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-gold mb-3">{activeCategory.details.tag}</p>
                <h2 className="font-display text-[clamp(26px,3vw,40px)] font-bold tracking-tight text-ink leading-tight mb-5">{activeCategory.details.headline}</h2>
                <p className="font-sans text-[15px] text-ink-soft leading-relaxed mb-8">{activeCategory.details.body}</p>
                <Link to="/contact" className="btn-primary w-fit inline-flex items-center gap-2">
                  Enquire About This <ArrowUpRight size={13} />
                </Link>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-widest text-ink-muted mb-5">What's Included</p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeCategory.details.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 font-sans text-[13.5px] text-ink-soft">
                      <span className="mt-1 w-4 h-4 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold block" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </section>
        )}

        {/* Gallery Grid */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-16">
          {filteredImages.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {visibleImages.map((img, idx) => (
                  <Reveal key={img} delay={Math.min(idx * 0.03, 0.12)}>
                    <div className={`rounded-card overflow-hidden group ${idx % 3 === 0 ? 'md:col-span-2' : ''}`}>
                      <img src={img} alt={`${activeCategory.name} ${idx + 1}`} loading="lazy" decoding="async"
                        className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ${idx % 3 === 0 ? 'aspect-video' : 'aspect-[4/3]'}`} />
                    </div>
                  </Reveal>
                ))}
              </div>
              {activeFilter === 'All' && filteredImages.length > visibleCount && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => setVisibleCount(filteredImages.length)}
                    className="font-sans text-[11px] font-bold uppercase tracking-widest px-8 py-4 border border-ink hover:bg-ink hover:text-bg transition-all duration-300 rounded-pill"
                  >
                    See More
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="font-sans text-sm text-ink-soft">No designs found matching the selected style.</p>
            </div>
          )}
        </section>

        {/* Related Spaces */}
        <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-14 border-t border-ink-border">
          <Reveal>
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-gold">Explore All Categories</span>
                <h2 className="font-display text-[24px] md:text-[28px] font-bold text-ink mt-1">Explore Related Spaces & Services</h2>
              </div>
              <span className="font-sans text-xs text-ink-muted uppercase tracking-wider font-semibold hidden sm:block">Scroll to view all 15+ spaces →</span>
            </div>
          </Reveal>

          <div className="flex gap-5 overflow-x-auto pb-6 pt-2 scrollbar-thin scrollbar-thumb-gold/30">
            {displayCategories.filter(c => c.slug !== activeCategory.slug).map((cat, idx) => (
              <Link key={idx} to={`/what-we-do/${cat.slug}`} className="shrink-0 w-52 sm:w-60 group">
                <div className="aspect-[3/4] rounded-card overflow-hidden mb-3 relative border border-ink-border/20 shadow-sm group-hover:shadow-xl group-hover:border-gold/50 transition-all duration-500">
                  <img src={cat.heroImage} alt={cat.name} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-bg-dark/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div>
                      <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gold block mb-0.5">{cat.details?.tag || 'Space'}</span>
                      <span className="font-display text-[15px] font-bold text-bg leading-tight block group-hover:text-gold transition-colors">{cat.name}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-bg group-hover:bg-gold group-hover:text-ink transition-all shrink-0">
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>


      </div>
    );
  }

  // ── HUB GRID PAGE ─────────────────────────────────────────────────────────
  return (
    <div className="bg-bg min-h-screen">
      <SEO title="Space Explorer — ESPACIO Interiors" description="Browse room design categories: kitchens, living rooms, bedrooms, offices, pooja rooms, and wardrobes by ESPACIO." url="/what-we-do" />

      {/* ── ROUNDED CARD HERO (Interactive Before/After Slider) ── */}
      <section
        ref={heroRef}
        className="relative h-[80vh] lg:h-[95vh] px-5 pt-5 pb-[10px] lg:px-12 select-none"
        onMouseDown={onStart}
        onMouseMove={onMouseMove}
        onTouchStart={() => { setIsPaused(true); onStart(); }}
        onTouchMove={onTouchMove}
        onTouchEnd={() => { setIsPaused(false); onEnd(); }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onClick={(e) => handleMove(e.clientX)}
      >
        {/* The rounded card container */}
        <div
          className="relative w-full h-full overflow-hidden rounded-[24px] lg:rounded-[40px] cursor-ew-resize bg-bg-dark"
        >
          {/* AFTER Image Layers (Base Layers - Parallax applied) */}
          {slides.map((slide, idx) => (
            <motion.div
              key={`after-${idx}`}
              style={{ scale: bgScale, y: bgY }}
              className="absolute inset-0 w-full h-full will-change-transform overflow-hidden pointer-events-none"
              animate={{ opacity: idx === currentSlideIdx ? 1 : 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <img
                src={slide.after}
                alt={`After ${slide.title}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </motion.div>
          ))}
          
          {/* AFTER Label */}
          <div className="absolute right-8 bottom-8 z-0 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none">
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-white">AFTER</span>
          </div>

          {/* BEFORE Image Layers (Overlay Crop Layer) */}
          <div
            className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none z-10"
            style={{ width: `${sliderPos}%` }}
          >
            {/* Wrapper forced to full client width to prevent distortion */}
            <div className="absolute inset-y-0 left-0 h-full" style={{ width: containerWidth || '100vw' }}>
              {slides.map((slide, idx) => (
                <motion.div
                  key={`before-${idx}`}
                  style={{ scale: bgScale, y: bgY }}
                  className="absolute inset-0 w-full h-full will-change-transform overflow-hidden pointer-events-none"
                  animate={{ opacity: idx === currentSlideIdx ? 1 : 0 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                >
                  <img
                    src={slide.before}
                    alt={`Before ${slide.title}`}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </motion.div>
              ))}
            </div>
          </div>
          {/* BEFORE Label */}
          <div 
            className="absolute left-8 bottom-8 z-20 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none transition-opacity duration-150"
            style={{ opacity: sliderPos > 12 ? 1 : 0 }}
          >
            <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-white">BEFORE</span>
          </div>

          {/* Slider Line Divider */}
          <div
            className="absolute inset-y-0 w-0.5 bg-gold/90 z-25 pointer-events-none shadow-[0_0_15px_rgba(212,175,55,0.6)]"
            style={{ left: `${sliderPos}%` }}
          />

          {/* Slider Drag Handle */}
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gold hover:scale-105 active:scale-95 transition-transform flex items-center justify-center cursor-ew-resize shadow-2xl border-2 border-white/10 z-30"
            style={{ left: `${sliderPos}%` }}
          >
            {/* Drag Handle Icon (Left/Right Arrows) */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-bg-dark">
              <polyline points="8 18 2 12 8 6" />
              <polyline points="16 6 22 12 16 18" />
              <line x1="2" y1="12" x2="22" y2="12" />
            </svg>
          </div>

          {/* Text block overlay (Parallax matching main layout) */}
          <motion.div
            style={{ y: textY, opacity: textOp }}
            className="absolute inset-0 z-20 flex flex-col justify-end pointer-events-none"
          >
            <div className="w-full px-8 md:px-12 pb-10 md:pb-14">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start gap-4"
              >
                {/* Pill label */}
                <div className="inline-flex items-center gap-2 bg-black/55 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em]">Spaces</span>
                </div>

                {/* Main heading */}
                <h1 className="font-display font-bold leading-none tracking-tight text-white transition-all duration-500"
                  style={{ fontSize: 'clamp(44px, 7vw, 96px)' }}>
                  {slides[currentSlideIdx].title}
                </h1>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayCategories.map((cat, idx) => (
            <Reveal key={idx} delay={Math.min((idx % 2) * 0.05, 0.1)}>
              <Link to={`/what-we-do/${cat.slug}`}
                className="group relative rounded-card overflow-hidden aspect-[4/3] bg-bg-dark block">
                  <img src={cat.heroImage} alt={cat.name} loading="lazy" decoding="async"
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 via-bg-dark/20 to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                    <div>
                      <h2 className="font-display text-[clamp(20px,2.5vw,28px)] font-bold text-bg mb-2 group-hover:text-gold transition-colors duration-300">
                        {cat.name}
                      </h2>
                      <p className="font-sans text-[13px] text-bg/60 max-w-[280px] leading-relaxed opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                        {cat.description?.substring(0, 85)}...
                      </p>
                    </div>
                    <div className="shrink-0 w-10 h-10 rounded-pill border border-bg/20 flex items-center justify-center text-bg group-hover:bg-gold group-hover:border-gold group-hover:text-ink transition-all duration-300">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))
          }
        </div>
      </section>


    </div>
  );
};

export default WhatWeDo;
