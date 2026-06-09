'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

function VerifyEmailContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const verify = useCallback(async (token: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data.error || t('auth.verificationFailed', 'No se pudo verificar tu cuenta.'));
        return;
      }

      setStatus('success');
      setMessage(t('auth.verificationSuccess', 'Tu cuenta ha sido confirmada. Ya puedes iniciar sesión.'));
      setTimeout(() => router.push('/login'), 2500);
    } catch {
      setStatus('error');
      setMessage(t('auth.verificationFailed', 'No se pudo verificar tu cuenta.'));
    }
  }, [router, t]);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage(t('auth.verificationInvalidLink', 'Enlace de verificación inválido.'));
      return;
    }

    verify(token);
  }, [searchParams, verify, t]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
          {status === 'loading' && (
            <>
              <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-300">{t('auth.verifyingEmail', 'Verificando tu cuenta...')}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-3">
                {t('auth.verificationSuccessTitle', 'Cuenta confirmada')}
              </h1>
              <p className="text-green-300 text-sm mb-6">{message}</p>
              <Link href="/login" className="text-blue-400 hover:text-blue-300 text-sm underline">
                {t('auth.goToLogin', 'Ir al Login')}
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-white mb-3">
                {t('auth.verificationFailedTitle', 'Verificación fallida')}
              </h1>
              <p className="text-red-300 text-sm mb-6">{message}</p>
              <Link href="/login" className="text-blue-400 hover:text-blue-300 text-sm underline">
                {t('auth.backToLogin', 'Volver a iniciar sesión')}
              </Link>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
