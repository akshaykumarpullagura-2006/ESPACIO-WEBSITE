import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Loader2, Eye, EyeOff, Shield } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const AdminLogin = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [serverError, setServerError] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setServerError(null);
    const sanitizedEmail = data.email ? data.email.trim().toLowerCase() : '';
    const password = data.password;

    try {
      // 1. Check custom admin users stored in cmsStore
      const { getCMSData, STORAGE_KEYS } = await import('../../utils/cmsStore');
      const { logAuditEvent } = await import('../../utils/auditStore');
      const customUsers = getCMSData(STORAGE_KEYS.ADMIN_USERS) || [];

      // Include default admin account
      const defaultUser = {
        name: 'Tarun (Super Admin)',
        email: 'tarunuttupulusu@gmail.com',
        password: 'tarun2314638',
        role: 'Super Admin',
        active: true
      };

      const allUsers = [defaultUser, ...customUsers];
      const matchedUser = allUsers.find(
        u => u.email.toLowerCase() === sanitizedEmail && u.password === password && u.active !== false
      );

      if (matchedUser) {
        const dummyToken = 'jwt_espacio_token_' + Date.now();
        localStorage.setItem('espacio_token', dummyToken);
        sessionStorage.setItem('active_admin_user', JSON.stringify({
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role || 'Admin'
        }));
        await logAuditEvent('User Logged In', 'Authentication', `User ${matchedUser.name} (${matchedUser.email}) logged into Admin Panel`);
        navigate('/admin/dashboard');
        return;
      }

      // 2. Fallback to backend API
      try {
        const response = await axios.post('/auth/login', { email: sanitizedEmail, password });
        if (response.data.success) {
          const token = response.data.data?.token || response.data.token;
          localStorage.setItem('espacio_token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          sessionStorage.setItem('active_admin_user', JSON.stringify({
            name: sanitizedEmail.split('@')[0],
            email: sanitizedEmail,
            role: 'Admin'
          }));
          await logAuditEvent('User Logged In', 'Authentication', `User ${sanitizedEmail} logged into Admin Panel`);
          navigate('/admin/dashboard');
          return;
        }
      } catch (backendErr) {
        // Continue to error message
      }

      setServerError('Invalid email address or password. Please check your credentials.');
    } catch (err) {
      setServerError('Unable to sign in. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex">
      {/* Left – Brand Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80"
          alt="ESPACIO Admin" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal/80 to-transparent" />
        <div className="relative z-10 px-12 pt-14">
          <span className="font-editorial text-xl font-bold text-gold tracking-widest">ESPACIO</span>
        </div>
        <div className="relative z-10 px-12 pb-14 space-y-4">
          <div className="w-12 h-[2px] bg-gold" />
          <h2 className="font-editorial text-3xl font-bold text-white leading-snug">
            The control room <br />for ESPACIO's <br />digital presence.
          </h2>
          <p className="font-sans text-cream/60 text-xs leading-relaxed max-w-[300px]">
            Manage projects, leads, materials, and content from one powerful admin panel.
          </p>
        </div>
      </div>

      {/* Right – Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 mb-6 lg:hidden">
              <span className="font-editorial text-xl font-bold text-gold">ESPACIO</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield size={20} className="text-gold" />
              <span className="font-sans text-xs uppercase tracking-widest text-gold font-bold">Admin Portal</span>
            </div>
            <h1 className="font-editorial text-3xl font-bold text-white">Sign In</h1>
            <p className="font-sans text-cream/50 text-xs">Access restricted to authorised ESPACIO personnel only.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
            <div className="space-y-1.5">
              <label className="font-sans text-[10px] uppercase tracking-widest text-cream/60 font-bold">Email Address</label>
              <input 
                {...register('email')} 
                type="email" 
                placeholder="Enter your email address"
                autoComplete="off"
                className="admin-input" 
              />
              {errors.email && <p className="font-sans text-xs text-red-400">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <label className="font-sans text-[10px] uppercase tracking-widest text-cream/60 font-bold">Password</label>
              <div className="relative">
                <input 
                  {...register('password')} 
                  type={showPass ? 'text' : 'password'} 
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  className="admin-input pr-12" 
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="font-sans text-xs text-red-400">{errors.password.message}</p>}
            </div>

            {serverError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-input px-4 py-3">
                <p className="font-sans text-xs text-red-400">{serverError}</p>
              </div>
            )}

            <button type="submit" disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-4 px-8 rounded-button transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <span>Sign In to Dashboard</span>}
            </button>
          </form>

          <p className="font-sans text-[10px] text-cream/30 text-center leading-relaxed">
            This portal is monitored and all access is logged. <br />Unauthorised access will be reported.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
