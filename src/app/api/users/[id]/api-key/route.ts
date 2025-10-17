import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { pool } from '@/lib/postgres-db';

// GET - Obtener API key del usuario (solo el usuario puede ver su propia API key)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Verificar que el usuario solo puede acceder a su propia API key
    if (userId !== id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const query = `
      SELECT gw2_api_key as "gw2ApiKey"
      FROM users 
      WHERE id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];
    
    return NextResponse.json({
      hasApiKey: !!user.gw2ApiKey,
      apiKey: user.gw2ApiKey ? user.gw2ApiKey.substring(0, 8) + '...' : null // Solo mostrar los primeros 8 caracteres por seguridad
    });

  } catch (error) {
    console.error('Error fetching user API key:', error);
    return NextResponse.json({ 
      error: 'Error fetching API key',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// PUT - Actualizar API key del usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Verificar que el usuario solo puede actualizar su propia API key
    if (userId !== id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    // Validar formato básico de API key de GW2 (formato muy flexible)
    // Las API keys de GW2 pueden tener diferentes formatos y longitudes
    // Acepta cualquier combinación de grupos de 4-20 caracteres hex separados por guiones
    const apiKeyRegex = /^[A-F0-9]{4,20}(-[A-F0-9]{4,20}){3,10}$/i;
    if (!apiKeyRegex.test(apiKey)) {
      return NextResponse.json({ error: 'Invalid API key format' }, { status: 400 });
    }

    // Verificar que la API key es válida haciendo una llamada a la API de GW2
    try {
      const validationResponse = await fetch(`https://api.guildwars2.com/v2/tokeninfo?access_token=${apiKey}`);
      if (!validationResponse.ok) {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 400 });
      }
    } catch (error) {
      return NextResponse.json({ error: 'Failed to validate API key' }, { status: 400 });
    }

    const query = `
      UPDATE users 
      SET gw2_api_key = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING id, email, username, role, is_active as "isActive",
                created_at as "createdAt", updated_at as "updatedAt", discord_id as "discordId"
    `;
    
    const result = await pool.query(query, [apiKey, id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];
    
    return NextResponse.json({
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt)
    });

  } catch (error) {
    console.error('Error updating user API key:', error);
    return NextResponse.json({ 
      error: 'Error updating API key',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// DELETE - Eliminar API key del usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Verificar que el usuario solo puede eliminar su propia API key
    if (userId !== id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const query = `
      UPDATE users 
      SET gw2_api_key = NULL, updated_at = NOW()
      WHERE id = $1
      RETURNING id, email, username, role, is_active as "isActive",
                created_at as "createdAt", updated_at as "updatedAt", discord_id as "discordId"
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = result.rows[0];
    
    return NextResponse.json({
      ...user,
      createdAt: new Date(user.createdAt),
      updatedAt: new Date(user.updatedAt)
    });

  } catch (error) {
    console.error('Error deleting user API key:', error);
    return NextResponse.json({ 
      error: 'Error deleting API key',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
