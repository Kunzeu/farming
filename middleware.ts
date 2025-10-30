import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SECURITY_CONFIG, getRequiredAuthLevel } from '@/lib/server/security-config';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Headers básicos de optimización para todas las páginas
  const pathname = request.nextUrl.pathname;
  const method = request.method;
  const isProduction = process.env.NODE_ENV === 'production';

  // Aplicar headers de seguridad a todas las respuestas
  Object.entries(SECURITY_CONFIG.SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Logging de seguridad para rutas sensibles
  if (pathname.startsWith('/api/')) {
    const requiredAuthLevel = getRequiredAuthLevel(pathname, method);
    const ip = request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown';
    
    if (requiredAuthLevel !== 'none') {
      console.log(`[SECURITY-MIDDLEWARE] ${method} ${pathname} - Required: ${requiredAuthLevel} - IP: ${ip}`);
    }
  }
  
  // Pasar la ruta actual a los headers para metadata dinámico
  response.headers.set('x-pathname', pathname);

  // Redirigir rutas basura compuestas solo por símbolos (/$, /&, etc.)
  const onlySymbols = /^[^a-zA-Z0-9\/_-]+$/;
  if (pathname !== '/' && onlySymbols.test(pathname.replaceAll('/', ''))) {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }
  
  // Para APIs dinámicas - sin caché en producción
  if (pathname.startsWith('/api/')) {
    if (pathname.startsWith('/api/farms/') || 
        pathname.startsWith('/api/revalidate/') ||
        pathname.startsWith('/api/admin/') ||
        pathname.startsWith('/api/users/') ||
        pathname.startsWith('/api/auth/') ||
        pathname.startsWith('/api/giveaways/')) {
      
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      response.headers.set('Pragma', 'no-cache');
      response.headers.set('Expires', '0');
      
      if (isProduction) {
        response.headers.set('Surrogate-Control', 'no-store');
        response.headers.set('CDN-Cache-Control', 'no-cache');
        response.headers.set('Cloudflare-CDN-Cache-Control', 'no-cache');
      }
    }
  }
  
  // Para assets estáticos - cache largo
  else if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
  
  // Para páginas dinámicas - cache corto con revalidación
  else if (pathname.startsWith('/opened/') || 
           pathname.startsWith('/salvage/') || 
           pathname.startsWith('/account/') ||
           pathname.startsWith('/festivals/')) {
    response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
  }
  
  // Para farming-routes - cache muy corto en producción
  else if (pathname === '/farming-routes') {
    if (isProduction) {
      response.headers.set('Cache-Control', 'public, max-age=10, stale-while-revalidate=30');
    } else {
      response.headers.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
    }
  }
  
  // Para página principal - cache muy corto
  else if (pathname === '/') {
    response.headers.set('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
  }
  
  // Headers de seguridad básicos
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

export const config = {
  // Desactivado para reducir Edge Requests; headers ya están en next.config.js
  matcher: [],
};
