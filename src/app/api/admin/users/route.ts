import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/postgres-db';

// API interna para administradores - Lista todos los usuarios
export async function GET(request: NextRequest) {
  try {
    // API interna para administradores - verificación simplificada
    // En producción, esto debería tener autenticación JWT real
    const referer = request.headers.get('referer');
    const origin = request.headers.get('origin');
    
    // Permitir peticiones desde el mismo dominio o localhost
    const isAllowedOrigin = !origin || origin && (
      origin.includes('true-farming.com') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('vercel.app')
    );
    
    const isAllowedReferer = !referer || referer && (
      referer.includes('/admin') ||
      referer.includes('localhost') ||
      referer.includes('127.0.0.1') ||
      referer.includes('true-farming.com') ||
      referer.includes('vercel.app')
    );
    
    // Permitir si es del origen correcto o tiene referer correcto
    // En desarrollo, ser más permisivo
    const isDev = process.env.NODE_ENV === 'development';
    if (!isDev && !isAllowedOrigin && !isAllowedReferer) {
      console.log('Unauthorized request:', { origin, referer });
      return NextResponse.json({ 
        error: 'Unauthorized. This endpoint is only accessible from the admin panel.' 
      }, { status: 403 });
    }
    
    // En desarrollo, permitir todas las peticiones
    if (isDev) {
      console.log('Development mode - allowing request');
    }

    const query = `
      SELECT id, email, username, role, is_active as "isActive",
             created_at as "createdAt", updated_at as "updatedAt", discord_id as "discordId",
             gw2_api_key as "gw2ApiKey"
      FROM users 
      ORDER BY created_at DESC
    `;
    
    const result = await pool.query(query);
    const users = result.rows.map(row => ({
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    }));

    return NextResponse.json(users, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error fetching users for admin:', error);
    return NextResponse.json({ 
      error: 'Error fetching users', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
