import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Headers básicos de optimización para todas las páginas
  const pathname = request.nextUrl.pathname;

  // Redirigir rutas basura compuestas solo por símbolos (/$, /&, etc.)
  const onlySymbols = /^[^a-zA-Z0-9\/_-]+$/;
  if (pathname !== '/' && onlySymbols.test(pathname.replaceAll('/', ''))) {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }
  
  // Para assets estáticos - cache largo
  if (pathname.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)$/)) {
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
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|ads.txt).*)',
  ],
};
