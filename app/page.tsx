"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import TeamGallery from "./components/TeamGallery";
import ContactForm from "./components/ContactForm";

const Scrollytelling = dynamic(() => import("./components/Scrollytelling"), { ssr: false });

export default function Home() {

  return (
    <main id="home" className="min-h-screen bg-white selection:bg-[var(--color-brand-primary)] selection:text-white">
      {/* 
        This is the main landing page structure.
        The scrollytelling component takes up 400vh to drive the scroll animation.
      */}
      <Scrollytelling />

      {/* CORE OBJECTIVES SECTION - #about */}
      <section id="about" className="min-h-screen bg-white text-[#111111] py-32 px-8 md:px-16 flex flex-col justify-center border-t border-gray-100 relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row gap-16 mb-24">
            <div className="w-full md:w-1/3">
              <h2 className="text-sm font-sans uppercase tracking-[0.3em] text-[#228B22] mb-6">Who We Are</h2>
              <p className="text-4xl md:text-5xl font-serif leading-tight text-[#111111]">
                Shaping a sustainable, investment-friendly future for the energy landscape.
              </p>
            </div>
            <div className="w-full md:w-2/3 flex items-end">
              <p className="text-xl md:text-2xl font-sans text-gray-500 font-light max-w-2xl leading-relaxed">
                The India Energy Law Association is an international, non-profit platform committed to advancing energy law and policy. We turn knowledge into action through rigorous research, neutral dialogue, and elite capacity building.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            <ObjectiveCard num="01" title="High-Quality Research" desc="Promoting non-partisan research on electricity law, renewable energy, climate change, carbon markets, and energy regulation." />
            <ObjectiveCard num="02" title="Neutral Dialogues" desc="Facilitating crucial conversations among policymakers, regulators, industry stakeholders, financiers, and academia." />
            <ObjectiveCard num="03" title="Professional Capacity" desc="Building elite professional capacity via specialized training programs, workshops, and expert-led mentorship." />
            <ObjectiveCard num="04" title="Evidence-Based Policy" desc="Supporting evidence-based policymaking with regulatory analysis and robust model frameworks." />
            <ObjectiveCard num="05" title="Student Engagement" desc="Engaging the next generation through fellowships, internships, skill-development initiatives, and specialized courses." />
            <ObjectiveCard num="06" title="Dispute Resolution" desc="Promoting efficient dispute resolution through global best practices in arbitration, mediation, and adjudication." />
          </div>
        </div>
      </section>

      {/* TEAM SECTION - #team */}
      <section id="team" className="py-32 bg-[#F8F9F9] px-4 md:px-8 border-t border-gray-200 relative z-10 overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-sans uppercase tracking-[0.3em] text-[#228B22] mb-6">The Architects</h2>
            <h3 className="text-5xl md:text-7xl font-serif text-[#111111] tracking-tight">Meet the Team</h3>
          </div>

          <TeamGallery />
        </div>
      </section>

      <section id="contact" className="py-32 bg-white px-4 md:px-8 border-t border-gray-200 relative z-10 overflow-hidden">
        <div className="max-w-[1400px] mx-auto flex flex-col items-center">
          <div className="text-center mb-16 relative z-20">
            <h2 className="text-sm font-sans uppercase tracking-[0.3em] text-[var(--color-brand-primary)] mb-6">Connect</h2>
            <h3 className="text-5xl md:text-7xl font-serif text-[var(--color-headings)] tracking-tight">Get in Touch</h3>
          </div>
          <div className="w-full relative z-20">
            <ContactForm />
          </div>
        </div>
        
        {/* Architectural Background Lines */}
        <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-12 pointer-events-none opacity-[0.03] z-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-black h-full hidden md:block"></div>
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-r border-black h-full block md:hidden"></div>
          ))}
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="min-h-[40vh] bg-gray-50 flex flex-col items-center justify-center p-8 border-t border-gray-200 relative overflow-hidden z-10">
        
        {/* Architectural Background Lines */}
        <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-12 pointer-events-none opacity-[0.03]">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-black h-full hidden md:block"></div>
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border-r border-black h-full block md:hidden"></div>
          ))}
        </div>

        <div className="relative w-80 md:w-96 h-32 md:h-40 mb-12 pointer-events-none drop-shadow-sm">
          <Image 
            src="/logo/logo.png" 
            alt="India Energy Law Association Logo" 
            fill
            className="object-contain"
            unoptimized={true}
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

function ObjectiveCard({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="flex flex-col group cursor-default">
      <div className="text-sm font-sans font-bold text-gray-300 mb-4 transition-colors duration-500 group-hover:text-[#228B22]">{num}</div>
      <div className="w-full h-px bg-gray-200 mb-8 transition-colors duration-500 group-hover:bg-[#228B22]"></div>
      <h3 className="text-3xl font-serif text-[#111111] mb-4">{title}</h3>
      <p className="text-lg font-sans leading-relaxed text-gray-500 font-light">{desc}</p>
    </div>
  );
}
