import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export function useDailyRoutinePrefs() {
  const { user, updateUser } = useAuth();
  const [initialIds, setInitialIds] = useState<string[] | null>(null);
  const storageKey = useMemo(() => {
    const userId = user?.id || 'guest';
    return `gw2_dailyRoutine_${userId}`;
  }, [user?.id]);

  // Cargar IDs iniciales desde preferencias cuando el usuario esté listo
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        const ids = Array.isArray(parsed?.selectedFarmIds) ? parsed.selectedFarmIds : [];
        setInitialIds(ids);
      } else {
        setInitialIds([]);
      }
    } catch {
      setInitialIds([]);
    }
  }, [storageKey]);

  // Migrar datos de guest -> usuario cuando se autentique
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const userId = user?.id;
    if (!userId) return;
    const guestKey = 'gw2_dailyRoutine_guest';
    const userKey = `gw2_dailyRoutine_${userId}`;
    try {
      const guestRaw = window.localStorage.getItem(guestKey);
      const userRaw = window.localStorage.getItem(userKey);
      if (guestRaw && !userRaw) {
        window.localStorage.setItem(userKey, guestRaw);
        window.localStorage.removeItem(guestKey);
        // refrescar initialIds con lo migrado
        const parsed = JSON.parse(guestRaw);
        const ids = Array.isArray(parsed?.selectedFarmIds) ? parsed.selectedFarmIds : [];
        setInitialIds(ids);
      }
    } catch {
      // ignore
    }
  }, [user?.id]);

  const saveSelectedFarmIds = useCallback(async (ids: string[]) => {
    try {
      const payload = { selectedFarmIds: ids, lastUpdated: new Date().toISOString() };
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, JSON.stringify(payload));
      }
    } catch {
      // eslint-disable-next-line no-console
      console.error('Error saving daily routine to localStorage');
    }
  }, [storageKey]);

  // Debounced saver
  const useDebouncedSave = () => {
    const timerRef = useRef<number | null>(null);
    const debouncedSave = useCallback((ids: string[], delayMs = 600) => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        saveSelectedFarmIds(ids);
      }, delayMs);
    }, [saveSelectedFarmIds]);

    useEffect(() => {
      return () => {
        if (timerRef.current) {
          window.clearTimeout(timerRef.current);
        }
      };
    }, []);

    return debouncedSave;
  };

  return useMemo(() => ({ initialIds, saveSelectedFarmIds, useDebouncedSave }), [initialIds, saveSelectedFarmIds]);
}


