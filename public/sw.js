const CACHE_NAME = 'true-farming-v1.2';
const STATIC_CACHE_NAME = 'true-farming-static-v1.2';
const THIRD_PARTY_CACHE_NAME = 'true-farming-third-party-v1.2';

const CRITICAL_RESOURCES = [
  '/',
  '/images/backgrounds/voe-background.webp', // LCP Image - Primera prioridad
  '/images/icons/icon.webp',
  '/images/backgrounds/GuildWars2.webp',
];

// Configuración de caché por tipo de recurso
const CACHE_STRATEGIES = {
  images: {
    cacheName: STATIC_CACHE_NAME,
    maxAge: 31536000, // 1 año
    maxEntries: 100
  },
  scripts: {
    cacheName: STATIC_CACHE_NAME,
    maxAge: 86400, // 1 día
    maxEntries: 50
  },
  thirdParty: {
    cacheName: THIRD_PARTY_CACHE_NAME,
    maxAge: 3600, // 1 hora para terceros
    maxEntries: 30
  },
  googleAds: {
    cacheName: THIRD_PARTY_CACHE_NAME,
    maxAge: 1800, // 30 minutos para Google Ads (más corto)
    maxEntries: 10,
    strategy: 'network-first' // Siempre intentar red primero para ads
  }
};

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => self.skipWaiting())
  );
});

// Activar Service Worker y limpiar cachés antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE_NAME && 
              cacheName !== THIRD_PARTY_CACHE_NAME) {
            console.log('Eliminando caché antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Escuchar mensajes para optimizaciones específicas
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'OPTIMIZE_CLOUDFLARE_CACHE') {
    const urls = event.data.urls || [];
    const cache = caches.open(THIRD_PARTY_CACHE_NAME);
    
    urls.forEach(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const cacheInstance = await cache;
          await cacheInstance.put(url, response.clone());
          console.log('Cloudflare script cacheado:', url);
        }
      } catch (error) {
        console.log('Error cacheando script de Cloudflare:', error);
      }
    });
  }
});

// Estrategia de caché para diferentes tipos de recursos
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Solo cachear GET requests
  if (request.method !== 'GET') return;

  // Estrategia para imágenes estáticas
  if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|gif|webp|avif|svg)$/)) {
    event.respondWith(cacheFirstStrategy(request, CACHE_STRATEGIES.images));
    return;
  }

  // Estrategia para scripts y estilos propios
  if ((url.pathname.startsWith('/_next/') || url.pathname.match(/\.(js|css)$/)) && url.hostname === location.hostname) {
    event.respondWith(cacheFirstStrategy(request, CACHE_STRATEGIES.scripts));
    return;
  }

  // Estrategia específica para Google Ads (network-first para ads frescos)
  if (url.hostname.includes('googlesyndication.com')) {
    event.respondWith(networkFirstStrategy(request, CACHE_STRATEGIES.googleAds));
    return;
  }

  // Estrategia para otros recursos de terceros (Cloudflare, etc.)
  if (url.hostname.includes('cloudflareinsights.com') ||
      url.hostname.includes('cloudflare.com') ||
      url.pathname.includes('rocket-loader.min.js') ||
      url.pathname.includes('beacon.min.js')) {
    
    // Caché más agresivo para scripts específicos de Cloudflare
    const cloudflareStrategy = {
      cacheName: THIRD_PARTY_CACHE_NAME,
      maxAge: 86400, // 24 horas para scripts estables de Cloudflare
      maxEntries: 50
    };
    
    event.respondWith(staleWhileRevalidateStrategy(request, cloudflareStrategy));
    return;
  }

  // Estrategia para páginas HTML
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }
});

// Cache First Strategy (mejor para recursos estáticos)
async function cacheFirstStrategy(request, strategy) {
  const cache = await caches.open(strategy.cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Error en cache first:', error);
    return new Response('Recurso no disponible', { status: 404 });
  }
}

// Network First Strategy (mejor para HTML)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Página no disponible', { status: 404 });
  }
}

// Stale While Revalidate Strategy (mejor para terceros)
async function staleWhileRevalidateStrategy(request, strategy) {
  const cache = await caches.open(strategy.cacheName);
  const cachedResponse = await cache.match(request);
  
  // Función para actualizar caché en background
  const fetchAndCache = async () => {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      console.log('Error actualizando caché:', error);
    }
  };
  
  // Si hay respuesta en caché, devolverla inmediatamente y actualizar en background
  if (cachedResponse) {
    fetchAndCache(); // No await - actualiza en background
    return cachedResponse;
  }
  
  // Si no hay caché, esperar por la red
  return fetchAndCache();
}
