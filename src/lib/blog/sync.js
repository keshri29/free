import { getKv } from "./kv";
import { fetchMediumArticles } from "./mediumSource";
import { upsertArticleFromMedium } from "./store";
import { SYNC_STALE_MS } from "./config";

const SYNC_META_KEY = "blog:sync:meta:v1";
const SYNC_LOCK_KEY = "blog:sync:lock:v1";
const LOCK_TTL_SECONDS = 55;

export async function getSyncMeta() {
  const kv = await getKv();
  return (
    (await kv.get(SYNC_META_KEY)) || {
      lastSyncAt: null,
      lastSuccessAt: null,
      lastError: null,
      created: 0,
      updated: 0,
      unchanged: 0,
    }
  );
}

async function setSyncMeta(patch) {
  const kv = await getKv();
  const current = await getSyncMeta();
  await kv.set(SYNC_META_KEY, { ...current, ...patch });
}

// Fetches the Medium feed and upserts every item into the KV archive.
// Guarded by a short-lived NX lock so concurrent requests (e.g. several
// cold-start lambdas noticing stale data at once) don't all hit Medium and
// write at the same time. Errors are recorded but re-thrown so callers can
// decide whether to fall back to previously stored data.
export async function syncMediumArticles({ force = false } = {}) {
  const kv = await getKv();

  if (!force) {
    const acquired = await kv.set(SYNC_LOCK_KEY, "1", { nx: true, ex: LOCK_TTL_SECONDS });
    if (!acquired) {
      return { status: "skipped", reason: "sync already in progress" };
    }
  }

  try {
    const rawItems = await fetchMediumArticles();
    const results = [];
    for (const raw of rawItems) {
      results.push(await upsertArticleFromMedium(raw));
    }

    const created = results.filter((r) => r.status === "created").length;
    const updated = results.filter((r) => r.status === "updated" || r.status === "repaired").length;
    const unchanged = results.filter((r) => r.status === "unchanged").length;

    await setSyncMeta({
      lastSyncAt: new Date().toISOString(),
      lastSuccessAt: new Date().toISOString(),
      lastError: null,
      created,
      updated,
      unchanged,
      itemsSeen: rawItems.length,
    });

    return { status: "ok", created, updated, unchanged, itemsSeen: rawItems.length };
  } catch (err) {
    await setSyncMeta({ lastSyncAt: new Date().toISOString(), lastError: err.message });
    throw err;
  } finally {
    if (!force) await kv.del(SYNC_LOCK_KEY);
  }
}

// Triggers a sync only if the stored data is older than SYNC_STALE_MS, and
// never lets a Medium/network failure bubble up to the caller — the whole
// point is that a transient Medium outage should never blank out the blog,
// it should just mean we briefly serve last-known-good data. Callers that
// want to surface sync problems should read getSyncMeta().lastError.
export async function syncIfStale() {
  const meta = await getSyncMeta();
  const lastSyncAt = meta.lastSyncAt ? new Date(meta.lastSyncAt).getTime() : 0;
  if (Date.now() - lastSyncAt < SYNC_STALE_MS) {
    return { status: "fresh" };
  }
  try {
    return await syncMediumArticles();
  } catch (err) {
    console.error("[blog:sync] Medium sync failed, serving last-known-good data:", err.message);
    return { status: "error", error: err.message };
  }
}
