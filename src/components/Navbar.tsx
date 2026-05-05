import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function Navbar({ isDark, toggleTheme }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* The Animated Bar Background and Logo */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div
            initial={{ y: -120 }}
            animate={{ y: 0 }}
            exit={{ y: -120 }}
            transition={{ type: 'spring', stiffness: 80, damping: 20 }}
            className={`fixed top-0 left-0 right-0 z-[49] px-8 py-6 backdrop-blur-xl border-b transition-colors duration-500
              ${isDark 
                ? 'bg-white/80 border-white/20' 
                : 'bg-zinc-900/80 border-zinc-800'
              }`}
          >
            <div className="flex items-center gap-3 font-bold text-xl tracking-tight max-w-7xl mx-auto">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}>
                A
              </span>
              <span className={isDark ? 'text-zinc-900' : 'text-white'}>Alex Robertson</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Content (Links and Theme Toggle) */}
      <div className="fixed top-0 left-0 right-0 z-[50] px-8 py-6 flex justify-end items-center max-w-7xl mx-auto pointer-events-none">
        <div className="flex items-center gap-8 pointer-events-auto">
          {/* Links */}
          <div className={`flex gap-8 font-medium transition-colors duration-500 ${
            isScrolled 
              ? (isDark ? 'text-zinc-900' : 'text-white') 
              : 'text-white'
          }`}>
            <a href="#" className="hover:opacity-70 transition-opacity">Home</a>
            <a href="#" className="hover:opacity-70 transition-opacity">Contact</a>
          </div>

          {/* Minimalist SVG Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-500 border ${
              isScrolled
                ? (isDark 
                    ? 'bg-zinc-900/5 border-zinc-900/10 hover:bg-zinc-900/10' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10')
                : 'bg-white/10 border-white/20 hover:bg-white/20'
            }`}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isScrolled ? (isDark ? "black" : "white") : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isScrolled ? (isDark ? "black" : "white") : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
