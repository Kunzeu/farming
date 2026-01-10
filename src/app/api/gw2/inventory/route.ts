import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { pool } from '@/lib/postgres-db';

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

/**
 * GET - Obtener inventario completo del jugador (Material Storage + Bank + Shared Inventory + Character Inventories)
 * Query params:
 *   - user_id: ID del usuario (para obtener API key de la BD)
 */
export async function GET(request: NextRequest) {
    const start = performance.now();
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('user_id');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID required' },
                { status: 400 }
            );
        }

        // Obtener API key del usuario
        let apiKey: string | undefined;
        try {
            const result = await pool.query('SELECT gw2_api_key AS "gw2ApiKey" FROM users WHERE id = $1', [userId]);
            if (result.rows.length > 0) {
                apiKey = result.rows[0].gw2ApiKey || undefined;
            }
        } catch (error) {
            console.error('Error fetching API key:', error);
        }

        if (!apiKey) {
            return NextResponse.json(
                { error: 'API key not found' },
                { status: 400 }
            );
        }

        // Objeto para acumular cantidades por item ID
        const itemCounts: Record<number, number> = {};

        // Función helper para procesar items
        const addItems = (items: Array<{ id: number; count: number } | null>) => {
            items.forEach(slot => {
                if (slot && slot.id) {
                    itemCounts[slot.id] = (itemCounts[slot.id] || 0) + slot.count;
                }
            });
        };

        // Hacer todas las llamadas principales en paralelo
        const [materialsData, bankData, inventoryData, characterNames] = await Promise.allSettled([
            // 1. Material Storage
            fetch(`${GW2_API_BASE}/account/materials?access_token=${apiKey}`, {
                headers: { 'Accept': 'application/json' },
            }).then(res => res.ok ? res.json() : []),

            // 2. Bank
            fetch(`${GW2_API_BASE}/account/bank?access_token=${apiKey}`, {
                headers: { 'Accept': 'application/json' },
            }).then(res => res.ok ? res.json() : []),

            // 3. Shared Inventory
            fetch(`${GW2_API_BASE}/account/inventory?access_token=${apiKey}`, {
                headers: { 'Accept': 'application/json' },
            }).then(res => res.ok ? res.json() : []),

            // 4. Character names
            fetch(`${GW2_API_BASE}/characters?access_token=${apiKey}`, {
                headers: { 'Accept': 'application/json' },
            }).then(res => res.ok ? res.json() : [])
        ]);

        // Procesar Material Storage
        if (materialsData.status === 'fulfilled' && Array.isArray(materialsData.value)) {
            materialsData.value.forEach((mat: { id: number; count: number }) => {
                itemCounts[mat.id] = (itemCounts[mat.id] || 0) + mat.count;
            });
        }

        // Procesar Bank
        if (bankData.status === 'fulfilled' && Array.isArray(bankData.value)) {
            addItems(bankData.value);
        }

        // Procesar Shared Inventory
        if (inventoryData.status === 'fulfilled' && Array.isArray(inventoryData.value)) {
            addItems(inventoryData.value);
        }

        // Procesar inventarios de personajes en paralelo
        if (characterNames.status === 'fulfilled' && Array.isArray(characterNames.value)) {
            const charInventoryPromises = characterNames.value.map(charName =>
                fetch(
                    `${GW2_API_BASE}/characters/${encodeURIComponent(charName)}/inventory?access_token=${apiKey}`,
                    { headers: { 'Accept': 'application/json' } }
                )
                    .then(res => res.ok ? res.json() : null)
                    .catch(error => {
                        console.error(`Error fetching inventory for character ${charName}:`, error);
                        return null;
                    })
            );

            const charInventories = await Promise.all(charInventoryPromises);

            charInventories.forEach(charInventory => {
                if (charInventory && charInventory.bags) {
                    charInventory.bags.forEach((bag: { inventory: Array<{ id: number; count: number } | null> } | null) => {
                        if (bag && bag.inventory) {
                            addItems(bag.inventory);
                        }
                    });
                }
            });
        }

        // Convertir a formato de array
        const result = Object.entries(itemCounts).map(([id, count]) => ({
            id: parseInt(id),
            count
        }));

        const duration = performance.now() - start;
        console.log(`[API] /gw2/inventory ejecutado en ${duration.toFixed(2)}ms - ${result.length} items únicos`);

        return NextResponse.json(result, {
            headers: {
                'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=30',
            },
        });
    } catch (error) {
        const duration = performance.now() - start;
        console.error(`[API] /gw2/inventory Error después de ${duration.toFixed(2)}ms:`, error);
        return NextResponse.json(
            {
                error: 'Failed to fetch inventory data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
