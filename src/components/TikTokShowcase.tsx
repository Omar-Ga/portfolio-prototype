import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { tiktokVideos } from '../data/tiktok';
import type { TikTokVideo } from '../data/tiktok';
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
  }

  return `https://www.tiktok.com/player/v1/${video.id}?${params.toString()}`;
}

function TikTokCard({ video, isDark }: TikTokCardProps) {

  return (
    <motion.div
      className={`relative flex-none w-[280px] h-[560px] md:w-[340px] md:h-[720px] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer
        ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-100 border-zinc-200'} border`}
    >
      <div className="w-full h-full">
        <iframe
          src={getTikTokPlayerSrc(video)}
          className="w-full h-full border-0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    </motion.div>
  );
}

export default function TikTokShowcase({ isDark }: { isDark: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    return () => {
      if (momentumIdRef.current !== null) {
        cancelAnimationFrame(momentumIdRef.current);
      }
    };
  }, []);

  const startMomentum = () => {
    if (!scrollRef.current) return;
    
    const friction = 0.95;
    let velocity = velocityRef.current;
    
    const step = () => {
      if (!scrollRef.current || Math.abs(velocity) < 0.5) {
        if (scrollRef.current) {
          scrollRef.current.style.scrollSnapType = 'x mandatory';
        }
        momentumIdRef.current = null;
        return;
      }
      
      scrollRef.current.scrollLeft -= velocity;
      velocity *= friction;
      momentumIdRef.current = requestAnimationFrame(step);
    };
    
    momentumIdRef.current = requestAnimationFrame(step);
  };

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
    
    // Disable scroll snap during drag
    scrollRef.current.style.scrollSnapType = 'none';
    scrollRef.current.style.cursor = 'grabbing';
    
    // Set pointer capture to track movement even outside the container
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !scrollRef.current) return;
    
    const deltaX = e.clientX - dragStartXRef.current;
    const now = Date.now();
    const dt = Math.max(now - lastTimeRef.current, 1);
    const dx = e.clientX - lastXRef.current;
    
    // Update velocity (pixels per frame-ish)
    velocityRef.current = dx / dt * 16; // Normalize to ~60fps
    
    lastXRef.current = e.clientX;
    lastTimeRef.current = now;
    
    // If user moved more than 5px, it's a drag, not a click
    if (Math.abs(deltaX) > 5) {
      hasMovedRef.current = true;
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
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    // Start momentum if user flicked
    if (hasMovedRef.current && Math.abs(velocityRef.current) > 2) {
      startMomentum();
    } else {
      // Re-enable scroll snap immediately if no momentum
      scrollRef.current.style.scrollSnapType = 'x mandatory';
    }
  };

  return (
    <section className={`py-16 px-4 md:py-32 md:px-10 overflow-hidden ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-16 gap-4 md:gap-0">
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

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex items-center gap-3 text-zinc-500 text-sm font-medium"
          >
            <FaTiktok />
            <span>@the_volumetric_cube</span>
          </motion.div>
        </div>

        {/* Custom Scroll Progress Indicator */}
        <div className="h-[2px] w-full bg-zinc-800 mb-8 md:mb-12 relative overflow-hidden rounded-full">
          <motion.div 
            style={{ scaleX }}
            className="absolute top-0 left-0 bottom-0 w-full bg-white origin-left"
          />
        </div>

        {/* Carousel Container */}
        <div 
          ref={scrollRef}
          className="flex gap-4 md:gap-8 overflow-x-auto pb-12 no-scrollbar snap-x cursor-grab"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            scrollSnapType: 'x mandatory',
            touchAction: 'pan-y pinch-zoom'
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {tiktokVideos.map((video) => (
            <div key={video.id} className="snap-center shrink-0">
              <TikTokCard 
                video={video} 
                isDark={isDark} 
              />
            </div>
          ))}
        </div>

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
