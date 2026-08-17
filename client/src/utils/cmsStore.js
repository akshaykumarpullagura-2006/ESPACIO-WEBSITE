// Shared space for real-time parallel synchronization between Admin CMS and Public Website

export const STORAGE_KEYS = {
  PROJECTS: 'espacio_cms_projects',
  PRODUCTS: 'espacio_cms_products',
  SETTINGS: 'espacio_cms_settings',
  TESTIMONIALS: 'espacio_cms_testimonials',
  FAQS: 'espacio_cms_faqs',
  ENQUIRIES: 'espacio_cms_enquiries',
  ADMIN_USERS: 'espacio_cms_admin_users',
  AUDIT_LOGS: 'espacio_cms_audit_logs',
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
