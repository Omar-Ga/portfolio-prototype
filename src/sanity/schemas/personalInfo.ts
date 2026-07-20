import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'personalInfo',
  title: 'Personal Info',
  type: 'document',
  fields: [
    defineField({
      name: 'greeting',
      title: 'Greeting',
      type: 'string',
      description: 'The small text above the name (e.g. "HELLO THERE!")',
      initialValue: 'HELLO THERE!',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Your name or main headline',
      initialValue: "I'm Alexander Robertson",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Biography / Description',
      type: 'text',
      description: 'The short paragraph about what you do',
      initialValue: 'A passionate graphic designer specializing in immersive 3D landscapes, sleek brand identities, and futuristic visual experiences. Turning bold concepts into striking digital realities.',
      validation: (Rule) => Rule.required(),
    }),
  ],
});
