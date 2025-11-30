import { NextResponse } from 'next/server';
import pool from '@/lib/postgres-db';
import { updateGiveawayStatuses, getAllGiveawaysWithAdvent } from '../../../config/giveaways';

export const runtime = 'nodejs';

// GET /api/giveaways - Get all giveaways from configuration + participant counts from DB
export async function GET() {
  try {
    // Obtener sorteos desde configuración (incluyendo adviento)
    const allGiveaways = getAllGiveawaysWithAdvent(2025);
    
    // Actualizar estados de todos los sorteos
    const now = new Date();
    const allConfiguredGiveaways = allGiveaways.map(g => {
      const start = new Date(g.startDate);
      const end = new Date(g.endDate);
      
      // Si el sorteo está cancelado o los ganadores ya fueron anunciados, mantener el estado
      if (g.status === 'cancelled' || g.status === 'winners_announced') {
        return { ...g, status: g.status };
      }
      
      // Determinar estado basado en fechas actuales
      let status: 'upcoming' | 'active' | 'ended' = g.status;
      
      if (end <= now) {
        // El sorteo ya terminó
        status = 'ended';
      } else if (start <= now && end > now) {
        // El sorteo está activo
        status = 'active';
      } else if (start > now) {
        // El sorteo aún no ha comenzado
        status = 'upcoming';
      }
      
      return { ...g, status };
    });
    
    const configuredGiveaways = allConfiguredGiveaways;
    
    // Obtener conteos de participantes desde la base de datos
    const participantCounts = await pool.query(`
      SELECT 
        giveaway_id,
        COUNT(*) as participant_count
      FROM giveaway_participants
      GROUP BY giveaway_id
    `);
    
    // Crear mapa de conteos de participantes
    const participantCountMap = new Map();
    participantCounts.rows.forEach(row => {
      participantCountMap.set(row.giveaway_id, parseInt(row.participant_count));
    });
    
    // Obtener sorteos con ganadores anunciados
    const winnersQuery = await pool.query(`
      SELECT DISTINCT giveaway_id
      FROM giveaway_winners
    `);
    const giveawaysWithWinners = new Set(winnersQuery.rows.map(row => row.giveaway_id));
    
    // Combinar configuración con datos de participación
    const giveaways = configuredGiveaways.map(giveaway => {
      // Si el sorteo tiene ganadores, actualizar status a winners_announced
      let finalStatus = giveaway.status;
      if (giveawaysWithWinners.has(giveaway.id) && giveaway.status !== 'cancelled') {
        finalStatus = 'winners_announced';
      }
      
      return {
        ...giveaway,
        status: finalStatus,
        participantCount: participantCountMap.get(giveaway.id) || 0,
        // Convertir fechas a formato ISO para el frontend
        startDate: new Date(giveaway.startDate).toISOString(),
        endDate: new Date(giveaway.endDate).toISOString(),
        createdAt: new Date().toISOString(), // Fecha de creación simulada
        updatedAt: new Date().toISOString()  // Fecha de actualización simulada
      };
    });

    return NextResponse.json(
      { giveaways },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=1800',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching giveaways:', error);
    return NextResponse.json(
      { error: 'Failed to fetch giveaways' },
      { status: 500 }
    );
  }
}