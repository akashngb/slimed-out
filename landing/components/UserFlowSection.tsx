'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function UserFlowSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Create a Framer Motion constraint ref for drag-to-scroll
  const dragConstraintsRef = useRef<HTMLDivElement>(null);

  const cardVariants = {
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
            
            <div className="relative w-full h-48 bg-black border border-slime/30 rounded-xl flex items-center justify-center overflow-hidden border-glow mt-auto">
              <span className="text-muted font-mono text-xs w-[80%] text-center">
                [Placeholder: LinkedIn profile screenshot with green envy aura / glow effect]
              </span>
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
            
            <div className="relative w-full h-56 bg-black border border-slime/20 rounded-xl flex items-center justify-center mt-auto p-4 z-10">
               <span className="text-muted font-mono text-xs text-center border border-muted/20 px-4 py-2 rounded-md bg-black">
                [Placeholder: Chrome extension UI mockup — Slime button beside Connect on a LinkedIn profile]
              </span>
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
            
            <div className="relative w-full h-40 bg-black border border-blue-900/50 rounded-xl flex items-center justify-center mt-4">
              <span className="text-blue-500/60 font-mono text-xs w-[80%] text-center">
                [Placeholder: Map view with 6 candidate pins in a bracket/tournament overlay]
              </span>
            </div>
            
            <p className="text-[10px] text-muted font-mono mt-2 opacity-50">
              *It is not fine.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
