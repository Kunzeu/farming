'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, X } from 'lucide-react';

export default function SessionInvalidationNotice() {
  const { invalidationMessage, clearInvalidationMessage } = useAuth();

  // Limpiar el mensaje después de 10 segundos
  useEffect(() => {
    if (invalidationMessage) {
      const timer = setTimeout(() => {
        clearInvalidationMessage();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [invalidationMessage, clearInvalidationMessage]);

  if (!invalidationMessage) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
      <div className="bg-red-900/90 border border-red-700 rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-200 mb-1">
              Sesión Invalidada
            </h3>
            <p className="text-sm text-red-300">
              {invalidationMessage}
            </p>
            <p className="text-xs text-red-400 mt-2">
              Has sido redirigido a la página principal. Por favor, inicia sesión nuevamente.
            </p>
          </div>
          <button
            onClick={clearInvalidationMessage}
            className="text-red-400 hover:text-red-200 transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 