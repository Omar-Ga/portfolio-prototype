import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInstagram, FaTiktok, FaDiscord } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { Menu, X } from 'lucide-react';
import penroseIcon from '../assets/penrose.webp';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  onNavigate: (page: 'home' | 'contact') => void;
  currentPage: 'home' | 'contact';
}

const socialLinks = [
  { icon: FaInstagram, href: 'https://www.instagram.com/the_volumetric_cube/', label: 'Instagram' },
  { icon: FaTiktok, href: 'https://www.tiktok.com/@the_volumetric_cube', label: 'TikTok' },
  { icon: FaDiscord, href: 'https://discord.com/users/471385139117817881', label: 'Discord' },
  { icon: MdEmail, href: 'mailto:Tylerdobson30@gmail.com', label: 'Email' },
];


export default function Navbar({ isDark, toggleTheme, onNavigate, currentPage }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [phase, setPhase] = useState<'text' | 'gleam' | 'glitch-out' | 'icon' | 'glitch-in'>('text');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

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

  const isContactSplit = currentPage === 'contact' && !isScrolled;
  const leftTextColor = isContactSplit ? 'text-white' : textColor;
  const rightTextColor = isContactSplit ? (isDark ? 'text-white' : 'text-zinc-900') : textColor;

  const LogoContent = ({ iconColor, textColor, showGleam, isOverlay }: { iconColor: string, textColor: string, showGleam?: boolean, isOverlay?: boolean }) => {
    const clipStyle = isOverlay && !isMobile ? { 
      clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
      WebkitClipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)'
    } : {};

    return (
      <div className="flex items-center justify-center group cursor-default">
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
                className={`w-14 h-14 ${iconColor} transition-colors duration-500`}
                style={{
                  ...clipStyle,
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
        <h1 
          className={`text-lg md:text-xl font-black uppercase tracking-[0.2em] md:tracking-[0.25em] transition-all duration-500 leading-none mb-[-2px] whitespace-nowrap
            ${textColor} font-['Outfit'] 
            ${phase === 'gleam' && showGleam ? `animate-gleam ${gleamColorClass}` : ''}
            ${phase === 'glitch-out' ? 'glitch-out' : ''}
            ${phase === 'glitch-in' ? 'glitch-in' : ''}
            ${phase === 'icon' ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}
          `}
          style={clipStyle}
        >
          Alexander Robertson
        </h1>
      </div>
    );
  };

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
            className={`fixed top-0 left-0 right-0 z-[49] h-[60px] md:h-[90px] backdrop-blur-xl border-b transition-colors duration-500
              ${isDark 
                ? 'bg-white/70 border-white/20 shadow-sm' 
                : 'bg-zinc-900/70 border-zinc-800 shadow-2xl shadow-black/20'
              }`}
          />
        )}
      </AnimatePresence>
 
      {/* Main Content Layer */}
      <nav className="fixed top-0 left-0 right-0 z-[50] h-[60px] md:h-[90px] px-5 md:px-10">
        <div className="h-full max-w-[1800px] mx-auto flex items-center justify-between">
          
          {/* Left: Social Icons (Properly Vertically Centered) */}
          <div className="flex-1 hidden md:flex items-center gap-6">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.href}
                target={social.label !== 'Email' ? "_blank" : undefined}
                rel={social.label !== 'Email' ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`${leftTextColor} hover:opacity-50 transition-all duration-300 transform hover:-translate-y-1`}
                aria-label={social.label}
              >
                <social.icon size={22} />
              </motion.a>
            ))}
          </div>

          {/* Center: Brand Identity (Cool Typography & Animations) */}
          <div className="flex-none flex items-center justify-center relative">
            {isContactSplit ? (
              <div className="relative">
                {/* Base Layer: Pure White (Visible on left half) */}
                <LogoContent iconColor="bg-white" textColor="text-white" showGleam />
                
                {/* Overlay Layer: Theme Aware (Clipped to right half) */}
                <div className={`absolute inset-0 pointer-events-none ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  <LogoContent 
                    iconColor={isDark ? 'bg-white' : 'bg-zinc-900'} 
                    textColor={isDark ? 'text-white' : 'text-zinc-900'} 
                    showGleam 
                    isOverlay
                  />
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <LogoContent iconColor={bgColor} textColor={textColor} showGleam />
              </motion.div>
            )}
          </div>


          {/* Right: Navigation & Theme (Properly Vertically Centered) */}
          <div className="flex-1 flex items-center justify-end gap-10">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`md:hidden p-2 rounded-full transition-colors ${rightTextColor} hover:bg-white/10`}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>

            {/* Desktop Nav */}
            <div className={`hidden md:flex gap-8 text-[13px] font-black uppercase tracking-[0.2em] transition-colors duration-500 ${rightTextColor} font-['Outfit']`}>
              <button 
                onClick={() => onNavigate('home')} 
                className={`transition-all hover:tracking-[0.3em] cursor-pointer ${currentPage === 'home' ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
              >
                Home
              </button>
              <button 
                onClick={() => onNavigate('contact')} 
                className={`transition-all hover:tracking-[0.3em] cursor-pointer ${currentPage === 'contact' ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
              >
                Contact
              </button>
            </div>


            <button 
              onClick={toggleTheme}
              className={`hidden md:flex p-2.5 rounded-full transition-all duration-500 border pointer-events-auto
                ${isScrolled
                  ? (isDark 
                      ? 'bg-zinc-900/5 border-zinc-900/10 hover:bg-zinc-900/20' 
                      : 'bg-white/5 border-white/10 hover:bg-white/20')
                  : 'bg-white/10 border-white/20 hover:bg-white/30'
                }`}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isContactSplit ? (isDark ? "white" : "black") : (isScrolled ? (isDark ? "black" : "white") : "white")} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isContactSplit ? (isDark ? "white" : "black") : (isScrolled ? (isDark ? "black" : "white") : "white")} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg>
              )}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] flex flex-col justify-center items-center ${isDark ? 'bg-zinc-950' : 'bg-white'}`}
          >
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className={`absolute top-6 right-5 p-2 rounded-full transition-colors ${isDark ? 'text-white hover:bg-white/10' : 'text-zinc-900 hover:bg-black/10'}`}
              aria-label="Close menu"
            >
              <X size={28} />
            </button>

            <div className={`flex flex-col items-center gap-10 font-['Outfit'] font-black uppercase tracking-[0.2em] text-2xl ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
                className={`hover:opacity-50 transition-all hover:tracking-[0.3em] cursor-pointer ${currentPage === 'home' ? 'opacity-100' : 'opacity-60'}`}
              >
                Home
              </motion.button>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                onClick={() => { onNavigate('contact'); setIsMobileMenuOpen(false); }}
                className={`hover:opacity-50 transition-all hover:tracking-[0.3em] cursor-pointer ${currentPage === 'contact' ? 'opacity-100' : 'opacity-60'}`}
              >
                Contact
              </motion.button>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                className="mt-4 flex items-center gap-3 text-sm opacity-60 hover:opacity-100 transition-opacity"
              >
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </motion.button>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="absolute bottom-12 flex gap-8"
            >
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.label !== 'Email' ? "_blank" : undefined}
                  rel={social.label !== 'Email' ? "noopener noreferrer" : undefined}
                  className={`transition-all duration-300 transform hover:-translate-y-1 ${isDark ? 'text-white/60 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
                  aria-label={social.label}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

