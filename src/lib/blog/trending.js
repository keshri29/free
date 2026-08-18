import crypto from "node:crypto";
import { getKv } from "./kv";
import { getAllArticleMeta, getArticleBySlug } from "./store";
import { TRENDING_WEIGHTS, TRENDING_ARTICLES_LIMIT } from "./config";

const VIEW_DEDUPE_TTL_SECONDS = 60 * 60 * 26; // ~1 day, with slack for clock skew

function totalViewsKey(slug) {
  return `blog:views:total:v1:${slug}`;
}

function dayViewsKey(slug, dateKey) {
  return `blog:views:day:v1:${slug}:${dateKey}`;
}

function seenKey(slug, dateKey, fingerprint) {
  return `blog:views:seen:v1:${slug}:${dateKey}:${fingerprint}`;
}

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

// No PII is stored: the visitor identity is a one-way hash of IP + user
// agent + day, kept only long enough to dedupe same-day repeat views.
function fingerprint(request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const ua = request.headers.get("user-agent") || "unknown";
  return crypto.createHash("sha256").update(`${ip}::${ua}`).digest("hex").slice(0, 24);
}

// Records one view for `slug`, deduped per visitor per day so refreshes and
// bot retries don't inflate counts. Returns whether the view was counted.
export async function recordView(slug, request) {
  const kv = await getKv();
  const dateKey = todayKey();
  const fp = fingerprint(request);
  const dedupeKey = seenKey(slug, dateKey, fp);

  const isFirstViewToday = await kv.set(dedupeKey, "1", { nx: true, ex: VIEW_DEDUPE_TTL_SECONDS });
  if (!isFirstViewToday) return { counted: false };

  await kv.incr(totalViewsKey(slug));
  await kv.incr(dayViewsKey(slug, dateKey));
  return { counted: true };
}

async function getTotalViews(kv, slug) {
  return Number(await kv.get(totalViewsKey(slug))) || 0;
}

async function getRecentViews(kv, slug, windowDays) {
  const now = new Date();
  let sum = 0;
  for (let i = 0; i < windowDays; i += 1) {
    const date = new Date(now.getTime() - i * 86400000);
    sum += Number(await kv.get(dayViewsKey(slug, todayKey(date)))) || 0;
  }
  return sum;
}

export async function getArticleStats(slug) {
  const kv = await getKv();
  const [totalViews, recentViews] = await Promise.all([
    getTotalViews(kv, slug),
    getRecentViews(kv, slug, TRENDING_WEIGHTS.recentWindowDays),
  ]);
  return { totalViews, recentViews };
}

// A transparent, inspectable trending score — not a black box and not
// fabricated. It blends three real signals:
//  - recentViews:   genuine traffic in the last N days (weighted highest)
//  - totalViews:    lifetime genuine traffic (weighted lower, avoids one
//                    old viral post permanently crowding out new work)
//  - recencyBoost:  an exponential decay from publish date, so a brand-new
//                    post with zero views yet still gets a fair, temporary
//                    chance to surface instead of being stuck at zero.
// With little or no traffic yet (a fresh site), the list is effectively
// recency-ordered — that's an honest reflection of the data, not a fake
// "trending" label.
function computeScore({ recentViews, totalViews, pubDateMs }) {
  const ageDays = Math.max(0, (Date.now() - pubDateMs) / 86400000);
  const recencyBoost = Math.exp((-ageDays * Math.LN2) / TRENDING_WEIGHTS.recencyHalfLifeDays);
  return (
    recentViews * TRENDING_WEIGHTS.recentViews +
    totalViews * TRENDING_WEIGHTS.totalViews +
    recencyBoost * TRENDING_WEIGHTS.recencyBoost
  );
}

export async function getTrendingArticles(limit = TRENDING_ARTICLES_LIMIT) {
  const kv = await getKv();
  const meta = await getAllArticleMeta();

  const scored = await Promise.all(
    meta.map(async (entry) => {
      const [totalViews, recentViews] = await Promise.all([
        getTotalViews(kv, entry.slug),
        getRecentViews(kv, entry.slug, TRENDING_WEIGHTS.recentWindowDays),
      ]);
      const score = computeScore({ recentViews, totalViews, pubDateMs: entry.pubDateMs });
      return { entry, score };
    })
  );

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.entry);
}

export async function getPopularSlugsExcluding(slug, limit) {
  const trending = await getTrendingArticles(limit + 1);
  return trending.filter((entry) => entry.slug !== slug).slice(0, limit);
}
