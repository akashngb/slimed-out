'use client';

import { useState, useEffect } from 'react';

export function SplineBrain() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-[500px] md:h-[700px] relative flex items-center justify-center bg-black/20 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
      {/* Glow Effects backing the Visual */}
      <div className="absolute w-[300px] h-[300px] bg-heat/20 mix-blend-screen blur-[100px] animate-pulse-glow z-0" />
      <div className="absolute w-[200px] h-[200px] bg-slime/20 mix-blend-screen blur-[80px] animate-pulse-glow z-0" style={{ animationDelay: '1s', left: '20%', top: '30%' }} />
      
      {/* Sketchfab Earth Embed Wrapper */}
      <div className={`relative w-[180%] h-[180%] z-10 flex items-center justify-center pointer-events-none p-0 transition-opacity duration-1000 ${show ? 'opacity-100' : 'opacity-0'}`}>
        <iframe 
          title="Earth" 
          allowFullScreen 
          allow="autoplay; fullscreen; xr-spatial-tracking" 
          className="w-full h-full scale-[1.2]"
          src="https://sketchfab.com/models/0caafb7e837047a688a3e504c0ea74af/embed?autostart=1&ui_annotations=0&ui_controls=0&ui_hint=0&ui_info=0&ui_stop=0&ui_watermark=0&transparent=1&dnt=1"
        />
      </div>

      {/* Subtle overlay for contrast */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-bg/40 via-transparent to-bg/40" />
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/5 rounded-[2rem] z-30" />
    </div>
  );
}
