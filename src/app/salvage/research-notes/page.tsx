'use client';

import { motion } from 'framer-motion';
import { FileText, Package, Info, Hammer, Gem } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Link from 'next/link';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';
import { useEffect, useState, useMemo } from 'react';

interface GW2Item {
  id: number;
  name: string;
  description?: string;
  type: string;
  rarity: string;
  level: number;
  vendor_value: number;
  icon?: string;
}

interface GW2Price {
  id: number;
  whitelisted: boolean;
  buys: {
    unit_price: number;
    quantity: number;
  };
  sells: {
    unit_price: number;
    quantity: number;
  };
}

interface CraftingItem {
  id?: number;
  name: string;
  level: number | string;
  notes: number;
  buyPrice?: string;
  sellPrice?: string;
  craftingCost?: string;
}

interface CraftingDiscipline {
  name: string;
  icon: any;
  color: string;
  items: CraftingItem[];
}



export default function ResearchNotesPage() {
  usePageTitle('Research Notes - Salvaging');
  const { t } = useI18n();
  const [item13393, setItem13393] = useState<GW2Item | null>(null);
  const [price13393, setPrice13393] = useState<GW2Price | null>(null);
  const [item13477, setItem13477] = useState<GW2Item | null>(null);
  const [price13477, setPrice13477] = useState<GW2Price | null>(null);
  const [item13436, setItem13436] = useState<GW2Item | null>(null);
  const [price13436, setPrice13436] = useState<GW2Price | null>(null);
  const [item13437, setItem13437] = useState<GW2Item | null>(null);
  const [price13437, setPrice13437] = useState<GW2Price | null>(null);
  const [item13435, setItem13435] = useState<GW2Item | null>(null);
  const [price13435, setPrice13435] = useState<GW2Price | null>(null);
  const [item13440, setItem13440] = useState<GW2Item | null>(null);
  const [price13440, setPrice13440] = useState<GW2Price | null>(null);
  const [item13438, setItem13438] = useState<GW2Item | null>(null);
  const [price13438, setPrice13438] = useState<GW2Price | null>(null);
  const [item13441, setItem13441] = useState<GW2Item | null>(null);
  const [price13441, setPrice13441] = useState<GW2Price | null>(null);
  const [item45925, setItem45925] = useState<GW2Item | null>(null);
  const [price45925, setPrice45925] = useState<GW2Price | null>(null);
  const [item41450, setItem41450] = useState<GW2Item | null>(null);
  const [price41450, setPrice41450] = useState<GW2Price | null>(null);
  const [item13413, setItem13413] = useState<GW2Item | null>(null);
  const [price13413, setPrice13413] = useState<GW2Price | null>(null);
  const [item41448, setItem41448] = useState<GW2Item | null>(null);
  const [price41448, setPrice41448] = useState<GW2Price | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para convertir precios de cobre al formato GW2 (00g 02s 60c)
  const formatGW2Price = (copperPrice: number): string => {
    if (copperPrice === 0) return '00g 00s 00c';
    
    const gold = Math.floor(copperPrice / 10000);
    const silver = Math.floor((copperPrice % 10000) / 100);
    const copper = copperPrice % 100;
    
    const goldStr = gold > 0 ? `${gold.toString().padStart(2, '0')}g` : '00g';
    const silverStr = silver > 0 ? ` ${silver.toString().padStart(2, '0')}s` : ' 00s';
    const copperStr = copper > 0 ? ` ${copper.toString().padStart(2, '0')}c` : ' 00c';
    
    return `${goldStr}${silverStr}${copperStr}`;
  };

  // Función para calcular el costo de crafting (estimado basado en materiales típicos)
  const calculateCraftingCost = (itemId: number): string => {
    // Costos estimados basados en materiales típicos de joyería
    const craftingCosts: { [key: number]: number } = {
      13393: 15000,  // ~1.5g - materiales de nivel 400
      13477: 12000,  // ~1.2g - materiales de nivel 375
      13436: 8000,   // ~0.8g - materiales de nivel 300
      13437: 8000,   // ~0.8g - materiales de nivel 300
      13435: 12000,  // ~1.2g - materiales de nivel 300
      13440: 10000,  // ~1.0g - materiales de nivel 325
      13438: 10000,  // ~1.0g - materiales de nivel 325
      13441: 10000,  // ~1.0g - materiales de nivel 325
      45925: 10000,  // ~1.0g - materiales de nivel 325
      41450: 10000,  // ~1.0g - materiales de nivel 325
      13413: 12000,  // ~1.2g - materiales de nivel 375
      41448: 12000   // ~1.2g - materiales de nivel 375
    };
    
    const cost = craftingCosts[itemId] || 0;
    return formatGW2Price(cost);
  };

  // Obtener información de los items desde la API de GW2
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        
        // Obtener información del item 13393
        const item13393Response = await fetch('https://api.guildwars2.com/v2/items/13393');
        const item13393Data: GW2Item = await item13393Response.json();
        setItem13393(item13393Data);
        
        // Obtener precios del Trading Post para 13393
        const price13393Response = await fetch('https://api.guildwars2.com/v2/commerce/prices/13393');
        const price13393Data: GW2Price = await price13393Response.json();
        setPrice13393(price13393Data);

        // Obtener información del item 13477
        const item13477Response = await fetch('https://api.guildwars2.com/v2/items/13477');
        const item13477Data: GW2Item = await item13477Response.json();
        setItem13477(item13477Data);
        
        // Obtener precios del Trading Post para 13477
        const price13477Response = await fetch('https://api.guildwars2.com/v2/commerce/prices/13477');
        const price13477Data: GW2Price = await price13477Response.json();
        setPrice13477(price13477Data);

        // Obtener información del item 13436
        const item13436Response = await fetch('https://api.guildwars2.com/v2/items/13436');
        const item13436Data: GW2Item = await item13436Response.json();
        setItem13436(item13436Data);
        
        // Obtener precios del Trading Post para 13436
        const price13436Response = await fetch('https://api.guildwars2.com/v2/commerce/prices/13436');
        const price13436Data: GW2Price = await price13436Response.json();
        setPrice13436(price13436Data);

        // Obtener información del item 13437
        const item13437Response = await fetch('https://api.guildwars2.com/v2/items/13437');
        const item13437Data: GW2Item = await item13437Response.json();
        setItem13437(item13437Data);
        
        // Obtener precios del Trading Post para 13437
        const price13437Response = await fetch('https://api.guildwars2.com/v2/commerce/prices/13437');
        const price13437Data: GW2Price = await price13437Response.json();
        setPrice13437(price13437Data);

        // Obtener información del item 13435
        const item13435Response = await fetch('https://api.guildwars2.com/v2/items/13435');
        const item13435Data: GW2Item = await item13435Response.json();
        setItem13435(item13435Data);
        
        // Obtener precios del Trading Post para 13435
        const price13435Response = await fetch('https://api.guildwars2.com/v2/commerce/prices/13435');
        const price13435Data: GW2Price = await price13435Response.json();
        setPrice13435(price13435Data);

        // Obtener información del item 13440
        const item13440Response = await fetch('https://api.guildwars2.com/v2/items/13440');
        const item13440Data: GW2Item = await item13440Response.json();
        setItem13440(item13440Data);
        
        // Obtener precios del Trading Post para 13440
        const price13440Response = await fetch('https://api.guildwars2.com/v2/commerce/prices/13440');
        const price13440Data: GW2Price = await price13440Response.json();
        setPrice13440(price13440Data);

        // Obtener información del item 13438
        const item13438Response = await fetch('https://api.guildwars2.com/v2/items/13438');
        const item13438Data: GW2Item = await item13438Response.json();
        setItem13438(item13438Data);
        
        // Obtener precios del Trading Post para 13438
        const price13438Response = await fetch('https://api.guildwars2.com/v2/commerce/prices/13438');
        const price13438Data: GW2Price = await price13438Response.json();
        setPrice13438(price13438Data);

        // Obtener información del item 13441
        const item13441Response = await fetch('https://api.guildwars2.com/v2/items/13441');
        const item13441Data: GW2Item = await item13441Response.json();
        setItem13441(item13441Data);
        
        // Obtener precios del Trading Post para 13441
        const price13441Response = await fetch('https://api.guildwars2.com/v2/commerce/prices/13441');
        const price13441Data: GW2Price = await price13441Response.json();
        setPrice13441(price13441Data);

        // Obtener información del item 45925
        const item45925Response = await fetch('https://api.guildwars2.com/v2/items/45925');
        const item45925Data: GW2Item = await item45925Response.json();
        setItem45925(item45925Data);
        
        // Obtener precios del Trading Post para 45925
        const price45925Response = await fetch('https://api.guildwars2.com/v2/commerce/prices/45925');
        const price45925Data: GW2Price = await price45925Response.json();
        setPrice45925(price45925Data);

        // Obtener información del item 41450
        const item41450Response = await fetch('https://api.guildwars2.com/v2/items/41450');
        const item41450Data: GW2Item = await item41450Response.json();
        setItem41450(item41450Data);
        
        // Obtener precios del Trading Post para 41450
        const price41450Response = await fetch('https://api.guildwars2.com/v2/commerce/prices/41450');
        const price41450Data: GW2Price = await price41450Response.json();
        setPrice41450(price41450Data);

        // Obtener información del item 13413
        const item13413Response = await fetch('https://api.guildwars2.com/v2/items/13413');
        const item13413Data: GW2Item = await item13413Response.json();
        setItem13413(item13413Data);
        
        // Obtener precios del Trading Post para 13413
        const price13413Response = await fetch('https://api.guildwars2.com/v2/commerce/prices/13413');
        const price13413Data: GW2Price = await price13413Response.json();
        setPrice13413(price13413Data);

        // Obtener información del item 41448
        const item41448Response = await fetch('https://api.guildwars2.com/v2/items/41448');
        const item41448Data: GW2Item = await item41448Response.json();
        setItem41448(item41448Data);
        
        // Obtener precios del Trading Post para 41448
        const price41448Response = await fetch('https://api.guildwars2.com/v2/commerce/prices/41448');
        const price41448Data: GW2Price = await price41448Response.json();
        setPrice41448(price41448Data);
        
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Datos reales de Research Notes basados en la Wiki de GW2
  const craftingDisciplines: CraftingDiscipline[] = useMemo(() => [
    {
      name: 'Jeweler',
      icon: Gem,
      color: 'text-purple-400',
      items: [
                                   { 
            id: 13393,
            name: item13393?.name || 'Loading...', 
            level: item13393?.level || 0, 
            notes: 6, 
            buyPrice: price13393 ? formatGW2Price(price13393.buys.unit_price) : '00g 00s 00c',
            sellPrice: price13393 ? formatGW2Price(price13393.sells.unit_price) : '00g 00s 00c',
            craftingCost: calculateCraftingCost(13393)
          },
                                                                       { 
                     id: 13477,
                     name: item13477?.name || 'Loading...', 
                     level: item13477?.level || 0, 
                     notes: 4, 
                     buyPrice: price13477 ? formatGW2Price(price13477.buys.unit_price) : '00g 00s 00c',
                     sellPrice: price13477 ? formatGW2Price(price13477.sells.unit_price) : '00g 00s 00c',
                     craftingCost: calculateCraftingCost(13477)
                   },
                                                       { 
                     id: 13436,
                     name: item13436?.name || 'Loading...', 
                     level: item13436?.level || 0, 
                     notes: 5, 
                     buyPrice: price13436 ? formatGW2Price(price13436.buys.unit_price) : '00g 00s 00c',
                     sellPrice: price13436 ? formatGW2Price(price13436.sells.unit_price) : '00g 00s 00c',
                     craftingCost: calculateCraftingCost(13436)
                   },
                  { 
                    id: 13437,
                    name: item13437?.name || 'Loading...', 
                    level: item13437?.level || 0, 
                    notes: 5, 
                    buyPrice: price13437 ? formatGW2Price(price13437.buys.unit_price) : '00g 00s 00c',
                    sellPrice: price13437 ? formatGW2Price(price13437.sells.unit_price) : '00g 00s 00c'
                  },
                                     { 
                     id: 13435,
                     name: item13435?.name || 'Loading...', 
                     level: item13435?.level || 0, 
                     notes: 10.5, 
                     buyPrice: price13435 ? formatGW2Price(price13435.buys.unit_price) : '00g 00s 00c',
                     sellPrice: price13435 ? formatGW2Price(price13435.sells.unit_price) : '00g 00s 00c'
                   },
                   { 
                     id: 13440,
                     name: item13440?.name || 'Loading...', 
                     level: item13440?.level || 0, 
                     notes: 5.34, 
                     buyPrice: price13440 ? formatGW2Price(price13440.buys.unit_price) : '00g 00s 00c',
                     sellPrice: price13440 ? formatGW2Price(price13440.sells.unit_price) : '00g 00s 00c'
                   },
                   { 
                     id: 13438,
                     name: item13438?.name || 'Loading...', 
                     level: item13438?.level || 0, 
                     notes: 5, 
                     buyPrice: price13438 ? formatGW2Price(price13438.buys.unit_price) : '00g 00s 00c',
                     sellPrice: price13438 ? formatGW2Price(price13438.sells.unit_price) : '00g 00s 00c'
                   },
                   { 
                     id: 13441,
                     name: item13441?.name || 'Loading...', 
                     level: item13441?.level || 0, 
                     notes: 5, 
                     buyPrice: price13441 ? formatGW2Price(price13441.buys.unit_price) : '00g 00s 00c',
                     sellPrice: price13441 ? formatGW2Price(price13441.sells.unit_price) : '00g 00s 00c'
                   },
                   { 
                     id: 45925,
                     name: item45925?.name || 'Loading...', 
                     level: item45925?.level || 0, 
                     notes: 5, 
                     buyPrice: price45925 ? formatGW2Price(price45925.buys.unit_price) : '00g 00s 00c',
                     sellPrice: price45925 ? formatGW2Price(price45925.sells.unit_price) : '00g 00s 00c'
                   },
                   { 
                     id: 41450,
                     name: item41450?.name || 'Loading...', 
                     level: item41450?.level || 0, 
                     notes: 5, 
                     buyPrice: price41450 ? formatGW2Price(price41450.buys.unit_price) : '00g 00s 00c',
                     sellPrice: price41450 ? formatGW2Price(price41450.sells.unit_price) : '00g 00s 00c'
                   },
                   { 
                     id: 13413,
                     name: item13413?.name || 'Loading...', 
                     level: item13413?.level || 0, 
                     notes: 4, 
                     buyPrice: price13413 ? formatGW2Price(price13413.buys.unit_price) : '00g 00s 00c',
                     sellPrice: price13413 ? formatGW2Price(price13413.sells.unit_price) : '00g 00s 00c'
                   },
                   { 
                     id: 41448,
                     name: item41448?.name || 'Loading...', 
                     level: item41448?.level || 0, 
                     notes: 4, 
                     buyPrice: price41448 ? formatGW2Price(price41448.buys.unit_price) : '00g 00s 00c',
                     sellPrice: price41448 ? formatGW2Price(price41448.sells.unit_price) : '00g 00s 00c'
                   }
                ]
              }
            ], [item13393, price13393, item13477, price13477, item13436, price13436, item13437, price13437, item13435, price13435, item13440, price13440, item13438, price13438, item13441, price13441, item45925, price45925, item41450, price41450, item13413, price13413, item41448, price41448]);

  // Datos de ejemplo para Research Notes (mantenidos para compatibilidad)
  const researchNoteItems = [
    {
      name: 'Exotic Weapon',
      rarity: 'Exotic',
      avgNotes: 1.5,
      price: '2.50',
      efficiency: 'High',
      color: 'text-orange-400'
    },
    {
      name: 'Masterwork Armor',
      rarity: 'Masterwork',
      avgNotes: 0.8,
      price: '1.20',
      efficiency: 'Medium',
      color: 'text-green-400'
    },
    {
      name: 'Rare Accessory',
      rarity: 'Rare',
      avgNotes: 1.2,
      price: '1.80',
      efficiency: 'High',
      color: 'text-yellow-400'
    },
    {
      name: 'Exotic Trinket',
      rarity: 'Exotic',
      avgNotes: 1.3,
      price: '2.00',
      efficiency: 'High',
      color: 'text-orange-400'
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {/* Hero Section with Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {/* Back Button - Left Side */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-shrink-0">
                <Link href="/salvage">
                  <button className="px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white font-medium text-sm rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg">
                    {t('researchNotesPage.backToSalvaging', '← Back to Salvaging')}
                  </button>
                </Link>
              </motion.div>

              {/* Title and Icon - Center */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg flex items-center justify-center">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  {t('researchNotesPage.title', 'Research Notes')}
                </h1>
              </div>

              {/* Spacer for balance */}
              <div className="w-32 flex-shrink-0"></div>
            </div>
            
            <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed text-center">
              {t('researchNotesPage.subtitle', 'Calculate the cost and efficiency of obtaining Research Notes through salvaging. Maximize your profits by understanding the true cost per note.')}
            </p>
          </motion.div>

          {/* Crafting Disciplines Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-600/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Hammer className="h-6 w-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">{t('researchNotesPage.craftingDisciplines', 'Crafting Disciplines - Research Notes')}</h2>
              </div>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading item data...</span>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {craftingDisciplines.map((discipline, index) => (
                <motion.div
                  key={discipline.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                  <div className="flex items-center gap-3 mb-4">
                    <discipline.icon className={`h-6 w-6 ${discipline.color}`} />
                    <h3 className={`text-xl font-bold ${discipline.color}`}>{discipline.name}</h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-600/50">
                          <th className="text-left py-2 px-3 text-gray-300 font-medium">Item</th>
                                                     <th className="text-left py-2 px-3 text-gray-300 font-medium">Crafting Level</th>
                          <th className="text-left py-2 px-3 text-gray-300 font-medium">Level</th>
                          <th className="text-left py-2 px-3 text-gray-300 font-medium">Notes</th>
                                                     <th className="text-left py-2 px-3 text-gray-300 font-medium">Buy Price</th>
                           <th className="text-left py-2 px-3 text-gray-300 font-medium">Sell Price</th>
                           <th className="text-left py-2 px-3 text-gray-300 font-medium">Crafting Cost</th>
                        </tr>
                      </thead>
                       <tbody>
                         {discipline.items.map((item, itemIndex) => (
                           <tr key={itemIndex} className="border-b border-slate-600/30 hover:bg-slate-600/20">
                             <td className="py-2 px-3 text-white">
                               <div className="flex items-center gap-3">
                                                                   {item.id === 13393 && item13393?.icon ? (
                                    <img 
                                      src={item13393.icon} 
                                      alt={item.name}
                                      className="w-8 h-8 rounded"
                                    />
                                  ) : item.id === 13477 && item13477?.icon ? (
                                    <img 
                                      src={item13477.icon} 
                                      alt={item.name}
                                      className="w-8 h-8 rounded"
                                    />
                                  ) : item.id === 13436 && item13436?.icon ? (
                                    <img 
                                      src={item13436.icon} 
                                      alt={item.name}
                                      className="w-8 h-8 rounded"
                                    />
                                  ) : item.id === 13437 && item13437?.icon ? (
                                    <img 
                                      src={item13437.icon} 
                                      alt={item.name}
                                      className="w-8 h-8 rounded"
                                    />
                                                                     ) : item.id === 13435 && item13435?.icon ? (
                                     <img 
                                       src={item13435.icon} 
                                       alt={item.name}
                                       className="w-8 h-8 rounded"
                                     />
                                   ) : item.id === 13440 && item13440?.icon ? (
                                     <img 
                                       src={item13440.icon} 
                                       alt={item.name}
                                       className="w-8 h-8 rounded"
                                     />
                                   ) : item.id === 13438 && item13438?.icon ? (
                                     <img 
                                       src={item13438.icon} 
                                       alt={item.name}
                                       className="w-8 h-8 rounded"
                                     />
                                   ) : item.id === 13441 && item13441?.icon ? (
                                     <img 
                                       src={item13441.icon} 
                                       alt={item.name}
                                       className="w-8 h-8 rounded"
                                     />
                                   ) : item.id === 45925 && item45925?.icon ? (
                                     <img 
                                       src={item45925.icon} 
                                       alt={item.name}
                                       className="w-8 h-8 rounded"
                                     />
                                   ) : item.id === 41450 && item41450?.icon ? (
                                     <img 
                                       src={item41450.icon} 
                                       alt={item.name}
                                       className="w-8 h-8 rounded"
                                     />
                                   ) : item.id === 13413 && item13413?.icon ? (
                                     <img 
                                       src={item13413.icon} 
                                       alt={item.name}
                                       className="w-8 h-8 rounded"
                                     />
                                   ) : item.id === 41448 && item41448?.icon ? (
                                     <img 
                                       src={item41448.icon} 
                                       alt={item.name}
                                       className="w-8 h-8 rounded"
                                     />
                                   ) : item.id ? (
                                     <div className="w-8 h-8 bg-slate-600 rounded"></div>
                                   ) : (
                                     <div className="w-8 h-8 bg-slate-600 rounded"></div>
                                   )}
                                 <span>{item.name}</span>
                               </div>
                             </td>
                                <td className="py-2 px-3 text-gray-300">
                                 {item.id === 13393 ? '375' : 
                                  item.id === 13477 ? '375' : 
                                  item.id === 13436 ? '300' : 
                                  item.id === 13437 ? '300' : 
                                  item.id === 13435 ? '300' : 
                                  item.id === 13440 ? '325' : 
                                  item.id === 13438 ? '325' : 
                                  item.id === 13441 ? '325' : 
                                  item.id === 45925 ? '325' : 
                                  item.id === 41450 ? '325' : 
                                  item.id === 13413 ? '375' : 
                                  item.id === 41448 ? '375' : '-'}
                              </td>
                             <td className="py-2 px-3 text-gray-300">{item.level}</td>
                             <td className="py-2 px-3 text-green-400 font-medium">{item.notes}</td>
                             <td className="py-2 px-3 text-blue-400 font-medium">
                               {item.buyPrice ? `${item.buyPrice}g` : '-'}
                             </td>
                                                           <td className="py-2 px-3 text-green-400 font-medium">
                                {item.sellPrice ? `${item.sellPrice}g` : '-'}
                              </td>
                              <td className="py-2 px-3 text-orange-400 font-medium">
                                {item.craftingCost ? `${item.craftingCost}` : '-'}
                              </td>
                            </tr>
                         ))}
                       </tbody>
                     </table>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Research Notes Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-600/50">
            <div className="flex items-center gap-3 mb-6">
              <Package className="h-6 w-6 text-green-400" />
              <h2 className="text-2xl font-bold text-white">{t('researchNotesPage.bestItems', 'Best Items for Research Notes')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {researchNoteItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 hover:border-green-500/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{item.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${item.color} bg-slate-600/50`}>
                      {item.rarity}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t('researchNotesPage.avgNotes', 'Avg Notes')}:</span>
                      <span className="text-white">{item.avgNotes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t('researchNotesPage.price', 'Price')}:</span>
                      <span className="text-white">{item.price}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{t('researchNotesPage.efficiency', 'Efficiency')}:</span>
                      <span className={item.color}>{item.efficiency}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-600/50">
            <div className="flex items-center gap-3 mb-6">
              <Info className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">{t('researchNotesPage.tips', 'Pro Tips')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  {t('researchNotesPage.salvagingTips', 'Salvaging Tips')}
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    {t('researchNotesPage.tip1', 'Use appropriate salvage kits for each rarity')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    {t('researchNotesPage.tip2', 'Check current market prices before salvaging')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    {t('researchNotesPage.tip3', 'Consider the value of materials you might get')}
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  {t('researchNotesPage.marketTips', 'Market Tips')}
                </h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    {t('researchNotesPage.tip4', 'Research Notes are used in crafting ascended gear')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    {t('researchNotesPage.tip5', 'Prices can fluctuate based on crafting demand')}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400">•</span>
                    {t('researchNotesPage.tip6', 'Bulk salvaging can reduce overall costs')}
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

// Funciones auxiliares para colores
function getRarityColor(rarity: string): string {
  switch (rarity) {
    case 'Fine': return 'text-blue-400';
    case 'Masterwork': return 'text-green-400';
    case 'Rare': return 'text-yellow-400';
    case 'Exotic': return 'text-orange-400';
    default: return 'text-gray-400';
  }
}

function getEfficiencyColor(efficiency: string): string {
  switch (efficiency) {
    case 'High': return 'text-green-400';
    case 'Medium': return 'text-yellow-400';
    case 'Low': return 'text-red-400';
    default: return 'text-gray-400';
  }
}
