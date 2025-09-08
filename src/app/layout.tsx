import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// PrimeReact styles removed to avoid lightningcss build issues on Vercel
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import RoleChecker from "@/components/RoleChecker";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { Analytics } from "@vercel/analytics/next";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "True Farming",
  description: "Your platform to optimize farming in Guild Wars 2",
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
    url: 'https://truefarming.com',
    title: 'True Farming - Guild Wars 2 Farming Hub',
    description: 'Your platform to optimize farming in Guild Wars 2',
    siteName: 'True Farming',
    images: [
      {
        url: '/images/icons/icon.png',
        width: 1200,
        height: 630,
        alt: 'True Farming Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'True Farming - Guild Wars 2 Farming Hub',
    description: 'Your platform to optimize farming in Guild Wars 2',
    images: ['/images/icons/icon.png'],
  },
  icons: {
    icon: [
      { url: '/images/icons/favicon.svg', type: 'image/svg+xml' },
      { url: '/images/icons/icon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/images/icons/icon1.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/images/icons/icon.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/icons/icon1.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/images/icons/favicon.svg',
    apple: [
      { url: '/images/icons/icon.png', sizes: '180x180', type: 'image/png' },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2746156864243335"
        crossOrigin="anonymous"></script>
        <meta name="google-site-verification" content="your-google-verification-code" />
        <meta name="msapplication-TileColor" content="#c1272d" />
        <meta name="msapplication-TileImage" content="/images/icons/icon.png" />
        <meta name="theme-color" content="#c1272d" />
        <link rel="canonical" href="https://truefarming.com" />
        <link rel="alternate" hrefLang="en" href="https://truefarming.com" />
        <link rel="alternate" hrefLang="es" href="https://truefarming.com/es" />
        <link rel="alternate" hrefLang="fr" href="https://truefarming.com/fr" />
        <link rel="alternate" hrefLang="de" href="https://truefarming.com/de" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <I18nProvider>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
              <RoleChecker />
              <div className="flex-1">
                {children}
              </div>
              <Footer />
              <ScrollToTop />
              <Analytics />
            </div>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

