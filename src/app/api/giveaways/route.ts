import { NextResponse } from 'next/server';
import pool from '@/lib/postgres-db';
import { getAllGiveawaysWithAdvent } from '../../../config/giveaways';

export const runtime = 'nodejs';
export const revalidate = 300; // Revalidar cada 5 minutos

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

      // Usar getTime() para comparaciones precisas
      const endTime = end.getTime();
      const startTime = start.getTime();
      const nowTime = now.getTime();

      if (endTime <= nowTime) {
        // El sorteo ya terminó
        status = 'ended';
      } else if (startTime <= nowTime && endTime > nowTime) {
        // El sorteo está activo
        status = 'active';
      } else if (startTime > nowTime) {
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
      const count = parseInt(row.participant_count);
      // Limpiar el ID por si acaso tiene espacios o caracteres extra
      const cleanId = String(row.giveaway_id).trim();
      participantCountMap.set(cleanId, count);
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

      // Limpiar el ID del giveaway también
      const cleanGiveawayId = String(giveaway.id).trim();
      const participantCount = participantCountMap.get(cleanGiveawayId) || 0;

      return {
        ...giveaway,
        status: finalStatus,
        participantCount,
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
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
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