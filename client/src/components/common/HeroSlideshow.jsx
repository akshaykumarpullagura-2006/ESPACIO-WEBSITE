import React, { useState, useEffect, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

/**
 * Preloads image URLs into browser memory and pre-decodes bitmap assets
 * before they are rendered in transitions.
 */
const preloadImages = (urls = []) => {
  if (!Array.isArray(urls)) return;
  urls.forEach((url) => {
    if (!url || typeof url !== 'string') return;
    const img = new Image();
    img.src = url;
    if (img.decode) {
      img.decode().catch(() => {});
    }
  });
};

const HeroSlideshow = memo(({
  images = [],
  intervalMs = 3800,
  transitionDuration = 1.2,
  className = "absolute inset-0 w-full h-full object-cover",
  onIndexChange,
  showGradient = true,
  gradientClassName = "absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/5 z-10 pointer-events-none"
}) => {
  const activeImages = Array.isArray(images) && images.length > 0 ? images : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  // Lazily preload only the next image after initial render
  useEffect(() => {
    if (activeImages.length > 1) {
      const nextIdx = (currentIndex + 1) % activeImages.length;
      const nextUrl = getOptimizedImageUrl(activeImages[nextIdx], 1000, 70);
      const timer = setTimeout(() => {
        preloadImages([nextUrl]);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, activeImages]);

  // Main slideshow timer with tab visibility pause
  useEffect(() => {
    if (activeImages.length <= 1) return;

    const startTimer = () => {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => {
          const next = (prev + 1) % activeImages.length;
          if (onIndexChange) onIndexChange(next);
          return next;
        });
      }, intervalMs);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(timerRef.current);
      } else {
        startTimer();
      }
    };

    startTimer();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [activeImages.length, intervalMs, onIndexChange]);

  // Safety check for empty image array
  if (activeImages.length === 0) return null;

  const rawSrc = activeImages[currentIndex % activeImages.length];
  const currentSrc = getOptimizedImageUrl(rawSrc, 1000, 70);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.img
          key={currentSrc}
          src={currentSrc}
          alt="ESPACIO Hero Showcase"
          decoding="async"
          fetchPriority={currentIndex === 0 ? "high" : "auto"}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1.0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{
            duration: transitionDuration,
            ease: [0.25, 1, 0.5, 1]
          }}
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(0,0,0)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden'
          }}
          className={className}
        />
      </AnimatePresence>

      {showGradient && <div className={gradientClassName} />}
    </div>
  );
});

HeroSlideshow.displayName = 'HeroSlideshow';

export default HeroSlideshow;
