import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemas';

export default defineConfig({
  name: 'default',
  title: 'Lucy Portfolio',
  projectId: '7ugl8lv0',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
