"use client";
import styles from "./page.module.scss";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import projects from "@/utils/projectsData";

export default function Projects() {
  const [hoveredProject, setHoveredProject] = useState(null);
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

  return (
    <div className={styles.container} onMouseMove={handleMouseMove}>
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
                  onClick={() => window.open(project.projectURL, "_blank")}
                >
                  <div className="text">{project.title}</div>

                  {hoveredProject === project.id && (
                    <div
                      ref={previewRef}
                      className={`${styles.projectPreview} ${styles.fadeIn}`}
                    >
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
  );
}
