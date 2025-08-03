import { NextRequest, NextResponse } from 'next/server';

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

export async function GET(request: NextRequest) {
  try {
    // Get API key from query params or headers
    const apiKey = request.nextUrl.searchParams.get('api_key') || 
                   request.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required' },
        { status: 400 }
      );
    }

    // Fetch wallet data from GW2 API
    const response = await fetch(`${GW2_API_BASE}/account/wallet?access_token=${apiKey}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`GW2 API error: ${response.status} ${response.statusText}`);
    }

    const walletData = await response.json();

    return NextResponse.json(walletData);
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch wallet data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 