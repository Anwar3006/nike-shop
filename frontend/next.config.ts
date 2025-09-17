import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mir-s3-cdn-cf.behance.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.nike.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.nike.sa",
        pathname: "/dw/image/**",
      },
      {
        protocol: "https",
        hostname: "atlas-content-cdn.pixelsquid.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bowtiesandbones.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s1.dswcdn.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
