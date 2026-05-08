import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'tiktokImage',
  title: 'TikTok Image',
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
      description: 'Paste the full TikTok photo URL (e.g., https://www.tiktok.com/@username/photo/123456789)',
      validation: (Rule) =>
        Rule.required().custom((url) => {
          if (!url) return true;
          
          if (!url.includes('tiktok.com')) {
            return 'URL must be a valid TikTok link';
          }
          
          if (url.includes('/video/')) {
            return 'This is a video link. Please add it to the TikTok Videos section instead.';
          }
          
          if (!url.includes('/photo/')) {
            return 'URL must contain /photo/';
          }

          const regex = /^https:\/\/(www\.)?tiktok\.com\/@[^\/]+\/photo\/\d+$/;
          if (!regex.test(url)) {
            return 'Please use the full desktop URL format: https://www.tiktok.com/@username/photo/123456789';
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
