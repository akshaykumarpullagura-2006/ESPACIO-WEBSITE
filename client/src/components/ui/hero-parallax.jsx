import React, { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Link } from "react-router-dom";

export const HeroParallax = ({ products }) => {
  const baseFirst = products.slice(0, 12);
  const baseSecond = products.slice(12, 24);
  const firstRow = [...baseFirst, ...baseFirst];
  const secondRow = [...baseSecond, ...baseSecond];
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 180, damping: 25, bounce: 0 };

  const translateXRow1 = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1500]),
    springConfig
  );
  const translateXRow2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1500]),
    springConfig
  );

  const autoMotionX = useMotionValue(0);
  const dragX1 = useMotionValue(0);
  const dragX2 = useMotionValue(0);

  useEffect(() => {
    let animId;
    const loop = () => {
      autoMotionX.set((autoMotionX.get() + 1.2) % 3200);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [autoMotionX]);

  const combinedX1 = useTransform(
    [translateXRow1, autoMotionX, dragX1],
    ([scrollX, auto, drag]) => scrollX + auto + drag
  );
  const combinedX2 = useTransform(
    [translateXRow2, autoMotionX, dragX2],
    ([scrollX, auto, drag]) => scrollX - auto + drag
  );

  const useRowDrag = (dragValue) => {
    const handleStart = (clientX, clientY) => {
      const startX = clientX;
      const startY = clientY;
      const startVal = dragValue.get();
      let hasDragged = false;
      let isDragging = true;
      let touchChecked = false;

      const handleMove = (moveEvent) => {
        if (!isDragging) return;
        
        const currentX = moveEvent.pageX || (moveEvent.touches && moveEvent.touches[0].pageX);
        const currentY = moveEvent.pageY || (moveEvent.touches && moveEvent.touches[0].pageY);
        if (currentX === undefined || currentY === undefined) return;
        
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        // If they are scrolling vertically, abort horizontal drag immediately
        if (!touchChecked) {
          if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 6) {
            isDragging = false;
            handleEnd();
            return;
          }
          if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
            touchChecked = true;
          }
        }

        if (Math.abs(deltaX) > 8) {
          hasDragged = true;
        }
        dragValue.set(startVal + deltaX * 1.35);
      };

      const handleEnd = () => {
        isDragging = false;
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleEnd);
        window.removeEventListener("touchmove", handleMove);
        window.removeEventListener("touchend", handleEnd);

        if (hasDragged) {
          const blockClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.removeEventListener("click", blockClick, true);
          };
          window.addEventListener("click", blockClick, true);
        }
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseup", handleEnd);
      window.addEventListener("touchmove", handleMove, { passive: true });
      window.addEventListener("touchend", handleEnd);
    };

    return {
      onMouseDown: (e) => {
        if (e.button !== 0) return; // only left click
        handleStart(e.pageX, e.pageY);
      },
      onTouchStart: (e) => {
        handleStart(e.touches[0].pageX, e.touches[0].pageY);
      }
    };
  };

  const handlersRow1 = useRowDrag(dragX1);
  const handlersRow2 = useRowDrag(dragX2);

  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.3, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [40, 0]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[100vh] lg:h-[135vh] pt-0 pb-12 md:pb-16 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div 
          {...handlersRow1}
          className="flex flex-row-reverse space-x-reverse space-x-8 md:space-x-12 mb-8 md:mb-12 cursor-grab active:cursor-grabbing select-none"
        >
          {firstRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={combinedX1}
              key={product.title + idx}
              index={idx}
            />
          ))}
        </motion.div>
        <motion.div 
          {...handlersRow2}
          className="flex flex-row space-x-8 md:space-x-12 cursor-grab active:cursor-grabbing select-none"
        >
          {secondRow.map((product, idx) => (
            <ProductCard
              product={product}
              translate={combinedX2}
              key={product.title + idx}
              index={idx + 12}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="w-full relative pt-8 pb-10 md:pt-12 md:pb-16 px-6 md:px-12 left-0 top-0 z-20 bg-bg">
      <div className="max-w-[1440px] mx-auto text-left">
        <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-gold font-semibold">Bespoke Design Services</span>
        <h1 className="font-display text-[clamp(30px,3.5vw,52px)] font-medium leading-[1.08] tracking-tight text-ink mt-4">
          We Sculpt <br />Inspiring Spaces
        </h1>
        <p className="max-w-xl font-sans text-[14px] text-ink font-medium mt-5 leading-relaxed">
          From conceptual 3D visualizations to master turnkey handovers, ESPACIO brings unmatched structural excellence and premium material sourcing to residential, commercial, and modular kitchen spaces.
        </p>
      </div>
    </div>
  );
};

export const ProductCard = ({ product, translate, index }) => {
  const isNarrow = [0, 3, 6, 9, 12, 15, 18, 21].includes(index);
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -10,
      }}
      key={product.title}
      className={`group/product h-56 relative flex-shrink-0 rounded-[20px] overflow-hidden border border-ink-border/35 shadow-lg ${
        isNarrow ? "w-42 md:w-[16.5rem]" : "w-84 md:w-[33rem]"
      }`}
    >
      <Link
        to={product.link}
        className="block h-full w-full select-none"
        draggable="false"
      >
        <img
          src={product.thumbnail}
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80";
          }}
          className="object-cover absolute h-full w-full inset-0 transition-transform duration-700 group-hover/product:scale-105 select-none pointer-events-none"
          draggable="false"
          alt={product.title}
        />
      </Link>
      <div className="absolute inset-0 h-full w-full opacity-60 bg-black/45 transition-opacity duration-300 group-hover/product:opacity-75 pointer-events-none"></div>
      <div className="absolute bottom-5 left-6 right-6 text-white z-10">
        <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-gold mb-1.5">{product.category || 'Interior Service'}</p>
        <h2 className="font-display text-base md:text-lg font-medium text-white group-hover/product:text-gold transition-colors leading-tight">
          {product.title}
        </h2>
      </div>
    </motion.div>
  );
};
