import Link from "next/link";
import Image from "next/image";
import styles from "./ArticleCard.module.scss";
import { formatDate } from "./format";

export default function ArticleCard({ article, featured = false, priority = false }) {
  const wrapperClass = featured ? `${styles.card} ${styles.featured}` : styles.card;

  return (
    <article className={wrapperClass}>
      <Link href={`/blog/${article.slug}`} className={styles.cardLink}>
        <div className={featured ? styles.featuredImage : styles.cardImage}>
          {article.thumbnail ? (
            <Image
              src={article.thumbnail}
              alt={article.title}
              fill
              sizes={featured ? "(max-width: 900px) 100vw, 50vw" : "(max-width: 600px) 100vw, 33vw"}
              style={{ objectFit: "cover" }}
              priority={priority}
            />
          ) : (
            <div className={styles.imagePlaceholder} aria-hidden="true">
              <span>{article.category?.[0] || "✍"}</span>
            </div>
          )}
        </div>

        <div className={styles.cardContent}>
          {featured && <span className={styles.featuredBadge}>Featured Article</span>}

          <div className={styles.cardMeta}>
            <span className={styles.category}>{article.category}</span>
            <span className={styles.dot}>•</span>
            <time dateTime={article.pubDate}>{formatDate(article.pubDate)}</time>
            <span className={styles.dot}>•</span>
            <span>{article.readingTimeMinutes} min read</span>
          </div>

          <h2 className={featured ? styles.featuredTitle : styles.cardTitle}>{article.title}</h2>
          <p className={styles.cardExcerpt}>{article.excerpt}</p>

          <div className={styles.cardFooter}>
            {article.author && <span className={styles.author}>{article.author}</span>}
            <span className={styles.readMore}>
              Read article
              <span aria-hidden="true"> →</span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
