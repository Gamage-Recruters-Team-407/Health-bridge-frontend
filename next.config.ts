import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Only valid Next.js 16 options
  reactStrictMode: false,
  async rewrites() {
    const backend = (process.env.BACKEND_API_URL
      || process.env.NEXT_PUBLIC_API_BASE_URL
      || process.env.NEXT_PUBLIC_API_URL
      || "http://127.0.0.1:8088/api").replace(/\/$/, "");
    return [{ source: "/api/:path*", destination: `${backend}/:path*` }];
  },
};

export default nextConfig;
