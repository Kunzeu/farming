import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';;

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

// Cache in-memory para reducir carga
const materialsCache = new Map<string, { data: unknown; expiry: number }>();
const MATERIALS_TTL_MS = 15 * 60 * 1000; // 15 minutos

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

    // Check cache first
    const cached = materialsCache.get(apiKey);
    const now = Date.now();
    if (cached && cached.expiry > now) {
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=30',
        },
      });
    }

    const response = await fetch(`${GW2_API_BASE}/account/materials?access_token=${apiKey}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`GW2 API error: ${response.status} ${response.statusText}`);
    }

    const materialsData = await response.json();

    // Get material details
    const materialIds = materialsData.map((material: { id: number }) => material.id);
    
    if (materialIds.length > 0) {
      const materialsResponse = await fetch(`${GW2_API_BASE}/materials?ids=${materialIds.join(',')}`);
      if (materialsResponse.ok) {
        const materialsDetails = await materialsResponse.json();
        
        // Merge material details with storage data
        const enrichedMaterialsData = materialsData.map((storageMaterial: { id: number }) => {
          const materialDetails = materialsDetails.find((material: { id: number }) => material.id === storageMaterial.id);
          return {
            ...storageMaterial,
            name: materialDetails?.name || `Material ${storageMaterial.id}`,
            icon: materialDetails?.icon,
            category: materialDetails?.category,
            max_count: materialDetails?.max_count || 250
          };
        });
        
        // Update cache with enriched data
        materialsCache.set(apiKey, { data: enrichedMaterialsData, expiry: now + MATERIALS_TTL_MS });
        
        const duration = performance.now() - start;
        console.log(`[API] /gw2/materials ejecutado en ${duration.toFixed(2)}ms`);
        
        return NextResponse.json(enrichedMaterialsData, {
          headers: {
            'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=30',
          },
        });
      }
    }

    // Update cache with basic data
    materialsCache.set(apiKey, { data: materialsData, expiry: now + MATERIALS_TTL_MS });

    const duration = performance.now() - start;
    console.log(`[API] /gw2/materials ejecutado en ${duration.toFixed(2)}ms`);

    return NextResponse.json(materialsData, {
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    const duration = performance.now() - start;
    console.error(`[API] /gw2/materials Error después de ${duration.toFixed(2)}ms:`, error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch materials data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 