import React from 'react';
import { motion } from 'framer-motion';
import type { Project } from '../data/projects';

interface Props {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  isSidebarCollapsed?: boolean;
}

const GalleryView: React.FC<Props> = ({ projects, onProjectClick, isSidebarCollapsed = false }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 py-6 md:py-12 mx-auto transition-all duration-500 ease-in-out ${isSidebarCollapsed ? 'gap-2 md:gap-3 px-2 md:px-4 max-w-full w-full' : 'gap-4 md:gap-6 px-4 md:px-6 max-w-7xl'}`}>
      {projects.map((project, index) => (
        <motion.div
          key={project._id}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
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
          className="group relative aspect-square overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 cursor-pointer"
        >
          {project.previewVideo ? (
            <video
              src={project.previewVideo}
              muted
              loop
              playsInline
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800" />
          )}
          
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md p-3 md:p-4 translate-y-0 md:translate-y-[100%] md:group-hover:translate-y-0 [@media(hover:none)]:translate-y-0 transition-transform duration-300 ease-out z-20 flex justify-between items-center">
            <div className="flex flex-col overflow-hidden mr-2">
              <span className="text-white font-bold text-sm truncate">{project.title}</span>
              <span className="text-white/70 text-[10px] font-medium whitespace-nowrap">{project.date}</span>
            </div>
            
            {/* Minimal View Link */}
            <div className="transition-transform duration-300 md:translate-y-2 md:group-hover:translate-y-0 md:opacity-0 md:group-hover:opacity-100 flex-shrink-0">
              <span className="text-xs font-semibold text-white/90 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
                View
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default GalleryView;
