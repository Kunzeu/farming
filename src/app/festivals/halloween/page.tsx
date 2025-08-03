'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import { 
  RefreshCw,
  Package,
  TrendingUp,
  Info,
  Calculator,
  Plus,
  List,
  Search,
  X,
  ArrowLeft
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

interface CalculatorItem {
  id: number;
  name: string;
  quantity: number;
  price100: number;
  price85: number;
  total100: number;
  total85: number;
}

const candyCornItems = [
  { id: 36059, name: '', icon: '' },
  { id: 36060, name: '', icon: '' },
  { id: 36061, name: '', icon: '' },
  { id: 36076, name: '', icon: '' },
  { id: 36074, name: '', icon: '' },
  { id: 36077, name: '', icon: '' },
  { id: 67379, name: '', icon: '' },
  { id: 36084, name: '', icon: '' },
  { id: 36081, name: '', icon: '' },
  { id: 67371, name: '', icon: '' },
  { id: 67367, name: '', icon: '' },
  { id: 67368, name: '', icon: '' },
  { id: 36080, name: '', icon: '' },
  { id: 79679, name: '', icon: '' },
  { id: 79673, name: '', icon: '' },
  { id: 79677, name: '', icon: '' },
  { id: 67386, name: '', icon: '' },
  { id: 67382, name: '', icon: '' },
  { id: 67366, name: '', icon: '' },
  { id: 79647, name: '', icon: '' },
  { id: 67370, name: '', icon: '' },
  { id: 67372, name: '', icon: '' },
  { id: 67375, name: '', icon: '' },
  { id: 71931, name: '', icon: '' },
  { id: 48807, name: '', icon: '' },
  { id: 48805, name: '', icon: '' },
  { id: 48806, name: '', icon: '' },
  { id: 36046, name: '', icon: '' },
  { id: 36048, name: '', icon: '' },
  { id: 36050, name: '', icon: '' },
  { id: 36063, name: '', icon: '' },
  { id: 36065, name: '', icon: '' },
  { id: 36067, name: '', icon: '' },
  { id: 67381, name: '', icon: '' },
  { id: 79638, name: '', icon: '' },
  { id: 79637, name: '', icon: '' },
  { id: 79690, name: '', icon: '' },
  { id: 76642, name: '', icon: '' },
  { id: 76131, name: '', icon: '' },
  { id: 71946, name: '', icon: '' },
  { id: 70732, name: '', icon: '' },
  { id: 89036, name: '', icon: '' },
  { id: 89051, name: '', icon: '' },
  { id: 88997, name: '', icon: '' },
  { id: 79684, name: '', icon: '' },
  { id: 24300, name: '', icon: '' },
  { id: 24277, name: '', icon: '' },
  { id: 24283, name: '', icon: '' },
  { id: 24289, name: '', icon: '' },
  { id: 24295, name: '', icon: '' },
  { id: 24358, name: '', icon: '' },
  { id: 24351, name: '', icon: '' },
  { id: 24357, name: '', icon: '' },
  { id: 36101, name: '', icon: '' },
  { id: 36106, name: '', icon: '' },
  { id: 36102, name: '', icon: '' },
  { id: 36103, name: '', icon: '' },
  { id: 67369, name: '', icon: '' },
  { id: 67380, name: '', icon: '' },
  { id: 36045, name: '', icon: '' },
  { id: 36047, name: '', icon: '' },
  { id: 36049, name: '', icon: '' },
  { id: 36062, name: '', icon: '' },
  { id: 36064, name: '', icon: '' },
  { id: 36066, name: '', icon: '' },
  { id: 67365, name: '', icon: '' },
  { id: 67383, name: '', icon: '' },
  { id: 76569, name: '', icon: '' },
  { id: 88998, name: '', icon: '' },
  { id: 89002, name: '', icon: '' },
  { id: 36109, name: '', icon: '' },
  { id: 36108, name: '', icon: '' },
  { id: 36107, name: '', icon: '' },
  { id: 36095, name: '', icon: '' },
  { id: 72113, name: '', icon: '' },
  { id: 92128, name: '', icon: '' },
  { id: 89065, name: '', icon: '' },
  { id: 79674, name: '', icon: '' },
  { id: 36069, name: '', icon: '' },
  { id: 36058, name: '', icon: '' },
  { id: 36072, name: '', icon: '' },
  { id: 85384, name: '', icon: '' },
  { id: 89071, name: '', icon: '' },
  { id: 24791, name: '', icon: '' },
  { id: 89007, name: '', icon: '' }
];

// Clave para localStorage
const HALLOWEEN_CALCULATOR_KEY = 'halloween_calculator_data';

const HalloweenPage = () => {
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [calculatorItems, setCalculatorItems] = useState<CalculatorItem[]>(() => {
    // Cargar datos guardados del localStorage al inicializar
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem(HALLOWEEN_CALCULATOR_KEY);
      if (savedData) {
        try {
          return JSON.parse(savedData);
        } catch (error) {
          console.error('Error loading saved calculator data:', error);
        }
      }
    }
    return [];
  });
  const [isLoadingCalculator, setIsLoadingCalculator] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [availableItems, setAvailableItems] = useState<CalculatorItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  // Función para guardar datos en localStorage
  const saveCalculatorData = useCallback((data: CalculatorItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(HALLOWEEN_CALCULATOR_KEY, JSON.stringify(data));
    }
  }, []);

  const allItemIds = useMemo(() => [
    ...candyCornItems.map(item => item.id)
  ], []);

  const fetchCalculatorData = useCallback(async () => {
    setIsLoadingCalculator(true);
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

      // Crear datos de calculadora
      const calculatorData: CalculatorItem[] = candyCornItems.map(item => {
        const itemInfo = itemsMap[item.id];
        const price = pricesMap[item.id];
        const sellPrice = price?.sells?.unit_price || 0;
        
        return {
          id: item.id,
          name: itemInfo?.name || item.name,
          quantity: 0, // Cantidad por defecto
          price100: sellPrice,
          price85: Math.ceil(sellPrice * 0.85),
          total100: 0,
          total85: 0
        };
      });

      setAvailableItems(calculatorData); // Guardar todos los items disponibles
      
      // Preservar los items existentes en la calculadora
      setCalculatorItems(prevItems => {
        const updatedItems = prevItems.map(existingItem => {
          const newItem = calculatorData.find(item => item.id === existingItem.id);
          if (newItem) {
            return {
              ...newItem,
              quantity: existingItem.quantity,
              total100: existingItem.quantity * newItem.price100,
              total85: Math.ceil(existingItem.quantity * newItem.price100 * 0.85)
            };
          }
          return existingItem;
        });
        
        // Guardar en localStorage
        saveCalculatorData(updatedItems);
        return updatedItems;
      });
    } catch (error) {
      console.error('Error fetching calculator data:', error);
    } finally {
      setIsLoadingCalculator(false);
    }
  }, [allItemIds, saveCalculatorData]);

  const fetchHalloweenData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Función simplificada - solo maneja el estado de carga
      // Los datos se obtienen en fetchCalculatorData
    } catch (error) {
      console.error('Error fetching Halloween data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedSection === 'calculators') {
      fetchHalloweenData();
      fetchCalculatorData();
    }
  }, [selectedSection, fetchHalloweenData, fetchCalculatorData]);

  const formatGoldSilverCopper = (copper: number) => {
    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const copperRemaining = copper % 100;
    
    return `${gold.toString().padStart(2, '0')}G ${silver.toString().padStart(2, '0')}S ${copperRemaining.toString().padStart(2, '0')}C`;
  };

  const updateItemQuantity = (id: number, quantity: number) => {
    setCalculatorItems(prev => {
      const updatedItems = prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            quantity,
            total100: item.price100 * quantity,
            total85: Math.ceil(item.price100 * quantity * 0.85)
          };
        }
        return item;
      });
      
      // Guardar en localStorage
      saveCalculatorData(updatedItems);
      return updatedItems;
    });
  };

  const addSelectedItems = () => {
    const itemsToAdd = availableItems.filter(item => selectedItems.has(item.id));
    setCalculatorItems(prev => {
      const existingIds = new Set(prev.map(item => item.id));
      const newItems = itemsToAdd.filter(item => !existingIds.has(item.id));
      const updatedItems = [...prev, ...newItems];
      
      // Guardar en localStorage
      saveCalculatorData(updatedItems);
      return updatedItems;
    });
    setSelectedItems(new Set());
    setShowItemModal(false);
  };

  const addAllItems = () => {
    setCalculatorItems(availableItems);
    saveCalculatorData(availableItems);
  };

  const removeItem = (id: number) => {
    setCalculatorItems(prev => {
      const updatedItems = prev.filter(item => item.id !== id);
      saveCalculatorData(updatedItems);
      return updatedItems;
    });
  };

  const removeAllItems = () => {
    setCalculatorItems([]);
    saveCalculatorData([]);
  };

  const filteredAvailableItems = availableItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



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
            {/* Botón Volver */}
            <div className="flex justify-start mb-4">
              <a
                href="/festivals"
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a Festivales
              </a>
            </div>
            
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
                        Calculadora Personalizada de Halloween
                      </h2>
                    </div>
                    <button
                      onClick={() => {
                        fetchHalloweenData();
                        fetchCalculatorData();
                      }}
                      disabled={isLoading || isLoadingCalculator}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading || isLoadingCalculator ? 'animate-spin' : ''}`} />
                      {isLoading || isLoadingCalculator ? 'Actualizando...' : 'Refrescar Datos'}
                    </button>
                  </div>

                  {/* Custom Calculator */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-orange-400" />
                      Calculadora de Materiales
                      <span className="ml-2 text-sm text-green-400 font-normal">
                        (Datos guardados automáticamente)
                      </span>
                    </h3>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-6">
                      <button
                        onClick={() => setShowItemModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar Items
                      </button>
                      <button
                        onClick={addAllItems}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                      >
                        <List className="w-4 h-4" />
                        Agregar Todo
                      </button>
                      {calculatorItems.length > 0 && (
                        <button
                          onClick={removeAllItems}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                          Eliminar Todo
                        </button>
                      )}
                    </div>
                    
                    {/* Calculator Table */}
                    {!isLoadingCalculator && calculatorItems.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-600">
                              <th className="text-left py-2 text-gray-300">Nombre</th>
                              <th className="text-center py-2 text-gray-300">Número</th>
                              <th className="text-center py-2 text-gray-300">Price 100%</th>
                              <th className="text-center py-2 text-gray-300">Price 85%</th>
                              <th className="text-center py-2 text-gray-300">Total 100%</th>
                              <th className="text-center py-2 text-gray-300">Total 85%</th>
                              <th className="text-center py-2 text-gray-300">Acción</th>
                            </tr>
                          </thead>
                          <tbody>
                            {calculatorItems.map((item) => (
                              <tr key={item.id} className="border-b border-gray-700">
                                <td className="py-2 text-white">{item.name}</td>
                                <td className="py-2 text-center">
                                  <input
                                    type="number"
                                    min="0"
                                    value={item.quantity}
                                    onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 0)}
                                    className="w-16 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-center"
                                  />
                                </td>
                                <td className="py-2 text-center text-gray-300">{formatGoldSilverCopper(item.price100)}</td>
                                <td className="py-2 text-center text-gray-300">{formatGoldSilverCopper(item.price85)}</td>
                                <td className="py-2 text-center text-green-400 font-semibold">{formatGoldSilverCopper(item.total100)}</td>
                                <td className="py-2 text-center text-yellow-400 font-semibold">{formatGoldSilverCopper(item.total85)}</td>
                                <td className="py-2 text-center">
                                  <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {!isLoadingCalculator && calculatorItems.length === 0 && (
                      <div className="text-center py-12 bg-gray-800/30 rounded-lg border border-gray-700">
                        <Package className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 mb-2">No hay items en la calculadora</p>
                        <p className="text-gray-500 text-sm">Usa los botones de arriba para agregar items</p>
                      </div>
                    )}

                    {isLoadingCalculator && (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto"></div>
                        <p className="text-gray-300 mt-2">Cargando datos de la API...</p>
                      </div>
                    )}
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

      {/* Item Selection Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">Seleccionar Items</h3>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Buscar items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Items Grid */}
              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {filteredAvailableItems.map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedItems.has(item.id)
                          ? 'bg-orange-600 border-orange-500'
                          : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={(e) => {
                          const newSelected = new Set(selectedItems);
                          if (e.target.checked) {
                            newSelected.add(item.id);
                          } else {
                            newSelected.delete(item.id);
                          }
                          setSelectedItems(newSelected);
                        }}
                        className="mr-3"
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">{item.name}</div>
                        <div className="text-gray-400 text-xs">{formatGoldSilverCopper(item.price100)}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
                <div className="text-gray-400 text-sm">
                  {selectedItems.size} items seleccionados
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowItemModal(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={addSelectedItems}
                    disabled={selectedItems.size === 0}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Agregar Seleccionados ({selectedItems.size})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HalloweenPage; 