'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import { useApiStatus } from '@/hooks/useApiStatus';

export default function ApiStatusBanner() {
  const { t } = useI18n();
  const { hasApiIssues, isApiHealthy } = useApiStatus();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner in this session
    const dismissed = sessionStorage.getItem('api-status-banner-dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem('api-status-banner-dismissed', 'true');
    } catch (error) {
      // Ignore storage errors
    }
  };


  // Only show if there are API issues and not dismissed
  if (!hasApiIssues || isDismissed || isApiHealthy) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-lg p-4 mb-6"
      >
        <div className="flex items-start gap-3">
          <div className="p-1 rounded-lg bg-orange-500/20 text-orange-400 flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-orange-300 font-semibold mb-1">
              {t('apiStatus.title', 'API Service Notice')}
            </h3>
            <p className="text-gray-300 text-sm mb-2">
              {t('apiStatus.description', 'The Guild Wars 2 API is currently experiencing issues. Some account features may be temporarily unavailable.')}
            </p>
            <div className="flex items-center gap-2 text-xs text-orange-400">
              <span>{t('apiStatus.status', 'Status:')}</span>
              <span className="font-medium">{t('apiStatus.working', 'ArenaNet is working on a fix')}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-end">
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
              aria-label={t('common.close', 'Close')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
