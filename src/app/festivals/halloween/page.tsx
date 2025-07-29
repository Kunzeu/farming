'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import { 
  RefreshCw,
  Coins,
  Package,
  TrendingUp,
  Info,
  Calculator
} from 'lucide-react';

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

interface HalloweenItem {
  id: number;
  name: string;
  icon: string;
  dropRate: number; // Porcentaje de drop
  avgValue: number; // Valor promedio en cobre
  profitPerBag: number; // Ganancia por bag
}

const halloweenItems = [
  { id: 28433, name: 'Trick-or-Treat Bag', icon: '', dropRate: 100 }, // Base item
  { id: 28431, name: 'Candy Corn', icon: '', dropRate: 85 },
  { id: 28432, name: 'Plastic Fangs', icon: '', dropRate: 15 },
  { id: 28434, name: 'Novelty Sombrero', icon: '', dropRate: 8 },
  { id: 28435, name: 'Chocolate Bar', icon: '', dropRate: 12 },
  { id: 28436, name: 'Plastic Spider', icon: '', dropRate: 10 },
  { id: 28437, name: 'Gummy Worms', icon: '', dropRate: 7 },
  { id: 28438, name: 'Chocolate Corn', icon: '', dropRate: 5 },
  { id: 28439, name: 'Plastic Fangs', icon: '', dropRate: 3 },
  { id: 28440, name: 'Chocolate Bar', icon: '', dropRate: 2 }
];

const candyCornItems = [
  { id: 28431, name: 'Candy Corn', icon: '' },
  { id: 28432, name: 'Plastic Fangs', icon: '' },
  { id: 28434, name: 'Novelty Sombrero', icon: '' },
  { id: 28435, name: 'Chocolate Bar', icon: '' },
  { id: 28436, name: 'Plastic Spider', icon: '' },
  { id: 28437, name: 'Gummy Worms', icon: '' },
  { id: 28438, name: 'Chocolate Corn', icon: '' },
  { id: 28439, name: 'Plastic Fangs', icon: '' },
  { id: 28440, name: 'Chocolate Bar', icon: '' }
];

const HalloweenPage = () => {
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const [bagData, setBagData] = useState<HalloweenItem[]>([]);
  const [candyCornData, setCandyCornData] = useState<{ id: number; name: string; sellPrice: number; buyPrice: number; profit: number }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bagPrice, setBagPrice] = useState(0);


  const allItemIds = useMemo(() => [
    ...halloweenItems.map(item => item.id),
    ...candyCornItems.map(item => item.id)
  ], []);

  const fetchHalloweenData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Obtener precios de la API de GW2
      const pricesResponse = await fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${allItemIds.join(',')}`);
      const prices = await pricesResponse.json();
      
      // Obtener detalles de los items
      const itemsResponse = await fetch(`https://api.guildwars2.com/v2/items?ids=${allItemIds.join(',')}`);
      const items = await itemsResponse.json();

      // Crear mapas
      const pricesMap = prices.reduce((acc: Record<number, Gw2Price>, price: Gw2Price) => {
        acc[price.id] = price;
        return acc;
      }, {} as Record<number, Gw2Price>);

      const itemsMap = items.reduce((acc: Record<number, Gw2Item>, item: Gw2Item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<number, Gw2Item>);

      // Calcular datos de Trick-or-Treat Bags
      const calculatedBagData: HalloweenItem[] = halloweenItems.map(item => {
        const itemInfo = itemsMap[item.id];
        const price = pricesMap[item.id];
        const sellPrice = price?.sells?.unit_price || 0;
        const profitPerBag = (sellPrice * item.dropRate / 100);
        
        return {
          id: item.id,
          name: itemInfo?.name || item.name,
          icon: itemInfo?.icon || '',
          dropRate: item.dropRate,
          avgValue: sellPrice,
          profitPerBag: profitPerBag
        };
      });

      // Calcular datos de Candy Corn
      const calculatedCandyCornData = candyCornItems.map(item => {
        const itemInfo = itemsMap[item.id];
        const price = pricesMap[item.id];
        const sellPrice = price?.sells?.unit_price || 0;
        const buyPrice = price?.buys?.unit_price || 0;
        
        return {
          id: item.id,
          name: itemInfo?.name || item.name,
          icon: itemInfo?.icon || '',
          sellPrice: sellPrice,
          buyPrice: buyPrice,
          profit: sellPrice - buyPrice
        };
      });

      setBagData(calculatedBagData);
      setCandyCornData(calculatedCandyCornData);
      
      // Precios principales
      const bagPriceData = pricesMap[28433]; // Trick-or-Treat Bag
      
      setBagPrice(bagPriceData?.sells?.unit_price || 0);

    } catch (error) {
      console.error('Error fetching Halloween data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [allItemIds]);

  useEffect(() => {
    if (selectedSection === 'calculators') {
      fetchHalloweenData();
    }
  }, [selectedSection, fetchHalloweenData]);

  const formatGoldSilverCopper = (copper: number) => {
    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const copperRemaining = copper % 100;
    
    return `${gold.toString().padStart(2, '0')}G ${silver.toString().padStart(2, '0')}S ${copperRemaining.toString().padStart(2, '0')}C`;
  };

  const getProfitColor = (profit: number) => {
    if (profit > 5000) return 'bg-green-600';
    if (profit > 2000) return 'bg-green-500';
    if (profit > 500) return 'bg-yellow-500';
    if (profit > 0) return 'bg-orange-500';
    return 'bg-red-600';
  };

  const totalBagValue = bagData.reduce((sum, item) => sum + item.profitPerBag, 0);
  const bagProfit = totalBagValue - bagPrice;

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <span className="text-3xl mr-3">🎃</span>
              Festival de Halloween
            </h1>
            <p className="text-xl text-gray-300">
              Calculadoras y análisis para maximizar tus ganancias durante Halloween
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
              { id: 'overview', label: 'Vista General', icon: Info },
              { id: 'calculators', label: 'Calculadoras', icon: Calculator },
              { id: 'strategies', label: 'Estrategias', icon: TrendingUp }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSection(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  selectedSection === tab.id
                    ? 'bg-orange-600 text-white'
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
                    <Info className="w-6 h-6 mr-3 text-orange-400" />
                    Festival de Halloween
                  </h2>
                  <p className="text-gray-300 mb-6">
                    El Festival de Halloween en Guild Wars 2 es una de las mejores oportunidades para farming. 
                    Con actividades como el Mad King&apos;s Labyrinth y las Trick-or-Treat Bags, puedes generar 
                    cantidades significativas de oro en poco tiempo.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Trick-or-Treat Bags</h3>
                      <p className="text-gray-300 text-sm">
                        Las bolsas contienen items aleatorios con diferentes tasas de drop. 
                        El análisis de precios te ayuda a determinar si es rentable abrirlas.
                      </p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Mad King&apos;s Labyrinth</h3>
                      <p className="text-gray-300 text-sm">
                        El laberinto es la actividad principal. Con una buena ruta y grupo, 
                        puedes obtener cientos de bolsas por hora.
                      </p>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Candy Corn</h3>
                      <p className="text-gray-300 text-sm">
                        El material principal del festival. Sus precios fluctúan durante 
                        y después del evento, creando oportunidades de trading.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Calculators Section */}
            {selectedSection === 'calculators' && (
              <div className="space-y-8">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <Calculator className="w-6 h-6 mr-3 text-orange-400" />
                      <h2 className="text-2xl font-bold text-white">
                        Calculadoras de Halloween
                      </h2>
                    </div>
                    <button
                      onClick={fetchHalloweenData}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      {isLoading ? 'Actualizando...' : 'Refrescar Datos'}
                    </button>
                  </div>

                  {/* Trick-or-Treat Bag Analysis */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-orange-400" />
                      Análisis de Trick-or-Treat Bags
                    </h3>
                    
                    {!isLoading && bagData.length > 0 && (
                      <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-gray-400 text-sm">Precio de la Bolsa</p>
                            <p className="text-white font-semibold">{formatGoldSilverCopper(bagPrice)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Valor Esperado</p>
                            <p className="text-white font-semibold">{formatGoldSilverCopper(totalBagValue)}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Ganancia/Pérdida</p>
                            <p className={`font-semibold ${bagProfit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {formatGoldSilverCopper(Math.abs(bagProfit))} {bagProfit > 0 ? '(Ganancia)' : '(Pérdida)'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-600">
                            <th className="text-left py-2 text-gray-300">Item</th>
                            <th className="text-center py-2 text-gray-300">Drop Rate</th>
                            <th className="text-center py-2 text-gray-300">Precio</th>
                            <th className="text-center py-2 text-gray-300">Valor/Bag</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bagData.map((item) => (
                            <tr key={item.id} className="border-b border-gray-700">
                              <td className="py-2 text-white">{item.name}</td>
                              <td className="py-2 text-center text-gray-300">{item.dropRate}%</td>
                              <td className="py-2 text-center text-gray-300">{formatGoldSilverCopper(item.avgValue)}</td>
                              <td className="py-2 text-center text-gray-300">{formatGoldSilverCopper(item.profitPerBag)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Candy Corn Analysis */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <Coins className="w-5 h-5 mr-2 text-yellow-400" />
                      Análisis de Candy Corn
                    </h3>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-600">
                            <th className="text-left py-2 text-gray-300">Item</th>
                            <th className="text-center py-2 text-gray-300">Precio Venta</th>
                            <th className="text-center py-2 text-gray-300">Precio Compra</th>
                            <th className="text-center py-2 text-gray-300">Ganancia</th>
                          </tr>
                        </thead>
                        <tbody>
                          {candyCornData.map((item) => (
                            <tr key={item.id} className="border-b border-gray-700">
                              <td className="py-2 text-white">{item.name}</td>
                              <td className="py-2 text-center text-gray-300">{formatGoldSilverCopper(item.sellPrice)}</td>
                              <td className="py-2 text-center text-gray-300">{formatGoldSilverCopper(item.buyPrice)}</td>
                              <td className={`py-2 text-center font-semibold ${getProfitColor(item.profit)}`}>
                                {formatGoldSilverCopper(item.profit)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Strategies Section */}
            {selectedSection === 'strategies' && (
              <div className="space-y-8">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3 text-orange-400" />
                    Estrategias de Farming
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">Mad King&apos;s Labyrinth</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-semibold">Ruta Optimizada</h4>
                            <p className="text-gray-300 text-sm">Sigue una ruta específica para maximizar las bolsas por hora.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-semibold">Grupo Coordinado</h4>
                            <p className="text-gray-300 text-sm">Un grupo de 5 personas puede obtener 200+ bolsas por hora.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-semibold">Timing</h4>
                            <p className="text-gray-300 text-sm">Los mejores momentos son durante las horas pico del servidor.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">Trading Post</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-semibold">Compra Anticipada</h4>
                            <p className="text-gray-300 text-sm">Compra bolsas antes del festival cuando los precios están bajos.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-semibold">Venta Estratégica</h4>
                            <p className="text-gray-300 text-sm">Vende items específicos cuando sus precios alcancen picos.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                            <h4 className="text-white font-semibold">Candy Corn Trading</h4>
                            <p className="text-gray-300 text-sm">Aprovecha las fluctuaciones de precio del Candy Corn.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default HalloweenPage; 