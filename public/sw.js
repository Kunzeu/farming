// No-op Service Worker para evitar 404 sin activar PWA
// No cachea ni intercepta requests
self.addEventListener('install', (event) => {
  // Activación inmediata
  // @ts-ignore
  self.skipWaiting?.();
});

self.addEventListener('activate', (event) => {
  // Reclamar clientes y no hacer nada más
  // @ts-ignore
  self.clients?.claim?.();
});

self.addEventListener('fetch', () => {
  // No interceptar nada
});


