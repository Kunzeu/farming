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
    const materialIds = materialsData.map((material: any) => material.id);
    
    if (materialIds.length > 0) {
      const materialsResponse = await fetch(`${GW2_API_BASE}/materials?ids=${materialIds.join(',')}`);
      if (materialsResponse.ok) {
        const materialsDetails = await materialsResponse.json();
        
        // Merge material details with storage data
        const enrichedMaterialsData = materialsData.map((storageMaterial: any) => {
          const materialDetails = materialsDetails.find((material: any) => material.id === storageMaterial.id);
          return {
            ...storageMaterial,
            name: materialDetails?.name || `Material ${storageMaterial.id}`,
            icon: materialDetails?.icon,
            category: materialDetails?.category,
            max_count: materialDetails?.max_count || 250
          };
        });
        
        return NextResponse.json(enrichedMaterialsData);
      }
    }

    return NextResponse.json(materialsData);
  } catch (error) {
    console.error('Error fetching materials data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch materials data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 