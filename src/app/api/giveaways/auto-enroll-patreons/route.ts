import { NextRequest, NextResponse } from 'next/server';
import { autoEnrollPatrons } from '@/lib/server/patreon-auto-enroll';

export const runtime = 'nodejs';

// POST /api/giveaways/auto-enroll-patreons - Auto-enroll all active Patreon users in giveaways
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { giveawayIds } = body;

    if (!giveawayIds || !Array.isArray(giveawayIds) || giveawayIds.length === 0) {
      return NextResponse.json(
        { error: 'giveawayIds array is required' },
        { status: 400 }
      );
    }

    const result = await autoEnrollPatrons({ giveawayIds });

    return NextResponse.json({
      success: true,
      processedUsers: result.processedUsers,
      inserted: result.inserted,
      skipped: result.skipped,
      perUser: result.perUser,
      message: result.message
    });
  } catch (error) {
    console.error('Error auto-enrolling Patreons:', error);
    return NextResponse.json(
      { 
        error: 'Failed to auto-enroll Patreon users',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

