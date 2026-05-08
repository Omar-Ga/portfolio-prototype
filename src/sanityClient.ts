import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: '7ugl8lv0',
  dataset: 'production',
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2025-08-15', // use current date (YYYY-MM-DD) to target the latest API version
});
