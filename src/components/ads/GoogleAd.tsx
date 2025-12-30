'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { shouldShowAds } from '@/lib/patreon-benefits';

interface GoogleAdProps {
  adSlot: string;
  adFormat?: string;
  adStyle?: React.CSSProperties;
  className?: string;
}

export default function GoogleAd({
  adSlot,
  adFormat = 'auto',
  adStyle = { display: 'block' },
  className = ''
}: GoogleAdProps) {
  const { user } = useAuth();
  const showAds = shouldShowAds(user);
  const adRef = useRef<HTMLModElement>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Si el usuario es Patreon activo, no inicializar el anuncio
    if (!showAds) {
      return;
    }
    const el = adRef.current as unknown as HTMLElement | null;
    if (!el || initialized) return;

    // Función para inicializar el anuncio
    const initAd = () => {
      // Verificar que el script de AdSense esté cargado
      if (!window.adsbygoogle) {
        // Esperar un poco más si el script aún no está disponible
        setTimeout(initAd, 100);
        return;
      }

      // Verificar que el elemento tenga ancho antes de inicializar
      const rect = el.getBoundingClientRect();
      if (rect.width === 0) {
        let timeoutFired = false;
        let observerDisconnected = false;

        // Esperar a que tenga ancho
        const ro = new ResizeObserver(() => {
          if (observerDisconnected || timeoutFired) return;
          const newRect = el.getBoundingClientRect();
          if (newRect.width > 0) {
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              setInitialized(true);
              observerDisconnected = true;
              ro.disconnect();
            } catch (error) {
              console.warn('Error al cargar anuncio de Google:', error);
            }
          }
        });
        ro.observe(el);

        // Timeout de seguridad: inicializar después de 2 segundos aunque no tenga ancho
        setTimeout(() => {
          if (!observerDisconnected) {
            timeoutFired = true;
            try {
              (window.adsbygoogle = window.adsbygoogle || []).push({});
              setInitialized(true);
            } catch (error) {
              console.warn('Error al cargar anuncio de Google:', error);
            }
            ro.disconnect();
          }
        }, 2000);
        return;
      }

      // Si ya tiene ancho, inicializar inmediatamente
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setInitialized(true);
      } catch (error) {
        console.warn('Error al cargar anuncio de Google:', error);
      }
    };

    // Esperar un poco para que el DOM se estabilice
    const timeout = setTimeout(initAd, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [initialized, showAds]);

  // Si el usuario es Patreon activo, no renderizar el anuncio
  if (!showAds) {
    return null;
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={{ display: 'block', minHeight: adStyle?.height ? undefined : '90px', ...adStyle }}
      data-ad-client="ca-pub-2746156864243335"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
      data-ad-safe="true"
    />
  );
}
