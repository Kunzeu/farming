'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { shouldShowAds } from '@/lib/patreon-benefits';

/**
 * Componente que bloquea todos los anuncios si el usuario es patreon activo
 */
export default function AdBlocker() {
  const { user } = useAuth();
  const showAds = shouldShowAds(user);

  useEffect(() => {
    // Solo ejecutar en el cliente
    if (typeof window === 'undefined') return;

    // Debug: Log solo en desarrollo (verificar en cliente)
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
      if (user && !showAds) {
        console.log('[AdBlocker] ✅ Usuario Patreon activo detectado, bloqueando anuncios:', {
          email: user.email,
          patreonStatus: user.patreonStatus,
          patreonTier: user.patreonTier,
          isActivePatron: true,
          showAds: showAds,
        });
      } else if (user && showAds) {
        console.log('[AdBlocker] ℹ️ Usuario normal - NO bloqueando anuncios (showAds=true):', {
          email: user.email,
          patreonStatus: user.patreonStatus || 'null',
          patreonTier: user.patreonTier || 'null',
          isActivePatron: false,
          showAds: showAds,
        });
      } else if (!user) {
        console.log('[AdBlocker] ℹ️ Usuario no logueado - NO bloqueando anuncios (showAds=true):', {
          showAds: showAds,
        });
      }
    }

    // Solo bloquear anuncios si el usuario es Patreon activo (showAds === false)
    // Si showAds === true, NO hacer nada y dejar que los anuncios se muestren normalmente
    if (!showAds && user) {
      const blockAllAds = () => {
        // Eliminar el script de AdSense si existe
        const adScript = document.querySelector('script[src*="googlesyndication"]');
        if (adScript) {
          adScript.remove();
        }
        
        // Limpiar el objeto global de AdSense
        if (window.adsbygoogle) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          delete (window as any).adsbygoogle;
        }
        
        // Bloquear todos los contenedores de anuncios
        const adContainers = document.querySelectorAll(
          '.adsbygoogle, [data-ad-client], [data-ad-slot], ins.adsbygoogle, iframe[src*="googlesyndication"], iframe[src*="doubleclick"], iframe[src*="googleads"], div[id*="google_ads"]'
        );
        
        adContainers.forEach((ad) => {
          const element = ad as HTMLElement;
          // Eliminar el elemento completamente si es posible
          if (element.parentNode) {
            try {
              element.remove();
            } catch {
              // Si no se puede eliminar, ocultarlo completamente
              element.style.display = 'none';
              element.style.visibility = 'hidden';
              element.style.height = '0';
              element.style.width = '0';
              element.style.opacity = '0';
              element.style.pointerEvents = 'none';
              element.style.overflow = 'hidden';
              element.style.position = 'absolute';
              element.style.left = '-9999px';
            }
          } else {
            element.style.display = 'none';
            element.style.visibility = 'hidden';
            element.style.height = '0';
            element.style.width = '0';
            element.style.opacity = '0';
            element.style.pointerEvents = 'none';
            element.style.overflow = 'hidden';
            element.style.position = 'absolute';
            element.style.left = '-9999px';
          }
          
          // Prevenir clics en todos los hijos
          const children = element.querySelectorAll('*');
          children.forEach((child) => {
            const childEl = child as HTMLElement;
            childEl.style.pointerEvents = 'none';
            childEl.onclick = (e) => {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              return false;
            };
          });
        });
      };

      // Ejecutar inmediatamente
      blockAllAds();

      // Ejecutar periódicamente para bloquear anuncios que se carguen después
      // Intervalo más frecuente para capturar anuncios que se cargan rápidamente
      const interval = setInterval(blockAllAds, 250);

      // Observar cambios en el DOM para bloquear anuncios nuevos
      const observer = new MutationObserver(blockAllAds);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Prevenir clics globalmente en anuncios bloqueados
      const handleClick = (e: Event) => {
        const target = e.target as HTMLElement;
        const blockedAd = target.closest(
          '.adsbygoogle, [data-ad-client], [data-ad-slot]'
        ) as HTMLElement;
        
        if (blockedAd && blockedAd.style.display === 'none') {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return false;
        }
      };

      document.addEventListener('click', handleClick, true);

      return () => {
        clearInterval(interval);
        observer.disconnect();
        document.removeEventListener('click', handleClick, true);
      };
    }
    // Si showAds === true, no hacer nada - dejar que los anuncios se muestren normalmente
  }, [showAds, user]);

  return null; // No renderiza nada
}

