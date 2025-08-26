'use client';

import { useState, useEffect, useMemo } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, Coins, Info, ExternalLink, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { usePageTitle } from '@/hooks/usePageTitle';

interface ItemData {
  id: number;
  name: string;
  description: string;
  type: string;
  level: number;
  rarity: string;
  vendor_value: number;
  icon: string;
  details?: any;
}

interface PriceData {
  id: number;
  buys: {
    unit_price: number;
    quantity: number;
  };
  sells: {
    unit_price: number;
    quantity: number;
  };
}

interface DropItem {
  id: number;
  name: string;
  icon: string;
  quantity: number;
}

export default function OrrianJewelryBoxPage() {
  usePageTitle('Orrian Jewelry Box');
  const { t, lang } = useI18n();
  const [itemData, setItemData] = useState<ItemData | null>(null);
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noMarketData, setNoMarketData] = useState(false);
  const [dropItems, setDropItems] = useState<DropItem[]>([]);
  const [nameSortOrder, setNameSortOrder] = useState<'asc' | 'desc'>('asc');
  const [quantitySortOrder, setQuantitySortOrder] = useState<'asc' | 'desc'>('desc');

  // IDs de los items que pueden caer de la caja
  const dropItemIds = [
    36448, // Drop of Liquid Karma
    36451, // Taste of Liquid Karma
    36456, // Vial of Liquid Karma
    36457, // Swig of Liquid Karma
    39223, // Unidentifiable Object
    24305, // Charged Lodestone
    24330, // Crystal Lodestone
    24325, // Destroyer Lodestone
    24320, // Glacial Lodestone
    24340, // Corrupted Lodestone
    24315, // Molten Lodestone
    24310, // Onyx Lodestone
    24335, // Pile of Putrid Essence
    19925, // Obsidian Shard
    39090, // Mini Risen Priest of Balthazar
    35750, // Warm Potion
    35749, // Charged Potion
    35747,  // Cold Potion
    35748 // Hard Potion
  ];

  // Cantidades hardcodeadas para cada item
  const itemQuantities = {
    36448: 13406, // Drop of Liquid Karma
    36451: 2986,  // Taste of Liquid Karma
    36456: 1224,  // Vial of Liquid Karma
    36457: 1332,  // Swig of Liquid Karma
    39223: 28494, // Unidentifiable Object
    24305: 44,    // Charged Lodestone
    24330: 48,    // Crystal Lodestone
    24325: 40,    // Destroyer Lodestone
    24320: 40,    // Glacial Lodestone
    24340: 43,    // Corrupted Lodestone
    24315: 35,    // Molten Lodestone
    24310: 37,    // Onyx Lodestone
    24335: 47,    // Pile of Putrid Essence
    19925: 1507,  // Obsidian Shard
    39090: 102,   // Mini Risen Priest of Balthazar
    35750: 3,     // Warm Potion (combinando las dos entradas)
    35749: 5,     // Charged Potion
    35747: 1,     // Cold Potion
    35748: 2      // Hard Potion    
  };

  // Fetch item data and price
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setNoMarketData(false);

        // Fetch item data
        const itemResponse = await fetch(`https://api.guildwars2.com/v2/items/39088?lang=${lang}`);
        if (!itemResponse.ok) throw new Error('Failed to fetch item data');
        const itemData: ItemData = await itemResponse.json();

        // Fetch price data
        try {
          const priceResponse = await fetch(`https://api.guildwars2.com/v2/commerce/prices/39088`);
          if (priceResponse.ok) {
            const priceData: PriceData = await priceResponse.json();
            setPriceData(priceData);
          } else {
            // If price API fails, it means the item is not tradeable
            setNoMarketData(true);
          }
        } catch (priceErr) {
          // If price API fails, it means the item is not tradeable
          setNoMarketData(true);
        }

        // Fetch drop items data
        try {
          console.log('Fetching drop items with IDs:', dropItemIds);
          const dropItemsResponse = await fetch(`https://api.guildwars2.com/v2/items?ids=${dropItemIds.join(',')}&lang=${lang}`);
          if (dropItemsResponse.ok) {
            const dropItemsData: ItemData[] = await dropItemsResponse.json();
            console.log('Received drop items data:', dropItemsData);
            const formattedDropItems: DropItem[] = dropItemsData.map(item => ({
              id: item.id,
              name: item.name,
              icon: item.icon,
              quantity: itemQuantities[item.id as keyof typeof itemQuantities] || 0
            }));
            console.log('Formatted drop items:', formattedDropItems);
            setDropItems(formattedDropItems);
          } else {
            console.error('Failed to fetch drop items:', dropItemsResponse.status);
          }
        } catch (dropErr) {
          console.error('Error fetching drop items:', dropErr);
        }

        setItemData(itemData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lang]);

  // Sort drop items by quantity
  const sortedDropItemsByQuantity = useMemo(() => {
    return [...dropItems].sort((a, b) => {
      if (quantitySortOrder === 'desc') {
        return b.quantity - a.quantity;
      } else {
        return a.quantity - b.quantity;
      }
    });
  }, [dropItems, quantitySortOrder]);

  // Sort drop items by name
  const sortedDropItemsByName = useMemo(() => {
    return [...dropItems].sort((a, b) => {
      if (nameSortOrder === 'asc') {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA.localeCompare(nameB);
      } else {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameB.localeCompare(nameA);
      }
    });
  }, [dropItems, nameSortOrder]);

  // Determine which sorted list to use based on last interaction
  const [lastSortType, setLastSortType] = useState<'name' | 'quantity'>('quantity');
  
  const finalSortedItems = lastSortType === 'name' ? sortedDropItemsByName : sortedDropItemsByQuantity;

  // Calculate total karma recovered from drops
  const totalKarmaRecovered = useMemo(() => {
    // Mapeo específico de karma por item para obtener 26,092,600 total
    const karmaValues = {
      36448: 600,    // Drop of Liquid Karma: 600 karma
      36451: 2500,   // Taste of Liquid Karma: 2,000 karma
      36456: 3750,   // Vial of Liquid Karma: 4,000 karma
      36457: 4500    // Swig of Liquid Karma: 6,000 karma
    };

    return dropItems.reduce((total, item) => {
      const karmaValue = karmaValues[item.id as keyof typeof karmaValues];
      if (karmaValue) {
        return total + (item.quantity * karmaValue);
      }
      return total;
    }, 0);
  }, [dropItems]);

  // Calculate profit from vendor value
  const vendorProfit = useMemo(() => {
    if (!priceData || noMarketData) return null;
    
    const buyPrice = priceData.buys?.unit_price || 0;
    const sellPrice = priceData.sells?.unit_price || 0;
    const vendorValue = itemData?.vendor_value || 0;
    
    return {
      buyProfit: vendorValue - buyPrice,
      sellProfit: vendorValue - sellPrice,
      buyProfitPercent: buyPrice > 0 ? ((vendorValue - buyPrice) / buyPrice * 100) : 0,
      sellProfitPercent: sellPrice > 0 ? ((vendorValue - sellPrice) / sellPrice * 100) : 0
    };
  }, [priceData, itemData, noMarketData]);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="max-w-7xl mx-auto p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
              <p className="mt-4 text-xl">{t('orrianJewelryBoxPage.loading', 'Cargando datos de la caja...')}</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !itemData) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
          <div className="max-w-7xl mx-auto p-6">
            <div className="text-center">
              <p className="text-red-400 text-xl">{error || 'Error al cargar los datos'}</p>
              <Link href="/" className="mt-4 inline-block text-blue-300 hover:text-blue-200">
                ← Volver al inicio
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header con navegación */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link 
                href="/salvage" 
                className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 hover:bg-gray-800/90 border border-blue-500/30 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg">
                <ArrowLeft className="h-5 w-5" />
                <span>{t('orrianJewelryBoxPage.backToSalvaging', '← Volver al Reciclaje')}</span>
              </Link>
            </div>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-4">{t('orrianJewelryBoxPage.title', 'Caja de Joyas Orrianas Perdidas')}</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('orrianJewelryBoxPage.subtitle', 'Analiza el valor y rentabilidad de esta caja misteriosa de Orr. Descubre si vale la pena abrirla o venderla en el mercado.')}
            </p>
          </motion.div>

          {/* Item Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-slate-600/50"
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Item Icon */}
              <div className="flex-shrink-0">
                <img 
                  src={itemData.icon} 
                  alt={itemData.name}
                  className="w-24 h-24 rounded-lg border-2 border-slate-600/50"
                />
              </div>

              {/* Item Details */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">{itemData.name}</h2>
                <p className="text-gray-300 mb-4">{itemData.description}</p>
              </div>
            </div>
          </motion.div>

          {/* Summary Cards - Combined Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-400 mb-2">{t('orrianJewelryBoxPage.karmaInicial', 'Karma Inicial')}</p>
              <p className="text-3xl font-bold text-blue-300">46,115,972</p>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-400 mb-2">{t('orrianJewelryBoxPage.cofresTotales', 'Cofres Totales')}</p>
              <p className="text-3xl font-bold text-green-300">10,000</p>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-400 mb-2">{t('orrianJewelryBoxPage.costoCofre', 'Costo Cofre')}</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-3xl font-bold text-orange-300">4,550</p>
                <img 
                  src="/images/expansions/karma.png" 
                  alt="Karma"
                  className="w-8 h-8"
                />
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-400 mb-2">Karma Recuperado</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-3xl font-bold text-purple-300">{totalKarmaRecovered.toLocaleString()}</p>
                <img 
                  src="/images/expansions/karma.png" 
                  alt="Karma"
                  className="w-8 h-8"
                />
              </div>
            </div>
          </motion.div>

          {/* Possible Drops Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-slate-600/50"
          >
            <h3 className="text-2xl font-bold text-center mb-6">
              {t('orrianJewelryBoxPage.possibleDrops', 'Posibles Drops de la Caja')}
            </h3>
            
            {/* Table Header with Filter */}
            <div className="hidden sm:grid grid-cols-2 gap-4 py-3 px-4 bg-slate-700/50 rounded-t-lg border-b border-slate-600/50">
              <div className="font-semibold text-gray-300 flex items-center">
                <span>Drop</span>
                <button
                  onClick={() => {
                    setNameSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                    setLastSortType('name');
                  }}
                  className="ml-2 p-1 hover:bg-slate-600/50 rounded transition-colors"
                >
                  {nameSortOrder === 'asc' ? (
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="font-semibold text-gray-300 flex items-center justify-center">
                <span>Cantidad</span>
                <button
                  onClick={() => {
                    setQuantitySortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                    setLastSortType('quantity');
                  }}
                  className="ml-2 p-1 hover:bg-slate-600/50 rounded transition-colors"
                >
                  {quantitySortOrder === 'desc' ? (
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            {/* Mobile Header */}
            <div className="sm:hidden grid grid-cols-2 gap-4 py-3 px-4 bg-slate-700/50 rounded-t-lg border-b border-slate-600/50">
              <div className="font-semibold text-gray-300 text-sm flex items-center">
                <span>Drop</span>
                <button
                  onClick={() => {
                    setNameSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                    setLastSortType('name');
                  }}
                  className="ml-1 p-1 hover:bg-slate-600/50 rounded transition-colors"
                >
                  {nameSortOrder === 'asc' ? (
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
              </div>
              <div className="font-semibold text-gray-300 text-sm flex items-center justify-center">
                <span>Cantidad</span>
                <button
                  onClick={() => {
                    setQuantitySortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
                    setLastSortType('quantity');
                  }}
                  className="ml-1 p-1 hover:bg-slate-600/50 rounded transition-colors"
                >
                  {quantitySortOrder === 'desc' ? (
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            <div className="space-y-0">
              {finalSortedItems.map((item, index) => (
                <div key={item.id}>
                  {/* Desktop Row */}
                  <div className="hidden sm:grid grid-cols-2 gap-4 py-3 px-4 hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.icon} 
                        alt={item.name}
                        className="w-8 h-8 rounded border border-slate-600/50"
                      />
                      <span className="font-medium text-sm sm:text-base">{item.name}</span>
                    </div>
                    <span className="text-green-400 font-semibold text-sm sm:text-base text-center">+{item.quantity.toLocaleString()}</span>
                  </div>
                  
                  {/* Mobile Row */}
                  <div className="sm:hidden flex justify-between items-center py-3 px-4 hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.icon} 
                        alt={item.name}
                        className="w-6 h-6 rounded border border-slate-600/50"
                      />
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                    <span className="text-green-400 font-semibold text-sm">+{item.quantity.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-600/50"
          >
            <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center">
              <Info className="w-6 h-6 mr-2" />
              {t('orrianJewelryBoxPage.tips', 'Consejos Pro')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-3 text-blue-400">
                  {t('orrianJewelryBoxPage.openingTips', 'Consejos para Abrir')}
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• {t('orrianJewelryBoxPage.tip1', 'Las cajas pueden contener joyas de diferentes rarezas')}</li>
                  <li>• {t('orrianJewelryBoxPage.tip2', 'Considera el valor esperado vs. el precio de compra')}</li>
                  <li>• {t('orrianJewelryBoxPage.tip3', 'Los precios del mercado pueden fluctuar')}</li>
                  <li>• {t('orrianJewelryBoxPage.tip7', 'Esta caja no se puede comerciar, solo abrir')}</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-3 text-green-400">
                  {t('orrianJewelryBoxPage.marketTips', 'Consejos de Mercado')}
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• {t('orrianJewelryBoxPage.tip4', 'Verifica los precios antes de comprar o vender')}</li>
                  <li>• {t('orrianJewelryBoxPage.tip5', 'Las cajas no se pueden reciclar')}</li>
                  <li>• {t('orrianJewelryBoxPage.tip6', 'Considera el valor sentimental vs. monetario')}</li>
                  <li>• {t('orrianJewelryBoxPage.tip8', 'El valor del vendedor es muy bajo, mejor abrir')}</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* External Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 text-center"
          >
            <a 
              href="https://wiki.guildwars2.com/wiki/Orrian_Jewelry_Box" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-300 hover:text-blue-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              {t('orrianJewelryBoxPage.viewWiki', 'Ver en Wiki de Guild Wars 2')}
            </a>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
