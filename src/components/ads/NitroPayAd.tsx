'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { shouldShowAds } from '@/lib/patreon-benefits';
import type { NitroPayAdConfig } from '@/types/nitropay';

interface NitroPayAdProps {
  format: string;
  media: string;
  sizes?: string | string[];
  container?: string;
  refresh?: number;
  refreshLimit?: number;
  targeting?: Record<string, string>;
  renderVisibleOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function NitroPayAd({
  format,
  media,
  sizes,
  container,
  refresh,
  refreshLimit,
  targeting,
  renderVisibleOnly = true,
  className = '',
  style = {}
}: NitroPayAdProps) {
  const { user } = useAuth();
  const showAds = shouldShowAds(user);
  const adRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);
  const containerId = container || `nitropay-ad-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    // Si el usuario es Patreon activo, no inicializar el anuncio
    if (!showAds) {
      return;
    }

    const el = adRef.current;
    if (!el || initialized) return;

    // Función para inicializar el anuncio
    const initAd = () => {
      // Verificar que el script de NitroPay esté cargado
      if (!window.nitroAds) {
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
              const adConfig: NitroPayAdConfig = {
                format,
                media,
                container: containerId,
                renderVisibleOnly,
              };

              if (sizes) {
                adConfig.sizes = sizes;
              }
              if (refresh) {
                adConfig.refresh = refresh;
              }
              if (refreshLimit) {
                adConfig.refreshLimit = refreshLimit;
              }
              if (targeting) {
                adConfig.targeting = targeting;
              }

              window.nitroAds?.createAd(adConfig).catch((error) => {
                console.warn('Error al crear anuncio de NitroPay:', error);
              });
              setInitialized(true);
              observerDisconnected = true;
              ro.disconnect();
            } catch (error) {
              console.warn('Error al cargar anuncio de NitroPay:', error);
            }
          }
        });
        ro.observe(el);

        // Timeout de seguridad: inicializar después de 2 segundos aunque no tenga ancho
        setTimeout(() => {
          if (!observerDisconnected) {
            timeoutFired = true;
            try {
              const adConfig: NitroPayAdConfig = {
                format,
                media,
                container: containerId,
                renderVisibleOnly,
              };

              if (sizes) {
                adConfig.sizes = sizes;
              }
              if (refresh) {
                adConfig.refresh = refresh;
              }
              if (refreshLimit) {
                adConfig.refreshLimit = refreshLimit;
              }
              if (targeting) {
                adConfig.targeting = targeting;
              }

              window.nitroAds?.createAd(adConfig).catch((error) => {
                console.warn('Error al crear anuncio de NitroPay:', error);
              });
              setInitialized(true);
            } catch (error) {
              console.warn('Error al cargar anuncio de NitroPay:', error);
            }
            ro.disconnect();
          }
        }, 2000);
        return;
      }

      // Si ya tiene ancho, inicializar inmediatamente
      try {
        const adConfig: NitroPayAdConfig = {
          format,
          media,
          container: containerId,
          renderVisibleOnly,
        };

        if (sizes) {
          adConfig.sizes = sizes;
        }
        if (refresh) {
          adConfig.refresh = refresh;
        }
        if (refreshLimit) {
          adConfig.refreshLimit = refreshLimit;
        }
        if (targeting) {
          adConfig.targeting = targeting;
        }

        window.nitroAds?.createAd(adConfig).catch((error) => {
          console.warn('Error al crear anuncio de NitroPay:', error);
        });
        setInitialized(true);
      } catch (error) {
        console.warn('Error al cargar anuncio de NitroPay:', error);
      }
    };

    // Esperar un poco para que el DOM se estabilice
    const timeout = setTimeout(initAd, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [initialized, showAds, format, media, containerId, sizes, refresh, refreshLimit, targeting, renderVisibleOnly]);

  // Si el usuario es Patreon activo, no renderizar el anuncio
  if (!showAds) {
    return null;
  }

  return (
    <div
      ref={adRef}
      id={containerId}
      className={`nitropay-ad ${className}`}
      style={{ display: 'block', minHeight: '90px', ...style }}
    />
  );
}

