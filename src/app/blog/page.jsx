"use client";
import styles from "./page.module.scss";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    gsap.from(".blog-line .text", {
      y: 400,
      ease: "power4.out",
      delay: 0.3,
      duration: 1.2,
      stagger: { amount: 0.3 },
    });
  }, []);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        if (data.success) {
          setBlogs(data.items);
        } else {
          setError("Could not load articles. Please try again later.");
        }
      } catch {
        setError("Could not load articles. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <nav className={styles.nav}>
        <Link href="/">
          <Image src="/logo1.gif" alt="logo" width={50} height={50} className={styles.navLogo} />
        </Link>
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/projects" className={styles.navLink}>Projects</Link>
          <span className={styles.navLinkActive}>Blog</span>
        </div>
      </nav>

      {/* Header */}
      <header className={styles.header}>
        <h3 className="headerText">Writing</h3>
        <div className={styles.titleWrapper}>
          <h1 className={styles.heroTitle}>
            {["THOUGHTS", "&", "ARTICLES"].map((word) => (
              <div className={`${styles.line} blog-line`} key={word}>
                <div className="text">{word}</div>
              </div>
            ))}
          </h1>
        </div>
        <p className={styles.subtitle}>
          Ideas, tutorials, and reflections — published on Medium
        </p>
      </header>

      {/* Blog Section */}
      <section className={styles.blogSection}>
        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <p>Fetching articles…</p>
          </div>
        )}

        {!loading && error && (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>⚠</span>
            <p>{error}</p>
            <a
              href="https://medium.com/@keshrianurag690"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mediumLink}
            >
              Visit Medium Profile →
            </a>
          </div>
        )}

        {!loading && !error && blogs.length === 0 && (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>✍</span>
            <p>No articles yet.</p>
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <>
            {/* Featured first post */}
            <article
              className={`${styles.card} ${styles.featured}`}
              onClick={() => window.open(blogs[0].link, "_blank")}
            >
              {blogs[0].thumbnail ? (
                <div className={styles.featuredImage}>
                  <img src={blogs[0].thumbnail} alt={blogs[0].title} loading="lazy" />
                  <div className={styles.imageOverlay} />
                </div>
              ) : (
                <div className={styles.featuredImagePlaceholder}>
                  <span>✍</span>
                </div>
              )}
              <div className={styles.featuredContent}>
                <div className={styles.featuredBadge}>Featured Article</div>
                {blogs[0].categories.length > 0 && (
                  <div className={styles.tags}>
                    {blogs[0].categories.map((cat) => (
                      <span key={cat} className={styles.tag}>{cat}</span>
                    ))}
                  </div>
                )}
                <h2 className={styles.featuredTitle}>{blogs[0].title}</h2>
                <p className={styles.cardExcerpt}>{blogs[0].excerpt}</p>
                <div className={styles.cardMeta}>
                  <span className={styles.date}>{formatDate(blogs[0].pubDate)}</span>
                  <span className={styles.readMore}>Read on Medium →</span>
                </div>
              </div>
            </article>

            {/* Rest of posts */}
            {blogs.length > 1 && (
              <div className={styles.grid}>
                {blogs.slice(1).map((blog, idx) => (
                  <article
                    key={blog.link || idx}
                    className={styles.card}
                    onClick={() => window.open(blog.link, "_blank")}
                  >
                    {blog.thumbnail ? (
                      <div className={styles.cardImage}>
                        <img src={blog.thumbnail} alt={blog.title} loading="lazy" />
                      </div>
                    ) : (
                      <div className={styles.cardImagePlaceholder}>
                        <span>✍</span>
                      </div>
                    )}
                    <div className={styles.cardContent}>
                      {blog.categories.length > 0 && (
                        <div className={styles.tags}>
                          {blog.categories.map((cat) => (
                            <span key={cat} className={styles.tag}>{cat}</span>
                          ))}
                        </div>
                      )}
                      <h2 className={styles.cardTitle}>{blog.title}</h2>
                      <p className={styles.cardExcerpt}>{blog.excerpt}</p>
                      <div className={styles.cardMeta}>
                        <span className={styles.date}>{formatDate(blog.pubDate)}</span>
                        <span className={styles.readMore}>Read →</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className={styles.mediumCta}>
              <a
                href="https://medium.com/@keshrianurag690"
                target="_blank"
                rel="noopener noreferrer"
              >
                View all on Medium ↗
              </a>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
