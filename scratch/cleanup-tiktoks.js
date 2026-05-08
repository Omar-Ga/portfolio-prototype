import { execSync } from 'child_process';

function query(groq) {
  const result = execSync(`npx sanity documents query "${groq}" --dataset production`, { encoding: 'utf-8' });
  return JSON.parse(result);
}

function deleteDocs(ids) {
  if (ids.length === 0) return;
  console.log(`Deleting ${ids.length} documents...`);
  // Break into chunks of 20 to avoid shell command length limits
  for (let i = 0; i < ids.length; i += 20) {
    const chunk = ids.slice(i, i + 20);
    execSync(`npx sanity documents delete ${chunk.join(' ')}`, { stdio: 'inherit' });
  }
}

try {
  const videoIds = query("*[_type == 'tiktokVideo'] | order(_createdAt asc)._id");
  const imageIds = query("*[_type == 'tiktokImage'] | order(_createdAt asc)._id");

  console.log(`Found ${videoIds.length} videos and ${imageIds.length} images.`);

  const videosToDelete = videoIds.slice(5);
  const imagesToDelete = imageIds.slice(5);

  deleteDocs(videosToDelete);
  deleteDocs(imagesToDelete);

  console.log('Cleanup complete.');
} catch (error) {
  console.error('Error during cleanup:', error.message);
}
