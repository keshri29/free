import Link from "next/link";
import styles from "./not-found.module.scss";

export default function ArticleNotFound() {
  return (
    <div className={styles.container}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Article not found</h1>
      <p className={styles.subtitle}>
        This article may have been renamed, unpublished, or the link is out of date.
      </p>
      <Link href="/blog" className={styles.cta}>
        Back to all articles →
      </Link>
    </div>
  );
}
