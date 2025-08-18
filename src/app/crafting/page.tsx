'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import Image from 'next/image';
import { 
  BookOpen, 
  TrendingUp, 
  Package, 
  Coins,
  RefreshCw,
  Info,
  AlertCircle,
  BarChart3,
  Zap,
  Loader2
} from 'lucide-react';
import GlossaryLink from '@/components/ui/GlossaryLink';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';

interface Gw2Price {
  id: number;
  buys: { quantity: number; unit_price: number };
  sells: { quantity: number; unit_price: number };
}

interface Gw2Item {
  id: number;
  name: string;
  icon: string;
}

interface ConversionItem {
  id: number;
  name: string;
  icon: string;
  precio90: number; // en cobre
  precio85: number; // en cobre
  costeConv20: number; // en cobre
  profit90: number; // en cobre
  profit85: number; // en cobre
}

const CraftingPage = () => {
  usePageTitle('Crafting Guide');
  const { t } = useI18n();
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const [conversionData, setConversionData] = useState<ConversionItem[]>([]);
  const [isLoadingConversions, setIsLoadingConversions] = useState(false);


  // T6 Materials from the image with their GW2 IDs
  const t6Materials = useMemo(() => [
    { id: 24295, name: 'Vial of Powerful Blood', t5Id: 24294 },
    { id: 24358, name: 'Ancient Bone', t5Id: 24341 },
    { id: 24351, name: 'Vicious Claw', t5Id: 24350 },
    { id: 24357, name: 'Vicious Fang', t5Id: 24356 },
    { id: 24289, name: 'Armored Scale', t5Id: 24288 },
    { id: 24300, name: 'Elaborate Totem', t5Id: 24299 },
    { id: 24283, name: 'Powerful Venom Sac', t5Id: 24282 },
  ], []);

  // Materials for T5 to T6 conversion
  const conversionMaterials = useMemo(() => ({
    ectoplasm: 19721, // Glob of Ectoplasm (al 90%/1.85)
    crystallineDust: 24277, // Pile of Crystalline Dust
  }), []);

  const allConversionItemIds = useMemo(() => [
    ...t6Materials.map(m => m.id),
    ...t6Materials.map(m => m.t5Id),
    ...Object.values(conversionMaterials),
  ], [t6Materials, conversionMaterials]);

  const fetchConversionCalculations = useCallback(async () => {
    setIsLoadingConversions(true);
    try {
      // Get prices from GW2 API
      const pricesResponse = await fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${allConversionItemIds.join(',')}`);
      const prices = await pricesResponse.json();
      
      // Get item details (names and icons)
      const itemsResponse = await fetch(`https://api.guildwars2.com/v2/items?ids=${allConversionItemIds.join(',')}`);
      const items = await itemsResponse.json();

      // Create price and item maps
      const pricesMap = prices.reduce((acc: Record<number, Gw2Price>, price: Gw2Price) => {
        acc[price.id] = price;
        return acc;
      }, {} as Record<number, Gw2Price>);

      const itemsMap = items.reduce((acc: Record<number, Gw2Item>, item: Gw2Item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<number, Gw2Item>);

      // Get prices for comparison
      const ectoplasmPrice = pricesMap[conversionMaterials.ectoplasm]?.sells?.unit_price || 0;
      const crystallineDustBuyPrice = pricesMap[conversionMaterials.crystallineDust]?.buys?.unit_price || 0;
      const crystallineDustSellPrice = pricesMap[conversionMaterials.crystallineDust]?.sells?.unit_price || 0;
      

      
      // Calculate the 4 values for comparison
              const valor1 = Math.ceil(crystallineDustSellPrice * 0.90); // Precio Sell al 90%
      const valor2 = crystallineDustBuyPrice; // Precio Buy
              const valor3 = Math.ceil(ectoplasmPrice * 0.90); // Ecto al precio de derecha al 90%
        const valor4 = Math.ceil(ectoplasmPrice * 0.90 / 1.85); // Ecto al 90%/1.85
      
      // Find the minimum value
      const menorValor = Math.min(valor1, valor2, valor3, valor4);
      


              const calculatedConversions: ConversionItem[] = t6Materials.map(t6 => {
        const t5BuyPrice = pricesMap[t6.t5Id]?.buys?.unit_price || 0; // Precio de compra del T5
        const t6SellPrice = pricesMap[t6.id]?.sells?.unit_price || 0;

        const ectoplasmCost = menorValor * 200; // Usar el menor valor encontrado * 200
        const t5Cost = t5BuyPrice * 2000; 
        const costeConv20 = ectoplasmCost + t5Cost;

        // Cálculos de ganancia según la fórmula correcta
        // Profit SS 90% T6 = ((Precio 90% del T6 * 242) - CostConv20) / 20
        const precio90T6 = t6SellPrice * 0.90;
        const profit90 = ((precio90T6 * 242) - costeConv20)/20;
        const profit85 = ((t6SellPrice * 0.85 * 242) - costeConv20) / 20;



        const itemInfo = itemsMap[t6.id];

        return {
          id: t6.id,
          name: itemInfo?.name || t6.name,
          icon: itemInfo?.icon || '',
          precio90: Math.ceil(t6SellPrice * 0.90),
          precio85: Math.ceil(t6SellPrice * 0.85),
          costeConv20: Math.round(costeConv20),
          profit90: Math.round(profit90),
          profit85: Math.round(profit85),
        };
      });

      setConversionData(calculatedConversions);
    } catch (error) {
      console.error('Error fetching conversion data:', error);
    } finally {
      setIsLoadingConversions(false);
    }
  }, [allConversionItemIds, conversionMaterials.ectoplasm, conversionMaterials.crystallineDust, t6Materials]);

  useEffect(() => {
    if (selectedSection === 'conversions') {
      fetchConversionCalculations();
    }
  }, [selectedSection, fetchConversionCalculations]);

  // Función para formatear cobre a G S C
  const formatGoldSilverCopper = (copper: number) => {
    const sign = copper < 0 ? '-' : '';
    const absCopper = Math.abs(copper);
    const gold = Math.floor(absCopper / 10000);
    const silver = Math.floor((absCopper % 10000) / 100);
    const copperRemainder = absCopper % 100;
    
    // Formatear con ceros a la izquierda para todos los valores
    const goldStr = gold.toString().padStart(2, '0');
    const silverStr = silver.toString().padStart(2, '0');
    const copperStr = copperRemainder.toString().padStart(2, '0');
    
    return `${sign}${goldStr}G ${silverStr}S ${copperStr}C`;
  };

  // Función para color de ganancia
  const getProfitColor = (profit: number) => {
    if (profit > 6000) return 'bg-green-500';  // > 0.7 Gold
    if (profit > 0) return 'bg-yellow-500';   // > 0 Gold
    return 'bg-red-600';                    // Pérdida
  };



  const materialTiers = [
    {
      tier: 'T1',
      name: t('craftingPage.tiers.basic', 'Basic'),
      materials: ['Copper', 'Green Wood', 'Rawhide Leather', 'Linen'],
      color: 'from-gray-400 to-gray-600'
    },
    {
      tier: 'T2',
      name: t('craftingPage.tiers.fine', 'Fine'),
      materials: ['Bronze', 'Soft Wood', 'Thin Leather', 'Jute'],
      color: 'from-green-400 to-green-600'
    },
    {
      tier: 'T3',
      name: t('craftingPage.tiers.masterwork', 'Masterwork'),
      materials: ['Iron', 'Seasoned Wood', 'Coarse Leather', 'Wool'],
      color: 'from-blue-400 to-blue-600'
    },
    {
      tier: 'T4',
      name: t('craftingPage.tiers.rare', 'Rare'),
      materials: ['Steel', 'Hard Wood', 'Rugged Leather', 'Cotton'],
      color: 'from-purple-400 to-purple-600'
    },
    {
      tier: 'T5',
      name: t('craftingPage.tiers.exotic', 'Exotic'),
      materials: ['Mithril', 'Ancient Wood', 'Hardened Leather', 'Silk'],
      color: 'from-orange-400 to-orange-600'
    },
    {
      tier: 'T6',
      name: t('craftingPage.tiers.ascended', 'Ascended'),
      materials: ['Orichalcum', 'Elder Wood', 'Tempered Leather', 'Gossamer'],
      color: 'from-red-400 to-red-600'
    }
  ];

  const craftingTips = [
    {
      title: 'Efficient Leveling',
      description: 'Craft items you can sell to recover costs while leveling up',
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      title: 'Cheap Materials',
      description: 'Buy materials during low demand periods to save gold',
      icon: Coins,
      color: 'text-yellow-400'
    },
    {
      title: 'Profitable Recipes',
      description: 'Focus on recipes that have good demand on the Trading Post',
      icon: BarChart3,
      color: 'text-blue-400'
    },
    {
      title: 'Conversions',
      description: 'Convert lower tier materials to higher tier when profitable',
      icon: Zap,
      color: 'text-purple-400'
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t('craftingPage.title', 'Crafting Guide')}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('craftingPage.subtitle', 'Everything you need to know about crafting in Guild Wars 2. From professions to profit strategies.')}
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {[
              { id: 'overview', label: t('craftingPage.overview', 'Overview'), icon: Info },
              { id: 'materials', label: t('craftingPage.materials', 'Materials'), icon: Package },
              { id: 'strategies', label: t('craftingPage.strategies', 'Strategies'), icon: TrendingUp },
              { id: 'conversions', label: t('craftingPage.conversions', 'Conversions'), icon: RefreshCw }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSection(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  selectedSection === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Content Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Overview Section */}
            {selectedSection === 'overview' && (
              <div className="space-y-8">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Info className="w-6 h-6 mr-3 text-blue-400" />
                    {t('craftingPage.whatIsCrafting', 'What is Crafting?')}
                  </h2>
                                      <p className="text-gray-300 mb-4">
                      {t('craftingPage.whatIsCraftingDesc', 'Crafting in Guild Wars 2 is a way to create objects, weapons, armor, and consumables. It\'s an excellent way to earn gold and obtain items for your character.')}
                    </p>
                  <div className="text-center mb-4">
                                          <GlossaryLink>
                        {t('craftingPage.learnMoreGlossary', 'Learn more crafting concepts in the Glossary')}
                      </GlossaryLink>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">{t('craftingPage.craftingBenefits', 'Crafting Benefits')}</h3>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• {t('craftingPage.benefits.createItems', 'Create items for personal use')}</li>
                        <li>• {t('craftingPage.benefits.sellItems', 'Sell items on the Trading Post')}</li>
                        <li>• {t('craftingPage.benefits.completeCollections', 'Complete collections and achievements')}</li>
                        <li>• {t('craftingPage.benefits.gainExperience', 'Gain level experience')}</li>
                      </ul>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">{t('craftingPage.basicTips', 'Basic Tips')}</h3>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• {t('craftingPage.tips.startProfession', 'Start with a profession you like')}</li>
                        <li>• {t('craftingPage.tips.buyMaterials', 'Buy materials when they\'re cheap')}</li>
                        <li>• {t('craftingPage.tips.checkPrices', 'Check prices before crafting')}</li>
                        <li>• {t('craftingPage.tips.useProfitCalculators', 'Use profit calculators')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}



            {/* Materials Section */}
            {selectedSection === 'materials' && (
              <div className="space-y-8">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Package className="w-6 h-6 mr-3 text-green-400" />
                    {t('craftingPage.materialTiers', 'Material Tiers')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {materialTiers.map((tier) => (
                      <div key={tier.tier} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-8 h-8 bg-gradient-to-br ${tier.color} rounded-lg flex items-center justify-center`}>
                            <span className="text-white font-bold text-sm">{tier.tier}</span>
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{tier.name}</h3>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {tier.materials.map((material, idx) => (
                            <div key={idx} className="text-gray-300 text-sm">
                              • {material}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Strategies Section */}
            {selectedSection === 'strategies' && (
              <div className="space-y-8">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
                    {t('craftingPage.profitStrategies', 'Profit Strategies')}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {craftingTips.map((tip, index) => (
                      <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center`}>
                            <tip.icon className={`w-5 h-5 ${tip.color}`} />
                          </div>
                          <h3 className="text-white font-semibold">{tip.title}</h3>
                        </div>
                        <p className="text-gray-300 text-sm">{tip.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advanced Tips */}
                <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-3 text-yellow-400" />
                    Advanced Tips
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Market Analysis</h4>
                          <p className="text-gray-300 text-sm">Monitor Trading Post prices to identify profitable crafting opportunities.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Purchase Timing</h4>
                          <p className="text-gray-300 text-sm">Buy materials when prices are low, especially after events.</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Profitable Conversions</h4>
                          <p className="text-gray-300 text-sm">Convert lower tier materials to higher tier when the price difference is favorable.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Specialization</h4>
                          <p className="text-gray-300 text-sm">Focus on one or two professions to maximize your efficiency and profits.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Conversions Section */}
            {selectedSection === 'conversions' && (
              <div className="space-y-8">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <RefreshCw className="w-6 h-6 mr-3 text-yellow-400" />
                      <h2 className="text-2xl font-bold text-white">
                        {t('craftingPage.t6Conversions', 'T6 Material Conversions')}
                      </h2>
                    </div>
                    <button
                      onClick={fetchConversionCalculations}
                      disabled={isLoadingConversions}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoadingConversions ? 'animate-spin' : ''}`} />
                      {isLoadingConversions ? t('craftingPage.updating', 'Updating...') : t('craftingPage.refreshData', 'Refresh Data')}
                    </button>
                  </div>
                  <p className="text-gray-400 mb-6">
                    {t('craftingPage.conversionsDesc', 'Calculate the profitability of converting Tier 5 to Tier 6 materials through the Mystic Forge. Prices are updated in real-time from the Guild Wars 2 API.')}
                  </p>
                  

                  

                  {isLoadingConversions ? (
                    <div className="flex justify-center items-center h-48">
                      <Loader2 className="animate-spin text-blue-400" size={48} />
                      <p className="ml-4 text-white text-lg">{t('craftingPage.loadingConversionData', 'Loading conversion data...')}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-gray-600">
                          <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200">{t('craftingPage.table.material', 'Material')}</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200">{t('craftingPage.table.price90', 'Price 90%')}</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200">{t('craftingPage.table.price85', 'Price 85%')}</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200">{t('craftingPage.table.convCost20', 'Conv Cost 20')}</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200">{t('craftingPage.table.profitSS90', 'Profit SS 90% T6')}</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200">{t('craftingPage.table.profitSS85', 'Profit SS 85% T6')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {conversionData.map((item, index) => (
                            <motion.tr 
                              key={item.id} 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="border-b border-gray-600 last:border-b-0 hover:bg-gray-600"
                            >
                              <td className="py-3 px-4 text-white flex items-center">
                                {item.icon && (
                                  <Image 
                                    src={item.icon} 
                                    alt={item.name} 
                                    className="w-6 h-6 mr-2 rounded"
                                    width={24}
                                    height={24}
                                  />
                                )}
                                {item.name}
                              </td>
                              <td className="py-3 px-4 text-white">{formatGoldSilverCopper(item.precio90)}</td>
                              <td className="py-3 px-4 text-white">{formatGoldSilverCopper(item.precio85)}</td>
                              <td className="py-3 px-4 text-white">{formatGoldSilverCopper(item.costeConv20)}</td>
                              <td className={`py-3 px-4 text-white font-semibold ${getProfitColor(item.profit90)}`}>
                                {formatGoldSilverCopper(item.profit90)}
                              </td>
                              <td className={`py-3 px-4 text-white font-semibold ${getProfitColor(item.profit85)}`}>
                                {formatGoldSilverCopper(item.profit85)}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 text-center">

          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CraftingPage; 