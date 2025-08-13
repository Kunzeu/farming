'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import { 
  RefreshCw,
  Package,
  TrendingUp,
  Info,
  Calculator,
  Plus,
  Search,
  X,
  Wind,
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

// Nueva interfaz para la calculadora de cajas
interface BoxCalculatorItem {
  id: number;
  name: string;
  icon: string;
  numPerBox: number; // Cantidad fija por caja (solo cambiable por administradores)
  pricePerUnit: number;
  pricePerBox: number;
  myMaterials: number;
  resultingBoxes: number;
}

// Datos fijos para la calculadora de cajas (solo modificables por administradores)
const boxCalculatorData: BoxCalculatorItem[] = [
  { id: 19718, name: 'Jute Scrap', icon: '', numPerBox: 46, pricePerUnit: 22, pricePerBox: 748, myMaterials: 0, resultingBoxes: 0 },
  { id: 19745, name: 'Gossamer Scrap', icon: '', numPerBox: 7, pricePerUnit: 280, pricePerBox: 3080, myMaterials: 0, resultingBoxes: 0 },
  { id: 19721, name: 'Glob of Ectoplasm', icon: '', numPerBox: 0.14, pricePerUnit: 2500, pricePerBox: 725, myMaterials: 0, resultingBoxes: 0 },
  { id: 19729, name: 'Thick Leather Section', icon: '', numPerBox: 6, pricePerUnit: 150, pricePerBox: 3600, myMaterials: 0, resultingBoxes: 0 },
  { id: 19700, name: 'Mithril Ore', icon: '', numPerBox: 15, pricePerUnit: 200, pricePerBox: 3200, myMaterials: 0, resultingBoxes: 0 },
  { id: 19728, name: 'Thin Leather Section', icon: '', numPerBox: 65, pricePerUnit: 25, pricePerBox: 1000, myMaterials:40, resultingBoxes: 0 },
  { id: 19722, name: 'Elder Wood Log', icon: '', numPerBox: 22, pricePerUnit: 150, pricePerBox: 3300, myMaterials: 0, resultingBoxes: 0 },
  { id: 44941, name: 'Watchwork Sprocket', icon: '', numPerBox: 6, pricePerUnit: 500, pricePerBox: 4000, myMaterials: 0, resultingBoxes: 0 },
  { id: 19719, name: 'Rawhide Leather Section', icon: '', numPerBox: 130, pricePerUnit: 8, pricePerBox: 672, myMaterials: 0, resultingBoxes: 0 },
  { id: 19702, name: 'Platinum Ore', icon: '', numPerBox: 4, pricePerUnit: 120, pricePerBox: 720, myMaterials: 0, resultingBoxes: 0 },
  { id: 19739, name: 'Wool Scrap', icon: '', numPerBox: 17, pricePerUnit: 45, pricePerBox: 630, myMaterials: 0, resultingBoxes: 0 },
  { id: 19699, name: 'Iron Ore', icon: '', numPerBox: 7, pricePerUnit: 35, pricePerBox: 350, myMaterials: 0, resultingBoxes: 0 },
  { id: 19741, name: 'Cotton Scrap', icon: '', numPerBox: 72, pricePerUnit: 12, pricePerBox: 648, myMaterials: 0, resultingBoxes: 0 },
  { id: 19701, name: 'Orichalcum Ore', icon: '', numPerBox: 4, pricePerUnit: 380, pricePerBox: 3040, myMaterials: 0, resultingBoxes: 0 },
  { id: 19743, name: 'Linen Scrap', icon: '', numPerBox: 20, pricePerUnit: 85, pricePerBox: 1360, myMaterials: 0, resultingBoxes: 0 },
  { id: 19732, name: 'Hardened Leather Section', icon: '', numPerBox: 3, pricePerUnit: 280, pricePerBox: 840, myMaterials: 0, resultingBoxes: 0 },
  { id: 19731, name: 'Rugged Leather Section', icon: '', numPerBox: 7, pricePerUnit: 85, pricePerBox: 510, myMaterials: 0, resultingBoxes: 0 },
  { id: 19725, name: 'Ancient Wood Log', icon: '', numPerBox: 3, pricePerUnit: 280, pricePerBox: 1680, myMaterials: 0, resultingBoxes: 0 },
  { id: 19697, name: 'Copper Ore', icon: '', numPerBox: 15, pricePerUnit: 18, pricePerBox: 558, myMaterials: 0, resultingBoxes: 0 },
  { id: 24277, name: 'Pile of Crystalline Dust', icon: '', numPerBox: 4, pricePerUnit: 1823, pricePerBox: 911, myMaterials: 0, resultingBoxes: 0 },
  { id: 19703, name: 'Silver Ore', icon: '', numPerBox: 46, pricePerUnit: 90, pricePerBox: 5940, myMaterials: 0, resultingBoxes: 0 },
  { id: 19730, name: 'Coarse Leather Section', icon: '', numPerBox: 30, pricePerUnit: 45, pricePerBox: 1035, myMaterials: 0, resultingBoxes: 0 },
  { id: 19748, name: 'Silk Scrap', icon: '', numPerBox: 59, pricePerUnit: 150, pricePerBox: 7650, myMaterials: 0, resultingBoxes: 0 },
  { id: 19724, name: 'Hard Wood Log', icon: '', numPerBox: 5, pricePerUnit: 85, pricePerBox: 935, myMaterials: 0, resultingBoxes: 0 },
  { id: 19698, name: 'Gold Ore', icon: '', numPerBox: 20, pricePerUnit: 180, pricePerBox: 4140, myMaterials: 0, resultingBoxes: 0 },
  { id: 19723, name: 'Green Wood Log', icon: '', numPerBox: 54, pricePerUnit: 15, pricePerBox: 1065, myMaterials: 0, resultingBoxes: 0 },
  { id: 19726, name: 'Soft Wood Log', icon: '', numPerBox: 30, pricePerUnit: 25, pricePerBox: 850, myMaterials: 0, resultingBoxes: 0 },
  { id: 19727, name: 'Seasoned Wood Log', icon: '', numPerBox: 9, pricePerUnit: 45, pricePerBox: 585, myMaterials: 0, resultingBoxes: 0 },
  { id: 96052, name: 'Research Notes', icon: '', numPerBox: 10, pricePerUnit: 90, pricePerBox: 15000, myMaterials: 0, resultingBoxes: 0 },
];

// IDs primarios para "Apertura de Cajas" (rellenar con la lista definitiva)
interface BoxOpeningPrimaryItem {
  id: number;
  name: string;
  icon: string;
  quantity: number;
  perBox: number;
  pricePerUnit?: number;
}

const BOX_OPENING_PRIMARY_IDS: number[] = [
  24290,24342,24346,24272,24352,24284,24296,24278,24291,24343,24347,24273,24353,24285,24297,24279,24292,24344,24348,24274,24354,24286,24298,24280,24293,24345,24349,24275,24355,24287,24363,24281,24294,24341,24350,24276,24356,24288,24299,24282,24295,24358,24351,24277,24357,24289,24300,24283,66224,19718,19739,19741,19743,19748,19745,19697,19703,19699,19702,19698,19700,19701,19723,19726,19727,19724,19722,19725,19719,19728,19730,19731,19729,19732,43319,43773,43772,102170,88223,43909,48905,88118,48895,43952,
  96978,70477,88148,70266,66165,42402,43955,63856,91086,100244,88732,92023,84882,79978,82006,81701,81807,99956,98092,98002,72503,99250
];

const BOX_OPENING_PRIMARY_COUNTS: number[] = [
  1227,1163,1226,1249,1165,1160,1185,1213,989,956,993,946,924,960,920,980,734,700,733,744,766,756,754,661,504,495,491,467,486,494,468,470,255,219,254,256,311,247,245,251,128,121,132,113,133,110,121,123,
  786889,12025,9132,6018,2974,2048,610,12087,8836,9030,6117,2781,1042,629,12163,9015,5996,2997,4069,583,12098,8927,6125,2944,1196,575,1570,280000,113,152,658,506,161,600,922,310,
  23,0,0,11,16,1,1,1,0,0,1,1,1,1,0,1,0,0,0,2,1,0
];

const TOTAL_OPENED_BOXES = 280000;

// Clave para localStorage
const FOUR_WINDS_CALCULATOR_KEY = 'four_winds_calculator_data';

const FourWindsPage = () => {
  usePageTitle('Four Winds Festival');
  const { t, lang } = useI18n();
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const pricesTableRef = useRef<HTMLDivElement | null>(null);
  
  // Estados para la calculadora de cajas
     const [boxCalculatorItems, setBoxCalculatorItems] = useState<BoxCalculatorItem[]>(() => {
     // Cargar datos guardados del localStorage al inicializar
     if (typeof window !== 'undefined') {
       const savedData = localStorage.getItem(FOUR_WINDS_CALCULATOR_KEY);
       if (savedData) {
         try {
           const parsedData = JSON.parse(savedData);
           // Combinar datos guardados con datos base
           return boxCalculatorData.map(baseItem => {
             const savedItem = parsedData.find((item: BoxCalculatorItem) => item.id === baseItem.id);
             return savedItem ? { ...baseItem, ...savedItem } : baseItem;
           });
         } catch (error) {
           console.error('Error loading saved calculator data:', error);
         }
       }
     }
     return boxCalculatorData;
   });
   
   // Estado para manejar inputs como strings durante la escritura
   const [inputValues, setInputValues] = useState<Record<number, string>>({});
   
   const [boxCalculatorLoading, setBoxCalculatorLoading] = useState(true);
  
  // Estados para selección de items en la calculadora de cajas
  const [showItemSelectionModal, setShowItemSelectionModal] = useState(false);
  const [selectedBoxItems, setSelectedBoxItems] = useState<Set<number>>(new Set(boxCalculatorData.map(item => item.id)));
  const [searchBoxTerm, setSearchBoxTerm] = useState('');
  
  // Estados para ordenamiento
  const [sortField, setSortField] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Estado para Items Obtenidos (IDs primarios)
  const [primaryItems, setPrimaryItems] = useState<BoxOpeningPrimaryItem[]>([]);
  const [primaryLoading, setPrimaryLoading] = useState(false);
  const [primarySortField, setPrimarySortField] = useState<'id' | 'name' | 'quantity' | 'perBox'>('id');
  const [primarySortDirection, setPrimarySortDirection] = useState<'asc' | 'desc'>('asc');

  // Función para guardar datos en localStorage
  const saveCalculatorData = useCallback((data: BoxCalculatorItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(FOUR_WINDS_CALCULATOR_KEY, JSON.stringify(data));
    }
  }, []);

  // Función para formatear moneda GW2
  const formatGoldSilverCopper = (copper: number) => {
    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const copperRemaining = copper % 100;
    
    return `${gold.toString().padStart(2, '0')}G ${silver.toString().padStart(2, '0')}S ${copperRemaining.toString().padStart(2, '0')}C`;
  };

  // Función para obtener iconos y precios de la API de GW2
  const fetchBoxCalculatorData = useCallback(async () => {
    try {
      setBoxCalculatorLoading(true);
      const itemIds = boxCalculatorData.map(item => item.id).join(',');
      
      const [itemsResponse, pricesResponse] = await Promise.all([
        fetch(`https://api.guildwars2.com/v2/items?ids=${itemIds}&lang=${lang}`),
        fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${itemIds}&lang=${lang}`)
      ]);

      if (itemsResponse.ok && pricesResponse.ok) {
        const itemsData: Gw2Item[] = await itemsResponse.json();
        const pricesData: Gw2Price[] = await pricesResponse.json();
        
        const itemsMap: Record<number, Gw2Item> = {};
        const pricesMap: Record<number, Gw2Price> = {};

        itemsData.forEach(item => {
          itemsMap[item.id] = item;
        });

        pricesData.forEach(price => {
          pricesMap[price.id] = price;
        });

        // Actualizar los items con los iconos y precios de la API
        setBoxCalculatorItems(prevItems => {
          const updatedItems = boxCalculatorData.map(item => {
            const currentPrice = pricesMap[item.id]?.buys?.unit_price || item.pricePerUnit;
            const pricePerBox = Math.round(currentPrice * item.numPerBox);
            
            // Mantener los valores actuales de myMaterials y resultingBoxes
            const existingItem = prevItems.find(existing => existing.id === item.id);
            
            return {
              ...item,
              name: itemsMap[item.id]?.name || item.name,
              icon: itemsMap[item.id]?.icon || '',
              pricePerUnit: currentPrice,
              pricePerBox: pricePerBox,
              myMaterials: existingItem?.myMaterials || item.myMaterials,
              resultingBoxes: existingItem?.resultingBoxes || item.resultingBoxes
            };
          });

          // Guardar en localStorage
          saveCalculatorData(updatedItems);
          return updatedItems;
        });
      }
    } catch (error) {
      console.error('Error fetching box calculator data:', error);
    } finally {
      setBoxCalculatorLoading(false);
    }
  }, [saveCalculatorData, lang]);

  // Cargar nombres e iconos de los IDs primarios (Apertura de Cajas)
  const fetchPrimaryItems = useCallback(async () => {
    try {
      if (BOX_OPENING_PRIMARY_IDS.length === 0) {
        setPrimaryItems([]);
        return;
      }
      setPrimaryLoading(true);
      const ids = BOX_OPENING_PRIMARY_IDS.join(',');
      const [itemsRes, pricesRes] = await Promise.all([
        fetch(`https://api.guildwars2.com/v2/items?ids=${ids}&lang=${lang}`),
        fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${ids}&lang=${lang}`)
      ]);
      if (!itemsRes.ok) return;
      const data: Gw2Item[] = await itemsRes.json();
      const pricesData: Gw2Price[] = pricesRes.ok ? await pricesRes.json() : [];
      const pricesMap: Record<number, Gw2Price> = {};
      pricesData.forEach((p) => { pricesMap[p.id] = p; });
      // Construir mapa id -> cantidad
      const countById: Record<number, number> = {};
      BOX_OPENING_PRIMARY_IDS.forEach((id, idx) => {
        countById[id] = BOX_OPENING_PRIMARY_COUNTS[idx] ?? 0;
      });
      const mapped: BoxOpeningPrimaryItem[] = data.map((d) => ({
        id: d.id,
        name: d.name,
        icon: d.icon,
        quantity: countById[d.id] ?? 0,
        perBox: (countById[d.id] ?? 0) / TOTAL_OPENED_BOXES,
        pricePerUnit: pricesMap[d.id]?.sells?.unit_price ?? 0,
      }));
      setPrimaryItems(mapped);
    } catch (e) {
      console.error('Error cargando items primarios:', e);
    } finally {
      setPrimaryLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchPrimaryItems();
  }, [fetchPrimaryItems]);

  // Auto-actualización de ítems obtenidos cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      fetchPrimaryItems();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchPrimaryItems]);

  const handlePrimarySort = (field: 'id' | 'name' | 'quantity' | 'perBox') => {
    if (primarySortField === field) {
      setPrimarySortDirection(primarySortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setPrimarySortField(field);
      setPrimarySortDirection('asc');
    }
  };

  const getPrimarySortIcon = (field: 'id' | 'name' | 'quantity' | 'perBox') => {
    if (primarySortField !== field) return <ArrowUpDown className="w-3.5 h-3.5" />;
    return primarySortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />;
  };

  // Eliminado el restablecer al orden original

  const sortedPrimaryItems = useMemo(() => {
    const items = [...primaryItems];
    // Mapa para ordenar por la posición definida en BOX_OPENING_PRIMARY_IDS
    const indexById: Record<number, number> = {};
    BOX_OPENING_PRIMARY_IDS.forEach((id, idx) => {
      indexById[id] = idx;
    });
    items.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;
      if (primarySortField === 'name') {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (primarySortField === 'quantity') {
        aVal = a.quantity;
        bVal = b.quantity;
      } else if (primarySortField === 'id') {
        aVal = indexById[a.id] ?? Number.MAX_SAFE_INTEGER;
        bVal = indexById[b.id] ?? Number.MAX_SAFE_INTEGER;
      } else {
        aVal = a.perBox;
        bVal = b.perBox;
      }
      if (primarySortDirection === 'asc') return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    });
    return items;
  }, [primaryItems, primarySortField, primarySortDirection]);

  // Valor esperado por caja (bruto y tras tasa del 15%) basado en datos de apertura
  const expectedValuePerBoxCopper = useMemo(() => {
    if (primaryItems.length === 0) return 0;
    return primaryItems.reduce((sum, item) => {
      const unit = item.pricePerUnit || 0; // sells.unit_price
      const perBox6 = Math.round((item.perBox || 0) * 1_000_000) / 1_000_000; // usar 6 decimales
      return sum + perBox6 * unit;
    }, 0);
  }, [primaryItems]);

  const expectedValuePerBoxAfterTaxCopper = useMemo(() => {
    return Math.round(expectedValuePerBoxCopper * 0.85);
  }, [expectedValuePerBoxCopper]);

  // Función para aplicar selección de items en la calculadora de cajas
  const applyItemSelection = () => {
    setSelectedBoxItems(new Set(Array.from(selectedBoxItems)));
    setShowItemSelectionModal(false);
  };

  // Función para seleccionar todos los items
  const selectAllBoxItems = () => {
    setSelectedBoxItems(new Set(boxCalculatorData.map(item => item.id)));
  };

  // Función para deseleccionar todos los items
  const deselectAllBoxItems = () => {
    setSelectedBoxItems(new Set());
  };

  // Items filtrados para el modal de selección
  const filteredBoxItems = useMemo(() => 
    boxCalculatorData.filter(item =>
      item.name.toLowerCase().includes(searchBoxTerm.toLowerCase())
    ), [searchBoxTerm]
  );

  // Función para actualizar cantidad de materiales en la calculadora de cajas
  const updateBoxCalculatorMaterials = (id: number, materials: number) => {
    setBoxCalculatorItems(prev => {
      const updatedItems = prev.map(item => {
        if (item.id === id) {
          const resultingBoxes = Math.floor(materials / item.numPerBox);
          return { ...item, myMaterials: materials, resultingBoxes };
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

  // Función para calcular totales de la calculadora de cajas
  const calculateBoxCalculatorTotals = () => {
    const totalMaterials = boxCalculatorItems.reduce((sum, item) => sum + item.myMaterials, 0);
    const totalBoxes = boxCalculatorItems.reduce((sum, item) => sum + item.resultingBoxes, 0);
    return { totalMaterials, totalBoxes };
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
  const sortedBoxCalculatorItems = useMemo(() => {
    return [...boxCalculatorItems].sort((a, b) => {
      let aValue: string | number = a[sortField as keyof BoxCalculatorItem] as string | number;
      let bValue: string | number = b[sortField as keyof BoxCalculatorItem] as string | number;
      
      // Para campos numéricos, convertir a número
      if (['numPerBox', 'pricePerUnit', 'pricePerBox', 'myMaterials', 'resultingBoxes'].includes(sortField)) {
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
  }, [boxCalculatorItems, sortField, sortDirection]);

  // Ítem más barato por unidad (entre los seleccionados)
  function getPricePerBoxCopper(item: BoxCalculatorItem): number {
    const perBox6 = Math.round((item.numPerBox || 0) * 1_000_000) / 1_000_000;
    const unit = item.pricePerUnit || 0;
    return Math.round(unit * perBox6);
  }

  const cheapestByBox = useMemo(() => {
    const items = boxCalculatorItems.filter((i) => selectedBoxItems.has(i.id));
    if (items.length === 0) return null;
    return items.reduce((min, curr) => (getPricePerBoxCopper(curr) < getPricePerBoxCopper(min) ? curr : min));
  }, [boxCalculatorItems, selectedBoxItems]);

  // Ir a Calculators con orden Price/u ascendente y desplazar a la tabla
  const goToCheapestByUnit = () => {
    setSelectedSection('calculators');
    setSortField('pricePerUnit');
    setSortDirection('asc');
    if (pricesTableRef.current) {
      pricesTableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Cargar datos al montar el componente
     useEffect(() => {
       fetchBoxCalculatorData(); // Cargar iconos y precios de la calculadora de cajas
     }, [fetchBoxCalculatorData]);

   // Actualizar datos automáticamente cada 5 minutos
   useEffect(() => {
     const interval = setInterval(() => {
       fetchBoxCalculatorData();
     }, 5 * 60 * 1000); // 5 minutos

     return () => clearInterval(interval);
   }, [fetchBoxCalculatorData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-blue-900">
      <Navigation />
      
             <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              {t('nav.backToFestivals')}
            </a>
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <Wind className="w-12 h-12 text-cyan-400 mr-3" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{t('festival.fourWinds')}</h1>
          </div>
            <p className="text-base sm:text-xl text-gray-300">{t('festivals.page.subtitle').replace('{name}', t('festival.fourWinds'))}</p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {([
            { id: 'overview', label: t('festivals.tabs.overview'), icon: Info },
            { id: 'calculators', label: t('festivals.tabs.calculators'), icon: Calculator },
            { id: 'box-opening', label: t('festivals.tabs.boxOpening'), icon: Package },
            { id: 'strategies', label: t('festivals.tabs.strategies'), icon: TrendingUp },
          ] as const).map((tab) => (
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
                  {t('festival.fourWinds')}
                </h2>
                <p className="text-gray-300 mb-6">{t('fourWinds.overview.p1')}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">{t('fourWinds.cards.gauntlet.title')}</h3>
                    <p className="text-gray-300 text-sm">{t('fourWinds.cards.gauntlet.desc')}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">{t('fourWinds.cards.blitz.title')}</h3>
                    <p className="text-gray-300 text-sm">{t('fourWinds.cards.blitz.desc')}</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">{t('fourWinds.cards.tokens.title')}</h3>
                    <p className="text-gray-300 text-sm">{t('fourWinds.cards.tokens.desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

                                 {/* Calculators Section */}
            {selectedSection === 'calculators' && (
              <div className="space-y-8">
                {/* Calculadora de Cajas */}
               <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                                                                       <div className="mb-6">
                     <div className="flex items-center">
                        <Calculator className="w-6 h-6 mr-3 text-cyan-400" />
                                                <h2 className="text-2xl font-bold text-white">
                            {t('fourWinds.calculator.title')}
                          </h2>
                     </div>
                   </div>

                                  
                   <div className="flex flex-col xl:flex-row gap-4">
                                         {/* Tabla de Precios y Datos - IZQUIERDA */}
                     <div className="flex-1 min-w-0" ref={pricesTableRef}>
                                                                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-xl font-bold text-white flex items-center">
                            <Package className="w-6 h-6 mr-3 text-cyan-400" />
                            {t('fourWinds.prices.title')}
                            {boxCalculatorLoading && (
                              <RefreshCw className="w-5 h-5 ml-3 animate-spin text-cyan-400" />
                            )}
                             <span className="ml-2 text-sm text-green-400 font-normal">{t('fourWinds.prices.autoSave')}</span>
                          </h3>
                          <div className="flex gap-2 flex-wrap">
                            <button
                              onClick={() => setShowItemSelectionModal(true)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors duration-200"
                            >
                               <Plus className="w-4 h-4" />
                               {t('common.selectItems')}
                            </button>
                            <button
                              onClick={fetchBoxCalculatorData}
                              disabled={boxCalculatorLoading}
                              className="flex items-center gap-2 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors duration-200"
                            >
                               <RefreshCw className={`w-4 h-4 ${boxCalculatorLoading ? 'animate-spin' : ''}`} />
                               {t('common.refreshData')}
                            </button>

                          </div>
                        </div>
                       <div className="overflow-x-auto bg-gray-800/30 rounded-lg border border-gray-700">
                        <table className="w-full text-sm min-w-[800px]">
                          <thead>
                            <tr className="border-b border-gray-600 bg-gray-700/50">
                              <th 
                                className="text-left py-3 px-4 text-gray-200 font-semibold text-xs uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('name')}
                              >
                                <div className="flex items-center gap-1">
                                   {t('salvage.table.material')}
                                  {getSortIcon('name')}
                                </div>
                              </th>
                              <th 
                                className="text-center py-3 px-2 text-gray-200 font-semibold text-xs uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('numPerBox')}
                              >
                                <div className="flex items-center justify-center gap-1">
                                   {t('fourWinds.table.numPerBox')}
                                  {getSortIcon('numPerBox')}
                                </div>
                              </th>
                              <th 
                                className="text-center py-3 px-2 text-gray-200 font-semibold text-xs uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('pricePerUnit')}
                              >
                                <div className="flex items-center justify-center gap-1">
                                   {t('fourWinds.table.pricePerUnit')}
                                  {getSortIcon('pricePerUnit')}
                                </div>
                              </th>
                              <th 
                                className="text-center py-3 px-2 text-gray-200 font-semibold text-xs uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('pricePerBox')}
                              >
                                <div className="flex items-center justify-center gap-1">
                                   {t('fourWinds.table.pricePerBox')}
                                  {getSortIcon('pricePerBox')}
                                </div>
                              </th>
                               <th className="text-center py-3 px-2 text-gray-200 font-semibold text-xs uppercase tracking-wider">{t('fourWinds.table.boxes250')}</th>
                               <th className="text-center py-3 px-2 text-gray-200 font-semibold text-xs uppercase tracking-wider">{t('fourWinds.table.boxes2500')}</th>
                               <th className="text-center py-3 px-2 text-gray-200 font-semibold text-xs uppercase tracking-wider">{t('fourWinds.table.boxes25000')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortedBoxCalculatorItems.filter(item => selectedBoxItems.has(item.id)).map((item, index) => (
                              <tr key={item.id} className={`border-b border-gray-700 hover:bg-gray-700/20 transition-colors group ${index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/10'}`}>
                                <td className="py-2 px-4 text-white text-sm">
                                  <div className="flex items-center">
                                    {item.icon ? (
                                      <Image 
                                        src={item.icon} 
                                        alt={item.name} 
                                        width={32}
                                        height={32}
                                        className="mr-3 rounded border border-gray-600"
                                        onError={(e) => {
                                          e.currentTarget.style.display = 'none';
                                        }}
                                      />
                                    ) : null}
                                    <span className="font-medium">{item.name}</span>
                                  </div>
                                </td>
                                                                 <td className="py-2 px-2 text-center text-gray-300 font-mono text-sm">
                                   <span>{item.numPerBox}</span>
                                 </td>
                                <td className="py-2 px-2 text-center text-gray-300 whitespace-nowrap font-mono text-sm">{formatGoldSilverCopper(item.pricePerUnit)}</td>
                                <td className="py-2 px-2 text-center text-gray-300 whitespace-nowrap font-mono text-sm">{formatGoldSilverCopper(item.pricePerBox)}</td>
                                <td className="py-2 px-2 text-center text-gray-300 whitespace-nowrap font-mono text-sm">{formatGoldSilverCopper(item.pricePerBox * 250)}</td>
                                <td className="py-2 px-2 text-center text-gray-300 whitespace-nowrap font-mono text-sm">{formatGoldSilverCopper(item.pricePerBox * 2500)}</td>
                                <td className="py-2 px-2 text-center text-gray-300 whitespace-nowrap font-mono text-sm">{formatGoldSilverCopper(item.pricePerBox * 25000)}</td>
                              </tr>
                            ))}
                          </tbody>
                         </table>
                          <div className="md:hidden text-gray-400 text-xs mt-2 text-center">{t('common.swipeHint')}</div>
                      </div>
                    </div>

                                         {/* Calculadora de Cajas - DERECHA */}
                     <div className="flex-1 min-w-0">
                                              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                          <Calculator className="w-6 h-6 mr-3 text-cyan-400" />
                         {t('fourWinds.calculator.title')}
                       </h3>
                      <div className="overflow-x-auto bg-gray-800/30 rounded-lg border border-gray-700">
                        <table className="w-full text-sm min-w-[500px]">
                          <thead>
                            <tr className="border-b border-gray-600 bg-gray-700/50">
                              <th 
                                className="text-left py-3 px-4 text-gray-200 font-semibold text-xs uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('name')}
                              >
                                <div className="flex items-center gap-1">
                                  {t('salvage.table.material')}
                                  {getSortIcon('name')}
                                </div>
                              </th>
                              <th 
                                className="text-center py-3 px-4 text-gray-200 font-semibold text-xs uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('myMaterials')}
                              >
                                <div className="flex items-center justify-center gap-1">
                                  {t('fourWinds.table.myMaterials')}
                                  {getSortIcon('myMaterials')}
                                </div>
                              </th>
                              <th 
                                className="text-center py-3 px-4 text-gray-200 font-semibold text-xs uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                                onClick={() => handleSort('resultingBoxes')}
                              >
                                <div className="flex items-center justify-center gap-1">
                                  {t('fourWinds.table.resultingBoxes')}
                                  {getSortIcon('resultingBoxes')}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                                                         {sortedBoxCalculatorItems.filter(item => selectedBoxItems.has(item.id)).map((item, index) => (
                               <tr key={item.id} className={`border-b border-gray-700 hover:bg-gray-700/20 transition-colors group ${index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/10'}`}>
                                 <td className="py-1 px-4 text-white text-sm">
                                   <div className="flex items-center">
                                                                           {item.icon ? (
                                        <Image 
                                          src={item.icon} 
                                          alt={item.name} 
                                          width={32}
                                          height={32}
                                          className="mr-3 rounded border border-gray-600"
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                          }}
                                        />
                                      ) : null}
                                     <span className="font-medium">{item.name}</span>
                                   </div>
                                 </td>
                                 <td className="py-1 px-4 text-center">
                                                                     <input
                                     type="number"
                                     min="0"
                                     value={inputValues[item.id] !== undefined ? inputValues[item.id] : item.myMaterials.toString()}
                                     onChange={(e) => {
                                       const value = e.target.value;
                                       
                                       // Actualizar el valor temporal del input
                                       setInputValues(prev => ({
                                         ...prev,
                                         [item.id]: value
                                       }));
                                       
                                       // Si el campo está vacío, usar 0
                                       if (value === '') {
                                         updateBoxCalculatorMaterials(item.id, 0);
                                       } else {
                                         const numValue = parseInt(value);
                                         // Solo actualizar si es un número válido
                                         if (!isNaN(numValue)) {
                                           updateBoxCalculatorMaterials(item.id, numValue);
                                         }
                                       }
                                     }}
                                     onBlur={(e) => {
                                       // Al perder el foco, asegurar que el valor sea válido
                                       const value = e.target.value;
                                       if (value === '' || isNaN(parseInt(value))) {
                                         updateBoxCalculatorMaterials(item.id, 0);
                                       }
                                     }}
                                     className="w-24 px-2 py-1 bg-gray-700 border border-gray-600 rounded text-white text-center text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                     placeholder="0"
                                   />
                                </td>
                                                                 <td className="py-1 px-4 text-center text-cyan-400 font-semibold font-mono text-base">{item.resultingBoxes}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="border-t-2 border-cyan-500">
                             <tr className="bg-gray-700/50">
                                                              <td className="py-2 px-4 text-right text-gray-200 font-bold text-base">{t('common.total')}:</td>
                               <td className="py-2 px-4 text-center text-white font-bold text-base font-mono">
                                 {calculateBoxCalculatorTotals().totalMaterials.toLocaleString()}
                               </td>
                               <td className="py-2 px-4 text-center text-cyan-400 font-bold text-base font-mono">
                                 {calculateBoxCalculatorTotals().totalBoxes.toLocaleString()}
                               </td>
                            </tr>
                          </tfoot>
                         </table>
                          <div className="md:hidden text-gray-400 text-xs mt-2 text-center">{t('common.swipeHint')}</div>
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
                  <TrendingUp className="w-6 h-6 mr-3 text-cyan-400" />
                  Farming Strategies
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Queen&apos;s Gauntlet</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Progressive Challenges</h4>
                          <p className="text-gray-300 text-sm">Start with the easiest challenges and progress gradually.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Optimized Builds</h4>
                          <p className="text-gray-300 text-sm">Use specific builds for each type of challenge.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Unique Rewards</h4>
                          <p className="text-gray-300 text-sm">The most difficult challenges offer exclusive tokens and materials.</p>
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
                          <h4 className="text-white font-semibold">Team Coordination</h4>
                          <p className="text-gray-300 text-sm">Form coordinated groups to maximize defeat speed.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Efficient Routes</h4>
                          <p className="text-gray-300 text-sm">Plan routes that minimize travel time between bosses.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <h4 className="text-white font-semibold">Perfect Timing</h4>
                          <p className="text-gray-300 text-sm">The best times are during server peak hours.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consejos de Farming */}
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-white mb-4">Farming Tips</h3>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <ul className="text-gray-300 text-sm space-y-2">
                      <li>• Prioritize Queen&apos;s Gauntlet for unique rewards</li>
                      <li>• Form groups for faster Boss Blitz</li>
                      <li>• Accumulate Festival Tokens for bulk exchanges</li>
                      <li>• Monitor prices of exclusive materials</li>
                      <li>• Participate in special events during the festival</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Box Opening Section */}
          {selectedSection === 'box-opening' && (
            <div className="space-y-8">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Package className="w-6 h-6 mr-3 text-cyan-400" />
                  {t('fourWinds.boxOpening.title')}
                </h2>
                
                <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                  <div className="text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-cyan-400 mb-2">{t('fourWinds.stats.title')}</h3>
                    <p className="text-xl sm:text-2xl font-bold text-white">{t('fourWinds.stats.boxesOpened')}</p>
                    <p className="text-gray-300 text-sm mt-2">{t('fourWinds.stats.desc')}</p>
                    <p className="text-gray-400 text-xs mt-1">{t('fourWinds.stats.credit')}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Quick: Precio caja (P.C) como tarjeta tipo "Results Analysis" */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={goToCheapestByUnit}
                      className="bg-gray-700/50 rounded-lg p-4 text-left hover:bg-gray-700/70 border border-gray-600 transition-all"
                    >
                      <div className="text-xs uppercase tracking-wider text-gray-400">{t('fourWinds.quick.pc.title')}</div>
                      <div className="mt-1 text-sm text-gray-300">
                        {cheapestByBox ? (
                          <div className="flex items-center gap-2">
                            {cheapestByBox.icon ? (
                              <Image
                                src={cheapestByBox.icon}
                                alt={cheapestByBox.name}
                                width={32}
                                height={32}
                                className="rounded border border-gray-600"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            ) : null}
                            <span className="text-white font-medium">{cheapestByBox.name}</span>
                            <span className="text-gray-300">— {formatGoldSilverCopper(getPricePerBoxCopper(cheapestByBox))}</span>
                          </div>
                        ) : (
                          t('common.loadingApiData')
                        )}
                      </div>
                      <div className="mt-2 text-cyan-400 text-sm font-semibold">{t('fourWinds.quick.seeInCalculator')}</div>
                    </button>
                    {/* Valor por caja 85% (media) en contenedor aparte (reemplaza al inferior) */}
                    <div className="bg-gray-700/50 rounded-lg p-4 text-center border border-gray-600">
                      <div className="text-xs uppercase tracking-wider text-gray-400">{t('fourWinds.quick.expectedPerBox', 'VALOR POR CAJA 85% (MEDIA)')}</div>
                      <div className="mt-1 text-cyan-400 font-bold text-lg">{formatGoldSilverCopper(expectedValuePerBoxAfterTaxCopper)}</div>
                      <div className="text-gray-400 text-xs">{t('fourWinds.quick.beforeTax', 'Bruto')}: {formatGoldSilverCopper(Math.round(expectedValuePerBoxCopper))}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <TrendingUp className="w-6 h-6 mr-3 text-cyan-400" />
                      {t('fourWinds.stats.resultsAnalysis')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-cyan-400">
                          {primaryItems.filter(i => i.quantity > 0).length.toLocaleString()}
                        </div>
                         <div className="text-gray-300 text-sm">{t('fourWinds.stats.uniqueItems')}</div>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {primaryItems.reduce((sum, i) => sum + i.quantity, 0).toLocaleString()}
                        </div>
                         <div className="text-gray-300 text-sm">{t('fourWinds.stats.totalItems')}</div>
                      </div>
                      <div className="bg-gray-700/50 rounded-lg p-4 text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                          {formatGoldSilverCopper(primaryItems.reduce((sum, i) => sum + i.quantity * (i.pricePerUnit || 0), 0))}
                        </div>
                         <div className="text-gray-300 text-sm">{t('fourWinds.stats.totalValue')}</div>
                      </div>
                      {/* Eliminado el bloque inferior duplicado de valor por caja */}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white flex items-center">
                        <Calculator className="w-6 h-6 mr-3 text-cyan-400" />
                        {t('fourWinds.obtained.title')}
                      </h3>
                      <button
                        onClick={fetchPrimaryItems}
                        disabled={primaryLoading}
                        className="flex items-center gap-2 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors duration-200"
                      >
                        <RefreshCw className={`w-4 h-4 ${primaryLoading ? 'animate-spin' : ''}`} />
                        {t('common.refreshData', 'Refresh Data')}
                      </button>
                    </div>
                    {primaryItems.length === 0 ? (
                      <div className="bg-gray-800/30 rounded-lg border border-gray-700 overflow-hidden">
                        <div className="p-4 text-center text-gray-400">
                          <p>{primaryLoading ? t('common.loadingItems') : t('fourWinds.obtained.waiting')}</p>
                          <p className="text-sm mt-2">{t('fourWinds.obtained.sendIds')}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-x-auto bg-gray-800/30 rounded-lg border border-gray-700">
                        <table className="w-full text-base min-w-[820px]">
                          <thead>
                            <tr className="border-b border-gray-600 bg-gray-700/50">
                              <th onClick={() => handlePrimarySort('name')} className="text-left py-2.5 px-3 text-gray-200 font-semibold text-sm uppercase tracking-wider cursor-pointer select-none">
                                 <div className="flex items-center gap-1.5">{t('salvage.table.material')} {getPrimarySortIcon('name')}</div>
                              </th>
                              <th className="text-center py-2.5 px-2 text-gray-200 font-semibold text-sm uppercase tracking-wider select-none">{t('fourWinds.table.value85', 'Value 85%')}</th>
                              <th onClick={() => handlePrimarySort('quantity')} className="text-center py-2.5 px-2 text-gray-200 font-semibold text-sm uppercase tracking-wider cursor-pointer select-none">
                                 <div className="flex items-center justify-center gap-1.5">{t('table.quantity')} {getPrimarySortIcon('quantity')}</div>
                              </th>
                              <th onClick={() => handlePrimarySort('perBox')} className="text-center py-2.5 px-2 text-gray-200 font-semibold text-sm uppercase tracking-wider cursor-pointer select-none">
                                 <div className="flex items-center justify-center gap-1.5">{t('fourWinds.table.perBox')} {getPrimarySortIcon('perBox')}</div>
                              </th>
                              <th className="text-center py-2.5 px-2 text-gray-200 font-semibold text-sm uppercase tracking-wider select-none">{t('fourWinds.table.valuePerBox', 'Valor por caja 85% (media)')}</th>
                              
                            </tr>
                          </thead>
                          <tbody>
                            {sortedPrimaryItems.map((item, index) => (
                              <tr key={item.id} className={`border-b border-gray-700 hover:bg-gray-700/20 transition-colors ${index % 2 === 0 ? 'bg-gray-800/20' : 'bg-gray-800/10'}`}>
                                <td className="py-2 px-3 text-white">
                                  <div className="flex items-center gap-2">
                                    {item.icon ? (
                                      <Image src={item.icon} alt={item.name} width={28} height={28} className="rounded border border-gray-600" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                    ) : null}
                                    <span className="font-medium text-base">{item.name}</span>
                                  </div>
                                </td>
                                <td className="py-2 px-2 text-center text-gray-300 font-mono text-base">
                                  {formatGoldSilverCopper(Math.round((item.pricePerUnit || 0) * 0.85))}
                                </td>
                                <td className="py-2 px-2 text-center text-gray-300 font-mono text-base">{item.quantity.toLocaleString()}</td>
                                <td className="py-2 px-2 text-center text-gray-300 font-mono text-base">{item.perBox.toFixed(6)}</td>
                                <td className="py-2 px-2 text-center text-gray-300 font-mono text-base">
                                  {formatGoldSilverCopper(
                                    Math.round(
                                      (item.pricePerUnit || 0) * 0.85 * (Math.round((item.perBox || 0) * 1_000_000) / 1_000_000)
                                    )
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                         </table>
                         <div className="md:hidden text-gray-400 text-xs mt-2 text-center">{t('common.swipeHint')}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
                 </motion.div>

       </div>

               {/* Item Selection Modal for Box Calculator */}
        {showItemSelectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <h3 className="text-xl font-bold text-white">{t('fourWinds.modal.selectItemsTitle')}</h3>
                <button
                  onClick={() => setShowItemSelectionModal(false)}
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
                      placeholder={t('common.searchItemsPlaceholder')}
                      value={searchBoxTerm}
                      onChange={(e) => setSearchBoxTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={selectAllBoxItems}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                  >
                    {t('common.addAll')}
                  </button>
                  <button
                    onClick={deselectAllBoxItems}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                  >
                    {t('common.removeAll')}
                  </button>
                </div>

                {/* Items Grid */}
                <div className="max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {filteredBoxItems.map((item) => (
                      <label
                        key={item.id}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedBoxItems.has(item.id)
                            ? 'bg-cyan-600 border-cyan-500'
                            : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedBoxItems.has(item.id)}
                          onChange={(e) => {
                            const newSelected = new Set(selectedBoxItems);
                            if (e.target.checked) {
                              newSelected.add(item.id);
                            } else {
                              newSelected.delete(item.id);
                            }
                            setSelectedBoxItems(newSelected);
                          }}
                          className="mr-3"
                        />
                        <div className="flex-1">
                          <div className="flex items-center">
                                                         {item.icon ? (
                               <Image 
                                 src={item.icon} 
                                 alt={item.name} 
                                 width={16}
                                 height={16}
                                 className="mr-2 rounded border border-gray-600"
                                 onError={(e) => {
                                   e.currentTarget.style.display = 'none';
                                 }}
                               />
                             ) : null}
                            <div className="text-white font-medium text-sm">{item.name}</div>
                          </div>
                          <div className="text-gray-400 text-xs">Num/Box: {item.numPerBox}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-700">
                  <div className="text-gray-400 text-sm">
                    {t('common.itemsSelected').replace('{count}', String(selectedBoxItems.size))}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowItemSelectionModal(false)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      onClick={applyItemSelection}
                      disabled={selectedBoxItems.size === 0}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      {t('common.addSelected').replace('{count}', String(selectedBoxItems.size))}
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