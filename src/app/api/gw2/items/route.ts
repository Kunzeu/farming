import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GW2_API_BASE = 'https://api.guildwars2.com/v2';

// Cache en memoria para item details (nombres e iconos)
// Estructura: { [lang]: { [itemId]: { name, icon } } }
const itemDetailsCache = new Map<string, Map<number, { name: string; icon: string }>>();

/**
 * GET - Obtener detalles de items (nombre e icono) con caché por idioma
 * Query params:
 *   - ids: IDs de items separados por coma
 *   - lang: Idioma (es, en, de, fr) - default: es
 */
export async function GET(request: NextRequest) {
    const start = performance.now();
    try {
        const searchParams = request.nextUrl.searchParams;
        const idsParam = searchParams.get('ids');
        const lang = searchParams.get('lang') || 'es';

        if (!idsParam) {
            return NextResponse.json(
                { error: 'Item IDs required' },
                { status: 400 }
            );
        }

        const itemIds = idsParam.split(',').map(id => parseInt(id.trim()));

        // Inicializar caché para este idioma si no existe
        if (!itemDetailsCache.has(lang)) {
            itemDetailsCache.set(lang, new Map());
        }

        const langCache = itemDetailsCache.get(lang)!;
        const result: Record<number, { name: string; icon: string }> = {};
        const missingIds: number[] = [];

        // Verificar qué items ya están en caché
        itemIds.forEach(id => {
            const cached = langCache.get(id);
            if (cached) {
                result[id] = cached;
            } else {
                missingIds.push(id);
            }
        });

        // Si hay items que no están en caché, obtenerlos de la API
        if (missingIds.length > 0) {
            try {
                // GW2 API permite hasta 200 IDs por request
                const chunks = [];
                for (let i = 0; i < missingIds.length; i += 200) {
                    chunks.push(missingIds.slice(i, i + 200));
                }

                const fetchPromises = chunks.map(chunk =>
                    fetch(`${GW2_API_BASE}/items?ids=${chunk.join(',')}&lang=${lang}`, {
                        headers: { 'Accept': 'application/json' },
                    }).then(res => res.ok ? res.json() : [])
                );

                const responses = await Promise.all(fetchPromises);
                const items = responses.flat();

                // Guardar en caché y en resultado
                items.forEach((item: { id: number; name: string; icon: string }) => {
                    const itemData = {
                        name: item.name,
                        icon: item.icon
                    };
                    langCache.set(item.id, itemData);
                    result[item.id] = itemData;
                });
            } catch (error) {
                console.error('Error fetching item details:', error);
            }
        }

        const duration = performance.now() - start;
        const cacheHitRate = ((itemIds.length - missingIds.length) / itemIds.length * 100).toFixed(1);
        console.log(
            `[API] /gw2/items ejecutado en ${duration.toFixed(2)}ms - ` +
            `${itemIds.length} items (${cacheHitRate}% cache hit, ${missingIds.length} fetched)`
        );

        return NextResponse.json(result, {
            headers: {
                // Cachear en el cliente por 24 horas (los items no cambian)
                'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
            },
        });
    } catch (error) {
        const duration = performance.now() - start;
        console.error(`[API] /gw2/items Error después de ${duration.toFixed(2)}ms:`, error);
        return NextResponse.json(
            {
                error: 'Failed to fetch item details',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
