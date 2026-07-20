import { getCliClient } from 'sanity/cli';

async function migrate() {
  // Use the CLI client which automatically inherits auth from CLI environment
  const client = getCliClient({ apiVersion: '2025-08-15' });

  console.log('Fetching all existing heroVideoReel documents...');
  
  const query = `*[_type == "heroVideoReel"]{
    _id,
    title,
    videos[]{
      _key,
      _type,
      videoFile,
      label
    }
  }`;

  const reels = await client.fetch<any[]>(query);

  if (reels.length === 0) {
    console.log('No heroVideoReel documents found to migrate.');
    return;
  }

  console.log(`Found ${reels.length} documents. Preparing compilation...`);

  // Target order: 'Main Hero Reel' first, followed by others in alphabetical/logical order
  const desiredOrder = ['Main Hero Reel', 'OceanDoor', 'BlackHole', 'Tank', 'Train'];
  
  // Sort the fetched documents according to our desired order
  reels.sort((a, b) => {
    const aIndex = desiredOrder.indexOf(a.title);
    const bIndex = desiredOrder.indexOf(b.title);
    
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.title.localeCompare(b.title);
  });

  // Compile all video items
  const compiledVideos: any[] = [];
  
  for (const reel of reels) {
    if (reel.videos && Array.isArray(reel.videos)) {
      for (const video of reel.videos) {
        // Ensure there is a label if it was empty, using the document title
        const videoLabel = video.label || reel.title || 'Untitled Video';
        compiledVideos.push({
          ...video,
          label: videoLabel,
        });
      }
    }
  }

  if (compiledVideos.length === 0) {
    console.log('No actual videos found in the documents to compile.');
    return;
  }

  console.log(`Compiled ${compiledVideos.length} videos. Creating the singleton document...`);

  // 1. Create or replace the singleton document with ID "heroVideoReel"
  const singletonDoc = {
    _id: 'heroVideoReel',
    _type: 'heroVideoReel',
    title: 'Main Hero Reel',
    videos: compiledVideos,
  };

  await client.createOrReplace(singletonDoc);
  console.log('Successfully created the Singleton Hero Video Reel document with ID: "heroVideoReel"');

  // 2. Safely delete the legacy individual documents
  console.log('Deleting legacy individual heroVideoReel documents...');
  
  const tx = client.transaction();
  for (const reel of reels) {
    // Avoid deleting the newly created singleton if it shared an ID (it shouldn't, but let's be safe)
    if (reel._id !== 'heroVideoReel') {
      tx.delete(reel._id);
      console.log(`- Scheduled deletion for legacy document "${reel.title}" (${reel._id})`);
    }
  }

  await tx.commit();
  console.log('All legacy heroVideoReel documents successfully deleted!');
  console.log('Migration complete!');
}

migrate().catch((err) => {
  console.error('Migration failed with error:', err);
  process.exit(1);
});
