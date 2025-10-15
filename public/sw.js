const CACHE_NAME = 'true-farming-v1.5';
const STATIC_CACHE_NAME = 'true-farming-static-v1.5';
const THIRD_PARTY_CACHE_NAME = 'true-farming-third-party-v1.5';

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
        // Cachear recursos críticos, ignorando errores en archivos individuales
        return Promise.allSettled(
          CRITICAL_RESOURCES.map(url => 
            cache.add(url).catch(() => {
              // Silently fail individual resources
            })
          )
        );
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
        }
      } catch {
        // Silently fail if caching optimization fails
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

  // Estrategia para scripts y estilos propios (network-first para evitar archivos obsoletos)
  if ((url.pathname.startsWith('/_next/') || url.pathname.match(/\.(js|css)$/)) && url.hostname === location.hostname) {
    event.respondWith(networkFirstWithValidation(request, CACHE_STRATEGIES.scripts));
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

  // Estrategia para páginas HTML (siempre red primero para obtener versiones frescas)
  if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }
});

// Cache First Strategy (mejor para recursos estáticos como imágenes)
async function cacheFirstStrategy(request, strategy) {
  const cache = await caches.open(strategy.cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Validar MIME type antes de cachear
      const contentType = networkResponse.headers.get('content-type') || '';
      const isValidMimeType = 
        contentType.includes('javascript') ||
        contentType.includes('css') ||
        contentType.includes('json') ||
        contentType.includes('image') ||
        contentType.includes('font') ||
        contentType.includes('woff');
      
      if (isValidMimeType) {
        cache.put(request, networkResponse.clone());
      }
    }
    
    return networkResponse;
  } catch {
    // Si falla el fetch, retornar error
    return new Response('Network error', { 
      status: 408, 
      statusText: 'Request Timeout' 
    });
  }
}

// Network First Strategy (mejor para HTML - no cachear para obtener siempre referencias actualizadas)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    // No cachear HTML para evitar referencias a archivos CSS/JS antiguos
    return networkResponse;
  } catch {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('Página no disponible', { status: 404 });
  }
}

// Network First con validación de MIME type (para CSS/JS de Next.js)
async function networkFirstWithValidation(request, strategy) {
  const cache = await caches.open(strategy.cacheName);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const contentType = networkResponse.headers.get('content-type') || '';
      const url = new URL(request.url);
      
      // Validar que el MIME type coincida con el tipo de archivo
      const isCss = url.pathname.endsWith('.css');
      const isJs = url.pathname.endsWith('.js');
      
      const validMimeType = 
        (isCss && (contentType.includes('text/css') || contentType.includes('text/stylesheet'))) ||
        (isJs && (contentType.includes('javascript') || contentType.includes('application/javascript')));
      
      if (validMimeType) {
        // Solo cachear si el MIME type es correcto
        cache.put(request, networkResponse.clone());
        return networkResponse;
      } else if (isCss || isJs) {
        // Si es un archivo CSS/JS pero tiene MIME type incorrecto, NO retornarlo
        // Eliminar del caché si existe
        cache.delete(request);
        console.warn(`Rechazado archivo con MIME incorrecto: ${url.pathname} (${contentType})`);
        return new Response('Invalid MIME type', { status: 415 });
      }
      
      return networkResponse;
    } else if (networkResponse.status === 404) {
      // Si es 404, eliminar del caché
      cache.delete(request);
      return networkResponse;
    }
    
    return networkResponse;
  } catch {
    // Si falla la red, intentar caché pero validar MIME type
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      const contentType = cachedResponse.headers.get('content-type') || '';
      const url = new URL(request.url);
      const isCss = url.pathname.endsWith('.css');
      const isJs = url.pathname.endsWith('.js');
      
      const validMimeType = 
        (isCss && (contentType.includes('text/css') || contentType.includes('text/stylesheet'))) ||
        (isJs && (contentType.includes('javascript') || contentType.includes('application/javascript')));
      
      if (validMimeType) {
        return cachedResponse;
      } else {
        // Eliminar caché inválido
        cache.delete(request);
      }
    }
    
    return new Response('Network error', { 
      status: 408, 
      statusText: 'Request Timeout' 
    });
  }
}

// Stale While Revalidate Strategy (mejor para terceros y archivos de Next.js)
async function staleWhileRevalidateStrategy(request, strategy) {
  const cache = await caches.open(strategy.cacheName);
  const cachedResponse = await cache.match(request);
  
  // Función para actualizar caché en background
  const fetchAndCache = async () => {
    try {
      const networkResponse = await fetch(request);
      
      if (networkResponse.ok) {
        // Validar MIME type antes de cachear
        const contentType = networkResponse.headers.get('content-type') || '';
        const isValidMimeType = 
          contentType.includes('javascript') ||
          contentType.includes('css') ||
          contentType.includes('json') ||
          contentType.includes('image');
        
        if (isValidMimeType) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } else if (networkResponse.status === 404) {
        // Si hay 404, eliminar del caché si existe
        if (cachedResponse) {
          cache.delete(request);
        }
        return networkResponse;
      }
      
      return networkResponse;
    } catch {
      // Si falla el fetch y tenemos caché, usar caché
      if (cachedResponse) {
        return cachedResponse;
      }
      // Si no hay caché, retornar error de red
      return new Response('Network error', { 
        status: 408, 
        statusText: 'Request Timeout' 
      });
    }
  };
  
  // Si hay respuesta en caché, devolverla inmediatamente y actualizar en background
  if (cachedResponse) {
    // Actualizar en background pero capturar errores para evitar uncaught promises
    fetchAndCache().catch(() => {
      // Silently fail background update
    });
    return cachedResponse;
  }
  
  // Si no hay caché, esperar por la red
  try {
    return await fetchAndCache();
  } catch {
    return new Response('Service unavailable', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}
