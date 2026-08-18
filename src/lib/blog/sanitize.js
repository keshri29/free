import sanitizeHtml from "sanitize-html";
import { slugify } from "./slug";

// Hosts we trust enough to allow as <iframe> embeds (common Medium embeds).
// Everything else is stripped rather than rendered, since an arbitrary
// iframe src is a real XSS/clickjacking surface for content we don't author.
const ALLOWED_IFRAME_HOSTS = [
  "www.youtube.com",
  "youtube.com",
  "player.vimeo.com",
  "gist.github.com",
  "codesandbox.io",
  "codepen.io",
  "cdn.embedly.com",
];

function isAllowedIframeSrc(src) {
  try {
    const url = new URL(src);
    return ALLOWED_IFRAME_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}

const BASE_OPTIONS = {
  allowedTags: [
    "p", "br", "hr", "blockquote", "pre", "code",
    "h1", "h2", "h3", "h4",
    "ul", "ol", "li",
    "strong", "b", "em", "i", "u", "s", "mark", "sub", "sup",
    "a", "img", "figure", "figcaption",
    "table", "thead", "tbody", "tr", "th", "td",
    "iframe", "span",
  ],
  allowedAttributes: {
    a: ["href", "name", "rel", "target"],
    img: ["src", "alt", "width", "height", "loading"],
    iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen", "loading", "sandbox"],
    span: ["class"],
    code: ["class"],
    pre: ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
  transformTags: {
    a: (tagName, attribs) => ({
      tagName: "a",
      attribs: {
        ...attribs,
        rel: "noopener noreferrer",
        ...(attribs.href?.startsWith("http") ? { target: "_blank" } : {}),
      },
    }),
    img: (tagName, attribs) => ({
      tagName: "img",
      attribs: { ...attribs, loading: "lazy" },
    }),
    iframe: (tagName, attribs) => {
      if (!attribs.src || !isAllowedIframeSrc(attribs.src)) {
        return { tagName: "span", attribs: {}, text: "" };
      }
      return {
        tagName: "iframe",
        attribs: { ...attribs, loading: "lazy", sandbox: "allow-scripts allow-same-origin allow-popups" },
      };
    },
  },
  exclusiveFilter: (frame) => frame.tag === "iframe" && !frame.attribs.src,
};

// Sanitizes raw Medium content:encoded HTML for safe rendering on our own
// pages. This is the only place untrusted third-party markup is allowed
// into the DOM, so it stays deliberately conservative (no scripts, no
// arbitrary iframes, no inline event handlers/styles).
export function sanitizeArticleHtml(html) {
  if (!html) return "";
  const clean = sanitizeHtml(html, BASE_OPTIONS);
  return addHeadingIds(clean);
}

// Gives every h2/h3 a stable, slug-based id so the table of contents and
// "jump to section" internal links have something to anchor to.
export function addHeadingIds(html) {
  const seen = new Map();
  return html.replace(/<(h[23])>([\s\S]*?)<\/\1>/g, (match, tag, inner) => {
    const text = inner.replace(/<[^>]+>/g, "").trim();
    let id = slugify(text) || tag;
    const count = seen.get(id) || 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;
    return `<${tag} id="${id}">${inner}</${tag}>`;
  });
}

export function extractHeadings(html) {
  const headings = [];
  const regex = /<(h[23]) id="([^"]+)">([\s\S]*?)<\/\1>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: match[1] === "h2" ? 2 : 3,
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, "").trim(),
    });
  }
  return headings;
}

export function toPlainText(html) {
  if (!html) return "";
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}
