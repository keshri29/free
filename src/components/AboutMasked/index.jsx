"use client";
import styles from "./style.module.scss";

export default function Index({ setIsHovered }) {
  return (
    <>
      <main className={styles.main} id="about">
        <div className={styles.aboutBody}>
          <div className={styles.aboutContainer}>
            <h3 className="headerText">About Me</h3>
            <p onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
              When I'm not exploring new technologies or building projects, you'll find me reading tech blogs, contributing to open source, or perfecting my coding skills with a cup of coffee.
            </p>
          </div>
        </div>
      </main>
      <main className={styles.main}>
        <div className={styles.servicesBody}>
          <div className={styles.servicesContainer}>
            <h3 className="headerText">What I Work With</h3>
            <div className={styles.wrapper}>
              <h1 className={styles.services}>
                {["JavaScript", "TypeScript", "ReactJs", "NextJs", "NodeJs", "Express", "MongoDB", "MySQL", "Tailwind", "Git", "REST APIs", "Redux", "HTML5", "CSS3"].map((skill) => (
                  <div key={skill} className={`${styles.line} line`}>
                    <div className="text">{skill}</div>
                  </div>
                ))}
              </h1>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}