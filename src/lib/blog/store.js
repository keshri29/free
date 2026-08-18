import crypto from "node:crypto";
import { getKv } from "./kv";
import { sanitizeArticleHtml, extractHeadings } from "./sanitize";
import { computeExcerpt, computeReadingStats } from "./text";
import { buildPermanentSlug } from "./slug";
import { ARTICLES_PER_PAGE } from "./config";

const INDEX_KEY = "blog:index:v1";
const articleKey = (slug) => `blog:article:v1:${slug}`;

function hashContent(input) {
  return crypto.createHash("sha256").update(input || "").digest("hex");
}

async function readIndex() {
  const kv = await getKv();
  const index = await kv.get(INDEX_KEY);
  return Array.isArray(index) ? index : [];
}

async function writeIndex(index) {
  const kv = await getKv();
  await kv.set(INDEX_KEY, index);
}

// Lightweight "card" view stored in the index so listing pages never need
// to load full article bodies just to render a grid of cards.
function toIndexEntry(article) {
  return {
    slug: article.slug,
    mediumId: article.mediumId,
    title: article.title,
    link: article.link,
    excerpt: article.excerpt,
    thumbnail: article.thumbnail,
    author: article.author,
    category: article.category,
    categories: article.categories,
    pubDate: article.pubDate,
    dateModified: article.dateModified,
    pubDateMs: new Date(article.pubDate).getTime(),
    dateModifiedMs: new Date(article.dateModified).getTime(),
    readingTimeMinutes: article.readingTimeMinutes,
    wordCount: article.wordCount,
  };
}

function buildArticleRecord({
  mediumId,
  slug,
  title,
  link,
  author,
  categories,
  pubDate,
  dateModified,
  contentHtml,
  description,
  thumbnail,
  contentHash,
  firstSeenAt,
}) {
  const sanitizedHtml = sanitizeArticleHtml(contentHtml);
  const { wordCount, readingTimeMinutes } = computeReadingStats(sanitizedHtml);
  return {
    slug,
    mediumId,
    title,
    link,
    author: author || null,
    categories: categories || [],
    category: categories?.[0] || "General",
    pubDate,
    dateModified,
    contentHtml: sanitizedHtml,
    headings: extractHeadings(sanitizedHtml),
    excerpt: computeExcerpt(sanitizedHtml, description),
    thumbnail: thumbnail || null,
    wordCount,
    readingTimeMinutes,
    contentHash,
    firstSeenAt,
  };
}

export async function getArticleBySlug(slug) {
  const kv = await getKv();
  return kv.get(articleKey(slug));
}

function sortByPubDateDesc(a, b) {
  return b.pubDateMs - a.pubDateMs;
}

export async function getArticles({ page = 1, limit = ARTICLES_PER_PAGE, category } = {}) {
  const index = await readIndex();
  let entries = [...index].sort(sortByPubDateDesc);
  if (category) {
    entries = entries.filter((entry) => entry.categories?.includes(category));
  }
  const total = entries.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;
  const pageEntries = entries.slice(start, start + limit);
  return { articles: pageEntries, total, page: safePage, limit, totalPages };
}

export async function getAllArticleMeta() {
  const index = await readIndex();
  return [...index].sort(sortByPubDateDesc);
}

export async function getAllCategories() {
  const index = await readIndex();
  const set = new Set();
  index.forEach((entry) => entry.categories?.forEach((c) => set.add(c)));
  return [...set].sort();
}

export async function getRelatedArticles(slug, { categories = [], limit = 3 } = {}) {
  const index = await readIndex();
  const scored = index
    .filter((entry) => entry.slug !== slug)
    .map((entry) => ({
      entry,
      score: entry.categories?.filter((c) => categories.includes(c)).length || 0,
    }))
    .sort((a, b) => b.score - a.score || b.entry.pubDateMs - a.entry.pubDateMs);

  return scored.slice(0, limit).map((s) => s.entry);
}

async function generateUniqueSlug(title, mediumId, index) {
  let slug = buildPermanentSlug(title, mediumId);
  const taken = new Set(index.map((entry) => entry.slug));
  if (!taken.has(slug)) return slug;
  let attempt = 1;
  while (taken.has(`${slug}-${attempt}`)) attempt += 1;
  return `${slug}-${attempt}`;
}

// Upserts one Medium item into the KV-backed archive.
//
// Detection logic:
//  - New guid  -> create a new record + permanent slug.
//  - Known guid, content hash unchanged -> no write (avoids needless KV
//    writes / avoids bumping dateModified on every sync for untouched posts).
//  - Known guid, content hash changed -> this is our authoritative signal
//    that Medium's copy was edited (see mediumSource.js for why we don't
//    trust atom:updated alone), so we bump dateModified to "now" (the time
//    we detected the change) while preserving the original pubDate and slug.
export async function upsertArticleFromMedium(raw) {
  const index = await readIndex();
  const existingEntry = index.find((entry) => entry.mediumId === raw.mediumId);
  // Hash the title alongside the body so a title-only edit (Medium allows
  // renaming a published story) is detected as a real change too, not
  // just body edits.
  const contentHash = hashContent(`${raw.title}::${raw.contentHtml || raw.description}`);
  const nowIso = new Date().toISOString();

  if (!existingEntry) {
    const slug = await generateUniqueSlug(raw.title, raw.mediumId, index);
    const article = buildArticleRecord({
      ...raw,
      slug,
      contentHash,
      dateModified: raw.pubDate,
      firstSeenAt: nowIso,
    });
    const kv = await getKv();
    await kv.set(articleKey(slug), article);
    await writeIndex([...index, toIndexEntry(article)]);
    return { status: "created", slug };
  }

  const existing = await getArticleBySlug(existingEntry.slug);
  if (existing && existing.contentHash === contentHash) {
    return { status: "unchanged", slug: existing.slug };
  }

  const dateModified = nowIso;
  const article = buildArticleRecord({
    ...raw,
    slug: existingEntry.slug,
    contentHash,
    dateModified,
    firstSeenAt: existing?.firstSeenAt || nowIso,
  });
  const kv = await getKv();
  await kv.set(articleKey(existingEntry.slug), article);
  await writeIndex(index.map((entry) => (entry.mediumId === raw.mediumId ? toIndexEntry(article) : entry)));
  return { status: existing ? "updated" : "repaired", slug: existingEntry.slug };
}
