'use client';

import { useEffect, useRef } from 'react';
import { useLazyScript } from '@/hooks/useLazyScript';
import { useAd } from '@/contexts/AdContext';

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
  const { shouldShowAds } = useAd();
  const adRef = useRef<HTMLModElement>(null);
  const { isLoaded, isLoading } = useLazyScript({
    src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2746156864243335',
    delay: 2000,
    triggerOnInteraction: true,
    triggerOnScroll: true
  });

  useEffect(() => {
    if (isLoaded && adRef.current && window.adsbygoogle && shouldShowAds) {
      try {
        // Inicializar el anuncio solo cuando el script esté cargado
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.warn('Error al cargar anuncio de Google:', error);
      }
    }
  }, [isLoaded, shouldShowAds]);

  // No mostrar ads si el usuario es admin o moderator
  if (!shouldShowAds) {
    return null;
  }

  // Mostrar fallback mientras carga
  if (isLoading || !isLoaded) {
    return fallback ? <div className={className}>{fallback}</div> : null;
  }

  return (
    <ins
      ref={adRef}
      className={`adsbygoogle ${className}`}
      style={adStyle}
      data-ad-client="ca-pub-2746156864243335"
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  );
}
