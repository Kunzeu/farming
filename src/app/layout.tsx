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
// import { Analytics } from "@vercel/analytics/next"; // Deshabilitado para reducir carga
import { generateDynamicMetadata } from "@/lib/metadata";
import GoogleAdsLoader from '@/components/GoogleAdsLoader';

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
        
        {/* Google Ads Script - se carga dinámicamente en el cliente */}
        
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
                {/* <Analytics /> Deshabilitado para reducir carga */}
              </div>
            </I18nProvider>
          </AuthProvider>
        </CookieConsentProvider>
        <script dangerouslySetInnerHTML={{
          __html: `
            // Bloquear contenido no deseado relacionado con gold selling
            function blockUnwantedContent() {
              // Buscar y ocultar elementos que contengan texto no deseado
              const unwantedTerms = ['gold selling', 'GW2 gold', 'buy gold', 'sell gold', 'RMT'];
              
              unwantedTerms.forEach(term => {
                const elements = document.querySelectorAll('*');
                elements.forEach(element => {
                  if (element.textContent && element.textContent.toLowerCase().includes(term.toLowerCase())) {
                    // Si es un anuncio de Google, ocultarlo completamente
                    if (element.classList.contains('adsbygoogle') || element.closest('.adsbygoogle')) {
                      element.style.display = 'none';
                      element.style.visibility = 'hidden';
                      element.style.height = '0';
                      element.style.width = '0';
                      element.style.overflow = 'hidden';
                    }
                  }
                });
              });
            }
            
            // Bloquear el widget "Discover more" de AdSense
            function blockDiscoverMore() {
              // Buscar elementos que contengan "Discover more" o texto relacionado
              const discoverMoreTerms = ['discover more', 'gift cards for games', 'ergonomic gaming mouse', 'gaming accessories', 'game deals'];
              
              // Buscar todos los elementos que contengan estos términos
              const allElements = document.querySelectorAll('*');
              allElements.forEach(element => {
                const text = (element.textContent || '').toLowerCase();
                if (discoverMoreTerms.some(term => text.includes(term))) {
                  // Si el elemento está relacionado con AdSense o anuncios, ocultarlo
                  const isAdElement = element.closest('.adsbygoogle') || 
                                     element.closest('[class*="ad"]') || 
                                     element.closest('[id*="ad"]') ||
                                     element.closest('[class*="google"]') ||
                                     element.closest('[id*="google"]') ||
                                     element.closest('[data-ad-slot]') ||
                                     element.closest('[data-ad-client]') ||
                                     element.classList.contains('adsbygoogle') ||
                                     element.id?.includes('google_ads') ||
                                     element.id?.includes('ad-') ||
                                     element.className?.toString().includes('ad');
                  
                  if (isAdElement) {
                    let targetElement = element.closest('.adsbygoogle') || 
                                       element.closest('[class*="ad"]') || 
                                       element.closest('[id*="ad"]') || 
                                       element;
                    
                    if (targetElement) {
                      targetElement.style.display = 'none';
                      targetElement.style.visibility = 'hidden';
                      targetElement.style.height = '0';
                      targetElement.style.width = '0';
                      targetElement.style.overflow = 'hidden';
                      targetElement.style.opacity = '0';
                      targetElement.style.position = 'absolute';
                      targetElement.style.left = '-9999px';
                    }
                  }
                }
              });
              
              // Bloquear iframes de AdSense que puedan contener "Discover more"
              const adIframes = document.querySelectorAll('iframe[src*="googlesyndication"], iframe[src*="doubleclick"], iframe[id*="google_ads"], iframe[src*="googleads"]');
              adIframes.forEach(iframe => {
                try {
                  // Verificar el título o atributos del iframe
                  const iframeTitle = (iframe.getAttribute('title') || '').toLowerCase();
                  const iframeId = (iframe.id || '').toLowerCase();
                  const iframeSrc = (iframe.src || '').toLowerCase();
                  
                  if (discoverMoreTerms.some(term => 
                    iframeTitle.includes(term) || 
                    iframeId.includes(term) || 
                    iframeSrc.includes('discover') ||
                    iframeSrc.includes('native')
                  )) {
                    iframe.style.display = 'none';
                    iframe.style.visibility = 'hidden';
                    iframe.style.height = '0';
                    iframe.style.width = '0';
                    iframe.style.overflow = 'hidden';
                    iframe.style.opacity = '0';
                    iframe.style.position = 'absolute';
                    iframe.style.left = '-9999px';
                  }
                  
                  // Intentar acceder al contenido del iframe (puede fallar por CORS)
                  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                  if (iframeDoc) {
                    const iframeText = (iframeDoc.body?.textContent || '').toLowerCase();
                    if (discoverMoreTerms.some(term => iframeText.includes(term))) {
                      iframe.style.display = 'none';
                      iframe.style.visibility = 'hidden';
                      iframe.style.height = '0';
                      iframe.style.width = '0';
                      iframe.style.overflow = 'hidden';
                      iframe.style.opacity = '0';
                      iframe.style.position = 'absolute';
                      iframe.style.left = '-9999px';
                    }
                  }
                } catch (e) {
                  // Ignorar errores de CORS
                }
              });
              
              // Bloquear contenedores comunes de "Discover more"
              const discoverContainers = document.querySelectorAll('[class*="discover"], [id*="discover"], [aria-label*="Discover"], [aria-label*="discover"]');
              discoverContainers.forEach(container => {
                const text = (container.textContent || '').toLowerCase();
                if (discoverMoreTerms.some(term => text.includes(term))) {
                  container.style.display = 'none';
                  container.style.visibility = 'hidden';
                  container.style.height = '0';
                  container.style.width = '0';
                  container.style.overflow = 'hidden';
                  container.style.opacity = '0';
                  container.style.position = 'absolute';
                  container.style.left = '-9999px';
                }
              });
            }
            
            // Ejecutar inmediatamente y periódicamente
            blockUnwantedContent();
            blockDiscoverMore();
            setInterval(() => {
              blockUnwantedContent();
              blockDiscoverMore();
            }, 2000);
            
            // También ejecutar cuando se cargan nuevos elementos
            const observer = new MutationObserver(() => {
              blockUnwantedContent();
              blockDiscoverMore();
            });
            observer.observe(document.body, { childList: true, subtree: true });
            
            
          `
        }} />
        
        {/* Google Ads Loader */}
        <GoogleAdsLoader />
      </body>
    </html>
  );
}

