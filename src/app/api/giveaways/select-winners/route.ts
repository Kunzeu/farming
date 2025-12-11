import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/postgres-db';
import { getGiveawayById, getAllGiveawaysWithAdvent, getItemInfo } from '../../../../config/giveaways';
import { authorizeRequest } from '@/lib/server/jwt-utils';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y autorización (solo administradores)
    const authResult = authorizeRequest(request, 'admin');

    // Logging detallado para diagnóstico
    console.log('=== AUTHORIZATION DEBUG ===');
    console.log('Is Authorized:', authResult.isAuthorized);
    console.log('User:', authResult.user);
    console.log('Error:', authResult.error);
    console.log('User Role:', authResult.user?.role);
    console.log('User Username:', authResult.user?.username);
    console.log('User Active:', authResult.user?.isActive);
    console.log('=========================');

    if (!authResult.isAuthorized) {
      console.log('Unauthorized giveaway winner selection:', authResult.error);
      return NextResponse.json({
        error: 'Unauthorized. Admin access required to select winners.',
        details: authResult.error,
        debug: {
          hasUser: !!authResult.user,
          userRole: authResult.user?.role,
          username: authResult.user?.username,
          isActive: authResult.user?.isActive
        }
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

    // VERIFICACIÓN DE SEGURIDAD: Comprobar si ya existen ganadores para este sorteo
    const existingWinnersResult = await pool.query(
      'SELECT COUNT(*) FROM giveaway_winners WHERE giveaway_id = $1',
      [giveawayId]
    );

    if (parseInt(existingWinnersResult.rows[0].count) > 0) {
      return NextResponse.json({
        error: 'Winners already selected',
        message: 'Ya se han seleccionado ganadores para este sorteo. No se pueden volver a sortear por seguridad.',
        details: 'Giveaway already has winners selected.'
      }, { status: 400 });
    }

    // 1. Get all participants with user info for weighting
    const participantsResult = await pool.query(
      `SELECT gp.user_id, gp.account_name, u.patreon_tier, u.patreon_status 
       FROM giveaway_participants gp
       LEFT JOIN users u ON gp.user_id = u.id 
       WHERE gp.giveaway_id = $1`,
      [giveawayId]
    );
    const participants = participantsResult.rows;

    if (participants.length === 0) {
      return NextResponse.json({
        message: 'No participants for this giveaway',
        error: 'No hay participantes en este sorteo'
      }, { status: 200 });
    }

    // 2. Create weighted pool based on Patreon tier
    const weightedPool: any[] = [];
    // Pesos por tier (configuración hardcoded por ahora, podría moverse a DB/Config)
    // Pesos por tier (configuración hardcoded por ahora, podría moverse a DB/Config)
    const TIER_WEIGHTS: Record<string, number> = {
      'bronze': 1,    // 1x chance (igual que base)
      'silver': 2,    // 2x chance
      'gold': 3,     // 3x chance
      'legends': 4   // 4x chance
    };

    // Factor de multiplicación (1 = sin multiplicador extra, ya que usamos enteros)
    const ENTRY_MULTIPLIER = 1;

    participants.forEach(p => {
      let weight = 1; // Probabilidad base
      if (p.patreon_status === 'active_patron' && p.patreon_tier) {
        const tier = p.patreon_tier.trim().toLowerCase();
        if (TIER_WEIGHTS[tier]) {
          weight = TIER_WEIGHTS[tier];
        }
      }

      // Calcular número de "tickets" totales (redondeado para evitar errores)
      const totalEntries = Math.round(weight * ENTRY_MULTIPLIER);

      // Add participant to the pool multiple times
      for (let k = 0; k < totalEntries; k++) {
        weightedPool.push(p);
      }
    });

    console.log(`Giveaway ${giveawayId}: ${participants.length} participants expanded to ${weightedPool.length} entries (weighted).`);

    // 3. Shuffle weighted pool (Fisher-Yates algorithm)
    for (let i = weightedPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [weightedPool[i], weightedPool[j]] = [weightedPool[j], weightedPool[i]];
    }

    // 4. Select unique winners based on prize count
    const winnersToInsert = [];
    const selectedUserIds = new Set<string>();
    const prizeCount = giveaway.prizes.length;

    let poolIndex = 0;
    let prizeIndex = 0;

    while (prizeIndex < prizeCount && poolIndex < weightedPool.length) {
      const participant = weightedPool[poolIndex];
      poolIndex++;

      // Skip if this user already won a prize in this giveaway
      if (selectedUserIds.has(participant.user_id)) {
        continue;
      }

      // Mark user as selected
      selectedUserIds.add(participant.user_id);

      const prize = giveaway.prizes[prizeIndex];
      prizeIndex++;

      // Obtener información del item si existe
      let itemIcon = null;
      let itemName = null;

      if (prize.itemId) {
        try {
          const itemInfo = await getItemInfo(prize.itemId);
          if (itemInfo) {
            itemIcon = itemInfo.icon;
            itemName = itemInfo.name;
          }
        } catch (error) {
          console.error(`Error fetching item info for ${prize.itemId}:`, error);
        }
      }

      // Fallback si no hay icono
      if (!itemIcon && prize.icon) {
        const FALLBACK_ICONS: Record<string, string> = {
          'gem': 'https://wiki.guildwars2.com/images/8/88/Gem_%28highres%29.png',
          'package': 'https://wiki.guildwars2.com/images/5/5e/Daily_Achievement_Chest.png',
          'materials': 'https://wiki.guildwars2.com/images/7/75/Trophy_case.png',
          'gold': 'https://wiki.guildwars2.com/images/d/d1/Coin_gold.png'
        };
        itemIcon = FALLBACK_ICONS[prize.icon] || FALLBACK_ICONS['package'];
      }

      // Ultimate fallback
      if (!itemIcon) {
        itemIcon = 'https://wiki.guildwars2.com/images/5/5e/Daily_Achievement_Chest.png';
      }

      // Crear descripción completa del premio
      let prizeDescription = prize.prize;
      if (prize.gemPrize) {
        prizeDescription = `${prize.prize} Gems`;
      } else if (prize.quantity && prize.itemId) {
        prizeDescription = `${prize.quantity}x ${itemName || `Item ${prize.itemId}`}`;
      }

      winnersToInsert.push({
        giveaway_id: giveawayId,
        user_id: participant.user_id,
        account_name: participant.account_name,
        position: prize.position,
        prize_description: prizeDescription,
        prize_value: prize.prize,
        // Incluir información adicional del premio para el frontend
        item_id: prize.itemId || null,
        quantity: prize.quantity || null,
        gem_prize: prize.gemPrize || false,
        item_icon: itemIcon // URL real del icono
      });
    }

    if (winnersToInsert.length === 0) {
      return NextResponse.json({
        error: 'No se pudieron seleccionar ganadores',
        message: `No se pudieron seleccionar ganadores. El sorteo tiene ${participants.length} participantes pero ${prizeCount} premios configurados.`,
        details: `Participants: ${participants.length}, Prizes: ${prizeCount}`
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
