export interface Project {
  _id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  // New mixed media collection (project-local). Each item is typed on the frontend as 'video' or 'image'.
  media?: { type: 'video' | 'image'; url: string }[];
  date: string;
  previewVideo?: string;
  colSpan?: number;
  aspectRatio: '16:9' | '9:16';
}

// Mock data is now stored in Sanity CMS.
// This file is kept for the Project interface definition.
export const projects: Project[] = []; 
