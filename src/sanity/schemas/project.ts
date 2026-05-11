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
    defineField({
      name: 'gallery',
      title: 'Gallery Images',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
        }),
      ],
      description: 'Additional images for the project carousel.',
    }),
    defineField({
      name: 'date',
      title: 'Date (e.g., Jan 2024)',
      type: 'string',
    }),
  ],
});
