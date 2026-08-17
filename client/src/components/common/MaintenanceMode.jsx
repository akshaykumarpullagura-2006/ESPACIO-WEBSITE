import React from 'react';
import { Wrench, Phone, MessageSquare, MapPin, Clock, ArrowRight, Shield } from 'lucide-react';

const MaintenanceMode = ({ settings = {} }) => {
  const title = settings.maintenance_title || "We're Upgrading Your Experience!";
  const message = settings.maintenance_message || "ESPACIO website is currently undergoing scheduled maintenance & enhancements. Our flagship experience center studio remains open for visits and immediate consultations.";
  const estimatedTime = settings.maintenance_time || "Estimated Back Online: Today at 8:00 PM";
  const phone = settings.maintenance_phone || "+91 95051 51116";

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white flex flex-col justify-between p-6 md:p-12 relative overflow-hidden select-none">
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header / Brand Logo */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-editorial text-2xl font-bold tracking-widest text-gold">ESPACIO</span>
          <span className="font-sans text-[10px] bg-gold/15 text-gold border border-gold/30 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
            SYSTEM MAINTENANCE
          </span>
        </div>

        <a
          href="/admin"
          className="flex items-center space-x-1.5 text-white/40 hover:text-gold transition-colors font-sans text-xs font-bold uppercase tracking-wider"
          title="Admin Staff Portal"
        >
          <Shield size={14} />
          <span>Admin Portal</span>
        </a>
      </div>

      {/* Center Maintenance Content Card */}
      <div className="relative z-10 max-w-2xl mx-auto my-auto py-12 text-center space-y-8">
        <div className="w-16 h-16 rounded-2xl bg-gold/15 border border-gold/30 text-gold flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(201,169,110,0.2)] animate-pulse">
          <Wrench size={30} />
        </div>

        <div className="space-y-4">
          <h1 className="font-editorial text-4xl md:text-5xl font-bold text-white leading-tight">
            {title}
          </h1>
          <p className="font-sans text-sm md:text-base text-white/70 leading-relaxed max-w-xl mx-auto">
            {message}
          </p>
        </div>

        {/* Estimated Time Badge */}
        {estimatedTime && (
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full font-sans text-xs text-gold font-semibold shadow-inner">
            <Clock size={14} className="animate-spin text-gold" />
            <span>{estimatedTime}</span>
          </div>
        )}

        {/* Immediate Contact Options */}
        <div className="pt-4 space-y-4">
          <p className="font-sans text-xs text-white/40 uppercase tracking-widest font-bold">Need Immediate Assistance?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent('Hello ESPACIO team, I am reaching out while your website is in maintenance mode.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all"
            >
              <MessageSquare size={16} />
              <span>WhatsApp Direct</span>
            </a>

            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gold hover:bg-gold-hover text-charcoal font-sans text-xs uppercase tracking-widest font-bold py-3.5 px-6 rounded-xl shadow-lg transition-all"
            >
              <Phone size={16} />
              <span>Call {phone}</span>
            </a>
          </div>
        </div>

        {/* Experience Center Location Card */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md max-w-md mx-auto text-left space-y-3">
          <div className="flex items-center space-x-2 text-gold">
            <MapPin size={16} />
            <span className="font-sans text-xs uppercase tracking-wider font-bold">Studio Visit Open</span>
          </div>
          <p className="font-sans text-xs text-white/80 leading-relaxed">
            1st floor, H.No. 6-63/14B, Moinabad Road, Aziznagar, Hyderabad, Telangana 500075
          </p>
          <span className="font-sans text-[11px] text-white/40 block">Mon – Sat: 10:00 AM – 7:30 PM</span>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center font-sans text-xs text-white/30 border-t border-white/5 pt-6">
        <p>© {new Date().getFullYear()} ESPACIO Interiors & Modular. All Rights Reserved.</p>
      </div>
    </div>
  );
};

export default MaintenanceMode;
