import React from 'react';
import { motion } from 'framer-motion';


interface MobileCategoryBarProps {
  isDark: boolean;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  categories: { _id: string, title: string }[];
}

const MobileCategoryBar: React.FC<MobileCategoryBarProps> = ({ isDark, activeCategory, setActiveCategory, categories }) => {
  const allCategories = [{ _id: 'all', title: 'All Works' }, ...categories];

  return (
    <div className={`lg:hidden sticky top-[60px] md:top-[90px] z-40 backdrop-blur-xl border-b -mx-4 px-4 py-3 mb-2 transition-colors duration-500 ${
      isDark ? 'bg-zinc-900/80 border-white/10' : 'bg-white/80 border-gray-200'
    }`}>
      <div className="flex gap-2 overflow-x-auto no-scrollbar snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {allCategories.map((category) => {
          const isActive = activeCategory === (category._id === 'all' ? 'all' : category.title);
          return (
            <button
              key={category._id}
              onClick={() => setActiveCategory(category._id === 'all' ? 'all' : category.title)}
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
              {category.title}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileCategoryBar;
