import Link from "next/link";
import styles from "./Breadcrumbs.module.scss";

export default function Breadcrumbs({ items }) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.url}>
              {isLast ? (
                <span aria-current="page">{item.name}</span>
              ) : (
                <Link href={item.url.replace(/^https?:\/\/[^/]+/, "")}>{item.name}</Link>
              )}
              {!isLast && <span className={styles.separator}>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
