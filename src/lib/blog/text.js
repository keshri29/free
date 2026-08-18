import { toPlainText } from "./sanitize";

export function computeExcerpt(html, description, maxLen = 200) {
  const plain = toPlainText(description) || toPlainText(html);
  if (!plain) return "";
  if (plain.length <= maxLen) return plain;
  const truncated = plain.slice(0, maxLen);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : maxLen).trim()}…`;
}

const WORDS_PER_MINUTE = 220;

export function computeReadingStats(html) {
  const plain = toPlainText(html);
  const wordCount = plain ? plain.split(/\s+/).filter(Boolean).length : 0;
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
  return { wordCount, readingTimeMinutes };
}

// Meta descriptions should be informative but not truncated mid-sentence by
// Google (~155-160 chars is the safe zone before it gets cut/rewritten).
export function computeMetaDescription(excerpt, title) {
  const source = excerpt || title || "";
  if (source.length <= 160) return source;
  const truncated = source.slice(0, 157);
  const lastSpace = truncated.lastIndexOf(" ");
  return `${truncated.slice(0, lastSpace > 0 ? lastSpace : 157).trim()}...`;
}
