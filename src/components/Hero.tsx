import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { client } from '../sanityClient';

interface HeroProps {
  onContactClick?: () => void;
}

interface VideoReel {
  videos: {
    url: string;
  }[];
}

export default function Hero({ onContactClick }: HeroProps) {
  const [videos, setVideos] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const scrollToProjects = () => {
    const element = document.getElementById('projects-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const query = `*[_type == "heroVideoReel"]{
          videos[]{
            "url": videoFile.asset->url
          }
        }`;
        const data = await client.fetch<VideoReel[]>(query);
        
        if (data && data.length > 0) {
          const videoUrls = data.flatMap(doc => doc.videos ? doc.videos.map(v => v.url) : []);
          setVideos(videoUrls);
        }
      } catch (error) {
        console.error('Error fetching hero videos:', error);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoEnd = () => {
    if (videos.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }
  };

  // Ensure video plays when source changes
  useEffect(() => {
    if (videoRef.current && videos.length > 0) {
      videoRef.current.load();
      videoRef.current.play().catch(err => console.log("Auto-play prevented:", err));
    }
  }, [currentIndex, videos]);

  const currentVideoSrc = videos.length > 0 ? videos[currentIndex] : null;

  return (
    <section aria-label="Hero introduction" className="relative w-full min-h-screen bg-black overflow-hidden flex flex-col justify-center shrink-0">
      {/* Video Background Container */}
      <div className="absolute top-0 right-0 w-full md:w-[85%] h-full z-0">
        <AnimatePresence initial={false}>
          {currentVideoSrc && (
            <motion.video 
              ref={videoRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              autoPlay 
              muted 
              playsInline
              onEnded={handleVideoEnd}
              className="absolute top-0 left-0 w-full h-full object-cover"
              key={currentVideoSrc}
            >
              <source src={currentVideoSrc} type={currentVideoSrc.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
            </motion.video>
          )}
        </AnimatePresence>
      </div>

      {/* Gradient Overlay - Specifically tuned stops to mask the sharp video edge */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t md:bg-gradient-to-r from-black md:from-black md:from-[20%] via-black/60 md:via-black/50 via-[30%] md:via-[45%] to-transparent md:to-transparent to-[60%] md:to-[85%]" />

      {/* Hero Content */}
      <div className="relative z-20 px-6 md:px-16 lg:px-24 w-full flex flex-col justify-end pb-24 md:justify-center md:pb-0 h-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl text-white"
        >
          <p className="text-xs md:text-base font-semibold tracking-widest text-zinc-400 mb-4 uppercase">
            Hello There!
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-4 md:mb-6">
            I'm Alex Robertson
          </h1>
          <p className="text-sm md:text-lg lg:text-xl text-zinc-300 mb-8 md:mb-10 leading-relaxed font-light">
            A passionate graphic designer specializing in immersive 3D landscapes, sleek brand identities, and futuristic visual experiences. Turning bold concepts into striking digital realities.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={scrollToProjects}
              className="px-6 py-3 md:px-8 md:py-4 bg-white text-black font-semibold rounded-full hover:bg-zinc-200 transition-colors"
            >
              My Services
            </button>
            <button 
              onClick={onContactClick}
              className="px-6 py-3 md:px-8 md:py-4 bg-transparent border border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              Contact Me
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
