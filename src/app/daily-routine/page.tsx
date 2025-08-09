'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import { Star, Clock, CheckCircle, Circle } from 'lucide-react';
import { useDatabase, FarmItem } from '@/hooks/useDatabase';
import ExpansionIcon from '@/components/ui/ExpansionIcon';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function DailyRoutine() {
  usePageTitle('Daily Routine');
  
  const { dbService } = useDatabase();
  const [farms, setFarms] = useState<FarmItem[]>([]);
  const [selectedFarms, setSelectedFarms] = useState<Set<string>>(new Set());

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

  // Cargar farms desde la base de datos
  useEffect(() => {
    const loadFarms = async () => {
      if (!dbService) return;
      try {
        const farms = await dbService.getAllFarms();
        setFarms(farms);
      } catch (error) {
        console.error('Error loading farms:', error);
        setFarms([]);
      }
    };
    loadFarms();
  }, [dbService]);

  const toggleFarmSelection = (farmId: string) => {
    setSelectedFarms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(farmId)) {
        newSet.delete(farmId);
      } else {
        newSet.add(farmId);
      }
      return newSet;
    });
  };

  // Función para convertir HH:MM:SS a minutos totales
  const parseTimeToMinutes = (timeStr: string): number => {
    // Formato esperado: "02:00:00" o "01:30:00"
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      const hours = parseInt(parts[0]) || 0;
      const minutes = parseInt(parts[1]) || 0;
      const seconds = parseInt(parts[2]) || 0;
      const totalMinutes = hours * 60 + minutes + Math.round(seconds / 60);
      
      return totalMinutes;
    }
    return 0;
  };

  // Función para convertir minutos a formato legible
  const formatMinutesToReadable = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };

  const selectedFarmsCount = selectedFarms.size;
  
  // Debug: ver farms seleccionados
  const selectedFarmsData = Array.from(selectedFarms).map(id => farms.find(farm => farm.id === id)).filter(Boolean) as FarmItem[];
  const totalEstimatedTime = selectedFarmsData
    .reduce((total, farm) => {
      const timeInMinutes = parseTimeToMinutes(farm.estimatedTime);
      return total + timeInMinutes;
    }, 0);

  // Calcular Spirit Shards totales (valor directo, no multiplicado por tiempo)
  const totalSpiritShards = selectedFarmsData
    .reduce((total, farm) => {
      // Verificar si tiene Spirit Shards
      if (farm.estimatedSpirit && farm.estimatedSpirit.trim()) {
        const spiritValue = parseInt(farm.estimatedSpirit);
        return total + (isNaN(spiritValue) ? 0 : spiritValue);
      }
      return total;
    }, 0);

  // Calcular oro estimado total (valor directo, no multiplicado por tiempo)
  const totalEstimatedGold = selectedFarmsData
    .reduce((total, farm) => {
      if (farm.estimatedGold && farm.estimatedGold.trim()) {
        // Si está en formato GW2, extraer el valor en cobre
        if (farm.estimatedGold.includes('g') || farm.estimatedGold.includes('s') || farm.estimatedGold.includes('c')) {
          // Extraer oro, plata y cobre del formato GW2
          const goldMatch = farm.estimatedGold.match(/(\d+)g/);
          const silverMatch = farm.estimatedGold.match(/(\d+)s/);
          const copperMatch = farm.estimatedGold.match(/(\d+)c/);
          
          const gold = goldMatch ? parseInt(goldMatch[1]) : 0;
          const silver = silverMatch ? parseInt(silverMatch[1]) : 0;
          const copper = copperMatch ? parseInt(copperMatch[1]) : 0;
          
          return total + (gold * 10000) + (silver * 100) + copper;
        } else {
          // Si es solo números, asumir que es cobre
          const copperValue = parseInt(farm.estimatedGold);
          return total + (isNaN(copperValue) ? 0 : copperValue);
        }
      }
      return total;
    }, 0);

  // Formatear oro total a formato legible
  const formatGoldTotal = (totalCopper: number): string => {
    const gold = Math.floor(totalCopper / 10000);
    const silver = Math.floor((totalCopper % 10000) / 100);
    const copper = totalCopper % 100;
    
    // Siempre mostrar formato completo con ceros a la izquierda
    const goldStr = gold.toString();
    const silverStr = silver.toString().padStart(2, '0');
    const copperStr = copper.toString().padStart(2, '0');
    
    return `${goldStr}g ${silverStr}s ${copperStr}c`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header mejorado */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent mb-4">
            Daily Routine
          </h1>
          <p className="text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
            Select your favorite farms and create your perfect daily routine
          </p>
          
          {/* Información de reset estática */}
          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Daily Reset: 19:00 Colombia</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Weekly Reset: 02:30 Colombia (Monday)</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {/* Selección de Farms mejorada */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1"
          >
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Star className="w-6 h-6 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Select your Farms</h2>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold text-lg">
                    {selectedFarmsCount} selected
                  </div>
                  <div className="text-gray-400 text-sm">
                    Estimated time: {formatMinutesToReadable(totalEstimatedTime)}
                  </div>
                </div>
              </div>

              {/* Lista de farms seleccionables mejorada */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {farms.map((farm) => (
                  <motion.div
                    key={farm.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 p-6 border ${
                      selectedFarms.has(farm.id)
                        ? 'border-blue-400 ring-2 ring-blue-400/30 shadow-blue-500/25 transform scale-105'
                        : 'border-gray-600 hover:border-blue-500/50 hover:shadow-2xl hover:transform hover:scale-[1.02]'
                    }`}
                    onClick={() => toggleFarmSelection(farm.id)}
                  >
                    {/* Indicador de selección mejorado */}
                    <div className={`absolute top-4 right-4 transition-all duration-300 ${
                      selectedFarms.has(farm.id) ? 'opacity-100 scale-110' : 'opacity-60 hover:opacity-100'
                    }`}>
                      {selectedFarms.has(farm.id) ? (
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-1.5 shadow-lg">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 hover:text-blue-400" />
                      )}
                    </div>

                    {/* Header de la tarjeta mejorado */}
                    <div className="mb-4">
                      <h3 className="text-white font-bold text-lg mb-3 pr-12">{farm.name}</h3>
                      <div className="flex gap-1 flex-wrap">
                        {(Array.isArray(farm.expansion) ? farm.expansion : [farm.expansion]).map((exp) => (
                          <div key={exp} className="relative">
                            <ExpansionIcon expansion={exp} size="md" variant="compact" />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Descripción mejorada */}
                    <div className="mb-4">
                      <p className="text-gray-300 text-sm leading-relaxed">{farm.description}</p>
                    </div>
                    
                    {/* Estadísticas en grid mejoradas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {/* Tiempo - siempre se muestra */}
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span className="text-blue-300 font-medium">{farm.estimatedTime}</span>
                      </div>
                      
                      {/* Oro - solo si tiene valor */}
                      {farm.estimatedGold && farm.estimatedGold.trim() && (
                        <div className={`bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-center gap-2 ${
                          formatGoldDisplay(farm.estimatedGold).length > 8 ? 'sm:col-span-2' : ''
                        }`}>
                          <Image 
                            src="/images/expansions/Gold.png" 
                            alt="Gold"
                            width={16}
                            height={16}
                            className="w-4 h-4 flex-shrink-0"
                          />
                          <span className="text-yellow-300 font-medium truncate">{formatGoldDisplay(farm.estimatedGold)}</span>
                        </div>
                      )}
                      
                      {/* Spirit Shards - solo si tiene valor */}
                      {farm.estimatedSpirit && farm.estimatedSpirit.trim() && (
                        <div className={`bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center gap-2 ${
                          farm.estimatedSpirit.length > 6 ? 'sm:col-span-2' : ''
                        }`}>
                          <Image 
                            src="/images/expansions/Spirit_Shard.png" 
                            alt="Spirit Shard"
                            width={16}
                            height={16}
                            className="w-4 h-4 flex-shrink-0"
                          />
                          <span className="text-blue-300 font-medium truncate">{farm.estimatedSpirit}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mensaje cuando no hay farms mejorado */}
              {farms.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-12 border border-gray-600/50">
                    <Clock className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold text-white mb-3">
                      No farms available
                    </h3>
                    <p className="text-gray-400 text-lg">
                      No farms have been created yet.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Resumen de Rutina mejorado */}
              {selectedFarmsCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/30 shadow-2xl"
                >
                  <h3 className="font-bold text-2xl mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Your Daily Routine Summary
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 text-center">
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/50">
                      <div className="text-2xl font-bold text-blue-400 mb-1">{selectedFarmsCount}</div>
                      <div className="text-gray-400 text-sm">Farms</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/50">
                      <div className="text-2xl font-bold text-blue-400 mb-1">{formatMinutesToReadable(totalEstimatedTime)}</div>
                      <div className="text-gray-400 text-sm">Total time</div>
                    </div>
                                         <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/50">
                       <div className="flex items-center justify-center gap-2 mb-1">
                         <Image 
                           src="/images/expansions/Gold.png" 
                           alt="Gold"
                           width={20}
                           height={20}
                           className="w-5 h-5"
                         />
                         <div className="text-xl font-bold text-yellow-400 whitespace-nowrap">
                           {formatGoldTotal(Math.round(totalEstimatedGold))}
                         </div>
                       </div>
                       <div className="text-gray-400 text-sm">Gold</div>
                     </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/50">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Image 
                          src="/images/expansions/Spirit_Shard.png" 
                          alt="Spirit Shard"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                        <div className="text-2xl font-bold text-blue-400">
                          {Math.round(totalSpiritShards)}
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm">Spirit Shards</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-600/50">
                      <div className="text-2xl font-bold text-blue-400 mb-1">
                        {Math.round((selectedFarmsCount / farms.length) * 100)}%
                      </div>
                      <div className="text-gray-400 text-sm">Completed</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 