export async function GET() {
  try {
    const res = await fetch('https://medium.com/feed/@keshrianurag690', {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BlogFetcher/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const xml = await res.text();
    const items = parseRSS(xml);

    return Response.json({ items, success: true });
  } catch (err) {
    return Response.json({ items: [], success: false, error: err.message }, { status: 500 });
  }
}

function extractField(xml, field) {
  const cdataRe = new RegExp(`<${field}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${field}>`, 'i');
  const cdataMatch = xml.match(cdataRe);
  if (cdataMatch) return cdataMatch[1];

  const tagRe = new RegExp(`<${field}[^>]*>([\\s\\S]*?)<\\/${field}>`, 'i');
  const tagMatch = xml.match(tagRe);
  return tagMatch ? tagMatch[1].trim() : '';
}

function extractLink(item) {
  const standardLink = item.match(/<link>([^<]+)<\/link>/);
  if (standardLink) return standardLink[1].trim();

  const selfClosing = item.match(/<link\/>\s*\n?\s*(https?:\/\/[^\s<]+)/);
  if (selfClosing) return selfClosing[1].trim();

  const guid = item.match(/<guid[^>]*>(?:<!\[CDATA\[)?(https?:\/\/[^\]<\s]+?)(?:\]\]>)?<\/guid>/);
  if (guid) return guid[1].trim();

  return '';
}

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];

    const title = extractField(item, 'title');
    const link = extractLink(item);
    const pubDate = extractField(item, 'pubDate');
    const content = extractField(item, 'content:encoded');
    const description = extractField(item, 'description');

    const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
    const thumbnail = imgMatch ? imgMatch[1] : null;

    const rawText = stripHtml(description || content);
    const excerpt = rawText.length > 240 ? rawText.substring(0, 240).trim() + '…' : rawText;

    const categories = [...item.matchAll(/<category><!\[CDATA\[(.*?)\]\]><\/category>/g)]
      .map((m) => m[1])
      .slice(0, 4);

    if (title && link) {
      items.push({ title, link, pubDate, thumbnail, excerpt, categories });
    }
  }

  return items;
}
