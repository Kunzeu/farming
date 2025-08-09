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
  ShoppingCart
} from 'lucide-react';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const [isMobileUserOpen, setIsMobileUserOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const toolsMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Reset timers
  const [dailyResetTime, setDailyResetTime] = useState<string>('');
  const [weeklyResetTime, setWeeklyResetTime] = useState<string>('');

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

    calculateDailyReset();
    calculateWeeklyReset();
    
    const interval = setInterval(() => {
      calculateDailyReset();
      calculateWeeklyReset();
    }, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, []);

  // Cerrar menús cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Cerrar menú de herramientas
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(target)) {
        setIsToolsMenuOpen(false);
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
            setIsMobileToolsOpen(false);
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

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/farming-routes', label: 'Farms', icon: Map },
    { href: '/glossary', label: 'Glossary', icon: BookOpen },
    { href: '/account', label: 'My Account', icon: User },
  ];

  const toolsItems = [
    { href: '/salvage', label: 'Salvaging', icon: Package },
    { href: '/crafting', label: 'Crafting', icon: BookOpen },
    { href: '/festivals', label: 'Festivals', icon: Calendar },
    // Solo mostrar Buyout Calculator para admins
    ...(user?.role === 'admin' ? [{ href: '/buyout', label: 'Buyout Calculator', icon: ShoppingCart }] : []),
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    // La redirección se maneja automáticamente en el contexto de autenticación
  };

  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Esquina Izquierda */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="max-w-8 h-1 bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                <span className="text-white font-bold text-xs">GW2</span>
              </motion.div>
              <div className="hidden sm:block">
                <div className="flex flex-col">
                  <span className="text-white font-black text-xl leading-tight">True Farming</span>
                  <span className="text-gray-400 text-xs">Guild Wars 2</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Reset Timers - After Logo */}
          <div className="hidden lg:flex items-center space-x-4 -ml-4">
            <div 
              className="flex items-center space-x-2 text-blue-300 px-3 py-2 rounded-lg bg-blue-900/20 border border-blue-700/30 cursor-pointer hover:bg-blue-900/40 transition-colors"
              title="Reset Daily - Daily rewards, missions and achievements reset"
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm font-mono font-bold">{dailyResetTime}</span>
            </div>
            <div 
              className="flex items-center space-x-2 text-purple-300 px-3 py-2 rounded-lg bg-purple-900/20 border border-purple-700/30 cursor-pointer hover:bg-purple-900/40 transition-colors"
              title="Reset Weekly - Weekly rewards, raids, fractals and WvW reset"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-mono font-bold">{weeklyResetTime}</span>
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
                  onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-800/50 hover:shadow-md cursor-pointer">
                  <Shield className="w-4 h-4" />
                  <span className="font-bold">Calculators</span>
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
                        onClick={() => setIsToolsMenuOpen(false)}>
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
                          <span>Profile</span>
                        </Link>
                        

                        
                        <Link
                          href="/settings"
                          className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}>
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>

                        {(user?.role === 'admin' || user?.isAdmin) && (
                          <Link
                            href="/admin"
                            className="flex items-center space-x-3 px-4 py-2 text-purple-300 hover:text-purple-200 hover:bg-gray-700 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}>
                            <Shield className="w-4 h-4" />
                            <span>Admin Panel</span>
                          </Link>
                        )}
                        {(user?.role === 'moderator') && (
                          <Link
                            href="/moderator"
                            className="flex items-center space-x-3 px-4 py-2 text-blue-300 hover:text-blue-200 hover:bg-gray-700 transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}>
                            <Shield className="w-4 h-4" />
                            <span>Moderation Panel</span>
                          </Link>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-700 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-700 transition-colors w-full text-left cursor-pointer">
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="hidden lg:flex items-center">
                  <Link
                    href="/login"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg">
                    Login
                  </Link>
                </div>
              )}

              {/* Mobile Auth Button */}
              {!isAuthenticated && (
                <div className="lg:hidden">
                  <Link
                    href="/login"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm">
                    Login
                  </Link>
                </div>
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
                          onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
                          className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-white transition-colors duration-200 cursor-pointer">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4" />
                            <span>Calculators</span>
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

                                {(user?.role === 'admin' || user?.isAdmin) && (
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
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;