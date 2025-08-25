import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://mir-s3-cdn-cf.behance.net/**"),
      new URL("https://static.nike.com/**"),
    ],
  },
};

export default nextConfig;
