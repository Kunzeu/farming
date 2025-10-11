import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/postgres-db';

// POST - Validar API key y obtener información de la cuenta
export async function POST(
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

    // Verificar que el usuario solo puede validar su propia API key
    if (userId !== id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Obtener la API key del usuario desde la base de datos
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
    
    if (!user.gw2ApiKey) {
      return NextResponse.json({ 
        valid: false, 
        error: 'No API key found' 
      }, { status: 404 });
    }

    // Validar la API key con la API de GW2
    try {
      const [tokenResponse, accountResponse] = await Promise.all([
        fetch(`https://api.guildwars2.com/v2/tokeninfo?access_token=${user.gw2ApiKey}`),
        fetch(`https://api.guildwars2.com/v2/account?access_token=${user.gw2ApiKey}`)
      ]);

      if (!tokenResponse.ok || !accountResponse.ok) {
        return NextResponse.json({ 
          valid: false, 
          error: 'Invalid API key' 
        }, { status: 400 });
      }

      const [tokenInfo, accountInfo] = await Promise.all([
        tokenResponse.json(),
        accountResponse.json()
      ]);

      return NextResponse.json({
        valid: true,
        accountInfo: {
          id: accountInfo.id,
          name: accountInfo.name,
          world: accountInfo.world,
          created: accountInfo.created,
          access: accountInfo.access
        },
        tokenInfo: {
          id: tokenInfo.id,
          name: tokenInfo.name,
          permissions: tokenInfo.permissions
        }
      });

    } catch (error) {
      console.error('Error validating API key:', error);
      return NextResponse.json({ 
        valid: false, 
        error: 'Failed to validate API key' 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error validating user API key:', error);
    return NextResponse.json({ 
      error: 'Error validating API key',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
