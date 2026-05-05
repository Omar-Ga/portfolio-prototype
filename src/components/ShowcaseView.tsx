import React from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../data/projects';

interface Props {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const ShowcaseView: React.FC<Props> = ({ projects, onProjectClick }) => {
  return (
    <div className="flex flex-col gap-12 max-w-5xl mx-auto py-12 px-6">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          layoutId={`project-${project.id}`}
          onClick={() => onProjectClick(project)}
          className="group relative overflow-hidden rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 cursor-pointer"
        >
          <div className="aspect-[16/9] w-full overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md p-4 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-10 flex justify-between items-center">
              <span className="text-white font-bold text-lg">{project.title}</span>
              <span className="text-white/70 text-xs font-medium uppercase tracking-widest">{project.date}</span>
            </div>
            
            {/* View Project Button - Positioned above the hover overlay */}
            <div className="absolute bottom-20 right-8 z-20">
              <button className="px-6 py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-sm transition-all hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 shadow-xl">
                View Project
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ShowcaseView;
