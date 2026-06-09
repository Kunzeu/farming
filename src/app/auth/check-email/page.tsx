'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

function CheckEmailContent() {
  const { t, lang } = useI18n();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResend = async () => {
    if (!email) return;

    setIsSubmitting(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale: lang }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setMessage(data.error || t('auth.verificationResendFailed', 'No se pudo reenviar el email.'));
        return;
      }

      setStatus('success');
      setMessage(t('auth.verificationResent', 'Si el correo existe y no está verificado, enviamos un nuevo enlace.'));
    } catch {
      setStatus('error');
      setMessage(t('auth.verificationResendFailed', 'No se pudo reenviar el email.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-blue-900/30">
            <Mail className="h-7 w-7 text-blue-400" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">
            {t('auth.checkEmailTitle', 'Revisa tu correo')}
          </h1>

          <p className="text-gray-300 text-sm mb-2">
            {t('auth.checkEmailDesc', 'Te enviamos un enlace para confirmar tu cuenta.')}
          </p>

          {email && (
            <p className="text-blue-300 text-sm mb-6 break-all">{email}</p>
          )}

          {status !== 'idle' && message && (
            <div className={`mb-4 p-3 rounded border text-sm ${
              status === 'success'
                ? 'bg-green-900/20 border-green-700 text-green-300'
                : 'bg-red-900/20 border-red-700 text-red-300'
            }`}>
              {status === 'success' && <CheckCircle className="inline w-4 h-4 mr-2" />}
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={handleResend}
            disabled={!email || isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200 mb-4"
          >
            {isSubmitting
              ? t('auth.sending', 'Enviando...')
              : t('auth.resendVerification', 'Reenviar email de confirmación')}
          </button>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('auth.backToLogin', 'Volver a iniciar sesión')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    }>
      <CheckEmailContent />
    </Suspense>
  );
}
