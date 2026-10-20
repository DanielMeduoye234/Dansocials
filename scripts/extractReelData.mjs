const reels = [
  { id: 'DWzqdVkiUXC', link: 'https://www.instagram.com/reel/DWzqdVkiUXC/' },
  { id: 'DbE3vLEK-Lo', link: 'https://www.instagram.com/reel/DbE3vLEK-Lo/' },
  { id: 'Da1HtdspMaC', link: 'https://www.instagram.com/reel/Da1HtdspMaC/' },
  { id: 'DatY15Wtcmh', link: 'https://www.instagram.com/reel/DatY15Wtcmh/' },
  { id: 'Daoff6WqRNM', link: 'https://www.instagram.com/reel/Daoff6WqRNM/' },
  { id: 'DagaqV9Nc3w', link: 'https://www.instagram.com/reel/DagaqV9Nc3w/' },
  { id: 'DaJsIaDKHnx', link: 'https://www.instagram.com/reel/DaJsIaDKHnx/' },
  { id: 'DZ6TazdNxeQ', link: 'https://www.instagram.com/reel/DZ6TazdNxeQ/' },
  { id: 'DZVyrTcpfHn', link: 'https://www.instagram.com/reel/DZVyrTcpfHn/' },
];

async function fetchMeta(reel) {
  try {
    const res = await fetch(reel.link, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/s) ||
                      html.match(/<meta\s+property=["']og:description["']\s+content=["'](.*?)["']/s);
    const titleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["'](.*?)["']/s);
    const imgMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["'](.*?)["']/s);

    const desc = descMatch ? descMatch[1].replace(/&quot;/g, '"').replace(/&#x([0-9a-fA-F]+);/g, (m, c) => String.fromCharCode(parseInt(c, 16))) : '';
    const title = titleMatch ? titleMatch[1].replace(/&quot;/g, '"') : '';
    const img = imgMatch ? imgMatch[1].replace(/&amp;/g, '&') : '';

    return {
      id: reel.id,
      link: reel.link,
      title,
      desc,
      img
    };
  } catch (err) {
    return { id: reel.id, error: err.message };
  }
}

async function run() {
  const results = [];
  for (const r of reels) {
    console.log('Fetching', r.id, '...');
    const data = await fetchMeta(r);
    results.push(data);
  }
  console.log('Results summary:');
  for (const r of results) {
    console.log('===', r.id, '===');
    console.log('Title:', r.title);
    console.log('Desc:', r.desc ? r.desc.slice(0, 150) : '');
  }
}

run();
