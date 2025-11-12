'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageVisit } from '@/lib/page-usage-tracker';

/**
 * Componente que rastrea automáticamente las visitas a cada página
 * para ordenar el dashboard según la utilidad.
 * Respeta el consentimiento de cookies (solo trackea si analytics está habilitado).
 */
export default function PageUsageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Rastrear la visita a la página actual
    // trackPageVisit ya verifica el consentimiento de cookies internamente
    if (pathname) {
      trackPageVisit(pathname);
    }
  }, [pathname]);

  // Este componente no renderiza nada
  return null;
}

