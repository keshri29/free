import styles from "./TableOfContents.module.scss";

// Plain anchor links to heading ids injected during sanitization — no
// client JS/scroll-spy needed for this to work.
export default function TableOfContents({ headings }) {
  if (!headings || headings.length < 3) return null;

  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <p className={styles.title}>Table of contents</p>
      <ol>
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? styles.sub : undefined}>
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
