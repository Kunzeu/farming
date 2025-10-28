import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

// Simple cache for specialization data
const specializationCache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

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
    const ids = request.nextUrl.searchParams.get('ids');
    
    const cacheKey = `specializations-${lang}-${ids || 'all'}`;
    const cached = specializationCache.get(cacheKey);
    
    if (cached && cached.expiry > Date.now()) {
      return NextResponse.json(cached.data);
    }

    let url = `${GW2_API_BASE}/specializations?lang=${lang}`;
    if (ids) {
      url = `${GW2_API_BASE}/specializations?ids=${ids}&lang=${lang}`;
    }

    const response = await fetchWith429Retry(url, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `GW2 API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const specializations = await response.json();
    
    // Create a map for easy lookup
    const specializationMap = specializations.reduce((acc: Record<string, unknown>, spec: unknown) => {
      acc[(spec as { id: string }).id] = {
        id: (spec as { id: string }).id,
        name: (spec as { name: string }).name,
        icon: (spec as { icon: string }).icon,
        background: (spec as { background: string }).background,
        profession: (spec as { profession: string }).profession
      };
      return acc;
    }, {});

    // Cache the response
    specializationCache.set(cacheKey, {
      data: specializationMap,
      expiry: Date.now() + CACHE_TTL
    });

    return NextResponse.json(specializationMap);
  } catch (error) {
    console.error('Specializations API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
