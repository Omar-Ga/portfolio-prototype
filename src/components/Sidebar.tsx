import React from 'react';
import { motion } from 'framer-motion';


import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isDark: boolean;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: { _id: string, title: string }[];
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isDark, activeCategory, setActiveCategory, categories, isCollapsed, setIsCollapsed }) => {
  const allCategories = [{ _id: 'all', title: 'All Works' }, ...categories];

  return (
    <aside className={`hidden lg:flex flex-col h-[calc(100vh-100px)] sticky top-24 ml-4 p-8 rounded-[2rem] transition-all duration-500 ease-in-out relative ${
      isCollapsed ? 'w-24 px-4' : 'w-72'
    } ${
      isDark ? 'bg-zinc-900/30' : 'bg-zinc-50/50'
    }`}>
      {/* Unified Sidebar Edge System (Line + Centered Toggle) */}
      <div className="absolute right-0 top-0 bottom-0 w-[2px] flex flex-col items-center pointer-events-none">
        {/* Top line segment */}
        <div className={`w-full h-8 ${isDark ? 'bg-white/10' : 'bg-zinc-200'}`} />
        
        {/* The Gap (Centered Toggle) */}
        <div className="h-16 w-12 flex items-center justify-center pointer-events-auto">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`p-1.5 rounded-full border shadow-sm transition-transform duration-300 hover:scale-110 ${
              isDark 
                ? 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white' 
                : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900'
            }`}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Bottom line segment - grows to fill remaining space */}
        <div className={`w-full flex-grow ${isDark ? 'bg-white/10' : 'bg-zinc-200'} mb-10`} />
      </div>

      <div className={`flex flex-col h-full transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <h2 className={`text-[10px] font-bold tracking-[0.3em] uppercase mb-10 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
          Projects
        </h2>
        
        <nav className="flex flex-col gap-y-6">
          {allCategories.map((category) => {
            const isActive = activeCategory === (category._id === 'all' ? 'all' : category.title);
            
            return (
              <button
                key={category._id}
                onClick={() => setActiveCategory(category._id === 'all' ? 'all' : category.title)}
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
                  {category.title}
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

    </aside>
  );
};

export default Sidebar;
