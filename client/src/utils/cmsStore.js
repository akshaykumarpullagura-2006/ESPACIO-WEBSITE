import axios from 'axios';

// Shared space for real-time parallel synchronization between Admin CMS and Public Website

// Shared helper to upload an image file and return a clean, short permanent URL (/uploads/file.jpg)
export const uploadImageFile = async (file) => {
  if (!file) return null;
  const safeName = file.name.replace(/\s+/g, '_');
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target.result;
      try {
        const res = await axios.post('/upload-media', { fileName: file.name, base64 });
        if (res.data && res.data.success && res.data.url) {
          resolve(res.data.url);
          return;
        }
      } catch (err) {
        console.warn('/upload-media endpoint warning:', err);
      }
      resolve(`/uploads/${safeName}`);
    };
    reader.readAsDataURL(file);
  });
};

export const STORAGE_KEYS = {
  PROJECTS: 'espacio_cms_projects',
  PRODUCTS: 'espacio_cms_products',
  SETTINGS: 'espacio_cms_settings',
  TESTIMONIALS: 'espacio_cms_testimonials',
  FAQS: 'espacio_cms_faqs',
  ENQUIRIES: 'espacio_cms_enquiries',
  ADMIN_USERS: 'espacio_cms_admin_users',
  AUDIT_LOGS: 'espacio_cms_audit_logs',
  MEDIA: 'espacio_cms_media',
};

// Dispatch change event to all tabs and active components
export const notifyCMSUpdate = () => {
  window.dispatchEvent(new Event('espacio_cms_update'));
};

// Get stored data with fallback
export const getCMSData = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage:`, err);
  }
  return fallback;
};

// Set stored data and broadcast real-time update
export const setCMSData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    notifyCMSUpdate();
  } catch (err) {
    console.warn(`Error saving ${key} to localStorage:`, err);
  }
};

// Seed default media library items
const DEFAULT_MEDIA_ITEMS = [
  {
    id: 'media-1',
    fileName: 'user_uploaded_bedroom.jpg',
    originalName: 'media_1787072367913.jpg',
    imageUrl: '/images/user_uploaded_bedroom.jpg',
    thumbnailUrl: '/images/user_uploaded_bedroom.jpg',
    altText: 'Bespoke Luxury Master Bedroom Suite with Warm Beige Tones and Fluted Panels',
    caption: 'Master Bedroom Suite Turnkey Interior',
    category: 'Home',
    fileType: 'JPG',
    fileSize: '247.9 KB',
    width: 1920,
    height: 1080,
    createdAt: '2026-08-18T17:00:00Z',
    updatedAt: '2026-08-18T17:00:00Z'
  },
  {
    id: 'media-2',
    fileName: 'about_hero_interior.png',
    originalName: 'about_hero_interior.png',
    imageUrl: '/images/about_hero_interior.png',
    thumbnailUrl: '/images/about_hero_interior.png',
    altText: 'ESPACIO Luxury Interior Architecture Studio',
    caption: 'Hero Architectural Living Area',
    category: 'About',
    fileType: 'PNG',
    fileSize: '793 KB',
    width: 1920,
    height: 1080,
    createdAt: '2026-08-18T16:00:00Z',
    updatedAt: '2026-08-18T16:00:00Z'
  },
  {
    id: 'media-3',
    fileName: 'about_heritage_build.png',
    originalName: 'about_heritage_build.png',
    imageUrl: '/images/about_heritage_build.png',
    thumbnailUrl: '/images/about_heritage_build.png',
    altText: 'Four Decades of Civil Engineering & Heritage Craftsmanship',
    caption: 'Civil Structural Heritage Execution',
    category: 'About',
    fileType: 'PNG',
    fileSize: '766 KB',
    width: 1600,
    height: 900,
    createdAt: '2026-08-18T16:00:00Z',
    updatedAt: '2026-08-18T16:00:00Z'
  },
  {
    id: 'media-4',
    fileName: 'faq_designer.jpg',
    originalName: 'faq_designer.jpg',
    imageUrl: '/images/faq_designer.jpg',
    thumbnailUrl: '/images/faq_designer.jpg',
    altText: 'ESPACIO Senior Designer Consultation',
    caption: 'Consultation & Spatial Planning',
    category: 'General',
    fileType: 'JPG',
    fileSize: '71.7 KB',
    width: 800,
    height: 600,
    createdAt: '2026-08-18T16:00:00Z',
    updatedAt: '2026-08-18T16:00:00Z'
  },
  {
    id: 'media-5',
    fileName: 'modernist_penthouse_lounge.jpg',
    originalName: 'unsplash_penthouse.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1920&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=400&q=70',
    altText: 'Modernist Penthouse Living Lounge with Panoramic Floor-to-Ceiling Windows',
    caption: 'Jubilee Hills Penthouse Project',
    category: 'Projects',
    fileType: 'JPG',
    fileSize: '1.2 MB',
    width: 1920,
    height: 1280,
    createdAt: '2026-08-18T15:00:00Z',
    updatedAt: '2026-08-18T15:00:00Z'
  },
  {
    id: 'media-6',
    fileName: 'lakeside_sanctuary_villa.jpg',
    originalName: 'unsplash_villa.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=70',
    altText: 'Lakeside Sanctuary Luxury Villa Interior Architecture',
    caption: 'Lakeside Villa Living Suite',
    category: 'Projects',
    fileType: 'JPG',
    fileSize: '1.4 MB',
    width: 1920,
    height: 1280,
    createdAt: '2026-08-18T15:00:00Z',
    updatedAt: '2026-08-18T15:00:00Z'
  },
  {
    id: 'media-7',
    fileName: 'italian_modular_kitchen.jpg',
    originalName: 'unsplash_kitchen.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=70',
    altText: 'Bespoke Italian Modular Kitchen with Quartz Island Countertops',
    caption: 'Italian Modular Kitchen Execution',
    category: 'Services',
    fileType: 'JPG',
    fileSize: '1.1 MB',
    width: 1920,
    height: 1280,
    createdAt: '2026-08-18T14:00:00Z',
    updatedAt: '2026-08-18T14:00:00Z'
  },
  {
    id: 'media-8',
    fileName: 'acoustic_wpc_wall_paneling.jpg',
    originalName: 'unsplash_wpc.jpg',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=90',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=400&q=70',
    altText: 'Fluted Acoustic WPC Wall Paneling & Architectural Wood Decor',
    caption: 'Material Sourcing: Acoustic WPC Panels',
    category: 'Materials',
    fileType: 'JPG',
    fileSize: '1.3 MB',
    width: 1920,
    height: 1280,
    createdAt: '2026-08-18T14:00:00Z',
    updatedAt: '2026-08-18T14:00:00Z'
  }
];

// Retrieve media items with fallback and ensure uploaded bedroom image is present
export const getMediaItems = () => {
  const stored = getCMSData(STORAGE_KEYS.MEDIA);
  const settingsStored = getCMSData(STORAGE_KEYS.SETTINGS);
  
  let items = [];
  if (stored && Array.isArray(stored) && stored.length > 0) {
    items = stored;
  } else if (settingsStored && Array.isArray(settingsStored.media_gallery_items) && settingsStored.media_gallery_items.length > 0) {
    items = settingsStored.media_gallery_items;
  } else {
    items = DEFAULT_MEDIA_ITEMS;
  }

  const hasBedroom = items.some(item => 
    item.imageUrl === '/images/user_uploaded_bedroom.jpg' || 
    item.fileName === 'user_uploaded_bedroom.jpg' ||
    item.originalName === 'media_1787072367913.jpg'
  );

  if (!hasBedroom) {
    items = [DEFAULT_MEDIA_ITEMS[0], ...items];
  }

  setCMSData(STORAGE_KEYS.MEDIA, items);
  return items;
};

// Save media items locally and persist permanently to MongoDB Database
export const saveMediaItems = async (items) => {
  setCMSData(STORAGE_KEYS.MEDIA, items);
  try {
    const settings = getCMSData(STORAGE_KEYS.SETTINGS) || {};
    const updatedSettings = { ...settings, media_gallery_items: items };
    setCMSData(STORAGE_KEYS.SETTINGS, updatedSettings);
    await axios.put('/settings', { media_gallery_items: items });
  } catch (err) {
    console.warn('Database settings media save warning:', err);
  }
};

// Check if an image URL is currently in use across the CMS settings, projects, or products
export const checkImageUsageInCMS = (imageUrl) => {
  if (!imageUrl) return [];
  const locations = [];
  const target = imageUrl.trim();

  // 1. Check Site Settings
  const settings = getCMSData(STORAGE_KEYS.SETTINGS) || {};
  if (Array.isArray(settings.hero_bg_images) && settings.hero_bg_images.includes(target)) {
    locations.push('Home Page Hero Background Slider');
  }
  if (settings.hero_card_image === target) {
    locations.push('Home Page Floating Feature Card');
  }
  if (settings.services_bg_image === target) {
    locations.push('Services CMS Header Background');
  }
  if (settings.spaces_bg_image === target) {
    locations.push('Spaces CMS Header Background');
  }
  if (settings.materials_bg_image === target) {
    locations.push('Materials CMS Header Background');
  }
  if (settings.about_bg_image === target) {
    locations.push('About CMS Header Background');
  }
  if (settings.contact_bg_image === target) {
    locations.push('Contact CMS Header Background');
  }
  if (settings.footer_bg_image === target) {
    locations.push('Footer CMS Background');
  }
  if (settings.cta_bg_image === target) {
    locations.push('Global CTA Banner Background');
  }

  // 2. Check Projects
  const projects = getCMSData(STORAGE_KEYS.PROJECTS) || [];
  projects.forEach((proj) => {
    if (proj.heroImage === target) {
      locations.push(`Projects CMS: "${proj.title || 'Untitled'}" (Hero Cover)`);
    }
    if (Array.isArray(proj.gallery) && proj.gallery.includes(target)) {
      locations.push(`Projects CMS: "${proj.title || 'Untitled'}" (Gallery)`);
    }
  });

  // 3. Check Products
  const products = getCMSData(STORAGE_KEYS.PRODUCTS) || [];
  products.forEach((prod) => {
    if (prod.heroImage === target || prod.image === target) {
      locations.push(`Products CMS: "${prod.title || prod.name || 'Untitled'}" (Cover)`);
    }
    if (Array.isArray(prod.images) && prod.images.includes(target)) {
      locations.push(`Products CMS: "${prod.title || prod.name || 'Untitled'}" (Gallery)`);
    }
  });

  return locations;
};

