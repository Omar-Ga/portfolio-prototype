import React from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../data/projects';

interface Props {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const ShowcaseView: React.FC<Props> = ({ projects, onProjectClick }) => {
  return (
    <div className="flex flex-col gap-8 md:gap-12 max-w-5xl mx-auto py-6 px-4 md:py-12 md:px-6">
      {projects.map((project, index) => (
        <motion.div
          key={project._id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
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
          className="group relative overflow-hidden rounded-2xl md:rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 cursor-pointer"
        >
          <div className="aspect-[16/9] w-full overflow-hidden relative">
            {project.previewVideo ? (
              <video
                src={project.previewVideo}
                muted
                loop
                playsInline
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : project.image ? (
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800" />
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md p-3 md:p-4 translate-y-0 md:translate-y-[100%] md:group-hover:translate-y-0 transition-transform duration-300 ease-out z-20 flex justify-between items-center">
              <span className="text-white font-bold text-base md:text-lg">{project.title}</span>
              <span className="text-white/70 text-[10px] md:text-xs font-medium uppercase tracking-widest">{project.date}</span>
            </div>
            
            {/* View Project Button - Positioned above the hover overlay */}
            <div className="absolute bottom-16 right-4 md:bottom-20 md:right-8 z-30">
              <button className="px-4 py-2 md:px-6 md:py-3 rounded-full bg-black dark:bg-white text-white dark:text-black font-semibold text-xs md:text-sm transition-all hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 shadow-xl">
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
