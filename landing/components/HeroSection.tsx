'use client';
import { motion } from 'framer-motion';
import { SplineHero } from './SplineHero';

export function HeroSection() {
  const scrollToNext = () => {
    document.getElementById('user-flow')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
      <SplineHero />
      
      {/* Readability Overlay: Darkening the background and adding a radial gradient behind text */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none z-[5]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0.8)_0%,transparent_60%)] pointer-events-none z-[5]" />
      
      {/* Content wrapper ensures z-index stays above Spline and overlays */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center flex flex-col items-center">
        
        <motion.h1 
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 mb-6 drop-shadow-sm max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          LinkedIn just got a lot more <span className="text-glow text-slime bg-none bg-transparent">dangerous.</span>
        </motion.h1>

        <motion.p 
          className="text-lg md:text-2xl text-muted font-medium max-w-2xl mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Slime your competition. Claim your territory.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <a href="https://chrome.google.com/webstore" target="_blank" rel="noreferrer" className="w-full sm:w-auto px-8 py-4 bg-slime text-black font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(127,255,0,0.3)]">
            Add to Chrome — It's Free
          </a>
          <button onClick={scrollToNext} className="w-full sm:w-auto px-8 py-4 bg-transparent border border-muted text-text font-semibold rounded-full hover:border-white hover:text-white transition-all duration-300">
            See How It Works
          </button>
        </motion.div>
      </div>

      {/* Fade into next section gradient */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none z-10" />
    </section>
  );
}
