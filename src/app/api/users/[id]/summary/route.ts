import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

export const runtime = 'nodejs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Cache simple en memoria para evitar validar la API key en cada request
type SummaryCacheEntry = {
  data: {
    hasApiKey: boolean;
    apiKeyValid: boolean | null;
    accountInfo: { id: string; name: string } | null;
    role: string;
    isActive: boolean;
    lastValidatedAt: number | null;
  };
  expiry: number;
};
const summaryCache = new Map<string, SummaryCacheEntry>();
const SUMMARY_TTL_MS = 5 * 60 * 1000; // 5 minutos

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
      SELECT 
        gw2_api_key as "gw2ApiKey",
        role,
        is_active as "isActive"
      FROM users
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const gw2ApiKey: string | null = result.rows[0].gw2ApiKey || null;
    const role: string = result.rows[0].role;
    const isActive: boolean = Boolean(result.rows[0].isActive);
    const hasApiKey = Boolean(gw2ApiKey && gw2ApiKey.length > 0);

    // 2) Validar API key si existe (tokeninfo + account)
    let apiKeyValid = false;
    let accountInfo: { id: string; name: string } | null = null;

    if (hasApiKey && gw2ApiKey) {
      const cached = summaryCache.get(id);
      const nowTs = Date.now();
      // Si hay cache válida, devolverla (evita pegar a GW2 en cada request)
      if (cached && cached.expiry > nowTs) {
        return NextResponse.json({
          hasApiKey: cached.data.hasApiKey,
          apiKeyValid: cached.data.apiKeyValid,
          accountInfo: cached.data.accountInfo,
          role,
          isActive,
          lastValidatedAt: cached.data.lastValidatedAt,
        }, { headers: { 'Cache-Control': 'private, max-age=60' } });
      }
      try {
        const [tokenRes, accountRes] = await Promise.all([
          fetch(`https://api.guildwars2.com/v2/tokeninfo?access_token=${gw2ApiKey}`),
          fetch(`https://api.guildwars2.com/v2/account?access_token=${gw2ApiKey}`),
        ]);
        if (tokenRes.ok && accountRes.ok) {
          const acct = await accountRes.json();
          apiKeyValid = true;
          accountInfo = { id: acct.id as string, name: acct.name as string };
          // Guardar en cache
          summaryCache.set(id, {
            data: { hasApiKey, apiKeyValid, accountInfo, role, isActive, lastValidatedAt: nowTs },
            expiry: nowTs + SUMMARY_TTL_MS,
          });
        }
      } catch {
        // En caso de error de red, mantener estado anterior si existe para no flapping
        const prev = summaryCache.get(id);
        apiKeyValid = prev?.data.apiKeyValid ?? false;
        accountInfo = prev?.data.accountInfo ?? null;
      }
    }

    // 3) Limpieza básica del cache si crece demasiado (prevención de fugas de memoria)
    if (summaryCache.size > 1000) {
      // Estrategia simple: borrar todo cuando llega a un límite
      // En un entorno serverless real, esto se resetea constantemente de todos modos
      summaryCache.clear();
    }

    return NextResponse.json(
      {
        hasApiKey,
        apiKeyValid,
        accountInfo,
        role,
        isActive,
        lastValidatedAt: hasApiKey ? (summaryCache.get(id)?.data.lastValidatedAt ?? null) : null,
      },
      {
        headers: {
          // Cache privado de 5 minutos - Optimizado para Vercel
          // "private" asegura que no se cachee en CDN compartido
          'Cache-Control': 'private, max-age=300, stale-while-revalidate=120',
        },
      }
    );
  } catch {
    return NextResponse.json({ error: 'Failed to build user summary' }, { status: 500 });
  }
}


