'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, ChevronLeft, Package, Star, Zap, Coins, BarChart3, Shield, Sword, Gem } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Link from 'next/link';
import { formatPrice } from '@/lib/gw2-api';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';
import Image from 'next/image';

interface RewardItem {
  id: number;
  item: string;
  quantity?: string;
  count: number;
  chance?: string;
  icon?: string;
}

interface RewardSection {
  name: string;
  count: number;
  percentage: number;
  icon: any;
  itemIcon?: string | null;
  tableData: RewardItem[];
}

export default function FourWindsPrizeBagPage() {
  usePageTitle('pageTitles.fourWindsPrizeBag', 'Four Winds Prize Bag');
  const { t, lang } = useI18n();
  const [festivalToken, setFestivalToken] = useState<{name: string, icon: string} | null>(null);
  const [fourWindsBag, setFourWindsBag] = useState<{name: string, icon: string} | null>(null);
  const [embroideredPurse, setEmbroideredPurse] = useState<{name: string, icon: string} | null>(null);
  const [embroideredSaddlebag, setEmbroideredSaddlebag] = useState<{name: string, icon: string} | null>(null);
  const [gildedCoffer, setGildedCoffer] = useState<{name: string, icon: string} | null>(null);
  const [elaborateLeatherSack, setElaborateLeatherSack] = useState<{name: string, icon: string} | null>(null);
  const [luxuryEquipmentBox, setLuxuryEquipmentBox] = useState<{name: string, icon: string} | null>(null);
  const [skinsIcon, setSkinsIcon] = useState<string | null>(null);
  const [activeRewardSection, setActiveRewardSection] = useState<string>('monederos');
  const [itemDetails, setItemDetails] = useState<{[key: number]: {name: string, icon: string, price: number}}>({});
  const [sortBy, setSortBy] = useState<string>('count');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Función para formatear precios siempre con formato completo
  const formatPriceComplete = (price: number) => {
    const gold = Math.floor(price / 10000);
    const silver = Math.floor((price % 10000) / 100);
    const copper = price % 100;
    return `${gold.toString().padStart(2, '0')}g ${silver.toString().padStart(2, '0')}s ${copper.toString().padStart(2, '0')}c`;
  };

  // Función para calcular el total de oro de una sección
  const calculateSectionTotalValue = (section: any) => {
    return section.tableData.reduce((total: number, row: any) => {
      const itemPrice = itemDetails[row.id]?.price || 0;
      return total + (itemPrice * row.count);
    }, 0);
  };

  // Función para ordenar los datos de la tabla
  const sortTableData = (data: any[]) => {
    return [...data].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = itemDetails[a.id]?.name || `Item ${a.id}`;
          bValue = itemDetails[b.id]?.name || `Item ${b.id}`;
          break;
        case 'count':
          aValue = a.count;
          bValue = b.count;
          break;
        case 'price':
          aValue = itemDetails[a.id]?.price || 0;
          bValue = itemDetails[b.id]?.price || 0;
          break;
        case 'totalValue':
          aValue = (itemDetails[a.id]?.price || 0) * a.count;
          bValue = (itemDetails[b.id]?.price || 0) * b.count;
          break;
        case 'percentage':
          aValue = (a.count / rewardSections[activeRewardSection as keyof typeof rewardSections].count) * 100;
          bValue = (b.count / rewardSections[activeRewardSection as keyof typeof rewardSections].count) * 100;
          break;
        case 'droprate':
          aValue = a.count / rewardSections[activeRewardSection as keyof typeof rewardSections].count;
          bValue = b.count / rewardSections[activeRewardSection as keyof typeof rewardSections].count;
          break;
        default:
          return 0;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    });
  };

  // Función para manejar el clic en los headers
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };
  
  // Datos reales de las primeras 40k+ aperturas (suma de dos conjuntos de datos)
  const rewardSections: {[key: string]: RewardSection} = {
    monederos: {
      name: embroideredPurse ? `${embroideredPurse.name}` : 'Monederos',
      count: 13437,
      percentage: 33.28,
      icon: Package,
      itemIcon: embroideredPurse?.icon,
      tableData: [
        { id: 46731, item: '', count: 33867, chance: '100%' },
        { id: 84731, item: '', count: 6552, chance: '100%' },
        { id: 83008, item: '', count: 237, chance: '100%' },
        { id: 24288, item: '', count: 1061, chance: '100%' },
        { id: 24356, item: '', count: 1016, chance: '100%' },
        { id: 44960, item: '', count: 8, chance: '100%' },
        { id: 24299, item: '', count: 1017, chance: '100%' },
        { id: 44976, item: '', count: 5, chance: '100%' },
        { id: 19748, item: '', count: 1743, chance: '100%' },
        { id: 24341, item: '', count: 1006, chance: '100%' },
        { id: 19700, item: '', count: 2362, chance: '100%' },
        { id: 24282, item: '', count: 1028, chance: '100%' },
        { id: 19701, item: '', count: 842, chance: '100%' },
        { id: 19732, item: '', count: 287, chance: '100%' },
        { id: 19729, item: '', count: 894, chance: '100%' },
        { id: 24329, item: '', count: 82, chance: '100%' },
        { id: 24320, item: '', count: 10, chance: '100%' },
        { id: 24357, item: '', count: 103, chance: '100%' },
        { id: 24300, item: '', count: 89, chance: '100%' },
        { id: 19745, item: '', count: 321, chance: '100%' },
        { id: 24309, item: '', count: 59, chance: '100%' },
        { id: 24350, item: '', count: 1149, chance: '100%' },
        { id: 24324, item: '', count: 98, chance: '100%' },
        { id: 24358, item: '', count: 79, chance: '100%' },
        { id: 24319, item: '', count: 70, chance: '100%' },
        { id: 24294, item: '', count: 943, chance: '100%' },
        { id: 24295, item: '', count: 92, chance: '100%' },


      ]
    },
    alforjas: {
      name: embroideredSaddlebag ? embroideredSaddlebag.name : 'Alforjas bordadas',
      count: 6695,
      percentage: 16.58,
      icon: Package,
      itemIcon: embroideredSaddlebag?.icon,
      tableData: [
        
      ]
    },
    arcas: {
      name: gildedCoffer ? gildedCoffer.name : 'Arcas Chapadas',
      count: 6573,
      percentage: 16.28,
      icon: Package,
      itemIcon: gildedCoffer?.icon,
      tableData: [
       
      ]
    },
    morrales: {
      name: elaborateLeatherSack ? elaborateLeatherSack.name : 'Morrales de cuero',
      count: 6727,
      percentage: 16.66,
      icon: Package,
      itemIcon: elaborateLeatherSack?.icon,
      tableData: [
        
      ]
    },
    equipo: {
      name: luxuryEquipmentBox ? luxuryEquipmentBox.name : 'Equipo de lujo',
      count: 6568,
      percentage: 16.27,
      icon: Star,
      itemIcon: luxuryEquipmentBox?.icon,
      tableData: [
       
      ]
    },
    skins: {
      name: 'Skins',
      count: 381,
      percentage: 0.95,
      icon: Star,
      itemIcon: skinsIcon,
      tableData: [
      
      ]
    }
  };

  const totalOpened = 40000; // 20k + 20k aperturas
  const totalItems = 40381; // Suma total de todos los items
  const eventCoins = 550316 + 550378; // Chapas del evento

  // Función para obtener los items según el idioma
  const fetchItems = async (language: string) => {
    try {
      // Obtener todos los items en una sola consulta
        const response = await fetch(`https://api.guildwars2.com/v2/items?ids=66224,98586,64531,44252,89815,79082,44471,98632,46731,84731,83008,24288,24356,44960,24299,44976,19748,24341,19700,24282,19701,19732,19729,24329,24320,24357,24300,19745,24309,24350,24324,24358,24319,24294,24295&lang=${language}`);
      const data = await response.json();
      
      if (data && data.length >= 8) {
        // Festival Token (ID: 66224)
        const festivalTokenData = data.find((item: any) => item.id === 66224);
        if (festivalTokenData) {
          setFestivalToken({
            name: festivalTokenData.name,
            icon: festivalTokenData.icon
          });
        }
        
        // Four Winds Prize Bag (ID: 98586)
        const fourWindsData = data.find((item: any) => item.id === 98586);
        if (fourWindsData) {
          setFourWindsBag({
            name: fourWindsData.name,
            icon: fourWindsData.icon
          });
        }
        
        // Monedero bordado (ID: 64531)
        const embroideredPurseData = data.find((item: any) => item.id === 64531);
        if (embroideredPurseData) {
          setEmbroideredPurse({
            name: embroideredPurseData.name,
            icon: embroideredPurseData.icon
          });
        }
        
        // Alforja bordada (ID: 44252)
        const embroideredSaddlebagData = data.find((item: any) => item.id === 44252);
        if (embroideredSaddlebagData) {
          setEmbroideredSaddlebag({
            name: embroideredSaddlebagData.name,
            icon: embroideredSaddlebagData.icon
          });
        }
        
        // Arca chapada (ID: 89815)
        const gildedCofferData = data.find((item: any) => item.id === 89815);
        if (gildedCofferData) {
          setGildedCoffer({
            name: gildedCofferData.name,
            icon: gildedCofferData.icon
          });
        }
        
        // Morral de cuero elaborado (ID: 79082)
        const elaborateLeatherSackData = data.find((item: any) => item.id === 79082);
        if (elaborateLeatherSackData) {
          setElaborateLeatherSack({
            name: elaborateLeatherSackData.name,
            icon: elaborateLeatherSackData.icon
          });
        }
        
        // Caja de equipo de lujo (ID: 44471)
        const luxuryEquipmentBoxData = data.find((item: any) => item.id === 44471);
        if (luxuryEquipmentBoxData) {
          setLuxuryEquipmentBox({
            name: luxuryEquipmentBoxData.name,
            icon: luxuryEquipmentBoxData.icon
          });
        }
        
        // Mandoble mecánico (ID: 98632) - Solo para icono de Skins
        const skinsData = data.find((item: any) => item.id === 98632);
        if (skinsData) {
          setSkinsIcon(skinsData.icon);
        }
        
        // Silver coin (ID: 46731) - Para el primer item de Monederos
        const silverCoinData = data.find((item: any) => item.id === 46731);
        if (silverCoinData) {
          setItemDetails(prev => ({
            ...prev,
            46731: {
              name: silverCoinData.name,
              icon: silverCoinData.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 84731 - Para el segundo item de Monederos
        const item84731Data = data.find((item: any) => item.id === 84731);
        if (item84731Data) {
          setItemDetails(prev => ({
            ...prev,
            84731: {
              name: item84731Data.name,
              icon: item84731Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 83008 - Para el tercer item de Monederos
        const item83008Data = data.find((item: any) => item.id === 83008);
        if (item83008Data) {
          setItemDetails(prev => ({
            ...prev,
            83008: {
              name: item83008Data.name,
              icon: item83008Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 24288 - Para el cuarto item de Monederos
        const item24288Data = data.find((item: any) => item.id === 24288);
        if (item24288Data) {
          setItemDetails(prev => ({
            ...prev,
            24288: {
              name: item24288Data.name,
              icon: item24288Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 24356 - Para el quinto item de Monederos
        const item24356Data = data.find((item: any) => item.id === 24356);
        if (item24356Data) {
          setItemDetails(prev => ({
            ...prev,
            24356: {
              name: item24356Data.name,
              icon: item24356Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 44960 - Para el sexto item de Monederos
        const item44960Data = data.find((item: any) => item.id === 44960);
        if (item44960Data) {
          setItemDetails(prev => ({
            ...prev,
            44960: {
              name: item44960Data.name,
              icon: item44960Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 24299 - Para el séptimo item de Monederos
        const item24299Data = data.find((item: any) => item.id === 24299);
        if (item24299Data) {
          setItemDetails(prev => ({
            ...prev,
            24299: {
              name: item24299Data.name,
              icon: item24299Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 44976 - Para el octavo item de Monederos
        const item44976Data = data.find((item: any) => item.id === 44976);
        if (item44976Data) {
          setItemDetails(prev => ({
            ...prev,
            44976: {
              name: item44976Data.name,
              icon: item44976Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 19748 - Para el noveno item de Monederos
        const item19748Data = data.find((item: any) => item.id === 19748);
        if (item19748Data) {
          setItemDetails(prev => ({
            ...prev,
            19748: {
              name: item19748Data.name,
              icon: item19748Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 24341 - Para el décimo item de Monederos
        const item24341Data = data.find((item: any) => item.id === 24341);
        if (item24341Data) {
          setItemDetails(prev => ({
            ...prev,
            24341: {
              name: item24341Data.name,
              icon: item24341Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 19700 - Para el undécimo item de Monederos
        const item19700Data = data.find((item: any) => item.id === 19700);
        if (item19700Data) {
          setItemDetails(prev => ({
            ...prev,
            19700: {
              name: item19700Data.name,
              icon: item19700Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 24282 - Para el duodécimo item de Monederos
        const item24282Data = data.find((item: any) => item.id === 24282);
        if (item24282Data) {
          setItemDetails(prev => ({
            ...prev,
            24282: {
              name: item24282Data.name,
              icon: item24282Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 19701 - Para el decimotercer item de Monederos
        const item19701Data = data.find((item: any) => item.id === 19701);
        if (item19701Data) {
          setItemDetails(prev => ({
            ...prev,
            19701: {
              name: item19701Data.name,
              icon: item19701Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 19732 - Para el decimocuarto item de Monederos
        const item19732Data = data.find((item: any) => item.id === 19732);
        if (item19732Data) {
          setItemDetails(prev => ({
            ...prev,
            19732: {
              name: item19732Data.name,
              icon: item19732Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 19729 - Para el decimoquinto item de Monederos
        const item19729Data = data.find((item: any) => item.id === 19729);
        if (item19729Data) {
          setItemDetails(prev => ({
            ...prev,
            19729: {
              name: item19729Data.name,
              icon: item19729Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 24329 - Para el decimosexto item de Monederos
        const item24329Data = data.find((item: any) => item.id === 24329);
        if (item24329Data) {
          setItemDetails(prev => ({
            ...prev,
            24329: {
              name: item24329Data.name,
              icon: item24329Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 24320 - Para el decimoséptimo item de Monederos
        const item24320Data = data.find((item: any) => item.id === 24320);
        if (item24320Data) {
          setItemDetails(prev => ({
            ...prev,
            24320: {
              name: item24320Data.name,
              icon: item24320Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 24357 - Para el decimoctavo item de Monederos
        const item24357Data = data.find((item: any) => item.id === 24357);
        if (item24357Data) {
          setItemDetails(prev => ({
            ...prev,
            24357: {
              name: item24357Data.name,
              icon: item24357Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 24300 - Para el decimonoveno item de Monederos
        const item24300Data = data.find((item: any) => item.id === 24300);
        if (item24300Data) {
          setItemDetails(prev => ({
            ...prev,
            24300: {
              name: item24300Data.name,
              icon: item24300Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 19745 - Para el vigésimo item de Monederos
        const item19745Data = data.find((item: any) => item.id === 19745);
        if (item19745Data) {
          setItemDetails(prev => ({
            ...prev,
            19745: {
              name: item19745Data.name,
              icon: item19745Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 24309 - Para el vigésimo primer item de Monederos
        const item24309Data = data.find((item: any) => item.id === 24309);
        if (item24309Data) {
          setItemDetails(prev => ({
            ...prev,
            24309: {
              name: item24309Data.name,
              icon: item24309Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 24350 - Para el vigésimo segundo item de Monederos
        const item24350Data = data.find((item: any) => item.id === 24350);
        if (item24350Data) {
          setItemDetails(prev => ({
            ...prev,
            24350: {
              name: item24350Data.name,
              icon: item24350Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 24324 - Para el vigésimo tercer item de Monederos
        const item24324Data = data.find((item: any) => item.id === 24324);
        if (item24324Data) {
          setItemDetails(prev => ({
            ...prev,
            24324: {
              name: item24324Data.name,
              icon: item24324Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 24358 - Para el vigésimo cuarto item de Monederos
        const item24358Data = data.find((item: any) => item.id === 24358);
        if (item24358Data) {
          setItemDetails(prev => ({
            ...prev,
            24358: {
              name: item24358Data.name,
              icon: item24358Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 24319 - Para el vigésimo quinto item de Monederos
        const item24319Data = data.find((item: any) => item.id === 24319);
        if (item24319Data) {
          setItemDetails(prev => ({
            ...prev,
            24319: {
              name: item24319Data.name,
              icon: item24319Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 24294 - Para el vigésimo sexto item de Monederos
        const item24294Data = data.find((item: any) => item.id === 24294);
        if (item24294Data) {
          setItemDetails(prev => ({
            ...prev,
            24294: {
              name: item24294Data.name,
              icon: item24294Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
        
        // Item ID 24295 - Para el vigésimo séptimo item de Monederos
        const item24295Data = data.find((item: any) => item.id === 24295);
        if (item24295Data) {
          setItemDetails(prev => ({
            ...prev,
            24295: {
              name: item24295Data.name,
              icon: item24295Data.icon,
              price: 0 // Se actualizará con fetchItemPrices
            }
          }));
        }
      }
    } catch (error) {
      // Error fetching items
    }
  };

  // Función para obtener precios de los items
  const fetchItemPrices = async () => {
    try {
        const itemIds = [46731, 84731, 83008, 24288, 24356, 44960, 24299, 44976, 19748, 24341, 19700, 24282, 19701, 19732, 19729, 24329, 24320, 24357, 24300, 19745, 24309, 24350, 24324, 24358, 24319, 24294, 24295]; // Agregar más IDs según sea necesario
      const response = await fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${itemIds.join(',')}`);
      const prices = await response.json();
      
      const priceData: {[key: number]: number} = {};
      const itemsWithoutPrice: number[] = [];
      
      prices.forEach((price: any) => {
        // Intentar obtener precio de venta primero, si no existe, usar precio de compra
        if (price.sells && price.sells.unit_price) {
          priceData[price.id] = price.sells.unit_price;
        } else if (price.buys && price.buys.unit_price) {
          priceData[price.id] = price.buys.unit_price;
        } else {
          itemsWithoutPrice.push(price.id);
        }
      });
      
      if (itemsWithoutPrice.length > 0) {
        // Items sin precio disponible
      }
      
      setItemDetails(prev => {
        const updated = {...prev};
        Object.keys(priceData).forEach(id => {
          if (updated[parseInt(id)]) {
            updated[parseInt(id)].price = priceData[parseInt(id)];
          }
        });
        return updated;
      });
    } catch (error) {
      // Error fetching item prices
    }
  };

  // Efecto para cargar los items cuando cambie el idioma
  useEffect(() => {
    if (lang) {
      fetchItems(lang);
    }
  }, [lang]);

  // Efecto para cargar precios después de cargar items
  useEffect(() => {
    if (Object.keys(itemDetails).length > 0) {
      fetchItemPrices();
    }
  }, [itemDetails]);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
                {fourWindsBag ? (
                  <img 
                    src={fourWindsBag.icon} 
                    alt={fourWindsBag.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                <Gift className="h-8 w-8 text-white" />
                )}
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {fourWindsBag ? fourWindsBag.name : 'Four Winds Prize Bag'}
              </h1>
            </motion.div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Análisis basado en 40,000+ aperturas reales
            </p>
          </div>

          {/* Botón de regreso */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Link href="/opened" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
              <ChevronLeft className="w-5 h-5 mr-1" />
              Volver a Contenedores
            </Link>
          </motion.div>

          {/* Estadísticas Generales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
          >
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-md flex items-center justify-center shadow-sm">
                  <BarChart3 className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold text-white">Aperturas</h3>
              </div>
              <p className="text-2xl font-bold text-blue-400">{totalOpened.toLocaleString()}</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-lg p-4 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-md flex items-center justify-center shadow-sm">
                  <Package className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-base font-bold text-white">Total Items</h3>
              </div>
              <p className="text-2xl font-bold text-orange-400">{totalItems.toLocaleString()}</p>
            </div>
            
            
            
             <div className="bg-gradient-to-br from-yellow-500/20 to-amber-500/20 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 shadow-md">
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-8 h-8 rounded-md flex items-center justify-center shadow-sm overflow-hidden">
                   {festivalToken ? (
                     <img 
                       src={festivalToken.icon} 
                       alt={festivalToken.name} 
                       className="w-full h-full object-cover"
                     />
                   ) : (
                     <Coins className="w-4 h-4 text-white" />
                   )}
                 </div>
                 <h3 className="text-base font-bold text-white">
                   {festivalToken ? festivalToken.name : 'Cargando...'}
                 </h3>
              </div>
               <p className="text-2xl font-bold text-yellow-400">{eventCoins.toLocaleString()}</p>
            </div>
             
          </motion.div>

          {/* Análisis de Recompensas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl p-6 border border-slate-600/50"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Análisis de Recompensas
            </h2>
            
            {/* Section Navigation */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-2 shadow-2xl w-full max-w-4xl">
                <div className="flex flex-wrap justify-center gap-2">
                  {Object.entries(rewardSections).map(([key, section]) => (
                    <button
                      key={key}
                      onClick={() => setActiveRewardSection(key)}
                      className={`px-3 sm:px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold transition-all duration-200 text-sm md:text-base ${
                        activeRewardSection === key
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      {section.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content based on active section */}
            {Object.entries(rewardSections).map(([key, section]) => (
              activeRewardSection === key && (
                  <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Section Header */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center overflow-hidden">
                        {section.itemIcon ? (
                          <img 
                            src={section.itemIcon} 
                            alt={section.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <section.icon className="w-8 h-8 text-white" />
                        )}
                        </div>
                        <div className="text-center">
                        <h3 className="text-2xl font-bold text-white">{section.name}</h3>
                        </div>
                      </div>
                      
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                       <div className="bg-purple-500/20 rounded-lg p-4">
                         <div className="text-3xl font-bold text-purple-400">{section.count.toLocaleString()}</div>
                         <div className="text-sm text-gray-300">Items Obtenidos</div>
                       </div>
                       <div className="bg-pink-500/20 rounded-lg p-4">
                         <div className="text-3xl font-bold text-pink-400">{section.percentage.toFixed(2)}%</div>
                         <div className="text-sm text-gray-300">Probabilidad</div>
                       </div>
                       <div className="bg-green-500/20 rounded-lg p-4">
                         <div className="text-3xl font-bold text-green-400">
                           {formatPriceComplete(calculateSectionTotalValue(section))}
                         </div>
                         <div className="text-sm text-gray-300">Valor Total</div>
                       </div>
                     </div>
                  </div>

                   {/* Tabla de Contenidos - Estilo Fractales */}
                   <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
                     <div className="p-6 border-b border-gray-700">
                       <h4 className="text-2xl font-bold text-white flex items-center">
                         <Package className="w-6 h-6 mr-3 text-green-400" />
                         Contenido del Contenedor - Análisis de Box Opening
                       </h4>
                     </div>
                     <div className="overflow-x-auto">
                       <table className="w-full text-sm">
                         <thead>
                           <tr className="border-b border-gray-700 bg-gray-800/60">
                             <th 
                               className="text-left p-3 text-gray-200 font-semibold cursor-pointer hover:bg-gray-700/60 transition-colors select-none"
                               onClick={() => handleSort('name')}
                             >
                               <div className="flex items-center gap-2">
                                 Item
                                 <div className="flex flex-col text-xs text-gray-500">
                                   <span className={sortBy === 'name' && sortDirection === 'asc' ? 'text-blue-400' : 'text-gray-500'}>↑</span>
                                 </div>
                               </div>
                             </th>
                             <th 
                               className="text-center p-3 text-gray-200 font-semibold cursor-pointer hover:bg-gray-700/60 transition-colors select-none"
                               onClick={() => handleSort('count')}
                             >
                               <div className="flex items-center justify-center gap-2">
                                 Cantidad Obtenida
                                 <div className="flex flex-col text-xs text-gray-500">
                                   <span className={sortBy === 'count' && sortDirection === 'asc' ? 'text-blue-400' : 'text-gray-500'}>↑</span>
                                 </div>
                               </div>
                             </th>
                             <th 
                               className="text-center p-3 text-gray-200 font-semibold cursor-pointer hover:bg-gray-700/60 transition-colors select-none"
                               onClick={() => handleSort('price')}
                             >
                               <div className="flex items-center justify-center gap-2">
                                 Precio Actual
                                 <div className="flex flex-col text-xs text-gray-500">
                                   <span className={sortBy === 'price' && sortDirection === 'asc' ? 'text-blue-400' : 'text-gray-500'}>↑</span>
                                 </div>
                               </div>
                             </th>
                             <th 
                               className="text-center p-3 text-gray-200 font-semibold cursor-pointer hover:bg-gray-700/60 transition-colors select-none"
                               onClick={() => handleSort('totalValue')}
                             >
                               <div className="flex items-center justify-center gap-2">
                                 Valor Total Ganado
                                 <div className="flex flex-col text-xs text-gray-500">
                                   <span className={sortBy === 'totalValue' && sortDirection === 'asc' ? 'text-blue-400' : 'text-gray-500'}>↑</span>
                                 </div>
                               </div>
                             </th>
                             <th 
                               className="text-center p-3 text-gray-200 font-semibold cursor-pointer hover:bg-gray-700/60 transition-colors select-none"
                               onClick={() => handleSort('percentage')}
                             >
                               <div className="flex items-center justify-center gap-2">
                                 Porcentaje de Caída
                                 <div className="flex flex-col text-xs text-gray-500">
                                   <span className={sortBy === 'percentage' && sortDirection === 'asc' ? 'text-blue-400' : 'text-gray-500'}>↑</span>
                                 </div>
                               </div>
                             </th>
                           </tr>
                         </thead>
                         <tbody>
                           {sortTableData(section.tableData).map((row, idx) => {

                             return (
                               <tr key={idx} className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
                                 <td className="p-3 text-white">
                                   <div className="flex items-center gap-3">
                                     {itemDetails[row.id]?.icon ? (
                                       <img
                                         src={itemDetails[row.id].icon}
                                         alt={itemDetails[row.id].name}
                                         width={32}
                                         height={32}
                                         className="rounded"
                                       />
                                     ) : (
                                       <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                                         <span className="text-xs text-gray-400">?</span>
                        </div>
                                     )}
                                     <div>
                                       <div className="font-medium">
                                         {itemDetails[row.id]?.name || row.item}
                        </div>
                      </div>
                    </div>
                                 </td>
                                 <td className="p-3 text-center">
                                   <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                                     row.count > 5000 
                                       ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                       : row.count > 1000
                                       ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                       : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                   }`}>
                                     {row.count.toLocaleString()}
                                   </span>
                                 </td>
                                   <td className="p-3 text-center text-gray-300">
                                    {itemDetails[row.id]?.price ? formatPriceComplete(itemDetails[row.id].price) : '-'}
                                   </td>
                                   <td className="p-3 text-center text-gray-300">
                                    {itemDetails[row.id]?.price ? formatPriceComplete(itemDetails[row.id].price * row.count) : '-'}
                                   </td>
                                 <td className="p-3 text-center">
                                   <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                                     (row.count / section.count * 100) > 20 
                                       ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                       : (row.count / section.count * 100) > 10
                                       ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                       : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                   }`}>
                                     {(row.count / section.count * 100).toFixed(2)}%
                                   </span>
                                 </td>
                               </tr>
                );
              })}
                         </tbody>
                       </table>
                     </div>
            </div>
                </motion.div>
              )
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
