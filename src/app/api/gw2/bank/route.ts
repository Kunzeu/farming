import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';;

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

// Simple in-memory cache with TTL per apiKey
type CacheEntry = { expiresAt: number; data: unknown };
const bankCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<unknown>>();
const BANK_TTL_MS = 30 * 60 * 1000; // 30 minutos - cache agresivo

async function fetchWith429Retry(url: string, init?: RequestInit): Promise<Response> {
  let attempt = 0;
  let lastError: unknown;
  while (attempt < 3) {
    const res = await fetch(url, init);
    if (res.status !== 429) return res;
    // Respect Retry-After if present; fallback exponential backoff
    const retryAfter = res.headers.get('retry-after');
    const waitMs = retryAfter ? Number(retryAfter) * 1000 : Math.min(2 ** attempt * 500, 4000);
    await new Promise(r => setTimeout(r, isNaN(waitMs) ? 1000 : waitMs));
    attempt += 1;
    lastError = new Error(`GW2 API error: 429 Too Many Requests (attempt ${attempt})`);
  }
  throw lastError instanceof Error ? lastError : new Error('GW2 API error: 429 Too Many Requests');
}

export async function GET(request: NextRequest) {
  const start = performance.now();
  try {
    const apiKey = request.nextUrl.searchParams.get('api_key') || 
                   request.headers.get('x-api-key');
    // Language for item details (GW2 API supports en,de,es,fr)
    const rawLang = (request.nextUrl.searchParams.get('lang') || '').toLowerCase();
    const lang = ['en','es','de','fr'].includes(rawLang) ? rawLang : 'en';

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required' },
        { status: 400 }
      );
    }

    // Serve from cache if valid
    const cached = bankCache.get(apiKey);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
      return NextResponse.json(cached.data);
    }

    // Coalesce concurrent requests for same apiKey
    if (inflight.has(apiKey)) {
      const data = await inflight.get(apiKey)!;
      return NextResponse.json(data as unknown);
    }

    const fetchPromise = (async () => {
      const response = await fetchWith429Retry(`${GW2_API_BASE}/account/bank?access_token=${apiKey}`, {
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`GW2 API error: ${response.status} ${response.statusText}`);
      }

      const bankData = await response.json();

      // Get item details for non-null items
      const itemIds = bankData.filter((item: unknown) => item !== null).map((item: { id: number }) => item.id);
      
      if (itemIds.length > 0) {
        const itemsResponse = await fetchWith429Retry(`${GW2_API_BASE}/items?ids=${itemIds.join(',')}&lang=${lang}`);
        if (itemsResponse.ok) {
          const itemsData = await itemsResponse.json();
          const enrichedBankData = bankData.map((bankItem: unknown, index: number) => {
            if (bankItem === null) return null;
            const typedBankItem = bankItem as { id: number };
            const itemDetails = itemsData.find((item: { id: number }) => item.id === typedBankItem.id);
            return {
              ...bankItem,
              name: itemDetails?.name || `Item ${typedBankItem.id}`,
              icon: itemDetails?.icon,
              rarity: itemDetails?.rarity,
              type: itemDetails?.type,
              slot: index
            };
          });
          // Update cache
          bankCache.set(apiKey, { data: enrichedBankData, expiresAt: Date.now() + BANK_TTL_MS });
          return enrichedBankData as unknown;
        }
      }

      bankCache.set(apiKey, { data: bankData, expiresAt: Date.now() + BANK_TTL_MS });
      return bankData as unknown;
    })();

    inflight.set(apiKey, fetchPromise);

    try {
      const data = await fetchPromise;
      const duration = performance.now() - start;
      console.log(`[API] /gw2/bank ejecutado en ${duration.toFixed(2)}ms`);
      return NextResponse.json(data as unknown);
    } finally {
      inflight.delete(apiKey);
    }
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[API] /gw2/bank Error después de ${duration.toFixed(2)}ms:`, error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch bank data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}