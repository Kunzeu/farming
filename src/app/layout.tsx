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
import { generateMetadata } from "@/lib/metadata";

// Optimización de fuentes para Desktop
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Mejora LCP
  preload: true,
  fallback: ['system-ui', 'arial'] // Fallback rápido
});

// Exportar función de metadatos dinámicos
export { generateMetadata };

// Forzar Server-Side Rendering para metadatos dinámicos
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Performance: Preconnect crítico para Desktop */}
        <link rel="preconnect" href="https://api.guildwars2.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://static.cloudflareinsights.com" />
        <link rel="dns-prefetch" href="https://render.guildwars2.com" />
        <link rel="dns-prefetch" href="https://wiki.guildwars2.com" />
        
        {/* Scripts de Google Ads optimizados - carga diferida */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Carga diferida de Google Ads para reducir JavaScript no utilizado
            function loadGoogleAds() {
              if (window.adsbygoogle) return; // Ya cargado
              
              const script = document.createElement('script');
              script.async = true;
              script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2746156864243335';
              script.crossOrigin = 'anonymous';
              document.head.appendChild(script);
            }
            
            // Cargar Google Ads solo cuando sea necesario (scroll o interacción)
            let adsLoaded = false;
            function loadAdsOnInteraction() {
              if (adsLoaded) return;
              adsLoaded = true;
              loadGoogleAds();
            }
            
            // Cargar después de 3 segundos o en la primera interacción
            setTimeout(loadAdsOnInteraction, 3000);
            document.addEventListener('scroll', loadAdsOnInteraction, { once: true });
            document.addEventListener('click', loadAdsOnInteraction, { once: true });
            document.addEventListener('touchstart', loadAdsOnInteraction, { once: true });
          `
        }} />
        
        <link rel="preload" href="/images/icons/icon.webp" as="image" type="image/webp" />
        <link 
          rel="preload" 
          href="/images/backgrounds/voe-background.webp" 
          as="image" 
          type="image/webp"
        />
        
        {/* Meta tag para indicar imagen LCP crítica */}
        <meta name="critical-resource" content="/images/backgrounds/voe-background.webp" />
        
        {/* Script para establecer fetchpriority en preload link */}
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              var preloadLink = document.querySelector('link[href*="voe-background.webp"]');
              if (preloadLink) {
                preloadLink.setAttribute('fetchpriority', 'high');
                preloadLink.setAttribute('imagesizes', '(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw');
              }
            });
          `
        }} />
        
        {/* Preload CSS crítico para reducir cadena de dependencias */}
        <link rel="preload" as="style" href="/_next/static/css/026d059c552bd690.css" />
        <link rel="preload" as="style" href="/_next/static/css/bbdc7fa9216ba259.css" />
        {/* CSS Crítico Inline - Above the fold */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* CSS crítico para evitar bloqueo de renderizado */
            link[href*="voe-background.webp"] {
              fetch-priority: high;
            }
            
            /* Critical CSS para hero section y navigation */
            .min-h-screen {
              min-height: 100vh;
            }
            .bg-gradient-to-br {
              background-image: linear-gradient(135deg, var(--tw-gradient-stops));
            }
            .from-slate-900 {
              --tw-gradient-from: #0f172a;
              --tw-gradient-to: #0f172a00;
              --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
            }
            .via-slate-800 {
              --tw-gradient-to: #1e293b00;
              --tw-gradient-stops: var(--tw-gradient-from), #1e293b, var(--tw-gradient-to);
            }
            .to-slate-900 {
              --tw-gradient-to: #0f172a;
            }
            .container {
              width: 100%;
              margin-left: auto;
              margin-right: auto;
              padding-left: 1rem;
              padding-right: 1rem;
            }
            @media (min-width: 640px) {
              .container { max-width: 640px; }
            }
            @media (min-width: 768px) {
              .container { max-width: 768px; }
            }
            @media (min-width: 1024px) {
              .container { max-width: 1024px; }
            }
            @media (min-width: 1280px) {
              .container { max-width: 1280px; }
            }
            .relative { position: relative; }
            .absolute { position: absolute; }
            .inset-0 { inset: 0; }
            .rounded-xl { border-radius: 0.75rem; }
            .object-cover { object-fit: cover; }
            .flex { display: flex; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
            .h-72 { height: 18rem; }
            @media (min-width: 768px) {
              .md\\:h-96 { height: 24rem; }
            }
            .overflow-hidden { overflow: hidden; }
            .mb-2 { margin-bottom: 0.5rem; }
            
            /* Prevenir layout shift en contadores de tiempo */
            .timer-container {
              width: 6rem; /* w-24 */
              min-width: 6rem;
              display: inline-block;
              text-align: center;
            }
            .timer-container-mobile {
              width: 5rem; /* w-20 */
              min-width: 5rem;
              display: inline-block;
              text-align: center;
            }
            
            /* Transición suave para cambios de tiempo */
            .timer-text {
              transition: opacity 0.2s ease-in-out;
            }
          `
        }} />
        
        {/* Optimizaciones para carga asíncrona y caché */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Función para cargar CSS de forma asíncrona
            function loadCSS(href) {
              var link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = href;
              link.media = 'print';
              link.onload = function() { this.media = 'all'; };
              document.head.appendChild(link);
            }
            
            // Optimizar caché de scripts de Cloudflare
            window.addEventListener('load', function() {
              // Cargar CSS adicional que no es crítico
              var links = document.querySelectorAll('link[rel="preload"][as="style"]');
              for (var i = 0; i < links.length; i++) {
                if (!links[i].hasAttribute('data-loaded')) {
                  links[i].rel = 'stylesheet';
                  links[i].setAttribute('data-loaded', 'true');
                }
              }
              
              // Precargar scripts de Cloudflare críticos si están disponibles
              if (typeof window.cloudflare !== 'undefined') {
                // Configurar caché más agresivo para scripts de Cloudflare
                if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                  navigator.serviceWorker.controller.postMessage({
                    type: 'OPTIMIZE_CLOUDFLARE_CACHE',
                    urls: [
                      'https://static.cloudflareinsights.com/beacon.min.js',
                      '/cdn-cgi/scripts/7089c43e/cloudflare-static/rocket-loader.min.js'
                    ]
                  });
                }
              }
            });
          `
        }} />
        
        {/* Service Worker para caché optimizado */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('SW registrado con éxito:', registration.scope);
                  })
                  .catch(function(error) {
                    console.log('SW registration falló:', error);
                  });
              });
            }
          `
        }} />
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
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
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

