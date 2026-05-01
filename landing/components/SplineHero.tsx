'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function SplineHero() {
  const [activeProfiles, setActiveProfiles] = useState<any[]>([]);
  const [mountTime, setMountTime] = useState<number | null>(null);

  // 1. Wait for globe to load completely before showing anything
  useEffect(() => {
    const timer = setTimeout(() => {
      setMountTime(Date.now());
    }, 4000); // 4 seconds should be enough for Sketchfab to pop in full size
    return () => clearTimeout(timer);
  }, []);

  // 2. Fixed set of pins
  useEffect(() => {
    if (!mountTime) return;

    const FIXED_PROFILES = [
      { id: '1', name: 'Kelly Gao', role: 'SWE @ Google', avatar: 'https://i.pravatar.cc/150?u=1', angle: 0, yPos: -50 },
      { id: '2', name: 'Alex Todd', role: 'PM @ Stripe', avatar: 'https://i.pravatar.cc/150?u=2', angle: 45, yPos: 20 },
      { id: '3', name: 'Sarah M.', role: 'Chef @ Figma', avatar: 'https://i.pravatar.cc/150?u=3', angle: 90, yPos: -80 },
      { id: '4', name: 'David L.', role: 'VP @ Vercel', avatar: 'https://i.pravatar.cc/150?u=4', angle: 135, yPos: 40 },
      { id: '5', name: 'Jason P.', role: 'Lead @ OpenAI', avatar: 'https://i.pravatar.cc/150?u=5', angle: 180, yPos: -20 },
      { id: '6', name: 'Maya R.', role: 'Dev @ Apple', avatar: 'https://i.pravatar.cc/150?u=6', angle: 225, yPos: 60 },
      { id: '7', name: 'James K.', role: 'CEO @ Notion', avatar: 'https://i.pravatar.cc/150?u=7', angle: 270, yPos: -40 },
      { id: '8', name: 'Elena B.', role: 'CTO @ Airbnb', avatar: 'https://i.pravatar.cc/150?u=8', angle: 315, yPos: 10 },
      { id: '9', name: 'Marcus T.', role: 'Design @ Uber', avatar: 'https://i.pravatar.cc/150?u=9', angle: 20, yPos: 100 },
      { id: '10', name: 'Chloe J.', role: 'Ops @ Scale', avatar: 'https://i.pravatar.cc/150?u=10', angle: 160, yPos: -110 },
      { id: '11', name: 'Omer A.', role: 'Staff @ Meta', avatar: 'https://i.pravatar.cc/150?u=11', angle: 240, yPos: -10 },
      { id: '12', name: 'Sofia R.', role: 'Product @ Linear', avatar: 'https://i.pravatar.cc/150?u=12', angle: 335, yPos: 75 },
    ];

    let currentIndex = 0;
    
    const getNextProfile = () => {
      const p = { ...FIXED_PROFILES[currentIndex], spawnTime: Date.now() };
      currentIndex = (currentIndex + 1) % FIXED_PROFILES.length;
      return p;
    };

    // Initial spawn
    setActiveProfiles([getNextProfile()]);

    const cycle = setInterval(() => {
      setActiveProfiles((prev) => {
        // Append one new profile, keeping at most the last 2 so they stagger
        return [...prev.slice(-2), getNextProfile()];
      });
    }, 2000); // 2 second intervals as requested
    
    return () => clearInterval(cycle);
  }, [mountTime]);

  return (
    <div className="absolute inset-0 w-full min-h-[800px] md:h-[120vh] z-0 overflow-hidden pt-20 bg-bg">
      {/* 
        CSS Animations for flawless 3D syncing. 
        Instead of letting Framer Motion fight with React re-renders,
        we use CSS keyframes so that the counter-rotation perfectly syncs 
        and the pin ALWAYS faces the camera, while fading out at the edges. 
      */}
      <style>{`
        @keyframes spin-earth {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }
        @keyframes counter-spin-earth {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(-360deg); }
        }
        @keyframes orbit-fade {
          0% { opacity: 1; visibility: visible; }
          22% { opacity: 1; visibility: visible; }
          25% { opacity: 0; visibility: hidden; }
          75% { opacity: 0; visibility: hidden; }
          78% { opacity: 1; visibility: visible; }
          100% { opacity: 1; visibility: visible; }
        }
      `}</style>

      {/* Blending Overlays */}
      <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-bg to-transparent opacity-100 z-[2]" />
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-bg via-bg/40 to-transparent opacity-100 z-[2]" />
      <div className="absolute inset-0 bg-black/40 z-[1] pointer-events-none" />
      
      {/* Sketchfab Earth Embed Wrapper (Hidden initially to remove loading text flash) */}
      <div className={`relative w-full h-[160%] top-[-30%] scale-[1.5] md:scale-[1.3] flex justify-center items-start pointer-events-none transition-opacity duration-1000 ${mountTime ? 'opacity-70' : 'opacity-0'}`}>
        <iframe 
          title="Earth" 
          allowFullScreen 
          allow="autoplay; fullscreen; xr-spatial-tracking" 
          className="w-full h-full"
          src="https://sketchfab.com/models/0caafb7e837047a688a3e504c0ea74af/embed?autostart=1&autospin=0.12&ui_annotations=0&ui_controls=0&ui_hint=0&ui_info=0&ui_stop=0&ui_watermark=0&transparent=1&dnt=1"
        />
      </div>

      {/* 3D Pin Layer - Rotates in sync with Sketchfab */}
      {mountTime && (
        <div className="absolute inset-0 z-[10] flex items-center justify-center pointer-events-none" style={{ perspective: "1500px" }}>
          
          {/* CONTAINER: Rotates infinitely without interruption. */}
          <div 
            className="relative flex items-center justify-center w-[400px] h-[400px]"
            style={{ 
              transformStyle: "preserve-3d",
              animation: "spin-earth 50s linear infinite" 
            }}
          >
            <AnimatePresence>
              {activeProfiles.map((profile) => {
                 // Calculate the exact mathematical delay required to synchronize the newly spawned 
                 // pin's animation timeline with the 50s loop of the orbiting parent container.
                 const elapsedSinceMount = (profile.spawnTime - mountTime) / 1000;
                 const angularTimeOffset = (profile.angle / 360) * 50;
                 const syncDelay = -(elapsedSinceMount + angularTimeOffset);

                return (
                  <div
                    key={profile.id}
                    className="absolute left-[50%] top-[50%] ml-[-24px] mt-[-24px]"
                    style={{ 
                      // Pushes it out 550px radius + puts it on specific lat/long via angle+yPos
                      transform: `translateY(${profile.yPos}px) rotateY(${profile.angle}deg) translateZ(550px)`,
                      transformStyle: "preserve-3d"
                    }}
                  >
                    {/* COUNTER SPINNER & FADER: Perfectly cancels out the 50s rotation to always face camera directly */}
                    <div
                      className="flex flex-col items-center justify-center w-12 h-12"
                      style={{
                        animation: "counter-spin-earth 50s linear infinite, orbit-fade 50s linear infinite",
                        animationDelay: `${syncDelay}s, ${syncDelay}s`,
                        transformStyle: "preserve-3d"
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", damping: 15, stiffness: 80, duration: 1.5 }}
                        className="flex flex-col items-center drop-shadow-2xl relative"
                      >

                        {/* Actual Map Pin visual */}
                        <div className="relative flex flex-col items-center justify-center group w-12 h-12">
                          <div className="absolute -bottom-8 w-8 h-8 border-2 border-slime rounded-full animate-ping opacity-50 shadow-[0_0_15px_#7fff00]" 
                               style={{ transform: "rotateX(75deg)" }} />
                          <div className="absolute -bottom-8 w-2 h-2 bg-slime rounded-full shadow-[0_0_10px_#7fff00]" 
                               style={{ transform: "rotateX(75deg)" }} />

                          {/* The Pin head (Tapered tear drop) */}
                          <div className="relative w-12 h-12 bg-slime rounded-t-full rounded-bl-full rounded-br-sm rotate-45 flex items-center justify-center shadow-[0_5px_15px_rgba(127,255,0,0.5)] border-2 border-slime overflow-hidden">
                            {/* Avatar inside pin (un-rotate 45) */}
                            <img 
                              src={profile.avatar} 
                              alt={profile.name} 
                              className="absolute w-[calc(100%-4px)] h-[calc(100%-4px)] rounded-full -rotate-45 object-cover" 
                            />
                          </div>
                        </div>

                        {/* Clean text label below pin, facing out perfectly */}
                        <div className="mt-8 flex flex-col items-center opacity-90 backdrop-blur-md bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 pointer-events-none whitespace-nowrap">
                          <span className="text-[12px] font-bold text-white uppercase tracking-wider">{profile.name}</span>
                          <span className="text-[10px] text-slime font-mono">{profile.role}</span>
                        </div>

                      </motion.div>
                    </div>
                  </div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
