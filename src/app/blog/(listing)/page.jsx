import styles from "./page.module.scss";
import { getArticles, getAllCategories } from "@/lib/blog/store";
import { getTrendingArticles } from "@/lib/blog/trending";
import { syncIfStale, getSyncMeta } from "@/lib/blog/sync";
import { buildBreadcrumbJsonLd, buildItemListJsonLd } from "@/lib/blog/seo";
import { SITE_URL, MEDIUM_PROFILE_URL, TRENDING_ARTICLES_LIMIT } from "@/lib/blog/config";
import BlogNav from "@/components/Blog/BlogNav";
import ArticleCard from "@/components/Blog/ArticleCard";
import TrendingList from "@/components/Blog/TrendingList";
import Breadcrumbs from "@/components/Blog/Breadcrumbs";
import Pagination from "@/components/Blog/Pagination";
import Link from "next/link";

// Time-based revalidation for the rendered page output. Actual content
// freshness is governed independently by lib/blog/sync.js (SYNC_STALE_MS)
// and the hourly Vercel Cron — this just bounds how long a cached render
// of this page can be served before Next re-renders it.
export const revalidate = 300;

function parsePage(searchParams) {
  const page = parseInt(searchParams?.page || "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

function buildQueryString({ page, category }) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (category) params.set("category", category);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function generateMetadata({ searchParams }) {
  const page = parsePage(searchParams);
  const category = searchParams?.category || undefined;
  const title = category ? `${category} articles` : "Writing & Articles";
  const description =
    "Practical articles and engineering write-ups on building, shipping, and debugging real software — synced from Medium.";
  const path = `/blog${buildQueryString({ page, category })}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogListingPage({ searchParams }) {
  const page = parsePage(searchParams);
  const category = searchParams?.category || undefined;

  await syncIfStale();

  const [{ articles, total, totalPages, page: safePage }, categories, meta] = await Promise.all([
    getArticles({ page, category }),
    getAllCategories(),
    getSyncMeta(),
  ]);

  const isFirstPage = safePage === 1 && !category;
  const featuredArticle = isFirstPage && articles.length > 0 ? articles[0] : null;
  const gridArticles = featuredArticle ? articles.slice(1) : articles;

  const trending = isFirstPage && total > 0 ? await getTrendingArticles(TRENDING_ARTICLES_LIMIT) : [];
  const trendingList = trending.filter((a) => a.slug !== featuredArticle?.slug);

  const neverSynced = total === 0 && !meta.lastSuccessAt;
  const showStaleBanner = Boolean(meta.lastError) && total > 0;

  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
  ];

  const jsonLd = [buildBreadcrumbJsonLd(breadcrumbItems)];
  if (articles.length) jsonLd.push(buildItemListJsonLd(articles.map((a) => ({ slug: a.slug, title: a.title }))));

  return (
    <div className={styles.container}>
      {jsonLd.map((ld, i) => (
         <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      ))}

      <BlogNav />

      <header className={styles.header}>
        <div className={styles.inner}>
          <div className={styles.breadcrumbRow}>
            <Breadcrumbs items={breadcrumbItems} />
          </div>

          {category ? (
            <>
              <p className={styles.eyebrow}>Category</p>
              <h1 className={styles.heroTitle}>{category}</h1>
              <p className={styles.subtitle}>Articles filed under &ldquo;{category}.&rdquo;</p>
            </>
          ) : (
            <>
              <p className={styles.eyebrow}>Writing</p>
              <h1 className={styles.heroTitle}>
                <span className={styles.heroLine}>Thoughts &amp;</span>
                <span className={styles.heroLine}>Articles</span>
              </h1>
              <p className={styles.subtitle}>
                Ideas, tutorials, experiments, and lessons from building software.
              </p>
            </>
          )}
        </div>
      </header>

      <section className={styles.blogSection}>
        <div className={styles.inner}>
          {showStaleBanner && (
            <p className={styles.staleBanner} role="status">
              Couldn&apos;t check Medium for new articles just now — showing the most recently saved ones.
            </p>
          )}

          {neverSynced && (
            <div className={styles.errorState}>
              <span className={styles.stateIcon} aria-hidden="true">⚠</span>
              <p>Couldn&apos;t load articles right now. Please try again shortly.</p>
              <a href={MEDIUM_PROFILE_URL} target="_blank" rel="noopener noreferrer" className={styles.mediumLink}>
                Visit Medium profile →
              </a>
            </div>
          )}

          {!neverSynced && total === 0 && (
            <div className={styles.emptyState}>
              <span className={styles.stateIcon} aria-hidden="true">✍</span>
              <p>No articles yet — check back soon.</p>
            </div>
          )}

          {featuredArticle && (
            <div className={styles.featuredSection}>
              <ArticleCard article={featuredArticle} featured priority />
            </div>
          )}

          {(trendingList.length > 0 || categories.length > 0) && (
            <div className={styles.utilityRow}>
              {trendingList.length > 0 && <TrendingList articles={trendingList} />}

              {categories.length > 0 && (
                <div className={styles.categoryFilters}>
                  <Link href="/blog" className={!category ? styles.categoryActive : styles.category}>
                    All
                  </Link>
                  {categories.map((c) => (
                    <Link
                      key={c}
                      href={`/blog?category=${encodeURIComponent(c)}`}
                      className={category === c ? styles.categoryActive : styles.category}
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {gridArticles.length > 0 && (
            <div className={styles.gridSection}>
              {featuredArticle && <h2 className={styles.sectionLabel}>Latest articles</h2>}
              <div className={styles.grid}>
                {gridArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </div>
          )}

          <Pagination basePath="/blog" page={safePage} totalPages={totalPages} category={category} />

          <div className={styles.mediumCta}>
            <a href={MEDIUM_PROFILE_URL} target="_blank" rel="noopener noreferrer">
              Explore all articles on Medium →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
