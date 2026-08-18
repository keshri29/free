import { getAllArticleMeta } from "@/lib/blog/store";
import { SITE_URL, MIN_INDEXABLE_WORDS } from "@/lib/blog/config";

// Next.js App Router native sitemap (served at /sitemap.xml). Static
// routes are always included; blog articles are pulled live from the KV
// store so newly synced/edited posts show up without a redeploy, and thin
// (near-empty) articles are excluded rather than indexed.
export default async function sitemap() {
  const staticRoutes = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact-us`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.9 },
  ];

  let articleRoutes = [];
  try {
    const meta = await getAllArticleMeta();
    articleRoutes = meta
      .filter((entry) => (entry.wordCount ?? 0) >= MIN_INDEXABLE_WORDS)
      .map((entry) => ({
        url: `${SITE_URL}/blog/${entry.slug}`,
        lastModified: entry.dateModified,
        changeFrequency: "weekly",
        priority: 0.8,
      }));
  } catch (err) {
    console.error("[sitemap] failed to load blog articles, serving static routes only:", err);
  }

  return [...staticRoutes, ...articleRoutes];
}
