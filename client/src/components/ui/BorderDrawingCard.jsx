import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export const BorderDrawingCard = ({ children, delay = 0, className = '' }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { offsetWidth, offsetHeight } = entry.target;
        setDimensions({
          width: offsetWidth,
          height: offsetHeight,
        });
      }
    });
    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const { width, height } = dimensions;
  // Outer radius of the card corners (rounded-card is 16px)
  const rOuter = 16;
  // Inset the drawing by 2px to prevent clipping from overflow-hidden
  const inset = 2;
  const rInner = rOuter - inset;
  
  const drawWidth = width > 0 ? width - (inset * 2) : 0;
  const drawHeight = height > 0 ? height - (inset * 2) : 0;

  // Perimeter of rounded rect = 2 * (w + h) - 8*r + 2*pi*r
  const perimeter = drawWidth > 0 ? 2 * (drawWidth + drawHeight) - 8 * rInner + 2 * Math.PI * rInner : 0;
  
  // Segment specs for the passing line
  const segmentLength = 140; // Length of the gold line segment
  const dashArray = width > 0 ? `${segmentLength} ${perimeter - segmentLength}` : '0 0';

  return (
    <motion.div
      ref={cardRef}
      className={`relative group bg-white/5 backdrop-blur-md rounded-card transition-all duration-500 cursor-pointer overflow-hidden flex flex-col items-stretch ${className}`}
      whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background SVG for drawing the border */}
      {width > 0 && height > 0 && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Base very subtle border */}
          <rect
            x={inset}
            y={inset}
            width={drawWidth}
            height={drawHeight}
            rx={rInner}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={1.5}
            fill="none"
          />
          {/* Animated Gold Draw border */}
          <motion.rect
            x={inset}
            y={inset}
            width={drawWidth}
            height={drawHeight}
            rx={rInner}
            stroke="#C9A96E" /* Gold accent color */
            strokeWidth={1.5}
            fill="none"
            strokeDasharray={dashArray}
            animate={isHovered ? {
              strokeDashoffset: [0, -perimeter],
              opacity: 1
            } : {
              strokeDashoffset: 0,
              opacity: 0
            }}
            transition={isHovered ? {
              strokeDashoffset: {
                repeat: Infinity,
                duration: 4.5, // Smooth elegant speed
                ease: "linear"
              },
              opacity: {
                duration: 0.3
              }
            } : {
              opacity: {
                duration: 0.3
              }
            }}
            className="group-hover:stroke-gold-hover transition-colors duration-300"
          />
        </svg>
      )}

      {/* Render children inside relative wrapper to float above absolute SVG */}
      <div className="relative z-10 p-8 flex flex-col flex-1 justify-between space-y-6 w-full">
        {children}
      </div>
    </motion.div>
  );
};
