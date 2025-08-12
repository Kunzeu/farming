'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import { Info, Calculator, TrendingUp, ArrowLeft } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';

const WintersdayPage = () => {
  const [selectedSection, setSelectedSection] = useState<'overview' | 'calculators' | 'strategies'>('overview');
  usePageTitle('Wintersday');
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-sky-900 to-cyan-900">
      <Navigation />
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex justify-start mb-4">
            <a href="/festivals" className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200">
              <ArrowLeft className="w-4 h-4" />
              {t('nav.backToFestivals')}
            </a>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('festival.wintersday')}</h1>
          <p className="text-base sm:text-xl text-gray-300">{t('festivals.page.subtitle').replace('{name}', t('festival.wintersday'))}</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap justify-center gap-2 mb-8">
          {(() => {
            type Tab = { id: 'overview' | 'calculators' | 'strategies'; label: string; icon: typeof Info };
            const tabs: Tab[] = [
              { id: 'overview', label: t('festivals.tabs.overview'), icon: Info },
              { id: 'calculators', label: t('festivals.tabs.calculators'), icon: Calculator },
              { id: 'strategies', label: t('festivals.tabs.strategies'), icon: TrendingUp },
            ];
            return tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSection(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  selectedSection === tab.id ? 'bg-sky-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ));
          })()}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {selectedSection === 'overview' && (
            <div className="space-y-8">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Info className="w-6 h-6 mr-3 text-sky-400" />
                  {t('festival.wintersday')}
                </h2>
                <p className="text-gray-300">{t('festivals.overview.blurb')}</p>
              </div>
            </div>
          )}

          {selectedSection === 'calculators' && (
            <div className="space-y-8">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Calculator className="w-6 h-6 mr-3 text-sky-400" />
                  {t('festivals.tabs.calculators')}
                </h2>
                <p className="text-gray-300">{t('festivals.common.comingSoon')}</p>
              </div>
            </div>
          )}

          {selectedSection === 'strategies' && (
            <div className="space-y-8">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-sky-400" />
                  {t('festivals.tabs.strategies')}
                </h2>
                <p className="text-gray-300">{t('festivals.common.comingSoon')}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WintersdayPage;


