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
    
    // Debug: Log solo en desarrollo
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      console.log('[GoogleAdsLoader] Estado:', {
        showAds: showAds,
        user: user ? { email: user.email, patreonStatus: user.patreonStatus, patreonTier: user.patreonTier } : null,
        scriptExists: !!document.querySelector('script[src*="googlesyndication"]'),
        adsbygoogleExists: !!window.adsbygoogle,
      });
    }
    
    // Si el usuario es patreon activo, NO cargar el script de AdSense
    if (!showAds) {
      // Si el script ya está cargado, intentar eliminarlo
      const existingScript = document.querySelector('script[src*="googlesyndication"]');
      if (existingScript) {
        existingScript.remove();
        if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          console.log('[GoogleAdsLoader] ❌ Script de AdSense eliminado (usuario Patreon)');
        }
      }
      // Limpiar el objeto global de AdSense
      if (window.adsbygoogle) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (window as any).adsbygoogle;
      }
      return;
    }
    
    function loadGoogleAds() {
      if (window.adsbygoogle) {
        if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          console.log('[GoogleAdsLoader] ✅ Script de AdSense ya está cargado');
        }
        return; // Ya cargado
      }
      
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2746156864243335';
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
      
      if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        console.log('[GoogleAdsLoader] ✅ Script de AdSense cargado para usuario normal');
      }
    }
    
    let adsLoaded = false;
    function loadAdsOnInteraction() {
      if (adsLoaded) return;
      adsLoaded = true;
      loadGoogleAds();
    }
    
    // Cargar inmediatamente cuando se carga la página
    loadAdsOnInteraction();
  }, [showAds, user]);

  return null; // No renderiza nada
}
