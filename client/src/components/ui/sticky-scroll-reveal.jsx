import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll, useSpring, useTransform, motion, AnimatePresence } from "framer-motion";
import { ScrollStack, ScrollStackItem } from "./scroll-stack";

export const StickyScroll = ({ content, className }) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef(null);
  
  // Track scroll of the outer track relative to the window scroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(
      Math.floor(latest * cardLength),
      cardLength - 1
    );
    if (idx >= 0 && idx !== activeCard) {
      setActiveCard(idx);
    }
  });

  const springConfig = { stiffness: 180, damping: 25, bounce: 0 };

  const textTranslateY = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -(cardLength - 1) * 300]),
    springConfig
  );

  return (
    <>
      {/* Desktop Sticky Scroll (lg and above) - Full Screen Height */}
      <div
        ref={ref}
        className={`hidden lg:block relative w-full h-[350vh] ${className || ""}`}
      >
        {/* Sticky box locked in viewport occupying full screen height */}
        <div className="sticky top-[95px] w-full h-[82vh] flex justify-between gap-10 rounded-[32px] p-6 lg:p-10 bg-bg-card/50 border border-ink-border/30 backdrop-blur-md items-center shadow-2xl">
          
          {/* Left: interactive scrolling text column */}
          <div className="relative w-[36%] shrink-0 h-full overflow-hidden pt-[120px] px-2 lg:px-6">
            {/* Top/Bottom gradient mask overlays for text fade */}
            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-bg/95 via-bg/70 to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg/95 via-bg/70 to-transparent z-10 pointer-events-none" />

            <motion.div 
              style={{ y: textTranslateY }}
              className="w-full relative"
            >
              {content.map((item, index) => (
                <motion.div
                  key={item.title + index}
                  className="h-[300px] flex flex-col justify-center text-left"
                  animate={{
                    opacity: activeCard === index ? 1 : 0.15,
                    scale: activeCard === index ? 1 : 0.94,
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <h3 className="font-display text-[28px] sm:text-[32px] lg:text-[42px] font-bold text-ink leading-[1.1]">
                    {item.title}
                  </h3>
                  <div className="mt-4 font-sans text-base lg:text-lg text-ink-soft leading-relaxed">
                    {item.description}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: full screen height animated image panel */}
          <div className="w-[60%] shrink-0 h-full rounded-[24px] bg-bg-card overflow-hidden border border-ink-border/40 shadow-2xl relative">
            <AnimatePresence mode="sync">
              <motion.div
                key={activeCard}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full"
              >
                {content[activeCard]?.content ?? null}
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* Mobile/Tablet list view (below lg) with stacked card scroll stack animation */}
      <div className="lg:hidden w-full px-1 sm:px-2">
        <ScrollStack useWindowScroll={true} itemDistance={25} className="w-full !h-auto !overflow-visible">
          {content.map((item, index) => (
            <ScrollStackItem 
              key={item.title + index} 
              itemClassName="bg-bg border border-ink-border/25 flex flex-col gap-5 shadow-xl p-3 sm:p-4 rounded-[28px]"
            >
              {/* Project Image Card */}
              <div className="w-full aspect-[4/3] rounded-[20px] overflow-hidden border border-ink-border/30 shadow-md">
                {item.content}
              </div>
              {/* Description */}
              <div className="px-2 text-left">
                <h3 className="font-display text-2xl font-bold text-ink mb-3">{item.title}</h3>
                {item.description}
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </>
  );
};
