import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export const runtime = 'nodejs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// GET /api/users/[id]/summary
// Resumen para cliente: hasApiKey, validación básica y accountInfo (si aplica)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // 1) Leer API Key del usuario
    const query = `
      SELECT gw2_api_key as "gw2ApiKey"
      FROM users
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const gw2ApiKey: string | null = result.rows[0].gw2ApiKey || null;
    const hasApiKey = Boolean(gw2ApiKey && gw2ApiKey.length > 0);

    // 2) Validar API key si existe (tokeninfo + account)
    let apiKeyValid = false;
    let accountInfo: { id: string; name: string } | null = null;

    if (hasApiKey && gw2ApiKey) {
      try {
        const [tokenRes, accountRes] = await Promise.all([
          fetch(`https://api.guildwars2.com/v2/tokeninfo?access_token=${gw2ApiKey}`),
          fetch(`https://api.guildwars2.com/v2/account?access_token=${gw2ApiKey}`),
        ]);
        if (tokenRes.ok && accountRes.ok) {
          const acct = await accountRes.json();
          apiKeyValid = true;
          accountInfo = { id: acct.id as string, name: acct.name as string };
        }
      } catch {
        apiKeyValid = false;
        accountInfo = null;
      }
    }

    return NextResponse.json(
      {
        hasApiKey,
        apiKeyValid,
        accountInfo,
      },
      {
        headers: {
          'Cache-Control': 'private, no-store',
        },
      }
    );
  } catch {
    return NextResponse.json({ error: 'Failed to build user summary' }, { status: 500 });
  }
}


