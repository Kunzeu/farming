'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
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
  ArrowLeft,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
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
  icon?: string;
  quantity: number;
  price100: number;
  price85: number;
  total100: number;
  total85: number;
}

const candyCornItems = [
  { id: 36059, name: '', icon: '' }, // Plastic Fangs
  { id: 36060, name: '', icon: '' }, // Chattering Skull
  { id: 36061, name: '', icon: '' }, // Nougat Center
  { id: 36076, name: '', icon: '' }, // Strawberry Ghost
  { id: 36074, name: '', icon: '' }, // Bowl of Candy Corn Custard
  { id: 36041, name: '', icon: '' }, // Piece of Candy Corn
  { id: 67379, name: '', icon: '' }, // Bottle of Batwing Brew
  { id: 36084, name: '', icon: '' }, // Spicy Pumpkin Cookie
  { id: 36081, name: '', icon: '' }, // Glazed Peach Tart
  { id: 67371, name: '', icon: '' }, // Flask of Pumpkin Oil
  { id: 67367, name: '', icon: '' }, // Lump of Crystallized Nougat
  { id: 67368, name: '', icon: '' }, // Sharpening Skull
  { id: 36080, name: '', icon: '' }, // Glazed Pear Tart
  { id: 79679, name: '', icon: '' }, // Hellfire Skeleton Tonic
  { id: 79673, name: '', icon: '' }, // Gargoyle Tonic
  { id: 79677, name: '', icon: '' }, // Shadow Raven Tonic
  { id: 67386, name: '', icon: '' }, // Unopened Endless Bottle of Batwing Brew
  { id: 67382, name: '', icon: '' }, // Recipe: Sharpening Skull
  { id: 67366, name: '', icon: '' }, // Recipe: Pumpkin Oil
  { id: 79647, name: '', icon: '' }, // Polyluminescent Undulating Refractor (Teal)
  { id: 67370, name: '', icon: '' }, // Polyluminescent Undulating Refractor (Green)
  { id: 67372, name: '', icon: '' }, // Polyluminescent Undulating Refractor (Orange)
  { id: 67375, name: '', icon: '' }, // Polyluminescent Undulating Refractor (Black)
  { id: 71931, name: '', icon: '' }, // Karka Helm Skin
  { id: 48807, name: '', icon: '' }, // Gibbering Skull
  { id: 48805, name: '', icon: '' }, // High-Quality Plastic Fangs
  { id: 48806, name: '', icon: '' }, // Tyria's Best Nougat Center
  { id: 36046, name: '', icon: '' }, // Recipe: Superior Rune of the Mad King
  { id: 36048, name: '', icon: '' }, // Recipe: Superior Rune of the Mad King
  { id: 36050, name: '', icon: '' }, // Recipe: Superior Rune of the Mad King
  { id: 36063, name: '', icon: '' }, // Recipe: Superior Sigil of the Night
  { id: 36065, name: '', icon: '' }, // Recipe: Superior Sigil of the Night
  { id: 36067, name: '', icon: '' }, // Recipe: Superior Sigil of the Night
  { id: 67381, name: '', icon: '' }, // Recipe: Maize Balm
  { id: 79638, name: '', icon: '' }, // Jailbroken
  { id: 79637, name: '', icon: '' }, // Grim Pact
  { id: 79690, name: '', icon: '' }, // Onus
  { id: 76642, name: '', icon: '' }, // Vassago
  { id: 76131, name: '', icon: '' }, // Pumpkin Smasher
  { id: 71946, name: '', icon: '' }, // Nest
  { id: 70732, name: '', icon: '' }, // Nightwing
  { id: 89036, name: '', icon: '' }, // The Cure
  { id: 89051, name: '', icon: '' }, // Revenge
  { id: 88997, name: '', icon: '' }, // Soul Conductor
  { id: 79684, name: '', icon: '' }, // Mini Charles the Hellfire Skeleton
  { id: 24300, name: '', icon: '' }, // Elaborate Totem
  { id: 24277, name: '', icon: '' }, // Pile of Crystalline Dust
  { id: 24283, name: '', icon: '' }, // Powerful Venom Sac
  { id: 24289, name: '', icon: '' }, // Armored Scale
  { id: 24295, name: '', icon: '' }, // Vial of Powerful Blood
  { id: 24358, name: '', icon: '' }, // Ancient Bone
  { id: 24351, name: '', icon: '' }, // Vicious Claw
  { id: 24357, name: '', icon: '' }, // Vicious Fang
  { id: 36101, name: '', icon: '' }, // Recipe: Candy Corn Almond Brittle
  { id: 36106, name: '', icon: '' }, // Endless Halloween Tonic
  { id: 36102, name: '', icon: '' }, // Recipe: Strawberry Ghost
  { id: 36103, name: '', icon: '' }, // Recipe: Candy Corn Custard
  { id: 67369, name: '', icon: '' }, // Recipe: Crystallized Nougat
  { id: 67380, name: '', icon: '' }, // Recipe: Batwing Brew
  { id: 36045, name: '', icon: '' }, // Recipe: Major Rune of the Mad King
  { id: 36047, name: '', icon: '' }, // Recipe: Major Rune of the Mad King
  { id: 36049, name: '', icon: '' }, // Recipe: Major Rune of the Mad King
  { id: 36062, name: '', icon: '' }, // Recipe: Major Sigil of the Night
  { id: 36064, name: '', icon: '' }, // Recipe: Major Sigil of the Night
  { id: 36066, name: '', icon: '' }, // Recipe: Major Sigil of the Night
  { id: 67365, name: '', icon: '' }, // Mini Zuzu, Cat of Darkness
  { id: 67383, name: '', icon: '' }, // Old Pillowcase
  { id: 76569, name: '', icon: '' }, // Mini Devil Dog
  { id: 88998, name: '', icon: '' }, // Mini Pumpkin Jack
  { id: 89002, name: '', icon: '' }, // Soul Pastry
  { id: 36109, name: '', icon: '' }, // Candy Corn Tonic
  { id: 36108, name: '', icon: '' }, // Plastic Spider Tonic
  { id: 36107, name: '', icon: '' }, // Concentrating Halloween Tonic
  { id: 36095, name: '', icon: '' }, // Minor Potion of Halloween Slaying
  { id: 72113, name: '', icon: '' }, // Festive Transom
  { id: 92128, name: '', icon: '' }, // Royal Flame Weapon Coffer
  { id: 89065, name: '', icon: '' }, // Ember Infusion
  { id: 79674, name: '', icon: '' }, // Phospholuminescent Infusion
  { id: 36069, name: '', icon: '' }, // Gift of the Moon
  { id: 36058, name: '', icon: '' }, // Gift of Spiders
  { id: 36072, name: '', icon: '' }, // Gift of Souls
  { id: 85384, name: '', icon: '' }, // Touch of Madness
  { id: 89071, name: '', icon: '' }, // Polysaturating Reverberating Infusion (Red)
  { id: 24791, name: '', icon: '' }, // Superior Rune of the Wurm
  { id: 89007, name: '', icon: '' }, // Polysaturating Reverberating Infusion (Gray)
  { id: 36038, name: '', icon: '' }  // Trick-or-Treat Bag
];

// Clave para localStorage
const HALLOWEEN_CALCULATOR_KEY = 'halloween_calculator_data';

import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';

const HalloweenPage = () => {
  usePageTitle('Halloween Festival');
  const { t, lang } = useI18n();
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
  
  // Estado para manejar inputs como strings durante la escritura
  const [inputValues, setInputValues] = useState<Record<number, string>>({});
  
  // Estados para ordenamiento
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
      const pricesResponse = await fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${allItemIds.join(',')}&lang=${lang}`);
      const prices = await pricesResponse.json();
      
      // Obtener detalles de los items
      const itemsResponse = await fetch(`https://api.guildwars2.com/v2/items?ids=${allItemIds.join(',')}&lang=${lang}`);
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
          icon: itemInfo?.icon || '',
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
  }, [allItemIds, saveCalculatorData, lang]);

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
    
    // Limpiar el valor de input temporal cuando se actualiza el estado
    setInputValues(prev => {
      const newValues = { ...prev };
      delete newValues[id];
      return newValues;
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

  // Función para manejar el ordenamiento
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Función para obtener el icono de ordenamiento
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4" />;
    }
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  // Función para ordenar los items
  const sortedCalculatorItems = useMemo(() => {
    return [...calculatorItems].sort((a, b) => {
      let aValue: string | number = a[sortField as keyof CalculatorItem] as string | number;
      let bValue: string | number = b[sortField as keyof CalculatorItem] as string | number;
      
      // Para campos numéricos, convertir a número
      if (['quantity', 'price100', 'price85', 'total100', 'total85'].includes(sortField)) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      
      // Para campos de texto, convertir a minúsculas
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }, [calculatorItems, sortField, sortDirection]);

  const filteredAvailableItems = availableItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <>
      <Navigation />
      <div 
        className="min-h-screen relative"
        style={{
          backgroundImage: 'url(/images/backgrounds/Halloween.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Overlay oscuro para mejorar la legibilidad */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        {/* Contenido principal */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8">
            {/* Botón Volver */}
            <div className="flex justify-start mb-4">
              <a
                href="/festivals"
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200">
                <ArrowLeft className="w-4 h-4" />
                {t('nav.backToFestivals')}
              </a>
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <span className="text-3xl mr-3">🎃</span>
              {t('festival.halloween')}
            </h1>
            <p className="text-xl text-gray-300">
              {t('festivals.page.subtitle').replace('{name}', t('festival.halloween'))}
            </p>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-8">
            {([
              { id: 'overview', label: t('festivals.tabs.overview'), icon: Info },
              { id: 'calculators', label: t('festivals.tabs.calculators'), icon: Calculator },
              { id: 'strategies', label: t('festivals.tabs.strategies'), icon: TrendingUp }
            ] as const).map((tab) => (
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
                <div className="bg-gray-900/80 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <Info className="w-6 h-6 mr-3 text-orange-400" />
                    {t('festival.halloween')}
                  </h2>
                  <p className="text-gray-200 mb-6">{t('halloween.overview.p1')}</p>
                
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-800/70 rounded-lg p-4 border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                      <h3 className="text-white font-semibold mb-2">{t('halloween.cards.bags.title')}</h3>
                      <p className="text-gray-200 text-sm">{t('halloween.cards.bags.desc')}</p>
                    </div>
                    <div className="bg-gray-800/70 rounded-lg p-4 border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                      <h3 className="text-white font-semibold mb-2">{t('halloween.cards.lab.title')}</h3>
                      <p className="text-gray-200 text-sm">{t('halloween.cards.lab.desc')}</p>
                    </div>
                    <div className="bg-gray-800/70 rounded-lg p-4 border border-orange-500/20 hover:border-orange-500/40 transition-colors">
                      <h3 className="text-white font-semibold mb-2">{t('halloween.cards.corn.title')}</h3>
                      <p className="text-gray-200 text-sm">{t('halloween.cards.corn.desc')}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Calculators Section */}
            {selectedSection === 'calculators' && (
              <div className="space-y-8">
                <div className="bg-gray-900/80 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <Calculator className="w-6 h-6 mr-3 text-orange-400" />
                      <h2 className="text-2xl font-bold text-white">{t('halloween.calculator.title')}</h2>
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
                        {isLoading || isLoadingCalculator ? t('common.updating') : t('common.refreshData')}
                    </button>
                  </div>

                  {/* Custom Calculator */}
                  <div className="mb-8">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-orange-400" />
                        {t('halloween.calculator.materials')}
                        <span className="ml-2 text-sm text-green-400 font-normal">{t('halloween.calculator.autoSave')}</span>
                    </h3>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-6">
                        <button
                        onClick={() => setShowItemModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
                      >
                        <Plus className="w-4 h-4" />
                          {t('common.addItems')}
                      </button>
                        <button
                        onClick={addAllItems}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                      >
                        <List className="w-4 h-4" />
                          {t('common.addAll')}
                      </button>
                      {calculatorItems.length > 0 && (
                        <button
                          onClick={removeAllItems}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                        >
                          <X className="w-4 h-4" />
                          {t('common.removeAll')}
                        </button>
                      )}
                    </div>
                    
                    {/* Calculator Table */}
                    {!isLoadingCalculator && calculatorItems.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-600">
                              <th 
                                className="text-left py-2 text-gray-300 cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('name')}
                              >
                                <div className="flex items-center gap-1">
                                   {t('table.name')}
                                  {getSortIcon('name')}
                                </div>
                              </th>
                              <th 
                                className="text-center py-2 text-gray-300 cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('quantity')}
                              >
                                <div className="flex items-center justify-center gap-1">
                                   {t('table.quantity')}
                                  {getSortIcon('quantity')}
                                </div>
                              </th>
                              <th 
                                className="text-center py-2 text-gray-300 cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('price100')}
                              >
                                <div className="flex items-center justify-center gap-1">
                                   {t('table.price100')}
                                  {getSortIcon('price100')}
                                </div>
                              </th>
                              <th 
                                className="text-center py-2 text-gray-300 cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('price85')}
                              >
                                <div className="flex items-center justify-center gap-1">
                                   {t('table.price85')}
                                  {getSortIcon('price85')}
                                </div>
                              </th>
                              <th 
                                className="text-center py-2 text-gray-300 cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('total100')}
                              >
                                <div className="flex items-center justify-center gap-1">
                                   {t('table.total100')}
                                  {getSortIcon('total100')}
                                </div>
                              </th>
                              <th 
                                className="text-center py-2 text-gray-300 cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('total85')}
                              >
                                <div className="flex items-center justify-center gap-1">
                                   {t('table.total85')}
                                  {getSortIcon('total85')}
                                </div>
                              </th>
                              <th className="text-center py-2 text-gray-300">{t('table.action')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedCalculatorItems.map((item) => (
                              <tr key={item.id} className="border-b border-gray-700">
                                <td className="py-2 text-white">
                                  <div className="flex items-center gap-2">
                                    {item.icon && (
                                      <Image
                                        src={item.icon}
                                        alt={item.name}
                                        width={28}
                                        height={28}
                                        className="rounded border border-gray-600"
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                      />
                                    )}
                                    <span>{item.name}</span>
                                  </div>
                                </td>
                                <td className="py-2 text-center">
                                  <input
                                    type="number"
                                    min="0"
                                    value={inputValues[item.id] !== undefined ? inputValues[item.id] : item.quantity.toString()}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      
                                      // Actualizar el valor temporal del input
                                      setInputValues(prev => ({
                                        ...prev,
                                        [item.id]: value
                                      }));
                                      
                                      // Si el campo está vacío, usar 0
                                      if (value === '') {
                                        updateItemQuantity(item.id, 0);
                                      } else {
                                        const numValue = parseInt(value);
                                        // Solo actualizar si es un número válido
                                        if (!isNaN(numValue)) {
                                          updateItemQuantity(item.id, numValue);
                                        }
                                      }
                                    }}
                                    onBlur={(e) => {
                                      // Al perder el foco, asegurar que el valor sea válido
                                      const value = e.target.value;
                                      if (value === '' || isNaN(parseInt(value))) {
                                        updateItemQuantity(item.id, 0);
                                      }
                                    }}
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
                      <div className="text-center py-12 bg-gray-800/50 rounded-lg border border-orange-500/20">
                        <Package className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                        <p className="text-gray-200 mb-2">{t('halloween.calculator.empty')}</p>
                        <p className="text-gray-300 text-sm">{t('halloween.calculator.emptyTip')}</p>
                      </div>
                    )}

                    {isLoadingCalculator && (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto"></div>
                        <p className="text-gray-300 mt-2">{t('common.loadingApiData')}</p>
                      </div>
                    )}
                  </div>




                </div>
              </div>
            )}

            {/* Strategies Section */}
            {selectedSection === 'strategies' && (
              <div className="space-y-8">
                <div className="bg-gray-900/80 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 shadow-2xl">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-3 text-orange-400" />
                    {t('halloween.strategies.title')}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">{t('halloween.strategies.lab.title')}</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                          <h4 className="text-white font-semibold">{t('halloween.strategies.lab.route')}</h4>
                          <p className="text-gray-300 text-sm">{t('halloween.strategies.lab.routeDesc')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">{t('halloween.strategies.lab.group')}</h4>
                          <p className="text-gray-300 text-sm">{t('halloween.strategies.lab.groupDesc')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">{t('halloween.strategies.lab.timing')}</h4>
                          <p className="text-gray-300 text-sm">{t('halloween.strategies.lab.timingDesc')}</p>
                        </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-white">{t('halloween.strategies.tp.title')}</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                          <div>
                          <h4 className="text-white font-semibold">{t('halloween.strategies.tp.early')}</h4>
                          <p className="text-gray-300 text-sm">{t('halloween.strategies.tp.earlyDesc')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">{t('halloween.strategies.tp.sell')}</h4>
                          <p className="text-gray-300 text-sm">{t('halloween.strategies.tp.sellDesc')}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">{t('halloween.strategies.tp.corn')}</h4>
                          <p className="text-gray-300 text-sm">{t('halloween.strategies.tp.cornDesc')}</p>
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 backdrop-blur-md rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden border border-orange-500/30 shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-orange-500/30">
              <h3 className="text-xl font-bold text-white">{t('common.selectItems')}</h3>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-gray-400 hover:text-orange-400 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={t('common.searchItemsPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800/80 border border-orange-500/30 rounded-lg text-white placeholder-gray-400 focus:border-orange-500/60 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>

              {/* Items Grid */}
              <div className="max-h-96 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {filteredAvailableItems.map((item) => (
                    <label
                      key={item.id}
                      className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        selectedItems.has(item.id)
                          ? 'bg-orange-600/80 border-orange-500 shadow-lg'
                          : 'bg-gray-800/60 border-orange-500/20 hover:bg-gray-700/80 hover:border-orange-500/40'
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
                        className="mr-3 accent-orange-500"
                      />
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">{item.name}</div>
                        <div className="text-gray-300 text-xs">{formatGoldSilverCopper(item.price100)}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-orange-500/30">
                <div className="text-gray-300 text-sm">
                  {t('common.itemsSelected').replace('{count}', String(selectedItems.size))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowItemModal(false)}
                    className="px-4 py-2 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded-lg transition-colors border border-gray-600/50"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    onClick={addSelectedItems}
                    disabled={selectedItems.size === 0}
                    className="px-4 py-2 bg-orange-600/80 hover:bg-orange-700/80 disabled:bg-gray-600/60 text-white rounded-lg transition-colors border border-orange-500/50 disabled:border-gray-500/50"
                  >
                    {t('common.addSelected').replace('{count}', String(selectedItems.size))}
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