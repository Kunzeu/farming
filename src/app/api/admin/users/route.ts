import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/postgres-db';
import { authorizeRequest } from '@/lib/server/jwt-utils';

// API para administradores - Lista todos los usuarios
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación y autorización (solo administradores)
    const authResult = authorizeRequest(request, 'admin');
    
    if (!authResult.isAuthorized) {
      console.log('Unauthorized admin users request:', authResult.error);
      return NextResponse.json({ 
        error: 'Unauthorized. Admin access required to list all users.',
        details: authResult.error
      }, { status: 401 });
    }

    console.log(`Admin user ${authResult.user?.username} (${authResult.user?.email}) accessing users list`);

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
