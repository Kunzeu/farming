'use client';

import { useEffect, useState, useCallback, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

function PatreonCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loginWithPatreon, linkPatreon } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const hasRunRef = useRef(false);

  const handlePatreonCallback = useCallback(async () => {
    if (hasRunRef.current) return; // Evitar múltiples ejecuciones y 'invalid_grant'
    hasRunRef.current = true;
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    const codePreview = code ? `${code.slice(0, 6)}...${code.slice(-6)}` : null;
    console.log('Patreon callback received:', { code: !!code, codePreview, error, state });

    if (error) {
      console.error('Patreon OAuth error:', error);
      setStatus('error');
      setMessage(`Error en la autenticación de Patreon: ${error}`);
      setTimeout(() => router.push('/login'), 3000);
      return;
    }

    if (!code) {
      console.error('No authorization code received');
      setStatus('error');
      setMessage('Código de autorización no encontrado');
      setTimeout(() => router.push('/login'), 3000);
      return;
    }

    try {
      console.log('Starting Patreon authentication with code preview:', codePreview);
      // Si hay usuario autenticado, usar flujo de vinculación; si no, flujo de login
      if (state === 'link' || user) {
        await linkPatreon(code);
      } else {
        await loginWithPatreon(code);
      }
      setStatus('success');
      setMessage('¡Autenticación exitosa! Redirigiendo...');
      setTimeout(() => router.push('/'), 2000);
    } catch (error) {
      console.error('Error en Patreon callback:', error);
      setStatus('error');
      setMessage(`Error al procesar la autenticación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setTimeout(() => router.push('/login'), 3000);
    }
  }, [searchParams, user, loginWithPatreon, linkPatreon, router]);

  useEffect(() => {
    handlePatreonCallback();
  }, [handlePatreonCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 max-w-md w-full mx-4">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 text-[#FF424D] animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Procesando autenticación...
              </h2>
              <p className="text-gray-400">
                Conectando con Patreon
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

export default function PatreonCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 max-w-md w-full mx-4">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#FF424D] animate-spin mx-auto mb-4" />
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
      <PatreonCallbackContent />
    </Suspense>
  );
}
