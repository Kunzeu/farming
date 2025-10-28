'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

function PatreonLinkContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { linkPatreon, user } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const handlePatreonLink = useCallback(async () => {
    // Verificar que el usuario esté autenticado
    if (!user) {
      setStatus('error');
      setMessage('Debes iniciar sesión primero para vincular tu cuenta de Patreon');
      setTimeout(() => router.push('/login'), 3000);
      return;
    }

    const code = searchParams.get('code');
    const error = searchParams.get('error');

    console.log('Patreon link callback received:', { code: !!code, error });

    if (error) {
      console.error('Patreon OAuth error:', error);
      setStatus('error');
      setMessage(`Error en la vinculación de Patreon: ${error}`);
      setTimeout(() => router.push('/profile'), 3000);
      return;
    }

    if (!code) {
      console.error('No authorization code received');
      setStatus('error');
      setMessage('Código de autorización no encontrado');
      setTimeout(() => router.push('/profile'), 3000);
      return;
    }

    try {
      console.log('Linking Patreon account...');
      // Llamar a la función de vinculación de Patreon
      await linkPatreon(code);
      setStatus('success');
      setMessage('¡Cuenta de Patreon vinculada exitosamente! Redirigiendo a tu perfil...');
      setTimeout(() => router.push('/profile'), 2000);
    } catch (error) {
      console.error('Error en Patreon link callback:', error);
      setStatus('error');
      setMessage(`Error al vincular la cuenta: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setTimeout(() => router.push('/profile'), 3000);
    }
  }, [searchParams, linkPatreon, router, user]);

  useEffect(() => {
    handlePatreonLink();
  }, [handlePatreonLink]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 max-w-md w-full mx-4">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 text-[#FF424D] animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Vinculando cuenta de Patreon...
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
                ¡Vinculación exitosa!
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
                Error de vinculación
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

export default function PatreonLinkPage() {
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
              Preparando vinculación
            </p>
          </div>
        </div>
      </div>
    }>
      <PatreonLinkContent />
    </Suspense>
  );
}
