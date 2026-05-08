import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'tiktokVideo',
  title: 'TikTok Video',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'TikTok URL',
      type: 'url',
      description: 'Paste the full TikTok video URL (e.g., https://www.tiktok.com/@username/video/123456789)',
      validation: (Rule) =>
        Rule.required().custom((url) => {
          if (!url) return true;
          
          if (!url.includes('tiktok.com')) {
            return 'URL must be a valid TikTok link';
          }
          
          if (url.includes('/photo/')) {
            return 'This is a photo link. Please add it to the TikTok Images section instead.';
          }
          
          if (!url.includes('/video/')) {
            return 'URL must contain /video/';
          }

          const regex = /^https:\/\/(www\.)?tiktok\.com\/@[^\/]+\/video\/\d+$/;
          if (!regex.test(url)) {
            return 'Please use the full desktop URL format: https://www.tiktok.com/@username/video/123456789';
          }
          
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'url',
    },
  },
});
