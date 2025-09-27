import { useState, useEffect, useCallback } from 'react';

// Hook simple y seguro para optimizar fetches a GW2 API
export function useGW2Fetch<T>(url: string | null, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'public, max-age=300'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [url, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Hook específico para items de GW2
export function useGW2Items(itemIds: number[], language: string = 'en') {
  const url = itemIds.length > 0 
    ? `https://api.guildwars2.com/v2/items?ids=${itemIds.join(',')}&lang=${language}`
    : null;
  
  return useGW2Fetch<any[]>(url, [itemIds, language]);
}

// Hook específico para precios de GW2
export function useGW2Prices(itemIds: number[]) {
  const url = itemIds.length > 0 
    ? `https://api.guildwars2.com/v2/commerce/prices?ids=${itemIds.join(',')}`
    : null;
  
  return useGW2Fetch<any[]>(url, [itemIds]);
}
