import { NextRequest, NextResponse } from 'next/server';

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

// Simple cache for search results
const searchCache = new Map<string, { data: any; expiry: number }>();
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

    const results: any[] = [];
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
            .filter((item: any) => item !== null)
            .map((item: any) => item.id);
          
          if (bankItemIds.length > 0) {
            const itemsResponse = await fetchWith429Retry(`${GW2_API_BASE}/items?ids=${bankItemIds.join(',')}&lang=${lang}`);
            if (itemsResponse.ok) {
              const itemsData = await itemsResponse.json();
              const itemsMap = new Map(itemsData.map((item: any) => [item.id, item]));
              
              bankData.forEach((bankItem: any, index: number) => {
                if (bankItem && itemsMap.has(bankItem.id)) {
                  const itemDetails = itemsMap.get(bankItem.id) as any;
                  if (itemDetails?.name?.toLowerCase().includes(searchTerm)) {
                    results.push({
                      id: bankItem.id,
                      name: itemDetails.name,
                      icon: itemDetails.icon,
                      count: bankItem.count,
                      location: `search.bankSlot ${index + 1}`,
                      rarity: itemDetails.rarity,
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
            if (character.inventory?.bags) {
              for (const bag of character.inventory.bags) {
                if (bag.inventory) {
                  for (const item of bag.inventory) {
                    if (item && item.id) {
                      characterItemIds.push(item.id);
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
              const itemsMap = new Map(itemsData.map((item: any) => [item.id, item]));
              
              for (const character of charactersData) {
                if (character.inventory?.bags) {
                  for (let bagIndex = 0; bagIndex < character.inventory.bags.length; bagIndex++) {
                    const bag = character.inventory.bags[bagIndex];
                    if (bag.inventory) {
                      for (let slotIndex = 0; slotIndex < bag.inventory.length; slotIndex++) {
                        const item = bag.inventory[slotIndex];
                        if (item && itemsMap.has(item.id)) {
                          const itemDetails = itemsMap.get(item.id) as any;
                          if (itemDetails?.name?.toLowerCase().includes(searchTerm)) {
                            results.push({
                              id: item.id,
                              name: itemDetails.name,
                              icon: itemDetails.icon,
                              count: item.count,
                              location: `${character.name} - search.characterBag ${bagIndex + 1}`,
                              rarity: itemDetails.rarity,
                              category: 'character',
                              character: character.name,
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
            .filter((item: any) => item !== null)
            .map((item: any) => item.id);
          
          if (storageItemIds.length > 0) {
            const itemsResponse = await fetchWith429Retry(`${GW2_API_BASE}/items?ids=${storageItemIds.join(',')}&lang=${lang}`);
            if (itemsResponse.ok) {
              const itemsData = await itemsResponse.json();
              const itemsMap = new Map(itemsData.map((item: any) => [item.id, item]));
              
              storageData.forEach((storageItem: any) => {
                if (storageItem && itemsMap.has(storageItem.id)) {
                  const itemDetails = itemsMap.get(storageItem.id) as any;
                  if (itemDetails?.name?.toLowerCase().includes(searchTerm)) {
                    results.push({
                      id: storageItem.id,
                      name: itemDetails.name,
                      icon: itemDetails.icon,
                      count: storageItem.count,
                      location: 'search.materialStorage',
                      rarity: itemDetails.rarity,
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