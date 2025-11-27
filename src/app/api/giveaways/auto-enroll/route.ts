import { NextRequest, NextResponse } from 'next/server';
import { updateGiveawayStatuses } from '@/config/giveaways';
import { autoEnrollPatrons } from '@/lib/server/patreon-auto-enroll';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    let payload: { userId?: string } = {};
    try {
      payload = await request.json();
    } catch {
      // allow empty body
    }

    const activeGiveaways = updateGiveawayStatuses().filter((g) => g.status === 'active');
    const giveawayIds = activeGiveaways.map((g) => g.id);

    if (giveawayIds.length === 0) {
      return NextResponse.json({
        message: 'No hay sorteos activos para auto-inscribir.',
        processedUsers: 0,
        inserted: [],
        skipped: [],
        perUser: [],
      });
    }

    const result = await autoEnrollPatrons({
      giveawayIds,
      userId: payload.userId,
    });

    if ('error' in result && result.error === 'User not found') {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error auto-enrolling patrons:', error);
    return NextResponse.json({ error: 'Failed to auto-enroll patrons' }, { status: 500 });
  }
}

