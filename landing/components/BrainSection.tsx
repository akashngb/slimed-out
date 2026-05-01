'use client';
import { motion } from 'framer-motion';
import { SplineBrain } from './SplineBrain';

export function BrainSection() {
  const rows = [
    {
      color: "bg-heat shadow-[0_0_12px_#ff6b2b]",
      label: "Competitive Cortex",
      desc: "[Placeholder text outlining how the brain processes workplace threat and competition level]"
    },
    {
      color: "bg-[#eab308] shadow-[0_0_12px_#eab308]",
      label: "Envy Processing Unit",
      desc: "[Placeholder text on parsing high-performing peers and triggering the baseline need to act]"
    },
    {
      color: "bg-slime shadow-[0_0_12px_#7fff00]",
      label: "Slime Decision Engine",
      desc: "[Placeholder text calculating optimal tactical targets for maximum petty retaliation]"
    },
    {
      color: "bg-[#3b82f6] shadow-[0_0_12px_#3b82f6]",
      label: "Post-Slime Clarity",
      desc: "[Placeholder text detailing the dopamine rush followed by lingering professional dread]"
    }
  ];

  return (
    <section className="w-full relative py-32 bg-bg px-6 lg:px-12 border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        
        {/* Left Side: 3D Brain */}
        <motion.div 
          className="w-full md:w-1/2 flex justify-center"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <SplineBrain />
        </motion.div>

        {/* Right Side: Text & Data Features */}
        <motion.div 
          className="w-full md:w-1/2 flex flex-col items-start gap-8"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-4 leading-tight">
            What's actually happening in there.
          </h2>
          
          <div className="w-full flex flex-col gap-6 font-mono text-sm border-l border-border pl-6 relative">
            {rows.map((row, i) => (
              <motion.div 
                key={i}
                className="flex flex-col gap-2 relative group"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
              >
                {/* Lit Dot Indicator */}
                <span className={`absolute -left-[30px] top-1.5 w-2 h-2 rounded-full ${row.color} md:group-hover:scale-150 transition-transform`} />
                
                <h4 className="text-white font-bold tracking-wider uppercase text-xs md:text-sm">{row.label}</h4>
                <p className="text-muted leading-relaxed max-w-sm font-sans">{row.desc}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-xs text-muted/50 font-mono mt-4 italic">
            Fill in copy later. These are placeholders.
          </p>

          <a 
            href="https://github.com/akashngb/slimed-out" 
            target="_blank" 
            rel="noreferrer" 
            className="mt-8 px-8 py-4 bg-slime text-black font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(127,255,0,0.3)] hover:shadow-[0_0_40px_rgba(127,255,0,0.5)]"
          >
            Get Chrome Extension
          </a>
        </motion.div>

      </div>
    </section>
  );
}
