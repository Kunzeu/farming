import { NextResponse } from 'next/server';
import pool from '@/lib/postgres-db';
import { getAllGiveawaysWithAdvent } from '../../../../config/giveaways';

export const runtime = 'nodejs';
export const revalidate = 300; // Cache de 5 minutos para datos dinámicos

// GET /api/giveaways/counts - Endpoint ligero para datos dinámicos (estado y contador)
export async function GET() {
    try {
        // 1. Calcular estados en tiempo real (backend time validation)
        const allGiveaways = getAllGiveawaysWithAdvent(2025);
        const now = new Date();

        // Mapa de estados dinámicos
        const statusMap: Record<string, 'upcoming' | 'active' | 'ended'> = {};

        allGiveaways.forEach(g => {
            // Si está cancelado hard-coded, ignoramos el tiempo
            if (g.status === 'cancelled') return;

            const start = new Date(g.startDate);
            const end = new Date(g.endDate);
            const nowTime = now.getTime();
            const startTime = start.getTime();
            const endTime = end.getTime();

            let status: 'upcoming' | 'active' | 'ended' = 'upcoming';

            if (endTime <= nowTime) {
                status = 'ended';
            } else if (startTime <= nowTime && endTime > nowTime) {
                status = 'active';
            } else {
                status = 'upcoming';
            }
            statusMap[g.id] = status;
        });

        // 2. Obtener conteos de participantes desde la base de datos
        // Esta query es rápida si está indexada
        const participantCounts = await pool.query(`
      SELECT 
        giveaway_id,
        COUNT(*) as participant_count
      FROM giveaway_participants
      GROUP BY giveaway_id
    `);

        const counts: Record<string, number> = {};
        participantCounts.rows.forEach(row => {
            const cleanId = String(row.giveaway_id).trim();
            counts[cleanId] = parseInt(row.participant_count);
        });

        // 3. Obtener ganadores para marcar como "winners_announced"
        const winnersQuery = await pool.query(`
      SELECT DISTINCT giveaway_id
      FROM giveaway_winners
    `);

        winnersQuery.rows.forEach(row => {
            const cleanId = String(row.giveaway_id).trim();
            // Si ya tiene ganadores, el estado sobrescribe a active/ended
            // Asumimos que si hay ganadores, el sorteo "terminó" visualmente o está en fase de ganadores
            // Pero para mantener compatibilidad con tipos:
            // El frontend maneja "winners_announced" si ve ganadores.
            // Aquí podemos enviar un flag extra o mutar el estado.
            // Vamos a enviar un map de "hasWinners"
        });

        const hasWinnersSet = new Set(winnersQuery.rows.map(r => String(r.giveaway_id).trim()));

        // Construir respuesta compacta
        const dynamicData: Record<string, { status: string; count: number }> = {};

        Object.keys(statusMap).forEach(id => {
            let finalStatus = statusMap[id];
            if (hasWinnersSet.has(id)) {
                finalStatus = 'winners_announced' as any;
            }
            dynamicData[id] = {
                status: finalStatus,
                count: counts[id] || 0
            };
        });

        return NextResponse.json(
            { data: dynamicData },
            {
                headers: {
                    // Cache público de 5 minutos (Vercel CDN) + SWR 5 min
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300',
                },
            }
        );

    } catch (error) {
        console.error('Error fetching giveaway counts:', error);
        return NextResponse.json(
            { error: 'Failed to fetch counts' },
            { status: 500 }
        );
    }
}
