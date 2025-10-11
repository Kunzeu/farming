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

// Función para detectar el idioma del usuario desde los headers
async function getUserLanguage(): Promise<string> {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || 'en';
  
  // Extraer el primer idioma preferido
  const primaryLanguage = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
  
  // Idiomas soportados
  const supportedLanguages = ['en', 'es', 'fr', 'de'];
  
  return supportedLanguages.includes(primaryLanguage) ? primaryLanguage : 'en';
}

// Función para obtener slogans en diferentes idiomas
function getRandomSloganByLanguage(language: string): string {
  const slogansByLanguage: Record<string, string[]> = {
    en: [
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
    ],
    es: [
      "Pasión por el oro",
      "Oro - Hoy y mañana",
      "El oro es mi pasión",
      "True Farming Ahorra Tu Tiempo",
      "Usamos datos reales, no como otros",
      "El arte de True Farming",
      "Todo lo que necesitas es True Farming",
      "¿Farming real? Debe ser como True Data",
      "No digas rápido, di True",
      "El oro no espera a la gente",
      "Mi Doctor dice 'Un buen farmer es un true farmer'",
      "¿600g/h? ¡Te mostramos que eso no existe!"
    ],
    fr: [
      "Passion pour l'or",
      "Or - Aujourd'hui et demain",
      "L'or est ma passion",
      "True Farming Économise Votre Temps",
      "Nous utilisons de vraies données, pas comme les autres",
      "L'art de True Farming",
      "Tout ce dont vous avez besoin c'est True Farming",
      "Farming réel? Ça doit être comme True Data",
      "Ne dites pas rapide, dites True",
      "L'or n'attend pas les gens",
      "Mon Docteur dit 'Un bon farmer est un true farmer'",
      "600g/h? On vous montre que ça n'existe pas!"
    ],
    de: [
      "Leidenschaft für Gold",
      "Gold - Heute und morgen",
      "Gold ist meine Leidenschaft",
      "True Farming Spart Ihre Zeit",
      "Wir verwenden echte Daten, nicht wie andere",
      "Die Kunst des True Farming",
      "Alles was Sie brauchen ist True Farming",
      "Echtes Farming? Es muss wie True Data sein",
      "Sagen Sie nicht schnell, sagen Sie True",
      "Das Gold wartet nicht auf Menschen",
      "Mein Arzt sagt 'Ein guter Farmer ist ein true farmer'",
      "600g/h? Wir zeigen Ihnen, dass das nicht existiert!"
    ]
  };
  
  const slogans = slogansByLanguage[language] || slogansByLanguage['en'];
  return slogans[Math.floor(Math.random() * slogans.length)];
}

// Función para generar metadatos dinámicos basados en la ruta
export async function generateDynamicMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '/';
  const language = await getUserLanguage();
  const randomSlogan = getRandomSloganByLanguage(language);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.true-farming.com';
  
  // Obtener el título de la página basado en la ruta
  const pageTitleKey = getPageTitle(pathname);
  
  // Títulos en diferentes idiomas
  const pageTitlesByLanguage: Record<string, Record<string, string>> = {
    en: {
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
    },
    es: {
      'pageTitles.home': 'Inicio',
      'pageTitles.farmingRoutes': 'Rutas de Farming',
      'pageTitles.dailyRoutine': 'Rutina Diaria',
      'pageTitles.salvaging': 'Desmantelamiento',
      'pageTitles.crafting': 'Análisis de Materiales',
      'pageTitles.festivals': 'Festivales',
      'pageTitles.glossary': 'Glosario',
      'pageTitles.buyout': 'Calculadora de Compra',
      'pageTitles.fractals': 'Fractales',
      'pageTitles.orrianJewelryBox': 'Caja de Joyas Orrianas',
      'pageTitles.admin': 'Panel de Administración',
      'pageTitles.moderator': 'Panel de Moderador',
      'pageTitles.profile': 'Mi Perfil',
      'pageTitles.login': 'Iniciar Sesión',
      'pageTitles.register': 'Registrarse',
      'pageTitles.account': 'Cuenta',
      'pageTitles.bank': 'Banco',
      'pageTitles.characters': 'Personajes',
      'pageTitles.wallet': 'Monedero',
      'pageTitles.storage': 'Almacén de Materiales',
      'pageTitles.search': 'Búsqueda de Cuentas',
      'pageTitles.settings': 'Configuración de Cuenta',
      'pageTitles.wintersday': 'Día de Invierno',
      'pageTitles.halloween': 'Festival de Halloween',
      'pageTitles.halloweenLabyrinth': 'Guía Completa del Laberinto',
      'pageTitles.lunarNewYear': 'Año Nuevo Lunar',
      'pageTitles.dragonBash': 'Dragon Bash',
      'pageTitles.fourWinds': 'Festival de los Cuatro Vientos',
      'pageTitles.salvageCommon': 'Desmantelar - Común',
      'pageTitles.salvageMasterwork': 'Desmantelar - Obra Maestra',
      'pageTitles.salvageRare': 'Desmantelar - Raro',
      'pageTitles.researchNotes': 'Notas de Investigación - Desmantelamiento',
      'pageTitles.giveaways': 'Sorteos',
      'pageTitles.opened': 'Contenedores Abribles',
      'pageTitles.garden': 'Jardín',
      'pageTitles.giftOfMastery': 'Regalo de Maestría',
      'pageTitles.giftOfJadeMastery': 'Regalo de Maestría de Jade',
      'pageTitles.trophy': 'Trofeo',
      'pageTitles.ectogambling': 'Apuestas de Ectoplasma',
      'pageTitles.privacyPolicy': 'Política de Privacidad',
      'pageTitles.termsOfService': 'Términos de Servicio',
      'pageTitles.cookiePolicy': 'Política de Cookies',
      'pageTitles.dataManagement': 'Gestión de Datos',
    },
    fr: {
      'pageTitles.home': 'Accueil',
      'pageTitles.farmingRoutes': 'Routes de Farming',
      'pageTitles.dailyRoutine': 'Routine Quotidienne',
      'pageTitles.salvaging': 'Démantèlement',
      'pageTitles.crafting': 'Analyse des Matériaux',
      'pageTitles.festivals': 'Festivals',
      'pageTitles.glossary': 'Glossaire',
      'pageTitles.buyout': 'Calculateur d\'Achat',
      'pageTitles.fractals': 'Fractales',
      'pageTitles.orrianJewelryBox': 'Boîte de Bijoux Orriens',
      'pageTitles.admin': 'Panneau d\'Administration',
      'pageTitles.moderator': 'Panneau de Modérateur',
      'pageTitles.profile': 'Mon Profil',
      'pageTitles.login': 'Connexion',
      'pageTitles.register': 'S\'inscrire',
      'pageTitles.account': 'Compte',
      'pageTitles.bank': 'Banque',
      'pageTitles.characters': 'Personnages',
      'pageTitles.wallet': 'Portefeuille',
      'pageTitles.storage': 'Stockage de Matériaux',
      'pageTitles.search': 'Recherche de Comptes',
      'pageTitles.settings': 'Paramètres du Compte',
      'pageTitles.wintersday': 'Jour d\'Hiver',
      'pageTitles.halloween': 'Festival d\'Halloween',
      'pageTitles.halloweenLabyrinth': 'Guide Complet du Labyrinthe',
      'pageTitles.lunarNewYear': 'Nouvel An Lunaire',
      'pageTitles.dragonBash': 'Dragon Bash',
      'pageTitles.fourWinds': 'Festival des Quatre Vents',
      'pageTitles.salvageCommon': 'Démantèlement - Commun',
      'pageTitles.salvageMasterwork': 'Démantèlement - Chef-d\'Œuvre',
      'pageTitles.salvageRare': 'Démantèlement - Rare',
      'pageTitles.researchNotes': 'Notes de Recherche - Démantèlement',
      'pageTitles.giveaways': 'Concours',
      'pageTitles.opened': 'Conteneurs Ouvrables',
      'pageTitles.garden': 'Jardin',
      'pageTitles.giftOfMastery': 'Cadeau de Maîtrise',
      'pageTitles.giftOfJadeMastery': 'Cadeau de Maîtrise de Jade',
      'pageTitles.trophy': 'Trophée',
      'pageTitles.ectogambling': 'Paris d\'Ectoplasme',
      'pageTitles.privacyPolicy': 'Politique de Confidentialité',
      'pageTitles.termsOfService': 'Conditions d\'Utilisation',
      'pageTitles.cookiePolicy': 'Politique des Cookies',
      'pageTitles.dataManagement': 'Gestion des Données',
    },
    de: {
      'pageTitles.home': 'Startseite',
      'pageTitles.farmingRoutes': 'Farming-Routen',
      'pageTitles.dailyRoutine': 'Tägliche Routine',
      'pageTitles.salvaging': 'Zerlegen',
      'pageTitles.crafting': 'Materialanalyse',
      'pageTitles.festivals': 'Feste',
      'pageTitles.glossary': 'Glossar',
      'pageTitles.buyout': 'Kaufrechner',
      'pageTitles.fractals': 'Fraktale',
      'pageTitles.orrianJewelryBox': 'Orrianische Schmuckkiste',
      'pageTitles.admin': 'Admin-Panel',
      'pageTitles.moderator': 'Moderator-Panel',
      'pageTitles.profile': 'Mein Profil',
      'pageTitles.login': 'Anmelden',
      'pageTitles.register': 'Registrieren',
      'pageTitles.account': 'Konto',
      'pageTitles.bank': 'Bank',
      'pageTitles.characters': 'Charaktere',
      'pageTitles.wallet': 'Geldbörse',
      'pageTitles.storage': 'Materiallager',
      'pageTitles.search': 'Kontosuche',
      'pageTitles.settings': 'Kontoeinstellungen',
      'pageTitles.wintersday': 'Wintersday',
      'pageTitles.halloween': 'Halloween-Festival',
      'pageTitles.halloweenLabyrinth': 'Vollständiger Labyrinth-Leitfaden',
      'pageTitles.lunarNewYear': 'Lunar New Year',
      'pageTitles.dragonBash': 'Dragon Bash',
      'pageTitles.fourWinds': 'Vier-Winde-Festival',
      'pageTitles.salvageCommon': 'Zerlegen - Gewöhnlich',
      'pageTitles.salvageMasterwork': 'Zerlegen - Meisterwerk',
      'pageTitles.salvageRare': 'Zerlegen - Selten',
      'pageTitles.researchNotes': 'Forschungsnotizen - Zerlegen',
      'pageTitles.giveaways': 'Verlosungen',
      'pageTitles.opened': 'Öffnbare Behälter',
      'pageTitles.garden': 'Garten',
      'pageTitles.giftOfMastery': 'Geschenk der Meisterschaft',
      'pageTitles.giftOfJadeMastery': 'Geschenk der Jade-Meisterschaft',
      'pageTitles.trophy': 'Trophäe',
      'pageTitles.ectogambling': 'Ektoplasma-Glücksspiel',
      'pageTitles.privacyPolicy': 'Datenschutzrichtlinie',
      'pageTitles.termsOfService': 'Nutzungsbedingungen',
      'pageTitles.cookiePolicy': 'Cookie-Richtlinie',
      'pageTitles.dataManagement': 'Datenverwaltung',
    }
  };
  
  // Descripciones en diferentes idiomas
  const descriptionsByLanguage: Record<string, string> = {
    en: "Your ultimate platform to optimize farming in Guild Wars 2. Discover routes, strategies, and tools to maximize your gold per hour.",
    es: "Tu plataforma definitiva para optimizar el farming en Guild Wars 2. Descubre rutas, estrategias y herramientas para maximizar tu oro por hora.",
    fr: "Votre plateforme ultime pour optimiser le farming dans Guild Wars 2. Découvrez des routes, stratégies et outils pour maximiser votre or par heure.",
    de: "Ihre ultimative Plattform zur Optimierung des Farmings in Guild Wars 2. Entdecken Sie Routen, Strategien und Tools, um Ihr Gold pro Stunde zu maximieren."
  };
  
  // Obtener títulos y descripción en el idioma del usuario
  const pageTitles = pageTitlesByLanguage[language] || pageTitlesByLanguage['en'];
  const pageTitle = pageTitles[pageTitleKey] || 'True Farming';
  const fullTitle = pageTitle === 'Home' || pageTitle === 'Inicio' || pageTitle === 'Accueil' || pageTitle === 'Startseite' 
    ? 'True Farming' 
    : `${pageTitle} - True Farming`;
  
  const baseDescription = descriptionsByLanguage[language] || descriptionsByLanguage['en'];
  const enhancedDescription = `${randomSlogan} - ${baseDescription}`;
  
  // Palabras clave en diferentes idiomas
  const keywordsByLanguage: Record<string, string[]> = {
    en: ["Guild Wars 2", "farming", "gold", "materials", "gaming", "MMORPG", "efficiency", "strategies", "routes"],
    es: ["Guild Wars 2", "farming", "oro", "materiales", "gaming", "MMORPG", "eficiencia", "estrategias", "rutas"],
    fr: ["Guild Wars 2", "farming", "or", "matériaux", "gaming", "MMORPG", "efficacité", "stratégies", "routes"],
    de: ["Guild Wars 2", "farming", "gold", "materialien", "gaming", "MMORPG", "effizienz", "strategien", "routen"]
  };
  
  const keywords = keywordsByLanguage[language] || keywordsByLanguage['en'];
  
  return {
    metadataBase: new URL(baseUrl),
    title: fullTitle,
    description: enhancedDescription,
    keywords: keywords,
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
      description: enhancedDescription,
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
      description: enhancedDescription,
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
