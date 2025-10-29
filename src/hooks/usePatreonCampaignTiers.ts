import { useState, useCallback } from 'react';

interface PatreonTier {
  id: string;
  type: string;
  attributes: {
    amount_cents: number;
    title: string;
    description: string;
    image_url?: string;
    patron_count: number;
    published: boolean;
    published_at?: string;
    url?: string;
    created_at?: string;
    edited_at?: string;
  };
}

interface PatreonTiersResponse {
  data: PatreonTier[];
  included?: unknown[];
  links?: {
    first?: string;
    last?: string;
    next?: string;
    prev?: string;
  };
}

interface UsePatreonCampaignTiersReturn {
  tiers: PatreonTier[] | null;
  loading: boolean;
  error: string | null;
  fetchTiers: (accessToken: string, campaignId?: string) => Promise<void>;
  clearError: () => void;
}

export function usePatreonCampaignTiers(): UsePatreonCampaignTiersReturn {
  const [tiers, setTiers] = useState<PatreonTier[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTiers = useCallback(async (accessToken: string, campaignId: string = '12496802') => {
    setLoading(true);
    setError(null);

    try {
      const url = `/api/auth/patreon/campaign-tiers?campaignId=${encodeURIComponent(campaignId)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data: PatreonTiersResponse = await response.json();
      setTiers(data.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al obtener tiers';
      setError(errorMessage);
      console.error('Error fetching Patreon campaign tiers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    tiers,
    loading,
    error,
    fetchTiers,
    clearError,
  };
}
