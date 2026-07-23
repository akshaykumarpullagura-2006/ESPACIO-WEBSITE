import React from 'react';

export const SocialLightButton = ({
  icon,
  label,
  href,
  color,
  beamColor,
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative h-[110px] w-[80px] flex items-end justify-center select-none outline-none group"
      aria-label={`Follow us on ${label}`}
    >
      {/* 1. Vertical Light Emitter Holder (spotlight dot + beam) */}
      <div className="absolute inset-0 flex flex-col items-center pointer-events-none z-10">
        {/* Emitter Node */}
        <div 
          className="w-2.5 h-2.5 rounded-full bg-[#0a0a0a] transition-all duration-300 group-hover:scale-110"
          style={{
            boxShadow: `0 0 10px #ffffff`,
          }}
        />
        {/* Spotlight Beam */}
        <div 
          className="w-[100px] h-[75px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
          style={{
            clipPath: 'polygon(50% 0%, 25% 100%, 75% 100%)',
            background: `linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 80%)`,
          }}
        />
      </div>

      {/* 2. Button Card Base */}
      <div 
        className="relative flex flex-col items-center justify-center h-[70px] w-[70px] bg-[#0a0a0a] rounded-[8px] transition-all duration-300 ease-out text-[#666666] border border-white/5 active:scale-95 group-hover:border-transparent cursor-pointer"
        style={{
          '--hover-color': color,
        }}
      >
        {/* Shrunken glowing outline border */}
        <div 
          className="absolute inset-0 rounded-[8px] opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100 border transition-all duration-300 pointer-events-none"
          style={{
            borderColor: '#ffffff',
            boxShadow: `0 0 14px rgba(255, 255, 255, 0.4)`,
          }}
        />

        {/* Dynamic Icon */}
        <div className="text-current group-hover:scale-110 transition-all duration-300 flex items-center justify-center w-6 h-6">
          {icon}
        </div>

        {/* Label */}
        <span className="font-sans text-[10px] font-bold mt-1.5 text-current transition-colors duration-300">
          {label}
        </span>
      </div>

      {/* Hover class overrides for icon filling */}
      <style>{`
        .group:hover div {
          color: var(--hover-color) !important;
        }
        .group:hover span {
          color: var(--hover-color) !important;
        }
        .group:hover svg {
          stroke: var(--hover-color) !important;
        }
      `}</style>
    </a>
  );
};
