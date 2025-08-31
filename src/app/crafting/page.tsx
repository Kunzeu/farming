'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import Image from 'next/image';
import Link from 'next/link';
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
  usePageTitle('pageTitles.crafting', 'Crafting Guide');
  const { t, lang } = useI18n();
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const [conversionData, setConversionData] = useState<ConversionItem[]>([]);
  const [isLoadingConversions, setIsLoadingConversions] = useState(false);
  const [itemPrices, setItemPrices] = useState<Record<number, Gw2Price>>({});
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [lastPriceUpdate, setLastPriceUpdate] = useState<Date | null>(null);


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

  // IDs de los items en las tablas
  const tableItemIds = useMemo(() => [
    // Trofeos Raros (T6)
    24295, 24358, 24351, 24357, 24289, 24300, 24283, 24277,
    // Trofeos Comunes (T5)
    24294, 24341, 24350, 24356, 24288, 24299, 24282, 24276,
    // Items para cálculos adicionales
    24591, 19701, 97102, 19721,
    // Items para research notes
    24277, 24351, 24300, 12156, 24473, 19700, 24519, 24511, 24475, 19722, 19729, 19748, 68063,
    // Item 97535 para cálculo final
    97535
  ], []);

  // Función para calcular precio del item 24591 × 1 (buy)
  const calculateItem24591Price = useCallback(() => {
    if (!itemPrices || !itemPrices[24591]) return 0;
    
    const item = itemPrices[24591];
    const buyPrice = item.buys?.unit_price || 0;
    
    // Convertir de cobre a oro (10000 cobre = 1 oro)
    const priceInGold = buyPrice / 10000;
    
    return priceInGold;
  }, [itemPrices]);

  // Función para calcular precio del item 19701 × 16 (buy)
  const calculateItem19701Price = useCallback(() => {
    if (!itemPrices || !itemPrices[19701]) return 0;
    
    const item = itemPrices[19701];
    const buyPrice = item.buys?.unit_price || 0;
    
    // Convertir de cobre a oro (10000 cobre = 1 oro) y multiplicar por 16
    const priceInGold = (buyPrice * 16) / 10000;
    
    return priceInGold;
  }, [itemPrices]);

  // Función para calcular precio del item 24295 × 1 (sell × 0.9)
  const calculateItem24295Price = useCallback(() => {
    if (!itemPrices || !itemPrices[24295]) return 0;
    
    const item = itemPrices[24295];
    const sellPrice = item.sells?.unit_price || 0;
    
    // Convertir de cobre a oro (10000 cobre = 1 oro) y multiplicar por 0.9
    const priceInGold = (sellPrice * 0.9) / 10000;
        
    return priceInGold;
  }, [itemPrices]);

  // Función para calcular precio del item 97102 × 4 (buy)
  const calculateItem97102Price = useCallback(() => {
    if (!itemPrices || !itemPrices[97102]) return 0;
    
    const item = itemPrices[97102];
    const buyPrice = item.buys?.unit_price || 0;
    
    // Convertir de cobre a oro (10000 cobre = 1 oro) y multiplicar por 4
    const priceInGold = (buyPrice * 8) / 10000;
        
    return priceInGold;
  }, [itemPrices]);

  // Función para calcular precio del item 19721 × 2 (sell × 0.9)
  const calculateItem19721Price = useCallback(() => {
    if (!itemPrices || !itemPrices[19721]) return 0;
    
    const item = itemPrices[19721];
    const sellPrice = item.sells?.unit_price || 0;
    
    // Convertir de cobre a oro (10000 cobre = 1 oro) y multiplicar por 2 × 0.9
    const priceInGold = (sellPrice * 4 * 0.9) / 10000;
    
    return priceInGold;
  }, [itemPrices]);

  // Función para calcular precio del item 19701 × 10 (buy)
  const calculateItem19701x10Price = useCallback(() => {
    if (!itemPrices || !itemPrices[19701]) return 0;
    
    const item = itemPrices[19701];
    const buyPrice = item.buys?.unit_price || 0;
    
    // Convertir de cobre a oro (10000 cobre = 1 oro) y multiplicar por 10
    const priceInGold = (buyPrice * 20) / 10000;
    
    return priceInGold;
  }, [itemPrices]);

  // Función para calcular el precio total para obtener 97487
  const calculateTotalPriceFor97487 = useCallback(() => {
    const precio97102 = calculateItem97102Price();
    const precio19721 = calculateItem19721Price();
    const precio19701x10 = calculateItem19701x10Price();
    
    // Sumar los 3 valores
    const precioTotal = precio97102 + precio19721 + precio19701x10;
    
    return precioTotal;
  }, [calculateItem97102Price, calculateItem19721Price, calculateItem19701x10Price]);

  // Función para obtener el precio por nota más bajo (calculado)
  const getLowestPricePerNote = useCallback(() => {
    // Calcular el precio por nota más bajo basándose en los items disponibles
    // Usar los mismos IDs que están en research-notes
    
    if (!itemPrices || Object.keys(itemPrices).length === 0) return 0;
    
    // IDs de los items de research-notes que necesitamos
    const researchNoteItems = [
      { id: 8883, notes: 1.1, materials: [24277, 24351, 24300, 12156] },
      { id: 13436, notes: 5.1, materials: [24473, 19700] },
      { id: 13437, notes: 5.1, materials: [24519, 19700] },
      { id: 13435, notes: 5.1, materials: [24511, 19700] },
      { id: 13438, notes: 5.1, materials: [19700, 24475] },
      { id: 104934, notes: 150, materials: [19722, 19700, 19748, 68063] },
      { id: 104934.1, notes: 150, materials: [19729, 19700, 19748, 68063] }
    ];
    
    let lowestPricePerNote = Infinity;
    
    researchNoteItems.forEach(item => {
      // Calcular el costo total de crafting para este item
      let totalCost = 0;
      
      if (item.id === 8883) {
        // 24277, 24351, 24300, 12156 x1 cada uno
        totalCost = (itemPrices[24277]?.buys?.unit_price || 0) * 1 + 
                   (itemPrices[24351]?.buys?.unit_price || 0) * 1 + 
                   (itemPrices[24300]?.buys?.unit_price || 0) * 1 + 
                   (itemPrices[12156]?.buys?.unit_price || 0) * 1;
      } else if (item.id === 13436) {
        // 24473 x1 y 19700 x8
        totalCost = (itemPrices[24473]?.buys?.unit_price || 0) * 1 + 
                   (itemPrices[19700]?.buys?.unit_price || 0) * 8;
      } else if (item.id === 13437) {
        // 24519 x1 y 19700 x8
        totalCost = (itemPrices[24519]?.buys?.unit_price || 0) * 1 + 
                   (itemPrices[19700]?.buys?.unit_price || 0) * 8;
      } else if (item.id === 13435) {
        // 24511 x1 y 19700 x8
        totalCost = (itemPrices[24511]?.buys?.unit_price || 0) * 1 + 
                   (itemPrices[19700]?.buys?.unit_price || 0) * 8;
      } else if (item.id === 13438) {
        // 19700 x8 y 24475 x1
        totalCost = (itemPrices[19700]?.buys?.unit_price || 0) * 8 + 
                   (itemPrices[24475]?.buys?.unit_price || 0) * 1;
      } else if (item.id === 104934) {
        // 19722 x30, 19700 x20, 19748 x30, 68063 x1
        totalCost = (itemPrices[19722]?.buys?.unit_price || 0) * 30 + 
                   (itemPrices[19700]?.buys?.unit_price || 0) * 20 + 
                   (itemPrices[19748]?.buys?.unit_price || 0) * 30 + 
                   (itemPrices[68063]?.buys?.unit_price || 0) * 1;
      } else if (item.id === 104934.1) {
        // 19729 x40, 19700 x20, 19748 x30, 68063 x1
        totalCost = (itemPrices[19729]?.buys?.unit_price || 0) * 40 + 
                   (itemPrices[19700]?.buys?.unit_price || 0) * 20 + 
                   (itemPrices[19748]?.buys?.unit_price || 0) * 30 + 
                   (itemPrices[68063]?.buys?.unit_price || 0) * 1;
      }
      
      // Calcular precio por nota
      const pricePerNote = totalCost / item.notes;
      
      // Convertir de cobre a oro
      const pricePerNoteInGold = pricePerNote / 10000;
      
      if (pricePerNoteInGold < lowestPricePerNote && pricePerNoteInGold > 0) {
        lowestPricePerNote = pricePerNoteInGold;
      }
    });
    
    return lowestPricePerNote === Infinity ? 0 : lowestPricePerNote;
  }, [itemPrices]);

  // Función para calcular el precio total × 30 notas
  const calculateTotalWithNotes = useCallback(() => {
    const precio97487 = calculateTotalPriceFor97487();
    const precioPorNota = getLowestPricePerNote();
    
    // Sumar: precio de 97487 + (precio por nota × 60)
    const precioTotal = precio97487 + (precioPorNota * 60);
    

    
    return precioTotal;
  }, [calculateTotalPriceFor97487, getLowestPricePerNote]);

  // Función para calcular el precio de 97535 (sell × 0.85)
  const calculateItem97535Price = useCallback(() => {
    if (!itemPrices || !itemPrices[97535]) return 0;
    const item = itemPrices[97535];
    const sellPrice = item.sells?.unit_price || 0;
    const priceInGold = (sellPrice * 0.85) / 10000;
    
    return priceInGold;
  }, [itemPrices]);

  // Función para calcular la SUMA COMPLETA (Suma Total + TOTAL FINAL)
  const calculateSumaCompleta = useCallback(() => {
    const sumaTotal = calculateItem24591Price() + calculateItem19701Price() + calculateItem24295Price();
    const totalFinal = calculateTotalWithNotes();
    const sumaCompleta = sumaTotal + totalFinal;
    
    return sumaCompleta;
  }, [calculateItem24591Price, calculateItem19701Price, calculateItem24295Price, calculateTotalWithNotes]);

  // Función para calcular el RESULTADO FINAL (SUMA COMPLETA - 97535)
  const calculateResultadoFinal = useCallback(() => {
    const sumaCompleta = calculateSumaCompleta();
    const precio97535 = calculateItem97535Price();
    const resultadoFinal = precio97535 - sumaCompleta;
    
    return resultadoFinal;
  }, [calculateSumaCompleta, calculateItem97535Price]);

  // Función para calcular el RESULTADO FINAL CON DROPRATE (fórmula de Excel)
  const calculateResultadoFinalConDroprate = useCallback(() => {
    const resultadoFinal = calculateResultadoFinal();
    const droprate = 1.0078; // VM-UM'!B5
    
    // Fórmula de Excel: =SI('Crafting 3'!S36>=1,('VM-UM'!B5*('Crafting 3'!S36)),"0")
    let resultadoConDroprate = 0;
    
    if (resultadoFinal >= 1) {
      resultadoConDroprate = droprate * resultadoFinal;
    } else {
    }
    
    return resultadoConDroprate;
  }, [calculateResultadoFinal]);

  // Función para calcular la suma total de ProfitMax de todas las secciones
  const calculateTotalProfitMax = useCallback(() => {
    // ProfitMax de Raros (primera columna)
    const profitMaxRaros = calculateResultadoFinalConDroprate();
    
    // ProfitMax de Comunes (valores fijos de la tabla)
    const profitMaxComunes = 1.1865 + 0.0527 + 0.1279 + 0.0657 + 0.2904; // Suma de los valores de la tabla
    
    const totalProfitMax = profitMaxRaros + profitMaxComunes;

    
    return totalProfitMax;
  }, [calculateResultadoFinalConDroprate]);

  // Función para obtener precios de los items de las tablas
  const fetchTableItemPrices = useCallback(async () => {
    setIsLoadingPrices(true);
    try {
      const pricesResponse = await fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${tableItemIds.join(',')}`);
      const prices = await pricesResponse.json();
      
      const pricesMap = prices.reduce((acc: Record<number, Gw2Price>, price: Gw2Price) => {
        acc[price.id] = price;
        return acc;
      }, {} as Record<number, Gw2Price>);
      
      setItemPrices(pricesMap);
      setLastPriceUpdate(new Date());
      
      // Debug: mostrar qué precios se cargaron
    } catch (error) {
      console.error('Error fetching table item prices:', error);
    } finally {
      setIsLoadingPrices(false);
    }
    
  }, [tableItemIds]);

  // Cargar precios de los items de las tablas al montar el componente y cada 5 minutos
  useEffect(() => {
    // Cargar precios inmediatamente al montar
    fetchTableItemPrices();
    
    // Actualizar precios cada 5 minutos
    const interval = setInterval(() => {
      fetchTableItemPrices();
    }, 5 * 60 * 1000); // 5 minutos = 300,000 ms
    
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [fetchTableItemPrices]);

  // IDs de items por tabla
  const trofeosRarosIds = useMemo(() => [24295, 24358, 24351, 24357, 24289, 24300, 24283, 24277], []);
  const trofeosComunesIds = useMemo(() => [24294, 24341, 24350, 24356, 24288, 24299, 24282, 24276], []);

  // Función para calcular precio base: sell * 0.9 * droprate (para trofeos raros)
  const calculateBasePrice = useCallback((itemId: number, droprate: number) => {
    const price = itemPrices[itemId];
    if (!price || !price.sells || !price.sells.unit_price) return 0;
    
    // sell * 0.9 * droprate (convertir de cobre a oro)
    const basePrice = (price.sells.unit_price * 0.9 * droprate) / 10000; // 10000 cobre = 1 oro
    return basePrice;
  }, [itemPrices]);

  // Función para calcular precio base: sell * 0.9 * droprate (para trofeos comunes)
  const calculateBasePriceComunes = useCallback((itemId: number, droprate: number) => {
    const price = itemPrices[itemId];
    if (!price || !price.sells || !price.sells.unit_price) return 0;
    
    // sell * 0.9 * droprate (convertir de cobre a oro)
    const basePrice = (price.sells.unit_price * 0.9 * droprate) / 10000; // 10000 cobre = 1 oro
    return basePrice;
  }, [itemPrices]);

  // Función para formatear precio en formato GW2
  const formatGW2Price = useCallback((priceInGold: number) => {
    if (priceInGold === 0 || priceInGold < 0.0001) return '00G 00S 00C';
    
    const gold = Math.floor(priceInGold);
    const silver = Math.floor((priceInGold - gold) * 100);
    const copper = Math.floor(((priceInGold - gold) * 100 - silver) * 100);
    
    // Siempre mostrar formato completo con ceros
    const formattedGold = gold.toString().padStart(2, '0');
    const formattedSilver = silver.toString().padStart(2, '0');
    const formattedCopper = copper.toString().padStart(2, '0');
    
    return `${formattedGold}G ${formattedSilver}S ${formattedCopper}C`;
  }, []);

  // Función para calcular el total de PrecioBASE de una tabla
  const calculateTableTotal = useCallback((itemIds: number[], droprate: number, isComunes: boolean = false) => {
    let total = 0;
    itemIds.forEach(itemId => {
      if (isComunes) {
        total += calculateBasePriceComunes(itemId, droprate);
      } else {
        total += calculateBasePrice(itemId, droprate);
      }
    });
    return total;
  }, [calculateBasePrice, calculateBasePriceComunes]);

  const fetchConversionCalculations = useCallback(async () => {
    setIsLoadingConversions(true);
    try {
      // Get prices from GW2 API
      const pricesResponse = await fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${allConversionItemIds.join(',')}`);
      const prices = await pricesResponse.json();
      
      // Get item details (names and icons) with language support
      const itemsResponse = await fetch(`https://api.guildwars2.com/v2/items?ids=${allConversionItemIds.join(',')}&lang=${lang}`);
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
  }, [allConversionItemIds, conversionMaterials.ectoplasm, conversionMaterials.crystallineDust, t6Materials, lang]);

  useEffect(() => {
    if (selectedSection === 'conversions') {
      fetchConversionCalculations();
    }
  }, [selectedSection, fetchConversionCalculations]);

  // Función para color de ganancia con gradación progresiva - OPTIMIZADA
  const getProfitColor = useCallback((profit: number) => {
    if (profit <= 0) return 'bg-red-600';                    // Pérdida
    
    // Calcular el 50% del profit máximo para gradación
    const maxProfit = Math.max(...conversionData.map(item => Math.max(item.profit90, item.profit85)));
    const fiftyPercent = maxProfit * 0.5;
    
    if (profit >= fiftyPercent) return 'bg-green-500';        // Top 50%
    if (profit >= fiftyPercent * 0.5) return 'bg-yellow-500'; // 25-50%
    return 'bg-orange-500';                                   // 0-25%
  }, [conversionData]);

  // Memoizar los datos de conversión para evitar re-renders
  const memoizedConversionData = useMemo(() => conversionData, [conversionData]);

  // Memoizar las funciones de cálculo para evitar re-renders
  const memoizedFormatGoldSilverCopperJSX = useCallback((copper: number) => {
    const sign = copper < 0 ? '-' : '';
    const absCopper = Math.abs(copper);
    const gold = Math.floor(absCopper / 10000);
    const silver = Math.floor((absCopper % 10000) / 100);
    const copperRemainder = absCopper % 100;
    
    const goldStr = gold.toString().padStart(2, '0');
    const silverStr = silver.toString().padStart(2, '0');
    const copperStr = copperRemainder.toString().padStart(2, '0');
    
    return (
      <span style={{ 
        display: 'inline-flex', 
        whiteSpace: 'nowrap', 
        wordBreak: 'keep-all',
        flexWrap: 'nowrap',
        alignItems: 'center',
        gap: '2px'
      }}>
        {sign}{goldStr}G {silverStr}S {copperStr}C
      </span>
    );
  }, []);

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
      <style jsx global>{`
        .font-display {
          font-display: swap;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-weight: 900;
          text-rendering: optimizeSpeed;
          letter-spacing: -0.025em;
        }
        
        /* Optimizaciones para mejorar LCP */
        .text-white.font-black {
          text-rendering: optimizeSpeed;
          font-display: swap;
        }
        
        /* Optimizar renderizado de tablas */
        table {
          contain: layout style paint;
        }
        
        /* Optimizar animaciones */
        .motion-div {
          will-change: transform, opacity;
        }
      `}</style>
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
                            { id: 'materials', label: 'Magia Volatil', icon: Package },
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
                <tab.icon className="w-5 h-5" />
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
                    <Info className="w-8 h-8 mr-3 text-blue-400" />
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
                    <Image 
                      src="/images/expansions/volatile-magic.png" 
                      alt="Magia Volatil" 
                      width={24} 
                      height={24} 
                      className="mr-3"/>
                    Magia Volatil
                  </h2>
                  
                  {/* Descripción principal */}
                  <div className="bg-gray-700/50 rounded-lg p-6 mb-6 border border-gray-600">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <Image 
                        src="/images/expansions/volatile-magic.png" 
                        alt="Magia Volatil" 
                        width={20} 
                        height={20} 
                        className="mr-3"/>
                      ¿Qué es la Magia Volatil?
                    </h3>
                    <p className="text-gray-300 mb-4">
                      La Magia Volatil es una divisa almacenada en la cartera y es la divisa principal de la 4.ª temporada del Mundo Viviente. 
                      Se obtiene principalmente en mapas como Valle de Grothmar, Acantilados de Jahai, y otros mapas de la temporada 4.
                    </p>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center">
                    ¿Cómo lo obtengo?
                  </h3>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
                      LS4 Meta
                    </button>
                    <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
                      Jardines
                    </button>
                    <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
                      Otros
                    </button>
                  </div>
                   
                   <h3 className="text-xl font-bold text-white mb-6 text-center">
                     ¿En qué gastar la magia volátil?
                   </h3>
                   
                   <div className="text-center mb-6">
                     <h4 className="text-lg font-semibold text-white">
                       Cargamento de trofeos
                     </h4>
                   </div>
                   
                   {/* Resumen de ganancias */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                     <div className="bg-gray-700 rounded p-2 sm:p-3 border border-gray-600">
                       <h6 className="text-xs sm:text-sm font-bold text-gray-300 mb-2 text-center">Total Caja</h6>
                       <div className="text-center">
                         <p className="text-green-400 font-bold text-sm sm:text-lg">
                           {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(
                             calculateTableTotal(trofeosRarosIds, 1.0078) + 
                             calculateTableTotal(trofeosComunesIds, 4.99, true)
                           )}
                         </p>
                         <p className="text-green-400 font-bold text-sm sm:text-lg">
                           {isLoadingPrices ? 'Calculando...' : formatGW2Price(calculateTotalProfitMax())}
                         </p>
                       </div>
                     </div>
                     <div className="bg-gray-700 rounded p-2 sm:p-3 border border-gray-600">
                       <h6 className="text-xs sm:text-sm font-bold text-gray-300 mb-2 text-center">Profit Caja</h6>
                       <div className="text-center">
                         <p className="text-yellow-400 font-bold text-sm sm:text-lg">
                           {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(
                             (calculateTableTotal(trofeosRarosIds, 1.0078) + calculateTableTotal(trofeosComunesIds, 4.99, true)) - 1
                           )}
                         </p>
                         <p className="text-yellow-400 font-bold text-sm sm:text-lg">
                           {isLoadingPrices ? 'Calculando...' : formatGW2Price(calculateTotalProfitMax() - 1)} {/* -1 = -10000 cobre */}
                         </p>
                       </div>
                     </div>
                     <div className="bg-gray-700 rounded p-2 sm:p-3 border border-gray-600 sm:col-span-2 lg:col-span-1">
                       <h6 className="text-xs sm:text-sm font-bold text-gray-300 mb-2 text-center">Profit VM</h6>
                       <div className="text-center">
                         <p className="text-blue-400 font-bold text-sm sm:text-lg">
                           {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(
                             ((calculateTableTotal(trofeosRarosIds, 1.0078) + calculateTableTotal(trofeosComunesIds, 4.99, true)) - 1) / 250
                           )}
                         </p>
                         <p className="text-blue-400 font-bold text-sm sm:text-lg">
                           {isLoadingPrices ? 'Calculando...' : formatGW2Price((calculateTotalProfitMax() - 1)/250)} {/* -1 = -10000 cobre */}
                         </p>
                       </div>
                     </div>
                   </div>
                   
                   {/* Data Source Info */}
                   <div className="bg-blue-900/20 backdrop-blur-sm border border-blue-700/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
                     <div className="flex items-center gap-2 sm:gap-3">
                       <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-pulse flex-shrink-0"></div>
                       <div className="text-blue-300 text-xs sm:text-sm md:text-base">
                         <strong>Fuente de Datos:</strong> Análisis basado en{' '}
                         <span className="text-blue-200 font-bold">500k Cargamento de trofeos</span> abiertos
                       </div>
                     </div>
                   </div>
                   
                   {/* Precios actualizados */}
                   <div className="bg-green-900/20 backdrop-blur-sm border border-green-700/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                       <div className="flex items-center gap-2 sm:gap-3">
                         <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                         <div className="text-green-300 text-xs sm:text-sm md:text-base">
                           <strong>Precios actualizados:</strong> {lastPriceUpdate ? lastPriceUpdate.toLocaleTimeString('es-ES') : 'Cargando...'}
                         </div>
                       </div>
                       <button
                         onClick={fetchTableItemPrices}
                         disabled={isLoadingPrices}
                         className="flex items-center justify-center gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-xs sm:text-sm rounded transition-colors duration-200 w-full sm:w-auto"
                       >
                         <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${isLoadingPrices ? 'animate-spin' : ''}`} />
                         {isLoadingPrices ? 'Actualizando...' : 'Actualizar'}
                       </button>
                     </div>
                     
                     {/* Sección de cálculos - OCULTA */}
                     <div className="hidden">
                       <div className="bg-gradient-to-r from-green-800/50 to-green-700/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-green-600/50">
                         <div className="flex items-center gap-3 mb-4">
                           <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                           <h3 className="text-lg font-semibold text-white">🕵️ Sistema Completo de Cálculos - ProfiMax de Raros</h3>
                         </div>
                                                  {/* ===== PRIMERA PARTE: ITEMS INDIVIDUALES ===== */}
                           <div className="mb-4 p-3 bg-blue-900/30 rounded-lg border border-blue-600/30">
                             <h4 className="text-blue-300 font-semibold mb-3 text-sm">📊 PRIMERA PARTE: Items Individuales</h4>
                             
                             {/* Item 24591 Price */}
                             <div className="flex items-center gap-3 mb-2">
                               <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                               <div className="text-blue-300 text-sm">
                                 <strong>Item 24591 × 1 (buy):</strong> {isLoadingPrices ? 'Calculando...' : formatGW2Price(calculateItem24591Price())}
                               </div>
                             </div>
                             
                             {/* Item 19701 Price */}
                             <div className="flex items-center gap-3 mb-2">
                               <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                               <div className="text-cyan-300 text-sm">
                                 <strong>Item 19701 × 16 (buy):</strong> {isLoadingPrices ? 'Calculando...' : formatGW2Price(calculateItem19701Price())}
                               </div>
                             </div>
                             
                             {/* Item 24295 Price */}
                             <div className="flex items-center gap-3 mb-2">
                               <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                               <div className="text-green-300 text-sm">
                                 <strong>Item 24295 × 1 (sell × 0.9):</strong> {isLoadingPrices ? 'Calculando...' : formatGW2Price(calculateItem24295Price())}
                               </div>
                             </div>
                             
                             {/* Suma Total */}
                             <div className="flex items-center gap-3 mt-3 pt-3 border-t border-blue-600/30">
                               <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                               <div className="text-yellow-300 text-sm font-bold">
                                 <strong>🏆 SUMA TOTAL (24591 + 19701 + 24295):</strong> {isLoadingPrices ? 'Calculando...' : formatGW2Price(calculateItem24591Price() + calculateItem19701Price() + calculateItem24295Price())}
                               </div>
                             </div>
                           </div>
                       
                       {/* Cálculos para 97487 */}
                       <div className="mt-3 pt-3 border-t border-green-700/30">
                         <div className="text-green-300 text-sm mb-3 font-semibold">
                           <strong>🔮 SEGUNDA PARTE: Cálculos para 97487</strong>
                         </div>
                         
                             {/* 97102 × 8 (buy) */}
                             <div className="flex items-center gap-3 mb-2">
                               <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                               <div className="text-red-300 text-sm">
                                 <strong>97102 × 8 (buy):</strong> {isLoadingPrices ? 'Calculando...' : formatGW2Price(calculateItem97102Price())}
                               </div>
                             </div>
                         
                             {/* 19721 × 4 (sell × 0.9) */}
                             <div className="flex items-center gap-3 mb-2">
                               <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                               <div className="text-pink-300 text-sm">
                                 <strong>19721 × 4 (sell × 0.9):</strong> {isLoadingPrices ? 'Calculando...' : formatGW2Price(calculateItem19721Price())}
                               </div>
                             </div>
                         
                             {/* 19701 × 20 (buy) */}
                             <div className="flex items-center gap-3 mb-2">
                               <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                               <div className="text-indigo-300 text-sm">
                                 <strong>19701 × 20 (buy):</strong> {isLoadingPrices ? 'Calculando...' : formatGW2Price(calculateItem19701x10Price())}
                               </div>
                             </div>
                         
                         {/* Precio total para 97487 */}
                         <div className="flex items-center gap-3 mt-2 pt-2 border-t border-green-700/20">
                           <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                           <div className="text-orange-300 text-xs">
                             <strong>💰 Precio total para 97487 (suma):</strong> {isLoadingPrices ? 'Calculando...' : formatGW2Price(calculateTotalPriceFor97487())}
                           </div>
                         </div>
                         
                         {/* Precio por nota más bajo */}
                         <div className="flex items-center gap-3 mt-2 pt-2 border-t border-green-700/20">
                           <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                           <div className="text-purple-300 text-xs">
                             <strong>📊 Precio por nota más bajo:</strong> {isLoadingPrices ? 'Calculando...' : formatGW2Price(getLowestPricePerNote())}
                           </div>
                         </div>
                         
                         {/* Total final con 30 notas */}
                         <div className="flex items-center gap-3 mt-3 pt-3 border-t border-green-700/30">
                                                          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                           <div className="text-yellow-300 text-xs">
                             <strong>🎯 TOTAL FINAL (97487 + 60 notas):</strong> {isLoadingPrices ? 'Calculando...' : formatGW2Price(calculateTotalWithNotes())}
                           </div>
                         </div>
                         
                         {/* SUMA COMPLETA */}
                         <div className="flex items-center gap-2 mb-2">
                           <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                           <div className="text-green-300 text-xs">
                             <strong>🏆 SUMA COMPLETA (Suma Total + TOTAL FINAL):</strong> {isLoadingPrices ? 'Calculando...' : formatGW2Price(calculateSumaCompleta())}
                           </div>
                         </div>
                         
                         {/* Item 97535 (sell × 0.85) */}
                         <div className="flex items-center gap-2 mb-2">
                           <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                           <div className="text-red-300 text-xs">
                             <strong>🔴 Item 97535 (sell × 0.85):</strong> {isLoadingPrices ? 'Calculando...' : formatGW2Price(calculateItem97535Price())}
                           </div>
                         </div>
                         
                         {/* RESULTADO FINAL */}
                         <div className="flex items-center gap-2 mb-2">
                           <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                           <div className="text-purple-300 text-xs">
                             <strong>💎 RESULTADO FINAL (SUMA COMPLETA - 97535):</strong> {isLoadingPrices ? 'Calculando...' : formatGW2Price(calculateResultadoFinal())}
                           </div>
                         </div>
                         
                         {/* RESULTADO FINAL CON DROPRATE */}
                         <div className="flex items-center gap-2 mb-2">
                           <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                           <div className="text-blue-300 text-xs">
                             <strong>🚀 RESULTADO FINAL CON DROPRATE (≥1 × 1.0078):</strong> {isLoadingPrices ? 'Calculando...' : formatGW2Price(calculateResultadoFinalConDroprate())}
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 {/* RESULTADO FINAL CON DROPRATE - OCULTO */}
                 <div className="hidden">
                   <div className="bg-gradient-to-r from-blue-800/50 to-blue-700/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-blue-600/50">
                     <div className="flex items-center gap-3 mb-4">
                       <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                       <h3 className="text-lg font-semibold text-white">🚀 RESULTADO FINAL CON DROPRATE</h3>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                       <div className="text-blue-300 text-lg font-bold">
                         <strong>🚀 RESULTADO FINAL CON DROPRATE (≥1 × 1.0078):</strong> {isLoadingPrices ? 'Calculando...' : formatGW2Price(calculateResultadoFinalConDroprate())}
                       </div>
                     </div>
                   </div>
                 </div>
                   
                   {/* Tabla de datos de trofeos */}
                   <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-2 sm:p-4 md:p-6 shadow-2xl mb-4 sm:mb-6 md:mb-8">
                     <h5 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-3 sm:mb-4 text-center">📊 Análisis de Recompensas por Cargamento de trofeos</h5>
                     
                     {/* Tabla de Trofeos Raros (Droprate 1.0078) */}
                     <div className="mb-6 sm:mb-8">
                       <div className="overflow-x-auto">
                         <table className="w-full text-xs sm:text-sm min-w-[400px] sm:min-w-[500px] md:min-w-[600px]">
                           <thead>
                             <tr className="border-b border-gray-700 bg-gray-800/60">
                               <th className="text-left p-2 sm:p-3 text-gray-200 font-semibold text-xs sm:text-sm">Item</th>
                               <th className="p-1 sm:p-2 md:p-3 text-center text-gray-200 font-semibold text-xs sm:text-sm">Droprate</th>
                               <th className="p-1 sm:p-2 md:p-3 text-center text-gray-200 font-semibold text-xs sm:text-sm">Precio BASE</th>
                               <th className="p-1 sm:p-2 md:p-3 text-center text-gray-200 font-semibold text-xs sm:text-sm">Profit Max</th>
                             </tr>
                           </thead>
                           <tbody>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <img src="https://render.guildwars2.com/file/1A930A6A7B5B01EAB4CB36E79014C12B500BF6B3/66950.png" alt="Vial de sangre poderosa" className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex-shrink-0" />
                                   <span className="text-xs sm:text-sm truncate">Vial de sangre poderosa</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs sm:text-sm">1.0078</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs sm:text-sm">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePrice(24295, 1.0078))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-yellow-400 font-semibold text-xs sm:text-sm">
                                 {isLoadingPrices ? 'Calculando...' : formatGW2Price(calculateResultadoFinalConDroprate())}
                               </td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <img src="https://render.guildwars2.com/file/0EE45FBB1E1A004600E9BAA7097830B2DE08587D/66828.png" alt="Hueso antiguo" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                                   <span className="text-xs sm:text-sm truncate">Hueso antiguo</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs sm:text-sm">1.0078</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs sm:text-sm">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePrice(24358, 1.0078))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-yellow-400 font-semibold text-xs sm:text-sm">01G 18S 65C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <img src="https://render.guildwars2.com/file/043E2BBA270F381870F1B45E7C09C098CAFE3D14/66996.png" alt="Garra despiadada" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                                   <span className="text-xs sm:text-sm truncate">Garra despiadada</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs sm:text-sm">1.0078</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs sm:text-sm">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePrice(24351, 1.0078))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-yellow-400 font-semibold text-xs sm:text-sm">00G 05S 27C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <img src="https://render.guildwars2.com/file/F2050EE1A7A43EDCDCB1E971FDA608AD0566E4DA/66998.png" alt="Colmillo feroz" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                                   <span className="text-xs sm:text-sm truncate">Colmillo feroz</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs sm:text-sm">1.0078</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs sm:text-sm">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePrice(24357, 1.0078))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs sm:text-sm">00G 00S 00C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <img src="https://render.guildwars2.com/file/7061C82F4F9D0C585742F545C40A0F06BE0154DC/66527.png" alt="Escama blindada" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                                   <span className="text-xs sm:text-sm truncate">Escama blindada</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs sm:text-sm">1.0078</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs sm:text-sm">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePrice(24289, 1.0078))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs sm:text-sm">00G 00S 00C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <img src="https://render.guildwars2.com/file/C1ABF9082901FC3CEABC3138CBCCA1DAD5D41812/66955.png" alt="Tótem elaborado" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                                   <span className="text-xs sm:text-sm truncate">Tótem elaborado</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs sm:text-sm">1.0078</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs sm:text-sm">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePrice(24300, 1.0078))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-yellow-400 font-semibold text-xs sm:text-sm">00G 12S 79C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <img src="https://render.guildwars2.com/file/543EC37900EA2A57E77FA891193A48D66AA224AB/66939.png" alt="Vesícula de veneno poderoso" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                                   <span className="text-xs sm:text-sm truncate">Vesícula de veneno poderoso</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs sm:text-sm">1.0078</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs sm:text-sm">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePrice(24283, 1.0078))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-yellow-400 font-semibold text-xs sm:text-sm">00G 06S 57C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <img src="https://render.guildwars2.com/file/080D00670558CD9E580D5662030394B2206E92A6/434537.png" alt="Montón de polvo cristalino" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                                   <span className="text-xs sm:text-sm truncate">Montón de polvo cristalino</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs sm:text-sm">1.0078</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs sm:text-sm">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePrice(24277, 1.0078))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-yellow-400 font-semibold text-xs sm:text-sm">00G 29S 04C</td>
                             </tr>
                           </tbody>
                         </table>
                       </div>
                     </div>
                     
                     {/* Separador visual */}
                     <div className="my-6 sm:my-8 border-t-2 border-gray-600/50"></div>
                     
                     {/* Tabla de Trofeos Comunes (Droprate 4.99) */}
                     <div className="mb-6 sm:mb-8">                    
                       <div className="overflow-x-auto">
                         <table className="w-full text-xs sm:text-sm min-w-[400px] sm:min-w-[500px] md:min-w-[600px]">
                           <thead>
                             <tr className="border-b border-gray-700 bg-gray-800/60">
                               <th className="text-left p-2 sm:p-3 text-gray-200 font-semibold text-xs sm:text-sm">Item</th>
                               <th className="p-1 sm:p-2 md:p-3 text-center text-gray-200 font-semibold text-xs sm:text-sm">Droprate</th>
                               <th className="p-1 sm:p-2 md:p-3 text-center text-gray-200 font-semibold text-xs sm:text-sm">Precio BASE</th>
                               <th className="p-1 sm:p-2 md:p-3 text-center text-gray-200 font-semibold text-xs sm:text-sm">Profit Max</th>
                             </tr>
                           </thead>
                           <tbody>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <img src="https://render.guildwars2.com/file/99AAE49EABF9A2415940FDB83CA1CE5E6E256020/66949.png" alt="Vial de sangre potente" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                                   <span className="text-xs sm:text-sm truncate">Vial de sangre potente</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs sm:text-sm">4.99</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs sm:text-sm">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePriceComunes(24294, 4.99))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs sm:text-sm">00G 00S 00C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <img src="https://render.guildwars2.com/file/13F077BA5D5C6324CFCB0A2E39050F24A441190B/66987.png" alt="Hueso grande" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                                   <span className="text-xs sm:text-sm truncate">Hueso grande</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs sm:text-sm">4.99</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs sm:text-sm">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePriceComunes(24341, 4.99))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs sm:text-sm">00G 00S 00C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <img src="https://render.guildwars2.com/file/3A4D64F4CE2951F358DE0AFCEA6551050FB4B4A7/66420.png" alt="Garra grande" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                                   <span className="text-xs sm:text-sm truncate">Garra grande</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs sm:text-sm">4.99</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs sm:text-sm">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePriceComunes(24350, 4.99))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs sm:text-sm">00G 00S 00C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <img src="https://render.guildwars2.com/file/DED4F23E44430C2BE1C0D491145A4946FC7D7C6F/223793.png" alt="Colmillo grande" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                                   <span className="text-xs sm:text-sm truncate">Colmillo grande</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs sm:text-sm">4.99</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs sm:text-sm">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePriceComunes(24356, 4.99))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs sm:text-sm">00G 00S 00C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <img src="https://render.guildwars2.com/file/F94ECFFF0FA9C321C108DA34E777B27B0AC9D5F8/66944.png" alt="Escama grande" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                                   <span className="text-xs sm:text-sm truncate">Escama grande</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs sm:text-sm">4.99</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs sm:text-sm">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePriceComunes(24288, 4.99))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs sm:text-sm">00G 00S 00C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <img src="https://render.guildwars2.com/file/4DBC299E4B036A0DD3119A0F06BACA147C03B5C7/66954.png" alt="Tótem intrincado" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                                   <span className="text-xs sm:text-sm truncate">Tótem intrincado</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs sm:text-sm">4.99</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs sm:text-sm">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePriceComunes(24299, 4.99))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs sm:text-sm">00G 00S 00C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <img src="https://render.guildwars2.com/file/EA6A4C91F561EC5667947AEFE4CA436D0631CBE3/66938.png" alt="Vesícula de veneno potente" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                                   <span className="text-xs sm:text-sm truncate">Vesícula de veneno potente</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs sm:text-sm">4.99</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs sm:text-sm">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePriceComunes(24282, 4.99))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs sm:text-sm">00G 00S 00C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <img src="https://render.guildwars2.com/file/3501C2BBADF95BE5F14E31484850E851EFCA33CB/434536.png" alt="Montón de polvo incandescente" className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                                   <span className="text-xs sm:text-sm truncate">Montón de polvo incandescente</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs sm:text-sm">4.99</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs sm:text-sm">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePriceComunes(24276, 4.99))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs sm:text-sm">00G 00S 00C</td>
                             </tr>
                           </tbody>
                         </table>
                       </div>
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
                    <TrendingUp className="w-8 h-8 mr-3 text-green-400" />
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
                      <RefreshCw className="w-8 h-8 mr-3 text-yellow-400" />
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
                      <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden text-sm">
                        <thead className="bg-gray-600">
                          <tr>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200 whitespace-nowrap">{t('craftingPage.table.material', 'Material')}</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200 whitespace-nowrap">{t('craftingPage.table.price90', 'Price 90%')}</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200 whitespace-nowrap">{t('craftingPage.table.price85', 'Price 85%')}</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200 whitespace-nowrap">{t('craftingPage.table.convCost20', 'Conv Cost 20')}</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200 whitespace-nowrap">{t('craftingPage.table.profitSS90', 'Profit SS 90% T6')}</th>
                            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200 whitespace-nowrap">{t('craftingPage.table.profitSS85', 'Profit SS 85% T6')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {memoizedConversionData.map((item, index) => (
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
                                    className="w-8 h-8 mr-2 rounded"
                                    width={24}
                                    height={24}
                                  />
                                )}
                                {item.name}
                              </td>
                              <td 
                                className="py-3 px-4 text-white whitespace-nowrap min-w-[100px]"
                                style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', overflow: 'hidden' }}
                              >
                                <span style={{ 
                                  display: 'flex', 
                                  whiteSpace: 'nowrap', 
                                  wordBreak: 'keep-all',
                                  overflow: 'hidden',
                                  flexWrap: 'nowrap',
                                  alignItems: 'center'
                                }}>
                                  {memoizedFormatGoldSilverCopperJSX(item.precio90)}
                                </span>
                              </td>
                              <td 
                                className="py-3 px-4 text-white whitespace-nowrap min-w-[100px]"
                                style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', overflow: 'hidden' }}
                              >
                                <span style={{ 
                                  display: 'flex', 
                                  whiteSpace: 'nowrap', 
                                  wordBreak: 'keep-all',
                                  overflow: 'hidden',
                                  flexWrap: 'nowrap',
                                  alignItems: 'center'
                                }}>
                                  {memoizedFormatGoldSilverCopperJSX(item.precio85)}
                                </span>
                              </td>
                              <td 
                                className="py-3 px-4 text-white whitespace-nowrap min-w-[120px]"
                                style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', overflow: 'hidden' }}
                              >
                                <span style={{ 
                                  display: 'flex', 
                                  whiteSpace: 'nowrap', 
                                  wordBreak: 'keep-all',
                                  overflow: 'hidden',
                                  flexWrap: 'nowrap',
                                  alignItems: 'center'
                                }}>
                                  {memoizedFormatGoldSilverCopperJSX(item.costeConv20)}
                                </span>
                              </td>
                              <td 
                                className={`py-3 px-4 text-white font-semibold whitespace-nowrap min-w-[120px] ${getProfitColor(item.profit90)}`}
                                style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', overflow: 'hidden' }}
                              >
                                <span style={{ 
                                  display: 'flex', 
                                  whiteSpace: 'nowrap', 
                                  wordBreak: 'keep-all',
                                  overflow: 'hidden',
                                  flexWrap: 'nowrap',
                                  alignItems: 'center'
                                }}>
                                  {memoizedFormatGoldSilverCopperJSX(item.profit90)}
                                </span>
                              </td>
                              <td 
                                className={`py-3 px-4 text-white font-semibold whitespace-nowrap min-w-[120px] ${getProfitColor(item.profit85)}`}
                                style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', overflow: 'hidden' }}
                              >
                                <span style={{ 
                                  display: 'flex', 
                                  whiteSpace: 'nowrap', 
                                  wordBreak: 'keep-all',
                                  overflow: 'hidden',
                                  flexWrap: 'nowrap',
                                  alignItems: 'center'
                                }}>
                                  {memoizedFormatGoldSilverCopperJSX(item.profit85)}
                                </span>
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
            {/* Call to Action content can be added here */}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CraftingPage; 