"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const navItems = [
  { name: "Home", path: "#home" },
  { name: "About", path: "#about" },
  { name: "Team", path: "#team" },
  { name: "Contact", path: "#contact" },
];

export default function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrolledIndex, setScrolledIndex] = useState<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((entry) => entry.isIntersecting);
        if (intersecting.length > 0) {
          // Find the one that takes up the most ratio on screen to define active
          const primary = intersecting.reduce((prev, current) => 
            (prev.intersectionRatio > current.intersectionRatio) ? prev : current
          );
          
          const matchedIndex = navItems.findIndex(item => item.path === `#${primary.target.id}`);
          if (matchedIndex !== -1) {
            setScrolledIndex(matchedIndex);
          }
        }
      },
      { rootMargin: "-20% 0px -40% 0px", threshold: [0, 0.25, 0.5] }
    );

    // Give it a tiny delay on mount to ensure DOM is fully rendered before selecting IDs
    const timer = setTimeout(() => {
      navItems.forEach((item) => {
        const el = document.getElementById(item.path.replace("#", ""));
        if (el) observer.observe(el);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Set the "pill" visualizer to exactly what we hover, or default to current scroll section if moving down the page
  const activeIndex = hoveredIndex !== null ? hoveredIndex : scrolledIndex;

  return (
    <div className="fixed top-8 w-full z-[100] pointer-events-none flex justify-center px-4 md:px-8">
      {/* Logo - Pinned Top Left */}
      <div className="absolute left-4 md:left-8 top-0 max-md:translate-y-0 md:top-1/2 md:-translate-y-1/2 pointer-events-auto">
        <Link href="/">
          <Image 
            src="/logo/logo.png" 
            alt="India Energy Law Association Logo" 
            width={168} 
            height={67} 
            className="object-contain w-[134px] md:w-[180px] h-auto"
            unoptimized={true}
          />
        </Link>
      </div>

      {/* Nav - Center Desktop, Bottom Center Mobile */}
      <nav 
        className="pointer-events-auto flex items-center bg-white p-2 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] gap-2 max-md:fixed max-md:bottom-8 max-md:left-1/2 max-md:-translate-x-1/2 max-md:w-max z-[110]"
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
