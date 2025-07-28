'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import { Timer, Star, Clock, CheckCircle, Circle } from 'lucide-react';
import { useDatabase, FarmItem } from '@/hooks/useDatabase';
import ExpansionIcon from '@/components/ui/ExpansionIcon';

interface TimerEvent {
  id: string;
  name: string;
  time: string;
  days: string[];
  nextOccurrence: Date;
  timeRemaining: string;
}

export default function DailyRoutine() {
  const { dbService } = useDatabase();
  const [farms, setFarms] = useState<FarmItem[]>([]);
  const [selectedFarms, setSelectedFarms] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

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

  const [timers, setTimers] = useState<TimerEvent[]>([
    {
      id: '1',
      name: 'Reset Diario',
      time: '19:00',
      days: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
      nextOccurrence: new Date(),
      timeRemaining: ''
    },
    {
      id: '2',
      name: 'Reset Semanal',
      time: '02:30',
      days: ['Lunes'],
      nextOccurrence: new Date(),
      timeRemaining: ''
    }
  ]);

  // Calcular próxima ocurrencia y tiempo restante
  const calculateNextOccurrence = useCallback((time: string, days: string[]) => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    // Convertir hora de Colombia (UTC-5) a hora local del usuario
    const colombiaTime = new Date();
    colombiaTime.setHours(hours, minutes, 0, 0);
    
    // Colombia está en UTC-5, así que agregamos 5 horas para obtener UTC
    const utcTime = new Date(colombiaTime.getTime() + (5 * 60 * 60 * 1000));
    
    // Convertir UTC a hora local del usuario
    const localTime = new Date(utcTime.getTime() - (now.getTimezoneOffset() * 60 * 1000));
    
    const nextDate = new Date();
    nextDate.setHours(localTime.getHours(), localTime.getMinutes(), 0, 0);
    
    // Si ya pasó hoy, buscar el próximo día
    if (nextDate <= now) {
      nextDate.setDate(nextDate.getDate() + 1);
    }
    
    // Buscar el próximo día válido
    const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    while (!days.includes(dayNames[nextDate.getDay()])) {
      nextDate.setDate(nextDate.getDate() + 1);
    }
    
    return nextDate;
  }, []);

  const formatTimeRemaining = useCallback((targetDate: Date) => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();
    
    if (diff <= 0) return '¡Ahora!';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  }, []);

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

  // Inicializar timers solo una vez
  useEffect(() => {
    const updatedTimers = timers.map(timer => ({
      ...timer,
      nextOccurrence: calculateNextOccurrence(timer.time, timer.days)
    }));
    setTimers(updatedTimers);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculateNextOccurrence]);

  // Actualizar timers cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prevTimers => 
        prevTimers.map(timer => ({
          ...timer,
          timeRemaining: formatTimeRemaining(timer.nextOccurrence)
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [formatTimeRemaining]);

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
      
      // console.log(`⏰ Parsing time "${timeStr}":`, { parts, hours, minutes, seconds, totalMinutes });
      
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
  console.log('🎯 FARMS SELECCIONADOS:', selectedFarmsData.map(farm => ({
    name: farm.name,
    time: farm.estimatedTime,
    gold: farm.estimatedGold,
    spirit: farm.estimatedSpirit,
    spiritType: typeof farm.estimatedSpirit
  })));
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

  // Debug: totales finales
  console.log('📊 TOTALES FINALES:', {
    farms: selectedFarmsCount,
    timeMinutes: totalEstimatedTime,
    timeFormatted: formatMinutesToReadable(totalEstimatedTime),
    spiritShards: Math.round(totalSpiritShards),
    goldCopper: Math.round(totalEstimatedGold),
    goldFormatted: formatGoldTotal(Math.round(totalEstimatedGold))
  });

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
            Rutina Diaria
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            Selecciona tus farms favoritos y mantén un seguimiento de eventos importantes
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Timers de Eventos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-1"
          >
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <Timer className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Eventos Importantes</h2>
              </div>

              <div className="space-y-4">
                {timers.map((timer) => (
                  <div key={timer.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">{timer.name}</h3>
                    </div>
                    
                    <div className="bg-gray-600 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {timer.timeRemaining}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Selección de Farms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="xl:col-span-3"
          >
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-600 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-blue-400" />
                  <h2 className="text-xl font-bold text-white">Selecciona tus Farms</h2>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">
                    {selectedFarmsCount} seleccionados
                  </div>
                  <div className="text-gray-400 text-sm">
                    Tiempo estimado: {formatMinutesToReadable(totalEstimatedTime)}
                  </div>
                </div>
              </div>

              {/* Lista de farms seleccionables */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                {farms.map((farm) => (
                  <motion.div
                    key={farm.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 p-6 px-8 border ${
                      selectedFarms.has(farm.id)
                        ? 'border-blue-400 ring-2 ring-blue-400/30 shadow-blue-500/25 transform scale-105'
                        : 'border-gray-600 hover:border-blue-500/50 hover:shadow-2xl hover:transform hover:scale-[1.02]'
                    }`}
                    onClick={() => toggleFarmSelection(farm.id)}
                  >
                    {/* Indicador de selección absoluto */}
                    <div className={`absolute top-3 right-3 transition-all duration-300 ${
                      selectedFarms.has(farm.id) ? 'opacity-100 scale-110' : 'opacity-60 hover:opacity-100'
                    }`}>
                      {selectedFarms.has(farm.id) ? (
                        <div className="bg-blue-500 rounded-full p-1">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 hover:text-blue-400" />
                      )}
                    </div>

                    {/* Header de la tarjeta */}
                    <div className="mb-4">
                      <h3 className="text-white font-bold text-lg mb-2 pr-8">{farm.name}</h3>
                      <div className="flex gap-1 flex-wrap">
                        {(Array.isArray(farm.expansion) ? farm.expansion : [farm.expansion]).map((exp) => (
                          <div key={exp} className="relative">
                            <ExpansionIcon expansion={exp} size="md" variant="compact" />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Descripción */}
                    <div className="mb-4">
                      <p className="text-gray-300 text-sm leading-relaxed">{farm.description}</p>
                    </div>
                    
                    {/* Estadísticas en grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {/* Tiempo - siempre se muestra */}
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span className="text-blue-300 font-medium">{farm.estimatedTime}</span>
                      </div>
                      
                      {/* Oro - solo si tiene valor */}
                      {farm.estimatedGold && farm.estimatedGold.trim() && (
                        <div className={`bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 flex items-center gap-2 ${
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
                        <div className={`bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 flex items-center gap-2 ${
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

              {/* Mensaje cuando no hay farms */}
              {farms.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="bg-gray-700 rounded-lg p-8">
                    <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No hay farms disponibles
                    </h3>
                    <p className="text-gray-400 mb-4">
                      No hay farms creados.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Resumen de Rutina */}
              {selectedFarmsCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-gradient-to-r from-blue-900/50 to-slate-800/50 rounded-xl p-6 border border-blue-400/40 shadow-2xl backdrop-blur-sm"
                >
                  <h3 className="font-bold text-xl mb-4 text-center bg-gradient-to-r from-blue-400 to-slate-400 bg-clip-text text-transparent">Tu Rutina Diaria</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 text-center">
                    <div>
                      <div className="text-xl font-bold text-blue-400">{selectedFarmsCount}</div>
                      <div className="text-gray-400 text-sm">Farms</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-400">{formatMinutesToReadable(totalEstimatedTime)}</div>
                      <div className="text-gray-400 text-sm">Tiempo total</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-2">
                        <Image 
                          src="/images/expansions/Gold.png" 
                          alt="Gold"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                        <div className="text-xl font-bold text-yellow-400 whitespace-nowrap overflow-hidden">
                          {formatGoldTotal(Math.round(totalEstimatedGold))}
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm">Oro</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-2">
                        <Image 
                          src="/images/expansions/Spirit_Shard.png" 
                          alt="Spirit Shard"
                          width={20}
                          height={20}
                          className="w-5 h-5"
                        />
                        <div className="text-xl font-bold text-blue-400">
                          {Math.round(totalSpiritShards)}
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm">SS</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-400">
                        {Math.round((selectedFarmsCount / farms.length) * 100)}%
                      </div>
                      <div className="text-gray-400 text-sm">Completado</div>
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