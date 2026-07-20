import { motion, type Variants, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { FaInstagram, FaTiktok, FaDiscord } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { client } from '../sanityClient';

interface ContactPageProps {
  isDark: boolean;
}

const socialLinks = [
  { icon: FaInstagram, href: 'https://www.instagram.com/the_volumetric_cube/', label: 'Instagram' },
  { icon: FaTiktok, href: 'https://www.tiktok.com/@the_volumetric_cube', label: 'TikTok' },
  { icon: FaDiscord, href: 'https://discord.com/users/471385139117817881', label: 'Discord' },
  { icon: MdEmail, href: 'mailto:Tylerdobson30@gmail.com', label: 'Email' },
];

export default function ContactPage({ isDark }: ContactPageProps) {
  const [videos, setVideos] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const query = `*[_id == "contactVideoReel"][0]{
          videos[]{
            "url": videoFile.asset->url
          }
        }`;
        const data = await client.fetch<{ videos?: { url: string }[] } | null>(query);
        
        if (data?.videos) {
          const videoUrls = data.videos.map((v: any) => v.url).filter(Boolean);
          setVideos(videoUrls);
        }
      } catch (error) {
        console.error('Error fetching contact video reel:', error);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoEnd = () => {
    if (videos.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % videos.length);
    }
  };

  useEffect(() => {
    if (videoRef.current && videos.length > 0) {
      videoRef.current.load();
      videoRef.current.play().catch(err => console.log("Auto-play prevented:", err));
    }
  }, [currentIndex, videos]);

  const currentVideoSrc = videos.length > 0 ? videos[currentIndex] : null;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className={`min-h-screen md:h-screen md:overflow-hidden flex flex-col md:flex-row ${isDark ? 'text-white' : 'text-zinc-900'} ${isDark ? 'md:bg-zinc-900' : 'md:bg-white'}`}>
      {/* Left Side: Imagery */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="w-full md:w-1/2 h-[50vh] md:h-screen sticky top-0 overflow-hidden z-0 bg-black"
      >
        <AnimatePresence initial={false}>
          {currentVideoSrc ? (
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
              className="absolute top-0 left-0 w-full h-full object-cover z-0"
              key={currentVideoSrc}
            >
              <source src={currentVideoSrc} type={currentVideoSrc.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
            </motion.video>
          ) : (
            <div className="absolute inset-0 bg-black/10 flex items-center justify-center text-white/50 text-sm z-0"></div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none z-10" />
        <div className={`absolute inset-0 backdrop-blur-[2px] pointer-events-none z-10 ${isDark ? 'mix-blend-overlay opacity-30' : 'mix-blend-multiply opacity-10'}`} />
        
        {/* Mobile Reveal Gradient Overlay */}
        <div className={`absolute inset-0 md:hidden bg-gradient-to-t via-transparent to-transparent pointer-events-none ${isDark ? 'from-zinc-900' : 'from-white'}`} />
      </motion.div>

      {/* Right Side: Contact Form */}
      <div className={`w-full md:w-1/2 min-h-screen md:min-h-0 md:h-screen flex flex-col justify-center px-8 md:px-12 lg:px-20 pt-20 md:pt-24 pb-6 md:pb-8 relative z-10 ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full mx-auto"
        >
          <motion.h2 
            variants={itemVariants}
            className={`text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-widest mb-1.5 font-['Outfit'] ${isDark ? 'text-white' : 'text-zinc-900'}`}
          >
            Get In Touch
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className={`text-xs md:text-sm mb-6 md:mb-8 uppercase tracking-[0.2em] font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}
          >
            Let's build something exceptional together.
          </motion.p>

          <form className="space-y-3 md:space-y-4">
            <motion.div variants={itemVariants} className="group relative">
              <label className={`block text-[10px] uppercase tracking-[0.3em] font-bold mb-1 transition-colors ${isDark ? 'text-zinc-500 group-focus-within:text-white' : 'text-zinc-400 group-focus-within:text-zinc-900'}`}>
                Full Name
              </label>
              <input 
                type="text" 
                className={`w-full bg-transparent border-b py-2 focus:outline-none transition-all font-['Outfit']
                  ${isDark ? 'border-zinc-800 focus:border-white text-white' : 'border-zinc-200 focus:border-zinc-900 text-zinc-900'}`}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="group relative">
              <label className={`block text-[10px] uppercase tracking-[0.3em] font-bold mb-1 transition-colors ${isDark ? 'text-zinc-500 group-focus-within:text-white' : 'text-zinc-400 group-focus-within:text-zinc-900'}`}>
                Email Address
              </label>
              <input 
                type="email" 
                className={`w-full bg-transparent border-b py-2 focus:outline-none transition-all font-['Outfit']
                  ${isDark ? 'border-zinc-800 focus:border-white text-white' : 'border-zinc-200 focus:border-zinc-900 text-zinc-900'}`}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="group relative">
              <label className={`block text-[10px] uppercase tracking-[0.3em] font-bold mb-1 transition-colors ${isDark ? 'text-zinc-500 group-focus-within:text-white' : 'text-zinc-400 group-focus-within:text-zinc-900'}`}>
                Project Request Name
              </label>
              <input 
                type="text" 
                className={`w-full bg-transparent border-b py-2 focus:outline-none transition-all font-['Outfit']
                  ${isDark ? 'border-zinc-800 focus:border-white text-white' : 'border-zinc-200 focus:border-zinc-900 text-zinc-900'}`}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="group relative">
              <label className={`block text-[10px] uppercase tracking-[0.3em] font-bold mb-1 transition-colors ${isDark ? 'text-zinc-500 group-focus-within:text-white' : 'text-zinc-400 group-focus-within:text-zinc-900'}`}>
                Project Details
              </label>
              <textarea 
                rows={3}
                className={`w-full bg-transparent border-b py-2 focus:outline-none transition-all font-['Outfit'] resize-none
                  ${isDark ? 'border-zinc-800 focus:border-white text-white' : 'border-zinc-200 focus:border-zinc-900 text-zinc-900'}`}
              />
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-500 mt-6 md:mt-8
                ${isDark 
                  ? 'bg-white text-black hover:bg-zinc-200 shadow-2xl shadow-white/5' 
                  : 'bg-zinc-900 text-white hover:bg-black shadow-2xl shadow-black/10'}`}
            >
              Send Request
            </motion.button>
          </form>

          {/* Social Icons Section */}
          <motion.div 
            variants={itemVariants}
            className="mt-6 md:mt-8 flex items-center justify-center md:justify-start gap-8"
          >
            {socialLinks.map((social) => (
              <a 
                key={social.label}
                href={social.href}
                target={social.label !== 'Email' ? "_blank" : undefined}
                rel={social.label !== 'Email' ? "noopener noreferrer" : undefined}
                className={`transition-all duration-300 transform hover:-translate-y-1 ${isDark ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-900'}`}
                aria-label={social.label}
              >
                <social.icon size={22} />
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Ambient background effect for right side */}
        <div className={`absolute top-0 right-0 w-64 h-64 blur-[120px] rounded-full pointer-events-none -z-10 opacity-30
          ${isDark ? 'bg-zinc-600' : 'bg-zinc-200'}`} />
      </div>
    </div>
  );
}
