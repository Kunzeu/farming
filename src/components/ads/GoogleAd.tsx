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

  // Esperar a que el contenedor tenga ancho (>0) y esté visible antes de inicializar
  useEffect(() => {
    const el = adRef.current as unknown as HTMLElement | null;
    if (!el) return;

    let inView = false;
    let widthOk = false;

    const evaluate = () => setCanInit(inView && widthOk);

    // Observer de visibilidad
    const io = new IntersectionObserver((entries) => {
      inView = entries.some(e => e.isIntersecting);
      evaluate();
    }, { rootMargin: '0px', threshold: [0, 0.01, 0.1] });
    io.observe(el);

    // Observer de tamaño
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      const w = entry?.contentRect?.width ?? 0;
      widthOk = w > 0;
      evaluate();
    });
    ro.observe(el);

    // Evaluación inicial por si ya tiene tamaño/visibilidad
    const rect = el.getBoundingClientRect();
    widthOk = (rect.width ?? 0) > 0;
    inView = rect.top < window.innerHeight && rect.bottom > 0;
    evaluate();

    return () => {
      try { io.disconnect(); } catch {}
      try { ro.disconnect(); } catch {}
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
