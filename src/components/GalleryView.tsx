import React from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../data/projects';

interface Props {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const GalleryView: React.FC<Props> = ({ projects, onProjectClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12 px-6 max-w-7xl mx-auto">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          layoutId={`project-${project.id}`}
          onClick={() => onProjectClick(project)}
          className="group relative aspect-square overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 cursor-pointer"
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md p-4 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out z-10 flex justify-between items-center">
            <span className="text-white font-bold text-sm truncate mr-2">{project.title}</span>
            <span className="text-white/70 text-[10px] font-medium whitespace-nowrap">{project.date}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GalleryView;
