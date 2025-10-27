import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, authorizeRequest, JWTPayload } from './jwt-utils';

/**
 * Middleware para proteger rutas que requieren autenticación
 */
export function withAuth<T extends unknown[]>(
  handler: (request: NextRequest, user: JWTPayload, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const authResult = authenticateRequest(request);
    
    if (!authResult.isAuthenticated) {
      return NextResponse.json({
        error: 'Authentication required',
        details: authResult.error
      }, { status: 401 });
    }

    return handler(request, authResult.user!, ...args);
  };
}

/**
 * Middleware para proteger rutas que requieren un rol específico
 */
export function withRole<T extends unknown[]>(
  requiredRole: 'admin' | 'moderator' | 'user',
  handler: (request: NextRequest, user: JWTPayload, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const authResult = authorizeRequest(request, requiredRole);
    
    if (!authResult.isAuthorized) {
      return NextResponse.json({
        error: 'Insufficient permissions',
        details: authResult.error,
        required: requiredRole,
        current: authResult.user?.role || 'none'
      }, { status: 403 });
    }

    return handler(request, authResult.user!, ...args);
  };
}

/**
 * Middleware para proteger rutas de administrador
 */
export function withAdmin<T extends unknown[]>(
  handler: (request: NextRequest, user: JWTPayload, ...args: T) => Promise<NextResponse>
) {
  return withRole('admin', handler);
}

/**
 * Middleware para proteger rutas de moderador o superior
 */
export function withModerator<T extends unknown[]>(
  handler: (request: NextRequest, user: JWTPayload, ...args: T) => Promise<NextResponse>
) {
  return withRole('moderator', handler);
}

/**
 * Middleware para verificar que el usuario puede acceder a sus propios datos o es admin
 */
export function withSelfOrAdmin<T extends unknown[]>(
  getUserIdFromRequest: (request: NextRequest, ...args: T) => string,
  handler: (request: NextRequest, user: JWTPayload, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const authResult = authenticateRequest(request);
    
    if (!authResult.isAuthenticated) {
      return NextResponse.json({
        error: 'Authentication required',
        details: authResult.error
      }, { status: 401 });
    }

    const targetUserId = getUserIdFromRequest(request, ...args);
    const currentUser = authResult.user!;
    
    // Permitir si es el propio usuario o es admin
    if (currentUser.userId !== targetUserId && currentUser.role !== 'admin') {
      return NextResponse.json({
        error: 'Access denied. You can only access your own data or be an admin.',
        targetUser: targetUserId,
        currentUser: currentUser.userId,
        currentRole: currentUser.role
      }, { status: 403 });
    }

    return handler(request, currentUser, ...args);
  };
}

/**
 * Utilidad para extraer el ID de usuario de los parámetros de ruta
 */
export function extractUserIdFromParams(_request: NextRequest, _context: { params: Promise<{ id: string }> }): string {
  // Esta función se usará en las rutas que tienen parámetros dinámicos
  // El ID real se extrae en el handler de la ruta
  return 'placeholder';
}

/**
 * Middleware de logging de seguridad
 */
export function withSecurityLogging<T extends unknown[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const startTime = Date.now();
    const method = request.method;
    const url = request.url;
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ip = request.headers.get('x-forwarded-for') || 
              request.headers.get('x-real-ip') || 
              'unknown';

    console.log(`[SECURITY] ${method} ${url} - IP: ${ip} - UserAgent: ${userAgent.substring(0, 100)}`);

    try {
      const response = await handler(request, ...args);
      const duration = Date.now() - startTime;
      
      console.log(`[SECURITY] ${method} ${url} - Status: ${response.status} - Duration: ${duration}ms`);
      
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[SECURITY] ${method} ${url} - ERROR: ${error} - Duration: ${duration}ms`);
      throw error;
    }
  };
}

/**
 * Middleware combinado para rutas de administrador con logging
 */
export function withSecureAdmin<T extends unknown[]>(
  handler: (request: NextRequest, user: JWTPayload, ...args: T) => Promise<NextResponse>
) {
  return withSecurityLogging(withAdmin(handler));
}

/**
 * Middleware combinado para rutas de usuario con logging
 */
export function withSecureAuth<T extends unknown[]>(
  handler: (request: NextRequest, user: JWTPayload, ...args: T) => Promise<NextResponse>
) {
  return withSecurityLogging(withAuth(handler));
}