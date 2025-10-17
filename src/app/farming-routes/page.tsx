'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import { Search, Map, Clock, RefreshCw, Star, Copy, Users, User, Info } from 'lucide-react';
import { useDatabase, FarmItem } from '@/hooks/useDatabase';
import ExpansionIcon from '@/components/ui/ExpansionIcon';
import GW2Icon from '@/components/ui/GW2Icon';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';
import DescriptionModal from '@/components/ui/DescriptionModal';
import MarkdownText from '@/components/ui/MarkdownText';

export default function FarmingRoutes() {
  usePageTitle('pageTitles.farmingRoutes', 'Farming Routes');
  const { t } = useI18n();
  
  const { dbService } = useDatabase();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpansions, setSelectedExpansions] = useState<string[]>([]);
  const [farmingRoutes, setFarmingRoutes] = useState<FarmItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedWaypoint, setCopiedWaypoint] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<FarmItem | null>(null);

  // Función para copiar waypoint al portapapeles
  const copyWaypointToClipboard = async (waypoint: string, farmId: string) => {
    try {
      await navigator.clipboard.writeText(waypoint);
      setCopiedWaypoint(`${farmId}-${waypoint}`);
      
      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => {
        setCopiedWaypoint(null);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy waypoint: ', err);
    }
  };

  // Función para abrir el modal de descripción
  const openDescriptionModal = (route: FarmItem) => {
    setSelectedRoute(route);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal de descripción
  const closeDescriptionModal = () => {
    setIsModalOpen(false);
    setSelectedRoute(null);
  };

  // Mapeo de tipos de moneda a iconos y labels
  const currencyMap = {
    gold: { icon: 'gold' as const, labelKey: 'currency.gold', suffix: '/h' },
    spiritShards: { icon: 'spirit-shard' as const, labelKey: 'currency.spiritShards', suffix: '/h' },
    karma: { icon: 'karma' as const, labelKey: 'currency.karma', suffix: '' },
    fractalRelics: { icon: 'fractal-relic' as const, labelKey: 'currency.fractalRelics', suffix: '/h' },
    volatileMagic: { icon: 'volatile-magic' as const, labelKey: 'currency.volatileMagic', suffix: '/h' },
    unboundMagic: { icon: 'unbound-magic' as const, labelKey: 'currency.unboundMagic', suffix: '/h' },
    riftEssences: { icon: 'rift-essence' as const, labelKey: 'currency.riftEssences', suffix: '/h' },
    mysticClovers: { icon: 'mystic-clover' as const, labelKey: 'currency.mysticClovers', suffix: '/h' },
    imperialFavor: { icon: 'imperial-favor' as const, labelKey: 'currency.imperialFavor', suffix: '/h' }
  };

  // Función para formatear oro correctamente
  const formatGoldDisplay = (goldValue: string | undefined): string => {
    if (!goldValue || !goldValue.trim()) return '';
    
    // Si ya está en formato GW2 (contiene g, s, c), devolverlo tal como está
    if (goldValue.includes('g') || goldValue.includes('s') || goldValue.includes('c')) {
      return goldValue;
    }
    
    // Si es solo números, convertirlo a formato GW2
    const copper = parseInt(goldValue);
    if (isNaN(copper)) return '';
    
    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const remainingCopper = copper % 100;
    
    // Siempre mostrar formato completo con ceros a la izquierda
    const goldStr = gold.toString();
    const silverStr = silver.toString().padStart(2, '0');
    const copperStr = remainingCopper.toString().padStart(2, '0');
    
    return `${goldStr}g ${silverStr}s ${copperStr}c`;
  };

  // Cargar rutas desde la base de datos
  const loadRoutes = useCallback(async () => {
    if (!dbService) {
      console.log('dbService not available yet');
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading farms from database...');
      
      // Cargar todos los farms y filtrar solo los aprobados
      const allRoutes = await dbService.getAllFarms();
      console.log('Loaded farms:', allRoutes.length);
      const approvedRoutes = allRoutes.filter((route: FarmItem) => route.status === 'approved');
      console.log('Approved farms:', approvedRoutes.length);
      
      // Ordenar por el campo order (menor número = más arriba)
      const sortedRoutes = approvedRoutes.sort((a, b) => {
        const orderA = a.order ?? 999; // Si no tiene order, va al final
        const orderB = b.order ?? 999;
        return orderA - orderB;
      });
      
      setFarmingRoutes(sortedRoutes);
    } catch (error) {
      console.error('Error loading routes:', error);
      setError(t('farmingRoutes.errorLoading', 'Error loading routes from database'));
    } finally {
      setIsLoading(false);
    }
  }, [dbService, t]);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  // Filtrar rutas
  const filteredRoutes = farmingRoutes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Si no hay expansiones seleccionadas, mostrar todas
    if (selectedExpansions.length === 0) {
      return matchesSearch;
    }
    
    // Obtener las expansiones de la ruta
    const routeExpansions = Array.isArray(route.expansion) ? route.expansion : [route.expansion];
    
    // Verificar que la ruta requiera TODAS las expansiones seleccionadas
    const matchesExpansions = selectedExpansions.every(selectedExp => 
      routeExpansions.includes(selectedExp as 'core' | 'hot' | 'pof' | 'eod' | 'soto' | 'jw')
    );
    
    return matchesSearch && matchesExpansions;
  });

  // Función para manejar la selección de expansiones
  const handleExpansionToggle = (expansion: string) => {
    setSelectedExpansions(prev => {
      if (prev.includes(expansion)) {
        return prev.filter(exp => exp !== expansion);
      } else {
        return [...prev, expansion];
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
                              <p className="text-white">{t('farmingRoutes.loading', 'Loading routes from database...')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
        <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('farmingRoutes.title', 'Farming Routes')}
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            {t('farmingRoutes.subtitle', 'The best routes to make gold in Guild Wars 2')}
          </p>
          
          {/* Daily Routine Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center">
            <Link
              href="/daily-routine"
              className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              <Clock className="w-5 h-5" />
              <span>{t('dashboard.dailyRoutine.title', 'Daily Routine')}</span>
              <Star className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}



        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('search.routes', 'Search routes...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Expansion Filter - Multiple Selection */}
            <div className="flex flex-wrap gap-2 justify-center">
              {(['core', 'hot', 'pof', 'eod', 'soto', 'jw'] as const).map((expansion) => (
                <button
                  key={expansion}
                  onClick={() => handleExpansionToggle(expansion)}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                    selectedExpansions.includes(expansion)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <ExpansionIcon expansion={expansion} size="sm" variant="compact" />
                  {expansion.toUpperCase()}
                </button>
              ))}
              
              {/* Clear Selection Button */}
              {selectedExpansions.length > 0 && (
                <button
                  onClick={() => setSelectedExpansions([])}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors duration-200">
                  {t('button.clear', 'Clear')}
                </button>
              )}
            </div>

            {/* Reload Button */}
            <button
              onClick={loadRoutes}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
              <RefreshCw className="w-4 h-4" />
              {t('button.reload', 'Reload')}
            </button>
          </div>
        </motion.div>

        {/* Routes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRoutes.map((route) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6 min-h-[220px] hover:shadow-xl transition-all duration-300">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-white">{route.name}</h3>
                      
                      {/* Modalidad Badges */}
                      <div className="flex gap-2">
                        {route.isSolo && (
                          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {t('farmingRoutes.mode.solo', 'Solo')}
                          </span>
                        )}
                        {route.requiresSquad && (
                          <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {t('farmingRoutes.mode.squad', 'Squad')}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mb-3">
                      <button
                        onClick={() => openDescriptionModal(route)}
                        className="text-left w-full group"
                      >
                                      <div className="p-3 rounded-lg">
                <MarkdownText 
                  text={route.description.length > 150 ? `${route.description.substring(0, 150)}...` : route.description}
                  className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap break-all group-hover:text-gray-300 transition-colors"
                />
              </div>
                        <div className="flex items-center gap-2 mt-2 text-blue-400 text-sm">
                          <Info className="w-4 h-4" />
                          <span className="text-blue-400">{t('cta.seeFullDescription', 'See full description')}</span>
                        </div>
                      </button>
                    </div>
                    
                    {/* Waypoint */}
                    {route.waypoint && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-500">{t('label.waypoint', 'Waypoint:')}</span>
                        <div className="relative">
                          <button
                            onClick={() => copyWaypointToClipboard(route.waypoint!, route.id)}
                            className={`flex items-center gap-1 px-2 py-1 text-sm rounded transition-all duration-200 ${
                              copiedWaypoint === `${route.id}-${route.waypoint}`
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-700 hover:bg-gray-600 text-blue-400'
                            }`}
                            title={copiedWaypoint === `${route.id}-${route.waypoint}` ? t('notif.copied', 'Copied!') : t('farmingRoutes.clickToCopy', 'Click to copy waypoint')}
                          >
                            <span className="font-mono">{route.waypoint}</span>
                            <Copy className="w-3 h-3" />
                          </button>
                          
                          {/* Notificación local al lado del botón */}
                          {copiedWaypoint === `${route.id}-${route.waypoint}` && (
                            <motion.div
                              initial={{ opacity: 0, x: -10, scale: 0.95 }}
                              animate={{ opacity: 1, x: 0, scale: 1 }}
                              exit={{ opacity: 0, x: -10, scale: 0.95 }}
                              className="absolute left-full ml-2 top-0 bg-green-600 text-white rounded-lg shadow-lg px-3 py-1 flex items-center gap-2 z-50 whitespace-nowrap">
                              <Copy className="w-3 h-3" />
                               <span className="text-xs font-medium">{t('notif.copied', 'Waypoint copied!')}</span>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {(Array.isArray(route.expansion) ? route.expansion : [route.expansion]).map((exp) => (
                      <ExpansionIcon key={exp} expansion={exp as 'core' | 'hot' | 'pof' | 'eod' | 'soto' | 'jw'} size="md" variant="compact" />
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Tiempo - siempre se muestra */}
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-blue-400" />
                    <div>
                      <p className="text-gray-400 text-sm">{t('label.time', 'Time')}</p>
                      <p className="text-blue-400 font-semibold text-lg">{route.estimatedTime}</p>
                    </div>
                  </div>

                  {/* Nuevas recompensas del sistema flexible */}
                  {route.estimatedRewards && Object.entries(route.estimatedRewards).map(([currencyType, value]) => {
                    if (!value || !value.trim()) return null;
                    
                    const currency = currencyMap[currencyType as keyof typeof currencyMap];
                    if (!currency) return null;

                    return (
                      <div key={currencyType} className="flex items-center gap-3">
                        <div className="relative">
                          <GW2Icon 
                            type={currency.icon} 
                            size="md"
                          />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">{t(currency.labelKey, currency.labelKey)}</p>
                          <p className="text-yellow-400 font-semibold text-lg">
                            {currencyType === 'gold' ? formatGoldDisplay(value) : `${value}${currency.suffix}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Compatibilidad hacia atrás - mostrar campos legacy si no hay estimatedRewards */}
                  {(!route.estimatedRewards || Object.keys(route.estimatedRewards).length === 0) && (
                    <>
                      {/* Oro legacy */}
                      {route.estimatedGold && route.estimatedGold.trim() && (
                        <div className="flex items-center gap-3">
                          <GW2Icon type="gold" size="md" />
                          <div>
                            <p className="text-gray-400 text-sm">{t('label.goldPerHour', 'Gold/Hour')}</p>
                            <p className="text-yellow-400 font-semibold text-lg">{formatGoldDisplay(route.estimatedGold)}</p>
                          </div>
                        </div>
                      )}

                      {/* Spirit Shards legacy */}
                      {route.estimatedSpirit && route.estimatedSpirit.trim() && (
                        <div className="flex items-center gap-3">
                          <GW2Icon type="spirit-shard" size="md" />
                          <div>
                            <p className="text-gray-400 text-sm">{t('label.spiritShards', 'Spirit Shards')}</p>
                            <p className="text-blue-400 font-semibold text-lg">{route.estimatedSpirit}/h</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>




            </motion.div>
          ))}
        </motion.div>

        {/* Mensaje cuando no hay rutas */}
        {!isLoading && filteredRoutes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12">
            <div className="bg-gray-800 rounded-lg p-8">
              <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('empty.noFarms', 'No farms available')}
              </h3>
              <p className="text-gray-400 mb-4">
                {t('empty.noFarmsDesc', 'No farms created.')}
              </p>
            </div>
          </motion.div>
        )}

      </main>

      {/* Modal de descripción */}
      <DescriptionModal
        isOpen={isModalOpen}
        onClose={closeDescriptionModal}
        route={selectedRoute}
      />

    </div>
  );
} 