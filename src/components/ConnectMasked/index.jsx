"use client";
import styles from "./style.module.scss";
import Link from "next/link";

export default function Index({ setIsHovered }) {
  return (
    <>
      <main id="contact" className={styles.main}>
        <div className={styles.mottoBody}>
          <div className={styles.mottoContainer}>
            <h3 className="headerText">Inspiration</h3>
            <div className={styles.mottoWrapper}>
              <h1
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {["Think.", "Code.", "Repeat."].map((line) => (
                  <div key={line} className={`${styles.line} line`}>
                    <div className="text">{line}</div>
                  </div>
                ))}
              </h1>
            </div>
            <h3 className="headerText">Anurag Kumar</h3>
          </div>
        </div>
      </main>
      <main className={styles.main}>
        <div className={styles.infoBody}>
          <div className={styles.infoContainer}>
            <h3 className="headerText">Connect with me:</h3>
            <div className={styles.infoWrapper}>
              <div className={styles.infoGrid}>
                {[
                  {
                    link: "Resume",
                    url: "/resume.pdf",
                  },
                  {
                    link: "Instagram",
                    url: "https://www.instagram.com/anurag.env/",
                  },
                  {
                    link: "Twitter",
                    url: "https://twitter.com/keshri_anurag",
                  },
                  {
                    link: "Github",
                    url: "https://github.com/keshri29",
                  },
                  {
                    link: "LinkedIn",
                    url: "https://linkedin.com/in/anurag-kumar-aab8a61a7",
                  },
                  {
                    link: "Mail",
                    url: "mailto:keshrianurag690@gmail.com",
                  },
                ].map(({ link, url }, index) => (
                  <div key={url} className={styles.bullet}>
                    <span className={styles.dot}></span>
                    <h3 className={styles.infoItem} key={index}>
                      {link === "Resume" ? (
                        <Link href={url} download="Resume">
                          {link}
                        </Link>
                      ) : (
                        <Link
                          href={url}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {link}
                        </Link>
                      )}
                    </h3>
                  </div>
                ))}
              </div>
              <div className={styles.infoDetails}>
                <div>
                  <p>Email</p>
                  <span>keshrianurag690@gmail.com</span>
                </div>
              </div>
            </div>
          </div> 
        </div>
      </main>
    </>
  );
}