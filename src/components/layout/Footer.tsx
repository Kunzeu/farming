'use client';

import Link from 'next/link';
import { useI18n } from '@/contexts/I18nContext';
import { motion } from '@/lib/framer-motion-optimized';
import { useEffect, useState } from 'react';
import { 
  ExternalLink, 
  Heart, 
  Coffee,
  Zap,
  Bot
} from 'lucide-react';


// Icono personalizado de X (más fiel al logo oficial)
const XIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Icono personalizado de Discord (logo oficial)
const DiscordIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z"/>
  </svg>
);

export default function Footer() {
  const { t } = useI18n();
  const [isClient, setIsClient] = useState(false);

  // Prevenir errores de hidratación con animaciones dependientes del cliente

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <footer className="bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 border-t border-gray-700/50 mt-auto relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-indigo-900/10"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 text-center md:text-left">
          
          {/* Sección 1: Apoya el sitio web */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-white font-medium text-base mb-4 flex items-center gap-2 justify-center md:justify-start">
              <Coffee className="w-4 h-4 text-orange-400" />
              {t('footer.supportWebsite', 'Apoya el sitio web')}
            </h3>
            
            {/* Botón de Patreon compacto */}
            <div className="flex justify-center md:justify-start">
              <motion.a
                href="https://patreon.com/KunzeuLabs"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg text-white font-medium text-sm hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                suppressHydrationWarning={true}
              >
              <motion.div
                animate={isClient ? { rotate: [0, 360] } : {}}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <Heart className="w-4 h-4" />
              </motion.div>
{t('footer.patreonTitle', '¡Hazte Patrocinador!')}
              </motion.a>
            </div>
          </motion.div>

          {/* Sección 2: Comunidad y contacto */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-white font-medium text-base mb-4 flex items-center gap-2 justify-center md:justify-start">
              <Zap className="w-4 h-4 text-yellow-400" />
              {t('footer.communityContact', 'Comunidad y contacto')}
            </h3>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              
              {/* Discord Bot */}
              <motion.a
                href="https://discord.com/oauth2/authorize?client_id=1328499706162315334"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors group px-3 py-2 rounded-lg hover:bg-gray-800/50"
                whileHover={{ scale: 1.05 }}
              >
                <Bot className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Bot (Qaliz)</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>

              {/* Discord Contacto */}
              <motion.a
                href="https://discord.gg/KQSrhA2qmx"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors group px-3 py-2 rounded-lg hover:bg-gray-800/50"
                whileHover={{ scale: 1.05 }}
              >
                <DiscordIcon className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Discord</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>

              {/* X (Twitter) */}
              <motion.a
                href="https://x.com/TrueFarming"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors group px-3 py-2 rounded-lg hover:bg-gray-800/50"
                whileHover={{ scale: 1.05 }}
              >
                <XIcon className="w-5 h-5 text-sky-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">X</span>
                <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Legal Links */}
        <motion.div 
          className="border-t border-gray-700/50 mt-6 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <Link 
              href="/privacy-policy" 
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              {t('footer.privacyPolicy', 'Privacy Policy')}
            </Link>
            <Link 
              href="/terms-of-service" 
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              {t('footer.termsOfService', 'Terms of Service')}
            </Link>
            <Link 
              href="/cookie-policy" 
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              {t('footer.cookiePolicy', 'Cookie Policy')}
            </Link>
            <Link 
              href="/data-management" 
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              {t('footer.dataManagement', 'Data Management')}
            </Link>
          </div>
        </motion.div>

        {/* Copyright y disclaimers */}
        <motion.div 
          className="border-t border-gray-700/50 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-400" suppressHydrationWarning={true}>
              © {new Date().getFullYear()} True Farming. {t('footer.allRights', 'Todos los derechos reservados.')}
            </p>
            <p className="text-xs text-gray-500">
              Guild Wars 2 © ArenaNet LLC. {t('footer.trademarks', 'Todas las marcas registradas son propiedad de sus respectivos dueños.')}
            </p>
            <p className="text-xs text-gray-500">
              {t('footer.disclaimer', 'Este sitio no está afiliado con ArenaNet o NCsoft. Los datos provienen de la API oficial de Guild Wars 2.')}
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
