// Thin storage abstraction over Vercel KV / Upstash Redis, with a fallback
// for when no KV store is attached yet.
//
// Only the small subset of Redis semantics the blog system actually needs
// is exposed: get/set (with nx/ex), del and incr. This keeps the real and
// fallback backends trivially interchangeable.
//
// Server-only module (route handlers / server components import it, never
// client components), so importing Node's fs/path at the top is safe.
import path from "node:path";
import fs from "node:fs";

let cachedClient = null;

function hasVercelKvEnv() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function isServerlessRuntime() {
  // Vercel (and most serverless hosts) sets VERCEL=1; the deployed bundle's
  // filesystem is read-only outside of /tmp, so a persistent-looking file
  // fallback there would be actively misleading. Use a plain in-memory
  // store in that case and rely on the documented limitation instead.
  return Boolean(process.env.VERCEL);
}

function liveEntry(store, key) {
  const entry = store[key];
  if (!entry) return undefined;
  if (entry.expiresAt && entry.expiresAt <= Date.now()) {
    delete store[key];
    return undefined;
  }
  return entry;
}

function createInMemoryClient() {
  const store = {};
  return {
    backend: "memory",
    async get(key) {
      const entry = liveEntry(store, key);
      return entry ? entry.value : null;
    },
    async set(key, value, opts = {}) {
      if (opts.nx && liveEntry(store, key) !== undefined) return null;
      store[key] = { value, expiresAt: opts.ex ? Date.now() + opts.ex * 1000 : null };
      return "OK";
    },
    async del(key) {
      const existed = key in store;
      delete store[key];
      return existed ? 1 : 0;
    },
    async incr(key) {
      const current = Number(liveEntry(store, key)?.value) || 0;
      const next = current + 1;
      store[key] = { value: next, expiresAt: store[key]?.expiresAt ?? null };
      return next;
    },
  };
}

// Local-dev-only fallback: persists to a JSON file on disk instead of a
// bare in-memory Map. This matters because Next.js dev bundles pages and
// route handlers as separate module graphs, so a plain module-level Map
// does NOT stay in sync between e.g. /blog and /blog/[slug] — reading and
// writing a shared file on every call sidesteps that and lets the whole
// listing -> detail -> view-count flow be tested locally without Upstash.
// Never used in a serverless deployment (see isServerlessRuntime above);
// still resets if you delete .data/, and is not concurrency-safe, but
// neither property matters for single-developer local testing.
function createFileBackedClient() {
  const dataFile = path.join(process.cwd(), ".data", "blog-store.dev.json");

  function load() {
    try {
      return JSON.parse(fs.readFileSync(dataFile, "utf8"));
    } catch {
      return {};
    }
  }

  function save(store) {
    try {
      fs.mkdirSync(path.dirname(dataFile), { recursive: true });
      fs.writeFileSync(dataFile, JSON.stringify(store));
    } catch (err) {
      console.warn("[blog:kv] could not persist dev fallback store:", err.message);
    }
  }

  return {
    backend: "file-dev-fallback",
    async get(key) {
      const entry = liveEntry(load(), key);
      return entry ? entry.value : null;
    },
    async set(key, value, opts = {}) {
      const store = load();
      if (opts.nx && liveEntry(store, key) !== undefined) return null;
      store[key] = { value, expiresAt: opts.ex ? Date.now() + opts.ex * 1000 : null };
      save(store);
      return "OK";
    },
    async del(key) {
      const store = load();
      const existed = key in store;
      delete store[key];
      save(store);
      return existed ? 1 : 0;
    },
    async incr(key) {
      const store = load();
      const current = Number(liveEntry(store, key)?.value) || 0;
      const next = current + 1;
      store[key] = { value: next, expiresAt: store[key]?.expiresAt ?? null };
      save(store);
      return next;
    },
  };
}

// Uses @upstash/redis directly (the actively maintained client) rather
// than the now-deprecated @vercel/kv package. It talks to the same REST
// API that Vercel's KV / Marketplace Redis integration provisions, so the
// KV_REST_API_URL / KV_REST_API_TOKEN env vars still apply unchanged.
async function createVercelKvClient() {
  const { Redis } = await import("@upstash/redis");
  const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
  return {
    backend: "upstash-redis",
    get: (key) => redis.get(key),
    set: (key, value, opts = {}) => {
      const redisOpts = {};
      if (opts.nx) redisOpts.nx = true;
      if (opts.ex) redisOpts.ex = opts.ex;
      return redis.set(key, value, redisOpts);
    },
    del: (key) => redis.del(key),
    incr: (key) => redis.incr(key),
  };
}

// Lazily resolved because the KV client's own construction reads env vars
// at import time; deferring avoids build-time failures when no KV store
// has been attached yet.
export async function getKv() {
  if (cachedClient) return cachedClient;
  if (hasVercelKvEnv()) {
    cachedClient = await createVercelKvClient();
  } else {
    cachedClient = isServerlessRuntime() ? createInMemoryClient() : createFileBackedClient();
  }
  return cachedClient;
}

export function isPersistentKvConfigured() {
  return hasVercelKvEnv();
}
