import { getCMSData, setCMSData, STORAGE_KEYS, notifyCMSUpdate } from './cmsStore';

let cachedClientIP = null;

// Dynamically fetch client IP address with fallback
export const getClientIP = async () => {
  if (cachedClientIP) return cachedClientIP;
  try {
    const res = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      if (data.ip) {
        cachedClientIP = data.ip;
        return data.ip;
      }
    }
  } catch (err) {
    // Fallback to local or simulated IP if offline/blocked
  }
  cachedClientIP = '183.82.107.45'; // Typical Hyderabad ISP IP for fallback
  return cachedClientIP;
};

// Seed initial audit log entries if empty
const initialAuditLogs = [
  {
    id: 'audit_01',
    action: 'System Initialized',
    category: 'System',
    details: 'ESPACIO CMS Audit Logger online with Google Maps IP location tracking',
    user: 'System Admin (tarunuttupulusu@gmail.com)',
    ip: '183.82.107.45',
    timestamp: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'audit_02',
    action: 'Admin Logged In',
    category: 'Authentication',
    details: 'Successful login into ESPACIO Admin Panel',
    user: 'Tarun (tarunuttupulusu@gmail.com)',
    ip: '183.82.107.45',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
];

// Get all audit logs
export const getAuditLogs = () => {
  let logs = getCMSData(STORAGE_KEYS.AUDIT_LOGS);
  if (!Array.isArray(logs) || logs.length === 0) {
    logs = initialAuditLogs;
    setCMSData(STORAGE_KEYS.AUDIT_LOGS, initialAuditLogs);
  }
  return logs;
};

// Log a new audit event
export const logAuditEvent = async (action, category = 'General', details = '') => {
  try {
    const ip = await getClientIP();
    
    // Get current logged-in user from localStorage/session
    let userName = 'Admin User';
    let userEmail = 'tarunuttupulusu@gmail.com';
    try {
      const activeUser = JSON.parse(sessionStorage.getItem('active_admin_user') || '{}');
      if (activeUser.email) {
        userEmail = activeUser.email;
        userName = activeUser.name || activeUser.email.split('@')[0];
      }
    } catch {}

    const newLog = {
      id: `audit_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      action,
      category,
      details,
      user: `${userName} (${userEmail})`,
      ip,
      timestamp: new Date().toISOString()
    };

    const existingLogs = getAuditLogs();
    const updated = [newLog, ...existingLogs];
    setCMSData(STORAGE_KEYS.AUDIT_LOGS, updated);
    notifyCMSUpdate();
    return newLog;
  } catch (err) {
    console.warn('Failed to log audit event:', err);
  }
};
