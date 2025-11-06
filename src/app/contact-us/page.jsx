"use client";
import { useState } from "react";
import styles from "./style.module.scss";
import emailjs from "@emailjs/browser";

export default function ContactSection() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      await emailjs.send(
        "service_xxxxx", // your EmailJS service ID
        "template_xxxxx", // your EmailJS template ID
        data,
        "user_xxxxx" // your EmailJS public key
      );

      setSent(true);
      e.target.reset();
      setTimeout(() => setSent(false), 5000); // fade out success message
    } catch (error) {
      console.error("Email send error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.contactSection}>
      <div className={styles.backgroundGlow}></div>

      <div className={styles.glassCard}>
        <h2 className={styles.title}>Let’s Connect</h2>
        <p className={styles.subtitle}>
          Have a project, idea, or just want to say hi? Drop me a message 👇
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input name="name" type="text" required placeholder=" " />
            <label>Your Name</label>
          </div>

          <div className={styles.inputGroup}>
            <input name="email" type="email" required placeholder=" " />
            <label>Your Email</label>
          </div>

          <div className={styles.inputGroup}>
            <textarea name="message" rows={4} required placeholder=" " />
            <label>Your Message</label>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>

          {sent && <p className={styles.status}>✅ Message Sent Successfully!</p>}
        </form>
      </div>
    </section>
  );
}
