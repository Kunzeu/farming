import { useState, useEffect, useMemo, useRef } from 'react';
import { GW2Item } from '@/types/gw2';

// Tipos para el caché
interface CachedItem {
  data: GW2Item;
  expiry: number;
}

// Caché global por idioma e ID de item
const itemCache: Record<string, Record<number, CachedItem>> = {};

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 horas

/**
 * Hook para obtener un solo item de GW2 API con caché por idioma
 * @param itemId - ID del item a obtener
 * @param language - Código de idioma (en, es, fr, de)
 * @param options - Opciones adicionales (timeout, fallback, etc.)
 */
export function useGW2Item(
  itemId: number | null,
  language: string,
  options?: {
    timeout?: number;
    fallback?: GW2Item;
    onSuccess?: (data: GW2Item) => void;
    onError?: (error: Error) => void;
  }
) {
  const [item, setItem] = useState<GW2Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const timeout = options?.timeout ?? 10000;
  const fallback = options?.fallback;
  
  // Usar refs para callbacks para evitar recrear el effect
  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);
  
  // Actualizar refs cuando cambien las callbacks
  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  });

  useEffect(() => {
    if (!itemId) {
      setLoading(false);
      return;
    }

    const now = Date.now();
    
    // Inicializar caché para este idioma si no existe
    if (!itemCache[language]) {
      itemCache[language] = {};
    }

    const cached = itemCache[language][itemId];
    
    // Verificar caché para este item e idioma específico
    if (cached && cached.expiry > now) {
      setItem(cached.data);
      setLoading(false);
      if (onSuccessRef.current) {
        onSuccessRef.current(cached.data);
      }
      return;
    }

    // Hacer la llamada solo si no hay caché válido
    const fetchItem = async () => {
      try {
        setLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          timeout
        );

        const response = await fetch(
          `https://api.guildwars2.com/v2/items/${itemId}?lang=${language}`,
          {
            headers: {
              'Accept': 'application/json',
              'Accept-Encoding': 'gzip, deflate, br'
            },
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to fetch item ${itemId}: ${response.status} ${response.statusText}`);
        }

        const data = await response.json() as GW2Item;
        
        // Actualizar caché para este idioma e item
        itemCache[language][itemId] = {
          data,
          expiry: now + CACHE_TTL
        };
        
        setItem(data);
        if (onSuccessRef.current) {
          onSuccessRef.current(data);
        }
      } catch (err) {
        const fetchError = err instanceof Error ? err : new Error('Unknown error');
        setError(fetchError);
        
        // Usar fallback si está disponible
        if (fallback) {
          setItem(fallback);
        }
        
        if (onErrorRef.current) {
          onErrorRef.current(fetchError);
        } else {
          console.error(`Error fetching item ${itemId}:`, fetchError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItem();
  }, [itemId, language, timeout, fallback]);

  return { item, loading, error };
}

/**
 * Hook para obtener múltiples items de GW2 API con caché por idioma
 * @param itemIds - Array de IDs de items a obtener
 * @param language - Código de idioma (en, es, fr, de)
 * @param options - Opciones adicionales (timeout, fallback, etc.)
 */
export function useGW2Items(
  itemIds: number[],
  language: string,
  options?: {
    timeout?: number;
    fallback?: Record<number, GW2Item>;
    onSuccess?: (data: Record<number, GW2Item>) => void;
    onError?: (error: Error) => void;
  }
) {
  const [items, setItems] = useState<Record<number, GW2Item>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const itemIdsKey = useMemo(() => itemIds.join(','), [itemIds]);
  const timeout = options?.timeout ?? 15000;
  const fallback = options?.fallback;
  
  // Usar refs para callbacks para evitar recrear el effect
  const onSuccessRef = useRef(options?.onSuccess);
  const onErrorRef = useRef(options?.onError);
  
  // Actualizar refs cuando cambien las callbacks
  useEffect(() => {
    onSuccessRef.current = options?.onSuccess;
    onErrorRef.current = options?.onError;
  });

  useEffect(() => {
    if (!itemIds || itemIds.length === 0) {
      setLoading(false);
      return;
    }

    const now = Date.now();
    
    // Inicializar caché para este idioma si no existe
    if (!itemCache[language]) {
      itemCache[language] = {};
    }

    // Verificar qué items están en caché y cuáles necesitan ser obtenidos
    const cachedItems: Record<number, GW2Item> = {};
    const itemsToFetch: number[] = [];

    itemIds.forEach(id => {
      const cached = itemCache[language][id];
      if (cached && cached.expiry > now) {
        cachedItems[id] = cached.data;
      } else {
        itemsToFetch.push(id);
      }
    });

    // Si todos los items están en caché, devolverlos inmediatamente
    if (itemsToFetch.length === 0) {
      setItems(cachedItems);
      setLoading(false);
      if (onSuccessRef.current) {
        onSuccessRef.current(cachedItems);
      }
      return;
    }

    // Hacer la llamada solo para los items que no están en caché
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const controller = new AbortController();
        const timeoutId = setTimeout(
          () => controller.abort(),
          timeout
        );

        const response = await fetch(
          `https://api.guildwars2.com/v2/items?ids=${itemsToFetch.join(',')}&lang=${language}`,
          {
            headers: {
              'Accept': 'application/json',
              'Accept-Encoding': 'gzip, deflate, br'
            },
            signal: controller.signal
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`Failed to fetch items: ${response.status} ${response.statusText}`);
        }

        const fetchedItems = await response.json() as GW2Item[];
        
        // Actualizar caché y combinar con items en caché
        const allItems: Record<number, GW2Item> = { ...cachedItems };
        
        fetchedItems.forEach((item) => {
          // Actualizar caché
          itemCache[language][item.id] = {
            data: item,
            expiry: now + CACHE_TTL
          };
          allItems[item.id] = item;
        });
        
        setItems(allItems);
        if (onSuccessRef.current) {
          onSuccessRef.current(allItems);
        }
      } catch (err) {
        const fetchError = err instanceof Error ? err : new Error('Unknown error');
        setError(fetchError);
        
        // Usar fallback si está disponible
        if (fallback) {
          setItems(fallback);
        }
        
        if (onErrorRef.current) {
          onErrorRef.current(fetchError);
        } else {
          console.error('Error fetching items:', fetchError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
    // itemIds está representado por itemIdsKey (memoizado)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemIdsKey, language, timeout, fallback]);

  return { items, loading, error };
}

/**
 * Función para limpiar el caché (útil para testing o cuando se necesita forzar una actualización)
 */
export function clearGW2ItemCache(language?: string) {
  if (language) {
    delete itemCache[language];
  } else {
    Object.keys(itemCache).forEach(key => delete itemCache[key]);
  }
}

