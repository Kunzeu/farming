'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from '@/lib/framer-motion-optimized';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Map, 
  Clock,
  Menu, 
  X,
  User,
  LogOut,
  Shield,
  Package,
  ChevronDown,
  BookOpen,
  Calendar,
  Crown,
  ShoppingCart,
  Star,
  Gift
} from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

// Tipos para los elementos de navegación
interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }> | string;
  isImage?: boolean;
}

// Componente de selector de idiomas flotante
const FloatingLanguageSwitcher = () => {
  const { lang, setLang } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'es', name: 'ES'},
    { code: 'en', name: 'EN'},
    { code: 'de', name: 'DE'},
    { code: 'fr', name: 'FR'},
  ];

  const handleLanguageChange = (newLang: string) => {
    setLang(newLang as 'en' | 'de' | 'es' | 'fr');
    setIsOpen(false);
  };

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`relative transform-none transition-all duration-300 ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg text-white hover:bg-gray-700/90 transition-all duration-200 shadow-lg transform-none"
      >
        <span className="text-sm sm:text-base font-medium">{currentLang.name}</span>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute top-full left-0 mt-2 bg-gray-800/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-xl py-2 z-50 min-w-[100px] sm:min-w-[120px] transform-none"
        >
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => handleLanguageChange(l.code)}
              className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm hover:bg-gray-700/50 transition-colors ${
                lang === l.code ? 'text-blue-400 font-semibold' : 'text-gray-300'
              }`}
            >
              <span className="text-sm sm:text-base">{l.name}</span>
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

// Componente de timer que solo se renderiza en el cliente
const TimerDisplay = ({ time, className, style }: { time: string, className: string, style: React.CSSProperties }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <span className={className} style={style}>
        {time === '--h --m --s' ? '--h --m --s' : '--d --h --m'}
      </span>
    );
  }

  return (
    <span className={className} style={style}>
      {time}
    </span>
  );
};

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isGuidesMenuOpen, setIsGuidesMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false); 
  const [isMobileGuidesOpen, setIsMobileGuidesOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const [isMobileUserOpen, setIsMobileUserOpen] = useState(false);
  const {user, isAuthenticated, isLoading, logout} = useAuth();
  const guidesMenuRef = useRef<HTMLDivElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Funciones para manejar el estado del menú de guías con localStorage
  const handleGuidesMenuToggle = (isOpen: boolean) => {
    setIsGuidesMenuOpen(isOpen);
    if (typeof window !== 'undefined') {
      localStorage.setItem('guidesMenuOpen', JSON.stringify(isOpen));
    }
  };

  const handleMobileGuidesToggle = (isOpen: boolean) => {
    setIsMobileGuidesOpen(isOpen);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mobileGuidesOpen', JSON.stringify(isOpen));
    }
  };

  // Funciones para manejar el estado del menú de tools con localStorage
  const handleToolsMenuToggle = (isOpen: boolean) => {
    setIsToolsMenuOpen(isOpen);
    if (typeof window !== 'undefined') {
      localStorage.setItem('toolsMenuOpen', JSON.stringify(isOpen));
    }
  };

  const handleMobileToolsToggle = (isOpen: boolean) => {
    setIsMobileToolsOpen(isOpen);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mobileToolsOpen', JSON.stringify(isOpen));
    }
  };

  // Cargar preferencias del localStorage después de la hidratación
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedGuidesMenu = localStorage.getItem('guidesMenuOpen');
      const savedMobileGuides = localStorage.getItem('mobileGuidesOpen');
      const savedToolsMenu = localStorage.getItem('toolsMenuOpen');
      const savedMobileTools = localStorage.getItem('mobileToolsOpen');
      
      if (savedGuidesMenu !== null) {
        setIsGuidesMenuOpen(JSON.parse(savedGuidesMenu));
      }
      
      if (savedMobileGuides !== null) {
        setIsMobileGuidesOpen(JSON.parse(savedMobileGuides));
      }
      
      if (savedToolsMenu !== null) {
        setIsToolsMenuOpen(JSON.parse(savedToolsMenu));
      }
      
      if (savedMobileTools !== null) {
        setIsMobileToolsOpen(JSON.parse(savedMobileTools));
      }
    }
  }, []);
  
  // Reset timers - Inicializar con placeholders para evitar layout shift
  const [dailyResetTime, setDailyResetTime] = useState<string>('--h --m --s');
  const [weeklyResetTime, setWeeklyResetTime] = useState<string>('--d --h --m');
  const [specialEventTime, setSpecialEventTime] = useState<string>('--d --h --m');
  // Estados para control de menús (mantenidos)

  // Calculate reset times
  useEffect(() => {
    const calculateDailyReset = () => {
      const now = new Date();
      const resetTime = new Date();
      
      // 19:00 Colombia = 00:00 UTC del día siguiente
      resetTime.setUTCHours(0, 0, 0, 0);
      
      if (now.getTime() > resetTime.getTime()) {
        resetTime.setUTCDate(resetTime.getUTCDate() + 1);
      }
      
      const diff = resetTime.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setDailyResetTime(`${hours}h ${minutes}m ${seconds}s`);
    };

    const calculateWeeklyReset = () => {
      const now = new Date();
      const resetTime = new Date();
      
      // 02:30 Colombia del lunes = 07:30 UTC del lunes
      resetTime.setUTCHours(7, 30, 0, 0);
      
      // Find next Monday
      const daysUntilMonday = (8 - resetTime.getUTCDay()) % 7;
      resetTime.setUTCDate(resetTime.getUTCDate() + daysUntilMonday);
      
      if (now.getTime() > resetTime.getTime()) {
        resetTime.setUTCDate(resetTime.getUTCDate() + 7);
      }
      
      const diff = resetTime.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setWeeklyResetTime(`${days}d ${hours}h ${minutes}m`);
    };

    const calculateSpecialEvent = () => {
      const now = new Date();
      // 03 de febrero de 2026 a las 11:00 UTC
      const endTime = new Date('2026-02-03T11:00:00.000Z');
      
      const diff = endTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setSpecialEventTime('Ended');
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setSpecialEventTime(`${days}d ${hours}h ${minutes}m`);
    };

    calculateDailyReset();
    calculateWeeklyReset();
    calculateSpecialEvent();
    
    const interval = setInterval(() => {
      calculateDailyReset();
      calculateWeeklyReset();
      calculateSpecialEvent();
    }, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, []);

  // Cerrar menús cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Cerrar menú de guías
      if (guidesMenuRef.current && !guidesMenuRef.current.contains(target)) {
        handleGuidesMenuToggle(false);
      }
      
      // Cerrar menú de herramientas
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(target)) {
        handleToolsMenuToggle(false);
      }
      
      // Cerrar menú de usuario
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
      
      // Cerrar menús móviles
      if (isMobileMenuOpen) {
        const mobileMenuElement = document.querySelector('[data-mobile-menu]');
        const mobileButton = mobileMenuRef.current;
        
        if (mobileMenuElement && mobileButton) {
          const isClickInsideMenu = mobileMenuElement.contains(target);
          const isClickInsideButton = mobileButton.contains(target);
          
          if (!isClickInsideMenu && !isClickInsideButton) {
            setIsMobileMenuOpen(false);
            setIsUserMenuOpen(false);
            handleMobileGuidesToggle(false);
            handleMobileToolsToggle(false);
            setIsMobileUserOpen(false);
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, isUserMenuOpen]);

  const { t } = useI18n();
  const navItems: NavItem[] = [
    { href: '/', label: t('nav.home', 'Home'), icon: Home },
    { href: '/farming-routes', label: t('nav.farms', 'Farms'), icon: Map },
    { href: '/salvage', label: t('nav.salvaging', 'Salvaging'), icon: Package },

  ];

  // Sección de Guías
  const guidesItems: NavItem[] = [
    { href: '/conversion-guide', label: t('conversionGuidePage.title', 'Guía de Conversión'), icon: 'conversion-guide', isImage: true },
    { href: '/garden', label: t('gardenPage.titleShort', 'Jardín'), icon: Star },
    { href: '/gift-of-mastery', label: t('nav.giftOfMastery', 'Gift of Mastery'), icon: 'GOM', isImage: true },
    { href: '/gift-of-jade-mastery', label: t('nav.giftOfJadeMastery', 'Gift of Jade Mastery'), icon: 'GOJM', isImage: true },
    { href: '/glossary', label: t('nav.glossary', 'Glosario'), icon: 'Glosary', isImage: true },
    { href: '/festivals/halloween/labyrinth-guide', label: t('pageTitles.halloweenLabyrinth', 'Guía del Laberinto de Halloween'), icon: 'Shadow_of_the_Mad_King', isImage: true },
    // { href: '/alt-parking', label: t('nav.altParking', 'Alt Parking'), icon: Package }, 

  ];

  // Sección de Herramientas
  const toolsItems: NavItem[] = [
    { href: '/magic', label: t('dashboard.magic.title', 'Magic'), icon: 'volatile-magic', isImage: true },
    { href: '/festivals', label: t('nav.festivals', 'Festivales'), icon: 'Festival_Collections', isImage: true},
    { href: '/fractals', label: t('dashboard.farmingTracker.title', 'Fractales'), icon: 'fractal-relic', isImage: true },
    { href: '/ectogambling', label: t('ectogamblingPage.title', 'Ectogambling'), icon: 'ecto', isImage: true },
    { href: '/opened', label: t('openedPage.title', 'Contenedores Abribles'), icon: 'Community', isImage: true },

    // Solo mostrar Buyout Calculator para admins
    ...(user?.role === 'admin' ? [{ href: '/buyout', label: 'Buyout Calculator', icon: ShoppingCart }] : []),
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    // La redirección se maneja automáticamente en el contexto de autenticación
  };

  return (
    <>
      <style jsx global>{`
        .font-display {
          font-display: swap;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-weight: 900;
          text-rendering: optimizeSpeed;
        }
      `}</style>
      
      <div className="sticky top-0 z-50">
        <nav className="bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Esquina Izquierda */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div whileHover={{ scale: 1.05, rotate: 5 }}>
                <Image
                  src="/images/icons/icon.webp"
                  alt="True Farming"
                  width={44}
                  height={44}
                  sizes="(max-width: 640px) 36px, (max-width: 768px) 40px, 44px"
                  className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-md shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300"
                />
              </motion.div>
              <div className="block">
                <div className="flex flex-col">
                  <span className="text-white font-black text-base sm:text-lg md:text-xl leading-tight font-display">True Farming</span>
                  <span className="text-gray-400 text-xs">Guild Wars 2</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Reset Timers - After Logo */}
          <div className="hidden lg:flex items-center space-x-4">
            <div 
              className="flex items-center space-x-2 text-blue-300 px-3 py-2 rounded-lg bg-blue-900/20 border border-blue-700/30"
              title={t('nav.dailyReset', 'Reset Daily - Daily rewards, missions and achievements reset')}
            >
              <Clock className="w-4 h-4" />
              <TimerDisplay 
                time={dailyResetTime}
                className="text-sm font-mono font-bold"
                style={{ width: '6rem', minWidth: '6rem', display: 'inline-block', textAlign: 'center' }}
              />
            </div>
            <div 
              className="flex items-center space-x-2 text-purple-300 px-3 py-2 rounded-lg bg-purple-900/20 border border-purple-700/30"
              title={t('nav.weeklyReset', 'Reset Weekly - Weekly rewards, raids, fractals and WvW reset')}
            >
              <Calendar className="w-4 h-4" />
              <TimerDisplay 
                time={weeklyResetTime}
                className="text-sm font-mono font-bold"
                style={{ width: '6rem', minWidth: '6rem', display: 'inline-block', textAlign: 'center' }}
              />
            </div>
            <div 
              className="flex items-center space-x-2 text-amber-300 px-3 py-2 rounded-lg bg-amber-900/20 border border-amber-700/30"
              title={t('nav.specialEvent', "Wizard's Vault Reset - Special missions reset")}
            >
              <Star className="w-4 h-4" />
              <TimerDisplay 
                time={specialEventTime}
                className="text-sm font-mono font-bold"
                style={{ width: '6rem', minWidth: '6rem', display: 'inline-block', textAlign: 'center' }}
              />
            </div>
            {/* Enlace de Giveaways */}
             <Link
              href="/giveaways"
              className="flex items-center space-x-2 text-green-300 px-3 py-2 rounded-lg bg-green-900/20 border border-green-700/30 hover:bg-green-800/30 hover:text-green-200 transition-all duration-200"
              title={t('nav.giveaways', 'Giveaways')}
            >
              <Gift className="w-4 h-4" />
              <span className="text-sm font-bold">{t('nav.giveaways', 'Giveaways')}</span>
            </Link>   
          </div>

          {/* Navigation Items + User Menu - Esquina Derecha */}
          <div className="flex items-center space-x-6">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-800/50 hover:shadow-md">
                  {item.isImage ? (
                    <Image 
                      src={`/images/${item.icon === 'GOM' || item.icon === 'GOJM' ? 'assets' : item.icon === 'Shadow_of_the_Mad_King' ? 'festivals' : 'expansions'}/${item.icon}.webp`} 
                      alt={item.label}
                      width={item.icon === 'Shadow_of_the_Mad_King' ? 80 : 64}
                      height={item.icon === 'Shadow_of_the_Mad_King' ? 80 : 64}
                      className={item.icon === 'Shadow_of_the_Mad_King' ? 'w-6 h-6' : 'w-4 h-4'}
                    />
                  ) : (
                    <item.icon className="w-4 h-4" />
                  )}
                  <span className="font-bold">{item.label}</span>
                </Link>
              ))}
              
              {/* Guides Dropdown */}
              <div className="relative" ref={guidesMenuRef}>
                <button
                  onClick={() => handleGuidesMenuToggle(!isGuidesMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-800/50 hover:shadow-md cursor-pointer">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-bold">{t('nav.guides', 'Guías')}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isGuidesMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Guides Dropdown Menu */}
                {isGuidesMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute left-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
                    {guidesItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                        onClick={() => handleGuidesMenuToggle(false)}>
                        {item.isImage ? (
                          <Image 
                            src={`/images/${item.icon === 'GOM' || item.icon === 'GOJM' || item.icon === 'Glosary' || item.icon === 'Community' || item.icon === 'conversion-guide' ? 'assets' : item.icon === 'Shadow_of_the_Mad_King' ? 'festivals' : 'expansions'}/${item.icon}.${item.icon === 'conversion-guide' ? 'gif' : 'webp'}`} 
                            alt={item.label}
                            width={item.icon === 'Shadow_of_the_Mad_King' ? 48 : 32}
                            height={item.icon === 'Shadow_of_the_Mad_King' ? 48 : 32}
                            className={item.icon === 'Shadow_of_the_Mad_King' ? 'w-6 h-6' : 'w-4 h-4'}
                          />
                        ) : (
                          <item.icon className="w-4 h-4" />
                        )}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Tools Dropdown */}
              <div className="relative" ref={toolsMenuRef}>
                <button
                  onClick={() => handleToolsMenuToggle(!isToolsMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-800/50 hover:shadow-md cursor-pointer">
                  <Shield className="w-4 h-4" />
                  <span className="font-bold">{t('nav.tools', 'Herramientas')}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Tools Dropdown Menu */}
                {isToolsMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute left-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
                    {toolsItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                        onClick={() => handleToolsMenuToggle(false)}>
                        {item.isImage ? (
                          <Image 
                            src={`/images/${item.icon === 'GOM' || item.icon === 'GOJM' || item.icon === 'Glosary' || item.icon === 'Community' ? 'assets' : item.icon === 'Shadow_of_the_Mad_King' ? 'festivals' : 'expansions'}/${item.icon}.webp`} 
                            alt={item.label}
                            width={16}
                            height={16}
                            className="w-4 h-4"
                          />
                        ) : (
                          <item.icon className="w-4 h-4" />
                        )}
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* User Menu / Auth Buttons */}
            <div className="flex items-center space-x-4">
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <div className="relative hidden lg:block" ref={userMenuRef}>
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center space-x-3 text-gray-300 hover:text-white transition-all duration-200 px-4 py-2 rounded-lg hover:bg-gray-800/50 hover:shadow-md cursor-pointer">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="hidden sm:block font-bold">{user?.username}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                      </button>

                      {/* User Dropdown */}
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
                          <div className="px-4 py-3 border-b border-gray-700">
                            <p className="text-white font-semibold">{user?.username}</p>
                          </div>
                          
                          <div className="py-1">
                            <Link
                              href="/profile"
                              className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}>
                              <User className="w-4 h-4" />
                       <span>{t('auth.profile', 'Profile')}</span>
                            </Link>
                            

                            

                            {/* Solo mostrar Admin Panel si es admin y NO moderador */}
                            {((user?.role === 'admin' || user?.isAdmin) && user?.role !== 'moderator') && (
                              <Link
                                href="/admin"
                                className="flex items-center space-x-3 px-4 py-2 text-purple-300 hover:text-purple-200 hover:bg-gray-700 transition-colors"
                                onClick={() => setIsUserMenuOpen(false)}>
                                <Shield className="w-4 h-4" />
                                 <span>{t('auth.admin', 'Admin Panel')}</span>
                              </Link>
                            )}
                            {/* Solo mostrar Moderation Panel si es moderador */}
                            {(user?.role === 'moderator') && (
                              <Link
                                href="/moderator"
                                className="flex items-center space-x-3 px-4 py-2 text-blue-300 hover:text-blue-200 hover:bg-gray-700 transition-colors"
                                onClick={() => setIsUserMenuOpen(false)}>
                                <Shield className="w-4 h-4" />
                                 <span>{t('auth.moderation', 'Moderation Panel')}</span>
                              </Link>
                            )}
                          </div>
                          
                          <div className="border-t border-gray-700 pt-1">
                            <button
                              onClick={handleLogout}
                              className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors w-full text-left cursor-pointer">
                              <LogOut className="w-4 h-4" />
                              <span>{t('auth.logout', 'Logout')}</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="hidden lg:flex items-center">
                      <Link
                        href="/login"
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm">
                        {t('auth.login', 'Login')}
                      </Link>
                    </div>
                  )}

                  {/* Mobile primary button spot: Show Giveaways with same desktop style */}
                  <div className="lg:hidden">
                    <Link
                      href="/giveaways"
                      className="flex items-center space-x-2 text-green-300 px-3 py-2 rounded-lg bg-green-900/20 border border-green-700/30 hover:bg-green-800/30 hover:text-green-200 transition-all duration-200">
                      <Gift className="w-4 h-4" />
                      <span className="text-xs font-bold">{t('nav.giveaways', 'Giveaways')}</span>
                    </Link>
                  </div>
                </>
              )}

              {/* Mobile menu button */}
              <div className="lg:hidden relative" ref={mobileMenuRef}>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800/50 cursor-pointer">
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>

                {/* Mobile Navigation */}
                {isMobileMenuOpen && (
                  <motion.div
                    data-mobile-menu
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-gray-800/90 rounded-lg border border-gray-700 shadow-xl z-50">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                      {/* Reset Timers - Mobile */}
                      <div className="border-b border-gray-700 pb-3 mb-3">
                        <div className="flex flex-col space-y-2">
                          <div 
                            className="flex items-center space-x-2 text-blue-300 px-3 py-2 rounded-lg bg-blue-900/20 border border-blue-700/30"
                            title={t('nav.dailyReset', 'Reset Daily - Daily rewards, missions and achievements reset')}
                          >
                            <Clock className="w-4 h-4" />
                            <TimerDisplay 
                              time={dailyResetTime}
                              className="text-xs font-mono font-bold"
                              style={{ width: '6rem', minWidth: '6rem', display: 'inline-block', textAlign: 'center' }}
                            />
                            <span className="text-xs text-blue-200 ml-auto">{t('nav.daily', 'Daily')}</span>
                          </div>
                          <div 
                            className="flex items-center space-x-2 text-purple-300 px-3 py-2 rounded-lg bg-purple-900/20 border border-purple-700/30"
                            title={t('nav.weeklyReset', 'Reset Weekly - Weekly rewards, raids, fractals and WvW reset')}
                          >
                            <Calendar className="w-4 h-4" />
                            <TimerDisplay 
                              time={weeklyResetTime}
                              className="text-xs font-mono font-bold"
                              style={{ width: '6rem', minWidth: '6rem', display: 'inline-block', textAlign: 'center' }}
                            />
                            <span className="text-xs text-purple-200 ml-auto">{t('nav.weekly', 'Weekly')}</span>
                          </div>
                          <div 
                            className="flex items-center space-x-2 text-amber-300 px-3 py-2 rounded-lg bg-amber-900/20 border border-amber-700/30"
                            title={t('nav.specialEvent', "Wizard's Vault Reset - Special missions reset")}
                          >
                            <Star className="w-4 h-4" />
                            <TimerDisplay 
                              time={specialEventTime}
                              className="text-xs font-mono font-bold"
                              style={{ width: '6rem', minWidth: '6rem', display: 'inline-block', textAlign: 'center' }}
                            />
                            <span className="text-xs text-amber-200 ml-auto">{t('nav.special', 'Special')}</span>
                          </div>
                        </div>
                      </div>

                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200">
                          {item.isImage ? (
                            <Image 
                              src={`/images/${item.icon === 'GOM' || item.icon === 'GOJM' || item.icon === 'Glosary' || item.icon === 'Community' ? 'assets' : item.icon === 'Shadow_of_the_Mad_King' ? 'festivals' : 'expansions'}/${item.icon}.webp`} 
                              alt={item.label}
                              width={item.icon === 'Shadow_of_the_Mad_King' ? 32 : 16}
                              height={item.icon === 'Shadow_of_the_Mad_King' ? 32 : 16}
                              className={item.icon === 'Shadow_of_the_Mad_King' ? 'w-8 h-8' : 'w-5 h-5'}
                            />
                          ) : (
                            <item.icon className="w-5 h-5" />
                          )}
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}

                      {/* Guides Section */}
                      <div className="border-t border-gray-700 my-2 pt-2">
                        <button
                          onClick={() => handleMobileGuidesToggle(!isMobileGuidesOpen)}
                          className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-white transition-colors duration-200 cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <BookOpen className="w-4 h-4" />
                            <span>{t('nav.guides', 'Guías')}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isMobileGuidesOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isMobileGuidesOpen && (
                          <div className="space-y-1">
                            {guidesItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center space-x-3 px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200">
                                {item.isImage ? (
                                  <Image 
                                    src={`/images/${item.icon === 'GOM' || item.icon === 'GOJM' || item.icon === 'Glosary' || item.icon === 'Community' ? 'assets' : item.icon === 'Shadow_of_the_Mad_King' ? 'festivals' : 'expansions'}/${item.icon}.webp`} 
                                    alt={item.label}
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                  />
                                ) : (
                                  <item.icon className="w-5 h-5" />
                                )}
                                <span className="font-medium">{item.label}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Tools Section */}
                      <div className="border-t border-gray-700 my-2 pt-2">
                        <button
                          onClick={() => handleMobileToolsToggle(!isMobileToolsOpen)}
                          className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-white transition-colors duration-200 cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4" />
                            <span>{t('nav.tools', 'Herramientas')}</span>
                          </div>
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isMobileToolsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isMobileToolsOpen && (
                          <div className="space-y-1">
                            {toolsItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="flex items-center space-x-3 px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200">
                                {item.isImage ? (
                                  <Image 
                                    src={`/images/${item.icon === 'GOM' || item.icon === 'GOJM' || item.icon === 'Glosary' || item.icon === 'Community' ? 'assets' : item.icon === 'Shadow_of_the_Mad_King' ? 'festivals' : 'expansions'}/${item.icon}.webp`} 
                                    alt={item.label}
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                  />
                                ) : (
                                  <item.icon className="w-5 h-5" />
                                )}
                                <span className="font-medium">{item.label}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* User Section for Mobile (authenticated) */}
                      {isAuthenticated ? (
                        <>
                          <div className="border-t border-gray-700 my-2 pt-2">
                            <button
                              onClick={() => setIsMobileUserOpen(!isMobileUserOpen)}
                              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-white transition-colors duration-200 cursor-pointer">
                              <div className="flex items-center space-x-2">
                                <User className="w-4 h-4" />
                                <span>{user?.username}</span>
                              </div>
                              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isMobileUserOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isMobileUserOpen && (
                              <div className="space-y-1">
                                <Link
                                  href="/profile"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center space-x-3 px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200">
                                  <User className="w-5 h-5" />
                                  <span className="font-medium">{t('auth.profile', 'Profile')}</span>
                                </Link>
                                

                                {/* Solo mostrar Admin Panel si es admin y NO moderador */}
                                {((user?.role === 'admin' || user?.isAdmin) && user?.role !== 'moderator') && (
                                  <Link
                                    href="/admin"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center space-x-3 px-3 py-3 text-purple-300 hover:text-purple-200 hover:bg-gray-700 rounded-md transition-colors duration-200">
                                    <Crown className="w-5 h-5" />
                                    <span className="font-medium">{t('auth.admin', 'Admin Panel')}</span>
                                  </Link>
                                )}
                                {(user?.role === 'moderator') && (
                                  <Link
                                    href="/moderator"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center space-x-3 px-3 py-3 text-blue-300 hover:text-blue-200 hover:bg-gray-700 rounded-md transition-colors duration-200">
                                    <Shield className="w-5 h-5" />
                                    <span className="font-medium">{t('auth.moderation', 'Moderation Panel')}</span>
                                  </Link>
                                )}
                                
                                <button
                                  onClick={() => {
                                    handleLogout();
                                    setIsMobileMenuOpen(false);
                                  }}
                                  className="flex items-center space-x-3 px-3 py-3 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-md transition-colors duration-200 w-full text-left cursor-pointer">
                                  <LogOut className="w-5 h-5" />
                                  <span className="font-medium">{t('auth.logout', 'Logout')}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        // Mobile unauthenticated: show Login inside the hamburger menu
                        <div className="border-t border-gray-700 my-2 pt-2">
                          <Link
                            href="/login"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center space-x-3 px-3 py-3 text-gray-100 bg-blue-600/80 hover:bg-blue-700 rounded-md transition-colors duration-200">
                            <User className="w-5 h-5" />
                            <span className="font-semibold">{t('auth.login', 'Login')}</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
        </nav>
        
        {/* Language Switcher Flotante */}
        <div className="relative">
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-50 transform-none will-change-auto">
            <FloatingLanguageSwitcher />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;