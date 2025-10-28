'use client';

import { useAuth } from '@/contexts/AuthContext';
import { shouldShowAds } from '@/lib/patreon-benefits';
import { ReactNode } from 'react';

interface ConditionalAdProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Componente que muestra anuncios solo si el usuario no es patreon
 * O muestra un mensaje de agradecimiento si es patreon
 */
export default function ConditionalAd({ children, fallback }: ConditionalAdProps) {
  const { user } = useAuth();
  const showAds = shouldShowAds(user);

  if (!showAds) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Mensaje de agradecimiento por defecto
    return (
      <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-lg p-4 text-center">
        <p className="text-sm text-purple-300">
          ✨ Gracias por apoyarnos en Patreon ✨
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
