import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export const GooeyInput = ({
  placeholder = "Search...",
  value,
  onChange,
  className,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef(null);

  const handleContainerClick = () => {
    // When expanding, focus the input field
    inputRef.current?.focus();
  };

  const hasText = value && value.toString().trim().length > 0;
  const isExpanded = isFocused || hovered || hasText;

  // Collapsed width is 110px (a rounded rectangle/pill)
  const collapsedWidth = "110px";

  return (
    <div
      onClick={handleContainerClick}
      className={`relative h-11 cursor-pointer select-none w-full transition-shadow duration-300 ${
        isExpanded ? "cursor-text" : "hover:shadow-sm"
      } ${className || ""}`}
    >
      {/* SVG Gooey Filter */}
      <svg className="absolute w-0 h-0 hidden" aria-hidden="true">
        <defs>
          <filter id="gooey-search-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Background layer applying gooey filter */}
      <div
        className="w-full h-full relative"
        style={{ filter: "url(#gooey-search-filter)" }}
      >
        {/* Main stretching background pill */}
        <motion.div
          className="absolute inset-y-0 left-0 border border-ink-border/20 rounded-full"
          animate={{
            width: isExpanded ? "100%" : collapsedWidth,
            backgroundColor: isFocused ? "#ffffff" : "#f4f4f6",
          }}
          transition={{ type: "spring", stiffness: 85, damping: 18 }}
        />

        {/* Black gooey bubble that covers the entire pill when collapsed, then shrinks and melts away */}
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-black"
          animate={{
            width: isExpanded ? "44px" : collapsedWidth,
            opacity: isExpanded ? 0 : 1,
            scale: isExpanded ? 0.8 : 1,
          }}
          transition={{ type: "spring", stiffness: 80, damping: 16 }}
        />
      </div>

      {/* Crisp foreground layer for text and icon */}
      <div className="absolute inset-0 flex items-center px-4 z-10 pointer-events-none">
        <div className="flex items-center w-full h-full">
          {/* Search Icon */}
          <div className="shrink-0 flex items-center justify-center w-5 h-5 mr-2">
            <motion.div
              animate={{
                color: isExpanded ? "#3d3d47" : "#ffffff",
              }}
              transition={{ duration: 0.2 }}
            >
              <Search className="w-4 h-4 stroke-[2]" />
            </motion.div>
          </div>

          {/* Search option content / Input */}
          <div className="relative flex-1 h-full flex items-center overflow-hidden">
            {/* Collapsed 'Search' Label */}
            <motion.span
              animate={{
                opacity: isExpanded ? 0 : 1,
                x: isExpanded ? 10 : 0,
              }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 font-sans text-[11px] font-bold text-white uppercase tracking-wider pointer-events-none"
            >
              Search
            </motion.span>

            {/* Input field (always in DOM!) */}
            <motion.input
              ref={inputRef}
              type="text"
              value={value || ""}
              onChange={onChange}
              placeholder={placeholder}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              animate={{
                opacity: isExpanded ? 1 : 0,
              }}
              transition={{ duration: 0.15 }}
              style={{ pointerEvents: isExpanded ? "auto" : "none" }}
              className="w-full bg-transparent border-none outline-none text-[13px] text-ink placeholder-ink-muted/70 py-2"
              {...props}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GooeyInput;
