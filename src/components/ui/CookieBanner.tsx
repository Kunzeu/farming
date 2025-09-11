'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Settings, X, Check, AlertCircle } from 'lucide-react';
import { useCookieConsent } from '@/contexts/CookieConsentContext';
import { useI18n } from '@/contexts/I18nContext';
import Link from 'next/link';

export default function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, showSettings } = useCookieConsent();
  const { t } = useI18n();

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
            {/* Icon and main content */}
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0">
                <Cookie className="w-8 h-8 text-orange-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t('cookieBanner.title')}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t('cookieBanner.description')}
                </p>
                <div className="mt-3">
                  <Link 
                    href="/privacy-policy" 
                    className="text-blue-400 hover:text-blue-300 text-sm mr-4"
                  >
                    {t('cookieBanner.privacyPolicy')}
                  </Link>
                  <Link 
                    href="/cookie-policy" 
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    {t('cookieBanner.cookiePolicy')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button
                onClick={rejectAll}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
              >
                {t('cookieBanner.rejectAll')}
              </button>
              <button
                onClick={showSettings}
                className="px-4 py-2 text-sm font-medium text-white bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                {t('cookieBanner.customize')}
              </button>
              <button
                onClick={acceptAll}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                {t('cookieBanner.acceptAll')}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
