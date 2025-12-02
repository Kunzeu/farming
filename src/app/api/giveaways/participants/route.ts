import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/postgres-db';

export const runtime = 'nodejs';

// GET /api/giveaways/participants - Get participants for a specific giveaway or user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const giveawayId = searchParams.get('giveawayId');
    const userId = searchParams.get('userId');

    // If only userId is provided, get all participations for that user
    if (userId && !giveawayId) {
      const query = `
        SELECT 
          gp.*,
          u.email as user_email
        FROM giveaway_participants gp
        JOIN users u ON gp.user_id = u.id
        WHERE gp.user_id = $1
        ORDER BY gp.participated_at DESC
      `;

      const result = await pool.query(query, [userId]);

      const participants = result.rows.map(row => ({
        id: row.id,
        giveawayId: row.giveaway_id,
        userId: row.user_id,
        accountName: row.account_name,
        participatedAt: row.participated_at
      }));

      return NextResponse.json({ participants });
    }

    // If neither giveawayId nor userId is provided, return error
    if (!giveawayId && !userId) {
      return NextResponse.json(
        { error: 'Giveaway ID or User ID is required' },
        { status: 400 }
      );
    }

    let query = `
      SELECT 
        gp.*,
        u.email as user_email
      FROM giveaway_participants gp
      JOIN users u ON gp.user_id = u.id
      WHERE gp.giveaway_id = $1
    `;

    const params: (string | number)[] = [giveawayId!]; // giveawayId is guaranteed to exist here
    let paramCount = 1;

    if (userId) {
      query += ` AND gp.user_id = $${++paramCount}`;
      params.push(userId);
    }

    query += ` ORDER BY gp.participated_at DESC`;

    const result = await pool.query(query, params);

    const participants = result.rows.map(row => ({
      id: row.id,
      giveawayId: row.giveaway_id,
      userId: row.user_id,
      accountName: row.account_name,
      participatedAt: row.participated_at
    }));

    return NextResponse.json(
      { participants },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participants' },
      { status: 500 }
    );
  }
}

// POST /api/giveaways/participants - Participate in a giveaway
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { giveawayId, userId, accountName } = body;

    if (!giveawayId || !userId || !accountName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already participated
    const existingParticipant = await pool.query(
      'SELECT id FROM giveaway_participants WHERE giveaway_id = $1 AND user_id = $2',
      [giveawayId, userId]
    );

    if (existingParticipant.rows.length > 0) {
      return NextResponse.json(
        { error: 'User has already participated in this giveaway' },
        { status: 409 }
      );
    }

    // Add participant
    const result = await pool.query(`
      INSERT INTO giveaway_participants (giveaway_id, user_id, account_name)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [giveawayId, userId, accountName]);

    const participant = {
      id: result.rows[0].id,
      giveawayId: result.rows[0].giveaway_id,
      userId: result.rows[0].user_id,
      accountName: result.rows[0].account_name,
      participatedAt: result.rows[0].participated_at
    };

    return NextResponse.json({ participant }, { status: 201 });
  } catch (error) {
    console.error('Error participating in giveaway:', error);
    return NextResponse.json(
      { error: 'Failed to participate in giveaway' },
      { status: 500 }
    );
  }
}

// DELETE /api/giveaways/participants - Remove participation
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const giveawayId = searchParams.get('giveawayId');
    const userId = searchParams.get('userId');

    if (!giveawayId || !userId) {
      return NextResponse.json(
        { error: 'Giveaway ID and User ID are required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'DELETE FROM giveaway_participants WHERE giveaway_id = $1 AND user_id = $2 RETURNING *',
      [giveawayId, userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Participation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Participation removed successfully' });
  } catch (error) {
    console.error('Error removing participation:', error);
    return NextResponse.json(
      { error: 'Failed to remove participation' },
      { status: 500 }
    );
  }
}
