import { NextRequest, NextResponse } from 'next/server';

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

// Simple cache for account data
const accountCache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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
    const apiKey = request.nextUrl.searchParams.get('api_key') || 
                   request.headers.get('x-api-key');
    
    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 400 });
    }

    const cacheKey = `account-${apiKey}`;
    const cached = accountCache.get(cacheKey);
    
    if (cached && cached.expiry > Date.now()) {
      return NextResponse.json(cached.data);
    }

    const response = await fetchWith429Retry(`${GW2_API_BASE}/account?access_token=${apiKey}`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `GW2 API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Extract account_id from the response
    const accountData = {
      id: data.id,
      account_id: data.account_id,
      name: data.name,
      world: data.world,
      guilds: data.guilds,
      access: data.access
    };
    
    // Cache the response
    accountCache.set(cacheKey, {
      data: accountData,
      expiry: Date.now() + CACHE_TTL
    });

    return NextResponse.json(accountData);
  } catch (error) {
    console.error('Account API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
