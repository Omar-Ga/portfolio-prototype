import React from 'react';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
}

const categories: Category[] = [
  { id: 'all', name: 'All Works' },
  { id: '3d', name: '3D Design' },
  { id: 'motion', name: 'Motion Graphics' },
  { id: 'vfx', name: 'Visual Effects' },
  { id: 'photography', name: 'Photography' },
  { id: 'web', name: 'Web Experiences' },
  { id: 'branding', name: 'Branding' },
  { id: 'ui', name: 'UI/UX Design' },
];

interface SidebarProps {
  isDark: boolean;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isDark, activeCategory, setActiveCategory }) => {

  return (
    <aside className={`hidden lg:flex flex-col w-72 h-[calc(100vh-100px)] sticky top-24 ml-4 p-8 rounded-[2rem] transition-colors duration-500 ${
      isDark ? 'bg-zinc-900/30' : 'bg-zinc-50/50'
    }`}>
      <div className="flex flex-col h-full">
        <h2 className={`text-[10px] font-bold tracking-[0.3em] uppercase mb-10 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          Collection
        </h2>
        
        <nav className="flex flex-col gap-y-6">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className="group relative flex items-center text-left outline-none"
              >
                {/* Minimal Active Indicator Line */}
                <div className={`absolute -left-4 w-[2px] h-4 transition-all duration-500 ease-out ${
                  isActive 
                    ? 'bg-blue-500 opacity-100 scale-y-100' 
                    : 'bg-zinc-500 opacity-0 scale-y-0 group-hover:opacity-30 group-hover:scale-y-75'
                }`} />

                <span className={`text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? isDark ? 'text-white translate-x-1' : 'text-zinc-950 translate-x-1'
                    : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-800'
                }`}>
                  {category.name}
                </span>

                {isActive && (
                   <motion.span 
                    layoutId="activeDot"
                    className="ml-3 w-1 h-1 rounded-full bg-blue-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                   />
                )}
              </button>
            );
          })}
        </nav>

        {/* Minimalist Separator shown in image */}
        <div className={`mt-12 h-[1.5px] w-24 ${isDark ? 'bg-zinc-800' : 'bg-zinc-300'}`} />
      </div>

      {/* Vertical separator adjusted for the new background boundary */}
      <div className={`absolute right-0 top-10 bottom-10 w-[2px] ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`} />
    </aside>
  );
};

export default Sidebar;
