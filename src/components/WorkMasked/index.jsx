"use client";
import styles from "./style.module.scss";

export default function Index({ setIsHovered }) {
  return (
    <>
      <main className={styles.main} id="work">
        <div className={styles.experienceBody}>
          <div className={styles.experienceContainer}>
            <h3 className="headerText">Experience</h3>
            <p
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              2+ years building scalable web applications with modern technologies. Passionate about creating efficient solutions and collaborating with talented teams.
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
            <p
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Innovative web applications showcasing modern development practices and cutting-edge technologies that solve real-world problems.
            </p>
          </div>
        </div>
      </main>
      <main className={styles.main}>
        <div className={styles.projectsBody}>
          <div className={styles.projectsTitleContainer}>
            <div className={styles.wrapper}>
              <h1 className={styles.services}>
                {[
                  {
                    name: "TopDevFirms",
                    stack: "Next.js, Node.js, MongoDB, TypeScript, Tailwind",
                    href1: "https://github.com/keshri29",
                    href2: "https://topdevfirms.vercel.app/",
                  },
                  {
                    name: "Verified Platform",
                    stack: "React.js, Node.js, Express, Tailwind, MongoDB",
                    href1: "https://github.com/keshri29",
                    href2: "https://verified-platform.vercel.app/",
                  },
                  {
                    name: "TurboCV",
                    stack: "React.js, Node.js, MongoDB, Express",
                    href1: "https://github.com/keshri29",
                    href2: "https://turbocv.vercel.app/",
                  },
                  {
                    name: "My Portfolio",
                    stack: "Next.js, SCSS, Framer Motion",
                    href1: "https://github.com/keshri29",
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