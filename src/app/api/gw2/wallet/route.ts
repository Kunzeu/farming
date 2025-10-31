import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
import { pool } from '@/lib/postgres-db';

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

// Cache in-memory para reducir carga
const walletCache = new Map<string, { data: unknown; expiry: number }>();
const WALLET_TTL_MS = 10 * 60 * 1000; // 10 minutos

export async function GET(request: NextRequest) {
  const start = performance.now();
  try {
    const searchParams = request.nextUrl.searchParams;
    const apiKeyParam = searchParams.get('api_key') || request.headers.get('x-api-key');
    const userId = searchParams.get('user_id');

    let apiKey = apiKeyParam;
    if (!apiKey && userId) {
      // Resolver API key desde la base de datos
      try {
        const result = await pool.query(
          'SELECT gw2_api_key AS "gw2ApiKey" FROM users WHERE id = $1',
          [userId]
        );
        if (result.rows.length > 0) {
          apiKey = result.rows[0].gw2ApiKey || undefined;
        }
      } catch {}
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required' },
        { status: 400 }
      );
    }

    // Check cache first
    const cached = walletCache.get(apiKey);
    const now = Date.now();
    if (cached && cached.expiry > now) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=30',
        },
      });
    }

    // Fetch wallet data from GW2 API
    const response = await fetch(`${GW2_API_BASE}/account/wallet?access_token=${apiKey}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`GW2 API error: ${response.status} ${response.statusText}`);
    }

    const walletData = await response.json();

    // Opcional: enriquecer con datos de monedas para reducir una segunda llamada en cliente
    const currencyIds = Array.from(new Set((walletData as Array<{ id: number }>).map((w) => w.id)));
    let currencies: unknown[] = [];
    if (currencyIds.length > 0) {
      try {
        const currenciesResp = await fetch(`${GW2_API_BASE}/currencies?ids=${currencyIds.join(',')}`, {
          headers: { 'Accept': 'application/json' },
        });
        if (currenciesResp.ok) {
          currencies = await currenciesResp.json();
        }
      } catch {}
    }

    // Update cache
    walletCache.set(apiKey, { data: walletData, expiry: now + WALLET_TTL_MS });

    const duration = performance.now() - start;
    console.log(`[API] /gw2/wallet ejecutado en ${duration.toFixed(2)}ms`);

    return NextResponse.json({ wallet: walletData, currencies }, {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[API] /gw2/wallet Error después de ${duration.toFixed(2)}ms:`, error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch wallet data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 