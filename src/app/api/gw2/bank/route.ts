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

    const response = await fetch(`${GW2_API_BASE}/account/bank?access_token=${apiKey}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`GW2 API error: ${response.status} ${response.statusText}`);
    }

    const bankData = await response.json();

    // Get item details for non-null items
    const itemIds = bankData.filter((item: unknown) => item !== null).map((item: { id: number }) => item.id);
    
    if (itemIds.length > 0) {
      const itemsResponse = await fetch(`${GW2_API_BASE}/items?ids=${itemIds.join(',')}`);
      if (itemsResponse.ok) {
        const itemsData = await itemsResponse.json();
        
                 // Merge item details with bank data
         const enrichedBankData = bankData.map((bankItem: unknown, index: number) => {
           if (bankItem === null) return null;
           
           const typedBankItem = bankItem as { id: number };
           const itemDetails = itemsData.find((item: { id: number }) => item.id === typedBankItem.id);
           return {
             ...bankItem,
             name: itemDetails?.name || `Item ${typedBankItem.id}`,
             icon: itemDetails?.icon,
             rarity: itemDetails?.rarity,
             type: itemDetails?.type,
             slot: index
           };
         });
        
        return NextResponse.json(enrichedBankData);
      }
    }

    return NextResponse.json(bankData);
  } catch (error) {
    console.error('Error fetching bank data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch bank data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 