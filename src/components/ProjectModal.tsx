import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Settings2,
  MoreVertical,
  ArrowUpLeft,
  ArrowDownRight,
  ArrowUpRight,
  ArrowDownLeft
} from 'lucide-react';
import type { Project } from '../data/projects';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [navStyle, setNavStyle] = useState<'pill' | 'separated'>('pill');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [descriptionHeight, setDescriptionHeight] = useState(0);
  const descriptionMeasureRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Disable scrolling on mount
    document.body.style.overflow = 'hidden';
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Re-enable scrolling and remove listener on unmount
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    setIsDescriptionOpen(false);
  }, [project._id]);

  useLayoutEffect(() => {
    const measure = () => {
      if (!descriptionMeasureRef.current) return;
      setDescriptionHeight(descriptionMeasureRef.current.scrollHeight);
    };

    measure();

    const node = descriptionMeasureRef.current;
    if (!node || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => observer.disconnect();
  }, [project.description, project.title]);
  
  // Build ordered media list:
  // 1) previewVideo (always first when present)
  // 2) all other videos from `project.media`
  // 3) all other images from `project.media`, plus `project.image` as fallback
  const media = (() => {
    const urls: string[] = [];

    // 1) preview video first
    if (project.previewVideo) urls.push(project.previewVideo);

    // helper to detect video by known extensions as a fallback
    const isVideoUrl = (u?: string) => !!u && (u.endsWith('.mp4') || u.endsWith('.webm'));

    // 2) other videos from new mixed media collection
    if (project.media && project.media.length > 0) {
      const videos = project.media
        .filter((m) => m && (m.type === 'video' || isVideoUrl(m.url)))
        .map((m) => m.url)
        .filter(Boolean);
      urls.push(...videos);

      // 3) images from mixed media
      const images = project.media
        .filter((m) => m && (m.type === 'image' || !isVideoUrl(m.url)))
        .map((m) => m.url)
        .filter(Boolean);
      urls.push(...images);
    } else {
      // Fallback for older projects: use image only
      if (project.image) urls.push(project.image);
    }

    // Deduplicate while preserving order
    return Array.from(new Set(urls));
  })();

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
    if (newDirection === 1 && currentIndex < media.length - 1) {
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

  const isPortrait = project.aspectRatio === '9:16';
  const sizeClasses = isPortrait
    ? isExpanded
      ? 'md:w-auto md:h-[88vh] md:aspect-[9/16]'
      : 'md:w-auto md:h-[72vh] md:aspect-[9/16]'
    : isExpanded
      ? 'md:w-[88vw] md:h-auto md:max-w-none md:aspect-[16/9]'
      : 'md:w-[70vw] md:h-auto md:max-w-5xl md:aspect-[16/9]';
  const descriptionText = project.description?.trim() || 'No project description is available yet.';
  const descriptionLift = isDescriptionOpen ? descriptionHeight + 20 : 0;

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
        layout
        layoutId={`project-${project._id}`}
        className={`relative w-full h-full ${sizeClasses} bg-zinc-900 rounded-none md:rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col`}
      >
        <motion.div layout className="hidden md:flex absolute top-6 right-6 z-30 items-center gap-3">
          <motion.button
            layout
            onClick={() => setIsDescriptionOpen((prev) => !prev)}
            className="p-2.5 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 border border-white/10"
            title={isDescriptionOpen ? 'Hide Project Description' : 'Show Project Description'}
            aria-label={isDescriptionOpen ? 'Hide Project Description' : 'Show Project Description'}
          >
            <MoreVertical size={20} />
          </motion.button>
          <motion.button 
            layout
            onClick={() => setNavStyle(prev => prev === 'pill' ? 'separated' : 'pill')}
            className="p-2.5 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 border border-white/10"
            title="Toggle Navigation Style"
            aria-label="Toggle Navigation Style"
          >
            <Settings2 size={20} />
          </motion.button>
          <motion.button
            layout
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-2.5 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 border border-white/10"
            title={isExpanded ? 'Collapse Project' : 'Expand Project'}
            aria-label={isExpanded ? 'Collapse Project' : 'Expand Project'}
          >
            <motion.span layout className="flex items-center gap-0.5">
              {isExpanded ? (
                <>
                  <ArrowDownLeft size={16} />
                  <ArrowUpRight size={16} />
                </>
              ) : (
                <>
                  <ArrowUpLeft size={16} />
                  <ArrowDownRight size={16} />
                </>
              )}
            </motion.span>
          </motion.button>
          <motion.button 
            layout
            onClick={onClose}
            className="p-2.5 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 border border-white/10"
            aria-label="Close Project"
          >
            <X size={20} />
          </motion.button>
        </motion.div>
        <div className="md:hidden absolute top-6 left-6 z-30 flex items-center gap-3">
          <motion.button 
            layout
            onClick={onClose}
            className="p-3 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 border border-white/10"
            aria-label="Close Project"
          >
            <X size={20} />
          </motion.button>
          <motion.button
            layout
            onClick={() => setIsDescriptionOpen((prev) => !prev)}
            className="p-3 bg-black/40 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 border border-white/10"
            title={isDescriptionOpen ? 'Hide Project Description' : 'Show Project Description'}
            aria-label={isDescriptionOpen ? 'Hide Project Description' : 'Show Project Description'}
          >
            <MoreVertical size={20} />
          </motion.button>
        </div>

        <div className="relative w-full h-full overflow-hidden bg-zinc-950">
          <AnimatePresence initial={false} custom={direction}>
            {media[currentIndex]?.endsWith('.mp4') || media[currentIndex]?.endsWith('.webm') ? (
              <motion.video
                key={currentIndex}
                src={media[currentIndex]}
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
                autoPlay
                muted
                loop
                playsInline
                onClick={() => {
                  if (isDescriptionOpen) {
                    setIsDescriptionOpen(false);
                  }
                }}
                className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
              />
            ) : (
              <motion.img
                key={currentIndex}
                src={media[currentIndex]}
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
                onClick={() => {
                  if (isDescriptionOpen) {
                    setIsDescriptionOpen(false);
                  }
                }}
                className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
              />
            )}
          </AnimatePresence>

          {/* Gradient Overlay for better UI contrast */}
          <div className="absolute inset-x-0 bottom-0 h-48 md:h-40 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />
          
          <motion.div
            layout
            animate={{ y: -descriptionLift }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="absolute bottom-24 left-6 md:bottom-8 md:left-8 z-20 pointer-events-none"
          >
            <motion.h2 layout className="text-2xl md:text-3xl font-bold text-white mb-2">{project.title}</motion.h2>
            <motion.p layout className="text-white/70 font-medium tracking-wide uppercase text-xs md:text-sm">{project.category}</motion.p>
          </motion.div>

          <AnimatePresence initial={false}>
            {isDescriptionOpen && (
              <motion.div
                key="description-panel"
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 32 }}
                style={{ height: descriptionHeight || 'auto' }}
                className="absolute inset-x-0 bottom-0 z-20 overflow-hidden border-t border-white/10 bg-black/70 backdrop-blur-xl"
              >
                <div className="relative h-full px-6 py-5 md:px-8 md:py-6">
                  <div ref={descriptionMeasureRef} className="space-y-3 text-white">
                    <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/45">Project Description</p>
                    <p className="max-w-3xl text-sm md:text-[15px] leading-6 md:leading-7 text-white/88 whitespace-pre-line">
                      {descriptionText}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation UI Toggle */}
          {navStyle === 'pill' ? (
            <motion.div
              layout
              animate={{ y: -descriptionLift }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="absolute bottom-8 md:bottom-8 right-6 md:right-8 z-30 flex items-center gap-3 bg-black/40 backdrop-blur-xl rounded-full p-2 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            >
              <motion.button
                layout
                onClick={() => paginate(-1)}
                disabled={currentIndex === 0}
                className={`p-2 rounded-full transition-all ${
                  currentIndex === 0 ? 'opacity-20 cursor-default' : 'text-white hover:bg-white/10 active:scale-90'
                }`}
              >
                <ChevronLeft size={18} />
              </motion.button>
              <motion.div layout className="flex gap-2 px-1">
                {media.map((_, i) => (
                  <motion.button
                    layout
                    key={i}
                    onClick={() => {
                      setDirection(i > currentIndex ? 1 : -1);
                      setCurrentIndex(i);
                    }}
                    className="relative w-1.5 h-1.5 flex items-center justify-center outline-none group"
                  >
                    <motion.div layout className="absolute inset-0 rounded-full bg-white/20 transition-colors group-hover:bg-white/40" />
                    {currentIndex === i && (
                      <motion.div
                        layout
                        layoutId="activeIndicatorPill"
                        className="absolute inset-0 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </motion.div>

              <motion.button
                layout
                onClick={() => paginate(1)}
                disabled={currentIndex === media.length - 1}
                className={`p-2 rounded-full transition-all ${
                  currentIndex === media.length - 1 ? 'opacity-20 cursor-default' : 'text-white hover:bg-white/10 active:scale-90'
                }`}
              >
                <ChevronRight size={18} />
              </motion.button>
            </motion.div>
          ) : (
            <>
              {/* Separated Navigation Arrows (Moved to bottom right) */}
              <motion.div layout className="absolute bottom-8 right-6 md:right-8 flex items-center gap-3 z-30 pointer-events-none">
                <motion.button
                  layout
                  onClick={() => paginate(-1)}
                  disabled={currentIndex === 0}
                  className={`p-4 md:p-3 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white transition-all pointer-events-auto border border-white/10 ${
                    currentIndex === 0 ? 'opacity-0 scale-90 cursor-default' : 'opacity-100 scale-100 hover:scale-110 active:scale-95'
                  }`}
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  layout
                  onClick={() => paginate(1)}
                  disabled={currentIndex === media.length - 1}
                  className={`p-4 md:p-3 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white transition-all pointer-events-auto border border-white/10 ${
                    currentIndex === media.length - 1 ? 'opacity-0 scale-90 cursor-default' : 'opacity-100 scale-100 hover:scale-110 active:scale-95'
                  }`}
                >
                  <ChevronRight size={20} />
                </motion.button>
              </motion.div>

              {/* Vertical Oval Indicator */}
              <motion.div
                layout
                animate={{ y: -descriptionLift }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-3.5 bg-black/40 backdrop-blur-xl rounded-full py-5 px-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 z-20 pointer-events-auto"
              >
                {media.map((_, i) => (
                  <motion.button 
                    layout
                    key={i}
                    onClick={() => {
                      setDirection(i > currentIndex ? 1 : -1);
                      setCurrentIndex(i);
                    }}
                    className="relative w-2.5 h-2.5 flex items-center justify-center outline-none group"
                  >
                    <motion.div layout className="absolute inset-0 rounded-full bg-white/30 transition-colors group-hover:bg-white/50" />
                    {currentIndex === i && (
                      <motion.div 
                        layout
                        layoutId="activeIndicatorSep"
                        className="absolute inset-0 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectModal;
