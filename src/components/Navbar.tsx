import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInstagram, FaTiktok, FaDiscord } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import penroseIcon from '../assets/penrose.png';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const socialLinks = [
  { icon: FaInstagram, href: '#', label: 'Instagram' },
  { icon: FaTiktok, href: '#', label: 'TikTok' },
  { icon: FaDiscord, href: '#', label: 'Discord' },
  { icon: MdEmail, href: '#', label: 'Email' },
];


export default function Navbar({ isDark, toggleTheme }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [phase, setPhase] = useState<'text' | 'gleam' | 'glitch-out' | 'icon' | 'glitch-in'>('text');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const runSequence = async () => {
      while (isMounted) {
        await new Promise(r => setTimeout(r, 6000));
        if (!isMounted) break;
        setPhase('gleam');
        
        await new Promise(r => setTimeout(r, 1500));
        if (!isMounted) break;
        setPhase('glitch-out');
        
        await new Promise(r => setTimeout(r, 400));
        if (!isMounted) break;
        setPhase('icon');
        
        await new Promise(r => setTimeout(r, 3000));
        if (!isMounted) break;
        setPhase('glitch-in');
        
        await new Promise(r => setTimeout(r, 400));
        if (!isMounted) break;
        setPhase('text');
      }
    };
    runSequence();
    return () => { isMounted = false; };
  }, []);

  const textColor = isScrolled 
    ? (isDark ? 'text-zinc-900' : 'text-white') 
    : 'text-white';

  const bgColor = isScrolled 
    ? (isDark ? 'bg-zinc-900' : 'bg-white') 
    : 'bg-white';

  const gleamColorClass = textColor === 'text-zinc-900' ? 'gleam-white' : 'gleam-black';

  return (
    <>
      {/* Refined Glass Background Bar */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className={`fixed top-0 left-0 right-0 z-[49] h-[90px] backdrop-blur-xl border-b transition-colors duration-500
              ${isDark 
                ? 'bg-white/70 border-white/20 shadow-sm' 
                : 'bg-zinc-900/70 border-zinc-800 shadow-2xl shadow-black/20'
              }`}
          />
        )}
      </AnimatePresence>
 
      {/* Main Content Layer */}
      <nav className="fixed top-0 left-0 right-0 z-[50] h-[90px] px-10">
        <div className="h-full max-w-[1800px] mx-auto flex items-center justify-between">
          
          {/* Left: Social Icons (Properly Vertically Centered) */}
          <div className="flex-1 flex items-center gap-6">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`${textColor} hover:opacity-50 transition-all duration-300 transform hover:-translate-y-1`}
                aria-label={social.label}
              >
                <social.icon size={22} />
              </motion.a>
            ))}
          </div>

          {/* Center: Brand Identity (Cool Typography & Animations) */}
          <div className="flex-none flex items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center group cursor-default"
            >
              {/* The Penrose Icon (Absolute Overlay) */}
              <AnimatePresence>
                {phase === 'icon' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                    className="absolute inset-0 flex items-center justify-center z-10"
                  >
                    <div 
                      className={`w-14 h-14 ${bgColor} transition-colors duration-500`}
                      style={{
                        maskImage: `url(${penroseIcon})`,
                        maskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskImage: `url(${penroseIcon})`,
                        WebkitMaskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center',
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The Text (Provides Container Width) */}
              <h1 className={`text-xl font-black uppercase tracking-[0.25em] transition-all duration-500 leading-none mb-[-2px] whitespace-nowrap
                ${textColor} font-['Outfit'] 
                ${phase === 'gleam' ? `animate-gleam ${gleamColorClass}` : ''}
                ${phase === 'glitch-out' ? 'glitch-out' : ''}
                ${phase === 'glitch-in' ? 'glitch-in' : ''}
                ${phase === 'icon' ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}
              `}>
                Alex Robertson
              </h1>
            </motion.div>
          </div>


          {/* Right: Navigation & Theme (Properly Vertically Centered) */}
          <div className="flex-1 flex items-center justify-end gap-10">
            <div className={`flex gap-8 text-[13px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${textColor} font-['Outfit']`}>
              <a href="#" className="hover:opacity-50 transition-all hover:tracking-[0.3em]">Home</a>
              <a href="#" className="hover:opacity-50 transition-all hover:tracking-[0.3em]">Contact</a>
            </div>


            <button 
              onClick={toggleTheme}
              className={`p-2.5 rounded-full transition-all duration-500 border pointer-events-auto
                ${isScrolled
                  ? (isDark 
                      ? 'bg-zinc-900/5 border-zinc-900/10 hover:bg-zinc-900/20' 
                      : 'bg-white/5 border-white/10 hover:bg-white/20')
                  : 'bg-white/10 border-white/20 hover:bg-white/30'
                }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isScrolled ? (isDark ? "black" : "white") : "white"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isScrolled ? (isDark ? "black" : "white") : "white"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg>
              )}
            </button>
          </div>

        </div>
      </nav>
    </>
  );
}

