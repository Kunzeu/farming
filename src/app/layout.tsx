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
import PageUsageTracker from "@/components/PageUsageTracker";
// import { Analytics } from "@vercel/analytics/next"; // Deshabilitado para reducir carga
import { generateDynamicMetadata } from "@/lib/metadata";
import GoogleAdsLoader from '@/components/GoogleAdsLoader';
import NitroPayLoader from '@/components/NitroPayLoader';
import AdBlocker from '@/components/AdBlocker';
import SupportNotice from '@/components/ui/SupportNotice';

// Optimización de fuentes para Desktop
const inter = Inter({
  subsets: ["latin"],
  display: 'swap', // Mejora LCP
  preload: true,
  fallback: ['system-ui', 'arial'] // Fallback rápido
});

// Exportar función de metadatos dinámicos
export { generateDynamicMetadata as generateMetadata };

// ISR con revalidación de 1 hora para reducir invocaciones
// Mantenemos force-dynamic para metadatos pero con revalidación larga
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

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
        <link rel="preconnect" href="https://s.nitropay.com" />
        <link rel="preconnect" href="https://static.cloudflareinsights.com" />
        <link rel="dns-prefetch" href="https://render.guildwars2.com" />
        <link rel="dns-prefetch" href="https://wiki.guildwars2.com" />

        {/* Google Ads Script - se carga dinámicamente en el cliente */}

        {/* NitroPay Ad Script - Instalación según guía oficial */}
        {/* Nota: El script se carga aquí en el head según la guía, pero NitroPayLoader lo eliminará si el usuario es Patreon */}
        <script
          data-cfasync="false"
          dangerouslySetInnerHTML={{
            __html: `window.nitroAds=window.nitroAds||{createAd:function(){return new Promise(e=>{window.nitroAds.queue.push(["createAd",arguments,e])})},addUserToken:function(){window.nitroAds.queue.push(["addUserToken",arguments])},queue:[]};`
          }}
        />
        <script
          data-cfasync="false"
          async
          src="https://s.nitropay.com/ads-2282.js"
        />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-WXS6KYHEXT"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WXS6KYHEXT');
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

        <meta name="google-site-verification" content="6QMoVlJ1hD8y5DCBubEKA5qv_oLb3O4EVRB8OS03LZU" />
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
        <meta name="twitter:creator" content="@true-farming" />
      </head>
      <body className={inter.className}>
        <CookieConsentProvider>
          <AuthProvider>
            <I18nProvider>
              <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
                <PageUsageTracker />
                <RoleChecker />
                <ApiWarningBanner />
                <div className="flex-1 pt-16">
                  {children}
                </div>
                <div className="mt-auto">
                  <Footer />
                </div>
                <ScrollToTop />
                <CookieBanner />
                <SupportNotice />
                <GoogleAdsLoader />
                <NitroPayLoader />
                <AdBlocker />
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
              const unwantedTerms = ['gold selling', 'GW2 gold', 'buy gold', 'sell gold', 'RMT', 'vpn', 'premium vpn'];
              
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
            
            // Bloquear formatos de anuncios molestos (Ad Intents, Related Search, Widgets de texto)
            function blockAnnoyingAdFormats() {
              // Términos "basura" típicos en widgets de búsqueda y enlaces de texto
              // Estos términos cubren la mayoría de los anuncios de bajo valor/spam
              const spamTerms = [
                // Navegación/Sistema
                "couldn't find results", "no results found", "related search", "discover more", "related topics",
                
                // Tech/Software Spam
                "vpn", "premium vpn", "browser", "extension", "download", "install", "update", "driver", 
                "cleaner", "antivirus", "scan", "fix", "repair", "software", "tool",
                
                // Financiero/Servicios (High CPC spam)
                "insurance", "loan", "credit", "mortgage", "attorney", "lawyer", "donate", "degree", 
                "hosting", "trading", "crypto", "bitcoin", "forex", "invest", "claim", "settlement",
                "transfer", "recovery", "refinance",
                
                // Otros
                "gift card", "prize", "winner", "giveaway", "sweepstakes", "dating", "meet", "singles"
              ];
              
              const annoyingSelectors = [
                '.adsbygoogle', 
                '[data-ad-client]', 
                '[data-ad-slot]', 
                '.google-auto-placed',
                'iframe[src*="googlesyndication"]',
                'iframe[src*="googleads"]',
                '.nitropay-ad',
                'div[id*="nitropay-ad"]',
                'iframe[src*="nitropay"]'
              ];
              
              // 1. Verificar contenido de texto en contenedores de anuncios
              const adContainers = document.querySelectorAll(annoyingSelectors.join(', '));
              
              adContainers.forEach(container => {
                // Si ya está oculto, ignorar
                if (container.style.display === 'none') return;
                
                const text = (container.textContent || '').toLowerCase();
                const title = (container.title || '').toLowerCase();
                
                // Verificar si contiene términos de spam
                const hasSpam = spamTerms.some(term => 
                  text.includes(term.toLowerCase()) || title.includes(term.toLowerCase())
                );
                
                // Verificar si es un widget de "Búsqueda" o "Enlaces" (suelen tener poco texto real y muchos keywords)
                const isSearchWidget = text.includes('search') || text.includes('results') || text.includes('ads');
                
                if (hasSpam || (isSearchWidget && text.length < 100)) { // Widgets pequeños con texto de búsqueda
                  container.style.display = 'none';
                  container.style.visibility = 'hidden';
                  container.style.height = '0';
                  container.style.overflow = 'hidden';
                  // console.log('Bloqueado anuncio molesto:', text.substring(0, 50));
                }
              });
              
              // 2. Lógica específica para "Auto Placed" (Anuncios insertados automáticamente en el texto)
              // A veces Google inserta bloques de enlaces de texto que son muy molestos
              const autoPlaced = document.querySelectorAll('.google-auto-placed');
              autoPlaced.forEach(ad => {
                const style = window.getComputedStyle(ad);
                const height = parseFloat(style.height);
                
                // Si es muy bajito (barra de enlaces) o contiene palabras clave de spam
                if (height > 0 && height < 100) {
                    // Posible barra de "Ad Intent" o "Anchor"
                    // Verificar si tiene pinta de texto spam
                    const text = ad.textContent.toLowerCase();
                    if (spamTerms.some(t => text.includes(t))) {
                        ad.style.display = 'none !important';
                        ad.style.setProperty('display', 'none', 'important');
                    }
                }
              });
            }
            
            // Prevenir clics en anuncios bloqueados
            function preventClicksOnBlockedAds() {
              const adContainers = document.querySelectorAll('.adsbygoogle, [data-ad-client], [data-ad-slot], ins.adsbygoogle, .nitropay-ad, div[id*="nitropay-ad"]');
              adContainers.forEach(container => {
                if (container.style.display === 'none' || container.style.opacity === '0') {
                  // Si está bloqueado, prevenir todos los clics
                  container.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                  }, true);
                  
                  // Prevenir clics en todos los hijos
                  const children = container.querySelectorAll('*');
                  children.forEach(child => {
                    child.style.pointerEvents = 'none';
                    child.onclick = function(e) {
                      e.preventDefault();
                      e.stopPropagation();
                      e.stopImmediatePropagation();
                      return false;
                    };
                  });
                }
              });
            }
            
            // Bloquear TODOS los anuncios dentro del Navigation
            function blockAdsInNavigation() {
              const nav = document.querySelector('nav[data-no-ads="true"]');
              if (!nav) return;
              
              // Buscar y bloquear cualquier anuncio dentro del nav
              const adsInNav = nav.querySelectorAll('.adsbygoogle, [data-ad-client], [data-ad-slot], ins.adsbygoogle, iframe[src*="googlesyndication"], iframe[src*="doubleclick"], .nitropay-ad, div[id*="nitropay-ad"], iframe[src*="nitropay"]');
              adsInNav.forEach(ad => {
                ad.style.display = 'none';
                ad.style.visibility = 'hidden';
                ad.style.height = '0';
                ad.style.width = '0';
                ad.style.opacity = '0';
                ad.style.pointerEvents = 'none';
                ad.style.overflow = 'hidden';
              });
            }
            
            // Ejecutar inmediatamente y periódicamente
            blockUnwantedContent();
            blockAnnoyingAdFormats();
            preventClicksOnBlockedAds();
            blockAdsInNavigation();
            setInterval(() => {
              blockUnwantedContent();
              blockAnnoyingAdFormats();
              preventClicksOnBlockedAds();
              blockAdsInNavigation();
            }, 2000);
            
            // También ejecutar cuando se cargan nuevos elementos
            const observer = new MutationObserver(() => {
              blockUnwantedContent();
              blockAnnoyingAdFormats();
              preventClicksOnBlockedAds();
              blockAdsInNavigation();
            });
            observer.observe(document.body, { childList: true, subtree: true });
            
            // Prevenir clics globalmente en elementos bloqueados
            document.addEventListener('click', function(e) {
              const target = e.target;
              const blockedAd = target.closest('.adsbygoogle, [data-ad-client], [data-ad-slot], .nitropay-ad, div[id*="nitropay-ad"]');
              if (blockedAd && (blockedAd.style.display === 'none' || blockedAd.style.opacity === '0')) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
              }
            }, true);
            
            
          `
        }} />

      </body>
    </html>
  );
}
