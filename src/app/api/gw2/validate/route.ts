import { NextRequest, NextResponse } from 'next/server';

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

export async function GET(request: NextRequest) {
  try {
    const apiKey = request.nextUrl.searchParams.get('api_key');

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required' },
        { status: 400 }
      );
    }

    // Test the API key by trying to access account info
    const response = await fetch(`${GW2_API_BASE}/account?access_token=${apiKey}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      return NextResponse.json({ valid: true });
    } else {
      return NextResponse.json(
        { valid: false, error: 'Invalid API key' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error validating API key:', error);
    return NextResponse.json(
      { 
        valid: false,
        error: 'Failed to validate API key',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 