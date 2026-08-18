import { getArticles } from "@/lib/blog/store";
import { syncIfStale, getSyncMeta } from "@/lib/blog/sync";
import { articleUrl } from "@/lib/blog/seo";
import { ARTICLES_PER_PAGE, MEDIUM_PROFILE_URL } from "@/lib/blog/config";

// Public read API for the blog archive. Reads are always served from the
// KV-backed store (fast, and immune to Medium being temporarily down); a
// sync against Medium is only kicked off when the stored data is older
// than SYNC_STALE_MS, and a sync failure never blanks the response — it
// just means we serve the last-known-good data (see lib/blog/sync.js).
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || String(ARTICLES_PER_PAGE), 10) || ARTICLES_PER_PAGE));
    const category = searchParams.get("category") || undefined;

    const syncResult = await syncIfStale();
    const { articles, total, totalPages } = await getArticles({ page, limit, category });
    const meta = await getSyncMeta();

    const items = articles.map((entry) => ({
      slug: entry.slug,
      title: entry.title,
      url: articleUrl(entry.slug),
      mediumUrl: entry.link,
      excerpt: entry.excerpt,
      thumbnail: entry.thumbnail,
      author: entry.author,
      category: entry.category,
      categories: entry.categories,
      pubDate: entry.pubDate,
      dateModified: entry.dateModified,
      readingTimeMinutes: entry.readingTimeMinutes,
    }));

    return Response.json({
      success: true,
      items,
      page,
      totalPages,
      total,
      sync: { status: syncResult.status, lastSuccessAt: meta.lastSuccessAt, lastError: meta.lastError },
    });
  } catch (err) {
    console.error("[api/blogs] failed to read blog archive:", err);
    return Response.json(
      {
        success: false,
        items: [],
        error: "Could not load articles right now.",
        mediumProfileUrl: MEDIUM_PROFILE_URL,
      },
      { status: 500 }
    );
  }
}
