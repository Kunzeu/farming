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

    // Si el usuario es patreon activo, bloquear TODOS los anuncios
    if (!showAds) {
      const blockAllAds = () => {
        // Bloquear todos los contenedores de anuncios
        const adContainers = document.querySelectorAll(
          '.adsbygoogle, [data-ad-client], [data-ad-slot], ins.adsbygoogle, iframe[src*="googlesyndication"], iframe[src*="doubleclick"]'
        );
        
        adContainers.forEach((ad) => {
          const element = ad as HTMLElement;
          element.style.display = 'none';
          element.style.visibility = 'hidden';
          element.style.height = '0';
          element.style.width = '0';
          element.style.opacity = '0';
          element.style.pointerEvents = 'none';
          element.style.overflow = 'hidden';
          
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
      const interval = setInterval(blockAllAds, 1000);

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
  }, [showAds]);

  return null; // No renderiza nada
}

