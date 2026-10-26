import type { NextConfig } from "next";

const scriptSrc =
  process.env.NODE_ENV === "development"
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'";

const config: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  poweredByHeader: false,
  turbopack: {
    root: process.cwd(),
    rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
  images: {
    remotePatterns: [new URL("https://i.ytimg.com/vi/**")],
  },
  async headers() { return [{ source: "/(.*)", headers: [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), autoplay=(self \"https://www.youtube.com\" \"https://www.youtube-nocookie.com\")" },
    { key: "Content-Security-Policy", value: `default-src 'self'; ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://i.ytimg.com https://img.youtube.com; font-src 'self'; connect-src 'self' ws:; frame-src https://www.youtube-nocookie.com https://www.youtube.com; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'` },
  ] }]; },
};
export default config;
