import pool from '@/lib/postgres-db';

type DbUserRow = {
  id: string;
  username: string;
  patreon_status: string | null;
  patreon_tier: string | null;
  gw2_api_key: string | null;
};

const GW2_ACCOUNT_ENDPOINT = 'https://api.guildwars2.com/v2/account';
const ALLOWED_PATREON_TIERS = new Set(['bronze', 'silver', 'gold', 'legends']);

function qualifiesForGiveaway(user: DbUserRow) {
  const hasActiveStatus = user.patreon_status === 'active_patron';
  const tier = user.patreon_tier?.trim().toLowerCase() || '';
  const hasAllowedTier = tier !== '' && ALLOWED_PATREON_TIERS.has(tier);
  const apiKey = user.gw2_api_key?.trim() || '';
  const hasApiKey = apiKey.length > 0;

  return hasActiveStatus && hasAllowedTier && hasApiKey;
}

async function resolveAccountName(userId: string, gw2ApiKey: string | null, fallback: string) {
  const previous = await pool.query(
    `SELECT account_name
     FROM giveaway_participants
     WHERE user_id = $1
     ORDER BY participated_at DESC
     LIMIT 1`,
    [userId]
  );

  if (previous.rows.length > 0 && previous.rows[0].account_name) {
    return previous.rows[0].account_name as string;
  }

  if (gw2ApiKey) {
    try {
      const response = await fetch(`${GW2_ACCOUNT_ENDPOINT}?access_token=${gw2ApiKey}`, {
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.name) return data.name as string;
      }
    } catch (error) {
      console.error('Error fetching GW2 account name:', error);
    }
  }

  return fallback || 'Patreon Supporter';
}

async function getActivePatrons() {
  const result = await pool.query<DbUserRow>(
    `SELECT id, username, patreon_status, patreon_tier, gw2_api_key
     FROM users
     WHERE is_active = true
       AND patreon_status = 'active_patron'
       AND patreon_tier IS NOT NULL
       AND TRIM(patreon_tier) <> ''
       AND LOWER(TRIM(patreon_tier)) IN ('bronze', 'silver', 'gold', 'legends')
       AND gw2_api_key IS NOT NULL
       AND TRIM(gw2_api_key) <> ''`
  );

  return result.rows;
}

import { getAllGiveawaysWithAdvent } from '@/config/giveaways';

async function enrollUser(user: DbUserRow, giveawayIds: string[]) {
  if (!qualifiesForGiveaway(user)) {
    return { inserted: [] as string[], skipped: giveawayIds, accountName: null as string | null };
  }

  const accountName = await resolveAccountName(user.id, user.gw2_api_key, user.username);
  const inserted: string[] = [];
  const skipped: string[] = [];

  // Obtener todos los sorteos configurados
  const allGiveaways = getAllGiveawaysWithAdvent(2025);
  const now = new Date();

  for (const giveawayId of giveawayIds) {
    // Validar que el sorteo exista y esté abierto
    const giveaway = allGiveaways.find(g => g.id === giveawayId);

    if (!giveaway) {
      console.log(`Giveaway ${giveawayId} not found in configuration`);
      skipped.push(giveawayId);
      continue;
    }

    const startDate = new Date(giveaway.startDate);
    const endDate = new Date(giveaway.endDate);

    // Validar fechas estrictamente en el servidor
    if (now < startDate) {
      console.log(`Giveaway ${giveawayId} not started yet. Starts: ${startDate.toISOString()}, Now: ${now.toISOString()}`);
      skipped.push(giveawayId);
      continue;
    }

    if (now > endDate) {
      console.log(`Giveaway ${giveawayId} already ended. Ended: ${endDate.toISOString()}, Now: ${now.toISOString()}`);
      skipped.push(giveawayId);
      continue;
    }

    const existing = await pool.query(
      `SELECT id
       FROM giveaway_participants
       WHERE giveaway_id = $1 AND user_id = $2`,
      [giveawayId, user.id]
    );

    if (existing.rows.length > 0) {
      skipped.push(giveawayId);
      continue;
    }

    await pool.query(
      `INSERT INTO giveaway_participants (giveaway_id, user_id, account_name)
       VALUES ($1, $2, $3)`,
      [giveawayId, user.id, accountName]
    );

    inserted.push(giveawayId);
  }

  return { inserted, skipped, accountName };
}

export async function autoEnrollPatrons(options: { giveawayIds: string[]; userId?: string }) {
  const { giveawayIds, userId } = options;

  if (!giveawayIds || giveawayIds.length === 0) {
    return {
      processedUsers: 0,
      inserted: [],
      skipped: [],
      perUser: [],
    };
  }

  // 1. Obtener usuarios elegibles (activos y con tier válido)
  let users: DbUserRow[] = [];
  if (userId) {
    const userResult = await pool.query<DbUserRow>(
      `SELECT id, username, patreon_status, patreon_tier, gw2_api_key
       FROM users
       WHERE id = $1`,
      [userId]
    );
    if (userResult.rows.length === 0) return { processedUsers: 0, inserted: [], skipped: [], perUser: [], error: 'User not found' };
    users = userResult.rows;
  } else {
    users = await getActivePatrons();
    if (users.length === 0) return { processedUsers: 0, inserted: [], skipped: [], perUser: [], message: 'No active patrons found' };
  }

  // 2. Filtrar usuarios que califican (status, tier, api key)
  const qualifiedUsers = users.filter(qualifiesForGiveaway);

  // 3. Obtener sorteos válidos y abiertos
  const allGiveaways = getAllGiveawaysWithAdvent(2025);
  const now = new Date();

  const validGiveaways = giveawayIds.filter(id => {
    const g = allGiveaways.find(giveaway => giveaway.id === id);
    if (!g) return false;
    const start = new Date(g.startDate);
    const end = new Date(g.endDate);
    return now >= start && now <= end;
  });

  if (validGiveaways.length === 0) {
    return { processedUsers: qualifiedUsers.length, inserted: [], skipped: giveawayIds, perUser: [], message: 'No valid/active giveaways found' };
  }

  // 4. Precaer participaciones existentes para TODOS los usuarios y sorteos relevantes en UNA sola query
  // Esto evita N * M queries a la base de datos
  const userIds = qualifiedUsers.map(u => u.id);

  // Si hay muchos usuarios, podríamos necesitar chunking, pero PG soporta miles en ANY
  const existingParticipationsResult = await pool.query<{ user_id: string; giveaway_id: string }>(
    `SELECT user_id, giveaway_id 
     FROM giveaway_participants 
     WHERE user_id = ANY($1) AND giveaway_id = ANY($2)`,
    [userIds, validGiveaways]
  );

  const existingMap = new Set<string>();
  existingParticipationsResult.rows.forEach(row => {
    existingMap.add(`${row.user_id}:${row.giveaway_id}`);
  });

  // 5. Preparar inserciones en lote (batch insert)
  const inserts: { giveaway_id: string; user_id: string; account_name: string }[] = [];
  const insertedSet = new Set<string>();
  const perUserResult: any[] = [];

  for (const user of qualifiedUsers) {
    // Resolver account name (esto sí podría requerir queries individuales si no está cacheado, 
    // pero resolveAccountName intenta buscar en participaciones anteriores primero)
    // Optimización futura: cachear account names en users table.
    const accountName = await resolveAccountName(user.id, user.gw2_api_key, user.username);

    const userInserted: string[] = [];
    const userSkipped: string[] = [];

    for (const gwId of giveawayIds) {
      if (!validGiveaways.includes(gwId)) {
        userSkipped.push(gwId);
        continue;
      }

      if (existingMap.has(`${user.id}:${gwId}`)) {
        userSkipped.push(gwId);
        continue;
      }

      inserts.push({
        giveaway_id: gwId,
        user_id: user.id,
        account_name: accountName
      });
      userInserted.push(gwId);
      insertedSet.add(gwId);
    }

    perUserResult.push({
      userId: user.id,
      inserted: userInserted,
      skipped: userSkipped,
      accountName
    });
  }

  // 6. Ejecutar inserción masiva
  if (inserts.length > 0) {
    // Postgres permite insertar múltiples filas en un solo INSERT
    // Construir query dinámica: VALUES ($1, $2, $3), ($4, $5, $6), ...
    // Nota: PG tiene límite de parámetros (65535). Si inserts es muy grande, dividir en chunks.
    const CHUNK_SIZE = 500; // Seguro para 3 columnas (1500 params)

    for (let i = 0; i < inserts.length; i += CHUNK_SIZE) {
      const chunk = inserts.slice(i, i + CHUNK_SIZE);
      const values: string[] = [];
      const params: any[] = [];
      let pIndex = 1;

      chunk.forEach(item => {
        values.push(`($${pIndex++}, $${pIndex++}, $${pIndex++})`);
        params.push(item.giveaway_id, item.user_id, item.account_name);
      });

      const query = `
        INSERT INTO giveaway_participants (giveaway_id, user_id, account_name)
        VALUES ${values.join(', ')}
        ON CONFLICT DO NOTHING
      `;

      await pool.query(query, params);
    }
  }

  return {
    processedUsers: qualifiedUsers.length,
    inserted: Array.from(insertedSet),
    skipped: giveawayIds.filter(id => !insertedSet.has(id)), // Aprox
    perUser: perUserResult
  };
}

