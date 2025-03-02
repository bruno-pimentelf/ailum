/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pps.whatsapp.net',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
