import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'render.guildwars2.com',  // Iconos de items de GW2
      'wiki.guildwars2.com',   // Imágenes adicionales de GW2
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'render.guildwars2.com',
        port: '',
        pathname: '/file/**',
      },
      {
        protocol: 'https',
        hostname: 'wiki.guildwars2.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig; 