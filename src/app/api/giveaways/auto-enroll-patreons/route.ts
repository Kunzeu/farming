import { NextRequest, NextResponse } from 'next/server';
import { autoEnrollPatrons } from '@/lib/server/patreon-auto-enroll';

export const runtime = 'nodejs';

// GET /api/giveaways/auto-enroll-patreons - Manual trigger for admins
export async function GET(request: NextRequest) {
  return POST(request);
}

// POST /api/giveaways/auto-enroll-patreons - Auto-enroll all active Patreon users in giveaways
export async function POST(request: NextRequest) {
  try {
    let body = {};
    try {
      if (request.method === 'POST') {
        body = await request.json();
      }
    } catch (e) {
      // Body vacío o inválido es aceptable si es triggered manualmente o por cron sin body
    }

    let { giveawayIds } = body as any;
    const { userId } = body as any;

    // Verificar permisos
    // Si se pasa userId, verificamos que sea el propio usuario o admin
    // Si NO se pasa userId (bulk enroll), DEBE ser admin

    // Importar dinámicamente para evitar ciclos si fuera necesario, 
    // pero aquí server/jwt-utils es seguro.
    const { authorizeRequest } = await import('@/lib/server/jwt-utils');
    const authResult = authorizeRequest(request);

    // Verificar si es una llamada de Cron (Vercel Cron Jobs)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    const isCron = cronSecret && authHeader === `Bearer ${cronSecret}`;

    if (!giveawayIds || !Array.isArray(giveawayIds) || giveawayIds.length === 0) {
      // Si es Cron O ADMIN, podemos cargar los IDs activos automáticamente
      if (isCron || (authResult.isAuthorized && authResult.user?.role === 'admin')) {
        // Si no se pasaron IDs y es Cron/Admin, obtenemos los activos por defecto
        // Esto permite que el Cron simplemente llame al endpoint sin body
        const { updateGiveawayStatuses } = await import('@/config/giveaways');
        const activeGiveaways = updateGiveawayStatuses().filter((g) => g.status === 'active');
        // Solo procedemos si no se proporcionaron IDs explícitos
        giveawayIds = activeGiveaways.map(g => g.id);
      } else {
        return NextResponse.json(
          { error: 'giveawayIds array is required or admin access needed' },
          { status: 400 }
        );
      }
    }

    // Lógica de seguridad
    if (userId) {
      // Queremos inscribir a un usuario específico
      if (!authResult.isAuthorized && !isCron) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      // Verificar que el usuario sea él mismo o admin (o Cron)
      const isSelf = authResult.user?.userId === userId;
      const isAdmin = authResult.user?.role === 'admin';

      if (!isSelf && !isAdmin && !isCron) {
        return NextResponse.json({ error: 'Forbidden: Cannot enroll other users' }, { status: 403 });
      }
    } else {
      // Bulk enroll (todos los usuarios)
      // SOLO ADMIN o CRON
      if (!isCron && (!authResult.isAuthorized || authResult.user?.role !== 'admin')) {
        return NextResponse.json({ error: 'Forbidden: Admin access required for bulk enrollment' }, { status: 403 });
      }
    }

    const result = await autoEnrollPatrons({ giveawayIds, userId });

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

