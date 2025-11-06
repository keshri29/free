"use client";
import styles from "./style.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import gsap from "gsap";
import useMousePosition from "../../utils/useMousePosition";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";

export default function Index({}) {
  const [isActive, setIsActive] = useState("about");
  const { x, y } = useMousePosition();

  useEffect(() => {
    const t1 = gsap.timeline();

    t1.from(".line .text", {
      y: 500,
      ease: "power4.out",
      delay: 1,
      duration: 1.8,
      stagger: {
        amount: 0.4,
      },
    });
  }, []);
  

  return (
    <>
      <div className={styles.container}>
        <div className={styles.mobileShadeContainer}>
          <div className={styles.mobileShadeTop}></div>
          <div className={styles.mobileShadeBottom}></div>
        </div>
        <div className={styles.navbar}>
          <Image className={styles.logo1} src="/logo1.gif" alt="navbarlogo1" width={60} height={60} />
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
              }
            ].map(({ name, hash }) => (
              <Link 
                key={name} 
                className={`${isActive === name ? styles.activeLink : ""}`} 
                href={hash}
                onClick={() => setIsActive(name)}
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
        <div className={styles.banner}>
          <h3 className="headerText uppercase">ANURAG KUMAR</h3>
          <div className={styles.wrapper}>
            <h1>
              {[
                {
                  line: "Building",
                  style: "",
                },
                {
                  line: "Digital",
                  style: "alternate",
                },
                {
                  line: "Experiences",
                  style: "alternate",
                },
                {
                  line: "With",
                  style: "",
                },
                {
                  line: "Code",
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
        <video playsInline autoPlay loop muted disablePictureInPicture controlsList="nodownload nofullscreen noremoteplayback" className={styles.backgroundVideo}>
          <source src="/bgvideo.mp4" type="video/mp4" />
        </video>
      </div>
    </>
  );
}