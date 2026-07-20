import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemas';
import { structure } from './src/sanity/structure';

export default defineConfig({
  name: 'default',
  title: 'Lucy Portfolio',
  projectId: '7ugl8lv0',
  dataset: 'production',
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
  document: {
    // For singleton types, filter out the "Create new" option
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter((template) => template.templateId !== 'heroVideoReel');
      }
      return prev;
    },
    // For singleton types, only allow update, publish, discardChanges
    actions: (prev, { schemaType }) => {
      if (schemaType === 'heroVideoReel') {
        return prev.filter(({ action }) =>
          ['publish', 'discardChanges', 'restore'].includes(action || '')
        );
      }
      return prev;
    },
  },
});

