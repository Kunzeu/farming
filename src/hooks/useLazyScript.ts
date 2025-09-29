import { useEffect, useState } from 'react';

interface UseLazyScriptOptions {
  src: string;
  delay?: number;
  triggerOnInteraction?: boolean;
  triggerOnScroll?: boolean;
}

export function useLazyScript({
  src,
  delay = 3000,
  triggerOnInteraction = true,
  triggerOnScroll = true
}: UseLazyScriptOptions) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    const loadScript = () => {
      if (isLoading || isLoaded || !isMounted) return;
      
      setIsLoading(true);
      
      // Verificar si el script ya existe
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        setIsLoaded(true);
        setIsLoading(false);
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => {
        if (isMounted) {
          setIsLoaded(true);
          setIsLoading(false);
        }
      };
      script.onerror = () => {
        if (isMounted) {
          setIsLoading(false);
        }
      };
      
      document.head.appendChild(script);
    };

    // Cargar después del delay
    timeoutId = setTimeout(loadScript, delay);

    // Cargar en interacciones del usuario
    if (triggerOnInteraction) {
      const handleInteraction = () => {
        clearTimeout(timeoutId);
        loadScript();
      };

      document.addEventListener('click', handleInteraction, { once: true });
      document.addEventListener('touchstart', handleInteraction, { once: true });
      document.addEventListener('keydown', handleInteraction, { once: true });
    }

    // Cargar en scroll
    if (triggerOnScroll) {
      const handleScroll = () => {
        clearTimeout(timeoutId);
        loadScript();
      };

      document.addEventListener('scroll', handleScroll, { once: true });
    }

    return () => {
      clearTimeout(timeoutId);
      isMounted = false;
    };
  }, [src, delay, triggerOnInteraction, triggerOnScroll, isLoading, isLoaded]);

  return { isLoaded, isLoading };
}
