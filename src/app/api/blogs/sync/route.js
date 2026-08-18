import { syncMediumArticles } from "@/lib/blog/sync";
import { CRON_SECRET } from "@/lib/blog/config";

// Triggered by Vercel Cron (see vercel.json) on a fixed schedule, so new and
// edited Medium posts get picked up even if the site has no visitors to
// trigger the on-demand syncIfStale() path. Vercel automatically attaches
// `Authorization: Bearer <CRON_SECRET>` to cron requests when CRON_SECRET is
// set as a project env var — see the Vercel Cron Jobs docs.
function isAuthorized(request) {
  if (!CRON_SECRET) return true; // no secret configured yet — allow (dev/local)
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${CRON_SECRET}`;
}

async function handleSync(request) {
  if (!isAuthorized(request)) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncMediumArticles({ force: true });
    return Response.json({ success: true, ...result });
  } catch (err) {
    console.error("[api/blogs/sync] sync failed:", err);
    return Response.json({ success: false, error: err.message }, { status: 502 });
  }
}

export async function GET(request) {
  return handleSync(request);
}

export async function POST(request) {
  return handleSync(request);
}
