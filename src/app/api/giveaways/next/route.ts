import { NextResponse } from 'next/server';
import { updateGiveawayStatuses } from '@/config/giveaways';

export const runtime = 'edge';

export async function GET() {
  try {
    const updated = updateGiveawayStatuses();
    const now = new Date();
    const upcoming = updated
      .filter(g => g.status === 'upcoming')
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const next = upcoming.find(g => new Date(g.startDate) > now) || upcoming[0] || null;
    return NextResponse.json({ next });
  } catch {
    return NextResponse.json({ error: 'Failed to resolve next giveaway' }, { status: 500 });
  }
}


