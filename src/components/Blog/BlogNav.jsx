"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./BlogNav.module.scss";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/linkedin", label: "LinkedIn" },
  { href: "/blog", label: "Blog" },
];

export default function BlogNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logoLink}>
          <Image src="/logo1.gif" alt="Anurag Keshri logo" width={40} height={40} className={styles.navLogo} unoptimized />
        </Link>
        <div className={styles.navLinks}>
          {links.map(({ href, label }) => {
            const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href);
            return (
              <Link key={href} href={href} className={isActive ? styles.navLinkActive : styles.navLink}>
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
