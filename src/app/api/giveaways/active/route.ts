import { NextResponse } from 'next/server';
import { updateGiveawayStatuses, getActiveGiveaway } from '@/config/giveaways';

export const runtime = 'edge';

export async function GET() {
  try {
    // Recalcular estados según fechas
    updateGiveawayStatuses();

    const active = getActiveGiveaway();
    if (!active) {
      return NextResponse.json({ active: null });
    }

    return NextResponse.json({ active });
  } catch {
    return NextResponse.json({ error: 'Failed to resolve active giveaway' }, { status: 500 });
  }
}


