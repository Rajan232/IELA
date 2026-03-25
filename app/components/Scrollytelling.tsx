"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const FRAME_COUNT = 191;

export default function Scrollytelling() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [isIdle, setIsIdle] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,  // Lower stiffness = more delay/lag
    damping: 25,    // Smooth out the deceleration
    mass: 1.5,      // Higher mass creates heavier, luxurious momentum
    restDelta: 0.0001
  });

  // Preload images
  useEffect(() => {
    let loaded = 0;
    const loadedImages: HTMLImageElement[] = [];
    for (let i = 0; i <= FRAME_COUNT; i++) {
      const img = new Image();
      const frameString = String(i).padStart(3, '0');
      img.src = `/sequence/frame_${frameString}_delay-0.041s.jpg`;
      img.onload = () => {
        loaded++;
        setImagesLoaded(loaded);
      };
      img.onerror = () => {
        loaded++;
        setImagesLoaded(loaded);
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  }, []);

  const isLoading = imagesLoaded < FRAME_COUNT + 1;
  const progressPerc = Math.round((imagesLoaded / (FRAME_COUNT + 1)) * 100);

  // Draw frame on canvas
  useEffect(() => {
    if (isLoading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = (progress: number) => {
      const frameIndex = Math.min(
        FRAME_COUNT,
        Math.max(0, Math.floor(progress * FRAME_COUNT))
      );
      
      const img = images[frameIndex];
      if (img && img.complete && img.naturalWidth !== 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.min(hRatio, vRatio);
        
        const centerShiftX = (canvas.width - img.width * ratio) / 2;
        const centerShiftY = (canvas.height - img.height * ratio) / 2;

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          centerShiftX,
          centerShiftY,
          img.width * ratio,
          img.height * ratio
        );
      } else {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#f5f5f5";
        ctx.fillRect(canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2);

        ctx.fillStyle = "#d4d4d4";
        ctx.font = "24px var(--font-oswald)";
        ctx.textAlign = "center";
        const frameString = String(frameIndex).padStart(3, '0');
        ctx.fillText(`Frame ${frameIndex} (Missing: /sequence/frame_${frameString}_delay-0.041s.jpg)`, canvas.width / 2, canvas.height / 2);
      }
    };

    const unsubscribe = smoothProgress.on("change", render);
    
    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render(smoothProgress.get());
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => {
      unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, [images, smoothProgress, isLoading]);

  useEffect(() => {
    if (isLoading) return;
    
    let timeout: NodeJS.Timeout;
    const resetTimer = () => {
      setIsIdle(false);
      clearTimeout(timeout);
      if (scrollYProgress.get() < 0.01) {
        timeout = setTimeout(() => setIsIdle(true), 15000); 
      }
    };

    resetTimer();
    const unsubscribe = scrollYProgress.on("change", resetTimer);

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [isLoading, scrollYProgress]);

  return (
    <>
      {isLoading && (
        <div className="loader">
          <div className="loader-inner">
            <div className="loader-line-wrap">
              <div className="loader-line"></div>
            </div>
            <div className="loader-line-wrap">
              <div className="loader-line"></div>
            </div>
            <div className="loader-line-wrap">
              <div className="loader-line"></div>
            </div>
            <div className="loader-line-wrap">
              <div className="loader-line"></div>
            </div>
            <div className="loader-line-wrap">
              <div className="loader-line"></div>
            </div>
          </div>
          <p className="absolute bottom-1/4 left-0 right-0 text-center text-[var(--color-headings)] font-sans uppercase tracking-widest text-sm z-10">
            Loading Elite Performance ({progressPerc}%)
          </p>
        </div>
      )}

      <div ref={containerRef} className="relative h-[400vh] w-full bg-white">
        <motion.div 
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none"
          style={{
            opacity: useTransform(smoothProgress, [0, 0.05, 0.1], [1, 1, 0])
          }}
        >
          <motion.div
            className="flex flex-col items-center gap-2"
            animate={isIdle ? { 
               y: [0, 8, 0],
               filter: ["drop-shadow(0px 0px 0px rgba(34,139,34,0))", "drop-shadow(0px 4px 12px rgba(34,139,34,0.6))", "drop-shadow(0px 0px 0px rgba(34,139,34,0))"]
            } : { 
               y: 0,
               filter: "drop-shadow(0px 0px 0px rgba(34,139,34,0))"
            }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-xs font-sans uppercase tracking-[0.2em] text-[var(--color-headings)]">Scroll to Explore</span>
            <div className="w-[1px] h-8 bg-[var(--color-brand-primary)]/50 relative overflow-hidden">
              <motion.div 
                className="w-full h-1/2 bg-[var(--color-brand-primary)] absolute top-0"
                animate={{ top: ['-50%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </motion.div>
        </motion.div>

        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0" />
          
          {/* BEAT A: 0 - 20% */}
          <BeatOverlay
            progress={smoothProgress}
            range={[0, 0.05, 0.15, 0.2]}
            className="items-center text-center justify-center p-8"
          >
            <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex flex-col items-center">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-normal font-serif uppercase tracking-tight text-[var(--color-headings)] leading-none mb-6 max-w-5xl">
                Advancing Energy Law
              </h1>
              <p className="text-xl md:text-2xl font-sans text-[var(--color-foreground)] max-w-2xl">
                India's energy sector is at the forefront of a transformative journey. We foster the legal ecosystem to support this transition.
              </p>
            </div>
          </BeatOverlay>

          {/* BEAT B: 25 - 45% */}
          <BeatOverlay
            progress={smoothProgress}
            range={[0.25, 0.3, 0.4, 0.45]}
            className="items-start text-left justify-center pl-[5%] md:pl-[10%] p-8"
          >
            <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-[2rem] p-8 md:p-14 shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex flex-col items-start max-w-3xl">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-normal font-serif uppercase tracking-tight text-[var(--color-headings)] leading-none mb-6">
                The Inner Circle
              </h2>
              <p className="text-xl md:text-2xl font-sans text-[var(--color-foreground)]">
                Bridging the gaps between law, policy, markets, and technology for India's energy transition.
              </p>
            </div>
          </BeatOverlay>

          {/* BEAT C: 50 - 70% */}
          <BeatOverlay
            progress={smoothProgress}
            range={[0.5, 0.55, 0.65, 0.7]}
            className="items-end text-right justify-center pr-[5%] md:pr-[10%] p-8"
          >
            <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-[2rem] p-8 md:p-14 shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex flex-col items-end text-right max-w-3xl">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-normal font-serif uppercase tracking-tight text-[var(--color-headings)] leading-none mb-6">
                Master the Transition
              </h2>
              <p className="text-xl md:text-2xl font-sans text-[var(--color-foreground)]">
                Crafting legal pathways for decarbonisation, grid management, and emerging technologies.
              </p>
            </div>
          </BeatOverlay>

          {/* BEAT D: 75 - 95% */}
          <BeatOverlay
            progress={smoothProgress}
            range={[0.75, 0.8, 0.9, 0.95]}
            className="items-center text-center justify-center p-8"
          >
            <div className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-12 md:p-20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] flex flex-col items-center">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-normal font-serif uppercase tracking-tight text-[var(--color-headings)] leading-none mb-6 max-w-5xl text-center">
                Our Manifesto
              </h2>
              <p className="text-xl md:text-2xl font-sans text-[var(--color-foreground)] max-w-2xl mb-12 text-center">
                Become part of the platform actively defining the future.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a 
                  href="#take-the-lead"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full p-4 px-12 bg-[var(--color-brand-primary)] text-white font-sans uppercase tracking-widest text-lg md:text-xl shadow-[0_4px_30px_rgba(34,139,34,0.3)] transition-colors duration-300 hover:bg-[var(--color-brand-tertiary)]"
                >
                  <span className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1">Take the Lead</span>
                  <div className="absolute inset-0 bg-[var(--color-brand-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
                </a>
              </motion.div>
            </div>
          </BeatOverlay>

          {/* Architectural Grid Lines (Brutalist Minimalist) */}
          <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-12 pointer-events-none z-[-1] opacity-[0.03]">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-black h-full hidden md:block"></div>
            ))}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border-r border-black h-full block md:hidden"></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// Reusable animated overlay for beats based on scroll range
function BeatOverlay({ 
  progress, 
  range, 
  children,
  className = ""
}: { 
  progress: any, 
  range: number[], 
  children: React.ReactNode,
  className?: string
}) {
  const opacity = useTransform(progress, range, [0, 1, 1, 0]);
  const y = useTransform(progress, range, [40, 0, 0, -40]);
  const display = useTransform(progress, (p: number) => 
    p < range[0] - 0.05 || p > range[3] + 0.05 ? "none" : "flex"
  );

  return (
    <motion.div
      style={{ opacity, y, display }}
      className={`absolute inset-0 w-full h-full flex flex-col z-10 ${className}`}
    >
      {children}
    </motion.div>
  );
}
