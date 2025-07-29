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
  Hammer,
  Wrench,
  Scissors,
  Palette,
  Beaker,
  Shield,
  Sword,
  Gem,
  Loader2
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
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const [conversionData, setConversionData] = useState<ConversionItem[]>([]);
  const [isLoadingConversions, setIsLoadingConversions] = useState(false);

  // Materiales T6 de la imagen con sus IDs de GW2
  const t6Materials = useMemo(() => [
    { id: 24295, name: 'Vial of Powerful Blood', t5Id: 24294 },
    { id: 24358, name: 'Ancient Bone', t5Id: 24356 },
    { id: 24351, name: 'Vicious Claw', t5Id: 24350 },
    { id: 24357, name: 'Vicious Fang', t5Id: 24356 },
    { id: 24289, name: 'Armored Scale', t5Id: 24288 },
    { id: 24300, name: 'Elaborate Totem', t5Id: 24299 },
    { id: 24283, name: 'Powerful Venom Sac', t5Id: 24282 },
  ], []);

  // Materiales para conversión T5 a T6
  const conversionMaterials = useMemo(() => ({
    ectoplasm: 19721, // Glob of Ectoplasm (al 90%/1.85)
  }), []);

  const allConversionItemIds = useMemo(() => [
    ...t6Materials.map(m => m.id),
    ...t6Materials.map(m => m.t5Id),
    ...Object.values(conversionMaterials),
  ], [t6Materials, conversionMaterials]);

  const fetchConversionCalculations = useCallback(async () => {
    setIsLoadingConversions(true);
    try {
      // Obtener precios de la API de GW2
      const pricesResponse = await fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${allConversionItemIds.join(',')}`);
      const prices = await pricesResponse.json();
      
      // Obtener detalles de los items (nombres e iconos)
      const itemsResponse = await fetch(`https://api.guildwars2.com/v2/items?ids=${allConversionItemIds.join(',')}`);
      const items = await itemsResponse.json();

      // Crear mapa de precios y items
      const pricesMap = prices.reduce((acc: Record<number, Gw2Price>, price: Gw2Price) => {
        acc[price.id] = price;
        return acc;
      }, {} as Record<number, Gw2Price>);

      const itemsMap = items.reduce((acc: Record<number, Gw2Item>, item: Gw2Item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<number, Gw2Item>);

      // Obtener precio del Ectoplasm al 90%/1.85
      const ectoplasmPrice = pricesMap[conversionMaterials.ectoplasm]?.sells?.unit_price || 0;
      const ectoplasmPrice90 = Math.round(ectoplasmPrice * 0.90 / 1.85); // 90% del precio / 1.85

      const calculatedConversions: ConversionItem[] = t6Materials.map(t6 => {
        const t5BuyPrice = pricesMap[t6.t5Id]?.buys?.unit_price || 0; // Precio de compra del T5
        const t6SellPrice = pricesMap[t6.id]?.sells?.unit_price || 0;

        const ectoplasmCost = ectoplasmPrice90 * 200; // Ectoplasm al 90%/1.85 * 200
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
          precio90: Math.round(t6SellPrice * 0.90),
          precio85: Math.round(t6SellPrice * 0.85),
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
  }, [allConversionItemIds, conversionMaterials.ectoplasm, t6Materials]);

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
    if (profit > 11000) return 'bg-green-600'; // > 1.1 Gold
    if (profit > 7000) return 'bg-green-500';  // > 0.7 Gold
    if (profit > 3500) return 'bg-yellow-500'; // > 0.35 Gold
    if (profit > 0) return 'bg-orange-500';   // > 0 Gold
    return 'bg-red-600';                    // Pérdida
  };

  const craftingProfessions = [
    {
      id: 'weaponsmith',
      name: 'Weaponsmith',
      icon: Sword,
      color: 'from-red-500 to-orange-600',
      description: 'Crea armas de metal y algunos objetos especiales',
      specialties: ['Espadas', 'Hachas', 'Martillos', 'Lanzas'],
      level: '0-500'
    },
    {
      id: 'armorsmith',
      name: 'Armorsmith',
      icon: Shield,
      color: 'from-blue-500 to-cyan-600',
      description: 'Crea armadura pesada y objetos de metal',
      specialties: ['Armadura pesada', 'Objetos de metal', 'Herramientas'],
      level: '0-500'
    },
    {
      id: 'leatherworker',
      name: 'Leatherworker',
      icon: Package,
      color: 'from-brown-500 to-yellow-600',
      description: 'Crea armadura media y objetos de cuero',
      specialties: ['Armadura media', 'Objetos de cuero', 'Bolsas'],
      level: '0-500'
    },
    {
      id: 'tailor',
      name: 'Tailor',
      icon: Scissors,
      color: 'from-purple-500 to-pink-600',
      description: 'Crea armadura ligera y objetos de tela',
      specialties: ['Armadura ligera', 'Tela', 'Bolsas'],
      level: '0-500'
    },
    {
      id: 'jeweler',
      name: 'Jeweler',
      icon: Gem,
      color: 'from-yellow-500 to-amber-600',
      description: 'Crea joyas y objetos de cristal',
      specialties: ['Anillos', 'Pendientes', 'Amuletos', 'Cristales'],
      level: '0-500'
    },
    {
      id: 'cook',
      name: 'Cook',
      icon: Beaker,
      color: 'from-green-500 to-emerald-600',
      description: 'Crea comida y bebidas para buffs',
      specialties: ['Comida', 'Bebidas', 'Buffos temporales'],
      level: '0-400'
    },
    {
      id: 'artificer',
      name: 'Artificer',
      icon: Palette,
      color: 'from-indigo-500 to-purple-600',
      description: 'Crea objetos mágicos y algunos objetos especiales',
      specialties: ['Objetos mágicos', 'Cristales', 'Pociones'],
      level: '0-500'
    },
    {
      id: 'huntsman',
      name: 'Huntsman',
      icon: Wrench,
      color: 'from-teal-500 to-blue-600',
      description: 'Crea armas de madera y algunos objetos especiales',
      specialties: ['Arcos', 'Rifles', 'Pistolas', 'Objetos de madera'],
      level: '0-500'
    }
  ];

  const materialTiers = [
    {
      tier: 'T1',
      name: 'Básico',
      materials: ['Cobre', 'Madera verde', 'Cuero crudo', 'Lino'],
      color: 'from-gray-400 to-gray-600'
    },
    {
      tier: 'T2',
      name: 'Fino',
      materials: ['Bronce', 'Madera suave', 'Cuero fino', 'Yute'],
      color: 'from-green-400 to-green-600'
    },
    {
      tier: 'T3',
      name: 'Maestro',
      materials: ['Hierro', 'Madera seca', 'Cuero grueso', 'Lana'],
      color: 'from-blue-400 to-blue-600'
    },
    {
      tier: 'T4',
      name: 'Raro',
      materials: ['Acero', 'Madera madura', 'Cuero duro', 'Algodón'],
      color: 'from-purple-400 to-purple-600'
    },
    {
      tier: 'T5',
      name: 'Exótico',
      materials: ['Mithril', 'Madera antigua', 'Cuero endurecido', 'Seda'],
      color: 'from-orange-400 to-orange-600'
    },
    {
      tier: 'T6',
      name: 'Ascendido',
      materials: ['Oricalco', 'Madera ancestral', 'Cuero templado', 'Gossamer'],
      color: 'from-red-400 to-red-600'
    }
  ];

  const craftingTips = [
    {
      title: 'Nivelación Eficiente',
      description: 'Craftea items que puedas vender para recuperar costos mientras subes de nivel',
      icon: TrendingUp,
      color: 'text-green-400'
    },
    {
      title: 'Materiales Baratos',
      description: 'Compra materiales en momentos de baja demanda para ahorrar oro',
      icon: Coins,
      color: 'text-yellow-400'
    },
    {
      title: 'Recetas Rentables',
      description: 'Enfócate en recetas que tengan buena demanda en el Trading Post',
      icon: BarChart3,
      color: 'text-blue-400'
    },
    {
      title: 'Conversiones',
      description: 'Convierte materiales de tier inferior a superior cuando sea rentable',
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
              Guía de Crafting
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Todo lo que necesitas saber sobre crafting en Guild Wars 2. 
              Desde profesiones hasta estrategias de ganancia.
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
              { id: 'professions', label: 'Profesiones', icon: Hammer },
              { id: 'materials', label: 'Materiales', icon: Package },
              { id: 'strategies', label: 'Estrategias', icon: TrendingUp },
              { id: 'conversions', label: 'Conversiones', icon: RefreshCw }
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
                    ¿Qué es el Crafting?
                  </h2>
                  <p className="text-gray-300 mb-4">
                    El crafting en Guild Wars 2 es una forma de crear objetos, armas, armadura y consumibles. 
                    Es una excelente manera de ganar oro y obtener items para tu personaje.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Ventajas del Crafting</h3>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Crear items para uso personal</li>
                        <li>• Vender items en el Trading Post</li>
                        <li>• Completar colecciones y logros</li>
                        <li>• Obtener experiencia de nivel</li>
                      </ul>
                    </div>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                      <h3 className="text-white font-semibold mb-2">Consejos Básicos</h3>
                      <ul className="text-gray-300 text-sm space-y-1">
                        <li>• Comienza con una profesión que te guste</li>
                        <li>• Compra materiales cuando estén baratos</li>
                        <li>• Verifica precios antes de craftear</li>
                        <li>• Usa calculadoras de ganancia</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Professions Section */}
            {selectedSection === 'professions' && (
              <div className="space-y-8">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Hammer className="w-6 h-6 mr-3 text-orange-400" />
                    Profesiones de Crafting
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {craftingProfessions.map((profession) => (
                      <div key={profession.id} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${profession.color} rounded-lg flex items-center justify-center`}>
                            <profession.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold">{profession.name}</h3>
                            <p className="text-gray-400 text-xs">{profession.level}</p>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm mb-3">{profession.description}</p>
                        <div>
                          <h4 className="text-gray-400 text-xs font-semibold mb-1">Especialidades:</h4>
                          <div className="flex flex-wrap gap-1">
                            {profession.specialties.map((specialty, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-600 rounded text-xs text-gray-300">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
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
                    Tiers de Materiales
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
                    Estrategias de Ganancia
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
                    Consejos Avanzados
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Análisis de Mercado</h4>
                          <p className="text-gray-300 text-sm">Monitorea los precios del Trading Post para identificar oportunidades de crafting rentable.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Timing de Compra</h4>
                          <p className="text-gray-300 text-sm">Compra materiales cuando los precios estén bajos, especialmente después de eventos.</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Conversiones Rentables</h4>
                          <p className="text-gray-300 text-sm">Convierte materiales de tier inferior a superior cuando la diferencia de precio sea favorable.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Especialización</h4>
                          <p className="text-gray-300 text-sm">Enfócate en una o dos profesiones para maximizar tu eficiencia y ganancias.</p>
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
                        Conversiones de Materiales T6
                      </h2>
                    </div>
                    <button
                      onClick={fetchConversionCalculations}
                      disabled={isLoadingConversions}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoadingConversions ? 'animate-spin' : ''}`} />
                      {isLoadingConversions ? 'Actualizando...' : 'Refrescar Datos'}
                    </button>
                  </div>
                  <p className="text-gray-400 mb-6">
                    Calcula la rentabilidad de convertir materiales de Tier 5 a Tier 6 a través de la Forja Mística.
                    Los precios se actualizan en tiempo real desde la API de Guild Wars 2.
                  </p>
                  

                  {isLoadingConversions ? (
                    <div className="flex justify-center items-center h-48">
                      <Loader2 className="animate-spin text-blue-400" size={48} />
                      <p className="ml-4 text-white text-lg">Cargando datos de conversiones...</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
                        <thead className="bg-gray-600">
                          <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200">Material</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200">Precio 90%</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200">Precio 85%</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200">Coste Conv 20</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200">Profit SS 90% T6</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200">Profit SS 85% T6</th>
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
            className="mt-12 text-center"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-2">¿Listo para empezar?</h3>
              <p className="text-purple-100 mb-4">
                Usa nuestras calculadoras para encontrar las mejores oportunidades de crafting
              </p>
              <button className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Ir a Calculadoras
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CraftingPage; 