import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sidebar from './components/Sidebar';
import ShowcaseView from './components/ShowcaseView';
import GalleryView from './components/GalleryView';
import { projects, type Project } from './data/projects';
import { AnimatePresence, motion } from 'framer-motion';
import ProjectModal from './components/ProjectModal';

function App() {
  const [activeCategory, setActiveCategory] = useState('all');
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
    <div className={`min-h-screen font-sans transition-colors duration-500 ${isDark ? 'bg-zinc-900 text-zinc-50' : 'bg-white text-zinc-900'}`}>
      <Navbar 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
      />
      <div className="flex flex-col">
        <Hero />
        <div id="projects-section" className="flex pt-32 px-10">
        <Sidebar 
          isDark={isDark} 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />
        
        <main className="flex-grow pl-20 pb-20">
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
      </div>

      <footer className={`border-t py-12 px-6 ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-gray-500">
            © 2026 Portfolio.3D. Built for demonstration.
          </p>
          <div className={`flex gap-8 text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <a href="#" className="hover:text-blue-500 transition-colors">Instagram</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Behance</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Dribbble</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
