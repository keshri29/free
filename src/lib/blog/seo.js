import { SITE_URL, SITE_NAME, MEDIUM_PROFILE_URL } from "./config";

export function articleUrl(slug) {
  return `${SITE_URL}/blog/${slug}`;
}

export function absoluteImageUrl(src) {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  return `${SITE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
}

export function buildOrganizationJsonLd() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
  };
}

// Note: no "@context" here — this is meant to be embedded inside the
// root layout's single "@graph" JSON-LD block, not served standalone.
export function buildWebsiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function buildPersonJsonLd(authorName) {
  if (!authorName) return null;
  return {
    "@type": "Person",
    name: authorName,
    url: MEDIUM_PROFILE_URL,
  };
}

export function buildBreadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Only real, article-derived data goes into this JSON-LD — no fabricated
// ratings, fake engagement counts, or invented fields. Anything Medium
// doesn't give us reliably (see mediumSource.js) is simply omitted.
export function buildArticleJsonLd(article) {
  const image = absoluteImageUrl(article.thumbnail);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl(article.slug)}#article`,
    mainEntityOfPage: articleUrl(article.slug),
    headline: article.title,
    description: article.excerpt,
    ...(image ? { image: [image] } : {}),
    datePublished: article.pubDate,
    dateModified: article.dateModified,
    ...(article.author
      ? { author: { "@type": "Person", name: article.author, url: MEDIUM_PROFILE_URL } }
      : {}),
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(article.categories?.length ? { keywords: article.categories.join(", ") } : {}),
    articleSection: article.category,
    wordCount: article.wordCount,
    url: articleUrl(article.slug),
    isAccessibleForFree: true,
  };
}

export function buildItemListJsonLd(articles) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: articles.map((article, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: articleUrl(article.slug),
      name: article.title,
    })),
  };
}
