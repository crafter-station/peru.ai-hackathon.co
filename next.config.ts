import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '11labs-nonprd-15f22c1d.s3.eu-west-3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '26evcbcedv5nczlx.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
