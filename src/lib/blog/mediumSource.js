import {
  MEDIUM_FEED_URL,
  MEDIUM_FETCH_RETRIES,
  MEDIUM_FETCH_TIMEOUT_MS,
} from "./config";

// --- Minimal, dependency-free RSS field extraction -------------------------
// Medium's feed is well-formed RSS 2.0 with dc:/atom: namespaced fields, so a
// small set of targeted extractors is enough — no need for a full XML parser
// dependency for a single known feed shape.

function extractField(xml, field) {
  const cdataRe = new RegExp(`<${field}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${field}>`, "i");
  const cdataMatch = xml.match(cdataRe);
  if (cdataMatch) return cdataMatch[1];

  const tagRe = new RegExp(`<${field}[^>]*>([\\s\\S]*?)<\\/${field}>`, "i");
  const tagMatch = xml.match(tagRe);
  return tagMatch ? tagMatch[1].trim() : "";
}

function extractLink(item) {
  const standardLink = item.match(/<link>([^<]+)<\/link>/);
  if (standardLink) return standardLink[1].trim();

  const guid = item.match(/<guid[^>]*>(?:<!\[CDATA\[)?(https?:\/\/[^\]<\s]+?)(?:\]\]>)?<\/guid>/);
  if (guid) return guid[1].trim();

  return "";
}

function extractGuid(item) {
  const guidMatch = item.match(/<guid[^>]*>([^<]+)<\/guid>/);
  return guidMatch ? guidMatch[1].trim() : "";
}

function extractCategories(item) {
  const categories = [];
  const regex = /<category>(?:<!\[CDATA\[(.*?)\]\]>|([^<]*))<\/category>/g;
  let match;
  while ((match = regex.exec(item)) !== null) {
    const value = (match[1] ?? match[2] ?? "").trim();
    if (value) categories.push(value);
  }
  return categories;
}

function extractThumbnail(contentHtml) {
  if (!contentHtml) return null;
  const match = contentHtml.match(/<img[^>]+src=["']([^"'>]+)["']/i);
  return match ? match[1] : null;
}

// A short, stable id derived from Medium's guid (e.g.
// "https://medium.com/p/1053c3b8c736" -> "1053c3b8c736"). This survives
// title edits and feed URL query-string churn, unlike the `link` field.
function extractMediumId(guid, link) {
  const source = guid || link || "";
  const match = source.match(/([a-f0-9]{8,})(?:[/?#]|$)/i);
  return match ? match[1] : source;
}

function parseMediumRssXml(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];

    // Medium's feed sometimes has stray leading/trailing whitespace inside
    // the CDATA title block — trim it so it never leaks into <title>,
    // canonical/OG tags, or JSON-LD headline.
    const title = extractField(item, "title").trim();
    const link = extractLink(item);
    const guid = extractGuid(item);
    const pubDateRaw = extractField(item, "pubDate");
    const updatedRaw = extractField(item, "atom:updated");
    const author = extractField(item, "dc:creator") || null;
    const contentHtml = extractField(item, "content:encoded");
    const description = extractField(item, "description");
    const categories = extractCategories(item);
    const thumbnail = extractThumbnail(contentHtml);

    const pubDate = pubDateRaw ? new Date(pubDateRaw).toISOString() : null;
    // NOTE: Medium's <atom:updated> is present in the feed but, based on
    // observed behavior across accounts, it mirrors <pubDate> at publish
    // time and does not reliably change when a story is later edited. We
    // still capture it (in case an account/story does get a real bump) but
    // never treat it as authoritative on its own — see sync.js, which uses
    // a content hash as the actual "did this change" signal.
    const updatedAtRaw = updatedRaw ? new Date(updatedRaw).toISOString() : null;

    if (!title || !link || !pubDate) continue;

    items.push({
      mediumId: extractMediumId(guid, link),
      title,
      link,
      pubDate,
      updatedAtRaw,
      author,
      categories,
      contentHtml,
      description,
      thumbnail,
    });
  }

  return items;
}

async function fetchWithTimeout(url, { timeoutMs, ...init }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchOnce() {
  const res = await fetchWithTimeout(MEDIUM_FEED_URL, {
    timeoutMs: MEDIUM_FETCH_TIMEOUT_MS,
    // Bypass Next's fetch data-cache here on purpose: staleness and
    // failure-caching are handled deliberately at the KV/store layer
    // (see sync.js), not by Next's opaque 1-hour edge cache.
    cache: "no-store",
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; PersonalBlogSync/1.0; +https://medium.com)",
      Accept: "application/rss+xml, application/xml, text/xml",
    },
  });

  if (!res.ok) {
    throw new Error(`Medium feed responded with HTTP ${res.status}`);
  }

  const xml = await res.text();
  if (!xml.includes("<rss")) {
    throw new Error("Medium feed response was not valid RSS");
  }
  return xml;
}

// Fetches and parses the Medium RSS feed with a short retry budget. Medium
// occasionally rate-limits or hiccups on individual requests — retrying a
// couple of times here means a single transient failure doesn't wipe out
// the whole sync (the caller also falls back to previously stored data on
// total failure, see sync.js / api/blogs/route.js).
export async function fetchMediumArticles() {
  let lastError;
  for (let attempt = 0; attempt <= MEDIUM_FETCH_RETRIES; attempt += 1) {
    try {
      const xml = await fetchOnce();
      return parseMediumRssXml(xml);
    } catch (err) {
      lastError = err;
      if (attempt < MEDIUM_FETCH_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

export { parseMediumRssXml };
