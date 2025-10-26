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
import ApiWarningBanner from "@/components/ui/ApiWarningBanner";
import { Analytics } from "@vercel/analytics/next";
import { generateDynamicMetadata } from "@/lib/metadata";
import { AdProvider } from "@/contexts/AdContext";

// Optimización de fuentes para Desktop
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Mejora LCP
  preload: true,
  fallback: ['system-ui', 'arial'] // Fallback rápido
});

// Exportar función de metadatos dinámicos
export { generateDynamicMetadata as generateMetadata };

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
            // Función para verificar si el usuario es admin o moderator
            function isUserAdmin() {
              try {
                const userData = localStorage.getItem('gw2_user');
                if (!userData) return false;
                
                const user = JSON.parse(userData);
                // Verificar si es admin o moderator
                return user.role === 'admin' || user.role === 'moderator';
              } catch (e) {
                return false;
              }
            }
            
            // Carga diferida de Google Ads para reducir JavaScript no utilizado
            function loadGoogleAds() {
              if (typeof window === 'undefined' || window.adsbygoogle) return; // Ya cargado o SSR
              
              const script = document.createElement('script');
              script.async = true;
              script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2746156864243335';
              script.crossOrigin = 'anonymous';
              document.head.appendChild(script);
            }
            
            // Solo ejecutar en el cliente
            if (typeof window !== 'undefined') {
              // Verificar si el usuario es admin o moderator antes de cargar ads
              const isAdmin = isUserAdmin();
              
              // Cargar Google Ads solo si NO es admin o moderator
              if (!isAdmin) {
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
              }
            }
          `
        }} />
        
        {/* Meta tags para prevenir caché de HTML */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        
        {/* CSS Crítico Inline - Above the fold */}
        <style dangerouslySetInnerHTML={{
          __html: `
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
              width: 6rem; /* w-24 */
              min-width: 6rem;
              display: inline-block;
              text-align: center;
            }
            
            /* Transición suave para cambios de tiempo */
            .timer-text {
              transition: opacity 0.2s ease-in-out;
            }
            
            /* CSS crítico para gradientes de texto - Compatibilidad desarrollo/producción */
            .gradient-text {
              background: linear-gradient(to right, #60a5fa, #a855f7);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              color: transparent;
            }
            
            /* Fallback para navegadores que no soportan background-clip */
            @supports not (background-clip: text) {
              .gradient-text {
                background: none;
                color: #60a5fa;
              }
            }
          `
        }} />
        
        {/* Eliminado script de optimización que podía reescribir links de CSS */}
        
        <meta name="google-site-verification" content="6QMoVlJ1hD8y5DCBubEKA5qv_oLb3O4EVRB8OS03LZU"/>
        <meta name="msapplication-TileColor" content="#c1272d" />
        <meta name="msapplication-TileImage" content="/images/icons/favicon.svg" />
        
        {/* Favicon adicionales para mejor compatibilidad móvil */}
        <link rel="icon" href="/images/icons/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/images/icons/icon.ico" type="image/x-icon" />
        <link rel="apple-touch-icon" href="/images/icons/favicon.svg" />
        <link rel="apple-touch-icon-precomposed" href="/images/icons/favicon.svg" />
        
        {/* Meta tags para mejor indexación en móviles */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="True Farming" />
          
        {/* Meta tags are automatically generated from the metadata object above */}
        <meta name="theme-color" content="#c1272d" />
        <link rel="canonical" href="https://www.true-farming.com" />
        <link rel="alternate" hrefLang="x-default" href="https://www.true-farming.com" />
        <link rel="alternate" hrefLang="en" href="https://www.true-farming.com" />
        
        {/* Meta tags adicionales específicos */}
        <meta name="twitter:site" content="@true-farming" />
        <meta name="twitter:creator" content="@true-farming"/>
      </head>
      <body className={inter.className}>
        <CookieConsentProvider>
          <AuthProvider>
            <I18nProvider>
              <AdProvider>
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
                <RoleChecker />
                <ApiWarningBanner />
                <div className="flex-1">
                  {children}
                </div>
                <div className="mt-auto">
                  <Footer />
                </div>
                <ScrollToTop />
                <CookieBanner />
                <Analytics />
              </div>
              </AdProvider>
            </I18nProvider>
          </AuthProvider>
        </CookieConsentProvider>
        <script dangerouslySetInnerHTML={{
          __html: `
            // Eliminar solo espacios negros vacíos después del footer
            function removeBlackSpace() {
              const footer = document.querySelector('footer');
              if (!footer) return;
              
              // Solo buscar el primer elemento después del footer
              let nextElement = footer.nextElementSibling;
              
              if (nextElement) {
                // Detectar si es un espacio negro (background negro o tiene ads vacíos)
                const bgColor = window.getComputedStyle(nextElement).backgroundColor;
                const hasBlackBg = bgColor === 'rgb(0, 0, 0)' || bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'black';
                const hasAdClass = nextElement.classList?.contains('adsbygoogle');
                
                // Solo ocultar si es un background negro sin contenido útil
                if (hasBlackBg || hasAdClass) {
                  nextElement.style.display = 'none';
                  nextElement.style.height = '0';
                  nextElement.style.visibility = 'hidden';
                  nextElement.style.margin = '0';
                  nextElement.style.padding = '0';
                }
              }
            }
            
            // Ejecutar solo una vez cuando la página cargue completamente
            window.addEventListener('load', function() {
              setTimeout(removeBlackSpace, 1000);
              setTimeout(removeBlackSpace, 2000);
              setTimeout(removeBlackSpace, 3000);
            });
          `
        }} />
      </body>
    </html>
  );
}

