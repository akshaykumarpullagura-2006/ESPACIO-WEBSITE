import React, { useState, useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }
    let rafId = null;

    const handleMouseMove = (e) => {
      const clientX = e.clientX;
      const clientY = e.clientY;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
        }
      });
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target) return;
      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        (target.closest && (target.closest('a') || target.closest('button') || target.closest('.clickable'))) ||
        target.getAttribute('role') === 'button';

      setHovered(!!isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className={`hidden md:block custom-cursor ${
        hovered ? 'custom-cursor-hover' : ''
      }`}
      style={{
        left: 0,
        top: 0,
        willChange: 'transform',
        pointerEvents: 'none',
      }}
    />
  );
};

export default CustomCursor;
