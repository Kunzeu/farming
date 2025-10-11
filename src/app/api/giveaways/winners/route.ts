import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/postgres-db';
import { getAllGiveaways } from '../../../../config/giveaways';

// GET /api/giveaways/winners - Get winners
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const giveawayId = searchParams.get('giveawayId');
    const latest = searchParams.get('latest');

    // Obtener configuración de sorteos
    const configuredGiveaways = getAllGiveaways();
    
    let query = `
      SELECT 
        gw.giveaway_id,
        gw.position,
        gw.account_name,
        gw.prize_description,
        gw.prize_value,
        gw.announced_at
      FROM giveaway_winners gw
    `;
    
    const params: (string | number)[] = [];
    let paramCount = 0;

    if (giveawayId) {
      query += ` WHERE gw.giveaway_id = $${++paramCount}`;
      params.push(giveawayId);
    }

    query += ` ORDER BY gw.announced_at DESC, gw.position ASC`;

    if (latest === 'true') {
      query += ` LIMIT 10`;
    }

    const result = await pool.query(query, params);
    
    // Combinar datos de ganadores con configuración de sorteos
    const winners = result.rows.map(row => {
      const giveaway = configuredGiveaways.find(g => g.id === row.giveaway_id);
      return {
        giveawayId: row.giveaway_id,
        giveawayTitle: giveaway?.title || 'Sorteo Desconocido',
        giveawaySlug: giveaway?.slug || 'unknown',
        winnersAnnouncedAt: row.announced_at, // Usar announced_at como fecha de anuncio
        position: row.position,
        accountName: row.account_name,
        prizeDescription: row.prize_description,
        prizeValue: row.prize_value,
        announcedAt: row.announced_at
      };
    });

    return NextResponse.json({ winners });
  } catch (error) {
    console.error('Error fetching winners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch winners' },
      { status: 500 }
    );
  }
}

// POST /api/giveaways/winners - Announce winners (Admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { giveawayId, winnersData } = body;

    if (!giveawayId || !winnersData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert winners directly into giveaway_winners table
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const winner of winnersData) {
        await client.query(`
          INSERT INTO giveaway_winners (
            giveaway_id, user_id, account_name, position, 
            prize_description, prize_value, announced_at
          ) VALUES ($1, $2, $3, $4, $5, $6, NOW())
          ON CONFLICT (giveaway_id, position) DO UPDATE SET
            user_id = EXCLUDED.user_id,
            account_name = EXCLUDED.account_name,
            prize_description = EXCLUDED.prize_description,
            prize_value = EXCLUDED.prize_value,
            announced_at = NOW(),
            updated_at = NOW()
        `, [
          giveawayId,
          winner.user_id,
          winner.account_name,
          winner.position,
          winner.prize_description,
          winner.prize_value
        ]);
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    return NextResponse.json({ 
      message: 'Winners announced successfully' 
    });
  } catch (error) {
    console.error('Error announcing winners:', error);
    return NextResponse.json(
      { error: 'Failed to announce winners' },
      { status: 500 }
    );
  }
}
