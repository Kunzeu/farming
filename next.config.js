/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones de imágenes - SIN TRANSFORMACIONES
  images: {
    unoptimized: true, // Desactiva Vercel completamente
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Configuración de calidades para Next.js 16
    qualities: [25, 50, 75, 85, 90, 95, 100],
    // Sin transformaciones - las imágenes se sirven tal como están
    // Dominios externos permitidos
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'render.guildwars2.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.guildwars2.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'wiki.guildwars2.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'gw2efficiency.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
  
  // Configuración de Turbopack
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  
  // Configuración experimental
  experimental: {
    // Optimizaciones de paquetes
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  
  // Headers de seguridad y rendimiento
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'CF-Image-Transform',
            value: 'off', // Desactiva transformaciones de Cloudflare
          },
        ],
      },
      {
        source: '/:path*\\.(png|jpg|jpeg|gif|webp|avif|svg)',
        headers: [
          {
            key: 'CF-Image-Transform',
            value: 'off', // Desactiva transformaciones para todas las imágenes
          },
        ],
      },
      {
        source: '/',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
      // Redirecciones 301 para rutas de idiomas inexistentes
      // Nota: En Next.js, las redirecciones se definen en "async redirects()" más abajo
    ];
  },
  
  // Redirecciones permanentes para evitar 404 en idiomas no implementados
  async redirects() {
    return [
      { source: '/es', destination: '/', permanent: true },
      { source: '/es/(.*)', destination: '/', permanent: true },
      { source: '/fr', destination: '/', permanent: true },
      { source: '/fr/(.*)', destination: '/', permanent: true },
      { source: '/de', destination: '/', permanent: true },
      { source: '/de/(.*)', destination: '/', permanent: true },
    ];
  },
  
  // Configuración de Webpack solo para producción
  webpack: (config, { dev, isServer }) => {
    // Solo aplicar optimizaciones en producción y en el cliente
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
        },
      };
      
      // Optimización de chunks
      config.optimization.runtimeChunk = 'single';
    }
    
    // Configuración para SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
  
  // Configuración de compilación
  compiler: {
    // Eliminar console.log en producción
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Configuración de TypeScript
  typescript: {
    // Ignorar errores de TypeScript durante la compilación
    ignoreBuildErrors: false,
  },
  
  // Configuración de ESLint
  eslint: {
    // Ignorar errores de ESLint durante la compilación
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
