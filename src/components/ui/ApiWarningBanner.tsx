'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion } from '@/lib/framer-motion-optimized';
import { AnimatePresence } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';

const ApiWarningBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { t } = useI18n();

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <div className="text-sm font-medium">
                <span className="font-bold">{t('apiWarning.title')}</span>
                <br />
                <span className="text-orange-100">{t('apiWarning.subtitle')}</span>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors duration-200 flex-shrink-0"
              aria-label={t('apiWarning.close')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApiWarningBanner;
