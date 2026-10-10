"use client";
import styles from "./page.module.scss";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import BlogNav from "@/components/Blog/BlogNav";
import projects from "@/utils/projectsData";

export default function Projects() {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [embedProject, setEmbedProject] = useState(null);
  const previewRef = useRef(null);

  useEffect(() => {
    const t1 = gsap.timeline();
    t1.from(".project-line .text", {
      y: 400,
      ease: "power4.out",
      delay: 0.3,
      duration: 1.2,
      stagger: { amount: 0.4 },
    });
  }, []);

  useEffect(() => {
    if (!embedProject) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setEmbedProject(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [embedProject]);

  const handleMouseMove = (e) => {
    if (previewRef.current) {
      gsap.to(previewRef.current, {
        x: e.clientX / 20,
        y: e.clientY / 30,
        rotateY: e.clientX / 50,
        rotateX: -e.clientY / 60,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  };

  const handleProjectClick = (project) => {
    if (project.embeddable) {
      setEmbedProject(project);
    } else {
      window.open(project.projectURL, "_blank");
    }
  };

  return (
    <div className={styles.container}>
      <BlogNav />
      <div onMouseMove={handleMouseMove}>
        <div className={styles.projectsBody}>
          <div className={styles.projectsContainer}>
            <h3 className="headerText">Projects</h3>
            <div className={styles.wrapper}>
              <h1 className={styles.projects}>
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className={`${styles.line} project-line`}
                    onMouseEnter={() => setHoveredProject(project.id)}
                    onMouseLeave={() => setHoveredProject(null)}
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="text">
                      {project.title}
                      {project.embeddable && <span className={styles.liveBadge}>Try it live</span>}
                    </div>

                    {hoveredProject === project.id && project.coverImageUrl && (
                      <div ref={previewRef} className={`${styles.projectPreview} ${styles.fadeIn}`}>
                        <div className={styles.previewGlass}>
                          <img
                            src={project.coverImageUrl}
                            alt={project.title}
                            className={styles.previewImage}
                          />
                          <div className={styles.glowTrail}></div>
                          <div className={styles.previewDetails}></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {embedProject && (
        <div className={styles.embedOverlay} onClick={() => setEmbedProject(null)}>
          <div className={styles.embedModal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.embedHeader}>
              <span className={styles.embedTitle}>{embedProject.title}</span>
              <div className={styles.embedActions}>
                <a
                  href={embedProject.projectURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.embedOpenLink}
                >
                  Open in new tab ↗
                </a>
                <button className={styles.embedClose} onClick={() => setEmbedProject(null)} aria-label="Close">
                  ✕
                </button>
              </div>
            </div>
            <div className={styles.embedFrameWrap}>
              <iframe
                src={embedProject.projectURL}
                title={embedProject.title}
                className={styles.embedFrame}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
              />
            </div>
            <p className={styles.embedNote}>
              If the preview above stays blank, the site is blocking embedding — use &ldquo;Open in new tab&rdquo; instead.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
