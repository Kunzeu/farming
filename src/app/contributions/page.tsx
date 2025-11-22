'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Navigation from '@/components/layout/Navigation';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';
import { ExternalLink } from 'lucide-react';
import Image from 'next/image';

// Iconos de redes sociales
const TwitchIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
  </svg>
);

const YouTubeIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

interface ItemData {
  id: number;
  icon: string;
  names: {
    en: string;
    es: string;
    de: string;
    fr: string;
  };
  description?: {
    en: string;
    es: string;
    de: string;
    fr: string;
  };
  type?: string;
  rarity?: string;
  level?: number;
}

interface InGameDonation {
  name: string;
  amount?: number;
  coins?: {
    gold?: number;
    silver?: number;
    copper?: number;
  };
  items?: Array<{
    name: string;
    icon?: string;
    quantity?: number;
    price?: number; // Precio en cobre (precio del bazar al momento de la donación)
  }>;
  ectoplasm?: number;
  twitch?: string; // URL del canal de Twitch
  youtube?: string; // URL del canal de YouTube
}

interface ContributionEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  inGameDonations: InGameDonation[];
}

// IDs de items legendarios de GW2
const LEGENDARY_ITEM_IDS: Record<string, number> = {
  // Gen 1 Legendary Weapons
  'Frostfang': 30684,
  'Kudzu': 30685,
  'The Dreamer': 30686,
  'Incinerator': 30687,
  'The Minstrel': 30688,
  'Eternity': 30689,
  'The Juggernaut': 30690,
  'Kamohoali\'i Kotaki': 30691,
  'The Moot': 30692,
  'Quip': 30693,
  'The Predator': 30694,
  'Meteorlogicus': 30695,
  'The Flameseeker Prophecies': 30696,
  'Frenzy': 30697,
  'The Bifrost': 30698,
  'Bolt': 30699,
  'Rodgort': 30700,
  'Kraitkin': 30701,
  'Howler': 30702,
  'Sunrise': 30703,
  'Twilight': 30704,
  // Gen 4 y 5 Legendary Weapons
  'Klobjarne Geirr': 103815,
  'Aetheric Anchor': 105497,
  // Aurene Weapons
  'Aurene\'s Tail': 95612,
  'Aurene\'s Fang': 95675,
  'Aurene\'s Argument': 95808,
  'Aurene\'s Scale': 96028,
  'Aurene\'s Claw': 96203,
  'Aurene\'s Wisdom': 96221,
  'Aurene\'s Bite': 96356,
  'Aurene\'s Insight': 96652,
  'Aurene\'s Rending': 96937,
  'Aurene\'s Wing': 97077,
  'Aurene\'s Breath': 97099,
  'Aurene\'s Gaze': 97165,
  'Aurene\'s Persuasion': 97377,
  'Aurene\'s Flight': 97590,
  'Aurene\'s Weight': 95684,
  'Aurene\'s Voice': 97783,
  'Glob of Ectoplasm': 19721,

  // Pre's
  'Dragon\'s Bite': 96357,
};

// Traducciones para tipos y rareza
const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    weapon: 'Weapon',
    rarity: 'Rarity',
    level: 'Level',
    legendary: 'Legendary',
  },
  es: {
    weapon: 'Arma',
    rarity: 'Rareza',
    level: 'Nivel',
    legendary: 'Legendario',
  },
  de: {
    weapon: 'Waffe',
    rarity: 'Seltenheit',
    level: 'Stufe',
    legendary: 'Legendär',
  },
  fr: {
    weapon: 'Arme',
    rarity: 'Rareté',
    level: 'Niveau',
    legendary: 'Légendaire',
  },
};

// Función helper para obtener traducciones
function getTranslation(key: string, language: string): string {
  return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
}

// Función para traducir el tipo
function translateType(type: string | undefined, language: string): string {
  if (!type) return '';
  const typeLower = type.toLowerCase();
  if (typeLower === 'weapon') {
    return getTranslation('weapon', language);
  }
  return type;
}

// Función para traducir la rareza
function translateRarity(rarity: string | undefined, language: string): string {
  if (!rarity) return '';
  const rarityLower = rarity.toLowerCase();
  if (rarityLower === 'legendary') {
    return getTranslation('legendary', language);
  }
  return rarity;
}

// Clave para el caché en localStorage
const CACHE_KEY = 'gw2_items_cache';
const CACHE_VERSION = '1.0';

// Función para obtener datos del caché
function getCachedItemData(itemId: number): ItemData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const cacheData = JSON.parse(cached);
    if (cacheData.version !== CACHE_VERSION) return null;
    
    return cacheData.items[itemId] || null;
  } catch (error) {
    console.error('Error reading cache:', error);
    return null;
  }
}

// Función para guardar datos en el caché (asíncrona para no bloquear)
function setCachedItemData(itemId: number, data: ItemData): void {
  if (typeof window === 'undefined') return;
  
  // Usar setTimeout para escribir de forma asíncrona y no bloquear el hilo principal
  setTimeout(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const cacheData = cached ? JSON.parse(cached) : { version: CACHE_VERSION, items: {} };
      
      cacheData.items[itemId] = data;
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error writing cache:', error);
    }
  }, 0);
}

// Función para obtener datos de items desde la API de GW2
async function fetchItemData(itemName: string): Promise<ItemData | null> {
  const itemId = LEGENDARY_ITEM_IDS[itemName];
  if (!itemId) return null;

  // Intentar obtener del caché primero
  const cached = getCachedItemData(itemId);
  if (cached) {
    return cached;
  }

  try {
    const languages = ['en', 'es', 'de', 'fr'];
    const promises = languages.map(lang =>
      fetch(`https://api.guildwars2.com/v2/items/${itemId}?lang=${lang}`)
        .then(res => res.ok ? res.json() : null)
        .catch(() => null)
    );

    const results = await Promise.all(promises);
    const [enData, esData, deData, frData] = results;

    if (!enData) return null;

    const itemData: ItemData = {
      id: itemId,
      icon: enData.icon || '',
      names: {
        en: enData.name || itemName,
        es: esData?.name || enData.name || itemName,
        de: deData?.name || enData.name || itemName,
        fr: frData?.name || enData.name || itemName,
      },
      description: {
        en: enData.description || '',
        es: esData?.description || enData.description || '',
        de: deData?.description || enData.description || '',
        fr: frData?.description || enData.description || '',
      },
      type: enData.type,
      rarity: enData.rarity,
      level: enData.level,
    };

    // Guardar en caché
    setCachedItemData(itemId, itemData);

    return itemData;
  } catch (error) {
    console.error(`Error fetching item data for ${itemName}:`, error);
    return null;
  }
}

// Datos del evento
const getEventData = (t: (key: string) => string): ContributionEvent => {
  return {
    id: '1',
    slug: 'contribuciones-de-la-comunidad',
    title: t('contributions.communityContributions.title'),
    description: t('contributions.communityContributions.description'),
    startDate: '2025-11-19',
    endDate: '2025-12-31',
    inGameDonations: [
       {
           name: 'Yuuki.7084',
          items: [
              { name: 'Glob of Ectoplasm', quantity: 250 }, 

          ]
       },
       { 
         name: 'Zirial.2698', 
         items: [
          { name: 'Glob of Ectoplasm', quantity: 500  }, 
           
         ]
       },
       { 
        name: 'Lele.5984', 
        items: [
         { name: 'Dragon\'s Bite', quantity: 1  }, 
          
        ]
      },
      { 
        name: 'Vortus.2801',
        twitch: 'https://www.twitch.tv/Vortus43', 
        items: [
          { name: 'Aurene\'s Insight', quantity: 1  },  
         { name: 'Sunrise', quantity: 1  },
         { name: 'The Juggernaut', quantity: 1  }, 
         { name: 'giveaways.gems', quantity: 2800, icon: 'https://wiki.guildwars2.com/images/8/88/Gem_%28highres%29.png'  },
          
        ]
      },
      

    ]
  };
};

// Función para generar URL de la wiki de GW2
function getWikiUrl(itemName: string, language: string = 'en'): string {
  // Reemplazar espacios con guiones bajos y codificar caracteres especiales
  const wikiName = itemName.replace(/\s+/g, '_').replace(/[()]/g, '');
  const encodedName = encodeURIComponent(wikiName);
  
  // La wiki de GW2 usa subdominios para diferentes idiomas
  const subdomainMap: Record<string, string> = {
    'en': 'wiki',
    'es': 'wiki-es',
    'de': 'wiki-de',
    'fr': 'wiki-fr',
  };
  
  const subdomain = subdomainMap[language] || 'wiki';
  return `https://${subdomain}.guildwars2.com/wiki/${encodedName}`;
}

export default function ContributionsPage() {
  const { lang, t } = useI18n();
  const event = getEventData(t);
  const [itemsData, setItemsData] = useState<Record<string, ItemData>>({});
  const [itemPrices, setItemPrices] = useState<Record<string, number>>({}); // Precios desde la API: nombre -> precio en cobre
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<Record<string, { top: number; left: number; position: 'top' | 'bottom' }>>({});
  const isLoadingRef = useRef(false);
  const eventSlugRef = useRef<string | null>(null);
  const tooltipRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  
  usePageTitle(`contributions.${event.slug}`, event.title);

  // Cargar datos de items desde la API
  useEffect(() => {
    if (!event) return;
    
    const eventSlug = event.slug;
    const inGameDonations = event.inGameDonations;
    
    // Evitar cargar múltiples veces para el mismo evento
    if (isLoadingRef.current || eventSlugRef.current === eventSlug) return;
    
    isLoadingRef.current = true;
    eventSlugRef.current = eventSlug;

    const loadItemsData = async () => {
      try {
        const allItemNames = new Set<string>();
        
        // Recopilar todos los nombres de items únicos
        inGameDonations.forEach(donation => {
          donation.items?.forEach(item => {
            allItemNames.add(item.name);
          });
        });

        // Primero cargar desde caché (una sola lectura de localStorage)
        const itemsDataMap: Record<string, ItemData> = {};
        const itemsToFetch: string[] = [];
        
        // Leer el caché completo una sola vez
        let cacheData: { version: string; items: Record<number, ItemData> } | null = null;
        if (typeof window !== 'undefined') {
          try {
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
              const parsed = JSON.parse(cached);
              if (parsed.version === CACHE_VERSION) {
                cacheData = parsed;
              }
            }
          } catch (error) {
            console.error('Error reading cache:', error);
          }
        }
        
        for (const itemName of allItemNames) {
          const itemId = LEGENDARY_ITEM_IDS[itemName];
          if (itemId) {
            const cached = cacheData?.items[itemId];
            if (cached) {
              itemsDataMap[itemName] = cached;
            } else {
              itemsToFetch.push(itemName);
            }
          }
        }

        // Actualizar estado con datos del caché primero (solo si hay datos)
        if (Object.keys(itemsDataMap).length > 0) {
          setItemsData(prev => {
            // Solo actualizar si hay cambios
            const hasChanges = Object.keys(itemsDataMap).some(
              key => prev[key] !== itemsDataMap[key]
            );
            return hasChanges ? { ...itemsDataMap } : prev;
          });
        }

        // Solo hacer llamadas a la API para items que no están en caché
        if (itemsToFetch.length > 0) {
          // Procesar en lotes pequeños para no bloquear
          const batchSize = 2;
          const batches: string[][] = [];
          for (let i = 0; i < itemsToFetch.length; i += batchSize) {
            batches.push(itemsToFetch.slice(i, i + batchSize));
          }

          for (const batch of batches) {
            const batchPromises = batch.map(async (itemName) => {
              const data = await fetchItemData(itemName);
              if (data) {
                itemsDataMap[itemName] = data;
              }
              // Pequeño delay entre items para no sobrecargar
              await new Promise(resolve => setTimeout(resolve, 100));
            });

            await Promise.all(batchPromises);
            
            // Actualizar estado incrementalmente solo con los nuevos datos
            setItemsData(prev => {
              const newData = { ...prev };
              let hasChanges = false;
              batch.forEach(itemName => {
                if (itemsDataMap[itemName] && prev[itemName] !== itemsDataMap[itemName]) {
                  newData[itemName] = itemsDataMap[itemName];
                  hasChanges = true;
                }
              });
              return hasChanges ? newData : prev;
            });
            
            // Delay entre lotes
            if (batches.indexOf(batch) < batches.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 200));
            }
          }
        }
      } finally {
        isLoadingRef.current = false;
      }
    };

    loadItemsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.slug]);

  // Cargar precios desde la API (una sola llamada)
  useEffect(() => {
    if (!event) return;
    
    const loadPrices = async () => {
      try {
        const allItemNames = new Set<string>();
        
        // Recopilar todos los nombres de items únicos
        event.inGameDonations.forEach(donation => {
          donation.items?.forEach(item => {
            allItemNames.add(item.name);
          });
        });

        if (allItemNames.size === 0) return;

        // Obtener los IDs de los items
        const itemIds: number[] = [];
        const nameToIdMap: Record<string, number> = {};
        
        for (const itemName of allItemNames) {
          const itemId = LEGENDARY_ITEM_IDS[itemName];
          if (itemId) {
            itemIds.push(itemId);
            nameToIdMap[itemName] = itemId;
          }
        }

        if (itemIds.length === 0) return;

        // Hacer una sola llamada a la API para obtener todos los precios
        const pricesResponse = await fetch(
          `https://api.guildwars2.com/v2/commerce/prices?ids=${itemIds.join(',')}`,
          {
            headers: {
              'Accept': 'application/json',
              'Accept-Encoding': 'gzip, deflate, br'
            }
          }
        );

        if (pricesResponse.ok) {
          const pricesData: Array<{ id: number; sells?: { unit_price: number } }> = await pricesResponse.json();
          
          // Crear un mapa de precios por nombre de item
          const pricesMap: Record<string, number> = {};
          
          pricesData.forEach(priceData => {
            // Buscar el nombre del item por su ID
            const itemName = Object.keys(nameToIdMap).find(name => nameToIdMap[name] === priceData.id);
            if (itemName && priceData.sells?.unit_price) {
              // El precio viene en cobre directamente desde la API (precio de venta)
              pricesMap[itemName] = priceData.sells.unit_price;
              console.log(`Precio obtenido para ${itemName}: ${priceData.sells.unit_price} cobre (ID: ${priceData.id})`);
            }
          });

          console.log('Precios obtenidos:', pricesMap);
          setItemPrices(pricesMap);
        }
      } catch (error) {
        console.error('Error fetching prices:', error);
      }
    };

    loadPrices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.slug]);

  // Función para obtener el precio de un item (prioriza precio manual, luego API)
  const getItemPrice = useCallback((item: { name: string; price?: number }) => {
    // Si hay precio manual, usarlo
    if (item.price !== undefined && item.price !== null) {
      return item.price;
    }
    // Si no, usar el precio de la API
    const apiPrice = itemPrices[item.name] || 0;
    if (apiPrice === 0 && item.name) {
      console.log(`No se encontró precio para ${item.name} en itemPrices:`, itemPrices);
    }
    return apiPrice;
  }, [itemPrices]);

  // Función para manejar el clic en el botón del item
  const handleItemClick = useCallback((e: React.MouseEvent, itemKey: string) => {
    e.stopPropagation();
    
    if (activeTooltip === itemKey) {
      setActiveTooltip(null);
      return;
    }
    
    const button = tooltipRefs.current[itemKey];
    if (button) {
      const rect = button.getBoundingClientRect();
      const tooltipHeight = 450;
      const tooltipWidth = 320; // 80 * 4 = 320px (w-80)
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      
      // Siempre mostrar abajo por defecto, solo mostrar arriba si hay menos de 200px abajo
      // Y hay suficiente espacio arriba (más de 500px) para el tooltip completo
      const showBottom = spaceBelow >= 200 || spaceAbove < 500;
      
      // Calcular left ajustado para que no se salga de la pantalla
      let left = rect.left;
      if (left + tooltipWidth > window.innerWidth) {
        left = window.innerWidth - tooltipWidth - 10;
      }
      if (left < 10) {
        left = 10;
      }
      
      // Establecer posición inmediatamente antes de activar el tooltip
      setTooltipPosition(prev => ({
        ...prev,
        [itemKey]: {
          top: showBottom ? rect.bottom + 8 : rect.top - tooltipHeight - 8,
          left: left,
          position: showBottom ? 'bottom' : 'top'
        }
      }));
      
      // Activar el tooltip después de establecer la posición
      setActiveTooltip(itemKey);
    }
  }, [activeTooltip]);

  // Cerrar tooltip al hacer clic fuera
  useEffect(() => {
    if (!activeTooltip) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // No cerrar si el clic fue dentro del tooltip o en un enlace
      if (
        target.closest('[data-tooltip-container]') ||
        target.closest('a[href]')
      ) {
        return;
      }
      // Cerrar solo si el clic no fue en un botón de item
      if (!target.closest('button[type="button"]')) {
        setActiveTooltip(null);
      }
    };

    // Usar setTimeout para evitar que el evento se ejecute inmediatamente
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside, true);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [activeTooltip]);

  const convertCopperToCoins = (copper: number) => {
    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const remainingCopper = copper % 100;
    return { gold, silver, copper: remainingCopper };
  };

  const normalizeCoins = (coins: { gold: number; silver: number; copper: number }) => {
    let { gold, silver, copper } = coins;
    
    // Normalizar cobre (0-99)
    if (copper >= 100) {
      silver += Math.floor(copper / 100);
      copper = copper % 100;
    }
    
    // Normalizar plata (0-99)
    if (silver >= 100) {
      gold += Math.floor(silver / 100);
      silver = silver % 100;
    }
    
    return { gold, silver, copper };
  };

  // Función para convertir monedas a cobre
  const coinsToCopper = (coins: { gold?: number; silver?: number; copper?: number }) => {
    const gold = coins.gold || 0;
    const silver = coins.silver || 0;
    const copper = coins.copper || 0;
    return (gold * 10000) + (silver * 100) + copper;
  };

  // Calcular el total de todas las donaciones
  const calculateTotalDonations = useCallback(() => {
    if (!event) return { gold: 0, silver: 0, copper: 0 };
    
    let totalCopper = 0;

    event.inGameDonations.forEach(donation => {
      // Sumar monedas donadas
      if (donation.coins) {
        totalCopper += coinsToCopper(donation.coins);
      }
      
      // Sumar amount si existe
      if (donation.amount) {
        totalCopper += donation.amount;
      }

      // Sumar precios de items (precio * cantidad)
      if (donation.items) {
        donation.items.forEach(item => {
          const price = getItemPrice(item);
          console.log(`Calculando: ${item.name} - Precio: ${price} cobre, Cantidad: ${item.quantity || 1}`);
          if (price > 0 && item.quantity) {
            const itemTotal = price * item.quantity;
            console.log(`  Total para ${item.name}: ${itemTotal} cobre (${price} * ${item.quantity})`);
            totalCopper += itemTotal;
          } else if (price > 0) {
            // Si no hay cantidad, asumir 1
            totalCopper += price;
          } else {
            console.log(`  ⚠️ Precio es 0 para ${item.name}`);
          }
        });
      }
    });

    console.log(`Total en cobre calculado: ${totalCopper}`);
    const coins = convertCopperToCoins(totalCopper);
    console.log(`Total convertido: ${coins.gold} oro, ${coins.silver} plata, ${coins.copper} cobre`);
    return coins;
  }, [event, getItemPrice]);

  // Recalcular el total cuando cambien los precios
  const totalDonations = useMemo(() => {
    return calculateTotalDonations();
  }, [calculateTotalDonations]);

  // Fecha fija del evento
  const eventDate = lang === 'es' ? '19 de noviembre de 2025' :
                    lang === 'de' ? '19. November 2025' :
                    lang === 'fr' ? '19 novembre 2025' :
                    'November 19, 2025';

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Title */}
          <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
          <p className="text-gray-400 text-lg mb-8">
            {eventDate}
          </p>

          {/* IN-GAME DONATIONS */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold uppercase">{t('contributions.inGameDonations')}</h2>
              {/* Total de donaciones */}
              <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-lg border border-purple-500/30">
                <span className="text-gray-400 text-sm font-semibold uppercase">Total:</span>
                <div className="flex items-center gap-2">
                  {totalDonations.gold > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 font-bold text-lg">{totalDonations.gold.toLocaleString()}</span>
                      <Image
                        src="/images/expansions/Gold.webp"
                        alt="Gold"
                        width={18}
                        height={18}
                        className="w-4.5 h-4.5"
                        unoptimized
                      />
                    </div>
                  )}
                  {totalDonations.silver > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-gray-300 font-bold text-lg">{totalDonations.silver.toLocaleString()}</span>
                      <Image
                        src="/images/expansions/Silver.webp"
                        alt="Silver"
                        width={18}
                        height={18}
                        className="w-4.5 h-4.5"
                        unoptimized
                      />
                    </div>
                  )}
                  {(totalDonations.copper > 0 || totalDonations.gold > 0 || totalDonations.silver > 0) && (
                    <div className="flex items-center gap-1">
                      <span className="text-orange-400 font-bold text-lg">{String(totalDonations.copper).padStart(2, '0')}</span>
                      <Image
                        src="/images/expansions/Copper.webp"
                        alt="Copper"
                        width={18}
                        height={18}
                        className="w-4.5 h-4.5"
                        unoptimized
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto overflow-y-visible relative">
              <table className="w-full border-collapse overflow-visible">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold"></th>
                    <th className="text-right py-3 px-4 text-gray-400 font-semibold"></th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold"></th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold"></th>
                    <th className="text-left py-3 px-4 text-gray-400 font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {event.inGameDonations
                    .sort((a, b) => {
                      // Calcular el total en cobre para la donación a
                      let totalCopperA = 0;
                      if (a.coins) {
                        totalCopperA += coinsToCopper(a.coins);
                      }
                      if (a.amount) {
                        totalCopperA += a.amount;
                      }
                      if (a.items) {
                        a.items.forEach(item => {
                          const price = getItemPrice(item);
                          if (price > 0 && item.quantity) {
                            totalCopperA += price * item.quantity;
                          } else if (price > 0) {
                            totalCopperA += price;
                          }
                        });
                      }
                      
                      // Calcular el total en cobre para la donación b
                      let totalCopperB = 0;
                      if (b.coins) {
                        totalCopperB += coinsToCopper(b.coins);
                      }
                      if (b.amount) {
                        totalCopperB += b.amount;
                      }
                      if (b.items) {
                        b.items.forEach(item => {
                          const price = getItemPrice(item);
                          if (price > 0 && item.quantity) {
                            totalCopperB += price * item.quantity;
                          } else if (price > 0) {
                            totalCopperB += price;
                          }
                        });
                      }
                      
                      // Ordenar de mayor a menor
                      return totalCopperB - totalCopperA;
                    })
                    .map((donation, index) => {
                      // Calcular el valor total de los items en cobre
                      let itemsValueCopper = 0;
                      if (donation.items) {
                        donation.items.forEach(item => {
                          const price = getItemPrice(item);
                          if (price > 0 && item.quantity) {
                            itemsValueCopper += price * item.quantity;
                          } else if (price > 0) {
                            // Si no hay cantidad, asumir 1
                            itemsValueCopper += price;
                          }
                        });
                      }
                      const itemsCoins = itemsValueCopper > 0 ? convertCopperToCoins(itemsValueCopper) : null;
                      
                      // Combinar coins, amount convertido a monedas, y valor de items
                      const amountCoins = donation.amount ? convertCopperToCoins(donation.amount) : null;
                      const combinedCoins = normalizeCoins({
                        gold: (donation.coins?.gold || 0) + (amountCoins?.gold || 0) + (itemsCoins?.gold || 0),
                        silver: (donation.coins?.silver || 0) + (amountCoins?.silver || 0) + (itemsCoins?.silver || 0),
                        copper: (donation.coins?.copper || 0) + (amountCoins?.copper || 0) + (itemsCoins?.copper || 0),
                      });
                      const hasCoins = combinedCoins.gold > 0 || combinedCoins.silver > 0 || combinedCoins.copper > 0;

                      return (
                        <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-base overflow-visible">
                            <div className="flex items-center gap-2">
                              <span>{donation.name}</span>
                              {donation.twitch && (
                                <a
                                  href={donation.twitch}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-purple-400 hover:text-purple-300 transition-colors">
                                  <TwitchIcon className="w-4 h-4" />
                                </a>
                              )}
                              {donation.youtube && (
                                <a
                                  href={donation.youtube}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-red-500 hover:text-red-400 transition-colors">
                                  <YouTubeIcon className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right overflow-visible"></td>
                          <td className="py-3 px-4 overflow-visible">
                            {hasCoins && (
                              <div className="flex items-center gap-2 flex-wrap">
                                {combinedCoins.gold > 0 && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-yellow-400 font-semibold text-sm">{combinedCoins.gold.toLocaleString()}</span>
                                    <Image
                                      src="/images/expansions/Gold.webp"
                                      alt="Gold"
                                      width={14}
                                      height={14}
                                      className="w-3.5 h-3.5"
                                      unoptimized
                                    />
                                  </div>
                                )}
                                {combinedCoins.silver > 0 && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-300 font-semibold text-sm">{combinedCoins.silver.toLocaleString()}</span>
                                    <Image
                                      src="/images/expansions/Silver.webp"
                                      alt="Silver"
                                      width={14}
                                      height={14}
                                      className="w-3.5 h-3.5"
                                      unoptimized
                                    />
                                  </div>
                                )}
                                {(combinedCoins.copper > 0 || combinedCoins.gold > 0 || combinedCoins.silver > 0) && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-orange-400 font-semibold text-sm">{String(combinedCoins.copper).padStart(2, '0')}</span>
                                    <Image
                                      src="/images/expansions/Copper.webp"
                                      alt="Copper"
                                      width={14}
                                      height={14}
                                      className="w-3.5 h-3.5"
                                      unoptimized
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </td>
                        <td className="py-3 px-4 overflow-visible">
                          {donation.items && donation.items.length > 0 && (
                            <div className="flex items-center gap-2 flex-wrap">
                              {donation.items.map((item, itemIndex) => {
                                const itemData = itemsData[item.name];
                                // Si el nombre del item es una clave de traducción, usarla directamente
                                const isTranslationKey = item.name.includes('.');
                                const itemName = isTranslationKey 
                                  ? t(item.name)
                                  : (itemData?.names[lang as keyof typeof itemData.names] || itemData?.names.en || item.name);
                                // El icono puede venir del item directamente o de los datos de la API
                                const itemIcon = item.icon || itemData?.icon;
                                const itemKey = `${donation.name}-${itemIndex}`;
                                const isTooltipActive = activeTooltip === itemKey;
                                const position = tooltipPosition[itemKey];
                                
                                return (
                                  <div 
                                    key={itemIndex} 
                                    className="relative flex items-center gap-1 whitespace-nowrap"
                                  >
                                    {item.quantity && item.quantity > 1 && (
                                      <span className="text-gray-400">{item.quantity} </span>
                                    )}
                                    {itemIcon && (
                                      <Image
                                        src={itemIcon}
                                        alt={itemName}
                                        width={16}
                                        height={16}
                                        className="w-4 h-4"
                                        unoptimized
                                      />
                                    )}
                                    <button
                                      type="button"
                                      ref={(el) => { tooltipRefs.current[itemKey] = el; }}
                                      onClick={(e) => handleItemClick(e, itemKey)}
                                      className="text-purple-400 text-sm hover:text-purple-300 transition-colors cursor-pointer"
                                    >
                                      {itemName}
                                    </button>
                                    
                                    {/* Tooltip */}
                                    {isTooltipActive && position && (itemData || isTranslationKey) && (
                                      <div 
                                        data-tooltip-container
                                        className="fixed z-[9999] w-80 bg-slate-800 border border-purple-500/50 rounded-lg shadow-xl p-4"
                                        style={{
                                          top: `${position.top}px`,
                                          left: `${position.left}px`
                                        }}
                                      >
                                        {/* Header con icono y nombre */}
                                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
                                          {itemIcon && (
                                            <Image
                                              src={itemIcon}
                                              alt={itemName}
                                              width={32}
                                              height={32}
                                              className="w-8 h-8"
                                              unoptimized
                                            />
                                          )}
                                          <div className="flex-1">
                                            <h3 className="text-white font-semibold text-sm">{itemName}</h3>
                                            {itemData?.type && (
                                              <p className="text-gray-400 text-xs">{translateType(itemData.type, lang)}</p>
                                            )}
                                          </div>
                                        </div>
                                        
                                        {/* Descripción */}
                                        {itemData?.description && itemData.description[lang as keyof typeof itemData.description] && (
                                          <p className="text-gray-300 text-xs mb-3 line-clamp-3">
                                            {itemData.description[lang as keyof typeof itemData.description]}
                                          </p>
                                        )}
                                        
                                        {/* Información adicional */}
                                        {itemData && (
                                          <div className="flex gap-4 mb-3 text-xs">
                                            {itemData.rarity && (
                                              <span className="text-gray-400">
                                                {getTranslation('rarity', lang)}: <span className="text-purple-400 capitalize">{translateRarity(itemData.rarity, lang)}</span>
                                              </span>
                                            )}
                                            {itemData.level && (
                                              <span className="text-gray-400">
                                                {getTranslation('level', lang)}: <span className="text-purple-400">{itemData.level}</span>
                                              </span>
                                            )}
                                          </div>
                                        )}
                                        
                                        {/* Enlaces a wikis */}
                                        {itemData && (
                                          <div className="border-t border-gray-700 pt-2">
                                            <p className="text-gray-400 text-xs mb-2">Wiki:</p>
                                            <div className="flex flex-wrap gap-2">
                                              {(['en', 'es', 'de', 'fr'] as const).map((wikiLang) => {
                                                const wikiName = itemData.names[wikiLang] || itemData.names.en;
                                                const wikiUrl = getWikiUrl(wikiName, wikiLang);
                                                return (
                                                  <a
                                                    key={wikiLang}
                                                    href={wikiUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      e.preventDefault();
                                                      window.open(wikiUrl, '_blank', 'noopener,noreferrer');
                                                    }}
                                                  >
                                                    {wikiLang.toUpperCase()}
                                                    <ExternalLink className="w-3 h-3" />
                                                  </a>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </td>

                      </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

