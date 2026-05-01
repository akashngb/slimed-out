'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function SplineBrain() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full h-[400px] md:h-[600px] relative flex items-center justify-center bg-transparent rounded-[2rem] overflow-hidden group">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#111a22] to-bg rounded-[2rem] border border-white/[0.03] shadow-2xl z-0" />
      <div className="absolute w-[300px] h-[300px] bg-slime/5 mix-blend-screen blur-[100px] group-hover:scale-110 transition-transform duration-1000 z-0" />

      {/* Brain Container */}
      <div className="relative z-10 w-[280px] h-[280px] md:w-[380px] md:h-[380px] flex items-center justify-center">
        
        {/* Core Brain Grid / Wireframe (Minimal layout) */}
        <svg 
          className="w-full h-full text-white/[0.05] drop-shadow-lg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="0.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M12 5a3 3 0 0 1 3-3c1.9 0 3 1.5 3 3.5a3.5 3.5 0 0 1 1 6.5A4 4 0 0 1 20 18a4 4 0 0 1-8 4 4 4 0 0 1-8-4 4 4 0 0 1 1-6A3.5 3.5 0 0 1 6 8.5C6 6.5 7.1 5 9 5a3 3 0 0 1 3-3" className="stroke-white/10" />
          <path d="M12 5v19" />
          <path d="M9 13h6" />
          <path d="M7 10h10" />
          <path d="M8 17h8" />
        </svg>

        {/* Highlighted Activity Nodes */}
        {mounted && (
          <>
            {/* 1. Competitive Cortex (Heat/Orange) */}
            <motion.div 
              className="absolute top-[20%] left-[45%] w-3 h-3 bg-[#ff6b2b] rounded-full shadow-[0_0_20px_4px_rgba(255,107,43,0.6)]"
              animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0 }}
            >
              <div className="absolute inset-0 bg-[#ff6b2b] rounded-full animate-ping opacity-75" />
            </motion.div>

            {/* 2. Envy Processing Unit (Yellow) */}
            <motion.div 
              className="absolute top-[45%] right-[25%] w-4 h-4 bg-[#eab308] rounded-full shadow-[0_0_25px_5px_rgba(234,179,8,0.6)]"
              animate={{ scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <div className="absolute inset-0 bg-[#eab308] rounded-full animate-ping opacity-50 transition-all duration-1000" style={{ animationDuration: '3s' }} />
            </motion.div>

            {/* 3. Slime Decision Engine (Slime Green) */}
            <motion.div 
              className="absolute top-[55%] left-[30%] w-5 h-5 bg-[#7fff00] rounded-full shadow-[0_0_30px_8px_rgba(127,255,0,0.4)]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              {/* Connection lines spreading out */}
              <svg className="absolute -inset-[50px] w-[120px] h-[120px] -z-10" viewBox="0 0 100 100" fill="none">
                <path d="M50 50 L10 20 M50 50 L90 30 M50 50 L60 90 M50 50 L20 80" stroke="#7fff00" strokeWidth="1" className="opacity-20" />
              </svg>
              <div className="absolute inset-0 bg-[#7fff00] rounded-full animate-ping opacity-60" style={{ animationDuration: '1.5s' }} />
            </motion.div>

            {/* 4. Post-Slime Clarity (Blue) */}
            <motion.div 
              className="absolute bottom-[25%] left-[55%] w-2.5 h-2.5 bg-[#3b82f6] rounded-full shadow-[0_0_15px_3px_rgba(59,130,246,0.5)]"
              animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
          </>
        )}
      </div>

      {/* Floating Network Particles */}
      {mounted && [...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          initial={{ 
            x: Math.random() * 300 - 150, 
            y: Math.random() * 300 - 150,
            opacity: 0
          }}
          animate={{ 
            y: [null, Math.random() * -100 - 50],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear"
          }}
        />
      ))}

      {/* Foreground subtle overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-bg/60 via-transparent to-transparent rounded-[2rem]" />
    </div>
  );
}
