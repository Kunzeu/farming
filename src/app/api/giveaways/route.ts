import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/postgres-db';
import { updateGiveawayStatuses } from '../../../config/giveaways';

// GET /api/giveaways - Get all giveaways from configuration + participant counts from DB
export async function GET() {
  try {
    // Obtener sorteos desde configuración
    const configuredGiveaways = updateGiveawayStatuses();
    
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
    
    // Combinar configuración con datos de participación
    const giveaways = configuredGiveaways.map(giveaway => ({
      ...giveaway,
      participantCount: participantCountMap.get(giveaway.id) || 0,
      // Convertir fechas a formato ISO para el frontend
      startDate: new Date(giveaway.startDate).toISOString(),
      endDate: new Date(giveaway.endDate).toISOString(),
      createdAt: new Date().toISOString(), // Fecha de creación simulada
      updatedAt: new Date().toISOString()  // Fecha de actualización simulada
    }));

    return NextResponse.json({ giveaways });
  } catch (error) {
    console.error('Error fetching giveaways:', error);
    return NextResponse.json(
      { error: 'Failed to fetch giveaways' },
      { status: 500 }
    );
  }
}