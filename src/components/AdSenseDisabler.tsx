'use client';

import { useEffect } from 'react';

// Declarar tipos para AdSense
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSenseDisablerProps {
  disabled?: boolean;
}

const AdSenseDisabler = ({ disabled = false }: AdSenseDisablerProps) => {
  useEffect(() => {
    if (typeof window === 'undefined' || !disabled) return;

    // Deshabilitar AdSense en esta página
    if (window.adsbygoogle) {
      window.adsbygoogle.push({
        google_ad_client: 'ca-pub-2746156864243335',
        enable_page_level_ads: false
      });
    }

    // Remover cualquier anuncio existente
    const ads = document.querySelectorAll('.adsbygoogle');
    ads.forEach(ad => {
      if (ad.parentNode) {
        ad.parentNode.removeChild(ad);
      }
    });

    // Ocultar contenedores de anuncios
    const adContainers = document.querySelectorAll('[data-ad-slot], [data-ad-client]');
    adContainers.forEach(container => {
      (container as HTMLElement).style.display = 'none';
    });

  }, [disabled]);

  return null;
};

export default AdSenseDisabler;
