'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Map, 
  Clock,
  Menu, 
  X,
  User,
  LogOut,
  Settings,
  Shield,
  Package,
  ChevronDown,
  BookOpen,
  Calendar,
  Crown,
  ShoppingCart,
  Star,
  FileText
} from 'lucide-react';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { useI18n } from '@/contexts/I18nContext';


const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(true); // Por defecto abierto
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(true); // Por defecto abierto
  const [isMobileUserOpen, setIsMobileUserOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
      const savedToolsMenu = localStorage.getItem('toolsMenuOpen');
      const savedMobileTools = localStorage.getItem('mobileToolsOpen');
      
      if (savedToolsMenu !== null) {
        setIsToolsMenuOpen(JSON.parse(savedToolsMenu));
      }
      
      if (savedMobileTools !== null) {
        setIsMobileToolsOpen(JSON.parse(savedMobileTools));
      }
    }
  }, []);
  
  // Reset timers
  const [dailyResetTime, setDailyResetTime] = useState<string>('');
  const [weeklyResetTime, setWeeklyResetTime] = useState<string>('');
  const [specialEventTime, setSpecialEventTime] = useState<string>('');

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
      // 28 de octubre de 2025 a las 11:00 UTC
      const endTime = new Date('2025-10-28T11:00:00.000Z');
      
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
  const navItems = [
    { href: '/', label: t('nav.home', 'Home'), icon: Home },
    { href: '/farming-routes', label: t('nav.farms', 'Farms'), icon: Map },
    { href: '/salvage', label: t('nav.salvaging', 'Salvaging'), icon: Package },
  ];

  const toolsItems = [
    { href: '/trophy', label: t('dashboard.trophy.title', 'Trophy'), icon: FileText },
    { href: '/festivals', label: t('nav.festivals', 'Festivals'), icon: Calendar },
    { href: '/fractals', label: t('dashboard.farmingTracker.title', 'Fractals'), icon: Map },
    { href: '/glossary', label: t('nav.glossary', 'Glossary'), icon: BookOpen },
    // Solo mostrar Buyout Calculator para admins puros
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
      <nav className="bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Esquina Izquierda */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.img
                whileHover={{ scale: 1.05, rotate: 5 }}
                src="/images/icons/icon.png"
                alt="True Farming"
                className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-md shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300"
              />
              <div className="block">
                <div className="flex flex-col">
                  <span className="text-white font-black text-base sm:text-lg md:text-xl leading-tight font-display">True Farming</span>
                  <span className="text-gray-400 text-xs">Guild Wars 2</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Reset Timers - After Logo */}
          <div className="hidden lg:flex items-center space-x-4 -ml-4">
            <div 
              className="flex items-center space-x-2 text-blue-300 px-3 py-2 rounded-lg bg-blue-900/20 border border-blue-700/30"
              title={t('nav.dailyReset', 'Reset Daily - Daily rewards, missions and achievements reset')}
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm font-mono font-bold">{dailyResetTime}</span>
            </div>
            <div 
              className="flex items-center space-x-2 text-purple-300 px-3 py-2 rounded-lg bg-purple-900/20 border border-purple-700/30"
              title={t('nav.weeklyReset', 'Reset Weekly - Weekly rewards, raids, fractals and WvW reset')}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-mono font-bold">{weeklyResetTime}</span>
            </div>
            <div 
              className="flex items-center space-x-2 text-amber-300 px-3 py-2 rounded-lg bg-amber-900/20 border border-amber-700/30"
              title={t('nav.specialEvent', 'Special Event - Ends October 28, 2025 at 11:00 UTC')}
            >
              <Star className="w-4 h-4" />
              <span className="text-sm font-mono font-bold">{specialEventTime}</span>
            </div>
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
                  <item.icon className="w-4 h-4" />
                  <span className="font-bold">{item.label}</span>
                </Link>
              ))}
              


              {/* Tools Dropdown */}
              <div className="relative" ref={toolsMenuRef}>
                <button
                  onClick={() => handleToolsMenuToggle(!isToolsMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-800/50 hover:shadow-md cursor-pointer">
                  <Shield className="w-4 h-4" />
                  <span className="font-bold">{t('nav.tools', 'Tools')}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Tools Dropdown Menu */}
                {isToolsMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
                    {toolsItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                        onClick={() => handleToolsMenuToggle(false)}>
                        <item.icon className="w-4 h-4" />
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
                            

                            
                            <Link
                              href="/settings"
                              className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}>
                              <Settings className="w-4 h-4" />
                       <span>{t('auth.settings', 'Settings')}</span>
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

                  {/* Mobile Auth Button */}
                  {!isAuthenticated && (
                    <div className="lg:hidden">
                      <Link
                        href="/login"
                        className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg text-xs">
                        {t('auth.login', 'Login')}
                      </Link>
                    </div>
                  )}
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
                            <span className="text-xs font-mono font-bold">{dailyResetTime}</span>
                            <span className="text-xs text-blue-200 ml-auto">{t('nav.daily', 'Daily')}</span>
                          </div>
                          <div 
                            className="flex items-center space-x-2 text-purple-300 px-3 py-2 rounded-lg bg-purple-900/20 border border-purple-700/30"
                            title={t('nav.weeklyReset', 'Reset Weekly - Weekly rewards, raids, fractals and WvW reset')}
                          >
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-mono font-bold">{weeklyResetTime}</span>
                            <span className="text-xs text-purple-200 ml-auto">{t('nav.weekly', 'Weekly')}</span>
                          </div>
                          <div 
                            className="flex items-center space-x-2 text-amber-300 px-3 py-2 rounded-lg bg-amber-900/20 border border-amber-700/30"
                            title={t('nav.specialEvent', 'Special Event - Ends October 28, 2025 at 11:00 UTC')}
                          >
                            <Star className="w-4 h-4" />
                            <span className="text-xs font-mono font-bold">{specialEventTime}</span>
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
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      ))}



                      {/* Tools Section */}
                      <div className="border-t border-gray-700 my-2 pt-2">
                        <button
                          onClick={() => handleMobileToolsToggle(!isMobileToolsOpen)}
                          className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-white transition-colors duration-200 cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4" />
                            <span>{t('nav.tools', 'Tools')}</span>
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
                                <item.icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* User Section for Mobile */}
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
                                  <span className="font-medium">Profile</span>
                                </Link>
                                
                                <Link
                                  href="/settings"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex items-center space-x-3 px-3 py-3 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-200">
                                  <Settings className="w-5 h-5" />
                                  <span className="font-medium">Settings</span>
                                </Link>

                                {/* Solo mostrar Admin Panel si es admin y NO moderador */}
                                {((user?.role === 'admin' || user?.isAdmin) && user?.role !== 'moderator') && (
                                  <Link
                                    href="/admin"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center space-x-3 px-3 py-3 text-purple-300 hover:text-purple-200 hover:bg-gray-700 rounded-md transition-colors duration-200">
                                    <Crown className="w-5 h-5" />
                                    <span className="font-medium">Admin Panel</span>
                                  </Link>
                                )}
                                {(user?.role === 'moderator') && (
                                  <Link
                                    href="/moderator"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center space-x-3 px-3 py-3 text-blue-300 hover:text-blue-200 hover:bg-gray-700 rounded-md transition-colors duration-200">
                                    <Shield className="w-5 h-5" />
                                    <span className="font-medium">Moderation Panel</span>
                                  </Link>
                                )}
                                
                                <button
                                  onClick={() => {
                                    handleLogout();
                                    setIsMobileMenuOpen(false);
                                  }}
                                  className="flex items-center space-x-3 px-3 py-3 text-red-400 hover:text-red-300 hover:bg-gray-700 rounded-md transition-colors duration-200 w-full text-left cursor-pointer">
                                  <LogOut className="w-5 h-5" />
                                  <span className="font-medium">Logout</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      ) : null}
                    </div>
                  </motion.div>
                )}
              </div>
              {/* Language Switcher */}
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </nav>
    </>
  );
};

export default Navigation;