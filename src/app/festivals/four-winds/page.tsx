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
  Wind,
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

// Items del Festival de los Cuatro Vientos
const fourWindsItems = [
  { id: 19725, name: 'Festival Token', icon: '' },
  { id: 19726, name: 'Festival Token', icon: '' },
  { id: 19727, name: 'Festival Token', icon: '' },
  { id: 19728, name: 'Festival Token', icon: '' },
  { id: 19729, name: 'Festival Token', icon: '' },
  { id: 19730, name: 'Festival Token', icon: '' },
  { id: 19731, name: 'Festival Token', icon: '' },
  { id: 19732, name: 'Festival Token', icon: '' },
  { id: 19733, name: 'Festival Token', icon: '' },
  { id: 19734, name: 'Festival Token', icon: '' },
  { id: 19735, name: 'Festival Token', icon: '' },
  { id: 19736, name: 'Festival Token', icon: '' },
  { id: 19737, name: 'Festival Token', icon: '' },
  { id: 19738, name: 'Festival Token', icon: '' },
  { id: 19739, name: 'Festival Token', icon: '' },
  { id: 19740, name: 'Festival Token', icon: '' },
  { id: 19741, name: 'Festival Token', icon: '' },
  { id: 19742, name: 'Festival Token', icon: '' },
  { id: 19743, name: 'Festival Token', icon: '' },
  { id: 19744, name: 'Festival Token', icon: '' },
  { id: 19745, name: 'Festival Token', icon: '' },
  { id: 19746, name: 'Festival Token', icon: '' },
  { id: 19747, name: 'Festival Token', icon: '' },
  { id: 19748, name: 'Festival Token', icon: '' },
  { id: 19749, name: 'Festival Token', icon: '' },
  { id: 19750, name: 'Festival Token', icon: '' },
  { id: 19751, name: 'Festival Token', icon: '' },
  { id: 19752, name: 'Festival Token', icon: '' },
  { id: 19753, name: 'Festival Token', icon: '' },
  { id: 19754, name: 'Festival Token', icon: '' },
  { id: 19755, name: 'Festival Token', icon: '' },
  { id: 19756, name: 'Festival Token', icon: '' },
  { id: 19757, name: 'Festival Token', icon: '' },
  { id: 19758, name: 'Festival Token', icon: '' },
  { id: 19759, name: 'Festival Token', icon: '' },
  { id: 19760, name: 'Festival Token', icon: '' },
  { id: 19761, name: 'Festival Token', icon: '' },
  { id: 19762, name: 'Festival Token', icon: '' },
  { id: 19763, name: 'Festival Token', icon: '' },
  { id: 19764, name: 'Festival Token', icon: '' },
  { id: 19765, name: 'Festival Token', icon: '' },
  { id: 19766, name: 'Festival Token', icon: '' },
  { id: 19767, name: 'Festival Token', icon: '' },
  { id: 19768, name: 'Festival Token', icon: '' },
  { id: 19769, name: 'Festival Token', icon: '' },
  { id: 19770, name: 'Festival Token', icon: '' },
  { id: 19771, name: 'Festival Token', icon: '' },
  { id: 19772, name: 'Festival Token', icon: '' },
  { id: 19773, name: 'Festival Token', icon: '' },
  { id: 19774, name: 'Festival Token', icon: '' },
  { id: 19775, name: 'Festival Token', icon: '' },
  { id: 19776, name: 'Festival Token', icon: '' },
  { id: 19777, name: 'Festival Token', icon: '' },
  { id: 19778, name: 'Festival Token', icon: '' },
];

const FourWindsPage = () => {
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const [selectedItems, setSelectedItems] = useState<CalculatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showItemModal, setShowItemModal] = useState(false);
  const [availableItems, setAvailableItems] = useState<CalculatorItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalSelectedItems, setModalSelectedItems] = useState<Set<number>>(new Set());

  // Función para formatear moneda GW2
  const formatGoldSilverCopper = (copper: number) => {
    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const copperRemaining = copper % 100;
    
    return `${gold.toString().padStart(2, '0')}G ${silver.toString().padStart(2, '0')}S ${copperRemaining.toString().padStart(2, '0')}C`;
  };



  // Función para actualizar cantidad de item
  const updateItemQuantity = (id: number, quantity: number) => {
    setSelectedItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity, total100: item.price100 * quantity, total85: item.price85 * quantity } : item
      )
    );
  };

  // Función para agregar items seleccionados del modal
  const addSelectedItems = () => {
    const itemsToAdd = availableItems.filter(item => modalSelectedItems.has(item.id));
    setSelectedItems(prev => {
      const existingIds = new Set(prev.map(item => item.id));
      const newItems = itemsToAdd.filter(item => !existingIds.has(item.id));
      return [...prev, ...newItems];
    });
    setModalSelectedItems(new Set());
    setShowItemModal(false);
  };

  // Función para agregar todos los items
  const addAllItems = () => {
    setSelectedItems(availableItems);
  };

  // Items filtrados para el modal
  const filteredAvailableItems = useMemo(() => 
    availableItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [availableItems, searchTerm]
  );

  // Función para remover item
  const removeItem = (id: number) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  // Función para remover todos los items
  const removeAllItems = () => {
    setSelectedItems([]);
  };

  // Función para obtener precios de la API
  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      const itemIds = fourWindsItems.map(item => item.id).join(',');
      
      const [pricesResponse, itemsResponse] = await Promise.all([
        fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${itemIds}`),
        fetch(`https://api.guildwars2.com/v2/items?ids=${itemIds}`)
      ]);

      if (pricesResponse.ok && itemsResponse.ok) {
        const pricesData: Gw2Price[] = await pricesResponse.json();
        const itemsData: Gw2Item[] = await itemsResponse.json();

        const pricesMap: Record<number, Gw2Price> = {};
        const itemsMap: Record<number, Gw2Item> = {};

        pricesData.forEach(price => {
          pricesMap[price.id] = price;
        });

        itemsData.forEach(item => {
          itemsMap[item.id] = item;
        });

        // Crear datos de calculadora para availableItems
        const calculatorData: CalculatorItem[] = fourWindsItems
          .filter(item => itemsMap[item.id] && pricesMap[item.id])
          .map(item => ({
            id: item.id,
            name: itemsMap[item.id].name,
            quantity: 0,
            price100: pricesMap[item.id].sells.unit_price,
            price85: Math.floor(pricesMap[item.id].sells.unit_price * 0.85),
            total100: 0,
            total85: 0
          }));

        setAvailableItems(calculatorData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-blue-900">
      <Navigation />
      
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
          
          <div className="flex items-center justify-center mb-4">
            <Wind className="w-12 h-12 text-cyan-400 mr-3" />
            <h1 className="text-4xl font-bold text-white">Festival de los Cuatro Vientos</h1>
          </div>
                     <p className="text-xl text-gray-300">
             Calculadoras y análisis para maximizar tus ganancias durante el Festival de los Cuatro Vientos
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
                  ? 'bg-cyan-600 text-white'
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
                  <Info className="w-6 h-6 mr-3 text-cyan-400" />
                  Festival de los Cuatro Vientos
                </h2>
                <p className="text-gray-300 mb-6">
                  El Festival de los Cuatro Vientos es un evento anual que celebra la diversidad cultural de Tyria. 
                  Con actividades como Queen&apos;s Gauntlet y Boss Blitz, ofrece oportunidades únicas para obtener 
                  recompensas valiosas y materiales exclusivos.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Queen&apos;s Gauntlet</h3>
                    <p className="text-gray-300 text-sm">
                      Una serie de desafíos de combate que recompensan con tokens únicos y 
                      materiales valiosos. Requiere habilidad y estrategia.
                    </p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Boss Blitz</h3>
                    <p className="text-gray-300 text-sm">
                      Evento cooperativo donde equipos compiten para derrotar jefes rápidamente. 
                      Recompensas basadas en velocidad y eficiencia.
                    </p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Festival Tokens</h3>
                    <p className="text-gray-300 text-sm">
                      Moneda principal del festival. Se pueden intercambiar por items únicos 
                      y materiales valiosos en los comerciantes del festival.
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
                    <Calculator className="w-6 h-6 mr-3 text-cyan-400" />
                    <h2 className="text-2xl font-bold text-white">
                      Calculadora Personalizada de Four Winds
                    </h2>
                  </div>
                  <button
                    onClick={fetchPrices}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Actualizando...' : 'Refrescar Datos'}
                  </button>
                </div>

                {/* Custom Calculator */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-cyan-400" />
                    Calculadora de Materiales
                  </h3>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={() => setShowItemModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors duration-200"
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
                    {selectedItems.length > 0 && (
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
                  {!loading && selectedItems.length > 0 && (
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
                          {selectedItems.map((item) => (
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
                        <tfoot className="border-t border-cyan-500">
                          <tr>
                            <td colSpan={4} className="py-2 text-right text-gray-300 font-semibold">Total:</td>
                                                         <td className="py-2 text-center text-green-400 font-semibold">
                               {formatGoldSilverCopper(selectedItems.reduce((sum, item) => sum + item.total100, 0))}
                             </td>
                             <td className="py-2 text-center text-yellow-400 font-semibold">
                               {formatGoldSilverCopper(selectedItems.reduce((sum, item) => sum + item.total85, 0))}
                             </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
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
                  <TrendingUp className="w-6 h-6 mr-3 text-cyan-400" />
                  Estrategias de Farming
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Queen&apos;s Gauntlet</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Desafíos Progresivos</h4>
                          <p className="text-gray-300 text-sm">Comienza con los desafíos más fáciles y progresa gradualmente.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Builds Optimizadas</h4>
                          <p className="text-gray-300 text-sm">Usa builds específicas para cada tipo de desafío.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Recompensas Únicas</h4>
                          <p className="text-gray-300 text-sm">Los desafíos más difíciles ofrecen tokens y materiales exclusivos.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Boss Blitz</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Coordinación de Equipo</h4>
                          <p className="text-gray-300 text-sm">Forma grupos coordinados para maximizar la velocidad de derrota.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Rutas Eficientes</h4>
                          <p className="text-gray-300 text-sm">Planifica rutas que minimicen el tiempo de viaje entre jefes.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Timing Perfecto</h4>
                          <p className="text-gray-300 text-sm">Los mejores momentos son durante las horas pico del servidor.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consejos de Farming */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-white mb-4">Consejos de Farming</h3>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• Prioriza Queen&apos;s Gauntlet para recompensas únicas</li>
                      <li>• Forma grupos para Boss Blitz más rápido</li>
                      <li>• Acumula Festival Tokens para intercambios masivos</li>
                      <li>• Monitorea los precios de los materiales exclusivos</li>
                      <li>• Participa en eventos especiales durante el festival</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

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
                        modalSelectedItems.has(item.id)
                          ? 'bg-cyan-600 border-cyan-500'
                          : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={modalSelectedItems.has(item.id)}
                        onChange={(e) => {
                          const newSelected = new Set(modalSelectedItems);
                          if (e.target.checked) {
                            newSelected.add(item.id);
                          } else {
                            newSelected.delete(item.id);
                          }
                          setModalSelectedItems(newSelected);
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
                  {modalSelectedItems.size} items seleccionados
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
                    disabled={modalSelectedItems.size === 0}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Agregar Seleccionados ({modalSelectedItems.size})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FourWindsPage; 