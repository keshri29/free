/** @type {import('next').NextConfig} */
// GITHUB_PAGES=true is set only by .github/workflows/deploy.yml. It switches
// on Next.js's static export (no server, required by GitHub Pages) without
// touching the normal Vercel build, which still runs the full dynamic app
// (API routes, ISR, image optimization) exactly as before.
const isGithubPagesExport = process.env.GITHUB_PAGES === "true"

const nextConfig = {
  ...(isGithubPagesExport ? { output: "export" } : {}),
  images: {
    // Static export has no server to run Next's image optimizer, so images
    // must be served unoptimized (original files, as-is) in that build only.
    unoptimized: isGithubPagesExport,
    remotePatterns: [
      { protocol: "https", hostname: "cdn-images-1.medium.com" },
      { protocol: "https", hostname: "miro.medium.com" },
      { protocol: "https", hostname: "*.medium.com" },
    ],
  },
}

module.exports = nextConfig
