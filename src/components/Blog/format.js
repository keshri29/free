export function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function isMeaningfullyUpdated(pubDate, dateModified) {
  if (!dateModified || !pubDate) return false;
  return new Date(dateModified).getTime() - new Date(pubDate).getTime() > 1000 * 60 * 60 * 24; // >1 day
}
