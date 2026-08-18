import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.scss";
import { getArticleBySlug, getRelatedArticles } from "@/lib/blog/store";
import { syncIfStale } from "@/lib/blog/sync";
import { articleUrl, buildArticleJsonLd, buildBreadcrumbJsonLd, absoluteImageUrl } from "@/lib/blog/seo";
import { SITE_URL, MIN_INDEXABLE_WORDS, RELATED_ARTICLES_LIMIT } from "@/lib/blog/config";
import { computeMetaDescription } from "@/lib/blog/text";
import { formatDate, isMeaningfullyUpdated } from "@/components/Blog/format";
import BlogNav from "@/components/Blog/BlogNav";
import ArticleCard from "@/components/Blog/ArticleCard";
import Breadcrumbs from "@/components/Blog/Breadcrumbs";
import TableOfContents from "@/components/Blog/TableOfContents";
import ViewTracker from "@/components/Blog/ViewTracker";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    return { title: "Article not found", robots: { index: false, follow: true } };
  }

  const description = computeMetaDescription(article.excerpt, article.title);
  const url = articleUrl(article.slug);
  const image = absoluteImageUrl(article.thumbnail);
  const isThin = article.wordCount < MIN_INDEXABLE_WORDS;

  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    robots: isThin ? { index: false, follow: true } : { index: true, follow: true },
    authors: article.author ? [{ name: article.author }] : undefined,
    keywords: article.categories?.length ? article.categories : undefined,
    openGraph: {
      type: "article",
      title: article.title,
      description,
      url,
      publishedTime: article.pubDate,
      modifiedTime: article.dateModified,
      authors: article.author ? [article.author] : undefined,
      tags: article.categories,
      images: image ? [{ url: image, width: 1200, height: 630, alt: article.title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: article.title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ArticlePage({ params }) {
  await syncIfStale();
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  const related = await getRelatedArticles(params.slug, {
    categories: article.categories,
    limit: RELATED_ARTICLES_LIMIT,
  });

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: article.title, url: articleUrl(article.slug) },
  ];

  const jsonLd = [buildArticleJsonLd(article), buildBreadcrumbJsonLd(breadcrumbItems)];
  const wasUpdated = isMeaningfullyUpdated(article.pubDate, article.dateModified);

  return (
    <div className={styles.container}>
      <ViewTracker slug={article.slug} />

      {jsonLd.map((ld, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}

      <BlogNav />

      <article className={styles.article}>
        <div className={styles.breadcrumbRow}>
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        <header className={styles.articleHeader}>
          <span className={styles.category}>{article.category}</span>
          <h1 className={styles.title}>{article.title}</h1>
          <div className={styles.byline}>
            {article.author && <span className={styles.author}>{article.author}</span>}
            {article.author && <span className={styles.sep}>·</span>}
            <time dateTime={article.pubDate}>{formatDate(article.pubDate)}</time>
            {wasUpdated && (
              <>
                <span className={styles.sep}>·</span>
                <span>Updated {formatDate(article.dateModified)}</span>
              </>
            )}
            <span className={styles.sep}>·</span>
            <span>{article.readingTimeMinutes} min read</span>
          </div>
        </header>

        {article.thumbnail && (
          <div className={styles.coverImage}>
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              sizes="(max-width: 900px) 100vw, 900px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        )}

        <div className={styles.layout}>
          <div
            className={styles.content}
            // Content is sanitized server-side before ever reaching the
            // database — see lib/blog/sanitize.js. This is the only place
            // on the site that renders third-party-sourced HTML.
            dangerouslySetInnerHTML={{ __html: article.contentHtml }}
          />

          {article.headings.length >= 3 && (
            <aside className={styles.sidebar}>
              <TableOfContents headings={article.headings} />
            </aside>
          )}
        </div>

        {article.categories.length > 0 && (
          <div className={styles.tags}>
            {article.categories.map((c) => (
              <Link key={c} href={`/blog?category=${encodeURIComponent(c)}`} className={styles.tag}>
                {c}
              </Link>
            ))}
          </div>
        )}

        <p className={styles.attribution}>
          Originally published on{" "}
          <a href={article.link} target="_blank" rel="noopener noreferrer">
            Medium
          </a>
          .
        </p>
      </article>

      {related.length > 0 && (
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedHeading}>Related articles</h2>
          <div className={styles.relatedGrid}>
            {related.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
