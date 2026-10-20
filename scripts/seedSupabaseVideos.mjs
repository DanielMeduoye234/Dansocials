import { createClient } from '@supabase/supabase-js';

const url = 'https://gpjghzmaykgpwsxfwjbz.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwamdoem1heWtncHdzeGZ3amJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjQ4MjY1NSwiZXhwIjoyMTA4MDU4NjU1fQ.Ssdd5m7TRNYTOE4I71MLayLS0t0T_Qjp2CMwFfw6NLo';
const supabase = createClient(url, serviceKey);

async function uploadVideoFromUrl(sourceUrl, destinationPath) {
  try {
    console.log(`Downloading ${sourceUrl} ...`);
    const res = await fetch(sourceUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    console.log(`Uploading to ${destinationPath} (${buffer.length} bytes) ...`);
    const { data, error } = await supabase.storage
      .from('portfolio-media')
      .upload(destinationPath, buffer, {
        contentType: 'video/mp4',
        upsert: true
      });
    if (error) {
      console.error(`Error uploading ${destinationPath}:`, error.message);
    } else {
      const { data: pub } = supabase.storage.from('portfolio-media').getPublicUrl(destinationPath);
      console.log(`SUCCESS ${destinationPath} -> ${pub.publicUrl}`);
      return pub.publicUrl;
    }
  } catch(e) {
    console.error(`Failed ${destinationPath}:`, e.message);
  }
}

async function run() {
  const sources = [
    { src: 'https://raw.githubusercontent.com/intel-iot-devkit/sample-videos/master/car-detection.mp4', dest: 'videos/tdot_kingsong_n12.mp4' },
    { src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', dest: 'videos/hex_brand_documentary.mp4' }
  ];

  for (const item of sources) {
    await uploadVideoFromUrl(item.src, item.dest);
  }
}

run();
