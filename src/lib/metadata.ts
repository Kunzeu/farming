import type { Metadata } from "next";
import { headers } from "next/headers";

const slogans = [
  "Passion for gold",
  "Gold - Today and tomorrow", 
  "Gold is my passion",
  "True Farming Saves Your Time",
  "We use real data, not like others",
  "The art of True Farming",
  "All you need is True Farming",
  "Real Farming? It must be like True Data",
  "Don't Say Fast, Say True",
  "The gold don't wait people",
  "My Doctor Says 'A good farmer is a true farmer'",
  "600g/h? We show you that doesn't exist!"
];

// Función para obtener slogan aleatorio
function getRandomSlogan(): string {
  return slogans[Math.floor(Math.random() * slogans.length)];
}

// Mapeo de rutas a títulos de página
const pageTitleMap: Record<string, string> = {
  '/': 'pageTitles.home',
  '/farming-routes': 'pageTitles.farmingRoutes',
  '/daily-routine': 'pageTitles.dailyRoutine',
  '/salvage': 'pageTitles.salvaging',
  '/conversion-guide': 'pageTitles.crafting',
  '/festivals': 'pageTitles.festivals',
  '/glossary': 'pageTitles.glossary',
  '/buyout': 'pageTitles.buyout',
  '/fractals': 'pageTitles.fractals',
  '/orrian-jewelry-box': 'pageTitles.orrianJewelryBox',
  '/admin': 'pageTitles.admin',
  '/moderator': 'pageTitles.moderator',
  '/profile': 'pageTitles.profile',
  '/login': 'pageTitles.login',
  '/register': 'pageTitles.register',
  '/account': 'pageTitles.account',
  '/account/bank': 'pageTitles.bank',
  '/account/characters': 'pageTitles.characters',
  '/account/wallet': 'pageTitles.wallet',
  '/account/storage': 'pageTitles.storage',
  '/account/search': 'pageTitles.search',
  '/account/settings': 'pageTitles.settings',
  '/festivals/wintersday': 'pageTitles.wintersday',
  '/festivals/halloween': 'pageTitles.halloween',
  '/festivals/halloween/labyrinth-guide': 'pageTitles.halloweenLabyrinth',
  '/festivals/lunar-new-year': 'pageTitles.lunarNewYear',
  '/festivals/dragon-bash': 'pageTitles.dragonBash',
  '/festivals/four-winds': 'pageTitles.fourWinds',
  '/salvage/common': 'pageTitles.salvageCommon',
  '/salvage/masterwork': 'pageTitles.salvageMasterwork',
  '/salvage/rare': 'pageTitles.salvageRare',
  '/salvage/research-notes': 'pageTitles.researchNotes',
  '/giveaways': 'pageTitles.giveaways',
  '/opened': 'pageTitles.opened',
  '/garden': 'pageTitles.garden',
  '/gift-of-mastery': 'pageTitles.giftOfMastery',
  '/gift-of-jade-mastery': 'pageTitles.giftOfJadeMastery',
  '/trophy': 'pageTitles.trophy',
  '/ectogambling': 'pageTitles.ectogambling',
  '/privacy-policy': 'pageTitles.privacyPolicy',
  '/terms-of-service': 'pageTitles.termsOfService',
  '/cookie-policy': 'pageTitles.cookiePolicy',
  '/data-management': 'pageTitles.dataManagement',
};

// Función para obtener el título de la página basado en la ruta
function getPageTitle(pathname: string): string {
  // Buscar coincidencia exacta primero
  if (pageTitleMap[pathname]) {
    return pageTitleMap[pathname];
  }
  
  // Buscar coincidencia parcial para rutas anidadas
  for (const [route, titleKey] of Object.entries(pageTitleMap)) {
    if (pathname.startsWith(route) && route !== '/') {
      return titleKey;
    }
  }
  
  // Título por defecto
  return 'pageTitles.home';
}

// Función para generar metadatos dinámicos
export function generateMetadata(): Metadata {
  const randomSlogan = getRandomSlogan();
  
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.true-farming.com'),
    title: "True Farming",
    description: `${randomSlogan} - Your platform to optimize farming in Guild Wars 2`,
    keywords: ["Guild Wars 2", "farming", "gold", "materials", "gaming", "MMORPG"],
    authors: [{ name: "True Farming" }],
    creator: "True Farming",
    publisher: "True Farming",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://www.true-farming.com',
      title: 'True Farming - Guild Wars 2',
      description: `${randomSlogan} - Your platform to optimize farming in Guild Wars 2`,
      siteName: 'True Farming',
      images: [
        {
          url: '/images/icons/icontag.webp',
          width: 1200,
          height: 630,
          alt: 'True Farming - Guild Wars 2',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'True Farming - Guild Wars 2',
      description: `${randomSlogan} - Your platform to optimize farming in Guild Wars 2`,
      images: ['/images/icons/icontag.webp'],
    },
    icons: {
      icon: [
        { url: '/images/icons/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
        { url: '/images/icons/favicon.svg', type: 'image/svg+xml', sizes: '16x16' },
        { url: '/images/icons/favicon.svg', type: 'image/svg+xml', sizes: '32x32' },
        { url: '/images/icons/favicon.svg', type: 'image/svg+xml', sizes: '192x192' },
        { url: '/images/icons/favicon.svg', type: 'image/svg+xml', sizes: '512x512' },
      ],
      shortcut: '/images/icons/favicon.svg',
      apple: [
        { url: '/images/icons/favicon.svg', sizes: '180x180', type: 'image/svg+xml' },
      ],
      other: [
        {
          rel: 'mask-icon',
          url: '/images/icons/favicon.svg',
          color: '#c1272d',
        },
      ],
    },
    manifest: '/manifest.json',
    other: {
      'msapplication-TileColor': '#c1272d',
      'msapplication-config': '/browserconfig.xml',
      'theme-color': '#c1272d',
    },
  };
}

// Función para generar metadatos dinámicos basados en la ruta
export async function generateDynamicMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  const randomSlogan = getRandomSlogan();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.true-farming.com';
  
  // Obtener el título de la página basado en la ruta
  const pageTitleKey = getPageTitle(pathname);
  
  // Por ahora usamos títulos en inglés como fallback
  // En el futuro esto se puede hacer dinámico con el idioma del usuario
  const pageTitles: Record<string, string> = {
    'pageTitles.home': 'Home',
    'pageTitles.farmingRoutes': 'Farming Routes',
    'pageTitles.dailyRoutine': 'Daily Routine',
    'pageTitles.salvaging': 'Salvaging',
    'pageTitles.crafting': 'Material Analysis',
    'pageTitles.festivals': 'Festivals',
    'pageTitles.glossary': 'Glossary',
    'pageTitles.buyout': 'Buyout Calculator',
    'pageTitles.fractals': 'Fractals',
    'pageTitles.orrianJewelryBox': 'Orrian Jewelry Box',
    'pageTitles.admin': 'Admin Panel',
    'pageTitles.moderator': 'Moderator Panel',
    'pageTitles.profile': 'My Profile',
    'pageTitles.login': 'Login',
    'pageTitles.register': 'Register',
    'pageTitles.account': 'Account',
    'pageTitles.bank': 'Bank',
    'pageTitles.characters': 'Characters',
    'pageTitles.wallet': 'Wallet',
    'pageTitles.storage': 'Material Storage',
    'pageTitles.search': 'Account Search',
    'pageTitles.settings': 'Account Settings',
    'pageTitles.wintersday': 'Wintersday',
    'pageTitles.halloween': 'Halloween Festival',
    'pageTitles.halloweenLabyrinth': 'Complete Labyrinth Guide',
    'pageTitles.lunarNewYear': 'Lunar New Year',
    'pageTitles.dragonBash': 'Dragon Bash',
    'pageTitles.fourWinds': 'Four Winds Festival',
    'pageTitles.salvageCommon': 'Salvage - Common',
    'pageTitles.salvageMasterwork': 'Salvage - Masterwork',
    'pageTitles.salvageRare': 'Salvage - Rare',
    'pageTitles.researchNotes': 'Research Notes - Salvaging',
    'pageTitles.giveaways': 'Community Giveaways',
    'pageTitles.opened': 'Openable Containers',
    'pageTitles.garden': 'Garden',
    'pageTitles.giftOfMastery': 'Gift of Mastery',
    'pageTitles.giftOfJadeMastery': 'Gift of Jade Mastery',
    'pageTitles.trophy': 'Trophy',
    'pageTitles.ectogambling': 'Ecto Gambling',
    'pageTitles.privacyPolicy': 'Privacy Policy',
    'pageTitles.termsOfService': 'Terms of Service',
    'pageTitles.cookiePolicy': 'Cookie Policy',
    'pageTitles.dataManagement': 'Data Management',
  };
  
  const pageTitle = pageTitles[pageTitleKey] || 'True Farming';
  const fullTitle = pageTitle === 'Home' ? 'True Farming' : `True Farming - ${pageTitle}`;
  
  return {
    metadataBase: new URL(baseUrl),
    title: fullTitle,
    description: `${randomSlogan} - Your platform to optimize farming in Guild Wars 2`,
    keywords: ["Guild Wars 2", "farming", "gold", "materials", "gaming", "MMORPG"],
    authors: [{ name: "True Farming" }],
    creator: "True Farming",
    publisher: "True Farming",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `${baseUrl}${pathname}`,
      title: fullTitle,
      description: `${randomSlogan} - Your platform to optimize farming in Guild Wars 2`,
      siteName: 'True Farming',
      images: [
        {
          url: '/images/icons/icontag.webp',
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: `${randomSlogan} - Your platform to optimize farming in Guild Wars 2`,
      images: ['/images/icons/icontag.webp'],
    },
    icons: {
      icon: [
        { url: '/images/icons/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
        { url: '/images/icons/favicon.svg', type: 'image/svg+xml', sizes: '16x16' },
        { url: '/images/icons/favicon.svg', type: 'image/svg+xml', sizes: '32x32' },
        { url: '/images/icons/favicon.svg', type: 'image/svg+xml', sizes: '192x192' },
        { url: '/images/icons/favicon.svg', type: 'image/svg+xml', sizes: '512x512' },
      ],
      shortcut: '/images/icons/favicon.svg',
      apple: [
        { url: '/images/icons/favicon.svg', sizes: '180x180', type: 'image/svg+xml' },
      ],
      other: [
        {
          rel: 'mask-icon',
          url: '/images/icons/favicon.svg',
          color: '#c1272d',
        },
      ],
    },
    manifest: '/manifest.json',
    other: {
      'msapplication-TileColor': '#c1272d',
      'msapplication-config': '/browserconfig.xml',
      'theme-color': '#c1272d',
    },
  };
}
