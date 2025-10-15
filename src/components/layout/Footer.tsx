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
  Bot,
  Globe
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
  const { t, lang, setLang } = useI18n();
  const [isClient, setIsClient] = useState(false);

  // Prevenir errores de hidratación con animaciones dependientes del cliente

  useEffect(() => {
    setIsClient(true);
  }, []);

  const languages = [
    { code: 'es', name: 'ES' },
    { code: 'en', name: 'EN' },
    { code: 'de', name: 'DE' },
    { code: 'fr', name: 'FR' },
  ];

  const handleLanguageChange = (newLang: string) => {
    setLang(newLang as 'en' | 'de' | 'es' | 'fr');
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-700/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Main Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
          
          {/* Apoyo */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="flex items-center gap-2 justify-center mb-2 md:mb-3">
              <Coffee className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
              <h3 className="text-white font-semibold text-sm md:text-base">{t('footer.supportSite', 'Apoyo')}</h3>
            </div>
            <p className="text-gray-400 text-xs mb-2 md:mb-3 hidden sm:block">
              {t('footer.supportDescription', 'Ayúdanos a mantener y mejorar la plataforma')}
            </p>
            <motion.a
              href="https://patreon.com/KunzeuLabs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg text-white font-medium text-xs md:text-sm hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isClient ? { rotate: [0, 360] } : {}}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <Heart className="w-3 h-3 md:w-4 md:h-4" />
              </motion.div>
              <span className="hidden sm:inline">{t('footer.becomePatron', 'Hazte Patrocinador')}</span>
              <span className="sm:hidden">Patreon</span>
            </motion.a>
          </motion.div>

          {/* Comunidad */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-2 justify-center mb-2 md:mb-3">
              <Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
              <h3 className="text-white font-semibold text-sm md:text-base">{t('footer.communityContact', 'Comunidad')}</h3>
            </div>
            <div className="space-y-1 md:space-y-2">
              <motion.a
                href="https://discord.gg/KQSrhA2qmx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 md:gap-3 text-gray-300 hover:text-white transition-all duration-300 group justify-center"
                whileHover={{ x: 3 }}
              >
                <DiscordIcon className="w-3 h-3 md:w-4 md:h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-xs md:text-sm">Discord</span>
                <ExternalLink className="w-2 h-2 md:w-3 md:h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
              
              <motion.a
                href="https://x.com/TrueFarming"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 group justify-center"
                whileHover={{ x: 3 }}
              >
                <XIcon className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-xs md:text-sm">X</span>
                <ExternalLink className="w-2 h-2 md:w-3 md:h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
              
              <motion.a
                href="https://discord.com/oauth2/authorize?client_id=1328499706162315334"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-all duration-300 group justify-center"
                whileHover={{ x: 3 }}
              >
                <Bot className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-xs md:text-sm">Bot</span>
                <ExternalLink className="w-2 h-2 md:w-3 md:h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
            </div>
          </motion.div>

          {/* Legal */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-2 justify-center mb-2 md:mb-3">
              <ExternalLink className="w-3 h-3 md:w-4 md:h-4 text-blue-400" />
              <h3 className="text-white font-semibold text-sm md:text-base">{t('footer.legal', 'Legal')}</h3>
            </div>
            <div className="space-y-1">
              <Link href="/privacy-policy" className="block text-xs text-gray-400 hover:text-white transition-colors">
                {t('footer.privacyPolicy', 'Política de Privacidad')}
              </Link>
              <Link href="/terms-of-service" className="block text-xs text-gray-400 hover:text-white transition-colors">
                {t('footer.termsOfService', 'Términos de Servicio')}
              </Link>
              <Link href="/cookies-info" className="block text-xs text-gray-400 hover:text-white transition-colors">
                {t('footer.cookiePolicy', 'Política de Cookies')}
              </Link>
              <Link href="/data-management" className="block text-xs text-gray-400 hover:text-white transition-colors">
                {t('footer.dataManagement', 'Gestión de Datos')}
              </Link>
            </div>
          </motion.div>

          {/* Idioma */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center gap-2 justify-center mb-2 md:mb-3">
              <Globe className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
              <h3 className="text-white font-semibold text-sm md:text-base">{t('footer.language', 'Idioma')}</h3>
            </div>
            <div className="flex gap-1 flex-wrap justify-center">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => handleLanguageChange(l.code)}
                  className={`px-1.5 md:px-2 py-1 rounded text-xs font-medium transition-all duration-300 ${
                    lang === l.code 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-gray-700/50 pt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-xs text-gray-400 mb-1" suppressHydrationWarning={true}>
            © {new Date().getFullYear()} True Farming. {t('footer.allRights', 'Todos los derechos reservados.')}
          </p>
          <p className="text-xs text-gray-500">
            Guild Wars 2 © ArenaNet LLC. {t('footer.notAffiliated', 'No afiliado con ArenaNet.')}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
