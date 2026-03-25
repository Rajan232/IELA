"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  order?: number;
}

const defaultMembers: TeamMember[] = [
  { id: '1', name: "Sudha Reddy", role: "Founder", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1233&q=80", order: 1 },
  { id: '2', name: "Aisha Khan", role: "Head of Policy", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1233&q=80", order: 2 },
  { id: '3', name: "Rohan Patel", role: "Renewables Counsel", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1233&q=80", order: 3 },
  { id: '4', name: "Priya Desai", role: "Dispute Resolution", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1233&q=80", order: 4 },
  { id: '5', name: "Vikram Singh", role: "Regulatory Expert", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1233&q=80", order: 5 }
];

export default function TeamGallery() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(db, "team"), orderBy("order", "asc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetched = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TeamMember[];
        
        setMembers(fetched.length > 0 ? fetched : defaultMembers);
        setLoading(false);
      }, (error) => {
        console.error("Firebase error fetching team:", error);
        setMembers(defaultMembers);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      setMembers(defaultMembers);
      setLoading(false);
    }
  }, []);

  function chunkMembers(arr: TeamMember[]) {
    const n = arr.length;
    if (n === 0) return [];
    if (n <= 5) return [arr];
    
    const numRows = Math.ceil(n / 5);
    const baseSize = Math.floor(n / numRows);
    const remainder = n % numRows;
    
    const rows = [];
    let startIndex = 0;
    for (let i = 0; i < numRows; i++) {
        const rowSize = baseSize + (i < remainder ? 1 : 0);
        rows.push(arr.slice(startIndex, startIndex + rowSize));
        startIndex += rowSize;
    }
    return rows;
  }

  const rows = chunkMembers(members);

  if (loading) {
     return <div className="w-full h-64 flex items-center justify-center text-[#228B22] animate-pulse uppercase tracking-[0.2em] text-sm">Loading Elite Roster...</div>;
  }

  return (
    <div className="flex flex-col w-full gap-2 md:gap-4">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-col md:flex-row w-full h-[70vh] gap-2 md:gap-4">
          {row.map((member, colIndex) => {
            const globalIndex = rowIndex * 100 + colIndex;
            return (
              <div 
                key={member.id} 
                onClick={() => setActiveAccordion(activeAccordion === globalIndex ? null : globalIndex)}
                className={`group relative h-full bg-center bg-cover bg-no-repeat transition-[flex,filter] duration-[800ms] ease-out overflow-hidden cursor-pointer rounded-2xl shadow-lg 
                  flex-1 md:hover:flex-[7] md:grayscale md:hover:grayscale-0
                  ${activeAccordion === globalIndex ? 'max-md:flex-[7] max-md:grayscale-0' : 'max-md:flex-1 max-md:grayscale'}
                `}
                style={{ backgroundImage: `url('${member.image}')` }}
              >
                <div className={`absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/50 to-transparent transition-opacity duration-700
                  md:opacity-0 md:group-hover:opacity-100 ${activeAccordion === globalIndex ? 'max-md:opacity-100' : 'max-md:opacity-0'}
                `}></div>
                
                <div className={`absolute bottom-8 left-8 right-8 transition-all duration-700 delay-150 flex flex-col
                  md:opacity-0 md:translate-y-8 md:group-hover:opacity-100 md:group-hover:translate-y-0
                  ${activeAccordion === globalIndex ? 'max-md:opacity-100 max-md:translate-y-0' : 'max-md:opacity-0 max-md:translate-y-8'}
                `}>
                  <h4 className="text-3xl md:text-5xl font-serif font-medium !text-white mb-2 truncate">{member.name}</h4>
                  <p className="text-xs md:text-sm font-sans uppercase tracking-[0.2em] text-[#8FBC8F] truncate">{member.role}</p>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
