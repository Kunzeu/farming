import { NextRequest, NextResponse } from 'next/server';
import { authorizeRequest } from '@/lib/server/jwt-utils';
import { updateGiveawayStatuses } from '@/config/giveaways';

export const runtime = 'nodejs';

// POST /api/giveaways/activate-next
// Solo admins: expone el siguiente sorteo para activarlo "ya" en la UI (no persiste fechas)
export async function POST(request: NextRequest) {
  try {
    const auth = authorizeRequest(request, 'admin');
    if (!auth.isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized. Admin required.' }, { status: 401 });
    }

    const updated = updateGiveawayStatuses();
    const now = new Date();
    const upcoming = updated
      .filter(g => g.status === 'upcoming')
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const next = upcoming.find(g => new Date(g.startDate) > now) || upcoming[0] || null;

    if (!next) {
      return NextResponse.json({ message: 'No upcoming giveaway found' }, { status: 200 });
    }

    // No persistimos cambios en archivos/DB; informamos a la UI que lo trate como activo ya
    return NextResponse.json({
      activated: true,
      activeNow: {
        ...next,
        status: 'active',
        startDate: now.toISOString(),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to activate next giveaway' }, { status: 500 });
  }
}


