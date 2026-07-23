import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./scroll-stack.css";

export const ScrollStackItem = ({
  children,
  index = 0,
  totalItems = 1,
  itemDistance = 40,
  itemClassName = ""
}) => {
  const ref = useRef(null);

  // Track scroll position of this specific card relative to the top of the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Calculate dynamic scale down as cards stack on top of it
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.93 - (totalItems - index) * 0.02]);
  
  // Apply a subtle blur and opacity fade as cards cover it
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.65]);
  const blur = useTransform(scrollYProgress, [0, 0.8], ["blur(0px)", "blur(2px)"]);

  // Calculate sticky offset top so cards stack on top of each other with a spacing overlap
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const stickyTop = isMobile
    ? 80 + index * 12
    : 140 + index * itemDistance;

  return (
    <motion.div
      ref={ref}
      style={{
        position: "sticky",
        top: `${stickyTop}px`,
        scale,
        opacity,
        filter: blur,
        transformOrigin: "top center"
      }}
      className={`scroll-stack-card ${itemClassName}`.trim()}
    >
      {children}
    </motion.div>
  );
};

export const ScrollStack = ({
  children,
  itemDistance = 40,
  className = "",
  useWindowScroll = false,
  ...props
}) => {
  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const trackPadding = (totalItems - 1) * (isMobile ? 10 : 20);

  return (
    <div 
      className={`relative w-full ${className}`} 
      style={{ paddingBottom: `${trackPadding}px`, ...props.style }}
      {...props}
    >
      {childrenArray.map((child, index) => {
        // Pass index and totalItems props to each ScrollStackItem child
        return React.cloneElement(child, {
          index,
          totalItems,
          itemDistance
        });
      })}
    </div>
  );
};

export default ScrollStack;
