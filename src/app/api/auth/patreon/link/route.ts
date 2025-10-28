import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/postgres-db';

export const runtime = 'nodejs';

// Endpoint interno para persistir vinculación de Patreon
export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get('origin') || '';
    const referer = request.headers.get('referer') || '';

    console.log('Patreon link request:', { origin, referer });

    const allowedOrigin = origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('true-farming.com');
    const allowedReferer = referer.includes('/auth/patreon') || referer.includes('/profile') || referer.includes('localhost') || referer.includes('true-farming.com');

    if (!allowedOrigin && !allowedReferer) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { email, patreonId, patreonTier, patreonStatus } = body as { email?: string; patreonId?: string; patreonTier?: string | null; patreonStatus?: 'active_patron' | 'declined_patron' | 'former_patron' | null };

    if (!email || !patreonId) {
      return NextResponse.json({ error: 'email y patreonId son requeridos' }, { status: 400 });
    }

    // Actualizar por email (evita requerir JWT en este flujo específico controlado)
    const result = await pool.query(
      `UPDATE users
       SET patreon_id = $1,
           patreon_tier = $2::text,
           patreon_status = $3::text,
           patreon_active = CASE WHEN $3::text = 'active_patron' THEN TRUE ELSE FALSE END,
           updated_at = NOW()
       WHERE email = $4
       RETURNING id, email, username, role, is_active as "isActive",
                 created_at as "createdAt", updated_at as "updatedAt",
                 discord_id as "discordId", gw2_api_key as "gw2ApiKey",
                 patreon_id as "patreonId", patreon_tier as "patreonTier", patreon_status as "patreonStatus", patreon_active as "patreonActive", preferences`,
      [patreonId, patreonTier ?? null, patreonStatus ?? null, email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const row = result.rows[0];
    return NextResponse.json({
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    });
  } catch (error) {
    console.error('Error linking Patreon:', error);
    return NextResponse.json({
      error: 'Error linking Patreon',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}


