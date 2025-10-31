import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';;

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

export async function GET(request: NextRequest) {
  const start = performance.now();
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

    // OPTIMIZADO: Hacer solo 1 llamada por personaje (sin inventarios para reducir carga)
    // Si necesitas inventarios, puedes hacerlo en el frontend después de cargar los personajes
    const charactersData = await Promise.all(
      characterNames.slice(0, 5).map(async (characterName: string) => { // Limitar a 5 personajes
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
            return characterData;
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

    const duration = performance.now() - start;
    console.log(`[API] /gw2/characters ejecutado en ${duration.toFixed(2)}ms`);

    return NextResponse.json(validCharacters);
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[API] /gw2/characters Error después de ${duration.toFixed(2)}ms:`, error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch characters data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 