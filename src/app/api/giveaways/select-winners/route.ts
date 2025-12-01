import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/postgres-db';
import { getGiveawayById, getAllGiveawaysWithAdvent } from '../../../../config/giveaways';
import { authorizeRequest } from '@/lib/server/jwt-utils';

export const runtime = 'nodejs';

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

    // Buscar en todos los sorteos incluyendo los de adviento
    let giveaway = getGiveawayById(giveawayId);
    if (!giveaway) {
      // Si no se encuentra, buscar en los sorteos de adviento
      const allGiveaways = getAllGiveawaysWithAdvent(2025);
      giveaway = allGiveaways.find(g => g.id === giveawayId);
    }

    if (!giveaway) {
      return NextResponse.json({ error: 'Giveaway not found in configuration' }, { status: 404 });
    }

    // Verificar que el sorteo tenga premios configurados
    if (!giveaway.prizes || giveaway.prizes.length === 0) {
      return NextResponse.json({ 
        error: 'Este sorteo no tiene premios configurados. Por favor configura los premios primero.',
        details: 'No prizes configured for this giveaway'
      }, { status: 400 });
    }

    // 1. Get all participants for the giveaway
    const participantsResult = await pool.query(
      'SELECT user_id, account_name FROM giveaway_participants WHERE giveaway_id = $1',
      [giveawayId]
    );
    const participants = participantsResult.rows;

    if (participants.length === 0) {
      return NextResponse.json({ 
        message: 'No participants for this giveaway',
        error: 'No hay participantes en este sorteo'
      }, { status: 200 });
    }

    // 2. Shuffle participants (Fisher-Yates algorithm)
    for (let i = participants.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [participants[i], participants[j]] = [participants[j], participants[i]];
    }

    // 3. Select winners based on prize count
    const winnersToInsert = [];
    const prizeCount = giveaway.prizes.length;
    const participantCount = participants.length;
    
    for (let i = 0; i < prizeCount && i < participantCount; i++) {
      const participant = participants[i];
      const prize = giveaway.prizes[i];
      
      // Crear descripción completa del premio
      let prizeDescription = prize.prize;
      if (prize.gemPrize) {
        prizeDescription = `${prize.prize} Gems`;
      } else if (prize.quantity && prize.itemId) {
        // Para items, la descripción será más detallada (se puede mejorar con nombre del item)
        prizeDescription = `${prize.quantity}x Item ${prize.itemId}`;
      }
      
      winnersToInsert.push({
        giveaway_id: giveawayId,
        user_id: participant.user_id,
        account_name: participant.account_name,
        position: prize.position,
        prize_description: prizeDescription,
        prize_value: prize.prize
      });
    }

    if (winnersToInsert.length === 0) {
      return NextResponse.json({ 
        error: 'No se pudieron seleccionar ganadores',
        message: `No se pudieron seleccionar ganadores. El sorteo tiene ${participantCount} participantes pero ${prizeCount} premios configurados.`,
        details: `Participants: ${participantCount}, Prizes: ${prizeCount}`
      }, { status: 400 });
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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        error: 'Error al seleccionar ganadores',
        details: errorMessage,
        message: 'Ocurrió un error inesperado al seleccionar los ganadores. Por favor intenta de nuevo.'
      },
      { status: 500 }
    );
  }
}
