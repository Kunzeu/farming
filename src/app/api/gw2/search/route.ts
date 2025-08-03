import { NextRequest, NextResponse } from 'next/server';

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

interface BankItem {
  id: number;
  count?: number;
  slot?: number;
}

interface Character {
  name: string;
}

interface EquipmentItem {
  id: number;
  slot?: string;
}

interface BagItem {
  id: number;
  count?: number;
}

interface Bag {
  id: number;
  inventory: (BagItem | null)[];
}

interface CharacterData {
  equipment: (EquipmentItem | null)[];
  bags: (Bag | null)[];
}

interface Material {
  id: number;
  count: number;
}

interface MaterialDetails {
  id: number;
  name: string;
  category?: string;
}

interface ItemDetails {
  id: number;
  name: string;
  icon?: string;
  rarity?: string;
}

interface SearchResult {
  id: number;
  name: string;
  icon?: string;
  rarity?: string;
  location: string;
  count: number;
  character?: string;
  slot?: string | number;
  bag?: number;
  category?: string;
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.nextUrl.searchParams.get('api_key');
    const query = request.nextUrl.searchParams.get('q');
    const scope = request.nextUrl.searchParams.get('scope') || 'all';

    if (!apiKey) {
      return NextResponse.json({ error: 'API key required' }, { status: 400 });
    }

    if (!query || query.length < 2) {
      return NextResponse.json({ error: 'Query must be at least 2 characters' }, { status: 400 });
    }

    const results: SearchResult[] = [];
    const searchQuery = query.toLowerCase();
    const MAX_RESULTS = 20; // Limitar resultados para mayor velocidad

    // Search in bank
    if (scope === 'all' || scope === 'bank') {
      try {
        const bankResponse = await fetch(`${GW2_API_BASE}/account/bank?access_token=${apiKey}`);
        if (bankResponse.ok) {
          const bankData = await bankResponse.json() as (BankItem | null)[];
          const bankItems = bankData.filter((item): item is BankItem => item !== null);
          
          if (bankItems.length > 0) {
            const itemIds = bankItems.map((item: BankItem) => item.id);
            console.log(`Searching ${itemIds.length} bank items for: ${searchQuery}`);
            
            const itemsResponse = await fetch(`${GW2_API_BASE}/items?ids=${itemIds.join(',')}`);
            if (itemsResponse.ok) {
              const itemsData = await itemsResponse.json() as ItemDetails[];
              console.log(`Found ${itemsData.length} item details`);
              
              const matchingItems = itemsData.filter((item: ItemDetails) => 
                item.name && item.name.toLowerCase().includes(searchQuery)
              );
              
              console.log(`Found ${matchingItems.length} matching items in bank`);
              
              for (const item of matchingItems) {
                if (results.length >= MAX_RESULTS) break;
                const bankItem = bankItems.find((bi: BankItem) => bi.id === item.id);
                results.push({
                  ...item,
                  location: 'bank',
                  count: bankItem?.count || 1,
                  slot: bankItem?.slot
                });
              }
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
        const charactersResponse = await fetch(`${GW2_API_BASE}/characters?access_token=${apiKey}`);
        if (charactersResponse.ok) {
          const charactersData = await charactersResponse.json() as Character[];
          console.log(`Searching ${charactersData.length} characters for: ${searchQuery}`);
          
          for (const character of charactersData) {
            if (results.length >= MAX_RESULTS) break;
            
            try {
              const characterResponse = await fetch(`${GW2_API_BASE}/characters/${encodeURIComponent(character.name)}?access_token=${apiKey}`);
              if (characterResponse.ok) {
                const characterData = await characterResponse.json() as CharacterData;
                const equipment = characterData.equipment || [];
                const bags = characterData.bags || [];
                
                // Search in equipment
                const equipmentItems = equipment.filter((item): item is EquipmentItem => item !== null);
                if (equipmentItems.length > 0) {
                  const itemIds = equipmentItems.map((item: EquipmentItem) => item.id);
                  const itemsResponse = await fetch(`${GW2_API_BASE}/items?ids=${itemIds.join(',')}`);
                  if (itemsResponse.ok) {
                    const itemsData = await itemsResponse.json() as ItemDetails[];
                    const matchingItems = itemsData.filter((item: ItemDetails) => 
                      item.name && item.name.toLowerCase().includes(searchQuery)
                    );
                    
                    for (const item of matchingItems) {
                      if (results.length >= MAX_RESULTS) break;
                      const equipItem = equipmentItems.find((ei: EquipmentItem) => ei.id === item.id);
                      results.push({
                        ...item,
                        location: 'character',
                        character: character.name,
                        slot: equipItem?.slot,
                        count: 1
                      });
                    }
                  }
                }
                
                // Search in bags
                for (const bag of bags) {
                  if (bag && bag.inventory) {
                    const bagItems = bag.inventory.filter((item): item is BagItem => item !== null);
                    if (bagItems.length > 0) {
                      const itemIds = bagItems.map((item: BagItem) => item.id);
                      const itemsResponse = await fetch(`${GW2_API_BASE}/items?ids=${itemIds.join(',')}`);
                      if (itemsResponse.ok) {
                        const itemsData = await itemsResponse.json() as ItemDetails[];
                        const matchingItems = itemsData.filter((item: ItemDetails) => 
                          item.name && item.name.toLowerCase().includes(searchQuery)
                        );
                        
                        for (const item of matchingItems) {
                          if (results.length >= MAX_RESULTS) break;
                          const bagItem = bagItems.find((bi: BagItem) => bi.id === item.id);
                          results.push({
                            ...item,
                            location: 'character',
                            character: character.name,
                            bag: bag.id,
                            count: bagItem?.count || 1
                          });
                        }
                      }
                    }
                  }
                }
              }
            } catch (error) {
              console.error(`Error searching character ${character.name}:`, error);
            }
          }
        }
      } catch (error) {
        console.error('Error searching characters:', error);
      }
    }

    // Search in materials storage
    if (scope === 'all' || scope === 'storage') {
      try {
        const materialsResponse = await fetch(`${GW2_API_BASE}/account/materials?access_token=${apiKey}`);
        if (materialsResponse.ok) {
          const materialsData = await materialsResponse.json() as Material[];
          
          if (materialsData.length > 0) {
            const materialIds = materialsData.map((material: Material) => material.id);
            console.log(`Searching ${materialIds.length} materials for: ${searchQuery}`);
            
            const materialsDetailsResponse = await fetch(`${GW2_API_BASE}/materials?ids=${materialIds.join(',')}`);
            if (materialsDetailsResponse.ok) {
              const materialsDetails = await materialsDetailsResponse.json() as MaterialDetails[];
              console.log(`Found ${materialsDetails.length} material details`);
              
              const matchingMaterials = materialsDetails.filter((material: MaterialDetails) => 
                material.name && material.name.toLowerCase().includes(searchQuery)
              );
              
              console.log(`Found ${matchingMaterials.length} matching materials`);
              
              for (const material of matchingMaterials) {
                if (results.length >= MAX_RESULTS) break;
                const storageMaterial = materialsData.find((sm: Material) => sm.id === material.id);
                results.push({
                  ...material,
                  location: 'storage',
                  count: storageMaterial?.count || 0,
                  category: material.category
                });
              }
            }
          }
        }
      } catch (error) {
        console.error('Error searching materials:', error);
      }
    }

    console.log(`Total results found: ${results.length}`);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: 'Failed to search', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 