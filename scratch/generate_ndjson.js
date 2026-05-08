import fs from 'fs';
import path from 'path';

// Using regex to parse the typescript file since we can't easily require a ts file with exports in plain node without ts-node
const filePath = path.join(process.cwd(), '../src/data/tiktok.ts');
const content = fs.readFileSync(filePath, 'utf-8');

const regex = /{ id: '([^']+)', title: '([^']+)', type: '([^']+)' }/g;
let match;
const ndjson = [];

while ((match = regex.exec(content)) !== null) {
  const id = match[1];
  const title = match[2];
  const type = match[3];
  
  const docType = type === 'video' ? 'tiktokVideo' : 'tiktokImage';
  const url = type === 'video' 
    ? `https://www.tiktok.com/@the_volumetric_cube/video/${id}`
    : `https://www.tiktok.com/@the_volumetric_cube/photo/${id}`;
    
  const doc = {
    _type: docType,
    title,
    url
  };
  
  ndjson.push(JSON.stringify(doc));
}

fs.writeFileSync('tiktoks.ndjson', ndjson.join('\n'));
console.log(`Generated tiktoks.ndjson with ${ndjson.length} documents`);
