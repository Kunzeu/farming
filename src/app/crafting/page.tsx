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

// Componente de imagen optimizada para móvil
const OptimizedImage = ({ src, alt, className, priority = false }: {
  src: string;
  alt: string;
  className: string;
  priority?: boolean;
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Si es una imagen local, usarla directamente
    if (src.startsWith('/images/')) {
      setImageSrc(src);
      setIsLoading(false);
      return;
    }

    // Si es una imagen externa, intentar cargarla con optimizaciones
    if (src.startsWith('http')) {
      // Para móvil, usar lazy loading por defecto
      const isMobile = window.innerWidth <= 768;
      if (!isMobile || priority) {
        setImageSrc(src);
        setIsLoading(false);
      } else {
        // En móvil, cargar solo cuando sea visible
        setImageSrc(src);
        setIsLoading(false);
      }
    }
  }, [src, priority]);

  if (isLoading) {
    return (
      <div className={`${className} bg-gray-700 animate-pulse rounded`} />
    );
  }

  if (hasError) {
    return (
      <div className={`${className} bg-gray-600 flex items-center justify-center text-xs text-gray-400`}>
        ❌
      </div>
    );
  }

  // Para imágenes locales, usar next/image optimizado
  if (imageSrc.startsWith('/images/')) {
    return (
      <Image
        src={imageSrc}
        alt={alt}
        className={className}
        width={32}
        height={32}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        quality={85}
      />
    );
  }

  // Para imágenes externas, usar img normal con optimizaciones
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      onError={() => setHasError(true)}
      style={{
        width: '32px',
        height: '32px',
        objectFit: 'contain'
      }}
    />
  );
};

const CraftingPage = () => {
  usePageTitle('pageTitles.crafting', 'Crafting Guide');
  const { t, lang } = useI18n();
  const [selectedSection, setSelectedSection] = useState<string>('overview');
  const [conversionData, setConversionData] = useState<ConversionItem[]>([]);
  const [isLoadingConversions, setIsLoadingConversions] = useState(false);

  const [itemPrices, setItemPrices] = useState<Record<number, Gw2Price>>({});
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [lastPriceUpdate, setLastPriceUpdate] = useState<Date | null>(null);
  
  // Estado para los nombres de los items de las tablas
  const [tableItemNames, setTableItemNames] = useState<Record<number, string>>({});
  
  // Caché para datos de la API
  const [apiCache, setApiCache] = useState<{
    prices: Record<number, Gw2Price>;
    items: Record<number, Gw2Item>;
    lastUpdate: Date | null;
    lang: string;
  }>({
    prices: {},
    items: {},
    lastUpdate: null,
    lang: ''
  });


  // T6 Materials from the image with their GW2 IDs
  const t6Materials = useMemo(() => [
    { id: 24295, name: '', t5Id: 24294 }, // Vial of Powerful Blood
    { id: 24358, name: '', t5Id: 24341 }, // Ancient Bone
    { id: 24351, name: '', t5Id: 24350 }, // Vicious Claw
    { id: 24357, name: '', t5Id: 24356 }, // Vicious Fang
    { id: 24289, name: '', t5Id: 24288 }, // Armored Scale
    { id: 24300, name: '', t5Id: 24299 }, // Elaborate Totem
    { id: 24283, name: '', t5Id: 24282 }, // Powerful Venom Sac
  ], []);

  // Estado para materiales T6 con nombres actualizados desde la API
  const [updatedT6Materials, setUpdatedT6Materials] = useState(t6Materials);

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
    89271, 89103,
              24591, 19701, 97102, 19721, 24358, 10804, 19745, 19790, 19732,
    // Items para research notes
    24277, 24351, 24300, 12156, 24473, 19700, 24519, 24511, 24475, 19722, 19729, 19748, 68063,
    // Items para cálculos finales
    97535, 95582, 19912, 24836, 24806, 48917, 7839, 48884, 46735
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

  // Función para calcular precio del item 24358 × 1 (sell × 0.9)
  const calculateItem24358Price = useCallback(() => {
    if (!itemPrices || !itemPrices[24358]) return 0;
    
    const item = itemPrices[24358];
    const sellPrice = item.sells?.unit_price || 0;
    
    // Convertir de cobre a oro (10000 cobre = 1 oro) y multiplicar por 0.9
    const priceInGold = (sellPrice * 0.9) / 10000;
        
    return priceInGold;
  }, [itemPrices]);

  // Función para calcular precio del item 24351 × 5 (sell × 0.9)
  const calculateItem24351Price = useCallback(() => {
    if (!itemPrices || !itemPrices[24351]) return 0;
    
    const item = itemPrices[24351];
    const sellPrice = item.sells?.unit_price || 0;
    
    // Convertir de cobre a oro (10000 cobre = 1 oro) y multiplicar por 5 × 0.9
    const priceInGold = (sellPrice * 5 * 0.9) / 10000;
        
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

  // Función para calcular precio del item 19721 × 5 (sell × 0.9)
  const calculateItem19721x5Price = useCallback(() => {
    if (!itemPrices || !itemPrices[19721]) return 0;
    
    const item = itemPrices[19721];
    const sellPrice = item.sells?.unit_price || 0;
    
    // Convertir de cobre a oro (10000 cobre = 1 oro) y multiplicar por 5 × 0.9
    const priceInGold = (sellPrice * 5 * 0.9) / 10000;
    
    return priceInGold;
  }, [itemPrices]);



                      // Función para calcular el precio completo del crafting de Gossamer Patch
        const calculateGossamerPatchCraftingPrice = useCallback(() => {
          if (!itemPrices) return 0;
          
          // Gossamer Patch se craftea con:
          // - 25 Spool of Gossamer Thread (ID 19790)
          // - 30 Hardened Leather Section (ID 19732) 
          // - 8 Gossamer Scrap (ID 19745)
          
          let precioCompleto = 0;
          
          // Spool of Gossamer Thread × 25
          if (itemPrices[19790]) {
            const gossamerThread = itemPrices[19790];
            const buyPrice = gossamerThread.buys?.unit_price || 0;
            precioCompleto += (buyPrice * 25) / 10000; // Convertir de cobre a oro
          }
    
    // Hardened Leather Section × 30
    if (itemPrices[19732]) {
      const hardenedLeather = itemPrices[19732];
      const buyPrice = hardenedLeather.buys?.unit_price || 0;
      precioCompleto += (buyPrice * 30) / 10000; // Convertir de cobre a oro
    }
    
    // Gossamer Scrap × 8
    if (itemPrices[19745]) {
      const gossamerScrap = itemPrices[19745];
      const buyPrice = gossamerScrap.buys?.unit_price || 0;
      precioCompleto += (buyPrice * 8) / 10000; // Convertir de cobre a oro
    }
    
    // Dividir entre 5 para obtener el precio por patch (ya que se craftean 5)
    const precioFinal = precioCompleto;
    
    return precioFinal;
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

  // Función para calcular el precio de 95582 (sell × 0.85)
  const calculateItem95582Price = useCallback(() => {
    if (!itemPrices || !itemPrices[95582]) return 0;
    const item = itemPrices[95582];
    const sellPrice = item.sells?.unit_price || 0;
    const priceInGold = (sellPrice * 0.85) / 10000;
    
    return priceInGold;
  }, [itemPrices]);

  // Función para calcular el precio de 95582 (sell × 0.85)
  const calculateItem19912Price = useCallback(() => {
    if (!itemPrices || !itemPrices[19912]) return 0;
    const item = itemPrices[19912];
    const sellPrice = item.sells?.unit_price || 0;
    const priceInGold = (sellPrice * 0.85) / 10000;
    
    return priceInGold;
  }, [itemPrices]);

  // Función para calcular precio del item 89271 × 8 (sell × 0.9)
  const calculateItem89271x8Price = useCallback(() => {
    if (!itemPrices || !itemPrices[89271]) return 0;
    
    const item = itemPrices[89271];
    const sellPrice = item.sells?.unit_price || 0;
    const priceInGold = (sellPrice * 0.9 * 8) / 10000;
    
    return priceInGold;
  }, [itemPrices]);

  // Función para calcular precio del item 24300 × 5 (sell × 0.9)
  const calculateItem24300x5Price = useCallback(() => {
    if (!itemPrices || !itemPrices[24300]) return 0;
    
    const item = itemPrices[24300];
    const sellPrice = item.sells?.unit_price || 0;
    const priceInGold = (sellPrice * 0.9 * 5) / 10000;
    
    return priceInGold;
  }, [itemPrices]);

  // Función para calcular precio del item 24283 × 5 (sell × 0.9)
  const calculateItem24283x5Price = useCallback(() => {
    if (!itemPrices || !itemPrices[24283]) return 0;
    
    const item = itemPrices[24283];
    const sellPrice = item.sells?.unit_price || 0;
    const priceInGold = (sellPrice * 0.9 * 5) / 10000;
    
    return priceInGold;
  }, [itemPrices]);

  // Función para calcular precio del item 89103 × 2 (buy)
  const calculateItem89103x2Price = useCallback(() => {
    if (!itemPrices || !itemPrices[89103]) return 0;
    
    const item = itemPrices[89103];
    const buyPrice = item.buys?.unit_price || 0;
    const priceInGold = (buyPrice * 2) / 10000;
    
    return priceInGold;
  }, [itemPrices]);

  // Función para calcular el precio de 24836 (sell × 0.85)
  const calculateItem24836Price = useCallback(() => {
    if (!itemPrices || !itemPrices[24836]) return 0;
    const item = itemPrices[24836];
    const sellPrice = item.sells?.unit_price || 0;
    const priceInGold = (sellPrice * 0.85) / 10000;
    
    return priceInGold;
  }, [itemPrices]);

  // Función para calcular el precio de 24806 (sell × 0.85)
  const calculateItem24806Price = useCallback(() => {
    if (!itemPrices || !itemPrices[24806]) return 0;
    const item = itemPrices[24806];
    const sellPrice = item.sells?.unit_price || 0;
    const priceInGold = (sellPrice * 0.85) / 10000;
    
    return priceInGold;
  }, [itemPrices]);

  // Función para calcular precio del item 24277 × 3 (Pile of Crystalline Dust - sell × 0.9)
  const calculateItem24277x3Price = useCallback(() => {
    if (!itemPrices || !itemPrices[24277]) return 0;
    const item = itemPrices[24277];
    const sellPrice = item.sells?.unit_price || 0;
    const priceInGold = (sellPrice * 0.9 * 3) / 10000;
    
    return priceInGold;
  }, [itemPrices]);



  // Función para calcular precio del item 48917 (Toxic Tuning Crystal - sell × 0.85)
  const calculateItem48917Price = useCallback(() => {
    // Intentar primero con 48917, luego con 7839 como fallback
    let item = itemPrices?.[48917];
    let itemId = 48917;
    
    if (!item) {
      item = itemPrices?.[7839];
      itemId = 7839;
    }
    
    if (!item) {
      return 0;
    }
    
    const sellPrice = item.sells?.unit_price || 0;
    const priceInGold = (sellPrice * 0.85) / 10000;
    
    return priceInGold;
  }, [itemPrices]);

  // Función para calcular precio del item 48884 × 5 (Pristine Toxic Spore Sample - sell × 0.9)
  const calculateItem48884x5Price = useCallback(() => {
    if (!itemPrices || !itemPrices[48884]) return 0;
    const item = itemPrices[48884];
    const sellPrice = item.sells?.unit_price || 0;
    const priceInGold = (sellPrice * 0.9 * 5) / 10000;
    
    return priceInGold;
  }, [itemPrices]);

  // Función para calcular precio del item 46735 × 100 (Empyreal Fragment - precio 0)
  const calculateItem46735x100Price = useCallback(() => {
    // Empyreal Fragment tiene precio 0 según la información proporcionada
    return 0;
  }, []);

  // Función para calcular el RESULTADO FINAL para la quinta sección (24836 - SUMA COMPLETA)
  const calculateResultadoFinalQuintaSeccion = useCallback(() => {
    const sumaTotal = calculateItem19721x5Price() + calculateItem24300x5Price() + calculateItem89271x8Price() + calculateItem89103x2Price();
    const precio24836 = calculateItem24836Price();
    const resultadoFinal = precio24836 - sumaTotal;
    
    return resultadoFinal;
  }, [calculateItem19721x5Price, calculateItem24300x5Price, calculateItem89271x8Price, calculateItem89103x2Price, calculateItem24836Price]);

  // Función para calcular el RESULTADO FINAL CON DROPRATE para la quinta sección
  // Fórmula Excel: =SI('Crafting 2'!I36>=1,('Crafting 2'!I36/'Crafting 2'!D34)*G5,"0")
  const calculateResultadoFinalConDroprateQuintaSeccion = useCallback(() => {
    const resultadoFinal = calculateResultadoFinalQuintaSeccion(); // Esto es I36
    const cantidadFija = 5; // Esto es D34 (número fijo x5)
    const droprate = 1.0078; // Esto es G5
    
    // Aplicar la fórmula condicional: SI(I36>=1, (I36/D34)*G5, "0")
    if (resultadoFinal >= 0) {
      const resultadoConDroprate = (resultadoFinal / cantidadFija) * droprate;
      return resultadoConDroprate;
    } else {
      return 0; // Si I36 < 1, retornar 0
    }
  }, [calculateResultadoFinalQuintaSeccion]);

  // Función para calcular el RESULTADO FINAL para la sexta sección (24806 - SUMA COMPLETA)
  const calculateResultadoFinalSextaSeccion = useCallback(() => {
    const sumaTotal = calculateItem19721x5Price() + calculateItem24283x5Price() + calculateItem89271x8Price() + calculateItem89103x2Price();
    const precio24806 = calculateItem24806Price();
    const resultadoFinal = precio24806 - sumaTotal;
    
    return resultadoFinal;
  }, [calculateItem19721x5Price, calculateItem24283x5Price, calculateItem89271x8Price, calculateItem89103x2Price, calculateItem24806Price]);

  // Función para calcular el RESULTADO FINAL CON DROPRATE para la sexta sección
  // Fórmula Excel: =SI('Crafting 2'!I43>=1,('Crafting 2'!I43/'Crafting 2'!D41)*H5,"0")
  const calculateResultadoFinalConDroprateSextaSeccion = useCallback(() => {
    const resultadoFinal = calculateResultadoFinalSextaSeccion(); // Esto es I43
    const cantidadFija = 5; // Esto es D41 (número fijo x5)
    const droprate = 1.0078; // Esto es H5
    
    // Aplicar la fórmula condicional: SI(I43>=1, (I43/D41)*H5, "0")
    if (resultadoFinal >= 0) {
      const resultadoConDroprate = (resultadoFinal / cantidadFija) * droprate;
      return resultadoConDroprate;
    } else {
      return 0; // Si I43 < 1, retornar 0
    }
  }, [calculateResultadoFinalSextaSeccion]);

  // Función para calcular el RESULTADO FINAL para la séptima sección ((48917 × 5) - SUMA TOTAL ÷ 5)
  const calculateResultadoFinalSeptimaSeccion = useCallback(() => {
    const sumaTotal = calculateItem24277x3Price() + calculateItem48884x5Price() + calculateItem46735x100Price();
    const sumaTotalPorUnidad = sumaTotal / 5; // Dividir entre 5
    const precio48917x5 = calculateItem48917Price() * 5; // Precio unitario × 5
    const resultadoFinal = precio48917x5 - sumaTotalPorUnidad; // (48917 × 5) - (SUMA TOTAL ÷ 5)
    
    return resultadoFinal;
  }, [calculateItem24277x3Price, calculateItem48884x5Price, calculateItem46735x100Price, calculateItem48917Price]);

  // Función para calcular el RESULTADO FINAL CON DROPRATE para la séptima sección
  // Fórmula Excel: =SI('Crafting 1'!S64>=1,I5*('Crafting 1'!S64/3),"0")
  const calculateResultadoFinalConDroprateSeptimaSeccion = useCallback(() => {
    const resultadoFinal = calculateResultadoFinalSeptimaSeccion(); // Esto es S64
    const cantidadFija = 3; // Esto es 3 (número fijo)
    const droprate = 1.0078; // Esto es I5
    
    // Aplicar la fórmula condicional: SI(S64>=1, I5*(S64/3), "0")
    if (resultadoFinal >= 0) {
      const resultadoConDroprate = droprate * (resultadoFinal / cantidadFija);
      return resultadoConDroprate;
    } else {
      return 0; // Si S64 < 1, retornar 0
    }
  }, [calculateResultadoFinalSeptimaSeccion]);

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

  // Función para calcular el RESULTADO FINAL para la tercera sección (SUMA COMPLETA - 95582)
  const calculateResultadoFinalTerceraSeccion = useCallback(() => {
    const sumaTotal = calculateItem24591Price() + calculateItem19701Price() + calculateItem24358Price();
    const totalFinal = calculateTotalWithNotes();
    const sumaCompleta = sumaTotal + totalFinal;
    const precio95582 = calculateItem95582Price();
    const resultadoFinal = precio95582 - sumaCompleta;
    
    return resultadoFinal;
  }, [calculateItem24591Price, calculateItem19701Price, calculateItem24358Price, calculateTotalWithNotes, calculateItem95582Price]);

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

  // Función para calcular el RESULTADO FINAL CON DROPRATE para la tercera sección (fórmula específica)
  const calculateResultadoFinalConDroprateTerceraSeccion = useCallback(() => {
    // Calcular el resultado final de la tercera sección (con 24358)
    const sumaTotal = calculateItem24591Price() + calculateItem19701Price() + calculateItem24358Price();
    const totalFinal = calculateTotalWithNotes();
    const sumaCompleta = sumaTotal + totalFinal;
    const precio95582 = calculateItem95582Price();
    const resultadoFinal = precio95582 - sumaCompleta; // Esto es I50
    
    // D49 es la cantidad del item 24358, que es 1
    const cantidad24358 = 1;
    
    // VM-UM'!C5 (droprate específico para esta sección)
    const droprateC5 = 1.0078; // Ajustar este valor según corresponda
    
    // Fórmula: =SI(I50>=1,(I50/D49)*C5,"0")
    let resultadoConDroprate = 0;
    
    if (resultadoFinal >= 1) {
      resultadoConDroprate = (resultadoFinal / cantidad24358) * droprateC5;
    } else {
      resultadoConDroprate = 0;
    }
    
    return resultadoConDroprate;
  }, [calculateItem24591Price, calculateItem19701Price, calculateItem24358Price, calculateTotalWithNotes, calculateItem95582Price]);

  // Función para calcular el RESULTADO FINAL para la cuarta sección (SUMA COMPLETA - 19912)
  const calculateResultadoFinalCuartaSeccion = useCallback(() => {
    const sumaTotal = calculateItem19721x5Price() + calculateItem24351Price() + calculateGossamerPatchCraftingPrice();
    const precio19912 = calculateItem19912Price();
    const resultadoFinal = precio19912 - sumaTotal;
    
    return resultadoFinal;
  }, [calculateItem19721x5Price, calculateItem24351Price, calculateGossamerPatchCraftingPrice, calculateItem19912Price]);

  // Función para calcular el RESULTADO FINAL CON DROPRATE para la cuarta sección
  const calculateResultadoFinalConDroprateCuartaSeccion = useCallback(() => {
    const resultadoFinal = calculateResultadoFinalCuartaSeccion(); // Esto es I92
    const cantidadFija = 5; // Esto es D90 (número fijo x5)
    const droprate = 1.0078;
    
    let resultadoConDroprate = 0;
    if (resultadoFinal >= 0) {
      resultadoConDroprate = (resultadoFinal / cantidadFija) * droprate;
    } else {
      resultadoConDroprate = 0;
    }
    
    return resultadoConDroprate;
  }, [calculateResultadoFinalCuartaSeccion]);

  // Función para calcular la suma total de ProfitMax de todas las secciones
  const calculateTotalProfitMax = useCallback(() => {
    // ProfitMax de Raros (primera columna)
    const profitMaxRaros = calculateResultadoFinalConDroprate();
    
    // ProfitMax de Comunes (valores fijos de la tabla - por ahora 0 hasta que se implementen cálculos dinámicos)    
    // ProfitMax de la Tercera Sección (nuevo cálculo)
    const profitMaxTerceraSeccion = calculateResultadoFinalConDroprateTerceraSeccion();
    
    // ProfitMax de la Cuarta Sección (nuevo cálculo)
    const profitMaxCuartaSeccion = calculateResultadoFinalConDroprateCuartaSeccion();
    
    // ProfitMax de la Quinta Sección (nuevo cálculo)
    const profitMaxQuintaSeccion = calculateResultadoFinalConDroprateQuintaSeccion();
    
    // ProfitMax de la Sexta Sección (nuevo cálculo)
    const profitMaxSextaSeccion = calculateResultadoFinalConDroprateSextaSeccion();
    
    // ProfitMax de la Séptima Sección (nuevo cálculo)
    const profitMaxSeptimaSeccion = calculateResultadoFinalConDroprateSeptimaSeccion();
    
    // Valor de Total Caja (trofeos raros + comunes)
    const totalCaja = calculateTableTotal(trofeosRarosIds, 1.0078) + calculateTableTotal(trofeosComunesIds, 4.99, true);
    
    const totalProfitMax = profitMaxRaros  + profitMaxTerceraSeccion + profitMaxCuartaSeccion + profitMaxQuintaSeccion + profitMaxSextaSeccion + profitMaxSeptimaSeccion + totalCaja;
  
    return totalProfitMax;
  }, [calculateResultadoFinalConDroprate, calculateResultadoFinalConDroprateTerceraSeccion, calculateResultadoFinalConDroprateCuartaSeccion, calculateResultadoFinalConDroprateQuintaSeccion, calculateResultadoFinalConDroprateSextaSeccion, calculateResultadoFinalConDroprateSeptimaSeccion]);
    // ProfitMax de Raros (primera columna)    

    
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

  // Función para obtener nombres de los items de las tablas
  const fetchTableItemNames = useCallback(async () => {
    try {
      const itemsResponse = await fetch(`https://api.guildwars2.com/v2/items?ids=${tableItemIds.join(',')}&lang=${lang}`);
      const items = await itemsResponse.json();
      
      const namesMap = items.reduce((acc: Record<number, string>, item: Gw2Item) => {
        acc[item.id] = item.name;
        return acc;
      }, {} as Record<number, string>);
      
      setTableItemNames(namesMap);
    } catch (error) {
      console.error('Error fetching table item names:', error);
    }
  }, [tableItemIds, lang]);

  // Cargar precios y nombres de los items de las tablas al montar el componente y cada 5 minutosd
  useEffect(() => {
    // Cargar precios y nombres inmediatamente al montar
    fetchTableItemPrices();
    fetchTableItemNames();
    
    // Actualizar precios y nombres cada 5 minutos
    const interval = setInterval(() => {
      fetchTableItemPrices();
      fetchTableItemNames();
    }, 5 * 60 * 1000); // 5 minutos = 300,000 ms
    
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [fetchTableItemPrices, fetchTableItemNames]);

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

  const fetchConversionCalculations = useCallback(async (forceRefresh = false) => {
    setIsLoadingConversions(true);
    try {
      // Verificar si tenemos datos en caché y si son recientes (menos de 5 minutos)
      // También verificar que el caché sea para el idioma actual
      const now = new Date();
      const cacheAge = apiCache.lastUpdate ? now.getTime() - apiCache.lastUpdate.getTime() : Infinity;
      const isCacheValid = cacheAge < 5 * 60 * 1000 && apiCache.lang === lang; // 5 minutos y mismo idioma
      
      console.log('Cache validation:', {
        cacheAge: cacheAge,
        isCacheValid: isCacheValid,
        cacheLang: apiCache.lang,
        currentLang: lang,
        hasPrices: Object.keys(apiCache.prices).length > 0,
        hasItems: Object.keys(apiCache.items).length > 0,
        forceRefresh: forceRefresh
      });
      
      let prices: Gw2Price[] = [];
      let items: Gw2Item[] = [];
      
      if (!forceRefresh && isCacheValid && Object.keys(apiCache.prices).length > 0 && Object.keys(apiCache.items).length > 0) {
        // Usar datos del caché
        console.log('Usando datos del caché para conversiones');
        prices = Object.values(apiCache.prices);
        items = Object.values(apiCache.items);
      } else {
        // Realizar llamadas a la API
        console.log('Obteniendo datos frescos de la API para conversiones');
        console.log('IDs enviados a la API:', allConversionItemIds);
        const [pricesResponse, itemsResponse] = await Promise.all([
          fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${allConversionItemIds.join(',')}`),
          fetch(`https://api.guildwars2.com/v2/items?ids=${allConversionItemIds.join(',')}&lang=${lang}`)
        ]);

        // Verificar que ambas respuestas sean exitosas
        if (!pricesResponse.ok) {
          throw new Error(`Error al obtener precios: ${pricesResponse.status} ${pricesResponse.statusText}`);
        }
        if (!itemsResponse.ok) {
          throw new Error(`Error al obtener items: ${itemsResponse.status} ${itemsResponse.statusText}`);
        }

        [prices, items] = await Promise.all([
          pricesResponse.json(),
          itemsResponse.json()
        ]);
        
        // Actualizar el caché
        const pricesMap = prices.reduce((acc: Record<number, Gw2Price>, price: Gw2Price) => {
          acc[price.id] = price;
          return acc;
        }, {} as Record<number, Gw2Price>);
        
        console.log('Precios obtenidos de la API:', Object.keys(pricesMap).map(id => parseInt(id)).sort((a, b) => a - b));
        console.log('¿Está el item 24289 en los precios?', !!pricesMap[24289]);
        if (pricesMap[24289]) {
          console.log('Precio del item 24289:', pricesMap[24289]);
        } else {
          console.log('Item 24289 no encontrado en los precios de la API');
        }

        const itemsMap = items.reduce((acc: Record<number, Gw2Item>, item: Gw2Item) => {
          acc[item.id] = item;
          return acc;
        }, {} as Record<number, Gw2Item>);

        setApiCache({
          prices: pricesMap,
          items: itemsMap,
          lastUpdate: now,
          lang: lang
        });
      }

      // Create price and item maps
      const pricesMap = prices.reduce((acc: Record<number, Gw2Price>, price: Gw2Price) => {
        acc[price.id] = price;
        return acc;
      }, {} as Record<number, Gw2Price>);

      const itemsMap = items.reduce((acc: Record<number, Gw2Item>, item: Gw2Item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<number, Gw2Item>);

      // Actualizar los nombres de los materiales T6 con los datos de la API
      const updatedT6Materials = t6Materials.map(material => ({
        ...material,
        name: itemsMap[material.id]?.name || material.name || `Item ${material.id}`
      }));
      setUpdatedT6Materials(updatedT6Materials);

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
      
      const calculatedConversions: ConversionItem[] = updatedT6Materials.map(t6 => {
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
          name: itemInfo?.name || `Item ${t6.id}`,
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
      
      // Mostrar mensaje de error más específico al usuario
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        // Aquí podrías agregar un toast o notificación de error
        // toast.error(`Error al cargar datos: ${error.message}`);
      }
      
      // En caso de error, mantener los datos anteriores si existen
      // No limpiar el estado para que el usuario no pierda la información
    } finally {
      setIsLoadingConversions(false);
    }
  }, [allConversionItemIds, conversionMaterials.ectoplasm, conversionMaterials.crystallineDust, t6Materials, lang, apiCache]);

  useEffect(() => {
    if (selectedSection === 'conversions') {
      fetchConversionCalculations(false); // No forzar actualización en carga automática
    }
  }, [selectedSection, fetchConversionCalculations]);

  // Limpiar caché cuando cambie el idioma
  useEffect(() => {
    setApiCache({
      prices: {},
      items: {},
      lastUpdate: null,
      lang: ''
    });
  }, [lang]);

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
              { id: 'conversions', label: t('craftingPage.conversions', 'Conversions'), icon: RefreshCw },
              { id: 'materials', label: t('craftingPage.volatileMagic', 'Magia Volatil'), icon: Package },
              { id: 'strategies', label: t('craftingPage.strategies', 'Strategies'), icon: TrendingUp },
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
                    <OptimizedImage 
                      src="/images/expansions/volatile-magic.png" 
                      alt={t('craftingPage.volatileMagic', 'Magia Volatil')} 
                      className="mr-3"
                      priority
                    />
                    {t('craftingPage.volatileMagic', 'Magia Volatil')}
                  </h2>
                  
                  {/* Descripción principal */}
                  <div className="bg-gray-700/50 rounded-lg p-6 mb-6 border border-gray-600">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                      <OptimizedImage 
                        src="/images/expansions/volatile-magic.png" 
                        alt={t('craftingPage.volatileMagic', 'Magia Volatil')} 
                        className="mr-3"
                        priority
                      />
                      {t('craftingPage.whatIsVolatileMagic', '¿Qué es la Magia Volatil?')}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      {t('craftingPage.volatileMagicDesc', 'La Magia Volatil es una divisa almacenada en la cartera y es la divisa principal de la 4.ª temporada del Mundo Viviente.')}</p>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center">
                    {t('craftingPage.howToGet', '¿Cómo lo obtengo?')}
                  </h3>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
                      {t('craftingPage.ls4Meta', 'LS4 Meta')}
                    </button>
                    <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
                      {t('craftingPage.gardens', 'Jardines')}
                    </button>
                    <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
                      {t('craftingPage.others', 'Otros')}
                    </button>
                  </div>
                   
                   <h3 className="text-xl font-bold text-white mb-6 text-center">
                     {t('craftingPage.whatToSpend', '¿En qué gastar la magia volátil?')}
                   </h3>
                   
                   <div className="text-center mb-6">
                     <h4 className="text-lg font-semibold text-white">
                       {t('craftingPage.trophyBoxes', 'Cargamento de trofeos')}
                     </h4>
                   </div>
                   
                   {/* Resumen de ganancias */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                     <div className="bg-gray-700 rounded p-2 sm:p-3 border border-gray-600">
                       <h6 className="text-xs font-bold text-gray-300 mb-2 text-center">{t('craftingPage.table.totalBox', 'Total Caja')}</h6>
                       <div className="text-center">
                         <p className="text-green-400 font-bold text-sm sm:text-lg">
                           {t('craftingPage.table.min', 'Min')}: {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price                          
                          (calculateTableTotal(trofeosRarosIds, 1.0078) + 
                          calculateTableTotal(trofeosComunesIds, 4.99, true)
                           )}
                         </p>
                         <p className="text-green-400 font-bold text-sm sm:text-lg">
                           {t('craftingPage.table.max', 'Max')}: {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateTotalProfitMax())}
                         </p>
                       </div>
                     </div>
                     <div className="bg-gray-700 rounded p-2 sm:p-3 border border-gray-600">
                       <h6 className="text-xs font-bold text-gray-300 mb-2 text-center">{t('craftingPage.table.profitBox', 'Profit Caja')}</h6>
                       <div className="text-center">
                         <p className="text-yellow-400 font-bold text-sm sm:text-lg">
                           {t('craftingPage.table.min', 'Min')}: {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(
                             (calculateTableTotal(trofeosRarosIds, 1.0078) + calculateTableTotal(trofeosComunesIds, 4.99, true)) - 1
                           )}
                         </p>
                         <p className="text-yellow-400 font-bold text-sm sm:text-lg">
                           {t('craftingPage.table.max', 'Max')}: {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateTotalProfitMax() - 1)} {/* -1 = -10000 cobre */}
                         </p>
                       </div>
                     </div>
                     <div className="bg-gray-700 rounded p-2 sm:p-3 border border-gray-600 sm:col-span-2 lg:col-span-1">
                       <h6 className="text-xs font-bold text-gray-300 mb-2 text-center">{t('craftingPage.table.profitVM', 'Profit VM')}</h6>
                       <div className="text-center">
                         <p className="text-blue-400 font-bold text-sm sm:text-lg">
                           {t('craftingPage.table.min', 'Min')}: {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(
                             ((calculateTableTotal(trofeosRarosIds, 1.0078) + calculateTableTotal(trofeosComunesIds, 4.99, true)) - 1) / 250
                           )}
                         </p>
                         <p className="text-blue-400 font-bold text-sm sm:text-lg">
                           {t('craftingPage.table.max', 'Max')}: {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price((calculateTotalProfitMax() - 1)/250)} {/* -1 = -10000 cobre */}
                         </p>
                       </div>
                     </div>
                   </div>
                   
                   {/* Data Source Info */}
                   <div className="bg-blue-900/20 backdrop-blur-sm border border-blue-700/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
                     <div className="flex items-center gap-2 sm:gap-3">
                       <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-pulse flex-shrink-0"></div>
                       <div className="text-blue-300 text-xs md:text-base">
                         <strong>{t('craftingPage.table.dataSource', 'Fuente de Datos')}:</strong> {t('craftingPage.table.basedOn', 'Análisis basado en')}{' '}
                         <span className="text-blue-200 font-bold">500k {t('craftingPage.table.trophyBoxes', 'Cargamento de trofeos')}</span> {t('craftingPage.table.opened', 'abiertos')}
                       </div>
                     </div>
                   </div>
                   
                   {/* Precios actualizados */}
                   <div className="bg-green-900/20 backdrop-blur-sm border border-green-700/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                       <div className="flex items-center gap-2 sm:gap-3">
                         <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                         <div className="text-green-300 text-xs md:text-base">
                           <strong>Precios actualizados:</strong> {lastPriceUpdate ? lastPriceUpdate.toLocaleTimeString('es-ES') : 'Cargando...'}
                         </div>
                       </div>
                       <button
                         onClick={fetchTableItemPrices}
                         disabled={isLoadingPrices}
                         className="flex items-center justify-center gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-xs rounded transition-colors duration-200 w-full sm:w-auto"
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
                                 <strong>Item 24591 × 1 (buy):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem24591Price())}
                               </div>
                             </div>
                             
                             {/* Item 19701 Price */}
                             <div className="flex items-center gap-3 mb-2">
                               <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                               <div className="text-cyan-300 text-sm">
                                 <strong>Item 19701 × 16 (buy):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem19701Price())}
                               </div>
                             </div>
                             
                             {/* Item 24295 Price */}
                             <div className="flex items-center gap-3 mb-2">
                               <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                               <div className="text-green-300 text-sm">
                                 <strong>Item 24295 × 1 (sell × 0.9):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem24295Price())}
                               </div>
                             </div>
                             
                             {/* Suma Total */}
                             <div className="flex items-center gap-3 mt-3 pt-3 border-t border-blue-600/30">
                               <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                               <div className="text-yellow-300 text-sm font-bold">
                                 <strong>🏆 SUMA TOTAL (24591 + 19701 + 24295):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem24591Price() + calculateItem19701Price() + calculateItem24295Price())}
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
                                 <strong>97102 × 8 (buy):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem97102Price())}
                               </div>
                             </div>
                         
                             {/* 19721 × 4 (sell × 0.9) */}
                             <div className="flex items-center gap-3 mb-2">
                               <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                               <div className="text-pink-300 text-sm">
                                 <strong>19721 × 4 (sell × 0.9):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem19721Price())}
                               </div>
                             </div>
                         
                             {/* 19701 × 20 (buy) */}
                             <div className="flex items-center gap-3 mb-2">
                               <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                               <div className="text-indigo-300 text-sm">
                                 <strong>19701 × 20 (buy):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem19701x10Price())}
                               </div>
                             </div>
                         
                         {/* Precio total para 97487 */}
                         <div className="flex items-center gap-3 mt-2 pt-2 border-t border-green-700/20">
                           <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                           <div className="text-orange-300 text-xs">
                             <strong>💰 Precio total para 97487 (suma):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateTotalPriceFor97487())}
                           </div>
                         </div>
                         
                         {/* Precio por nota más bajo */}
                         <div className="flex items-center gap-3 mt-2 pt-2 border-t border-green-700/20">
                           <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                           <div className="text-purple-300 text-xs">
                             <strong>📊 {t('craftingPage.lowestPricePerNote', 'Precio por nota más bajo')}:</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(getLowestPricePerNote())}
                           </div>
                         </div>
                         
                         {/* Total final con 30 notas */}
                         <div className="flex items-center gap-3 mt-3 pt-3 border-t border-green-700/30">
                                                          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                           <div className="text-yellow-300 text-xs">
                             <strong>🎯 TOTAL FINAL (97487 + 60 notas):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateTotalWithNotes())}
                           </div>
                         </div>
                         
                         {/* SUMA COMPLETA */}
                         <div className="flex items-center gap-2 mb-2">
                           <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                           <div className="text-green-300 text-xs">
                             <strong>🏆 {t('craftingPage.completeSum', 'SUMA COMPLETA (Suma Total + TOTAL FINAL)')}:</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateSumaCompleta())}
                           </div>
                         </div>
                         
                         {/* Item 97535 (sell × 0.85) */}
                         <div className="flex items-center gap-2 mb-2">
                           <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                           <div className="text-red-300 text-xs">
                             <strong>🔴 Item 97535 (sell × 0.85):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem97535Price())}
                           </div>
                         </div>
                         
                         {/* RESULTADO FINAL */}
                         <div className="flex items-center gap-2 mb-2">
                           <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                           <div className="text-purple-300 text-xs">
                             <strong>💎 RESULTADO FINAL (SUMA COMPLETA - 97535):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateResultadoFinal())}
                           </div>
                         </div>
                         
                         {/* RESULTADO FINAL CON DROPRATE */}
                         <div className="flex items-center gap-2 mb-2">
                           <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                           <div className="text-blue-300 text-xs">
                             <strong>🚀 {t('craftingPage.finalResultWithDroprateFormat', 'RESULTADO FINAL CON DROPRATE (≥1 × 1.0078)')}:</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateResultadoFinalConDroprate())}
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
                       <h3 className="text-lg font-semibold text-white">🚀 {t('craftingPage.finalResultWithDroprate', 'RESULTADO FINAL CON DROPRATE')}</h3>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                       <div className="text-blue-300 text-lg font-bold">
                         <strong>🚀 RESULTADO FINAL CON DROPRATE (≥1 × 1.0078):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateResultadoFinalConDroprate())}
                       </div>
                     </div>
                   </div>
                 </div>

                 {/* Tercera sección de cálculos - OCULTA */}
                 <div className="hidden">
                   <div className="bg-gradient-to-r from-orange-800/50 to-orange-700/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-orange-600/50">
                     <div className="flex items-center gap-3 mb-4">
                       <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                       <h3 className="text-lg font-semibold text-white">🕵️ Sistema Completo de Cálculos - ProfiMax de Raros (TERCERA COPIA)</h3>
                     </div>
                     
                     {/* Primera parte: Items Individuales */}
                     <div className="mb-4 p-3 bg-blue-900/30 rounded-lg border border-blue-600/30">
                       <h4 className="text-blue-300 font-semibold mb-3 text-sm">📊 PRIMERA PARTE: Items Individuales</h4>
                       
                       {/* Item 24591 Price */}
                       <div className="flex items-center gap-3 mb-2">
                         <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                         <div className="text-blue-300 text-sm">
                           <strong>Item 24591 × 1 (buy):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem24591Price())}
                         </div>
                       </div>
                       
                       {/* Item 19701 Price */}
                       <div className="flex items-center gap-3 mb-2">
                         <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                         <div className="text-cyan-300 text-sm">
                           <strong>Item 19701 × 16 (buy):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem19701Price())}
                         </div>
                       </div>
                       
                       {/* Item 24358 Price */}
                       <div className="flex items-center gap-3 mb-2">
                         <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                         <div className="text-green-300 text-sm">
                           <strong>Item 24358 × 1 (sell × 0.9):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem24358Price())}
                         </div>
                       </div>
                       
                       {/* Suma Total */}
                       <div className="flex items-center gap-3 mt-3 pt-3 border-t border-blue-600/30">
                         <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                         <div className="text-yellow-300 text-sm font-bold">
                           <strong>🏆 SUMA TOTAL (24591 + 19701 + 24358):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem24591Price() + calculateItem19701Price() + calculateItem24358Price())}
                         </div>
                       </div>
                     </div>
                     
                     {/* Segunda parte: Cálculos para 97487 */}
                     <div className="mt-3 pt-3 border-t border-orange-700/30">
                       <div className="text-orange-300 text-sm mb-3 font-semibold">
                         <strong>🔮 SEGUNDA PARTE: Cálculos para 97487</strong>
                       </div>
                       
                       {/* 97102 × 8 (buy) */}
                       <div className="flex items-center gap-3 mb-2">
                         <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                         <div className="text-red-300 text-sm">
                           <strong>97102 × 8 (buy):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem97102Price())}
                         </div>
                       </div>
                       
                       {/* 19721 × 4 (sell × 0.9) */}
                       <div className="flex items-center gap-3 mb-2">
                         <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                         <div className="text-pink-300 text-sm">
                           <strong>19721 × 4 (sell × 0.9):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem19721Price())}
                         </div>
                       </div>
                       
                       {/* 19701 × 20 (buy) */}
                       <div className="flex items-center gap-3 mb-2">
                         <div className="w-3 h-3 bg-indigo-400 rounded-full"></div>
                         <div className="text-indigo-300 text-sm">
                           <strong>19701 × 20 (buy):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem19701x10Price())}
                         </div>
                       </div>
                       
                       {/* Precio total para 97487 */}
                       <div className="flex items-center gap-3 mt-2 pt-2 border-t border-orange-700/20">
                         <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                         <div className="text-orange-300 text-xs">
                           <strong>💰 Precio total para 97487 (suma):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateTotalPriceFor97487())}
                         </div>
                       </div>
                       
                       {/* Precio por nota más bajo */}
                       <div className="flex items-center gap-3 mt-2 pt-2 border-t border-orange-700/20">
                         <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                         <div className="text-purple-300 text-xs">
                           <strong>📊 Precio por nota más bajo:</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(getLowestPricePerNote())}
                         </div>
                       </div>
                       
                       {/* Total final con 60 notas */}
                       <div className="flex items-center gap-3 mt-3 pt-3 border-t border-orange-700/30">
                         <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                         <div className="text-yellow-300 text-xs">
                           <strong>🎯 TOTAL FINAL (97487 + 60 notas):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateTotalWithNotes())}
                         </div>
                       </div>
                       
                       {/* SUMA COMPLETA */}
                       <div className="flex items-center gap-2 mb-2">
                         <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                         <div className="text-green-300 text-xs">
                           <strong>🏆 SUMA COMPLETA (Suma Total + TOTAL FINAL):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateSumaCompleta())}
                         </div>
                       </div>
                       
                       {/* Item 95582 (sell × 0.85) */}
                       <div className="flex items-center gap-2 mb-2">
                         <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                         <div className="text-red-300 text-xs">
                           <strong>🔴 Item 95582 (sell × 0.85):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem95582Price())}
                         </div>
                       </div>
                       
                       {/* RESULTADO FINAL */}
                       <div className="flex items-center gap-2 mb-2">
                         <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                         <div className="text-purple-300 text-xs">
                           <strong>💎 RESULTADO FINAL (SUMA COMPLETA - 95582):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateResultadoFinalTerceraSeccion())}
                         </div>
                       </div>
                       
                       {/* RESULTADO FINAL CON DROPRATE */}
                       <div className="flex items-center gap-2 mb-2">
                         <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                         <div className="text-blue-300 text-xs">
                           <strong>🚀 {t('craftingPage.finalResultWithDroprateFormat', 'RESULTADO FINAL CON DROPRATE (≥1 × 1.0078)')}:</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateResultadoFinalConDroprateTerceraSeccion())}
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>

                                   {/* Cuarta sección de cálculos - OCULTA */}
                  <div className="hidden">
                   <div className="bg-gradient-to-r from-purple-800/50 to-purple-700/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-purple-600/50">
                     <div className="flex items-center gap-3 mb-4">
                       <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                       <h3 className="text-lg font-semibold text-white">🕵️ Sistema Completo de Cálculos - ProfiMax de Raros (CUARTA COPIA)</h3>
                     </div>
                     
                     {/* Primera parte: Items Individuales */}
                     <div className="mb-4 p-3 bg-blue-900/30 rounded-lg border border-blue-600/30">
                       <h4 className="text-blue-300 font-semibold mb-3 text-sm">📊 PRIMERA PARTE: Items Individuales</h4>
                       
                       {/* Item 19721 Price */}
                       <div className="flex items-center gap-3 mb-2">
                         <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                         <div className="text-cyan-300 text-sm">
                           <strong>Item 19721 × 5 (sell × 0.9):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem19721x5Price())}
                         </div>
                       </div>
                       
                       {/* Item 24351 Price */}
                       <div className="flex items-center gap-3 mb-2">
                         <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                         <div className="text-blue-300 text-sm">
                           <strong>Item 24351 × 5 (sell × 0.9):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem24351Price())}
                         </div>
                       </div>
                       
                        {/* Item 10804 Price (Gossamer Patch) */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                          <div className="text-purple-300 text-sm">
                            <strong>Item 10804 × 1 (Gossamer Patch - crafting):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateGossamerPatchCraftingPrice())}
                            </div>
                          </div>
                       
                       {/* Suma Total */}
                       <div className="flex items-center gap-3 mt-3 pt-3 border-t border-blue-600/30">
                         <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                            <div className="text-yellow-300 text-sm font-bold">
                          <strong>🏆 SUMA TOTAL (19721 + 24351 + 10804):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem19721x5Price() + calculateItem24351Price() + calculateGossamerPatchCraftingPrice())}
                        </div>
                       </div>

                        {/* Item 95582 (sell × 0.85) */}
                        <div className="flex items-center gap-2 mb-2">
                         <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                         <div className="text-red-300 text-xs">
                           <strong>🔴 Item 19912 (sell × 0.85):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem19912Price())}
                         </div>
                       </div>
                        {/* RESULTADO FINAL */}
                                                <div className="flex items-center gap-2 mb-2">
                           <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                           <div className="text-purple-300 text-xs">
                             <strong>💎 RESULTADO FINAL (SUMA COMPLETA - 19912):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateResultadoFinalCuartaSeccion())}
                           </div>
                         </div>
                         
                         {/* RESULTADO FINAL CON DROPRATE para la cuarta sección */}
                         <div className="flex items-center gap-2 mb-2">
                           <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
                           <div className="text-indigo-300 text-xs">
                             <strong>🚀 RESULTADO FINAL CON DROPRATE (I92/D90 × 1.0078):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateResultadoFinalConDroprateCuartaSeccion())}
                           </div>
                         </div>
                     </div>
                     

                   </div>
                 </div>
                  {/* Quinta sección de cálculos - OCULTA (REPLICA 2) */}
                  <div className="hidden">
                   <div className="bg-gradient-to-r from-purple-800/50 to-purple-700/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-purple-600/50">
                     <div className="flex items-center gap-3 mb-4">
                       <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                               <h3 className="text-lg font-semibold text-white">🕵️ Sistema Completo de Cálculos - ProfiMax de Raros (QUINTA COPIA 2)</h3>
                      </div>
                      
                      {/* Primera parte: Items Individuales */}
                      <div className="mb-4 p-3 bg-blue-900/30 rounded-lg border border-blue-600/30">
                        <h4 className="text-blue-300 font-semibold mb-3 text-sm">📊 PRIMERA PARTE: Items Individuales</h4>
                        
                        {/* Item 19721 Price */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                          <div className="text-cyan-300 text-sm">
                            <strong>Item 19721 × 5 (sell × 0.9):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem19721x5Price())}
                          </div>
                        </div>
                        
                        {/* Item 24300 Price */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <div className="text-blue-300 text-sm">
                            <strong>Item 24300 × 5 (sell × 0.9):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem24300x5Price())}
                          </div>
                        </div>
                        
                        {/* Item 89271 Price */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                          <div className="text-purple-300 text-sm">
                            <strong>Item 89271 × 8 (sell × 0.9):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem89271x8Price())}
                            </div>
                          </div>
                        
                        {/* Item 89103 Price */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                          <div className="text-orange-300 text-sm">
                            <strong>Item 89103 × 2 (buy):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem89103x2Price())}
                            </div>
                          </div>
                       
                       {/* Suma Total */}
                       <div className="flex items-center gap-3 mt-3 pt-3 border-t border-blue-600/30">
                         <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                            <div className="text-yellow-300 text-sm font-bold">
                          <strong>🏆 SUMA TOTAL (19721 + 24300 + 89271 + 89103):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem19721x5Price() + calculateItem24300x5Price() + calculateItem89271x8Price() + calculateItem89103x2Price())}
                        </div>
                       </div>

                        {/* Item 24836 (sell × 0.85) */}
                        <div className="flex items-center gap-2 mb-2">
                         <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                         <div className="text-red-300 text-xs">
                           <strong>🔴 Item 24836 (sell × 0.85):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem24836Price())}
                         </div>
                       </div>

                         {/* RESULTADO FINAL */}
                         <div className="flex items-center gap-2 mb-2">
                           <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                           <div className="text-purple-300 text-xs">
                             <strong>💎 RESULTADO FINAL (SUMA COMPLETA - 24836):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateResultadoFinalQuintaSeccion())}
                           </div>
                         </div>
                         
                         {/* RESULTADO FINAL CON DROPRATE para la quinta sección */}
                         <div className="flex items-center gap-2 mb-2">
                           <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
                           <div className="text-indigo-300 text-xs">
                             <strong>🚀 RESULTADO FINAL CON DROPRATE (SI I36&gt;=1, (I36/D34)×G5, &quot;0&quot;):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateResultadoFinalConDroprateQuintaSeccion())}
                           </div>
                         </div>
                     </div>
                     

                   </div>
                 </div>
                  
                  {/* Sexta sección de cálculos - ELIMINADA (REPLICA 3) */}

                  {/* Séptima sección de cálculos - OCULTA (REPLICA 4) */}
                  <div className="hidden">
                   <div className="bg-gradient-to-r from-purple-800/50 to-purple-700/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-purple-600/50">
                     <div className="flex items-center gap-3 mb-4">
                       <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                                 <h3 className="text-lg font-semibold text-white">🕵️ Sistema Completo de Cálculos - ProfiMax de Raros (SÉPTIMA COPIA 4)</h3>
                        </div>
                        
                        {/* Primera parte: Items Individuales - Toxic Tuning Crystal */}
                        <div className="mb-4 p-3 bg-blue-900/30 rounded-lg border border-blue-600/30">
                          <h4 className="text-blue-300 font-semibold mb-3 text-sm">📊 PRIMERA PARTE: Ingredientes Toxic Tuning Crystal</h4>
                          
                          {/* Item 24277 Price (Pile of Crystalline Dust) */}
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                            <div className="text-cyan-300 text-sm">
                              <strong>Pile of Crystalline Dust (24277) × 3 (sell × 0.9):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem24277x3Price())}
                            </div>
                          </div>
                          
                          {/* Item 48884 Price (Pristine Toxic Spore Sample) */}
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                            <div className="text-green-300 text-sm">
                              <strong>Pristine Toxic Spore Sample (48884) × 5 (sell × 0.9):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem48884x5Price())}
                            </div>
                          </div>
                        
                        {/* Item 46735 Price (Empyreal Fragment) */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                          <div className="text-purple-300 text-sm">
                            <strong>Empyreal Fragment (46735) × 100 (precio 0):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem46735x100Price())}
                            </div>
                          </div>
                       
                       {/* Suma Total */}
                       <div className="flex items-center gap-3 mt-3 pt-3 border-t border-blue-600/30">
                         <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                            <div className="text-yellow-300 text-sm font-bold">
                          <strong>🏆 SUMA TOTAL (24277×3 + 48884×5 + 46735×100) ÷ 5:</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price((calculateItem24277x3Price() + calculateItem48884x5Price() + calculateItem46735x100Price()) / 5)}
                        </div>
                       </div>

                        {/* Item 48917 (Toxic Tuning Crystal - sell × 0.85) */}
                        <div className="flex items-center gap-2 mb-2">
                         <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                         <div className="text-red-300 text-xs">
                           <strong>🔴 Toxic Tuning Crystal (48917) (sell × 0.85):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateItem48917Price())}
                         </div>
                       </div>

                         {/* RESULTADO FINAL */}
                         <div className="flex items-center gap-2 mb-2">
                           <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                           <div className="text-purple-300 text-xs">
                             <strong>💎 RESULTADO FINAL (48917 × 5):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateResultadoFinalSeptimaSeccion())}
                           </div>
                         </div>
                         
                         {/* RESULTADO FINAL CON DROPRATE para la séptima sección */}
                         <div className="flex items-center gap-2 mb-2">
                           <div className="w-4 h-4 bg-indigo-500 rounded-full"></div>
                           <div className="text-indigo-300 text-xs">
                             <strong>🚀 RESULTADO FINAL CON DROPRATE (SI S64&gt;=1, I5×(S64/3), &quot;0&quot;):</strong> {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateResultadoFinalConDroprateSeptimaSeccion())}
                           </div>
                         </div>
                     </div>
                   </div>
                 </div>
                   
                   {/* Tabla de datos de trofeos */}
                   <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-lg p-2 sm:p-4 md:p-6 shadow-2xl mb-4 sm:mb-6 md:mb-8">
                     <h5 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-3 sm:mb-4 text-center">📊 {t('craftingPage.analysisRewards', 'Análisis de Recompensas por Cargamento de trofeos')}</h5>
                     
                     {/* Tabla de {t('craftingPage.table.rareTrophies', 'Trofeos Raros')} (Droprate 1.0078) */}
                     <div className="mb-6 sm:mb-8">
                       <div className="overflow-x-auto">
                         <table className="w-full text-xs min-w-[400px] sm:min-w-[500px] md:min-w-[600px]">
                           <thead>
                             <tr className="border-b border-gray-700 bg-gray-800/60">
                               <th className="text-left p-2 sm:p-3 text-gray-200 font-semibold text-xs">{t('craftingPage.table.item', 'Item')}</th>
                               <th className="p-1 sm:p-2 md:p-3 text-center text-gray-200 font-semibold text-xs">{t('craftingPage.table.droprate', 'Droprate')}</th>
                               <th className="p-1 sm:p-2 md:p-3 text-center text-gray-200 font-semibold text-xs">{t('craftingPage.table.basePrice', 'Precio BASE')}</th>
                               <th className="p-1 sm:p-2 md:p-3 text-center text-gray-200 font-semibold text-xs">{t('craftingPage.table.profitMax', 'Profit Max')}</th>
                             </tr>
                           </thead>
                           <tbody>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <OptimizedImage 
                                     src="https://render.guildwars2.com/file/1A930A6A7B5B01EAB4CB36E79014C12B500BF6B3/66950.png" 
                                     alt="Vial de sangre poderosa" 
                                     className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 flex-shrink-0"
                                     priority
                                   />
                                   <span className="text-xs truncate">{tableItemNames[24295] || 'Vial de sangre poderosa'}</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs">1.0078</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePrice(24295, 1.0078))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-yellow-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateResultadoFinalConDroprate())}
                               </td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <OptimizedImage 
                                     src="https://render.guildwars2.com/file/0EE45FBB1E1A004600E9BAA7097830B2DE08587D/66828.png" 
                                     alt="Hueso antiguo" 
                                     className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                                     priority
                                   />
                                   <span className="text-xs truncate">{tableItemNames[24358] || 'Hueso antiguo'}</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs">1.0078</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePrice(24358, 1.0078))}
                               </td>
                                  <td className="p-1 sm:p-2 md:p-3 text-center text-yellow-400 font-semibold text-xs whitespace-nowrap">
                                  {isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateResultadoFinalConDroprateTerceraSeccion())}
                                </td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <OptimizedImage 
                                     src="https://render.guildwars2.com/file/043E2BBA270F381870F1B45E7C09C098CAFE3D14/66996.png" 
                                     alt="Garra despiadada" 
                                     className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                                     priority
                                   />
                                   <span className="text-xs truncate">{tableItemNames[24351] || 'Garra despiadada'}</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs">1.0078</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePrice(24351, 1.0078))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-yellow-400 font-semibold text-xs whitespace-nowrap">{isLoadingPrices ? t('craftingPage.calculating', 'Calculando...') : formatGW2Price(calculateResultadoFinalConDroprateCuartaSeccion())}</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <OptimizedImage 
                                     src="https://render.guildwars2.com/file/F2050EE1A7A43EDCDCB1E971FDA608AD0566E4DA/66998.png" 
                                     alt="Colmillo feroz" 
                                     className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                                     priority
                                   />
                                   <span className="text-xs truncate">{tableItemNames[24357] || 'Colmillo feroz'}</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs">1.0078</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePrice(24357, 1.0078))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs whitespace-nowrap">00G 00S 00C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <OptimizedImage 
                                     src="https://render.guildwars2.com/file/7061C82F4F9D0C585742F545C40A0F06BE0154DC/66527.png" 
                                     alt="Escama blindada" 
                                     className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                                     priority
                                   />
                                   <span className="text-xs truncate">{tableItemNames[24289] || 'Escama blindada'}</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs">1.0078</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePrice(24289, 1.0078))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs whitespace-nowrap">00G 00S 00C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <OptimizedImage 
                                     src="https://render.guildwars2.com/file/C1ABF9082901FC3CEABC3138CBCCA1DAD5D41812/66955.png" 
                                     alt="Tótem elaborado" 
                                     className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                                     priority
                                   />
                                   <span className="text-xs truncate">{tableItemNames[24300] || 'Tótem elaborado'}</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs">1.0078</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePrice(24300, 1.0078))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-yellow-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateResultadoFinalConDroprateQuintaSeccion())}
                               </td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <OptimizedImage 
                                     src="https://render.guildwars2.com/file/543EC37900EA2A57E77FA891193A48D66AA224AB/66939.png" 
                                     alt="Vesícula de veneno poderoso" 
                                     className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                                     priority
                                   />
                                   <span className="text-xs truncate">{tableItemNames[24283] || 'Vesícula de veneno poderoso'}</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs">1.0078</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePrice(24283, 1.0078))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-yellow-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateResultadoFinalConDroprateSextaSeccion())}
                               </td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <OptimizedImage 
                                     src="https://render.guildwars2.com/file/080D00670558CD9E580D5662030394B2206E92A6/434537.png" 
                                     alt="Montón de polvo cristalino" 
                                     className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                                     priority
                                   />
                                   <span className="text-xs truncate">{tableItemNames[24277] || 'Montón de polvo cristalino'}</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs">1.0078</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePrice(24277, 1.0078))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-yellow-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateResultadoFinalConDroprateSeptimaSeccion())}
                               </td>
                             </tr>
                           </tbody>
                         </table>
                       </div>
                     </div>
                     
                     {/* Separador visual */}
                     <div className="my-6 sm:my-8 border-t-2 border-gray-600/50"></div>
                     
                     {/* Tabla de {t('craftingPage.table.commonTrophies', 'Trofeos Comunes')} (Droprate 4.99) */}
                     <div className="mb-6 sm:mb-8">                    
                       <div className="overflow-x-auto">
                         <table className="w-full text-xs min-w-[400px] sm:min-w-[500px] md:min-w-[600px]">
                           <thead>
                             <tr className="border-b border-gray-700 bg-gray-800/60">
                               <th className="text-left p-2 sm:p-3 text-gray-200 font-semibold text-xs">{t('craftingPage.table.item', 'Item')}</th>
                               <th className="p-1 sm:p-2 md:p-3 text-center text-gray-200 font-semibold text-xs">{t('craftingPage.table.droprate', 'Droprate')}</th>
                               <th className="p-1 sm:p-2 md:p-3 text-center text-gray-200 font-semibold text-xs">{t('craftingPage.table.basePrice', 'Precio BASE')}</th>
                               <th className="p-1 sm:p-2 md:p-3 text-center text-gray-200 font-semibold text-xs">{t('craftingPage.table.profitMax', 'Profit Max')}</th>
                             </tr>
                           </thead>
                           <tbody>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <OptimizedImage 
                                     src="https://render.guildwars2.com/file/99AAE49EABF9A2415940FDB83CA1CE5E6E256020/66949.png" 
                                     alt="Vial de sangre potente" 
                                     className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                                     priority
                                   />
                                   <span className="text-xs truncate">{tableItemNames[24294] || 'Vial de sangre potente'}</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs">4.99</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePriceComunes(24294, 4.99))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs whitespace-nowrap">00G 00S 00C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <OptimizedImage 
                                     src="https://render.guildwars2.com/file/13F077BA5D5C6324CFCB0A2E39050F24A441190B/66987.png" 
                                     alt="Hueso grande" 
                                     className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                                     priority
                                   />
                                   <span className="text-xs truncate">{tableItemNames[24341] || 'Hueso grande'}</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs">4.99</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePriceComunes(24341, 4.99))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs whitespace-nowrap">00G 00S 00C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <OptimizedImage 
                                     src="https://render.guildwars2.com/file/3A4D64F4CE2951F358DE0AFCEA6551050FB4B4A7/66420.png" 
                                     alt="Garra grande" 
                                     className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                                     priority
                                   />
                                   <span className="text-xs truncate">{tableItemNames[24350] || 'Garra grande'}</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs">4.99</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePriceComunes(24350, 4.99))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs whitespace-nowrap">00G 00S 00C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <OptimizedImage 
                                     src="https://render.guildwars2.com/file/DED4F23E44430C2BE1C0D491145A4946FC7D7C6F/223793.png" 
                                     alt="Colmillo grande" 
                                     className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                                     priority
                                   />
                                   <span className="text-xs truncate">{tableItemNames[24356] || 'Colmillo grande'}</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs">4.99</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePriceComunes(24356, 4.99))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs whitespace-nowrap">00G 00S 00C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <OptimizedImage 
                                     src="https://render.guildwars2.com/file/F94ECFFF0FA9C321C108DA34E777B27B0AC9D5F8/66944.png" 
                                     alt="Escama grande" 
                                     className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                                     priority
                                   />
                                   <span className="text-xs truncate">{tableItemNames[24288] || 'Escama grande'}</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs">4.99</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePriceComunes(24288, 4.99))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs whitespace-nowrap">00G 00S 00C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <OptimizedImage 
                                     src="https://render.guildwars2.com/file/4DBC299E4B036A0DD3119A0F06BACA147C03B5C7/66954.png" 
                                     alt="Tótem intrincado" 
                                     className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                                     priority
                                   />
                                   <span className="text-xs truncate">{tableItemNames[24299] || 'Tótem intrincado'}</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs">4.99</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePriceComunes(24299, 4.99))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs whitespace-nowrap">00G 00S 00C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <OptimizedImage 
                                     src="https://render.guildwars2.com/file/EA6A4C91F561EC5667947AEFE4CA436D0631CBE3/66938.png" 
                                     alt="Vesícula de veneno potente" 
                                     className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                                     priority
                                   />
                                   <span className="text-xs truncate">{tableItemNames[24282] || 'Vesícula de veneno potente'}</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs">4.99</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePriceComunes(24282, 4.99))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs whitespace-nowrap">00G 00S 00C</td>
                             </tr>
                             <tr className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                               <td className="p-2 sm:p-2 text-gray-300">
                                 <div className="flex items-center gap-1 sm:gap-2">
                                   <OptimizedImage 
                                     src="https://render.guildwars2.com/file/3501C2BBADF95BE5F14E31484850E851EFCA33CB/434536.png" 
                                     alt="Montón de polvo incandescente" 
                                     className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
                                     priority
                                   />
                                   <span className="text-xs truncate">{tableItemNames[24276] || 'Montón de polvo incandescente'}</span>
                                 </div>
                               </td>
                               <td className="p-1 sm:p-1 md:p-2 text-center text-blue-400 font-semibold text-xs">4.99</td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-green-400 font-semibold text-xs whitespace-nowrap">
                                 {isLoadingPrices ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin mx-auto" /> : formatGW2Price(calculateBasePriceComunes(24276, 4.99))}
                               </td>
                               <td className="p-1 sm:p-2 md:p-3 text-center text-gray-400 font-semibold text-xs whitespace-nowrap">00G 00S 00C</td>
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
                      onClick={() => fetchConversionCalculations(true)}
                      disabled={isLoadingConversions}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoadingConversions ? 'animate-spin' : ''}`} />
                      {isLoadingConversions 
                        ? t('craftingPage.updating', 'Updating...')
                        : t('craftingPage.refreshData', 'Refresh Data')
                      }
                    </button>
                  </div>
                  <p className="text-gray-400 mb-6">
                    {t('craftingPage.conversionsDesc', 'Calculate the profitability of converting Tier 5 to Tier 6 materials through the Mystic Forge. Prices are updated in real-time from the Guild Wars 2 API.')}
                  </p>
                  
                  {/* Precios actualizados */}
                  {apiCache.lastUpdate && (
                    <div className="bg-green-900/20 backdrop-blur-sm border border-green-700/30 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
                        <div className="text-green-300 text-xs md:text-base">
                          <strong>{t('craftingPage.pricesUpdated', 'Precios actualizados:')}</strong> {apiCache.lastUpdate.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  )}

                  

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
                                  <OptimizedImage 
                                    src={item.icon} 
                                    alt={item.name} 
                                    className="w-8 h-8 mr-2 rounded"
                                    priority
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