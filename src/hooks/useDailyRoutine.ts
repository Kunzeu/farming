import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserPreferences } from '@/types/auth';

export function useDailyRoutinePrefs() {
  const { user, updateUser } = useAuth();
  const [initialIds, setInitialIds] = useState<string[] | null>(null);
  const hasLoadedRef = useRef(false);

  // Cargar IDs iniciales desde preferencias cuando el usuario esté listo
  useEffect(() => {
    if (!user || hasLoadedRef.current) return;
    const ids = user.preferences?.dailyRoutine?.selectedFarmIds || [];
    setInitialIds(Array.isArray(ids) ? ids : []);
    hasLoadedRef.current = true;
  }, [user]);

  const saveSelectedFarmIds = useCallback(async (ids: string[]) => {
    if (!user) return;
    const nextPrefs: UserPreferences = {
      ...user.preferences,
      dailyRoutine: {
        selectedFarmIds: ids,
        lastUpdated: new Date().toISOString()
      }
    };
    await updateUser({ preferences: nextPrefs });
  }, [user, updateUser]);

  // Debounced saver
  const useDebouncedSave = () => {
    const timerRef = useRef<number | null>(null);
    const debouncedSave = useCallback((ids: string[], delayMs = 600) => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      timerRef.current = window.setTimeout(() => {
        saveSelectedFarmIds(ids).catch((e) => {
          // eslint-disable-next-line no-console
          console.error('Error saving daily routine preferences:', e);
        });
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


