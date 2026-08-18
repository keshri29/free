"use client";
import { useEffect } from "react";

// Fires exactly once per page load. Deduping against repeat views happens
// server-side (per visitor per day) in lib/blog/trending.js — this
// component only needs to make the request, nothing else.
export default function ViewTracker({ slug }) {
  useEffect(() => {
    fetch(`/api/blogs/${slug}/view`, { method: "POST", keepalive: true }).catch(() => {});
  }, [slug]);

  return null;
}
