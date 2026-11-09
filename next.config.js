/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Explicit allow-list for every host we actually render.
    // The trailing wildcard keeps user-supplied CMS images working
    // without breaking the build when a new host is used.
    remotePatterns: [
      // Google Drive / Google-hosted images
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'docs.google.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh4.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh5.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh6.googleusercontent.com' },
      // Mock / fallback photography
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Permissive last resort so a newly added CMS host never blanks the UI.
      { protocol: 'https', hostname: '**' },
    ],
    // Local branding fallback (public/placeholder-kebaya.svg) is an SVG.
    dangerouslyAllowSVG: true,
    contentDispositionType: 'inline',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 60,
    formats: ['image/avif', 'image/webp'],
    // NOTE: We deliberately do NOT set `unoptimized: true` globally.
    // Google Drive assets are served through the optimizer on the server
    // (no CORS issues), and SafeImage automatically marks Drive/Data URLs
    // as `unoptimized` per-image if the optimizer ever rejects them.
    unoptimized: false,
  },
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
