import type { Metadata } from "next";

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
