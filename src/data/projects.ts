export interface Project {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  gallery?: string[];
  date: string;
  previewVideo?: string;
  colSpan?: number;
}

// Mock data is now stored in Sanity CMS.
// This file is kept for the Project interface definition.
export const projects: Project[] = []; 
