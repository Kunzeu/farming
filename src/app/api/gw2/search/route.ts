import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

// Simple cache for search results
const searchCache = new Map<string, { data: unknown; expiry: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutos - cache agresivo

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
    const apiKey = request.nextUrl.searchParams.get('api_key');
    const query = request.nextUrl.searchParams.get('q');
    const scope = request.nextUrl.searchParams.get('scope') || 'all';
    const lang = request.nextUrl.searchParams.get('lang') || 'en';
    
    if (!apiKey || !query) {
      return NextResponse.json({ error: 'API key and query required' }, { status: 400 });
    }

    const cacheKey = `search-${apiKey}-${query}-${scope}-${lang}`;
    const cached = searchCache.get(cacheKey);
    
    if (cached && cached.expiry > Date.now()) {
      return NextResponse.json(cached.data);
    }

    const results: unknown[] = [];
    const searchTerm = query.toLowerCase();

    // Search in bank
    if (scope === 'all' || scope === 'bank') {
      try {
        const bankResponse = await fetchWith429Retry(`${GW2_API_BASE}/account/bank?access_token=${apiKey}`, {
          headers: { 'Accept': 'application/json' },
        });

        if (bankResponse.ok) {
          const bankData = await bankResponse.json();
          
          // Get item details for bank items
          const bankItemIds = bankData
            .filter((item: unknown) => item !== null)
            .map((item: unknown) => (item as { id: number }).id);
          
          if (bankItemIds.length > 0) {
            const itemsResponse = await fetchWith429Retry(`${GW2_API_BASE}/items?ids=${bankItemIds.join(',')}&lang=${lang}`);
            if (itemsResponse.ok) {
              const itemsData = await itemsResponse.json();
              const itemsMap = new Map(itemsData.map((item: unknown) => [(item as { id: number }).id, item]));
              
              bankData.forEach((bankItem: unknown, index: number) => {
                if (bankItem && itemsMap.has((bankItem as { id: number }).id)) {
                  const itemDetails = itemsMap.get((bankItem as { id: number }).id) as unknown;
                  if ((itemDetails as { name?: string })?.name?.toLowerCase().includes(searchTerm)) {
                    results.push({
                      id: (bankItem as { id: number }).id,
                      name: (itemDetails as { name: string }).name,
                      icon: (itemDetails as { icon: string }).icon,
                      count: (bankItem as { count: number }).count,
                      location: `search.bankSlot ${index + 1}`,
                      rarity: (itemDetails as { rarity: string }).rarity,
                      category: 'bank',
                      slot: index + 1
                    });
                  }
                }
              });
            }
          }
        }
      } catch (error) {
        console.error('Error searching bank:', error);
      }
    }

    // Search in characters
    if (scope === 'all' || scope === 'characters') {
      try {
        const charactersResponse = await fetchWith429Retry(`${GW2_API_BASE}/characters?access_token=${apiKey}`, {
          headers: { 'Accept': 'application/json' },
        });

        if (charactersResponse.ok) {
          const charactersData = await charactersResponse.json();
          
          // Collect all item IDs from character inventories
          const characterItemIds: number[] = [];
          for (const character of charactersData) {
            if ((character as { inventory?: { bags?: unknown[] } }).inventory?.bags) {
              for (const bag of (character as { inventory: { bags: unknown[] } }).inventory.bags) {
                if ((bag as { inventory?: unknown[] }).inventory) {
                  for (const item of (bag as { inventory: unknown[] }).inventory) {
                    if (item && (item as { id?: number }).id) {
                      characterItemIds.push((item as { id: number }).id);
                    }
                  }
                }
              }
            }
          }

          // Get item details for character items
          if (characterItemIds.length > 0) {
            const uniqueItemIds = [...new Set(characterItemIds)];
            const itemsResponse = await fetchWith429Retry(`${GW2_API_BASE}/items?ids=${uniqueItemIds.join(',')}&lang=${lang}`);
            if (itemsResponse.ok) {
              const itemsData = await itemsResponse.json();
              const itemsMap = new Map(itemsData.map((item: unknown) => [(item as { id: number }).id, item]));
              
              for (const character of charactersData) {
                if ((character as { inventory?: { bags?: unknown[] } }).inventory?.bags) {
                  for (let bagIndex = 0; bagIndex < (character as { inventory: { bags: unknown[] } }).inventory.bags.length; bagIndex++) {
                    const bag = (character as { inventory: { bags: unknown[] } }).inventory.bags[bagIndex];
                    if ((bag as { inventory?: unknown[] }).inventory) {
                      for (let slotIndex = 0; slotIndex < (bag as { inventory: unknown[] }).inventory.length; slotIndex++) {
                        const item = (bag as { inventory: unknown[] }).inventory[slotIndex];
                        if (item && itemsMap.has((item as { id: number }).id)) {
                          const itemDetails = itemsMap.get((item as { id: number }).id) as unknown;
                          if ((itemDetails as { name?: string })?.name?.toLowerCase().includes(searchTerm)) {
                            results.push({
                              id: (item as { id: number }).id,
                              name: (itemDetails as { name: string }).name,
                              icon: (itemDetails as { icon: string }).icon,
                              count: (item as { count: number }).count,
                              location: `${(character as { name: string }).name} - search.characterBag ${bagIndex + 1}`,
                              rarity: (itemDetails as { rarity: string }).rarity,
                              category: 'character',
                              character: (character as { name: string }).name,
                              bag: bagIndex + 1,
                              slot: slotIndex + 1
                            });
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error searching characters:', error);
      }
    }

    // Search in material storage
    if (scope === 'all' || scope === 'storage') {
      try {
        const storageResponse = await fetchWith429Retry(`${GW2_API_BASE}/account/materials?access_token=${apiKey}`, {
          headers: { 'Accept': 'application/json' },
        });

        if (storageResponse.ok) {
          const storageData = await storageResponse.json();
          
          // Get item details for storage items
          const storageItemIds = storageData
            .filter((item: unknown) => item !== null)
            .map((item: unknown) => (item as { id: number }).id);
          
          if (storageItemIds.length > 0) {
            const itemsResponse = await fetchWith429Retry(`${GW2_API_BASE}/items?ids=${storageItemIds.join(',')}&lang=${lang}`);
            if (itemsResponse.ok) {
              const itemsData = await itemsResponse.json();
              const itemsMap = new Map(itemsData.map((item: unknown) => [(item as { id: number }).id, item]));
              
              storageData.forEach((storageItem: unknown) => {
                if (storageItem && itemsMap.has((storageItem as { id: number }).id)) {
                  const itemDetails = itemsMap.get((storageItem as { id: number }).id) as unknown;
                  if ((itemDetails as { name?: string })?.name?.toLowerCase().includes(searchTerm)) {
                    results.push({
                      id: (storageItem as { id: number }).id,
                      name: (itemDetails as { name: string }).name,
                      icon: (itemDetails as { icon: string }).icon,
                      count: (storageItem as { count: number }).count,
                      location: 'search.materialStorage',
                      rarity: (itemDetails as { rarity: string }).rarity,
                      category: 'storage'
                    });
                  }
                }
              });
            }
          }
        }
      } catch (error) {
        console.error('Error searching storage:', error);
      }
    }

    // Cache the results
    searchCache.set(cacheKey, {
      data: results,
      expiry: Date.now() + CACHE_TTL
    });

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}