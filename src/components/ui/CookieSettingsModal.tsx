'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, BarChart3, Target, Info, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCookieConsent, CookiePreferences } from '@/contexts/CookieConsentContext';
import { useI18n } from '@/contexts/I18nContext';

export default function CookieSettingsModal() {
  const { isSettingsOpen, hideSettings, preferences, savePreferences } = useCookieConsent();
  const { t } = useI18n();
  const [localPreferences, setLocalPreferences] = useState<CookiePreferences>(preferences);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handlePreferenceChange = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'essential') return; // Essential cookies cannot be disabled
    
    setLocalPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    savePreferences(localPreferences);
  };

  const handleAcceptAll = () => {
    const allEnabled: CookiePreferences = {
      essential: true,
      analytics: true,
      advertising: true,
    };
    setLocalPreferences(allEnabled);
    savePreferences(allEnabled);
  };

  const handleRejectAll = () => {
    const onlyEssential: CookiePreferences = {
      essential: true,
      analytics: false,
      advertising: false,
    };
    setLocalPreferences(onlyEssential);
    savePreferences(onlyEssential);
  };

  if (!isSettingsOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={hideSettings}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white">{t('cookieSettings.title')}</h2>
            <button
              onClick={hideSettings}
              className="p-2 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <p className="text-gray-300 leading-relaxed">
              {t('cookieSettings.description')}
            </p>

            {/* Essential Cookies */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-green-300">{t('cookieSettings.essential.title')}</h3>
                    <div className="flex items-center gap-2 text-green-400">
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-medium">{t('cookieSettings.essential.alwaysActive')}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">
                    {t('cookieSettings.essential.description')}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {t('cookieSettings.essential.features')}
                  </p>
                </div>
              </div>
            </div>

            {/* Analytics Cookies */}
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <BarChart3 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-blue-300">{t('cookieSettings.analytics.title')}</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localPreferences.analytics}
                        onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">
                    {t('cookieSettings.analytics.description')}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {t('cookieSettings.analytics.features')}
                  </p>
                </div>
              </div>
            </div>

            {/* Advertising Cookies */}
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-purple-300">{t('cookieSettings.advertising.title')}</h3>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localPreferences.advertising}
                        onChange={(e) => handlePreferenceChange('advertising', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">
                    {t('cookieSettings.advertising.description')}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {t('cookieSettings.advertising.features')}
                  </p>
                </div>
              </div>
            </div>

            {/* Info box */}
            <div className="bg-slate-700/50 rounded-lg p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-300">
                <p className="font-medium mb-1">{t('cookieSettings.info.title')}</p>
                <p>
                  {t('cookieSettings.info.description')}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-slate-700 bg-slate-800/50">
            <button
              onClick={handleRejectAll}
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              {t('cookieBanner.rejectAll')}
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
            >
              {t('cookieBanner.acceptAll')}
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-500 rounded-lg transition-colors flex-1 sm:flex-none"
            >
              {t('cookieSettings.savePreferences')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
