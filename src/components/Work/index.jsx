"use client";
import Image from "next/image";
import styles from "./style.module.scss";
import { useRef } from "react";

export default function Index({}) {
  return (
    <>
      <main className={styles.main} id="work">
        <div className={styles.experienceBody}>
          <div className={styles.experienceContainer}>
            <h3 className="headerText">Experience</h3>
            <p>
              With{" "}
              <span className="alternate">
                hands-on development experience
              </span>{" "}
              in modern web technologies, building scalable applications and collaborating with agile teams.
            </p>
            <h3 className={`${styles.history} headerText`}>History</h3>
          </div>
        </div>
      </main>
      <main className={styles.main}>
        <div className={styles.historyBody}>
          <div className={styles.historyContainer}>
            <div className={styles.wrapper}>
              <h1 className={styles.services}>
                {[
                  {
                    time: "NOW",
                    role: "MERN Stack Developer",
                    company: "Comfygen Private Limited",
                    link: "https://www.comfygen.com/",
                  },
                  {
                    time: "2024",
                    role: "Full-Stack Developer Intern",
                    company: "Pizone Infotech Solutions",
                    link: "https://pizoneinfotech.com/",
                  },
                  {
                    time: "2023",
                    role: "Software Engineer Intern",
                    company: "Simtrak Solutions",
                    link: "https://simtrak.com/",
                  },
                ].map(({ time, role, company, link }) => (
                  <div key={company} className={`${styles.line} line`}>
                    <div className="text">{time}</div>
                    <div className="text">
                      <p>{role}</p>
                      <a
                        className={styles.role}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {company}
                      </a>
                    </div>
                  </div>
                ))}
              </h1>
            </div>
          </div>
        </div>
      </main>
      <main className={styles.main}>
        <div className={styles.projectsBody}>
          <div className={styles.projectsContainer}>
            <h3 className="headerText">Projects</h3>
            <p>
              Showcasing my portfolio of
              <span className="alternate"> innovative solutions</span> where I've implemented cutting-edge technologies to solve real-world challenges.
            </p>
          </div>
        </div>
      </main>
      <main className={styles.main}>
        <div className={styles.projectsBody}>
          <div className={styles.projectsTitleContainer}>
            <div className={styles.wrapper}>
              <div className={styles.imgContainer}>
                <Image
                  className={styles.img}
                  src="/planet.png"
                  alt="planetImage"
                  width={900}
                  height={900}
                />
              </div>
              <h1 className={styles.services}>
                {[
                  {
                    name: "TopDevFirms",
                    stack: "Next.js, Node.js, MongoDB, TypeScript, Tailwind",
                    href1: "https://github.com/keshri29/TopDevFirms",
                    href2: "https://topdevfirms.vercel.app/",
                  },
                  {
                    name: "Verified Platform",
                    stack: "React.js, Node.js, Express, Tailwind, MongoDB",
                    href1: "https://github.com/keshri29/Verified-Platform",
                    href2: "https://verified-platform.vercel.app/",
                  },
                  {
                    name: "TurboCV",
                    stack: "React.js, Node.js, MongoDB, Express",
                    href1: "https://github.com/keshri29/TurboCV",
                    href2: "https://turbocv.vercel.app/",
                  },
                  {
                    name: "My Portfolio",
                    stack: "Next.js, SCSS, Framer Motion",
                    href1: "https://github.com/keshri29/Portfolio",
                    href2: "https://anuragkumar.com/",
                  },
                ].map(({ name, stack, href1, href2 }) => (
                  <div key={name} className={`${styles.line} line`}>
                    <div className={styles.text}>
                      <div>{name}</div>
                      <div className={styles.details}>
                        <span className={styles.stack}>{stack}</span>
                        <span className={styles.redirects}>
                          <a
                            href={href1}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {href1 ? "Github" : ""}
                          </a>
                          <a
                            href={href2}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {href2 ? "Website" : ""}
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </h1>
              <div className={styles.balls}>
                <span className={styles.ball}></span>
                <span className={styles.ball}></span>
                <span className={styles.ball}></span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}