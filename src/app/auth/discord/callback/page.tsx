'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

function DiscordCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithDiscord, isAuthenticated, isLoading } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const handleDiscordCallback = useCallback(async () => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setMessage('Error en la autenticación de Discord');
      setTimeout(() => router.push('/login'), 3000);
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('Código de autorización no encontrado');
      setTimeout(() => router.push('/login'), 3000);
      return;
    }

    try {
      // Llamar a la función de login con Discord
      await loginWithDiscord(code);
      setStatus('success');
      setMessage('¡Autenticación exitosa! Redirigiendo...');
      
      // La redirección ahora se maneja automáticamente en el AuthContext
      // No necesitamos hacer nada más aquí
    } catch (error) {
      console.error('Error en Discord callback:', error);
      setStatus('error');
      setMessage('Error al procesar la autenticación');
      setTimeout(() => router.push('/login'), 3000);
    }
  }, [searchParams, loginWithDiscord, router]);

  // Efecto para detectar cuando la autenticación es exitosa
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setStatus('success');
      setMessage('¡Autenticación exitosa! Redirigiendo...');
      // La redirección se maneja automáticamente en el AuthContext
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    handleDiscordCallback();
  }, [handleDiscordCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 max-w-md w-full mx-4">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Procesando autenticación...
              </h2>
              <p className="text-gray-400">
                Conectando con Discord
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                ¡Autenticación exitosa!
              </h2>
              <p className="text-gray-400">
                {message}
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Error de autenticación
              </h2>
              <p className="text-gray-400">
                {message}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DiscordCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 max-w-md w-full mx-4">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Cargando...
            </h2>
            <p className="text-gray-400">
              Preparando autenticación
            </p>
          </div>
        </div>
      </div>
    }>
      <DiscordCallbackContent />
    </Suspense>
  );
} 