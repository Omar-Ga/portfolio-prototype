import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import type { TikTokItem as TikTokVideo } from '../App';
import { FaTiktok } from 'react-icons/fa';

interface TikTokCardProps {
  video: TikTokVideo;
  isDark: boolean;
}

function getTikTokPlayerSrc(video: TikTokVideo) {
  const params = new URLSearchParams({
    description: '0',
    music_info: '0',
    rel: '0',
    autoplay: '0',
    loop: '1',
    controls: '1',
    progress_bar: '0',
    timestamp: '0',
    closed_caption: '0',
  });

  if (video.type === 'photo') {
    params.delete('progress_bar');
    params.delete('timestamp');
    params.delete('closed_caption');
    params.set('muted', '1');
    params.set('volume', '0');
  }

  return `https://www.tiktok.com/player/v1/${video.id}?${params.toString()}`;
}

function TikTokCard({ video, isDark }: TikTokCardProps) {
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '600px',
        threshold: 0.01 
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Prevent TikTok iframe from hijacking media keys
  useEffect(() => {
    if (isInView && 'mediaSession' in navigator) {
      const dummyAction = () => {};
      try {
        navigator.mediaSession.setActionHandler('play', dummyAction);
        navigator.mediaSession.setActionHandler('pause', dummyAction);
      } catch (e) {
        // Ignore errors if action handlers are not supported
      }
      
      return () => {
        try {
          navigator.mediaSession.setActionHandler('play', null);
          navigator.mediaSession.setActionHandler('pause', null);
        } catch (e) {}
      };
    }
  }, [isInView]);

  const shouldRenderIframe = isInView;

  return (
    <motion.div
      ref={cardRef}
      className={`relative flex-none w-[280px] h-[560px] md:w-[340px] md:h-[720px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer
        ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-100 border-zinc-200'} border`}
      style={{
        WebkitTapHighlightColor: 'transparent',
        outline: 'none',
      }}
    >
      <div className="w-full h-full relative">
        {shouldRenderIframe ? (
          <iframe
            src={getTikTokPlayerSrc(video)}
            className="w-full h-full border-0 tiktok-iframe animate-fade-in"
            sandbox={video.type === 'photo' ? "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" : undefined}
            allow={video.type === 'video' ? "autoplay; encrypted-media" : "encrypted-media"}
            allowFullScreen
            title={`TikTok ${video.type} by Alexander Robertson${video.title ? ` — ${video.title}` : ''}`}
            style={{ pointerEvents: 'auto' }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-12 h-12 rounded-full border-2 border-t-transparent ${isDark ? 'border-zinc-700' : 'border-zinc-300'} animate-spin opacity-20`} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SectionDivider({ label, isDark }: { label: string; isDark: boolean }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className={`text-[10px] md:text-[11px] font-light uppercase tracking-[0.3em] whitespace-nowrap ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
        {label}
      </span>
      <div className={`flex-1 h-px ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
    </div>
  );
}

function TikTokCarousel({ videos, isDark }: { videos: TikTokVideo[]; isDark: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollMetrics, setScrollMetrics] = useState({ scrollLeft: 0, scrollWidth: 1, clientWidth: 1 });
  const [isThumbActive, setIsThumbActive] = useState(false);
  const { scrollXProgress } = useScroll({
    container: scrollRef,
  });

  // Dragging state via refs to avoid re-renders
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const scrollStartXRef = useRef(0);
  const hasMovedRef = useRef(false);
  
  // Momentum refs
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const momentumIdRef = useRef<number | null>(null);

  const scaleX = useTransform(scrollXProgress, [0, 1], [0.1, 1]);

  const updateMetrics = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setScrollMetrics({ scrollLeft, scrollWidth, clientWidth });
  }, []);

  useEffect(() => {
    updateMetrics();
    const currentScrollRef = scrollRef.current;
    if (currentScrollRef) {
      currentScrollRef.addEventListener('scroll', updateMetrics, { passive: true });
    }
    window.addEventListener('resize', updateMetrics);
    return () => {
      if (currentScrollRef) {
        currentScrollRef.removeEventListener('scroll', updateMetrics);
      }
      window.removeEventListener('resize', updateMetrics);
    };
  }, [updateMetrics]);

  // Toggle iframe pointer-events during drag
  const setIframePointerEvents = useCallback((enabled: boolean) => {
    if (!scrollRef.current) return;
    const iframes = scrollRef.current.querySelectorAll('.tiktok-iframe');
    iframes.forEach((iframe) => {
      (iframe as HTMLElement).style.pointerEvents = enabled ? 'auto' : 'none';
    });
  }, []);

  useEffect(() => {
    return () => {
      if (momentumIdRef.current !== null) {
        cancelAnimationFrame(momentumIdRef.current);
      }
    };
  }, []);

  const startMomentum = useCallback(() => {
    if (!scrollRef.current) return;
    
    const friction = 0.95;
    let velocity = velocityRef.current;
    
    const step = () => {
      if (!scrollRef.current || Math.abs(velocity) < 0.5) {
        momentumIdRef.current = null;
        // Re-enable iframe interaction when momentum stops
        setIframePointerEvents(true);
        return;
      }
      
      scrollRef.current.scrollLeft -= velocity;
      velocity *= friction;
      momentumIdRef.current = requestAnimationFrame(step);
    };
    
    momentumIdRef.current = requestAnimationFrame(step);
  }, [setIframePointerEvents]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!scrollRef.current) return;
    
    // Cancel any existing momentum
    if (momentumIdRef.current !== null) {
      cancelAnimationFrame(momentumIdRef.current);
      momentumIdRef.current = null;
    }
    
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    scrollStartXRef.current = scrollRef.current.scrollLeft;
    
    // Tracking for momentum
    lastXRef.current = e.clientX;
    lastTimeRef.current = Date.now();
    velocityRef.current = 0;
    
    scrollRef.current.style.cursor = 'grabbing';
    
    // Capture pointer on the scroll container
    scrollRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    
    const deltaX = e.clientX - dragStartXRef.current;
    const now = Date.now();
    const dt = Math.max(now - lastTimeRef.current, 1);
    const dx = e.clientX - lastXRef.current;
    
    // Update velocity (pixels per frame-ish)
    velocityRef.current = (dx / dt) * 16; // Normalize to ~60fps
    
    lastXRef.current = e.clientX;
    lastTimeRef.current = now;
    
    // If user moved more than 5px, it's a drag, not a click
    if (Math.abs(deltaX) > 5) {
      if (!hasMovedRef.current) {
        hasMovedRef.current = true;
        // Disable iframe pointer events during drag
        setIframePointerEvents(false);
      }
    }
    
    if (hasMovedRef.current) {
      scrollRef.current.scrollLeft = scrollStartXRef.current - deltaX;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!scrollRef.current) return;
    
    isDraggingRef.current = false;
    scrollRef.current.style.cursor = 'grab';
    
    // Release pointer capture
    scrollRef.current.releasePointerCapture(e.pointerId);
    
    // Start momentum if user flicked
    if (hasMovedRef.current && Math.abs(velocityRef.current) > 2) {
      startMomentum();
    } else {
      // Re-enable iframes if no momentum is starting
      setIframePointerEvents(true);
    }
  };

  const thumbWidthPercent = (scrollMetrics.clientWidth / scrollMetrics.scrollWidth) * 100;
  const maxScrollLeft = scrollMetrics.scrollWidth - scrollMetrics.clientWidth;
  const scrollProgress = maxScrollLeft > 0 ? scrollMetrics.scrollLeft / maxScrollLeft : 0;
  const thumbLeftPercent = scrollProgress * (100 - thumbWidthPercent);

  const handleThumbPointerDown = (e: React.PointerEvent) => {
    e.preventDefault(); // Prevent text selection and default drag behaviors
    setIsThumbActive(true);
    const startX = e.clientX;
    const startScrollLeft = scrollMetrics.scrollLeft;

    // Fallback: disable selection on the entire body while dragging
    document.body.style.userSelect = 'none';

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!scrollRef.current || !trackRef.current) return;
      const deltaX = moveEvent.clientX - startX;
      const trackWidth = trackRef.current.clientWidth;
      const scrollRatio = scrollMetrics.scrollWidth / trackWidth;
      scrollRef.current.scrollLeft = startScrollLeft + deltaX * scrollRatio;
    };

    const handlePointerUp = () => {
      setIsThumbActive(false);
      document.body.style.userSelect = '';
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <div className="mb-20 last:mb-0">
      {/* Custom Scroll Progress Indicator (Top) */}
      <div className={`h-[1px] w-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'} mb-8 relative overflow-hidden`}>
        <motion.div 
          style={{ scaleX }}
          className={`absolute top-0 left-0 bottom-0 w-full ${isDark ? 'bg-white' : 'bg-zinc-900'} origin-left`}
        />
      </div>

      {/* Carousel Container */}
      <div 
        ref={scrollRef}
        className="flex gap-4 md:gap-8 overflow-x-auto pb-6 no-scrollbar cursor-grab"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          touchAction: 'pan-y pinch-zoom',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {videos.map((video, index) => (
          <div key={`${video.id}-${index}`} className="shrink-0">
            <TikTokCard 
              video={video} 
              isDark={isDark} 
            />
          </div>
        ))}
      </div>

      {/* Custom Draggable Scrollbar (Bottom) */}
      {scrollMetrics.scrollWidth > scrollMetrics.clientWidth && (
        <div 
          ref={trackRef}
          className={`mt-6 h-2 w-full relative ${isDark ? 'bg-zinc-800/50' : 'bg-zinc-200/50'} cursor-pointer overflow-hidden`}
          onClick={(e) => {
            if (!scrollRef.current || !trackRef.current) return;
            const rect = trackRef.current.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const trackWidth = trackRef.current.clientWidth;
            const thumbWidth = (scrollMetrics.clientWidth / scrollMetrics.scrollWidth) * trackWidth;
            const clickProgress = (clickX - thumbWidth / 2) / (trackWidth - thumbWidth);
            scrollRef.current.scrollTo({
              left: clickProgress * (scrollMetrics.scrollWidth - scrollMetrics.clientWidth),
              behavior: 'smooth'
            });
          }}
        >
          <motion.div
            onPointerDown={(e) => {
              e.stopPropagation();
              handleThumbPointerDown(e);
            }}
            animate={{
              backgroundColor: isThumbActive ? '#3b82f6' : (isDark ? '#3f3f46' : '#d4d4d8'),
              boxShadow: isThumbActive ? '0 0 15px rgba(59, 130, 246, 0.6)' : 'none',
            }}
            transition={{ 
              backgroundColor: { duration: 0.3 },
              boxShadow: { duration: 0.3 }
            }}
            style={{
              width: `${thumbWidthPercent}%`,
              left: `${thumbLeftPercent}%`,
              position: 'absolute',
              height: '100%',
              cursor: 'grab',
            }}
            whileHover={{
              backgroundColor: isThumbActive ? '#3b82f6' : (isDark ? '#52525b' : '#a1a1aa')
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function TikTokShowcase({ isDark, videoPosts = [], photoPosts = [] }: { isDark: boolean, videoPosts?: TikTokVideo[], photoPosts?: TikTokVideo[] }) {

  return (
    <section className={`py-16 px-4 md:py-32 md:px-10 overflow-hidden ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 md:mb-24 gap-4 md:gap-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-xs md:text-sm font-black uppercase tracking-[0.3em] mb-2 md:mb-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Behind the Scenes
            </h2>
            <h3 className={`text-3xl md:text-4xl lg:text-5xl font-bold font-['Outfit'] ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              TikTok Snippets
            </h3>
          </motion.div>

          <motion.a 
            href="https://www.tiktok.com/@the_volumetric_cube"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex items-center gap-3 text-zinc-500 hover:text-zinc-400 transition-colors text-sm font-medium"
          >
            <FaTiktok />
            <span>@the_volumetric_cube</span>
          </motion.a>
        </div>

        {/* Video Section */}
        {videoPosts.length > 0 && (
          <>
            <SectionDivider label="Videos" isDark={isDark} />
            <TikTokCarousel videos={videoPosts} isDark={isDark} />
          </>
        )}

        {/* Photo Section */}
        {photoPosts.length > 0 && (
          <div className="mt-16 md:mt-32">
            <SectionDivider label="Photos" isDark={isDark} />
            <TikTokCarousel videos={photoPosts} isDark={isDark} />
          </div>
        )}

        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className={`text-center text-sm font-medium mt-8 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}
        >
          Drag to explore or click to play
        </motion.p>
      </div>
    </section>
  );
}
