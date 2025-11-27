'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { shouldShowAds } from '@/lib/patreon-benefits';

export default function GoogleAdsLoader() {
  const { user } = useAuth();
  const showAds = shouldShowAds(user);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;
    
    // Si el usuario es patreon activo, NO cargar el script de AdSense
    if (!showAds) {
      // Si el script ya está cargado, intentar eliminarlo
      const existingScript = document.querySelector('script[src*="googlesyndication"]');
      if (existingScript) {
        existingScript.remove();
      }
      // Limpiar el objeto global de AdSense
      if (window.adsbygoogle) {
        delete (window as any).adsbygoogle;
      }
      return;
    }
    
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
  }, [showAds]);

  return null; // No renderiza nada
}
