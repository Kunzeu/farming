'use client';

import { motion } from 'framer-motion';
import { FileText, Hammer, Gem } from 'lucide-react';
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
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  items: CraftingItem[];
}

export default function ResearchNotesPage() {
  usePageTitle('Research Notes - Salvaging');
  const { t, lang } = useI18n();
  
     // Estados para items
   const [item8883, setItem8883] = useState<GW2Item | null>(null);
   const [item13436, setItem13436] = useState<GW2Item | null>(null);
   const [item13437, setItem13437] = useState<GW2Item | null>(null);
   const [item13435, setItem13435] = useState<GW2Item | null>(null);
   const [item104934, setItem104934] = useState<GW2Item | null>(null);
   const [item104934B, setItem104934B] = useState<GW2Item | null>(null);
  
     // Estados para precios de items
   const [price8883, setPrice8883] = useState<GW2Price | null>(null);
   const [price13436, setPrice13436] = useState<GW2Price | null>(null);
   const [price13437, setPrice13437] = useState<GW2Price | null>(null);
   const [price13435, setPrice13435] = useState<GW2Price | null>(null);
   const [price104934, setPrice104934] = useState<GW2Price | null>(null);
   const [price104934B, setPrice104934B] = useState<GW2Price | null>(null);
  
     // Estados para precios de materiales
   const [price19700, setPrice19700] = useState<GW2Price | null>(null);
   const [price24473, setPrice24473] = useState<GW2Price | null>(null);
   const [price24519, setPrice24519] = useState<GW2Price | null>(null);
   const [price24511, setPrice24511] = useState<GW2Price | null>(null);
   const [price24277, setPrice24277] = useState<GW2Price | null>(null);
   const [price24351, setPrice24351] = useState<GW2Price | null>(null);
   const [price24300, setPrice24300] = useState<GW2Price | null>(null);
   const [price12156, setPrice12156] = useState<GW2Price | null>(null);
       const [price19722, setPrice19722] = useState<GW2Price | null>(null);
    const [price19729, setPrice19729] = useState<GW2Price | null>(null);
    const [price19748, setPrice19748] = useState<GW2Price | null>(null);
    const [price68063, setPrice68063] = useState<GW2Price | null>(null);
  
  const [loading, setLoading] = useState(true);
     const [sortField, setSortField] = useState<'craftingLevel' | 'level' | 'notes' | 'buyPrice' | 'sellPrice' | 'craftingCost' | 'pricePerNote'>('craftingLevel');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [craftingPriceSide, setCraftingPriceSide] = useState<'buy' | 'sell'>('sell');

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

  // Función para obtener el nivel de crafting de un item
  const getCraftingLevel = (itemId: number): number => {
    const craftingLevels: { [key: number]: number } = {
      8883: 400,
      13436: 300,
      13437: 300,
      13435: 300,
      104934: 0,
    };
    return craftingLevels[itemId] || 0;
  };

  // Función para ordenar items por cualquier campo
  const sortItemsByField = (items: CraftingItem[]): CraftingItem[] => {
    return [...items].sort((a, b) => {
      let valueA: number;
      let valueB: number;
      
      switch (sortField) {
        case 'craftingLevel':
          valueA = getCraftingLevel(a.id || 0);
          valueB = getCraftingLevel(b.id || 0);
          break;
        case 'level':
          valueA = typeof a.level === 'string' ? parseInt(a.level) || 0 : a.level;
          valueB = typeof b.level === 'string' ? parseInt(b.level) || 0 : b.level;
          break;
        case 'notes':
          valueA = a.notes;
          valueB = b.notes;
          break;
        case 'buyPrice':
          valueA = parseFloat(a.buyPrice?.replace(/[^0-9.]/g, '') || '0');
          valueB = parseFloat(b.buyPrice?.replace(/[^0-9.]/g, '') || '0');
          break;
        case 'sellPrice':
          valueA = parseFloat(a.sellPrice?.replace(/[^0-9.]/g, '') || '0');
          valueB = parseFloat(b.sellPrice?.replace(/[^0-9.]/g, '') || '0');
          break;
                 case 'craftingCost':
           valueA = parseFloat(a.craftingCost?.replace(/[^0-9.]/g, '') || '0');
           valueB = parseFloat(b.craftingCost?.replace(/[^0-9.]/g, '') || '0');
           break;
         case 'pricePerNote':
           // Calcular precio por nota: craftingCost / notes
           const costA = parseFloat(a.craftingCost?.replace(/[^0-9.]/g, '') || '0');
           const costB = parseFloat(b.craftingCost?.replace(/[^0-9.]/g, '') || '0');
           valueA = costA / (a.notes || 1);
           valueB = costB / (b.notes || 1);
           break;
         default:
           valueA = 0;
           valueB = 0;
      }
      
      if (sortOrder === 'desc') {
        return valueB - valueA; // Mayor a menor
      } else {
        return valueA - valueB; // Menor a mayor
      }
    });
  };

     // Función para manejar el cambio de campo de ordenamiento
   const handleSortChange = (field: 'craftingLevel' | 'level' | 'notes' | 'buyPrice' | 'sellPrice' | 'craftingCost' | 'pricePerNote') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Función para calcular el costo de crafting
  const calculateCraftingCost = (itemId: number): string => {
    // Si es el item 8883, calcular dinámicamente con 24277, 24351, 24300, 12156 x1 cada uno
    if (itemId === 8883 && price24277 && price24351 && price24300 && price12156) {
      const buyTotal = (price24277.buys?.unit_price || 0) * 1 + (price24351.buys?.unit_price || 0) * 1 + (price24300.buys?.unit_price || 0) * 1 + (price12156.buys?.unit_price || 0) * 1;
      const sellTotal = (price24277.sells?.unit_price || 0) * 1 + (price24351.sells?.unit_price || 0) * 1 + (price24300.sells?.unit_price || 0) * 1 + (price12156.sells?.unit_price || 0) * 1;
      const selected = craftingPriceSide === 'buy' ? buyTotal : sellTotal;
      return formatGW2Price(selected);
    }

    // Si es el item 13436, calcular dinámicamente con 24473 x1 y 19700 x8
    if (itemId === 13436 && price24473 && price19700) {
      const buyTotal = (price24473.buys?.unit_price || 0) * 1 + (price19700.buys?.unit_price || 0) * 8;
      const sellTotal = (price24473.sells?.unit_price || 0) * 1 + (price19700.sells?.unit_price || 0) * 8;
      const selected = craftingPriceSide === 'buy' ? buyTotal : sellTotal;
      return formatGW2Price(selected);
    }

    // Si es el item 13437, calcular dinámicamente con 24519 x1 y 19700 x8
    if (itemId === 13437 && price24519 && price19700) {
      const buyTotal = (price24519.buys?.unit_price || 0) * 1 + (price19700.buys?.unit_price || 0) * 8;
      const sellTotal = (price24519.sells?.unit_price || 0) * 1 + (price19700.sells?.unit_price || 0) * 8;
      const selected = craftingPriceSide === 'buy' ? buyTotal : sellTotal;
      return formatGW2Price(selected);
    }

         // Si es el item 13435, calcular dinámicamente con 24511 x1 y 19700 x8
     if (itemId === 13435 && price24511 && price19700) {
       const buyTotal = (price24511.buys?.unit_price || 0) * 1 + (price19700.buys?.unit_price || 0) * 8;
       const sellTotal = (price24511.sells?.unit_price || 0) * 1 + (price19700.sells?.unit_price || 0) * 8;
       const selected = craftingPriceSide === 'buy' ? buyTotal : sellTotal;
       return formatGW2Price(selected);
     }

    // Si es el item 104934, calcular dinámicamente con 19722 x30, 19700 x20, 19748 x30, 68063 x1
      if (itemId === 104934 && price19722 && price19700 && price19748 && price68063) {
        const buyTotal = (price19722.buys?.unit_price || 0) * 30 + (price19700.buys?.unit_price || 0) * 20 + (price19748.buys?.unit_price || 0) * 30 + (price68063.buys?.unit_price || 0) * 1;
        const sellTotal = (price19722.sells?.unit_price || 0) * 30 + (price19700.sells?.unit_price || 0) * 20 + (price19748.sells?.unit_price || 0) * 30 + (price68063.sells?.unit_price || 0) * 1;
        const selected = craftingPriceSide === 'buy' ? buyTotal : sellTotal;
        return formatGW2Price(selected);
      }

    // Si es el item 104934-B, calcular dinámicamente con 19729 x40, 19700 x20, 19748 x30, 68063 x1
      if (itemId === 104934.1 && price19729 && price19700 && price19748 && price68063) {
        const buyTotal = (price19729.buys?.unit_price || 0) * 40 + (price19700.buys?.unit_price || 0) * 20 + (price19748.buys?.unit_price || 0) * 30 + (price68063.buys?.unit_price || 0) * 1;
        const sellTotal = (price19729.sells?.unit_price || 0) * 40 + (price19700.sells?.unit_price || 0) * 20 + (price19748.sells?.unit_price || 0) * 30 + (price68063.sells?.unit_price || 0) * 1;
        const selected = craftingPriceSide === 'buy' ? buyTotal : sellTotal;
        return formatGW2Price(selected);
      }

     // Costos estimados para otros items
     const craftingCosts: { [key: number]: number } = {};
     
     const cost = craftingCosts[itemId] || 0;
     return formatGW2Price(cost);
  };

  // Obtener información de los items desde la API de GW2
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        
                          // Obtener información de todos los items
          const [item8883Response, item13436Response, item13437Response, item13435Response, item104934Response, item104934BResponse] = await Promise.all([
            fetch(`https://api.guildwars2.com/v2/items/8883?lang=${lang}`),
            fetch(`https://api.guildwars2.com/v2/items/13436?lang=${lang}`),
            fetch(`https://api.guildwars2.com/v2/items/13437?lang=${lang}`),
            fetch(`https://api.guildwars2.com/v2/items/13435?lang=${lang}`),
            fetch(`https://api.guildwars2.com/v2/items/104934?lang=${lang}`),
            fetch(`https://api.guildwars2.com/v2/items/104934?lang=${lang}`)
          ]);

         const [item8883Data, item13436Data, item13437Data, item13435Data, item104934Data, item104934BData] = await Promise.all([
           item8883Response.json(),
           item13436Response.json(),
           item13437Response.json(),
           item13435Response.json(),
           item104934Response.json(),
           item104934BResponse.json()
         ]);

         setItem8883(item8883Data);
         setItem13436(item13436Data);
         setItem13437(item13437Data);
         setItem13435(item13435Data);
         setItem104934(item104934Data);
         setItem104934B(item104934BData);

                          // Obtener precios de todos los items
          const [price8883Response, price13436Response, price13437Response, price13435Response, price104934Response, price104934BResponse] = await Promise.all([
            fetch(`https://api.guildwars2.com/v2/commerce/prices/8883?lang=${lang}`),
            fetch(`https://api.guildwars2.com/v2/commerce/prices/13436?lang=${lang}`),
            fetch(`https://api.guildwars2.com/v2/commerce/prices/13437?lang=${lang}`),
            fetch(`https://api.guildwars2.com/v2/commerce/prices/13435?lang=${lang}`),
            fetch(`https://api.guildwars2.com/v2/commerce/prices/104934?lang=${lang}`),
            fetch(`https://api.guildwars2.com/v2/commerce/prices/104934?lang=${lang}`)
          ]);

         const [price8883Data, price13436Data, price13437Data, price13435Data, price104934Data, price104934BData] = await Promise.all([
           price8883Response.json(),
           price13436Response.json(),
           price13437Response.json(),
           price13435Response.json(),
           price104934Response.json(),
           price104934BResponse.json()
         ]);

         setPrice8883(price8883Data);
         setPrice13436(price13436Data);
         setPrice13437(price13437Data);
         setPrice13435(price13435Data);
         setPrice104934(price104934Data);
         setPrice104934B(price104934BData);

                                                       // Obtener precios de todos los materiales de una sola vez
           const allMatsPricesResp = await fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=19700,24473,24519,24511,24277,24351,24300,12156,19722,19729,19748,68063&lang=${lang}`);
         const allMatsPricesData: GW2Price[] = await allMatsPricesResp.json();
         
         const allMatsMap = allMatsPricesData.reduce((acc: Record<number, GW2Price>, p: GW2Price) => {
           acc[p.id] = p;
           return acc;
         }, {} as Record<number, GW2Price>);
         
         setPrice19700(allMatsMap[19700] || null);
         setPrice24473(allMatsMap[24473] || null);
         setPrice24519(allMatsMap[24519] || null);
         setPrice24511(allMatsMap[24511] || null);
         setPrice24277(allMatsMap[24277] || null);
         setPrice24351(allMatsMap[24351] || null);
         setPrice24300(allMatsMap[24300] || null);
         setPrice12156(allMatsMap[12156] || null);
         setPrice19722(allMatsMap[19722] || null);
          setPrice19729(allMatsMap[19729] || null);
          setPrice19748(allMatsMap[19748] || null);
          setPrice68063(allMatsMap[68063] || null);
        
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

         fetchItems();
   }, [lang]);

           // Datos de crafting disciplines
    const craftingDisciplines: CraftingDiscipline[] = useMemo(() => {
      return [
       {
                   name: t('researchNotesPage.discipline.jeweler'),
         icon: Gem,
         color: 'text-purple-400',
         items: sortItemsByField([
           { 
             id: 8883,
             name: item8883?.name || 'Loading...', 
             level: item8883?.level || 0, 
             notes: 1.1, 
             buyPrice: price8883?.buys?.unit_price ? formatGW2Price(price8883.buys.unit_price) : '00g 00s 00c',
             sellPrice: price8883?.sells?.unit_price ? formatGW2Price(price8883.sells.unit_price) : '00g 00s 00c',
             craftingCost: calculateCraftingCost(8883)
           },
           { 
             id: 13436,
             name: item13436?.name || 'Loading...', 
             level: item13436?.level || 0, 
             notes: 5.1, 
             buyPrice: price13436?.buys?.unit_price ? formatGW2Price(price13436.buys.unit_price) : '00g 00s 00c',
             sellPrice: price13436?.sells?.unit_price ? formatGW2Price(price13436.sells.unit_price) : '00g 00s 00c',
             craftingCost: calculateCraftingCost(13436)
           },
           { 
             id: 13437,
             name: item13437?.name || 'Loading...', 
             level: item13437?.level || 0, 
             notes: 5.1, 
             buyPrice: price13437?.buys?.unit_price ? formatGW2Price(price13437.buys.unit_price) : '00g 00s 00c',
             sellPrice: price13437?.sells?.unit_price ? formatGW2Price(price13437.sells.unit_price) : '00g 00s 00c',
             craftingCost: calculateCraftingCost(13437)
           },
           { 
             id: 13435,
             name: item13435?.name || 'Loading...', 
             level: item13435?.level || 0, 
             notes: 5.1, 
             buyPrice: price13435?.buys?.unit_price ? formatGW2Price(price13435.buys.unit_price) : '00g 00s 00c',
             sellPrice: price13435?.sells?.unit_price ? formatGW2Price(price13435.sells.unit_price) : '00g 00s 00c',
             craftingCost: calculateCraftingCost(13435)
           },
                       { 
              id: 104934,
              name: (item104934?.name || 'Loading...') + ` (${t('researchNotesPage.suffixes.elder')})`, 
              level: item104934?.level || 0, 
              notes: 150, 
              buyPrice: price104934?.buys?.unit_price ? formatGW2Price(price104934.buys.unit_price) : '00g 00s 00c',
              sellPrice: price104934?.sells?.unit_price ? formatGW2Price(price104934.sells.unit_price) : '00g 00s 00c',
              craftingCost: calculateCraftingCost(104934)
            },
             { 
               id: 104934.1,
               name: (item104934B?.name || 'Loading...') + ` (${t('researchNotesPage.suffixes.thick')})`, 
               level: item104934B?.level || 0, 
               notes: 150, 
               buyPrice: price104934B?.buys?.unit_price ? formatGW2Price(price104934B.buys.unit_price) : '00g 00s 00c',
               sellPrice: price104934B?.sells?.unit_price ? formatGW2Price(price104934B.sells.unit_price) : '00g 00s 00c',
               craftingCost: calculateCraftingCost(104934.1)
             }
         ])
       }
     ];
   }, [item8883, price8883, item13436, price13436, item13437, price13437, item13435, price13435, item104934, price104934, item104934B, price104934B, price19700, price24473, price24519, price24511, price24277, price24351, price24300, price12156, price19722, price19729, price19748, price68063, craftingPriceSide, sortOrder, sortField, calculateCraftingCost, sortItemsByField]);

  

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
                    {t('researchNotesPage.backToSalvaging')}
                  </button>
                </Link>
              </motion.div>

              {/* Title and Icon - Center */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg flex items-center justify-center">
                  <FileText className="h-8 w-8 text-white" />
                </div>
                 <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                   {t('researchNotesPage.title')}
                 </h1>
              </div>

              {/* Spacer for balance */}
              <div className="w-32 flex-shrink-0"></div>
            </div>
            
             <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed text-center">
               {t('researchNotesPage.subtitle')}
             </p>
          </motion.div>

                     {/* Research Notes Table */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-600/50">
             <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                 <FileText className="h-6 w-6 text-green-400" />
                                  <h2 className="text-2xl font-bold text-white">{t('researchNotesPage.title')}</h2>
               </div>
               {loading && (
                 <div className="flex items-center gap-2 text-sm text-gray-400">
                   <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
                                                         <span>{t('researchNotesPage.loading')}</span>
                 </div>
               )}
             </div>

                         <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-600/50">
                                                     <th className="text-left py-2 px-3 text-gray-300 font-medium">{t('researchNotesPage.table.item')}</th>
                                                     <th className="text-center py-2 px-3 text-gray-300 font-medium">
                            <button
                              onClick={() => handleSortChange('craftingLevel')}
                              className="flex items-center justify-center gap-2 hover:text-white transition-colors group w-full"
                              title={`${t('researchNotesPage.table.sortBy')} ${t('researchNotesPage.table.craftingLevel')} ${sortField === 'craftingLevel' ? (sortOrder === 'desc' ? t('researchNotesPage.table.sortAscending') : t('researchNotesPage.table.sortDescending')) : t('researchNotesPage.table.sortDefault')}`}
                            >
                              {t('researchNotesPage.table.craftingLevel')}
                              <span className="text-xs text-gray-400 group-hover:text-white">
                                {sortField === 'craftingLevel' ? (sortOrder === 'desc' ? (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                ) : (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                )) : (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                  </svg>
                                )}
                              </span>
                            </button>
                          </th>
                          <th className="text-left py-2 px-3 text-gray-300 font-medium">
                            <button
                              onClick={() => handleSortChange('level')}
                              className="flex items-center gap-2 hover:text-white transition-colors group"
                              title={`${t('researchNotesPage.table.sortBy')} ${t('researchNotesPage.table.level')} ${sortField === 'level' ? (sortOrder === 'desc' ? t('researchNotesPage.table.sortAscending') : t('researchNotesPage.table.sortDescending')) : t('researchNotesPage.table.sortDefault')}`}
                            >
                              {t('researchNotesPage.table.level')}
                              <span className="text-xs text-gray-400 group-hover:text-white">
                                {sortField === 'level' ? (sortOrder === 'desc' ? (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                ) : (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                )) : (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                  </svg>
                                )}
                              </span>
                            </button>
                          </th>
                          <th className="text-left py-2 px-3 text-gray-300 font-medium">
                            <button
                              onClick={() => handleSortChange('notes')}
                              className="flex items-center gap-2 hover:text-white transition-colors group"
                              title={`${t('researchNotesPage.table.sortBy')} ${t('researchNotesPage.table.notes')} ${sortField === 'notes' ? (sortOrder === 'desc' ? t('researchNotesPage.table.sortAscending') : t('researchNotesPage.table.sortDescending')) : t('researchNotesPage.table.sortDefault')}`}
                            >
                              {t('researchNotesPage.table.notes')}
                              <span className="text-xs text-gray-400 group-hover:text-white">
                                {sortField === 'notes' ? (sortOrder === 'desc' ? (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                ) : (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                )) : (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                  </svg>
                                )}
                              </span>
                            </button>
                          </th>
                          <th className="text-left py-2 px-3 text-gray-300 font-medium">
                            <button
                              onClick={() => handleSortChange('buyPrice')}
                              className="flex items-center gap-2 hover:text-white transition-colors group"
                              title={`${t('researchNotesPage.table.sortBy')} ${t('researchNotesPage.table.buyPrice')} ${sortField === 'buyPrice' ? (sortOrder === 'desc' ? t('researchNotesPage.table.sortAscending') : t('researchNotesPage.table.sortDescending')) : t('researchNotesPage.table.sortDefault')}`}
                            >
                              {t('researchNotesPage.table.buyPrice')}
                              <span className="text-xs text-gray-400 group-hover:text-white">
                                {sortField === 'buyPrice' ? (sortOrder === 'desc' ? (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                ) : (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                )) : (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                  </svg>
                                )}
                              </span>
                            </button>
                          </th>
                          <th className="text-left py-2 px-3 text-gray-300 font-medium">
                            <button
                              onClick={() => handleSortChange('sellPrice')}
                              className="flex items-center gap-2 hover:text-white transition-colors group"
                              title={`${t('researchNotesPage.table.sortBy')} ${t('researchNotesPage.table.sellPrice')} ${sortField === 'sellPrice' ? (sortOrder === 'desc' ? t('researchNotesPage.table.sortAscending') : t('researchNotesPage.table.sortDescending')) : t('researchNotesPage.table.sortDefault')}`}
                            >
                              {t('researchNotesPage.table.sellPrice')}
                              <span className="text-xs text-gray-400 group-hover:text-white">
                                {sortField === 'sellPrice' ? (sortOrder === 'desc' ? (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                ) : (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                )) : (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                  </svg>
                                )}
                              </span>
                            </button>
                          </th>
                          <th className="text-left py-2 px-3 text-gray-300 font-medium">
                            <button
                              onClick={() => handleSortChange('craftingCost')}
                              className="flex items-center gap-2 hover:text-white transition-colors group"
                              title={`${t('researchNotesPage.table.sortBy')} ${t('researchNotesPage.table.craftingCost')} ${sortField === 'craftingCost' ? (sortOrder === 'desc' ? t('researchNotesPage.table.sortAscending') : t('researchNotesPage.table.sortDescending')) : t('researchNotesPage.table.sortDefault')}`}
                            >
                              {t('researchNotesPage.table.craftingCost')}
                              <span className="text-xs text-gray-400 group-hover:text-white">
                                {sortField === 'craftingCost' ? (sortOrder === 'desc' ? (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                ) : (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                )) : (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                  </svg>
                                )}
                              </span>
                            </button>
                            <div className="mt-1 flex gap-2">
                              <button
                                onClick={() => setCraftingPriceSide('buy')}
                                className={`text-xs px-2 py-0.5 rounded ${craftingPriceSide === 'buy' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                              >
                                {t('researchNotesPage.table.buy')}
                              </button>
                              <button
                                onClick={() => setCraftingPriceSide('sell')}
                                className={`text-xs px-2 py-0.5 rounded ${craftingPriceSide === 'sell' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                              >
                                {t('researchNotesPage.table.sell')}
                              </button>
                            </div>
                          </th>
                          <th className="text-left py-2 px-2 text-gray-300 font-medium min-w-[100px]">
                            <button
                              onClick={() => handleSortChange('pricePerNote')}
                              className="flex items-center gap-1 hover:text-white transition-colors group"
                              title={`${t('researchNotesPage.table.sortBy')} ${t('researchNotesPage.table.pricePerNote')} ${sortField === 'pricePerNote' ? (sortOrder === 'desc' ? t('researchNotesPage.table.sortAscending') : t('researchNotesPage.table.sortDescending')) : t('researchNotesPage.table.sortDefault')}`}
                            >
                              {t('researchNotesPage.table.pricePerNote')}
                              <span className="text-xs text-gray-400 group-hover:text-white">
                                {sortField === 'pricePerNote' ? (sortOrder === 'desc' ? (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                ) : (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                  </svg>
                                )) : (
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                  </svg>
                                )}
                              </span>
                            </button>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                                                 {craftingDisciplines[0].items.map((item, itemIndex) => (
                           <tr key={itemIndex} className="border-b border-slate-600/30 hover:bg-slate-600/20">
                             <td className="py-2 px-3 text-white">
                               <div className="flex items-center gap-3">
                                 {item.id === 8883 && item8883?.icon ? (
                                   <img 
                                     src={item8883.icon} 
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
                                  ) : item.id === 104934 && item104934?.icon ? (
                                    <img 
                                      src={item104934.icon} 
                                      alt={item.name}
                                      className="w-8 h-8 rounded"
                                    />
                                  ) : item.id === 104934.1 && item104934B?.icon ? (
                                    <img 
                                      src={item104934B.icon} 
                                      alt={item.name}
                                      className="w-8 h-8 rounded"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 bg-slate-600 rounded"></div>
                                  )}
                                <span>{item.name}</span>
                              </div>
                            </td>
                                                                                                                                                                        <td className="py-2 px-3 text-gray-300 text-center">
                                {item.id === 8883 ? '400' : 
                                 item.id === 13436 ? '300' : 
                                 item.id === 13437 ? '300' : 
                                 item.id === 13435 ? '300' : 
                                 item.id === 104934 ? '0' : 
                                 item.id === 104934.1 ? '0' : '-'}
                              </td>
                            <td className="py-2 px-3 text-gray-300">{item.level}</td>
                            <td className="py-2 px-3 text-green-400 font-medium">{item.notes}</td>
                            <td className="py-2 px-3 text-blue-400 font-medium">
                              {item.buyPrice ? `${item.buyPrice}` : '-'}
                            </td>
                            <td className="py-2 px-3 text-green-400 font-medium">
                              {item.sellPrice ? `${item.sellPrice}` : '-'}
                            </td>
                                                        <td className="py-2 px-3 text-orange-400 font-medium">
                               {item.craftingCost ? `${item.craftingCost}` : '-'}
                             </td>
                                                          <td className="py-2 px-2 text-purple-400 font-medium min-w-[100px]">
                                {item.craftingCost && item.notes ? 
                                  formatGW2Price(Math.round(parseFloat(item.craftingCost.replace(/[^0-9.]/g, '')) / item.notes)) : 
                                  '-'}
                              </td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
         </motion.div>

         {/* Consejo Pro */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="bg-gradient-to-r from-blue-800/50 to-blue-700/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-blue-600/50">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
             <h3 className="text-lg font-semibold text-white">{t('researchNotesPage.tips')}</h3>
           </div>
           <p className="text-gray-200 leading-relaxed">
             {t('researchNotesPage.tip7')}
           </p>
         </motion.div>

         
       </div>
     </div>
   </>
 );
}
