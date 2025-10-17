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
    optimizePackageImports: ['lucide-react', 'framer-motion', 'react', 'react-dom'],
    // Optimizaciones adicionales para performance
    optimizeServerReact: true,
    serverMinification: true,
    // Optimizaciones CSS para reducir cadenas críticas
    optimizeCss: true,
    // Optimizaciones de JavaScript
    webpackBuildWorker: true,
    // Tree shaking mejorado
    esmExternals: true,
  },
  
  // Compresión automática
  compress: true,
  
  // Source maps para debugging en producción
  productionBrowserSourceMaps: true,
  
  
  // Headers de seguridad y rendimiento
  async headers() {
    return [
      // Headers para HTML - NO cachear para obtener siempre la versión más reciente
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'accept',
            value: '(.*text/html.*)',
          },
        ],
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
          // Headers de performance para Desktop
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // Preload y prefetch optimizado para terceros
          {
            key: 'Link',
            value: '</images/icons/icon.webp>; rel=preload; as=image, <https://pagead2.googlesyndication.com>; rel=dns-prefetch, <https://static.cloudflareinsights.com>; rel=dns-prefetch',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
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
      // Caché optimizado para archivos JavaScript y CSS
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*\\.(js|css|woff|woff2|eot|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Sin caché para APIs de farms (cambios frecuentes) - DEBE IR PRIMERO
      {
        source: '/api/farms/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'Surrogate-Control',
            value: 'no-store',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'no-cache',
          },
          {
            key: 'Cloudflare-CDN-Cache-Control',
            value: 'no-cache',
          },
        ],
      },
      // Sin caché para APIs de usuarios (cambios inmediatos)
      {
        source: '/api/users/(.*)',
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
      // Sin caché para APIs de administración
      {
        source: '/api/admin/(.*)',
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
      // Caché corto para APIs de auth (cambios frecuentes)
      {
        source: '/api/auth/(.*)',
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
      // Caché corto para APIs de giveaways (cambios frecuentes)
      {
        source: '/api/giveaways/(.*)',
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
      // Sin caché para API de revalidación
      {
        source: '/api/revalidate/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
          {
            key: 'Surrogate-Control',
            value: 'no-store',
          },
          {
            key: 'CDN-Cache-Control',
            value: 'no-cache',
          },
          {
            key: 'Cloudflare-CDN-Cache-Control',
            value: 'no-cache',
          },
        ],
      },
      // Caché para archivos de datos de la API (solo para APIs que no están arriba)
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      // Sin caché para páginas con metadatos dinámicos (slogans)
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
      // Sin caché para páginas principales con metadatos dinámicos
      {
        source: '/(farming-routes|daily-routine|festivals|giveaways|admin|profile)',
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
      // Headers para optimizar scripts de terceros específicos
      {
        source: '/:path*',
        has: [
          {
            type: 'header',
            key: 'referer',
            value: '(.*cloudflare.*|.*rocket-loader.*|.*beacon.*)',
          },
        ],
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
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
      // Headers para source maps
      {
        source: '/_next/static/chunks/:path*.js.map',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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
    // Bundle Analyzer deshabilitado en Vercel para evitar problemas de build
    // Solo funciona en desarrollo local
    if (process.env.ANALYZE === 'true' && !isServer && dev) {
    }

    // Configuración de source maps para mejor debugging
    if (!dev && !isServer) {
      config.devtool = 'source-map';
    }

    // Solo aplicar optimizaciones en producción y en el cliente
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        // CSS crítico separado
        criticalCss: {
          name: 'critical',
          test: /[\\/]globals\.css$/,
          chunks: 'all',
          priority: 20,
          enforce: true,
        },
        // Chunks específicos para librerías pesadas
        framerMotion: {
          test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
          name: 'framer-motion',
          chunks: 'all',
          priority: 15,
        },
        lucideReact: {
          test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
          name: 'lucide-react',
          chunks: 'all',
          priority: 15,
        },
        // Bundle de vendors optimizado para reducir JavaScript no utilizado
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10,
          enforce: true,
          minChunks: 1,
          maxSize: 200000, // 200KB máximo por chunk
        },
        // Chunk separado para librerías grandes que pueden no usarse
        largeVendor: {
          test: /[\\/]node_modules[\\/](framer-motion|lucide-react)[\\/]/,
          name: 'large-vendor',
          chunks: 'all',
          priority: 8,
          enforce: true,
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
      
      // Optimizaciones adicionales para CSS
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // Optimizaciones de JavaScript para reducir TBT
      config.optimization.concatenateModules = true;
      config.optimization.providedExports = true;
      config.optimization.usedExports = true;
      
      // Tree shaking más agresivo para eliminar código no utilizado
      config.optimization.sideEffects = false;
      config.optimization.usedExports = true;
      config.optimization.providedExports = true;
      
      // Optimización de módulos para reducir bundle size
      config.optimization.mangleExports = true;
      config.optimization.innerGraph = true;
      
      // Eliminar polyfills innecesarios para navegadores modernos
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // No incluir polyfills para características ES2022+
        "util": false,
        "buffer": false,
        "stream": false,
        "crypto": false,
        "fs": false,
        "path": false,
        "os": false,
      };
      
      // Configuración de chunks más agresiva
      config.optimization.splitChunks.maxAsyncRequests = 5;
      config.optimization.splitChunks.maxInitialRequests = 3;
      config.optimization.splitChunks.minSize = 20000;
      config.optimization.splitChunks.maxSize = 244000;
      
      // Optimizaciones adicionales para reducir TBT
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
      
      // Configuración de paralelización
      config.parallelism = 4;
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

export default nextConfig;
