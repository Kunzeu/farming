'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import { Search, Map, Clock, Coins, RefreshCw, TrendingUp, Star } from 'lucide-react';
import { dbService, FarmItem } from '@/lib/database';
import ExpansionIcon from '@/components/ui/ExpansionIcon';

export default function FarmingRoutes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpansion, setSelectedExpansion] = useState('all');
  const [farmingRoutes, setFarmingRoutes] = useState<FarmItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar rutas desde la base de datos
  const loadRoutes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Cargar todos los farms
      const routes = await dbService.getAllFarms();
      setFarmingRoutes(routes);
    } catch (err) {
      console.error('Error loading routes:', err);
      setError('Error al cargar las rutas desde la base de datos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  // Filtrar rutas
  const filteredRoutes = farmingRoutes.filter(route => {
    const matchesSearch = route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         route.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesExpansion = selectedExpansion === 'all' || route.expansion === selectedExpansion;
    return matchesSearch && matchesExpansion;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
              <p className="text-white">Cargando rutas desde la base de datos...</p>
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
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Rutas de Farming
          </h1>
          <p className="text-xl text-gray-300">
            Las mejores rutas para hacer oro en Guild Wars 2
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6"
          >
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar rutas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex gap-2">
              {['all', 'core', 'hot', 'pof', 'eod', 'soto', 'jw'].map((expansion) => (
                <button
                  key={expansion}
                  onClick={() => setSelectedExpansion(expansion)}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                    selectedExpansion === expansion
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {expansion === 'all' ? 'Todas' : expansion.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Reload Button */}
            <button
              onClick={loadRoutes}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Recargar
            </button>
          </div>
        </motion.div>

        {/* Routes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredRoutes.map((route) => (
            <motion.div
              key={route.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 rounded-lg shadow-lg overflow-hidden p-6 min-h-[220px] hover:shadow-xl transition-all duration-300"
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-3">{route.name}</h3>
                    <p className="text-gray-400 text-base leading-relaxed">{route.description}</p>
                  </div>
                  <ExpansionIcon expansion={route.expansion} size="lg" variant="compact" />
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Coins className="w-6 h-6 text-yellow-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Oro/Hora</p>
                      <p className="text-yellow-400 font-semibold text-lg">{route.estimatedGold}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-blue-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Tiempo</p>
                      <p className="text-blue-400 font-semibold text-lg">{route.estimatedTime}</p>
                    </div>
                  </div>
                </div>

              {/* Map */}
              {route.map && (
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <Map className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-gray-400 text-xs">Mapa</p>
                      <p className="text-green-400 font-semibold">{route.map}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Requirements */}
              {route.requirements && route.requirements.length > 0 && (
                <div className="mb-4">
                  <p className="text-gray-400 text-xs mb-2">Requisitos:</p>
                  <div className="flex flex-wrap gap-2">
                    {route.requirements.map((req, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {route.tags && route.tags.length > 0 && (
                <div className="mb-4">
                  <p className="text-gray-400 text-xs mb-2">Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {route.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-900/30 rounded text-xs text-purple-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Waypoints */}
              {route.waypoints && route.waypoints.length > 0 && (
                <div>
                  <p className="text-gray-400 text-xs mb-2">Waypoints:</p>
                  <div className="space-y-1">
                    {route.waypoints.map((wp, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <span className="text-blue-400 font-mono">{wp.name}</span>
                        <span className="text-gray-500">-</span>
                        <span className="text-gray-300">{wp.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Mensaje cuando no hay rutas */}
        {!isLoading && filteredRoutes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="bg-gray-800 rounded-lg p-8">
              <Map className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No hay farms disponibles
              </h3>
              <p className="text-gray-400 mb-4">
                No hay farms creados.
              </p>
            </div>
          </motion.div>
        )}

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Consejos para Farming
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <TrendingUp className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Eficiencia</h3>
              <p className="text-gray-400 text-sm">
                Rutas optimizadas para maximizar el oro por hora
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <Clock className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Timing</h3>
              <p className="text-gray-400 text-sm">
                Los precios varían según la hora del día. Vende en momentos de alta demanda.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <Star className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Variedad</h3>
              <p className="text-gray-400 text-sm">
                Diferentes tipos de contenido para todos los gustos
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 