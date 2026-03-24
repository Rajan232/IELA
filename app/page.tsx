"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const Scrollytelling = dynamic(() => import("./components/Scrollytelling"), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-[var(--color-brand-primary)] selection:text-white">
      {/* 
        This is the main landing page structure.
        The scrollytelling component takes up 400vh to drive the scroll animation.
      */}
      <Scrollytelling />

      {/* Footer / Subsequent content could go here, for now just a small footer to show the scroll ends */}
      <footer className="h-screen bg-white flex flex-col items-center justify-center p-8 border-t border-gray-100 relative overflow-hidden z-10">
        
        {/* Architectural Background Lines */}
        <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-12 pointer-events-none opacity-[0.03]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-black h-full hidden md:block"></div>
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-r border-black h-full block md:hidden"></div>
          ))}
        </div>

        <div className="relative w-72 md:w-96 h-32 md:h-40 mb-8 pointer-events-none">
          <Image 
            src="/logo/logo.png" 
            alt="India Energy Law Association Logo" 
            fill
            className="object-contain"
            unoptimized
          />
        </div>

        <p className="text-lg font-sans text-[var(--color-foreground)] max-w-md text-center">
          Empowering India's energy transition through legal excellence.
        </p>
        <p className="mt-12 text-sm font-sans tracking-widest uppercase text-gray-400">
          © {new Date().getFullYear()} India Energy Law Association
        </p>
      </footer>
    </main>
  );
}
