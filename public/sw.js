const CACHE_NAME = 'true-farming-v1.8';
const STATIC_CACHE_NAME = 'true-farming-static-v1.8';
const THIRD_PARTY_CACHE_NAME = 'true-farming-third-party-v1.8';

const CRITICAL_RESOURCES = [
  '/',
  '/images/backgrounds/voe-background.webp', // LCP Image - Primera prioridad
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
          // Eliminar TODOS los cachés que no sean los actuales
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE_NAME && 
              cacheName !== THIRD_PARTY_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Forzar que todas las pestañas usen este service worker inmediatamente
      return self.clients.claim();
    })
  );
});

// Escuchar mensajes para optimizaciones específicas
self.addEventListener('message', (event) => {
  // Forzar activación inmediata del nuevo service worker
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }
  
  // Limpiar todos los cachés
  if (event.data && event.data.type === 'CLEAR_ALL_CACHES') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
    return;
  }
  
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
  
  // Solo cachear GET requests
  if (request.method !== 'GET') return;
  
  let url;
  try {
    url = new URL(request.url);
  } catch {
    // URL inválida, dejar que el navegador lo maneje
    return;
  }

  // Estrategia para imágenes estáticas
  if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|gif|webp|avif|svg)$/)) {
    event.respondWith(
      cacheFirstStrategy(request, CACHE_STRATEGIES.images)
        .catch(() => fetch(request))
    );
    return;
  }

  // Estrategia para scripts y estilos propios (network-first para evitar archivos obsoletos)
  if ((url.pathname.startsWith('/_next/') || url.pathname.match(/\.(js|css)$/)) && url.hostname === location.hostname) {
    event.respondWith(
      networkFirstWithValidation(request, CACHE_STRATEGIES.scripts)
        .catch(() => fetch(request))
    );
    return;
  }

  // Estrategia específica para Google Ads (network-first para ads frescos)
  if (url.hostname.includes('googlesyndication.com')) {
    event.respondWith(
      networkFirstStrategy(request)
        .catch(() => new Response('Ad blocked', { status: 204 }))
    );
    return;
  }

  // Estrategia para otros recursos de terceros (Cloudflare, etc.)
  if (url.hostname.includes('cloudflareinsights.com') ||
      url.hostname.includes('cloudflare.com') ||
      url.pathname.includes('rocket-loader.min.js') ||
      url.pathname.includes('beacon.min.js')) {
    
    // Para terceros, si fallan simplemente pasar al navegador
    event.respondWith(
      fetch(request)
        .catch(() => new Response('Third party unavailable', { status: 503 }))
    );
    return;
  }

  // Estrategia para páginas HTML (siempre red primero para obtener versiones frescas)
  if (request.headers.get('accept') && request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      networkFirstStrategy(request)
        .catch(() => fetch(request))
    );
    return;
  }
});

// Cache First Strategy (mejor para recursos estáticos como imágenes)
async function cacheFirstStrategy(request, strategy) {
  try {
    const cache = await caches.open(strategy.cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.ok) {
      try {
        await cache.put(request, networkResponse.clone());
      } catch {
        // Fallo al cachear, continuar
      }
    }
    
    return networkResponse || new Response('Not found', { status: 404 });
  } catch {
    // Si todo falla, retornar error
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
    return networkResponse || new Response('Not found', { status: 404 });
  } catch {
    try {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(request);
      return cachedResponse || new Response('Página no disponible', { status: 404 });
    } catch {
      return new Response('Service unavailable', { status: 503 });
    }
  }
}

// Network First con validación de MIME type (para CSS/JS de Next.js)
async function networkFirstWithValidation(request, strategy) {
  try {
    const cache = await caches.open(strategy.cacheName);
    
    try {
      const networkResponse = await fetch(request);
      
      if (networkResponse && networkResponse.ok) {
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
          try {
            await cache.put(request, networkResponse.clone());
          } catch {
            // Fallo al cachear, continuar
          }
        } else if (isCss || isJs) {
          // Eliminar del caché si existe con MIME incorrecto
          try {
            await cache.delete(request);
          } catch {
            // Fallo al eliminar, continuar
          }
        }
        
        return networkResponse;
      } else if (networkResponse && networkResponse.status === 404) {
        // Si es 404, eliminar del caché
        try {
          await cache.delete(request);
        } catch {
          // Fallo al eliminar, continuar
        }
        return networkResponse;
      }
      
      return networkResponse || new Response('Not found', { status: 404 });
    } catch {
      // Si falla la red, intentar caché
      try {
        const cachedResponse = await cache.match(request);
        return cachedResponse || new Response('Network error', { status: 408 });
      } catch {
        return new Response('Network error', { status: 408 });
      }
    }
  } catch {
    // Si falla todo (incluido abrir caché)
    return new Response('Service unavailable', { status: 503 });
  }
}

