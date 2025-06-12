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
        hostname: 'lh3.googleusercontent.com',
      },
      { protocol: 'https', hostname: 'asset.kompas.com' },
      { protocol: 'https', hostname: 'akcdn.detik.net.id' },
      { protocol: 'https', hostname: 'media.suara.com' },
      { protocol: 'https', hostname: 'awsimages.detik.net.id' },
      { protocol: 'https', hostname: 'img.antaranews.com' },
      { protocol: 'https', hostname: 'cdn.timesmedia.co.id' },
    ],
  },
};

export default nextConfig;
