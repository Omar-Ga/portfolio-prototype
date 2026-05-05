export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  date: string;
  colSpan?: number;
  rowSpan?: number;
}

export const projects: Project[] = [
  // Row 1: 2 + 1 + 1 = 4
  {
    id: '1',
    title: 'Prism Geometry',
    category: 'Abstract Architecture',
    description: 'A study in translucent glass and light refraction.',
    image: '/images/image1.png',
    date: 'Jan 2024',
    colSpan: 2,
  },
  {
    id: '2',
    title: 'Neon Fluid',
    category: 'Organic Forms',
    description: 'Iridescent liquid simulation with metallic reflections.',
    image: '/images/image2.png',
    date: 'Feb 2024',
    colSpan: 1,
  },
  {
    id: '3',
    title: 'Monolithic Space',
    category: 'Interior Design',
    description: 'Minimalist concrete slabs with dramatic lighting.',
    image: '/images/image3.png',
    date: 'Mar 2024',
    colSpan: 1,
  },
  // Row 2: 1 + 2 + 1 = 4
  {
    id: '4',
    title: 'Data Stream',
    category: 'Visualization',
    description: 'Futuristic particles and holographic interfaces.',
    image: '/images/image4.png',
    date: 'Apr 2024',
    colSpan: 1,
  },
  {
    id: '5',
    title: 'Clay Soul',
    category: 'Character Art',
    description: 'Smooth clay bust with minimalist features.',
    image: '/images/image5.png',
    date: 'May 2024',
    colSpan: 2,
  },
  {
    id: '6',
    title: 'Golden Rings',
    category: 'Luxury Design',
    description: 'Intricate gold and marble abstract composition.',
    image: '/images/image6.png',
    date: 'Jun 2024',
    colSpan: 1,
  },
  // Row 3: 1 + 1 + 2 = 4
  {
    id: '7',
    title: 'Ethereal Bubbles',
    category: 'Digital Art',
    description: 'Translucent glass spheres in a void.',
    image: '/images/image7.png',
    date: 'Jul 2024',
    colSpan: 1,
  },
  {
    id: '8',
    title: 'Topological Mesh',
    category: 'Procedural Art',
    description: 'Complex mesh with intricate wireframe patterns.',
    image: '/images/image8.png',
    date: 'Aug 2024',
    colSpan: 1,
  },
  {
    id: '9',
    title: 'Crystal Core',
    category: 'Nature Simulation',
    description: 'Procedural crystal formation with a glowing core.',
    image: '/images/image9.png',
    date: 'Sep 2024',
    colSpan: 2,
  },
  // Row 4: 2 + 2 = 4
  {
    id: '10',
    title: 'Crimson Silk',
    category: 'Fashion Design',
    description: 'Flowing fabric simulation with satin textures.',
    image: '/images/image10.png',
    date: 'Oct 2024',
    colSpan: 2,
  },
  {
    id: '11',
    title: 'Prism Geometry II',
    category: 'Abstract Architecture',
    description: 'A follow-up study in light and form.',
    image: '/images/image1.png',
    date: 'Nov 2024',
    colSpan: 2,
  },
];
