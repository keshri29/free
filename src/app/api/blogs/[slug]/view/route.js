import { getArticleBySlug } from "@/lib/blog/store";
import { recordView } from "@/lib/blog/trending";

// Called once from the blog detail page on mount to register a page view
// for the real trending system (lib/blog/trending.js). Deduped per
// visitor-per-day server-side, no PII stored, no third-party analytics
// vendor involved.
export async function POST(request, { params }) {
  const { slug } = params;

  try {
    const article = await getArticleBySlug(slug);
    if (!article) {
      return Response.json({ success: false, error: "Not found" }, { status: 404 });
    }

    const result = await recordView(slug, request);
    return Response.json({ success: true, counted: result.counted });
  } catch (err) {
    console.error(`[api/blogs/${slug}/view] failed to record view:`, err);
    return Response.json({ success: false, error: "Could not record view" }, { status: 500 });
  }
}
