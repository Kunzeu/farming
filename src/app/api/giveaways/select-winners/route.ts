import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/postgres-db';
import { getGiveawayById } from '../../../../config/giveaways';
import { authorizeRequest } from '@/lib/server/jwt-utils';

export const runtime = 'edge';;

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y autorización (solo administradores)
    const authResult = authorizeRequest(request, 'admin');
    
    if (!authResult.isAuthorized) {
      console.log('Unauthorized giveaway winner selection:', authResult.error);
      return NextResponse.json({ 
        error: 'Unauthorized. Admin access required to select winners.',
        details: authResult.error
      }, { status: 401 });
    }

    console.log(`Admin user ${authResult.user?.username} selecting giveaway winners`);

    const body = await request.json();
    const { giveawayId } = body;

    if (!giveawayId) {
      return NextResponse.json({ error: 'Giveaway ID is required' }, { status: 400 });
    }

    const giveaway = getGiveawayById(giveawayId);

    if (!giveaway) {
      return NextResponse.json({ error: 'Giveaway not found in configuration' }, { status: 404 });
    }

    // 1. Get all participants for the giveaway
    const participantsResult = await pool.query(
      'SELECT user_id, account_name FROM giveaway_participants WHERE giveaway_id = $1',
      [giveawayId]
    );
    const participants = participantsResult.rows;

    if (participants.length === 0) {
      return NextResponse.json({ message: 'No participants for this giveaway' }, { status: 200 });
    }

    // 2. Shuffle participants (Fisher-Yates algorithm)
    for (let i = participants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [participants[i], participants[j]] = [participants[j], participants[i]];
    }

    // 3. Select winners based on prize count
    const winnersToInsert = [];
    for (let i = 0; i < giveaway.prizes.length && i < participants.length; i++) {
      const participant = participants[i];
      const prize = giveaway.prizes[i];
      winnersToInsert.push({
        giveaway_id: giveawayId,
        user_id: participant.user_id,
        account_name: participant.account_name,
        position: prize.position,
        prize_description: prize.prize,
        prize_value: prize.prize
      });
    }

    if (winnersToInsert.length === 0) {
      return NextResponse.json({ message: 'No winners selected (not enough participants or prizes)' }, { status: 200 });
    }

    // 4. Insert winners into giveaway_winners table (simplified)
    for (const winner of winnersToInsert) {
      await pool.query(
        `INSERT INTO giveaway_winners (giveaway_id, user_id, account_name, position, prize_description, prize_value)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (giveaway_id, position) DO UPDATE SET
           user_id = EXCLUDED.user_id,
           account_name = EXCLUDED.account_name,
           prize_description = EXCLUDED.prize_description,
           prize_value = EXCLUDED.prize_value,
           announced_at = NOW()`,
        [winner.giveaway_id, winner.user_id, winner.account_name, winner.position, winner.prize_description, winner.prize_value]
      );
    }

    return NextResponse.json({ message: 'Winners selected and announced', winners: winnersToInsert });
  } catch (error) {
    console.error('Error selecting winners:', error);
    return NextResponse.json(
      { error: 'Failed to select winners' },
      { status: 500 }
    );
  }
}
