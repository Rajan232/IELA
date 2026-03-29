"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  order?: number;
}

function CommitteeSection({ title, collectionName }: { title: string, collectionName: string }) {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Desktop Carousel specific states
  const [startIndex, setStartIndex] = useState(0);
  const VISIBLE_COUNT = 7;

  useEffect(() => {
    try {
      const q = query(collection(db, collectionName), orderBy("order", "asc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TeamMember[];
        
        setMembers(fetched);
        setLoading(false);
      }, (error) => {
        console.error(`Firebase error fetching ${collectionName}:`, error);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      setLoading(false);
    }
  }, [collectionName]);

  // As per requirements: Do not render title or accordion if exactly 0 members exist
  if (!loading && members.length === 0) return null;

  // --- MOBILE LOGIC ---
  function chunkMembers(arr: TeamMember[]) {
    const n = arr.length;
    if (n === 0) return [];
    if (n <= 5) return [arr];
    const numRows = Math.ceil(n / 5);
    const baseSize = Math.floor(n / numRows);
    const remainder = n % numRows;
    const rows = [];
    let startIdx = 0;
    for (let i = 0; i < numRows; i++) {
        const rowSize = baseSize + (i < remainder ? 1 : 0);
        rows.push(arr.slice(startIdx, startIdx + rowSize));
        startIdx += rowSize;
    }
    return rows;
  }
  const mobileRows = chunkMembers(members);

  // --- DESKTOP LOGIC ---
  const nextSlide = () => setStartIndex(prev => (prev + 1) % members.length);
  const prevSlide = () => setStartIndex(prev => (prev - 1 + members.length) % members.length);

  return (
    <div className="flex flex-col w-full gap-6 md:gap-8 mb-16 md:mb-24 last:mb-0">
      {/* Title */}
      <h3 className="text-4xl sm:text-5xl font-serif text-[var(--color-brand-primary)] px-4 lg:px-0 tracking-wide text-center md:text-left">{title}</h3>

      {loading ? (
        <div className="w-full h-64 flex items-center justify-center text-[var(--color-brand-primary)] animate-pulse uppercase tracking-[0.2em] text-sm font-sans">Accessing {title} Records...</div>
      ) : (
        <div className="flex flex-col w-full gap-4">
          
          {/* 1. MOBILE VIEW (Stacked Accordion) */}
          <div className="md:hidden flex flex-col w-full gap-2 px-2">
            {mobileRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-col w-full h-[70vh] gap-2">
                {row.map((member) => {
                  const isActive = activeAccordion === member.id;
                  return (
                    <div 
                      key={`mobile-${member.id}`} 
                      onClick={() => setActiveAccordion(isActive ? null : member.id)}
                      className={`group relative h-full bg-center bg-cover bg-no-repeat transition-[flex,filter] duration-[800ms] ease-out overflow-hidden cursor-pointer rounded-2xl shadow-lg 
                        ${isActive ? 'flex-[7] grayscale-0' : 'flex-1 grayscale'}
                      `}
                      style={{ backgroundImage: `url('${member.image}')` }}
                    >
                      <div className={`absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-700
                        ${isActive ? 'opacity-100' : 'opacity-0'}
                      `}></div>
                      
                      <div className={`absolute bottom-8 left-8 right-8 transition-all duration-700 delay-150 flex flex-col
                        ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                      `}>
                        <h4 className="text-3xl font-serif font-medium !text-white mb-2 truncate">{member.name}</h4>
                        <p className="text-xs font-sans uppercase tracking-[0.2em] text-[#8FBC8F] truncate">{member.role}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* 2. DESKTOP VIEW (Infinite Sliding Accordion) */}
          <div className="hidden md:flex relative w-full h-[70vh] group px-4 lg:px-0">
            {members.length > VISIBLE_COUNT && (
              <button 
                onClick={prevSlide}
                className="absolute -left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-[var(--color-brand-primary)] hover:scale-110 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              >
                <ChevronLeft className="w-6 h-6 ml-[-2px]" />
              </button>
            )}

            <div className="flex w-full h-full gap-4 overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                {(() => {
                  const visible = [];
                  const renderCount = Math.min(members.length, VISIBLE_COUNT);
                  for (let i = 0; i < renderCount; i++) {
                    const absoluteIndex = startIndex + i;
                    const arrayIndex = ((absoluteIndex % members.length) + members.length) % members.length;
                    const member = members[arrayIndex];
                    visible.push({
                      ...member,
                      virtualKey: `desktop-card-${member.id}-v${absoluteIndex}`
                    });
                  }
                  return visible.map((member) => {
                    const isActive = activeAccordion === member.id;
                    return (
                      <motion.div 
                        layout
                        key={member.virtualKey}
                        onClick={() => setActiveAccordion(isActive ? null : member.id)}
                        initial={{ opacity: 0, scale: 0.9, x: 60 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -60, filter: "blur(10px)" }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className={`group/card relative h-full bg-center bg-cover bg-no-repeat transition-[flex,filter] duration-[800ms] ease-out overflow-hidden cursor-pointer rounded-2xl shadow-lg 
                          ${isActive ? 'flex-[7] grayscale-0' : 'flex-1 grayscale hover:flex-[7] hover:grayscale-0'}
                        `}
                        style={{ backgroundImage: `url('${member.image}')` }}
                      >
                        <div className={`absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-700 opacity-0 group-hover/card:opacity-100 ${isActive ? 'opacity-100' : ''}`}></div>
                        <div className={`absolute bottom-8 left-8 right-8 transition-all duration-700 delay-150 flex flex-col opacity-0 translate-y-8 group-hover/card:opacity-100 group-hover/card:translate-y-0 ${isActive ? 'opacity-100 translate-y-0' : ''}`}>
                          <h4 className="text-5xl font-serif font-medium !text-white mb-2 truncate">{member.name}</h4>
                          <p className="text-sm font-sans uppercase tracking-[0.2em] text-[#8FBC8F] truncate">{member.role}</p>
                        </div>
                      </motion.div>
                    );
                  });
                })()}
              </AnimatePresence>
            </div>

            {members.length > VISIBLE_COUNT && (
              <button 
                onClick={nextSlide}
                className="absolute -right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-[var(--color-brand-primary)] hover:scale-110 shadow-[0_8px_32px_rgba(0,0,0,0.2)]"
              >
                <ChevronRight className="w-6 h-6 mr-[-2px]" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeamGallery() {
  return (
    <div className="w-full flex flex-col pt-8">
      <CommitteeSection title="Advisory Committee" collectionName="advisory_committee" />
      <CommitteeSection title="Executive Committee" collectionName="team" />
    </div>
  );
}
