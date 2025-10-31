import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';;

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

// Simple cache for profession data
const professionCache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours (professions don't change often)

async function fetchWith429Retry(url: string, options: RequestInit = {}): Promise<Response> {
  let retries = 0;
  const MAX_RETRIES = 3;

  while (retries < MAX_RETRIES) {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, retries) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      retries++;
      continue;
    }
    
    return response;
  }
  
  throw new Error('Max retries exceeded');
}

export async function GET(request: NextRequest) {
  try {
    const lang = request.nextUrl.searchParams.get('lang') || 'en';
    
    const cacheKey = `professions-${lang}`;
    const cached = professionCache.get(cacheKey);
    
    if (cached && cached.expiry > Date.now()) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=600',
        },
      });
    }

    // Fetch all professions
    const professionsResponse = await fetchWith429Retry(`${GW2_API_BASE}/professions?lang=${lang}`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!professionsResponse.ok) {
      return NextResponse.json(
        { error: `GW2 API error: ${professionsResponse.status} ${professionsResponse.statusText}` },
        { status: professionsResponse.status }
      );
    }

    const professionIds = await professionsResponse.json();
    
    // Fetch detailed profession data
    const professionDetailsResponse = await fetchWith429Retry(`${GW2_API_BASE}/professions?ids=${professionIds.join(',')}&lang=${lang}`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!professionDetailsResponse.ok) {
      return NextResponse.json(
        { error: `GW2 API error: ${professionDetailsResponse.status} ${professionDetailsResponse.statusText}` },
        { status: professionDetailsResponse.status }
      );
    }

    const professions = await professionDetailsResponse.json();
    
    // Create a map for easy lookup
    const professionMap = professions.reduce((acc: Record<string, unknown>, profession: unknown) => {
      acc[(profession as { id: string }).id] = {
        id: (profession as { id: string }).id,
        name: (profession as { name: string }).name,
        icon: (profession as { icon: string }).icon,
        icon_big: (profession as { icon_big: string }).icon_big,
        specializations: (profession as { specializations?: unknown[] }).specializations || []
      };
      return acc;
    }, {});

    // Cache the response
    professionCache.set(cacheKey, {
      data: professionMap,
      expiry: Date.now() + CACHE_TTL
    });

    return NextResponse.json(professionMap, {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('Professions API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
