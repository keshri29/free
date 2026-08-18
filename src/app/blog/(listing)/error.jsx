"use client";

export default function BlogError({ error, reset }) {
  return (
    <div style={{ padding: "10rem 7rem", textAlign: "center", color: "var(--secondaryText)" }}>
      <p style={{ fontSize: "1.8rem", marginBottom: "2rem" }}>
        Something went wrong loading the blog. Please try again.
      </p>
      <button
        type="button"
        onClick={reset}
        style={{
          fontSize: "1.4rem",
          padding: "1rem 2.4rem",
          borderRadius: "100px",
          border: "1px solid var(--accentRed)",
          background: "transparent",
          color: "var(--primaryText)",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}
