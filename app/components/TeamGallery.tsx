"use client";

import { useState, useEffect, useRef } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
    </svg>
  );
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  order?: number;
  linkedin?: string;
}

function CommitteeSection({ title, collectionName }: { title: string, collectionName: string }) {
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Desktop Carousel specific states
  const [startIndex, setStartIndex] = useState(0);
  const VISIBLE_COUNT = 7;
  const lastClickRef = useRef(0);
  const THROTTLE_MS = 350;

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
  const nextSlide = () => {
    if (members.length === 0) return;
    const now = Date.now();
    if (now - lastClickRef.current < THROTTLE_MS) return;
    lastClickRef.current = now;
    setStartIndex(prev => (prev + 1) % members.length);
  };

  const prevSlide = () => {
    if (members.length === 0) return;
    const now = Date.now();
    if (now - lastClickRef.current < THROTTLE_MS) return;
    lastClickRef.current = now;
    setStartIndex(prev => (prev - 1 + members.length) % members.length);
  };

  return (
    <div className="flex flex-col w-full gap-6 md:gap-8 mb-16 md:mb-24 last:mb-0">
      {/* Title */}
      <h3 className="text-4xl sm:text-5xl font-serif text-[var(--color-brand-primary)] px-4 lg:px-0 tracking-wide text-center md:text-left">{title}</h3>

      {loading ? (
        <div className="w-full h-64 flex items-center justify-center text-[var(--color-brand-primary)] animate-pulse uppercase tracking-[0.2em] text-sm font-sans">Accessing {title} Records...</div>
      ) : (
        <div className="flex flex-col w-full gap-4">
          
          {/* 1. MOBILE VIEW (Horizontal Accordion) */}
          <div className="md:hidden flex flex-col w-full gap-4 px-2">
            {mobileRows.map((row, rowIndex) => (
              <div key={rowIndex} className="flex flex-row w-full h-[50vh] sm:h-[60vh] gap-2 overflow-hidden">
                {row.map((member) => {
                  const isActive = activeAccordion === member.id;
                  return (
                    <div 
                      key={`mobile-${member.id}`} 
                      onClick={() => setActiveAccordion(isActive ? null : member.id)}
                      className={`group relative h-full bg-center bg-cover bg-no-repeat transition-[flex,filter] duration-500 ease-out overflow-hidden cursor-pointer rounded-2xl shadow-lg 
                        ${isActive ? 'flex-[3] grayscale-0' : 'flex-1 grayscale'}
                      `}
                      style={{ backgroundImage: `url('${member.image}')` }}
                    >
                      <div className={`absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-500
                        ${isActive ? 'opacity-100' : 'opacity-0'}
                      `}></div>
                      
                      <div className={`absolute bottom-6 left-4 right-4 transition-all duration-500 flex flex-col items-start
                        ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}
                      `}>
                        <h4 className="text-xl sm:text-2xl font-serif font-medium !text-white mb-1 break-words whitespace-normal">{member.name}</h4>
                        <p className="text-[10px] sm:text-xs font-sans uppercase tracking-[0.15em] text-[#8FBC8F] break-words whitespace-normal mb-3">{member.role}</p>

                        {member.linkedin && member.linkedin.trim() !== "" && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`${member.name}'s LinkedIn Profile`}
                            className="w-8 h-8 rounded-full bg-white/20 active:bg-[#0A66C2] text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/30 shadow-md"
                          >
                            <LinkedInIcon className="w-4 h-4 fill-current" />
                          </a>
                        )}
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
                aria-label="Previous members"
                className="absolute -left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[var(--color-brand-primary)] hover:scale-110 active:scale-95 shadow-[0_8px_32px_rgba(0,0,0,0.2)] cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6 ml-[-2px]" />
              </button>
            )}

            <div className="flex w-full h-full gap-4 overflow-hidden">
              {(() => {
                const renderCount = Math.min(members.length, VISIBLE_COUNT);
                const visible = [];
                for (let i = 0; i < renderCount; i++) {
                  const absoluteIndex = startIndex + i;
                  const arrayIndex = ((absoluteIndex % members.length) + members.length) % members.length;
                  const member = members[arrayIndex];
                  visible.push({
                    member,
                    cardKey: `desktop-card-${member.id}-${arrayIndex}`
                  });
                }

                return visible.map(({ member, cardKey }) => (
                  <motion.div 
                    layout
                    key={cardKey}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="group/card relative h-full bg-center bg-cover bg-no-repeat transition-[flex,filter] duration-500 ease-out overflow-hidden rounded-2xl shadow-lg flex-1 grayscale hover:flex-[3] hover:grayscale-0"
                    style={{ backgroundImage: `url('${member.image}')` }}
                  >
                    <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-150 delay-0 group-hover/card:duration-700 opacity-0 group-hover/card:opacity-100"></div>
                    <div className="absolute bottom-8 left-8 right-8 transition-all duration-150 delay-0 group-hover/card:duration-700 group-hover/card:delay-150 flex flex-col opacity-0 translate-y-8 group-hover/card:opacity-100 group-hover/card:translate-y-0 items-start">
                      <h4 className="text-3xl lg:text-4xl font-serif font-medium !text-white mb-2 break-words whitespace-normal">{member.name}</h4>
                      <p className="text-sm font-sans uppercase tracking-[0.2em] text-[#8FBC8F] break-words whitespace-normal mb-4">{member.role}</p>

                      {member.linkedin && member.linkedin.trim() !== "" && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`${member.name}'s LinkedIn Profile`}
                          className="w-9 h-9 rounded-full bg-white/20 hover:bg-[#0A66C2] text-white flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/30 shadow-md hover:scale-110 active:scale-95 group/icon"
                        >
                          <LinkedInIcon className="w-4 h-4 fill-current transition-transform duration-300 group-hover/icon:scale-110" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ));
              })()}
            </div>

            {members.length > VISIBLE_COUNT && (
              <button 
                onClick={nextSlide}
                aria-label="Next members"
                className="absolute -right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[var(--color-brand-primary)] hover:scale-110 active:scale-95 shadow-[0_8px_32px_rgba(0,0,0,0.2)] cursor-pointer"
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
      <CommitteeSection title="Young ELA Professionals" collectionName="young_ela_professionals" />

    </div>
  );
}
