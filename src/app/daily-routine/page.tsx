'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import { Timer, Star, Clock, CheckCircle, Circle } from 'lucide-react';
import { dbService, FarmItem } from '@/lib/database';
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
  const [selectedFarms, setSelectedFarms] = useState<FarmItem[]>([]);

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
      try {
        const farms = await dbService.getAllFarms();
        setSelectedFarms(farms);
      } catch (error) {
        console.error('Error loading farms:', error);
        setSelectedFarms([]);
      }
    };
    loadFarms();
  }, []);

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
    setSelectedFarms(prev => 
      prev.map(farm => 
        farm.id === farmId 
          ? { ...farm, selected: !farm.selected }
          : farm
      )
    );
  };

  const selectedFarmsCount = selectedFarms.filter(farm => farm.selected).length;
  const totalEstimatedTime = selectedFarms
    .filter(farm => farm.selected)
    .reduce((total, farm) => {
      const time = parseInt(farm.estimatedTime.split(' ')[0]);
      return total + time;
    }, 0);

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timers de Eventos */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-2 mb-6">
                <Timer className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Eventos Importantes</h2>
              </div>

              <div className="space-y-4">
                {timers.map((timer) => (
                  <div key={timer.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">{timer.name}</h3>
                    </div>
                    
                    <div className="bg-gray-600 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-purple-400">
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
            className="lg:col-span-2"
          >
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-purple-400" />
                  <h2 className="text-xl font-bold text-white">Selecciona tus Farms</h2>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">
                    {selectedFarmsCount} seleccionados
                  </div>
                  <div className="text-gray-400 text-sm">
                    Tiempo estimado: {totalEstimatedTime} min
                  </div>
                </div>
              </div>

              {/* Lista de farms seleccionables */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedFarms.map((farm) => (
                  <motion.div
                    key={farm.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-gray-700 rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 p-4 ${
                      farm.selected
                        ? 'ring-2 ring-purple-500 shadow-purple-500/20'
                        : 'hover:shadow-xl'
                    }`}
                    onClick={() => toggleFarmSelection(farm.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {farm.selected ? (
                          <CheckCircle className="w-5 h-5 text-purple-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-gray-400" />
                        )}
                        <h3 className="text-white font-semibold">{farm.name}</h3>
                      </div>
                      <ExpansionIcon expansion={farm.expansion} size="md" variant="compact" />
                    </div>
                    
                    <p className="text-gray-400 text-sm mb-3">{farm.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400">{farm.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400">{farm.estimatedGold}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mensaje cuando no hay farms */}
              {selectedFarms.length === 0 && (
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
                  className="mt-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg p-4 border border-purple-500/50"
                >
                  <h3 className="text-white font-semibold mb-2">Tu Rutina Diaria</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-purple-400">{selectedFarmsCount}</div>
                      <div className="text-gray-400 text-sm">Farms</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">{totalEstimatedTime}</div>
                      <div className="text-gray-400 text-sm">Minutos</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-400">
                        {Math.round(totalEstimatedTime / 60 * 25)}g
                      </div>
                      <div className="text-gray-400 text-sm">Estimado</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">
                        {Math.round((selectedFarmsCount / selectedFarms.length) * 100)}%
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