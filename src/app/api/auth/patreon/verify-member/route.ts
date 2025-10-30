import { NextRequest, NextResponse } from 'next/server';
import { verifyMemberPaidByPatreonId } from '@/lib/server/patreon-creator';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const patreonId = new URL(request.url).searchParams.get('patreonId');
    if (!patreonId) return NextResponse.json({ error: 'patreonId requerido' }, { status: 400 });

    const result = await verifyMemberPaidByPatreonId(patreonId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('verify-member error', error);
    return NextResponse.json({ error: 'Error verificando miembro' }, { status: 500 });
  }
}


