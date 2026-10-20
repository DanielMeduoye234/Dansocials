async function inspectReelEmbed(id) {
  try {
    const res = await fetch(`https://www.instagram.com/reel/${id}/embed/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const text = await res.text();
    
    // Check title/caption
    const captionMatch = text.match(/class="Caption"[^>]*>([\s\S]*?)<\/div>/) || text.match(/<div class="Caption">([\s\S]*?)<\/div>/);
    let caption = '';
    if (captionMatch) {
      caption = captionMatch[1].replace(/<[^>]+>/g, '').trim();
    }
    
    // Check display url / image
    const imgMatch = text.match(/class="EmbeddedMediaImage" [^>]*src="([^"]+)"/) || text.match(/src="(https:\/\/[^"]+cdninstagram[^"]+)"/);
    const imgSrc = imgMatch ? imgMatch[1].replace(/&amp;/g, '&') : null;
    
    console.log('ID:', id, '| Caption:', caption.slice(0, 80), '| Img:', imgSrc ? imgSrc.slice(0, 60) + '...' : 'none');
  } catch(e) {
    console.error(id, e.message);
  }
}

async function run() {
  const reels = [
    'DWzqdVkiUXC',
    'DbE3vLEK-Lo',
    'Da1HtdspMaC',
    'DatY15Wtcmh',
    'Daoff6WqRNM',
    'DagaqV9Nc3w',
    'DaJsIaDKHnx',
    'DZ6TazdNxeQ',
    'DZVyrTcpfHn'
  ];
  for (const id of reels) {
    await inspectReelEmbed(id);
  }
}
run();
