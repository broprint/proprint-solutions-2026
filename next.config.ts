import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ahhkgyfwvpjfkuwaxwbq.supabase.co',
        pathname: '/storage/v1/object/public/product-images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.firstshop.co.za',
        pathname: '/cdn/shop/**',
      },
      {
        protocol: 'https',
        hostname: 'images.tcdn.com.br',
        pathname: '/img/**',
      },
      {
        protocol: 'https',
        hostname: 'jgsuperstore.com',
        pathname: '/cdn/shop/**',
      },
      {
        protocol: 'https',
        hostname: 'multimedia.bbycastatic.ca',
        pathname: '/multimedia/**',
      },
    ],
  },
};

export default nextConfig;
