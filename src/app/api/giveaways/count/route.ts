import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/postgres-db';

export const runtime = 'nodejs';

// GET /api/giveaways/count - Get participant count for giveaways
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const giveawayId = searchParams.get('giveawayId');

    if (!giveawayId) {
      return NextResponse.json(
        { error: 'Giveaway ID is required' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'SELECT COUNT(*) as count FROM giveaway_participants WHERE giveaway_id = $1',
      [giveawayId]
    );

    const count = parseInt(result.rows[0].count);

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching participant count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch participant count' },
      { status: 500 }
    );
  }
}
