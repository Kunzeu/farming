'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { shouldShowAds } from '@/lib/patreon-benefits';

export default function NitroPayLoader() {
  const { user } = useAuth();
  const showAds = shouldShowAds(user);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;
    
    // Debug: Log solo en desarrollo
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      console.log('[NitroPayLoader] Estado:', {
        showAds: showAds,
        user: user ? { email: user.email, patreonStatus: user.patreonStatus, patreonTier: user.patreonTier } : null,
        scriptExists: !!document.querySelector('script[src*="nitropay"]'),
        nitroAdsExists: !!window.nitroAds,
      });
    }
    
    // Si el usuario es patreon activo, NO cargar el script de NitroPay
    if (!showAds) {
      // Si el script ya está cargado, intentar eliminarlo
      const existingScripts = document.querySelectorAll('script[src*="nitropay"], script[data-cfasync="false"]');
      existingScripts.forEach((script) => {
        const src = script.getAttribute('src');
        const textContent = script.textContent || '';
        if (src?.includes('nitropay') || textContent.includes('nitroAds')) {
          script.remove();
        }
      });
      if (existingScripts.length > 0 && typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        console.log('[NitroPayLoader] ❌ Scripts de NitroPay eliminados (usuario Patreon)');
      }
      // Limpiar el objeto global de NitroPay
      if (window.nitroAds) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (window as any).nitroAds;
      }
      return;
    }
    
    // Cargar el script de NitroPay según la guía oficial
    function loadNitroPay() {
      // Verificar si ya está cargado
      const existingScript = document.querySelector('script[src*="ads-2282.js"]');
      if (existingScript || window.nitroAds) {
        if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
          console.log('[NitroPayLoader] ✅ Script de NitroPay ya está cargado');
        }
        return; // Ya cargado
      }
      
      // Cargar el script inline primero (inicialización) según la guía
      const inlineScript = document.createElement('script');
      inlineScript.setAttribute('data-cfasync', 'false');
      inlineScript.textContent = `window.nitroAds=window.nitroAds||{createAd:function(){return new Promise(e=>{window.nitroAds.queue.push(["createAd",arguments,e])})},addUserToken:function(){window.nitroAds.queue.push(["addUserToken",arguments])},queue:[]};`;
      document.head.appendChild(inlineScript);
      
      // Cargar el script async según la guía
      const asyncScript = document.createElement('script');
      asyncScript.setAttribute('data-cfasync', 'false');
      asyncScript.async = true;
      asyncScript.src = 'https://s.nitropay.com/ads-2282.js';
      document.head.appendChild(asyncScript);
      
      if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        console.log('[NitroPayLoader] ✅ Scripts de NitroPay cargados para usuario normal');
      }
    }
    
    // Cargar inmediatamente cuando se carga la página
    loadNitroPay();
  }, [showAds, user]);

  return null; // No renderiza nada
}

