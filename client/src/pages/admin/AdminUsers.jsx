import React, { useState, useEffect } from 'react';
import { UserPlus, Shield, Trash2, CheckCircle2, XCircle, Key, Mail, User, Lock, RefreshCw, AlertCircle } from 'lucide-react';
import { getCMSData, setCMSData, STORAGE_KEYS, notifyCMSUpdate } from '../../utils/cmsStore';
import { logAuditEvent } from '../../utils/auditStore';

const seedAdminUsers = [
  {
    id: 'usr_01',
    name: 'Tarun (Super Admin)',
    email: 'tarunuttupulusu@gmail.com',
    password: 'tarun2314638',
    role: 'Super Admin',
    active: true,
    createdAt: '2026-08-01T10:00:00.000Z'
  }
];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Editor'
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadUsers = () => {
    try {
      let stored = getCMSData(STORAGE_KEYS.ADMIN_USERS);
      if (!Array.isArray(stored) || stored.length === 0) {
        stored = seedAdminUsers;
        setCMSData(STORAGE_KEYS.ADMIN_USERS, seedAdminUsers);
      }
      setUsers(stored);
    } catch (err) {
      setUsers(seedAdminUsers);
    }
  };

  useEffect(() => {
    loadUsers();
    window.addEventListener('espacio_cms_update', loadUsers);
    window.addEventListener('storage', loadUsers);
    return () => {
      window.removeEventListener('espacio_cms_update', loadUsers);
      window.removeEventListener('storage', loadUsers);
    };
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setErrorMsg('All fields are required.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    const emailLower = formData.email.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === emailLower);
    if (existing) {
      setErrorMsg('An admin account with this email address already exists.');
      return;
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name: formData.name.trim(),
      email: emailLower,
      password: formData.password.trim(),
      role: formData.role,
      active: true,
      createdAt: new Date().toISOString()
    };

    const updated = [newUser, ...users];
    setUsers(updated);
    setCMSData(STORAGE_KEYS.ADMIN_USERS, updated);
    notifyCMSUpdate();

    // Log Audit Event
    await logAuditEvent('Created Admin User', 'User Management', `Added new ${formData.role} account for ${newUser.name} (${newUser.email})`);

    setSuccessMsg(`Admin user ${newUser.name} created successfully! They can now log in with these credentials.`);
    setFormData({ name: '', email: '', password: '', role: 'Editor' });
    setShowAddModal(false);
  };

  const handleToggleUserStatus = async (user) => {
    if (user.email === 'tarunuttupulusu@gmail.com') return; // Protect primary super admin
    const updated = users.map(u => u.id === user.id ? { ...u, active: !u.active } : u);
    setUsers(updated);
    setCMSData(STORAGE_KEYS.ADMIN_USERS, updated);
    notifyCMSUpdate();
    await logAuditEvent('Updated Admin User Status', 'User Management', `Set status of ${user.name} (${user.email}) to ${!user.active ? 'Active' : 'Inactive'}`);
  };

  const handleDeleteUser = async (user) => {
    if (user.email === 'tarunuttupulusu@gmail.com') return; // Protect primary super admin
    if (!window.confirm(`Are you sure you want to delete admin account ${user.email}?`)) return;
    const updated = users.filter(u => u.id !== user.id);
    setUsers(updated);
    setCMSData(STORAGE_KEYS.ADMIN_USERS, updated);
    notifyCMSUpdate();
    await logAuditEvent('Deleted Admin User', 'User Management', `Removed admin account ${user.name} (${user.email})`);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-3xl font-bold text-white flex items-center gap-3">
            <span>Admin Users Management</span>
            <Shield size={22} className="text-gold" />
          </h1>
          <p className="font-sans text-xs text-white/40 uppercase tracking-widest mt-1">
            Manage authorized staff credentials & permissions for ESPACIO Admin Panel
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl shadow-lg transition-all"
        >
          <UserPlus size={15} />
          <span>Add New Admin User</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/15 border border-emerald-500/30 p-4 rounded-xl flex items-center justify-between text-emerald-400 font-sans text-xs">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')} className="font-bold">Dismiss</button>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-[#141518] border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <h3 className="font-sans text-xs font-bold text-white uppercase tracking-wider">Authorized Admin Accounts</h3>
          <span className="font-sans text-[10px] text-white/40">{users.length} Total Accounts</span>
        </div>

        <div className="divide-y divide-white/5">
          {users.map(user => (
            <div key={user.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/2 transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-11 h-11 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center font-editorial font-bold text-gold shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-sans text-xs font-bold text-white">{user.name}</h4>
                    <span className="font-sans text-[9px] bg-gold/20 text-gold border border-gold/30 px-2 py-0.5 rounded font-bold uppercase">
                      {user.role}
                    </span>
                  </div>
                  <p className="font-sans text-xs text-white/60 mt-0.5">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <div className="text-right hidden md:block">
                  <span className="font-sans text-[10px] text-white/40 block">Created</span>
                  <span className="font-sans text-[11px] text-white/70 font-medium">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : 'Default'}
                  </span>
                </div>

                <button
                  onClick={() => handleToggleUserStatus(user)}
                  disabled={user.email === 'tarunuttupulusu@gmail.com'}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-sans font-bold uppercase border transition-all ${
                    user.active 
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                      : 'bg-stone-500/15 text-stone-400 border-stone-500/30'
                  } ${user.email === 'tarunuttupulusu@gmail.com' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {user.active ? 'Active' : 'Inactive'}
                </button>

                {user.email !== 'tarunuttupulusu@gmail.com' && (
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete User"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#141518] border border-white/15 rounded-2xl p-6 md:p-8 max-w-[480px] w-full space-y-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="font-editorial text-xl font-bold text-white flex items-center gap-2">
                  <UserPlus size={18} className="text-gold" />
                  <span>Create Admin User</span>
                </h3>
                <p className="font-sans text-[11px] text-white/40 mt-0.5">Specify login credentials and role</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-white/40 hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-500/15 border border-red-500/30 p-3 rounded-xl text-red-400 font-sans text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="font-sans text-[10px] text-white/60 uppercase font-bold tracking-widest block mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full bg-[#0E0F11] border border-white/10 rounded-xl px-10 py-3 font-sans text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold"
                  />
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                </div>
              </div>

              <div>
                <label className="font-sans text-[10px] text-white/60 uppercase font-bold tracking-widest block mb-1">Email Address (Username)</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. ramesh@espacio.com"
                    className="w-full bg-[#0E0F11] border border-white/10 rounded-xl px-10 py-3 font-sans text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold"
                  />
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                </div>
              </div>

              <div>
                <label className="font-sans text-[10px] text-white/60 uppercase font-bold tracking-widest block mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-[#0E0F11] border border-white/10 rounded-xl px-10 py-3 font-sans text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold"
                  />
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                </div>
              </div>

              <div>
                <label className="font-sans text-[10px] text-white/60 uppercase font-bold tracking-widest block mb-1">Admin Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-[#0E0F11] border border-white/10 rounded-xl px-3 py-3 font-sans text-xs text-white font-bold focus:outline-none focus:border-gold"
                >
                  <option value="Super Admin">Super Admin (Full Access)</option>
                  <option value="Editor">Editor (CMS Content & Enquiries)</option>
                  <option value="Manager">Manager (Read & Enquiries Only)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3 rounded-xl border border-white/10 font-sans text-xs font-bold text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs font-bold uppercase tracking-wider shadow-lg"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
