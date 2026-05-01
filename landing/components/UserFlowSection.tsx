'use client';
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { EnterpriseModal } from './EnterpriseModal';

export function UserFlowSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [enterpriseOpen, setEnterpriseOpen] = useState(false);
  
  // Create a Framer Motion constraint ref for drag-to-scroll
  const dragConstraintsRef = useRef<HTMLDivElement>(null);

  const cardVariants: any = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  return (
    <section id="user-flow" className="w-full relative py-32 bg-bg px-6 lg:px-12 overflow-hidden border-t border-border" ref={containerRef}>
      <motion.h2 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="font-heading text-4xl md:text-6xl font-bold mb-16 text-text max-w-7xl mx-auto"
      >
        Here's the play.
      </motion.h2>

      <div className="max-w-7xl mx-auto relative cursor-grab active:cursor-grabbing" ref={dragConstraintsRef}>
        <motion.div 
          drag="x" 
          dragConstraints={dragConstraintsRef}
          className="flex flex-col md:flex-row gap-8 pb-10 w-full"
        >
          {/* Card 1 */}
          <motion.div 
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex-shrink-0 w-full md:w-[400px] bg-surface border border-border rounded-2xl p-8 flex flex-col gap-6 relative group overflow-hidden drop-shadow-xl"
          >
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-slime/40 rounded-2xl transition-all duration-300 pointer-events-none" />
            <div className="absolute -inset-10 bg-slime/5 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-300 pointer-events-none" />
            
            <h3 className="text-2xl font-bold font-heading text-white">Jealous of their LinkedIn again?</h3>
            <p className="text-muted text-base leading-relaxed">
              You've refreshed their profile four times today. We're not judging. We're solving.
            </p>
            
            <div className="relative w-full h-56 bg-black border border-slime/30 rounded-xl flex items-center justify-center overflow-hidden border-glow mt-auto group/envy">
              {/* Envy Aura Background */}
              <div className="absolute inset-0 bg-slime/20 opacity-0 group-hover/envy:opacity-100 transition-opacity duration-700 blur-xl z-0" />
              
              {/* Fake LinkedIn UI Container */}
              <div className="relative z-10 w-[320px] bg-white rounded-lg shadow-2xl p-4 flex flex-col gap-2 font-sans overflow-hidden transform scale-[0.55] origin-top md:-translate-y-2 group-hover/envy:scale-[0.58] group-hover/envy:-translate-y-1 group-hover/envy:shadow-[0_0_40px_rgba(127,255,0,0.5)] transition-all duration-700">
                <h4 className="text-black font-bold text-lg mb-1">Experience</h4>
                
                {/* Jane Street */}
                <div className="flex gap-3 items-start border-b border-gray-100 pb-2">
                  <div className="w-10 h-10 shrink-0 bg-white border border-gray-200 rounded-sm flex items-center justify-center overflow-hidden">
                    <div className="w-6 h-6 rounded-full border-4 border-blue-800" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-[13px] leading-tight">Incoming Software Engineer</span>
                    <span className="text-gray-700 text-[11px]">Jane Street · Internship</span>
                    <span className="text-gray-500 text-[9px] mt-0.5">Oct 2025 - Present · 8 mos</span>
                    <span className="text-gray-500 text-[9px]">New York, United States · On-site</span>
                  </div>
                </div>

                {/* BitGo */}
                <div className="flex gap-3 items-start border-b border-gray-100 pb-2">
                  <div className="w-10 h-10 shrink-0 bg-[#0c1824] rounded-sm flex items-center justify-center border border-gray-200 overflow-hidden">
                    <span className="text-blue-400 font-bold text-xs">B</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-[13px] leading-tight">Software Engineer</span>
                    <span className="text-gray-700 text-[11px]">BitGo · Internship</span>
                    <span className="text-gray-500 text-[9px] mt-0.5">May 2025 - Aug 2025 · 4 mos</span>
                    <span className="text-gray-500 text-[9px]">Palo Alto, California, United States</span>
                  </div>
                </div>

                {/* TikTok */}
                <div className="flex gap-3 items-start border-b border-gray-100 pb-2">
                   <div className="w-10 h-10 shrink-0 bg-black rounded-sm flex items-center justify-center border border-gray-200 overflow-hidden">
                    <span className="text-white font-bold text-[15px] italic">♪</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-[13px] leading-tight">Software Engineer</span>
                    <span className="text-gray-700 text-[11px]">TikTok · Internship</span>
                    <span className="text-gray-500 text-[9px] mt-0.5">Sep 2024 - Dec 2024 · 4 mos</span>
                    <span className="text-gray-500 text-[9px]">Vancouver, British Columbia, Canada</span>
                  </div>
                </div>

                {/* Google */}
                <div className="flex gap-3 items-start border-b border-gray-100 pb-2">
                   <div className="w-10 h-10 shrink-0 bg-white rounded-sm flex items-center justify-center border border-gray-200 overflow-hidden">
                    <span className="text-red-500 font-bold font-serif text-[18px] leading-none">G</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-[13px] leading-tight">Software Engineer</span>
                    <span className="text-gray-700 text-[11px]">Google · Internship</span>
                    <span className="text-gray-500 text-[9px] mt-0.5">Jan 2024 - Apr 2024 · 4 mos</span>
                    <span className="text-gray-500 text-[9px]">Mountain View, California, United States</span>
                  </div>
                </div>

                {/* Huawei */}
                <div className="flex gap-3 items-start">
                   <div className="w-10 h-10 shrink-0 bg-white rounded-sm flex items-center justify-center border border-gray-200 overflow-hidden">
                    <span className="text-red-600 font-bold text-[18px] leading-none">H</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-[13px] leading-tight">Software Engineer</span>
                    <span className="text-gray-700 text-[11px]">Huawei · Internship</span>
                    <span className="text-gray-500 text-[9px] mt-0.5">May 2023 - Aug 2023 · 4 mos</span>
                    <span className="text-gray-500 text-[9px]">Markham, Ontario, Canada</span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex-shrink-0 w-full md:w-[450px] bg-surface rounded-2xl p-8 flex flex-col gap-6 relative overflow-hidden drop-shadow-xl z-10"
          >
            {/* Outline Glow Context */}
            <div className="absolute inset-0 border border-border rounded-2xl" />
            
            {/* Neon Green Drip */}
            <div className="absolute top-0 left-10 w-[2px] h-[50px] bg-slime animate-drip rounded-full blur-[1px] shadow-[0_0_10px_#7fff00]" />
            <div className="absolute top-0 right-10 w-[2px] h-[80px] bg-slime animate-drip rounded-full blur-[1px] shadow-[0_0_10px_#7fff00]" style={{ animationDelay: '0.7s'}} />

            <h3 className="text-3xl font-bold font-heading text-slime">Slime them.</h3>
            <p className="text-muted text-base leading-relaxed">
              One click. A world of petty satisfaction. The "Slime" button appears right beside Connect. Click it. Open the map. Schedule the duel.
            </p>
            
            <div className="relative w-full h-56 bg-[#162a36] border border-slime/20 rounded-xl flex items-center justify-center mt-auto overflow-hidden z-10">
              {/* Map base layers */}
              <div className="absolute top-0 left-0 w-full h-full bg-[#0f2129]" />
              <div className="absolute bottom-[-10px] left-[-20%] w-[150%] h-[120%] bg-[#12363e] origin-bottom-left -rotate-[22deg] md:-rotate-[15deg] z-0 shadow-inner" />
              
              {/* Minor dark blue roads */}
              <div className="absolute top-2 -left-10 w-[150px] h-3 bg-[#3B5472] -rotate-[35deg] z-0" />
              <div className="absolute top-16 -left-10 w-[120px] h-8 bg-[#3B5472] -rotate-[35deg] z-0 flex flex-col gap-1 items-center justify-center overflow-hidden">
                <div className="w-8 h-8 bg-[#2C4166] border border-[#1b2b47] rotate-[35deg] translate-y-2 opacity-50" />
              </div>
              
              {/* Main diagonal road (Sunlight St) */}
              <div className="absolute -top-10 -right-16 md:-right-8 w-12 md:w-16 h-[500px] bg-[#536B8C] rotate-[45deg] border-x border-[#2c3e56] flex flex-col items-center justify-ar py-6 z-10 shadow-xl overflow-hidden">
                <span className="text-[10px] text-white/90 rotate-[90deg] font-mono tracking-widest whitespace-nowrap mt-8">Sunlight St</span>
                <span className="text-[10px] text-white/90 rotate-[90deg] font-mono tracking-widest whitespace-nowrap mt-16">Sunlight St</span>
                <span className="text-[10px] text-white/90 rotate-[90deg] font-mono tracking-widest whitespace-nowrap mt-16">Sunlight St</span>
              </div>

              {/* Challenger road intersection */}
              <div className="absolute top-4 -right-2 w-20 h-6 bg-[#536B8C] rotate-[45deg] border-x border-[#2c3e56] flex items-center z-10">
                 <span className="text-[8px] text-white/90 font-mono pl-2">Challe</span>
              </div>

              {/* Right side buildings along Sunlight St */}
              <div className="absolute top-8 right-2 w-10 md:w-12 h-8 bg-[#2C4166] border border-[#1b2b47] rotate-[45deg] shadow-sm z-10 flex items-center justify-center">
                 <span className="text-[8px] text-white/40 -rotate-[45deg]">3374</span>
              </div>
              <div className="absolute top-[60px] right-6 w-12 md:w-14 h-10 bg-[#2C4166] border border-[#1b2b47] rotate-[45deg] shadow-sm z-10 flex items-center justify-center">
                 <span className="text-[8px] text-white/40 -rotate-[45deg]">3376</span>
              </div>
              <div className="absolute top-[105px] right-10 w-14 md:w-16 h-12 bg-[#2C4166] border border-[#1b2b47] rotate-[45deg] shadow-sm z-10 flex items-center justify-center">
                 <span className="text-[8px] text-white/40 -rotate-[45deg]">3380</span>
              </div>

              {/* Left side buildings along Sunlight St */}
              <div className="absolute bottom-[30px] left-[55%] md:left-[60%] w-12 md:w-14 h-8 bg-[#2C4166] border border-[#1b2b47] rotate-[45deg] shadow-sm z-10 flex items-center justify-center">
                 <span className="text-[7px] text-white/40 -rotate-[45deg]">3407</span>
              </div>
              <div className="absolute bottom-[-10px] left-[45%] md:left-[55%] w-14 md:w-16 h-10 bg-[#2C4166] border border-[#1b2b47] rotate-[45deg] shadow-sm z-10 flex items-center justify-center">
                 <span className="text-[7px] text-white/40 -rotate-[45deg]">3411</span>
              </div>
              <div className="absolute bottom-[-50px] left-[35%] md:left-[50%] w-12 md:w-14 h-10 bg-[#2C4166] border border-[#1b2b47] rotate-[45deg] shadow-sm z-10 flex items-center justify-center">
                 <span className="text-[7px] text-white/40 -rotate-[45deg]">3417</span>
              </div>

              {/* Target User Marker */}
              <div className="absolute bottom-[40px] right-[25%] md:right-[30%] w-12 h-12 rounded-full border-[2.5px] border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.9)] bg-red-500/20 flex flex-col items-center justify-center z-20">
                <div className="w-[85%] h-[85%] bg-black rounded-full overflow-hidden relative">
                  {/* Using a placeholder avatar for realism, falling back to a generic one */}
                  <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Target" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Glass Pill Timer */}
              <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 z-30 bg-white/[0.15] backdrop-blur-xl border-2 border-white/20 rounded-[2rem] px-5 py-2 md:px-8 md:py-3 flex items-center gap-4 md:gap-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] min-w-[240px] justify-between">
                <div className="flex flex-col items-center">
                  <span className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-white/90 uppercase font-sans">Time Remaining</span>
                  <span className="text-4xl md:text-5xl font-black text-white font-mono tracking-tighter drop-shadow-md leading-none mt-1">59:31</span>
                </div>
                <div className="flex flex-col gap-3 border-l border-white/20 pl-4 py-1">
                  <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  <svg className="w-4 h-4 text-white/80" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6-6.2-4.5h7.6L12 2z" /></svg>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            custom={2}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="flex-shrink-0 w-full md:w-[400px] bg-surface border border-border rounded-2xl p-8 flex flex-col gap-6 relative overflow-hidden drop-shadow-xl"
          >
            <div className="px-3 py-1 bg-blue-900/40 text-blue-400 border border-blue-500/30 rounded-full w-max text-xs font-mono font-bold tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              SlimedOut Pro 🏢
            </div>
            <h3 className="text-2xl font-bold font-heading text-white">For recruiters who mean business.</h3>
            <p className="text-muted text-base leading-relaxed flex-grow">
              Throw all your final-round candidates into a Battle Round. Last one standing gets the offer. 
              <br/><br/>
              Legally, this is fine.*
            </p>
            
            <button
              onClick={() => setEnterpriseOpen(true)}
              className="relative w-full mt-4 py-4 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 font-semibold text-sm hover:bg-blue-600/30 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300 cursor-pointer group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-12 transition-transform duration-300">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Try Enterprise Mode
              </span>
            </button>
            
            <p className="text-[10px] text-muted font-mono mt-2 opacity-50">
              *It is not fine.
            </p>
          </motion.div>
        </motion.div>
      </div>

      <EnterpriseModal isOpen={enterpriseOpen} onClose={() => setEnterpriseOpen(false)} />
    </section>
  );
}
