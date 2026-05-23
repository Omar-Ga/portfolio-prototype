import { defineType, defineField, defineArrayMember } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Project Image (Preview)',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'previewVideo',
      title: 'Preview Video',
      type: 'file',
      options: {
        accept: 'video/mp4,video/webm',
      },
      description: 'Upload an mp4/webm video that plays on hover in the project list.',
    }),
    // Mixed media: images and videos for the project carousel (project-local)
    defineField({
      name: 'media',
      title: 'Media (Images & Videos)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          title: 'Image',
          options: { hotspot: true },
        }),
        defineArrayMember({
          type: 'file',
          title: 'Video',
          options: { accept: 'video/mp4,video/webm' },
        }),
      ],
      description: 'Add images and/or video clips to appear in the project carousel. Preview video remains a separate hover-only field.',
    }),
    defineField({
      name: 'date',
      title: 'Date (e.g., Jan 2024)',
      type: 'string',
    }),
    defineField({
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      options: {
        list: [
          { title: '16:9 (Landscape / Widescreen)', value: '16:9' },
          { title: '9:16 (Portrait / Vertical)', value: '9:16' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
      initialValue: '16:9',
      description: 'Controls layout grouping and modal aspect ratio.',
    }),
  ],
});
