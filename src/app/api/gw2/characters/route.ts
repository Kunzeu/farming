import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/postgres-db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('user_id');

        if (!userId) {
            return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        // Get API key from database
        let apiKey: string | undefined;
        try {
            const result = await pool.query('SELECT gw2_api_key AS "gw2ApiKey" FROM users WHERE id = $1', [userId]);
            if (result.rows.length > 0) {
                apiKey = result.rows[0].gw2ApiKey || undefined;
            }
        } catch (error) {
            console.error('Error fetching API key:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        if (!apiKey) {
            return NextResponse.json({ error: 'API key not found' }, { status: 404 });
        }

        // Fetch characters from GW2 API
        const response = await fetch(`${GW2_API_BASE}/characters?access_token=${apiKey}`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch characters from GW2 API' },
                { status: response.status }
            );
        }

        const characters = await response.json();

        return NextResponse.json(characters);
    } catch (error) {
        console.error('Error in GET /api/gw2/characters:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
