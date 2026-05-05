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

interface MobileCategoryBarProps {
  isDark: boolean;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const MobileCategoryBar: React.FC<MobileCategoryBarProps> = ({ isDark, activeCategory, setActiveCategory }) => {
  return (
    <div className={`lg:hidden sticky top-[60px] md:top-[90px] z-40 backdrop-blur-xl border-b -mx-4 px-4 py-3 mb-6 transition-colors duration-500 ${
      isDark ? 'bg-zinc-900/80 border-white/10' : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap snap-center transition-colors duration-300 ${
                isActive 
                  ? (isDark ? 'text-white' : 'text-zinc-900')
                  : (isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-700')
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryPill"
                  className={`absolute inset-0 rounded-full -z-10 ${isDark ? 'bg-white/10' : 'bg-black/5'}`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {category.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileCategoryBar;
