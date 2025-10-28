'use client';

import { useEffect } from 'react';

export default function GoogleAdsLoader() {
  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;
    
    function loadGoogleAds() {
      if (window.adsbygoogle) return; // Ya cargado
      
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2746156864243335';
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
    
    let adsLoaded = false;
    function loadAdsOnInteraction() {
      if (adsLoaded) return;
      adsLoaded = true;
      loadGoogleAds();
    }
    
    // Cargar inmediatamente cuando se carga la página
    loadAdsOnInteraction();
  }, []);

  return null; // No renderiza nada
}
