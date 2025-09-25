import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// PrimeReact styles removed to avoid lightningcss build issues on Vercel
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/contexts/I18nContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import RoleChecker from "@/components/RoleChecker";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/ui/ScrollToTop";
import CookieBanner from "@/components/ui/CookieBanner";
import { Analytics } from "@vercel/analytics/next";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.true-farming.com'),
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
    url: 'https://www.true-farming.com',
    title: 'True Farming - Guild Wars 2',
    description: 'Your platform to optimize farming in Guild Wars 2',
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
    description: 'Your platform to optimize farming in Guild Wars 2',
    images: ['/images/icons/icontag.webp'],
  },
  icons: {
    icon: [
      { url: '/images/icons/favicon.svg', type: 'image/svg+xml' },
      { url: '/images/icons/icon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/images/icons/icon1.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/images/icons/icon.webp', sizes: '192x192', type: 'image/webp' },
      { url: '/images/icons/icon1.webp', sizes: '512x512', type: 'image/webp' },
    ],
    shortcut: '/images/icons/favicon.svg',
    apple: [
      { url: '/images/icons/icon.webp', sizes: '180x180', type: 'image/webp' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/images/icons/favicon.svg',
        color: '#c1272d',
      },
    ],
  },
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
        <meta name="google-site-verification" content="6QMoVlJ1hD8y5DCBubEKA5qv_oLb3O4EVRB8OS03LZU"/>
        <meta name="msapplication-TileColor" content="#c1272d" />
        <meta name="msapplication-TileImage" content="/images/icons/icon.webp" />
          
        {/* Meta tags are automatically generated from the metadata object above */}
        <meta name="theme-color" content="#c1272d" />
        <link rel="canonical" href="https://www.true-farming.com" />
        <link rel="alternate" hrefLang="x-default" href="https://www.true-farming.com" />
        <link rel="alternate" hrefLang="en" href="https://www.true-farming.com" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:image" content="/images/icons/icontag.webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:image:alt" content="True Farming - Guild Wars 2" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:image" content="/images/icons/icontag.webp" />
        <meta name="twitter:image:alt" content="True Farming - Guild Wars 2" />
        
        {/* Additional Meta Tags */}
        <meta name="image" content="/images/icons/icon.webp" />
        <meta name="thumbnail" content="/images/icons/icon.webp" />
        <meta name="twitter:image:alt" content="True Farming - Guild Wars 2" />
        <meta name="twitter:image:width" content="1200" />
        <meta name="twitter:image:height" content="630" />
        <meta name="twitter:site" content="@true-farming" />
        <meta name="twitter:creator" content="@true-farming"/>
      </head>
      <body className={inter.className}>
        <CookieConsentProvider>
          <AuthProvider>
            <I18nProvider>
              <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col">
                <RoleChecker />
                <div className="flex-1">
                  {children}
                </div>
                <Footer />
                <ScrollToTop />
                <CookieBanner />
                <Analytics />
              </div>
            </I18nProvider>
          </AuthProvider>
        </CookieConsentProvider>
      </body>
    </html>
  );
}

