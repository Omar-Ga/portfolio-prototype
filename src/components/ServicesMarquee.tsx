import React from 'react';

const services = [
  "Environmental concepting",
  "3D modelling",
  "Tutoring",
  "mentorship",
  "Real Time visualisation",
  "3D Scanning Clean up",
  "Gaea Terrain Commissions"
];

const ServicesMarquee: React.FC = () => {
  return (
    <div className="relative w-full py-12 md:py-16 bg-black overflow-hidden border-y border-white/5 group">
      {/* Ethereal Aurora Background Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-blue-500/10 blur-[120px] rounded-full animate-aurora" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-purple-500/10 blur-[120px] rounded-full animate-aurora [animation-delay:-5s]" />
      </div>

      {/* Marquee Container */}
      <div className="relative z-10 flex whitespace-nowrap overflow-hidden">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] py-2">
          {[...services, ...services].map((service, index) => (
            <div 
              key={index} 
              className="flex items-center mx-6 md:mx-12 lg:mx-16"
            >
              <span className="text-2xl md:text-3xl lg:text-4xl font-light tracking-[0.2em] text-white/80 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:text-blue-400 hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.8)] transition-all duration-500 font-['Raleway'] cursor-default [font-variant-numeric:lining-nums]">
                {service}
              </span>
              <div className="mx-12 md:mx-24 lg:mx-32 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>
          ))}
        </div>
        
        {/* Duplicate for seamless loop (handled by the mapping above, but we need enough items to fill the screen and then some) */}
        <div className="flex animate-marquee group-hover:[animation-play-state:paused] py-2" aria-hidden="true">
          {[...services, ...services].map((service, index) => (
            <div 
              key={index} 
              className="flex items-center mx-6 md:mx-12 lg:mx-16"
            >
              <span className="text-2xl md:text-3xl lg:text-4xl font-light tracking-[0.2em] text-white/80 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:text-blue-400 hover:drop-shadow-[0_0_20px_rgba(59,130,246,0.8)] transition-all duration-500 font-['Raleway'] cursor-default [font-variant-numeric:lining-nums]">
                {service}
              </span>
              <div className="mx-12 md:mx-24 lg:mx-32 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesMarquee;
