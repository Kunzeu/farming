import { NextRequest, NextResponse } from 'next/server';

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.nextUrl.searchParams.get('api_key') || 
                   request.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required' },
        { status: 400 }
      );
    }

    // Primero obtenemos la lista de nombres de personajes
    const charactersResponse = await fetch(`${GW2_API_BASE}/characters?access_token=${apiKey}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!charactersResponse.ok) {
      throw new Error(`GW2 API error: ${charactersResponse.status} ${charactersResponse.statusText}`);
    }

    const characterNames = await charactersResponse.json();

    // Luego obtenemos la información detallada de cada personaje
    const charactersData = await Promise.all(
      characterNames.map(async (characterName: string) => {
        try {
          const characterResponse = await fetch(
            `${GW2_API_BASE}/characters/${encodeURIComponent(characterName)}?access_token=${apiKey}`,
            {
              headers: {
                'Accept': 'application/json',
              },
            }
          );

          if (characterResponse.ok) {
            const characterData = await characterResponse.json();
            
            // También obtenemos el inventario del personaje
            try {
              const inventoryResponse = await fetch(
                `${GW2_API_BASE}/characters/${encodeURIComponent(characterName)}/inventory?access_token=${apiKey}`,
                {
                  headers: {
                    'Accept': 'application/json',
                  },
                }
              );

              if (inventoryResponse.ok) {
                const inventoryData = await inventoryResponse.json();
                return {
                  ...characterData,
                  inventory: inventoryData
                };
              } else {
                console.error(`Error fetching inventory for ${characterName}:`, inventoryResponse.status);
                return {
                  ...characterData,
                  inventory: null
                };
              }
            } catch (inventoryError) {
              console.error(`Error fetching inventory for ${characterName}:`, inventoryError);
              return {
                ...characterData,
                inventory: null
              };
            }
          } else {
            console.error(`Error fetching character ${characterName}:`, characterResponse.status);
            return null;
          }
        } catch (error) {
          console.error(`Error fetching character ${characterName}:`, error);
          return null;
        }
      })
    );

    // Filtramos los personajes que se pudieron cargar correctamente
    const validCharacters = charactersData.filter(character => character !== null);

    return NextResponse.json(validCharacters);
  } catch (error) {
    console.error('Error fetching characters data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch characters data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 