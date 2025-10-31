import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';;

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

// Cache in-memory para reducir carga
const walletCache = new Map<string, { data: unknown; expiry: number }>();
const WALLET_TTL_MS = 10 * 60 * 1000; // 10 minutos

export async function GET(request: NextRequest) {
  const start = performance.now();
  try {
    // Get API key from query params or headers
    const apiKey = request.nextUrl.searchParams.get('api_key') || 
                   request.headers.get('x-api-key');

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

    // Update cache
    walletCache.set(apiKey, { data: walletData, expiry: now + WALLET_TTL_MS });

    const duration = performance.now() - start;
    console.log(`[API] /gw2/wallet ejecutado en ${duration.toFixed(2)}ms`);

    return NextResponse.json(walletData, {
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