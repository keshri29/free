import Link from "next/link";
import styles from "./Pagination.module.scss";

function pageHref(basePath, page, category) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (category) params.set("category", category);
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

// Fully server-rendered pagination (plain <Link>s) — no client JS required,
// so it works with JS disabled and never blocks crawlers from reaching
// older/newer pages.
export default function Pagination({ basePath, page, totalPages, category }) {
  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <nav className={styles.pagination} aria-label="Blog pagination">
      {prevDisabled ? (
        <span className={styles.disabled}>← Newer</span>
      ) : (
        <Link href={pageHref(basePath, page - 1, category)} rel="prev">
          ← Newer
        </Link>
      )}

      <span className={styles.pageIndicator}>
        Page {page} of {totalPages}
      </span>

      {nextDisabled ? (
        <span className={styles.disabled}>Older →</span>
      ) : (
        <Link href={pageHref(basePath, page + 1, category)} rel="next">
          Older →
        </Link>
      )}
    </nav>
  );
}
