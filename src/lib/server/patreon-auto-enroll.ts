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

  let users: DbUserRow[] = [];

  if (userId) {
    const userResult = await pool.query<DbUserRow>(
      `SELECT id, username, patreon_status, patreon_tier, gw2_api_key
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return {
        processedUsers: 0,
        inserted: [],
        skipped: [],
        perUser: [],
        error: 'User not found',
      };
    }

    users = userResult.rows;
  } else {
    users = await getActivePatrons();
    if (users.length === 0) {
      return {
        processedUsers: 0,
        inserted: [],
        skipped: [],
        perUser: [],
        message: 'No active patrons found',
      };
    }
  }

  const insertedSet = new Set<string>();
  const skippedSet = new Set<string>();
  const perUser: Array<{
    userId: string;
    inserted: string[];
    skipped: string[];
    accountName: string | null;
  }> = [];

  for (const user of users) {
    const result = await enrollUser(user, giveawayIds);
    result.inserted.forEach((id) => insertedSet.add(id));
    result.skipped.forEach((id) => skippedSet.add(id));
    perUser.push({
      userId: user.id,
      inserted: result.inserted,
      skipped: result.skipped,
      accountName: result.accountName,
    });
  }

  return {
    processedUsers: users.length,
    inserted: Array.from(insertedSet),
    skipped: Array.from(skippedSet),
    perUser,
  };
}

