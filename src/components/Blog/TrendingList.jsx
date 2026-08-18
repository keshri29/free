import Link from "next/link";
import styles from "./TrendingList.module.scss";

// A compact, tasteful list — not another row of cards. Ranking comes from
// lib/blog/trending.js's real view/recency score; there is nothing fake to
// dress up here, so the UI stays plain on purpose.
export default function TrendingList({ articles }) {
  if (!articles?.length) return null;

  return (
    <section className={styles.trending} aria-labelledby="trending-heading">
      <h2 id="trending-heading" className={styles.heading}>Trending</h2>
      <ol className={styles.list}>
        {articles.map((article, i) => (
          <li key={article.slug} className={styles.item}>
            <Link href={`/blog/${article.slug}`} className={styles.row}>
              <span className={styles.index}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.title}>{article.title}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
