import { NextResponse } from 'next/server';
import pool from '@/lib/postgres-db';
import { getAllGiveawaysWithAdvent } from '../../../config/giveaways';

export const runtime = 'nodejs';
export const revalidate = 86400; // Revalidar cada 24 horas (Configuración estática)

// GET /api/giveaways - Get all giveaways CONFIGURATION (Static)
export async function GET() {
  try {
    // Obtener sorteos desde configuración (incluyendo adviento)
    // Esto es puramente código/configuración, no toca la BD.
    const allGiveaways = getAllGiveawaysWithAdvent(2025);

    // Devolvemos la configuración tal cual.
    // El frontend combinará esto con los datos de /api/giveaways/counts
    // Convertimos fechas a ISO para consistencia JSON
    const giveaways = allGiveaways.map(g => ({
      ...g,
      startDate: new Date(g.startDate).toISOString(),
      endDate: new Date(g.endDate).toISOString(),
      // Eliminamos campos dinámicos simulados o nulos para ahorrar bytes
      participantCount: 0,
      status: g.status // Estado "base" configurado
    }));

    return NextResponse.json(
      { giveaways },
      {
        headers: {
          // Cache muy agresivo (24h). 
          // Se invalida automáticamente con cada RE-DEPLOY de Vercel.
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching giveaways config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch giveaways' },
      { status: 500 }
    );
  }
}