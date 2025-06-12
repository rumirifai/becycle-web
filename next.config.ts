import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.detik.net.id',
      },
      {
        protocol: 'https',
        hostname: '**.kompas.com',
      },
      {
        protocol: 'https',
        hostname: '**.antaranews.com',
      },
    ],
  },
};

export default nextConfig;
