"use client";
import styles from "./style.module.scss";
import Image from "next/image";
import Link from "next/link";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";

export default function Index({ setIsHovered }) {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.mobileShadeContainer}>
          <div className={styles.mobileShadeTop}></div>
          <div className={styles.mobileShadeBottom}></div>
        </div>
        <div className={styles.navbar}>
          <Image className={styles.logo} src="/logo.gif" alt="navbarLogo" width={60} height={60} />
          <div className={styles.links}>
            {[
              {
                name: "about",
                hash: "#about",
              },
              {
                name: "work",
                hash: "#work",
              },
              {
                name: "contact",
                hash: "#contact",
              },
            ].map(({ name, hash }) => (
              <Link key={name} href={hash}>
                {name}
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.banner}>
          <h3 className="headerText">ANURAG KUMAR</h3>
          <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className={styles.wrapper}>
            <h1>
              {[
                {
                  line: "Turning",
                  style: "",
                },
                {
                  line: "Ideas",
                  style: "",
                },
                {
                  line: "Into",
                  style: "",
                },
                {
                  line: "Digital",
                  style: "",
                },
                {
                  line: "Reality",
                  style: "",
                },
              ].map(({ line, style }) => (
                <div className={`${styles.line} line`} key={line}>
                  <div className={`${style} text`}>{line}</div>
                </div>
              ))}
            </h1>
          </div>
          <div className={styles.options}>
            <div className={styles.icons}>
              {[
                {
                  href: "https://www.instagram.com/anurag.env/",
                  component: <InstagramIcon style={{ fontSize: "2rem" }} />,
                },
                {
                  href: "https://github.com/keshri29",
                  component: <GitHubIcon style={{ fontSize: "2rem" }} />,
                },
                {
                  href: "https://linkedin.com/in/anurag-kumar-aab8a61a7",
                  component: <LinkedInIcon style={{ fontSize: "2rem" }} />,
                },
                {
                  href: "https://twitter.com/keshri_anurag",
                  component: <TwitterIcon style={{ fontSize: "2rem" }} />,
                },
              ].map(({ href, component }, idx) => (
                <span key={idx}>
                  <a href={href} rel="noopener noreferrer" target="_blank">
                    {component}
                  </a>
                </span>
              ))}
            </div>
            <div className={styles.resume}>
              <a href="/resume.pdf" download>
                DOWNLOAD RESUME
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}