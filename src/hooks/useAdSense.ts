'use client';

import { useEffect } from 'react';

// Declarar tipos para AdSense
declare global {
  interface Window {
    adsbygoogle: Array<{
      google_ad_client: string;
      enable_page_level_ads: boolean;
    }>;
  }
}

interface AdSenseConfig {
  enabled: boolean;
  clientId?: string;
}

export const useAdSense = (config: AdSenseConfig) => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Si AdSense está deshabilitado, no cargar el script
    if (!config.enabled) {
      // Remover el script de AdSense si ya existe
      const existingScript = document.querySelector('script[src*="googlesyndication.com"]');
      if (existingScript) {
        existingScript.remove();
      }
      
      // Deshabilitar AdSense en la página actual
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({
        google_ad_client: config.clientId || 'ca-pub-2746156864243335',
        enable_page_level_ads: false
      });
      
      return;
    }

    // Si AdSense está habilitado, cargar el script normalmente
    if (!document.querySelector('script[src*="googlesyndication.com"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.clientId || 'ca-pub-2746156864243335'}`;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, [config.enabled, config.clientId]);
};

export default useAdSense;
