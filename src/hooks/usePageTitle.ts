import { useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';

export const usePageTitle = (titleKey: string, fallbackTitle?: string) => {
  const { t } = useI18n();
  
  useEffect(() => {
    const previousTitle = document.title;
    const localizedTitle = t(titleKey, fallbackTitle || titleKey);
    document.title = `${localizedTitle} - True Farming`;
    
    return () => {
      document.title = previousTitle;
    };
  }, [titleKey, fallbackTitle, t]);
};
