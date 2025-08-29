import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL("https://mir-s3-cdn-cf.behance.net/**"),
      new URL("https://static.nike.com/**"),
      new URL("https://www.nike.sa/**"),
      new URL("https://atlas-content-cdn.pixelsquid.com/**"),
    ],
  },
};

export default nextConfig;
