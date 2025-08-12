'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import { Info, Calculator, TrendingUp, ArrowLeft } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';

const DragonBashPage = () => {
  const [selectedSection, setSelectedSection] = useState<'overview' | 'calculators' | 'strategies'>('overview');
  usePageTitle('Dragon Bash');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-teal-900">
      <Navigation />
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex justify-start mb-4">
            <a href="/festivals" className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200">
              <ArrowLeft className="w-4 h-4" />
              Back to Festivals
            </a>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Dragon Bash</h1>
          <p className="text-base sm:text-xl text-gray-300">Calculators and analysis for Dragon Bash</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap justify-center gap-2 mb-8">
          {(() => {
            type Tab = { id: 'overview' | 'calculators' | 'strategies'; label: string; icon: typeof Info };
            const tabs: Tab[] = [
              { id: 'overview', label: 'Overview', icon: Info },
              { id: 'calculators', label: 'Calculators', icon: Calculator },
              { id: 'strategies', label: 'Strategies', icon: TrendingUp },
            ];
            return tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSection(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  selectedSection === tab.id ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
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
                  <Info className="w-6 h-6 mr-3 text-emerald-400" />
                  Dragon Bash
                </h2>
                <p className="text-gray-300">Festival overview and best practices.</p>
              </div>
            </div>
          )}

          {selectedSection === 'calculators' && (
            <div className="space-y-8">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Calculator className="w-6 h-6 mr-3 text-emerald-400" />
                  Calculators
                </h2>
                <p className="text-gray-300">Coming soon…</p>
              </div>
            </div>
          )}

          {selectedSection === 'strategies' && (
            <div className="space-y-8">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-emerald-400" />
                  Strategies
                </h2>
                <p className="text-gray-300">Coming soon…</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DragonBashPage;


