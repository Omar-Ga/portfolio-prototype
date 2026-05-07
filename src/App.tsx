import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sidebar from './components/Sidebar';
import MobileCategoryBar from './components/MobileCategoryBar';
import ShowcaseView from './components/ShowcaseView';
import GalleryView from './components/GalleryView';
import { projects, type Project } from './data/projects';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectModal from './components/ProjectModal';
import TikTokShowcase from './components/TikTokShowcase';
import ContactPage from './components/ContactPage';
import { FaInstagram, FaTiktok, FaDiscord } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState<'home' | 'contact'>('home');
  const [isDark, setIsDark] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className={`${currentPage === 'contact' ? 'h-screen overflow-hidden' : 'min-h-screen'} font-sans transition-colors duration-500 ${isDark ? 'bg-zinc-900 text-zinc-50' : 'bg-white text-zinc-900'}`}>
      <Navbar 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        onNavigate={setCurrentPage}
        currentPage={currentPage}
      />
      
      <AnimatePresence mode="wait">
        {currentPage === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col">
              <Hero />
              <div id="projects-section" className="flex pt-20 md:pt-32 px-4 md:px-10">
                <Sidebar 
                  isDark={isDark} 
                  activeCategory={activeCategory} 
                  setActiveCategory={setActiveCategory} 
                />
                
                <main className="flex-grow pl-0 lg:pl-20 pb-10 md:pb-20 w-full min-w-0">
                  <MobileCategoryBar 
                    isDark={isDark}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                  />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCategory === 'all' ? 'gallery' : 'showcase'}
                      initial={{ opacity: 0, x: activeCategory !== 'all' ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: activeCategory !== 'all' ? 20 : -20 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                      {activeCategory !== 'all' && <ShowcaseView projects={projects} onProjectClick={setSelectedProject} />}
                      {activeCategory === 'all' && <GalleryView projects={projects} onProjectClick={setSelectedProject} />}
                    </motion.div>
                  </AnimatePresence>

                  <AnimatePresence>
                    {selectedProject && (
                      <ProjectModal 
                        project={selectedProject} 
                        onClose={() => setSelectedProject(null)} 
                      />
                    )}
                  </AnimatePresence>
                </main>
              </div>

              <TikTokShowcase isDark={isDark} />
            </div>

            <footer className={`border-t py-8 px-5 md:py-12 md:px-10 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
              <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10">
                <p className={`text-sm tracking-wide font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} font-['Outfit'] text-center md:text-left`}>
                  Bringing visionary ideas to life through thoughtful design.
                </p>

                <div className="flex gap-6 md:gap-8 items-center">
                  {[
                    { icon: FaInstagram, href: 'https://www.instagram.com/the_volumetric_cube/', label: 'Instagram' },
                    { icon: FaTiktok, href: 'https://www.tiktok.com/the_volumetric_cube', label: 'TikTok' },
                    { icon: FaDiscord, href: '#', label: 'Discord' },
                    { icon: MdEmail, href: 'mailto:Tylerdobson30@gmail.com', label: 'Email' },
                  ].map((social) => (
                    <a 
                      key={social.label}
                      href={social.href} 
                      target={social.label !== 'Email' ? "_blank" : undefined}
                      rel={social.label !== 'Email' ? "noopener noreferrer" : undefined}
                      className={`transition-all duration-300 transform hover:scale-110 ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-zinc-900'}`}
                      aria-label={social.label}
                    >
                      <div className="w-[22px] h-[22px] md:w-[26px] md:h-[26px]">
                        <social.icon size="100%" />
                      </div>
                    </a>
                  ))}
                </div>

              </div>
            </footer>
          </motion.div>
        ) : (
          <motion.div
            key="contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ContactPage isDark={isDark} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
