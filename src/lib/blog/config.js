// Central configuration for the Medium-backed blog system.
// Keep every tunable in one place so the sync/trending/SEO code stays consistent.

// IMPORTANT: set NEXT_PUBLIC_SITE_URL to your real production domain.
// It backs canonical URLs, sitemap.xml, robots.txt, and JSON-LD — all of
// which are wrong (and can hurt SEO) if left on the placeholder below.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://example.com").replace(/\/$/, "");

export const SITE_NAME = "Anurag Keshri";

export const MEDIUM_USERNAME = process.env.MEDIUM_USERNAME || "keshrianurag690";

export const MEDIUM_FEED_URL =
  process.env.MEDIUM_FEED_URL || `https://medium.com/feed/@${MEDIUM_USERNAME}`;

export const MEDIUM_PROFILE_URL = `https://medium.com/@${MEDIUM_USERNAME}`;

// Medium's public RSS feed only ever returns the ~10 most recent stories and
// exposes no page parameter. We treat every fetch as a delta against our own
// accumulated archive rather than a full listing — see src/lib/blog/sync.js.
export const MEDIUM_FETCH_TIMEOUT_MS = 8000;
export const MEDIUM_FETCH_RETRIES = 2;

// How long the read path (`GET /api/blogs`, blog pages) will serve stored
// articles before kicking off a background re-sync against Medium.
export const SYNC_STALE_MS = 10 * 60 * 1000; // 10 minutes

// ISR revalidation window for the blog listing/detail pages themselves.
export const PAGE_REVALIDATE_SECONDS = 300;

export const ARTICLES_PER_PAGE = 9;

export const RELATED_ARTICLES_LIMIT = 3;
export const TRENDING_ARTICLES_LIMIT = 5;

// Trending score weights — deliberately simple and inspectable, see
// src/lib/blog/trending.js for the full formula and reasoning.
export const TRENDING_WEIGHTS = {
  recentViews: 5,
  totalViews: 1,
  recencyBoost: 20,
  recencyHalfLifeDays: 14,
  recentWindowDays: 7,
};

export const CRON_SECRET = process.env.CRON_SECRET || "";

// Articles below this word count are treated as thin content: excluded
// from the sitemap and marked noindex on their own page, per requirement
// "prevent thin or empty pages from being indexed".
export const MIN_INDEXABLE_WORDS = 100;
