'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ChevronRight, Star, FileText, Wrench, Gift } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Link from 'next/link';
import GlossaryLink from '@/components/ui/GlossaryLink';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';


type SalvageSection = 'salvageables' | 'luck-calculator' | 'research-notes' | 'unidentified-gear' | 'orrian-jewelry-box';

export default function SalvagePage() {
  usePageTitle('pageTitles.salvaging', 'Salvaging');
  const { t, lang } = useI18n();
  const [kitNames, setKitNames] = useState<{[key: string]: string}>({});

  // Función para obtener los nombres de los kits desde la API
  useEffect(() => {
    const fetchKitNames = async () => {
      try {
        const apiLang = lang === 'es' ? 'es' : lang === 'de' ? 'de' : lang === 'fr' ? 'fr' : 'en';
        
        // IDs de los kits: 44602 (Copper-Fed), 89409 (Runecrafter's), 67027 (Silver-Fed)
        const kitIds = ['44602', '89409', '67027'];
        const kitIdsString = kitIds.join(',');
        
        const response = await fetch(`https://api.guildwars2.com/v2/items?ids=${kitIdsString}&lang=${apiLang}`);
        const itemsData = await response.json();
        
        const names: {[key: string]: string} = {};
        itemsData.forEach((item: { id: number; name: string }) => {
          if (item.id === 44602) {
            names.copperFed = item.name;
          }
          if (item.id === 89409) {
            names.runecrafters = item.name;
          }
          if (item.id === 67027) {
            names.silverFed = item.name;
          }
        });
        setKitNames(names);
      } catch (error) {
        console.error('Error fetching kit names:', error);
        // Fallback vacío si hay error
        setKitNames({});
      }
    };

    fetchKitNames();
  }, [lang]);

  // Salvage section configuration
  const salvageSections = [
    {
      id: 'unidentified-gear' as SalvageSection,
      name: t('salvagePage.unidentifiedGear', 'Unidentified Gear'),
      description: t('salvagePage.unidentifiedGearDesc', 'Unidentified Gear calculators'),
      icon: Wrench,
      color: 'purple',
      bgGradient: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      features: [t('salvagePage.features.commonMasterworkRates', 'Common, Masterwork, Rare'), t('salvagePage.features.specificDropRates', 'Specific drop rates'), t('salvagePage.features.profitabilityByType', 'Profitability by type')],
      href: '/salvage/common'
    },
    {
      id: 'research-notes' as SalvageSection,
      name: t('salvagePage.researchNotes', 'Research Notes'),
      description: t('salvagePage.researchNotesDesc', 'Research Note costs'),
      icon: FileText,
      color: 'green',
      bgGradient: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      features: [t('salvagePage.features.costPerNote', 'Cost per Research Note'), t('salvagePage.features.itemsGiveNotes', 'Items that give Research Notes'), t('salvagePage.features.salvagingEfficiency', 'Salvaging efficiency')],
      href: '/salvage/research-notes'
    },
    {
      id: 'orrian-jewelry-box' as SalvageSection,
      name: t('salvagePage.orrianJewelryBox', 'Orrian Jewelry Box'),
      description: t('salvagePage.orrianJewelryBoxDesc', 'Analyze box profitability'),
      icon: Gift,
      color: 'orange',
      bgGradient: 'from-orange-500/20 to-orange-600/20',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      features: [t('salvagePage.features.boxValue', 'Box value analysis'), t('salvagePage.features.marketPrices', 'Market price comparison'), t('salvagePage.features.openOrSell', 'Open or sell decision')],
      href: '/orrian-jewelry-box'
    },
    {
      id: 'salvageables' as SalvageSection,
      name: t('salvagePage.salvageables', 'Salvageables'),
      description: t('salvagePage.salveageablesDesc', 'Items that can be salvaged'),
      icon: Package,
      color: 'blue',
      bgGradient: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      features: [t('salvagePage.features.equipment', 'Equipment of different rarities'), t('salvagePage.features.weapons', 'Weapons and armor'), t('salvagePage.features.accessories', 'Accessories and trinkets')],
      href: '/salvage/salvageables'
    },
    {
      id: 'luck-calculator' as SalvageSection,
      name: t('salvagePage.luckCalculator', 'Luck Calculator'),
      description: t('salvagePage.luckCalculatorDesc', 'Luck cost calculator'),
      icon: Star,
      color: 'yellow',
      bgGradient: 'from-yellow-500/20 to-yellow-600/20',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      features: [t('salvagePage.features.costPer1000', 'Cost per 1000 luck'), t('salvagePage.features.efficiency', 'Efficiency of different kits'), t('salvagePage.features.profitability', 'Profitability comparison')],
      href: '/salvage/luck-calculator'
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {/* Hero Section - REDUCIDO ESPACIO */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t('salvagePage.title', 'Salvaging')}
              </h1>
            </motion.div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {t('salvagePage.subtitle', 'Complete guide to salvaging in Guild Wars 2. Learn techniques, calculate profitability, and maximize your profits.')}
            </p>
          </div>

          {/* Información General - JUSTIFICADA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-slate-600/50">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-white mb-2">{t('salvagePage.whatIsSalvaging', 'What is Salvaging?')}</h2>
              <p className="text-gray-300 text-justify">
                {t('salvagePage.whatIsSalvagingDesc', 'Salvaging is the process of salvaging equipment to obtain materials. It is one of the most profitable ways to earn gold in Guild Wars 2, especially with certain types of items.')}
              </p>
              <div className="mt-3">
                <GlossaryLink />
              </div>
            </div>
          </motion.div>

          {/* Secciones principales - REDUCIDO ESPACIO */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">{t('salvagePage.sections', 'Salvage Sections')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {salvageSections.map((section, index) => {
                const IconComponent = section.icon;
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={section.href}>
                      <div className={`group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br ${section.bgGradient} border ${section.borderColor} hover:scale-105 transition-all duration-300 cursor-pointer h-full`}>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Content */}
                        <div className="relative z-10">
                          {/* Icon */}
                          <div className={`w-12 h-12 bg-gradient-to-br from-${section.color}-500/30 to-${section.color}-600/30 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className={`h-6 w-6 ${section.textColor}`} />
                          </div>

                          {/* Title */}
                          <h3 className="text-base font-bold text-white mb-2">{section.name}</h3>
                          <p className="text-sm text-gray-300 mb-3">{section.description}</p>

                          {/* Features */}
                          <div className="space-y-1 mb-3">
                            {section.features.slice(0, 2).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full bg-${section.color}-400`}></div>
                                <span className="text-xs text-gray-300">{feature}</span>
                              </div>
                            ))}
                          </div>

                          {/* Button */}
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium text-sm">{t('salvagePage.explore', 'Explore')}</span>
                            <ChevronRight className={`h-4 w-4 ${section.textColor} group-hover:translate-x-1 transition-transform duration-300`} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Tips Section - REDUCIDO ESPACIO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50">
            <h2 className="text-xl font-bold text-white mb-4 text-center">{t('salvagePage.proTips', 'Pro Tips')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  {t('salvagePage.salvageKits', 'Salvage Kits')}
                </h3>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p><strong className="text-blue-400">{kitNames.copperFed || ''}:</strong> {t('salvagePage.copperFed', 'For Common Gear')}</p>
                  <p><strong className="text-green-400">{kitNames.runecrafters || ''}:</strong> {t('salvagePage.runecrafters', 'For Masterwork')}</p>
                  <p><strong className="text-yellow-400">{kitNames.silverFed || ''}:</strong> {t('salvagePage.silverFed', 'For Rare Gear')}</p>
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  {t('salvagePage.strategies', 'Strategies')}
                </h3>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    {t('salvagePage.checkPrices', 'Check prices before salvaging')}
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    {t('salvagePage.considerValue', 'Consider the value of the full item')}
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    {t('salvagePage.useAppropriateKit', 'Use the appropriate kit for each type')}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  {t('salvagePage.resources', 'Resources')}
                </h3>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p><a href="https://wiki.guildwars2.com/wiki/Salvage_kit" target="_blank" className="text-purple-400 hover:text-purple-300">GW2 Wiki - Salvage Kits</a></p>
                  <p><a href="https://wiki.guildwars2.com/wiki/Salvage" target="_blank" className="text-purple-400 hover:text-purple-300">GW2 Wiki - Salvaging</a></p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
