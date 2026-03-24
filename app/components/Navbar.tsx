"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "#about" },
  { name: "Team", path: "#team" },
  { name: "Contact", path: "#contact" },
];

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Default the active tab to the first one when not hovering over anything
  const activeIndex = hoveredIndex !== null ? hoveredIndex : 0;

  return (
    <div className="fixed top-8 w-full z-[100] pointer-events-none flex justify-center px-4">
      <nav 
        className="pointer-events-auto flex items-center bg-white p-2 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] gap-2"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {navItems.map((item, index) => {
          const isActive = index === activeIndex;
          
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`relative px-4 py-2 text-sm font-sans font-medium transition-colors duration-300 z-20 ${
                isActive ? "text-white" : "text-gray-500 hover:text-gray-800"
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
            >
              <span className="relative z-20">{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-hover-bg"
                  className="absolute inset-0 bg-[var(--color-brand-primary)] shadow-[0_2px_10px_rgba(34,139,34,0.3)] rounded-xl z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
