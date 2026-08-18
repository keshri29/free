export function slugify(input) {
  return (input || "")
    .toString()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritics left by NFKD
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Slugs are derived once at first ingestion and never regenerated from the
// title again, even if the Medium title is later edited — this keeps blog
// URLs permanent (requirement: "clean, permanent URLs/slugs") while still
// being human-readable. The trailing mediumId fragment guarantees
// uniqueness without a counter suffix.
export function buildPermanentSlug(title, mediumId) {
  const base = slugify(title).slice(0, 70).replace(/-$/, "");
  const suffix = mediumId.slice(-8);
  return base ? `${base}-${suffix}` : suffix;
}
