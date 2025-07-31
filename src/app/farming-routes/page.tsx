'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import { Search, Map, Clock, RefreshCw, TrendingUp, Star } from 'lucide-react';
import { useDatabase, FarmItem } from '@/hooks/useDatabase';
import ExpansionIcon from '@/components/ui/ExpansionIcon';

export default function FarmingRoutes() {
  const { dbService } = useDatabase();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpansions, setSelectedExpansions] = useState<string[]>([]);
  const [farmingRoutes, setFarmingRoutes] = useState<FarmItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    if (!dbService) return;
    try {
      setIsLoading(true);
      setError(null);
      
      // Cargar todos los farms y filtrar solo los aprobados
      const allRoutes = await dbService.getAllFarms();
      const approvedRoutes = allRoutes.filter((route: FarmItem) => route.status === 'approved');
      setFarmingRoutes(approvedRoutes);
    } catch {
      setError('Error al cargar las rutas desde la base de datos');
    } finally {
      setIsLoading(false);
    }
  }, [dbService]);

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
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors duration-200"
                >
                  Limpiar
                </button>
              )}
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
                      <p className="text-gray-400 text-sm">Tiempo</p>
                      <p className="text-blue-400 font-semibold text-lg">{route.estimatedTime}</p>
                    </div>
                  </div>

                  {/* Oro - solo si tiene valor */}
                                {route.estimatedGold && route.estimatedGold.trim() && (
                <div className="flex items-center gap-3">
                  <Image 
                    src="/images/expansions/Gold.png" 
                    alt="Gold"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  <div>
                    <p className="text-gray-400 text-sm">Oro/Hora</p>
                    <p className="text-yellow-400 font-semibold text-lg">{formatGoldDisplay(route.estimatedGold)}</p>
                  </div>
                </div>
              )}

                                     {/* Spirit Shards - solo si tiene valor */}
                   {route.estimatedSpirit && route.estimatedSpirit.trim() && (
                     <div className="flex items-center gap-3">
                       <Image 
                         src="/images/expansions/Spirit_Shard.png" 
                         alt="Spirit Shard"
                         width={24}
                         height={24}
                         className="w-6 h-6"
                       />
                       <div>
                         <p className="text-gray-400 text-sm">Spirit Shards</p>
                         <p className="text-blue-400 font-semibold text-lg">{route.estimatedSpirit}/h</p>
                       </div>
                     </div>
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
                Planifica tus sesiones de farming según los eventos y metas diarias del juego.
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