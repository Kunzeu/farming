'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { motion } from '@/lib/framer-motion-optimized';
import { AnimatePresence } from 'framer-motion';
import { useI18n } from '@/contexts/I18nContext';

const ApiWarningBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    // Fechas de desactivación de la API
    // Viernes 24 de octubre a las 10:00 AM hora del Pacífico (UTC-7)
    const apiDisableDate = new Date('2025-10-24T10:00:00-07:00');
    // Jueves 30 de octubre a las 10:00 AM hora del Pacífico (UTC-7)
    const apiReenableDate = new Date('2025-10-30T10:00:00-07:00');
    
    const now = new Date();
    
    // Mostrar banner solo si estamos en el período de desactivación
    const shouldShow = now >= apiDisableDate && now < apiReenableDate;
    setIsVisible(shouldShow);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-slate-800 to-slate-700 text-white shadow-lg border-b border-slate-600"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-yellow-400" />
              <div className="text-sm font-medium">
                <span className="font-bold">{t('apiWarning.title')}</span>
                <br />
                <span className="text-slate-200">{t('apiWarning.subtitle')}</span>
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