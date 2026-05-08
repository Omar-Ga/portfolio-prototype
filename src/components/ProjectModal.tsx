import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Settings2 } from 'lucide-react';
import type { Project } from '../data/projects';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [navStyle, setNavStyle] = useState<'pill' | 'separated'>('pill');
  
  // Replicate the image to mock a carousel
  const images = Array(4).fill(project.image);

  const handleDragEnd = (_: any, info: any) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset < -50 || velocity < -500) {
      paginate(1);
    } else if (offset > 50 || velocity > 500) {
      paginate(-1);
    }
  };

  const paginate = (newDirection: number) => {
    if (newDirection === 1 && currentIndex < images.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
    } else if (newDirection === -1 && currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-10"
    >
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" 
        onClick={onClose}
      />
      
      <motion.div
        layoutId={`project-${project._id}`}
        className="relative w-full h-full md:max-w-3xl md:aspect-square bg-zinc-900 rounded-none md:rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col"
      >
        <button 
          onClick={() => setNavStyle(prev => prev === 'pill' ? 'separated' : 'pill')}
          className="hidden md:block absolute top-6 right-20 z-30 p-2.5 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 border border-white/10"
          title="Toggle Navigation Style"
        >
          <Settings2 size={20} />
        </button>
        <button 
          onClick={onClose}
          className="absolute top-6 left-6 md:left-auto md:right-6 z-30 p-3 md:p-2.5 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 border border-white/10"
        >
          <X size={20} />
        </button>

        <div className="relative w-full h-full overflow-hidden bg-zinc-950">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={currentIndex}
              src={images[currentIndex]}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={handleDragEnd}
              alt={`${project.title} - ${currentIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
            />
          </AnimatePresence>

          {/* Gradient Overlay for better UI contrast */}
          <div className="absolute inset-x-0 bottom-0 h-48 md:h-40 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />
          
          <div className="absolute bottom-24 left-6 md:bottom-8 md:left-8 z-20 pointer-events-none">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</h2>
            <p className="text-white/70 font-medium tracking-wide uppercase text-xs md:text-sm">{project.category}</p>
          </div>

          {/* Navigation UI Toggle */}
          {navStyle === 'pill' ? (
            <div className="absolute bottom-8 md:bottom-8 right-6 md:right-8 z-30 flex items-center gap-3 bg-black/40 backdrop-blur-xl rounded-full p-2 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
              <button
                onClick={() => paginate(-1)}
                disabled={currentIndex === 0}
                className={`p-2 rounded-full transition-all ${
                  currentIndex === 0 ? 'opacity-20 cursor-default' : 'text-white hover:bg-white/10 active:scale-90'
                }`}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex gap-2 px-1">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > currentIndex ? 1 : -1);
                      setCurrentIndex(i);
                    }}
                    className="relative w-1.5 h-1.5 flex items-center justify-center outline-none group"
                  >
                    <div className="absolute inset-0 rounded-full bg-white/20 transition-colors group-hover:bg-white/40" />
                    {currentIndex === i && (
                      <motion.div
                        layoutId="activeIndicatorPill"
                        className="absolute inset-0 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => paginate(1)}
                disabled={currentIndex === images.length - 1}
                className={`p-2 rounded-full transition-all ${
                  currentIndex === images.length - 1 ? 'opacity-20 cursor-default' : 'text-white hover:bg-white/10 active:scale-90'
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <>
              {/* Separated Navigation Arrows (Moved to bottom right) */}
              <div className="absolute bottom-8 right-6 md:right-8 flex items-center gap-3 z-30 pointer-events-none">
                <button
                  onClick={() => paginate(-1)}
                  disabled={currentIndex === 0}
                  className={`p-4 md:p-3 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white transition-all pointer-events-auto border border-white/10 ${
                    currentIndex === 0 ? 'opacity-0 scale-90 cursor-default' : 'opacity-100 scale-100 hover:scale-110 active:scale-95'
                  }`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => paginate(1)}
                  disabled={currentIndex === images.length - 1}
                  className={`p-4 md:p-3 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white transition-all pointer-events-auto border border-white/10 ${
                    currentIndex === images.length - 1 ? 'opacity-0 scale-90 cursor-default' : 'opacity-100 scale-100 hover:scale-110 active:scale-95'
                  }`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Vertical Oval Indicator */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-3.5 bg-black/40 backdrop-blur-xl rounded-full py-5 px-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 z-20 pointer-events-auto">
                {images.map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => {
                      setDirection(i > currentIndex ? 1 : -1);
                      setCurrentIndex(i);
                    }}
                    className="relative w-2.5 h-2.5 flex items-center justify-center outline-none group"
                  >
                    <div className="absolute inset-0 rounded-full bg-white/30 transition-colors group-hover:bg-white/50" />
                    {currentIndex === i && (
                      <motion.div 
                        layoutId="activeIndicatorSep"
                        className="absolute inset-0 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectModal;
