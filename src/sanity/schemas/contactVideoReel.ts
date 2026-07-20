import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'contactVideoReel',
  title: 'Contact Video Reel',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Reel Title',
      type: 'string',
      initialValue: 'Contact Video Reel',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'videoItem',
          title: 'Video Item',
          fields: [
            defineField({
              name: 'videoFile',
              title: 'Video File',
              type: 'file',
              options: {
                accept: 'video/mp4,video/webm',
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label/Title',
              type: 'string',
              description: 'Internal label for this video clip',
            }),
          ],
          preview: {
            select: {
              title: 'label',
              media: 'videoFile',
            },
            prepare({ title }) {
              return {
                title: title || 'Untitled Video',
              };
            },
          },
        },
      ],
      description: 'Upload and order your contact section videos here. They will play in the order listed.',
      validation: (Rule) => Rule.min(1).error('Please upload at least one video.'),
    }),
  ],
});
