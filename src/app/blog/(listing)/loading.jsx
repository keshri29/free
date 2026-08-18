import styles from "./loading.module.scss";

export default function BlogLoading() {
  return (
    <div className={styles.container}>
      <div className={styles.headerSkeleton}>
        <div className={styles.line} style={{ width: "40%", height: "4rem" }} />
        <div className={styles.line} style={{ width: "60%", height: "1.8rem" }} />
      </div>
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={i} className={styles.card}>
            <div className={styles.thumb} />
            <div className={styles.line} style={{ width: "70%" }} />
            <div className={styles.line} style={{ width: "90%" }} />
            <div className={styles.line} style={{ width: "50%" }} />
          </div>
        ))}
      </div>
    </div>
  );
}
