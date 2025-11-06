'use client';

import { useEffect, useRef, useState } from 'react';
import { useLazyScript } from '@/hooks/useLazyScript';

interface GoogleAdProps {
  adSlot: string;
  adFormat?: string;
  adStyle?: React.CSSProperties;
  className?: string;
  fallback?: React.ReactNode;
}

export default function GoogleAd({ 
  adSlot, 
  adFormat = 'auto',
  adStyle = { display: 'block' },
  className = '',
  fallback = null
}: GoogleAdProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [canInit, setCanInit] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const { isLoaded, isLoading } = useLazyScript({
    src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2746156864243335',
    delay: 1000, // Delay mínimo para evitar micro clics
    triggerOnInteraction: false, // Deshabilitar carga en interacción
    triggerOnScroll: false // Deshabilitar carga en scroll
  });

  // Esperar a que el contenedor tenga ancho (>0) antes de inicializar
  useEffect(() => {
    const el = adRef.current as unknown as HTMLElement | null;
    if (!el) return;

    const checkWidth = () => {
      const rect = el.getBoundingClientRect();
      const hasWidth = rect.width > 0;
      if (hasWidth) {
        setCanInit(true);
      }
    };

    // Verificar inmediatamente
    checkWidth();

    // Observer de tamaño para detectar cuando tenga ancho
    const ro = new ResizeObserver(() => {
      checkWidth();
    });
    ro.observe(el);

    // Timeout de seguridad: si después de 3 segundos no tiene ancho, permitir inicialización
    const timeout = setTimeout(() => {
      setCanInit(true);
    }, 3000);

    return () => {
      try { ro.disconnect(); } catch {}
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!initialized && isLoaded && canInit && adRef.current && window.adsbygoogle) {
      try {
        // Inicializar el anuncio solo cuando el script esté cargado
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        setInitialized(true);
      } catch (error) {
        console.warn('Error al cargar anuncio de Google:', error);
      }
    }
  }, [isLoaded, canInit, initialized]);

  // Mostrar fallback mientras carga
  if (isLoading || !isLoaded || !canInit) {
    return fallback ? <div className={className}>{fallback}</div> : null;
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
      data-ad-clickable="false"
    />
  );
}
