import Link from "next/link";
import Image from "next/image";
import styles from "./BlogNav.module.scss";

export default function BlogNav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logoLink}>
          <Image src="/logo1.gif" alt="Anurag Keshri logo" width={40} height={40} className={styles.navLogo} unoptimized />
        </Link>
        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/projects" className={styles.navLink}>Projects</Link>
          <Link href="/blog" className={styles.navLinkActive}>Blog</Link>
        </div>
      </div>
    </nav>
  );
}
