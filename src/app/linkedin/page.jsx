import Image from "next/image";
import styles from "./page.module.scss";
import BlogNav from "@/components/Blog/BlogNav";
import { SITE_URL } from "@/lib/blog/config";
import {
  linkedinProfile,
  openToWork,
  about,
  topSkills,
  services,
  featured,
  experience,
  education,
  certifications,
} from "@/utils/linkedinData";

export const metadata = {
  title: "LinkedIn",
  description:
    "Anurag Kumar's full LinkedIn profile — experience, education, certifications, skills, and services.",
  alternates: { canonical: `${SITE_URL}/linkedin` },
  openGraph: {
    title: "LinkedIn — Anurag Kumar",
    description: "Full LinkedIn profile — experience, education, certifications, skills, and services.",
    url: `${SITE_URL}/linkedin`,
  },
};

export default function LinkedInPage() {
  return (
    <div className={styles.container}>
      <BlogNav />

      <div className={styles.page}>
        <span className={styles.eyebrow}>LinkedIn</span>
        <h1 className={styles.title}>{linkedinProfile.name}</h1>
        <p className={styles.headline}>{linkedinProfile.headline}</p>
        <div className={styles.metaRow}>
          <span>{linkedinProfile.location}</span>
          <span>
            {linkedinProfile.followers.toLocaleString()} followers · {linkedinProfile.connections} connections
          </span>
          <span>{linkedinProfile.school}</span>
        </div>

        <div className={styles.banner}>
          <Image src={linkedinProfile.bannerUrl} alt="LinkedIn banner" fill style={{ objectFit: "cover" }} priority />
        </div>
        <div className={styles.avatarWrap}>
          <Image src={linkedinProfile.avatarUrl} alt={linkedinProfile.name} fill style={{ objectFit: "cover" }} />
        </div>
        <div className={styles.profileActions}>
          <a href={linkedinProfile.profileUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaPrimary}>
            View Full Profile
          </a>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>About</h2>
          <div className={styles.prose}>
            {about.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <p className={styles.rowMeta}>{linkedinProfile.contactEmail}</p>

          <h3 className={styles.sectionTitle} style={{ marginTop: "3rem" }}>
            Top Skills
          </h3>
          <div className={styles.tags}>
            {topSkills.map((skill) => (
              <span key={skill} className={styles.tag}>
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Open to Work</h2>
          <div className={styles.openToWork}>
            <div className={styles.openToWorkItem}>
              <strong>Job titles</strong>
              {openToWork.jobTitles.join(" · ")}
            </div>
            <div className={styles.openToWorkItem}>
              <strong>Location types</strong>
              {openToWork.locationTypes.join(" · ")}
            </div>
            <div className={styles.openToWorkItem}>
              <strong>Locations</strong>
              {openToWork.locations.join(", ")}
            </div>
            <div className={styles.openToWorkItem}>
              <strong>Notice period</strong>
              {openToWork.noticePeriod}
            </div>
            <div className={styles.openToWorkItem}>
              <strong>Start date</strong>
              {openToWork.startDate}
            </div>
            <div className={styles.openToWorkItem}>
              <strong>Employment types</strong>
              {openToWork.employmentTypes.join(" · ")}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Services</h2>
          <div className={styles.tags}>
            {services.map((service) => (
              <span key={service} className={styles.tagMuted}>
                {service}
              </span>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Featured</h2>
          <a href={featured.url} target="_blank" rel="noopener noreferrer" className={styles.featuredCard}>
            <div className={styles.featuredTitle}>{featured.title}</div>
            <div className={styles.featuredUrl}>{featured.url}</div>
            <p className={styles.featuredDesc}>{featured.description}</p>
          </a>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Experience</h2>
          <div className={styles.rows}>
            {experience.map((job, i) => (
              <div key={i} className={styles.row}>
                <div className={styles.rowTitle}>{job.role}</div>
                <div className={styles.rowSub}>
                  {job.company} · {job.type}
                </div>
                <div className={styles.rowMeta}>
                  {job.duration} · {job.location}
                </div>
                <p className={styles.rowDesc}>{job.description}</p>
                <div className={styles.tags}>
                  {job.skills.map((skill) => (
                    <span key={skill} className={styles.tagMuted}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Education</h2>
          <div className={styles.rows}>
            {education.map((edu, i) => (
              <div key={i} className={styles.row}>
                <div className={styles.rowTitle}>{edu.school}</div>
                <div className={styles.rowSub}>{edu.degree}</div>
                <div className={styles.rowMeta}>
                  {edu.duration}
                  {edu.grade ? ` · ${edu.grade}` : ""}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Licenses &amp; Certifications</h2>
          <div className={styles.rows}>
            {certifications.map((cert, i) => (
              <div key={i} className={styles.row}>
                <div className={styles.rowTitle}>{cert.title}</div>
                <div className={styles.rowSub}>{cert.issuer}</div>
                <div className={styles.rowMeta}>
                  Issued {cert.issued}
                  {cert.skills ? ` · Skills: ${cert.skills}` : ""}
                  {cert.credentialId ? ` · Credential ID: ${cert.credentialId}` : ""}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.ctaRow}>
          <a href={linkedinProfile.profileUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaPrimary}>
            View Full Profile on LinkedIn
          </a>
          <a href={linkedinProfile.profileUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaSecondary}>
            See recent posts &amp; activity
          </a>
        </div>
      </div>
    </div>
  );
}
