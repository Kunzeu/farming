// Configuración completa de sorteos
// Modifica este archivo para cambiar cualquier aspecto de los sorteos


export interface Giveaway {
  id: string;
  slug: string;
  title: string;
  description: string;
  startDate: string; // 
  endDate: string; // 
  status: 'upcoming' | 'active' | 'ended' | 'cancelled' | 'winners_announced';
  prizes: Array<{
    position: number;
    prize: string;
    icon: 'gem' | 'package' | 'gold' | 'materials';
    itemId?: number;
    quantity?: number;
    gemPrize?: boolean; // Indica si es un premio de gemas
  }>;
  requirements: string[];
  rules: string[];
  maxParticipants?: number;
}

// Configuración de todos los sorteos
export const GIVEAWAYS: Giveaway[] = [
  {
    id: 'october-2025',
    slug: 'october-2025-gems',
    title: 'giveaways.october2025.title',
    description: 'giveaways.october2025.description',
    startDate: '2025-10-01T00:00:00.000Z', // 1 Oct 2025 00:00 UTC = 30 Sep 2025 19:00 Colombia
    endDate: '2025-11-01T00:00:00.000Z',   // 1 Nov 2025 00:00 UTC = 31 Oct 2025 19:00 Colombia
    status: 'winners_announced',
           prizes: [
             { position: 1, prize: '1200', icon: 'gem', quantity: 1200, gemPrize: true },
             { position: 2, prize: '800', icon: 'gem', quantity: 800, gemPrize: true },
             { position: 3, prize: '400', icon: 'gem', quantity: 400, gemPrize: true },
             { position: 4, prize: '400', icon: 'gem', quantity: 400, gemPrize: true },
             { position: 5, prize: '250', icon: 'package', itemId: 19721, quantity: 250 },
             { position: 6, prize: '250', icon: 'package', itemId: 19721, quantity: 250 },
             { position: 7, prize: '250', icon: 'package', itemId: 19721, quantity: 250 },
             { position: 8, prize: '250', icon: 'package', itemId: 19721, quantity: 250 },
             { position: 9, prize: '250', icon: 'package', itemId: 19721, quantity: 250 },
             { position: 10, prize: '250', icon: 'package', itemId: 19721, quantity: 250 }
           ],
    requirements: [
      'Link your GW2 API key to your account',
      'Join our Discord server',
      'Follow us on social media'
    ],
    rules: [
      'One entry per person',
      'Must have valid GW2 account',
      'API key must be active during the entire giveaway period',
      'Winners will be selected randomly',
      'Prizes will be delivered within 48 hours'
    ],
    maxParticipants: undefined
  },
  {
    id: 'november-2025',
    slug: 'november-2025-gems',
    title: 'giveaways.november2025.title',
    description: 'giveaways.november2025.description',
    startDate: '2025-11-01T00:00:00.000Z',
    endDate: '2025-11-30T00:00:00.000Z',
    status: 'winners_announced',
           prizes: [
             { position: 1, prize: '1200', icon: 'gem', quantity: 1200, gemPrize: true },
             { position: 2, prize: '800', icon: 'gem', quantity: 800, gemPrize: true },
             { position: 3, prize: '400', icon: 'gem', quantity: 400, gemPrize: true },
             { position: 4, prize: '400', icon: 'gem', quantity: 400, gemPrize: true },
             { position: 5, prize: '250', icon: 'package', itemId: 19721, quantity: 250 },
             { position: 6, prize: '250', icon: 'package', itemId: 19721, quantity: 250 },
             { position: 7, prize: '250', icon: 'package', itemId: 19721, quantity: 250 },
             { position: 8, prize: '250', icon: 'package', itemId: 19721, quantity: 250 },
             { position: 9, prize: '250', icon: 'package', itemId: 19721, quantity: 250 },
             { position: 10, prize: '250', icon: 'package', itemId: 19721, quantity: 250 }
           ],
    requirements: [
      'Link your GW2 API key to your account',
      'Join our Discord server',
      'Follow us on social media'
    ],
    rules: [
      'One entry per person',
      'Must have valid GW2 account',
      'API key must be active during the entire giveaway period',
      'Winners will be selected randomly',
      'Prizes will be delivered within 48 hours'
    ],
    maxParticipants: undefined
  }
];

// Generar sorteos de adviento para diciembre 2025
export function generateAdventGiveaways(year: number = 2025): Giveaway[] {
  const adventGiveaways: Giveaway[] = [];
  
  // Premios variados para cada día (puedes personalizar esto)
  const dailyPrizes = [
    // Días 1-7
    [
      { position: 1, prize: '1200', icon: 'gem' as const, quantity: 1200, gemPrize: true },
      { position: 2, prize: '250', icon: 'package' as const, itemId: 19721, quantity: 250 },
      { position: 3, prize: '25', icon: 'package' as const, itemId: 19721, quantity: 25 }
    ],
    // Días 8-14
    [
      { position: 1, prize: '800', icon: 'gem' as const, quantity: 800, gemPrize: true },
      { position: 2, prize: '250', icon: 'package' as const, itemId: 19721, quantity: 250 },
      { position: 3, prize: '50', icon: 'package' as const, itemId: 19721, quantity: 50 }
    ],
    // Días 15-21
    [
      { position: 1, prize: '400', icon: 'gem' as const, quantity: 400, gemPrize: true },
      { position: 2, prize: '250', icon: 'package' as const, itemId: 19721, quantity: 250 },
      { position: 3, prize: '100', icon: 'package' as const, itemId: 19721, quantity: 100 }
    ],
    // Días 22-28
    [
      { position: 1, prize: '2000', icon: 'gem' as const, quantity: 2000, gemPrize: true },
      { position: 2, prize: '500', icon: 'package' as const, itemId: 19721, quantity: 500 },
      { position: 3, prize: '250', icon: 'package' as const, itemId: 19721, quantity: 250 }
    ],
    // Días 29-31
    [
      { position: 1, prize: '3000', icon: 'gem' as const, quantity: 3000, gemPrize: true },
      { position: 2, prize: '1000', icon: 'package' as const, itemId: 19721, quantity: 1000 },
      { position: 3, prize: '500', icon: 'package' as const, itemId: 19721, quantity: 500 }
    ]
  ];

  for (let day = 1; day <= 31; day++) {
    const dayStr = day.toString().padStart(2, '0');
    // España en diciembre está en UTC+1, entonces 20:00 España = 19:00 UTC
    const startDate = new Date(Date.UTC(year, 11, day, 0, 0, 0)); // Diciembre (mes 11) a las 00:00 UTC
    const endDate = new Date(Date.UTC(year, 11, day, 19, 0, 0)); // Mismo día a las 20:00 hora de España (19:00 UTC)
    
    // Seleccionar premios según el día
    let prizes;
    if (day <= 7) {
      prizes = dailyPrizes[0];
    } else if (day <= 14) {
      prizes = dailyPrizes[1];
    } else if (day <= 21) {
      prizes = dailyPrizes[2];
    } else if (day <= 28) {
      prizes = dailyPrizes[3];
    } else {
      prizes = dailyPrizes[4];
    }

    adventGiveaways.push({
      id: `advent-${year}-12-${dayStr}`,
      slug: `advent-${year}-12-${dayStr}`,
      title: `Sorteo Día ${day} - Diciembre ${year}`,
      description: `¡Abre el sorteo del día ${day} de diciembre y participa para ganar increíbles premios!`,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 'upcoming', // Se actualizará automáticamente según la fecha
      prizes: prizes,
      requirements: [
        'Link your GW2 API key to your account',
        'Join our Discord server'
      ],
      rules: [
        'One entry per person',
        'Must have valid GW2 account',
        'API key must be active',
        'Winners will be selected randomly',
        'Prizes will be delivered within 48 hours'
      ],
      maxParticipants: undefined
    });
  }

  return adventGiveaways;
}

// Agregar sorteos de adviento a la lista de sorteos
export function getAllGiveawaysWithAdvent(year: number = 2025): Giveaway[] {
  const adventGiveaways = generateAdventGiveaways(year);
  return [...GIVEAWAYS, ...adventGiveaways];
}

// Función para obtener sorteo por ID
export function getGiveawayById(id: string): Giveaway | undefined {
  return GIVEAWAYS.find(g => g.id === id);
}

// Función para obtener sorteo por slug
export function getGiveawayBySlug(slug: string): Giveaway | undefined {
  return GIVEAWAYS.find(g => g.slug === slug);
}

// Función para obtener sorteo activo
export function getActiveGiveaway(): Giveaway | undefined {
  const now = new Date();
  return GIVEAWAYS.find(g => {
    const start = new Date(g.startDate);
    const end = new Date(g.endDate);
    return g.status === 'active' && start <= now && end > now;
  });
}

// Función para obtener todos los sorteos
export function getAllGiveaways(): Giveaway[] {
  return GIVEAWAYS;
}

// Función para actualizar estado de sorteos basado en fechas
export function updateGiveawayStatuses(): Giveaway[] {
  const now = new Date();
  
  return GIVEAWAYS.map(giveaway => {
    const start = new Date(giveaway.startDate);
    const end = new Date(giveaway.endDate);
    
    let newStatus = giveaway.status;
    
    if (giveaway.status === 'upcoming' && start <= now && end > now) {
      newStatus = 'active';
    } else if (giveaway.status === 'active' && end <= now) {
      newStatus = 'ended';
    }
    
    return {
      ...giveaway,
      status: newStatus
    };
  });
}

// Función para obtener información de un item de GW2
export async function getItemInfo(itemId: number, lang: string = 'en'): Promise<{ name: string; icon: string } | null> {
  try {
    // Mapear idiomas a códigos de GW2 API
    const gw2LangMap: Record<string, string> = {
      'en': 'en',
      'es': 'es', 
      'de': 'de',
      'fr': 'fr'
    };
    
    const gw2Lang = gw2LangMap[lang] || 'en';
    
    // Hacer la petición con el parámetro de idioma
    const response = await fetch(`https://api.guildwars2.com/v2/items/${itemId}?lang=${gw2Lang}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const item = await response.json();
    return {
      name: item.name,
      icon: item.icon
    };
  } catch (error) {
    console.error(`Error fetching item ${itemId} in ${lang}:`, error);
    return null;
  }
}

// Función simple de traducción para usar en la API
function getItemTranslation(itemId: number, lang: string): string {
  const translations: Record<string, Record<number, string>> = {
    'en': {
      19721: 'Glob of Ectoplasm'
    },
    'es': {
      19721: 'Pegote de Ectoplasma'
    },
    'de': {
      19721: 'Ektoplasmakugel'
    },
    'fr': {
      19721: 'Boule d\'Ectoplasme'
    }
  };
  
  return translations[lang]?.[itemId] || translations['en']?.[itemId] || `Item ${itemId}`;
}

// Función para obtener información de todos los items de un sorteo
export async function getGiveawayItemsInfo(giveaway: Giveaway, lang: string = 'en', t?: (key: string, fallback?: string) => string): Promise<Array<{
  position: number;
  prize: string;
  icon: 'gem' | 'package' | 'gold' | 'materials';
  itemId?: number;
  quantity?: number;
  itemName?: string;
  itemIcon?: string;
  gemPrize?: boolean;
}>> {
  const prizesWithItems = await Promise.all(
    giveaway.prizes.map(async (prize) => {
      if (prize.gemPrize) {
        // Para premios de gemas, usar el icono oficial de GW2
        return {
          ...prize,
          itemName: t ? t('giveaways.gems', 'Gems') : 'Gems',
          itemIcon: 'https://wiki.guildwars2.com/images/8/88/Gem_%28highres%29.png'
        };
      } else if (prize.itemId) {
        const itemInfo = await getItemInfo(prize.itemId, lang);
        
        // Si no hay API disponible, usar traducciones locales
        if (!itemInfo) {
          const translatedName = t ? t(`giveaways.items.${prize.itemId}`, prize.prize) : getItemTranslation(prize.itemId, lang);
          return {
            ...prize,
            itemName: translatedName,
            itemIcon: 'https://wiki.guildwars2.com/images/9/9b/Glob_of_Ectoplasm.png'
          };
        }
        
        return {
          ...prize,
          itemName: itemInfo?.name || prize.prize,
          itemIcon: itemInfo?.icon || 'https://wiki.guildwars2.com/images/9/9b/Glob_of_Ectoplasm.png'
        };
      }
      return prize;
    })
  );
  
  return prizesWithItems;
}
