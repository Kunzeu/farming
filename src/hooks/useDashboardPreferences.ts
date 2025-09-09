import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserPreferences } from '@/types/auth';

export interface DashboardPreferences {
  layout: 'grid' | 'list';
  cardOrder: string[];
  hiddenCards: string[];
  cardSizes: Record<string, 'small' | 'medium' | 'large'>;
}

const defaultPreferences: DashboardPreferences = {
  layout: 'grid',
  cardOrder: [
    'trophy',
    'farming-routes',
    'daily-routine',
    'fractals',
    'ls4-meta',
    'garden',
    'salvaging',
    'festivals',
    'buyout',
    'orrian-jewelry-box',
    'giftOfMastery',
    'others',
    'glossary'
  ],
  hiddenCards: [],
  cardSizes: {}
};

export function useDashboardPreferences() {
  const { user, updateUser } = useAuth();
  const [preferences, setPreferences] = useState<DashboardPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar preferencias del usuario
  useEffect(() => {
    if (user?.preferences?.dashboard) {
      setPreferences({
        layout: user.preferences.dashboard.layout || defaultPreferences.layout,
        cardOrder: user.preferences.dashboard.cardOrder || defaultPreferences.cardOrder,
        hiddenCards: user.preferences.dashboard.hiddenCards || defaultPreferences.hiddenCards,
        cardSizes: user.preferences.dashboard.cardSizes || defaultPreferences.cardSizes
      });
    }
  }, [user?.preferences?.dashboard]);

  // Guardar preferencias en la base de datos
  const savePreferences = useCallback(async (newPreferences: Partial<DashboardPreferences>) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updatedPreferences = {
        ...preferences,
        ...newPreferences
      };

      setPreferences(updatedPreferences);

      // Actualizar en la base de datos
      const updatedUserPreferences: UserPreferences = {
        ...user.preferences,
        dashboard: updatedPreferences
      };

      await updateUser({ preferences: updatedUserPreferences });
    } catch (error) {
      console.error('Error saving dashboard preferences:', error);
      // Revertir cambios en caso de error
      setPreferences(preferences);
    } finally {
      setIsLoading(false);
    }
  }, [user, preferences, updateUser]);

  // Funciones específicas para el dashboard
  const updateCardOrder = useCallback((newOrder: string[]) => {
    savePreferences({ cardOrder: newOrder });
  }, [savePreferences]);

  const toggleCardVisibility = useCallback((cardId: string) => {
    const newHiddenCards = preferences.hiddenCards.includes(cardId)
      ? preferences.hiddenCards.filter(id => id !== cardId)
      : [...preferences.hiddenCards, cardId];
    
    savePreferences({ hiddenCards: newHiddenCards });
  }, [preferences.hiddenCards, savePreferences]);

  const updateCardSize = useCallback((cardId: string, size: 'small' | 'medium' | 'large') => {
    const newCardSizes = {
      ...preferences.cardSizes,
      [cardId]: size
    };
    
    savePreferences({ cardSizes: newCardSizes });
  }, [preferences.cardSizes, savePreferences]);

  const setLayout = useCallback((layout: 'grid' | 'list') => {
    savePreferences({ layout });
  }, [savePreferences]);

  const resetToDefault = useCallback(() => {
    savePreferences(defaultPreferences);
  }, [savePreferences]);

  return {
    preferences,
    isLoading,
    updateCardOrder,
    toggleCardVisibility,
    updateCardSize,
    setLayout,
    resetToDefault,
    savePreferences
  };
}
