import React from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../data/projects';

interface Props {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const BentoView: React.FC<Props> = ({ projects, onProjectClick }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[160px] md:auto-rows-[220px] gap-3 md:gap-4 py-6 md:py-12 px-4 md:px-6 max-w-7xl mx-auto">
      {projects.map((project, index) => (
        <motion.div
          key={project._id}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          style={{
            gridColumn: `span ${Math.min(project.colSpan || 1, 2)}`,
          }}
          layoutId={`project-${project._id}`}
          onClick={() => onProjectClick(project)}
          onMouseEnter={(e) => {
            const video = e.currentTarget.querySelector('video');
            if (video) video.play().catch(() => {});
          }}
          onMouseLeave={(e) => {
            const video = e.currentTarget.querySelector('video');
            if (video) {
              video.pause();
              video.currentTime = 0;
            }
          }}
          className="group relative overflow-hidden rounded-2xl md:rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
        >
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {project.previewVideo && (
            <video
              src={project.previewVideo}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md p-3 md:p-4 translate-y-0 md:translate-y-[100%] md:group-hover:translate-y-0 transition-transform duration-300 ease-out z-10 flex justify-between items-center">
            <span className="text-white font-bold text-xs md:text-sm truncate mr-2">{project.title}</span>
            <span className="text-white/70 text-[10px] font-medium whitespace-nowrap">{project.date}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default BentoView;
