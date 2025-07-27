'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function Events() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedMap, setSelectedMap] = useState<string>('all');

  // Datos de ejemplo de eventos
  const worldEvents = [
    {
      id: '1',
      name: 'Tequatl the Sunless',
      map: 'Sparkfly Fen',
      description: 'Evento mundial épico que requiere coordinación de múltiples jugadores',
      difficulty: 'hard',
      rewards: ['Rare materials', 'Ascended gear', 'Gold'],
      schedule: [
        { time: '00:00', timezone: 'UTC' },
        { time: '03:00', timezone: 'UTC' },
        { time: '06:00', timezone: 'UTC' },
        { time: '09:00', timezone: 'UTC' },
        { time: '12:00', timezone: 'UTC' },
        { time: '15:00', timezone: 'UTC' },
        { time: '18:00', timezone: 'UTC' },
        { time: '21:00', timezone: 'UTC' },
      ],
      estimatedGoldPerHour: 25,
      requirements: ['Nivel 80', 'Build optimizado', 'Coordinación de grupo'],
      status: 'active' as const
    },
    {
      id: '2',
      name: 'Triple Trouble',
      map: 'Bloodtide Coast',
      description: 'Evento de tres wurms que requiere tres comandantes coordinados',
      difficulty: 'hard',
      rewards: ['Ascended materials', 'Rare skins', 'Significant gold'],
      schedule: [
        { time: '01:00', timezone: 'UTC' },
        { time: '04:00', timezone: 'UTC' },
        { time: '07:00', timezone: 'UTC' },
        { time: '10:00', timezone: 'UTC' },
        { time: '13:00', timezone: 'UTC' },
        { time: '16:00', timezone: 'UTC' },
        { time: '19:00', timezone: 'UTC' },
        { time: '22:00', timezone: 'UTC' },
      ],
      estimatedGoldPerHour: 30,
      requirements: ['Nivel 80', 'Comandante', 'Build optimizado'],
      status: 'preparation' as const
    },
    {
      id: '3',
      name: 'Chak Gerent',
      map: 'Tangled Depths',
      description: 'Evento de HoT que requiere coordinación de cuatro lanes',
      difficulty: 'hard',
      rewards: ['Chak eggs', 'Rare materials', 'Gold'],
      schedule: [
        { time: '02:00', timezone: 'UTC' },
        { time: '05:00', timezone: 'UTC' },
        { time: '08:00', timezone: 'UTC' },
        { time: '11:00', timezone: 'UTC' },
        { time: '14:00', timezone: 'UTC' },
        { time: '17:00', timezone: 'UTC' },
        { time: '20:00', timezone: 'UTC' },
        { time: '23:00', timezone: 'UTC' },
      ],
      estimatedGoldPerHour: 20,
      requirements: ['Nivel 80', 'HoT expansion', 'Build optimizado'],
      status: 'warmup' as const
    },
    {
      id: '4',
      name: 'Dragon\'s Stand',
      map: 'Dragon\'s Stand',
      description: 'Meta evento de HoT que culmina en la batalla contra Mordremoth',
      difficulty: 'medium',
      rewards: ['Bladed armor', 'Rare materials', 'Gold'],
      schedule: [
        { time: '00:30', timezone: 'UTC' },
        { time: '03:30', timezone: 'UTC' },
        { time: '06:30', timezone: 'UTC' },
        { time: '09:30', timezone: 'UTC' },
        { time: '12:30', timezone: 'UTC' },
        { time: '15:30', timezone: 'UTC' },
        { time: '18:30', timezone: 'UTC' },
        { time: '21:30', timezone: 'UTC' },
      ],
      estimatedGoldPerHour: 15,
      requirements: ['Nivel 80', 'HoT expansion'],
      status: 'active' as const
    },
    {
      id: '5',
      name: 'Octovine',
      map: 'Auric Basin',
      description: 'Meta evento de HoT que requiere coordinación de cuatro grupos',
      difficulty: 'medium',
      rewards: ['Auric weapons', 'Rare materials', 'Gold'],
      schedule: [
        { time: '01:30', timezone: 'UTC' },
        { time: '04:30', timezone: 'UTC' },
        { time: '07:30', timezone: 'UTC' },
        { time: '10:30', timezone: 'UTC' },
        { time: '13:30', timezone: 'UTC' },
        { time: '16:30', timezone: 'UTC' },
        { time: '19:30', timezone: 'UTC' },
        { time: '22:30', timezone: 'UTC' },
      ],
      estimatedGoldPerHour: 18,
      requirements: ['Nivel 80', 'HoT expansion'],
      status: 'success' as const
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'preparation':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case 'warmup':
        return <Clock className="w-5 h-5 text-blue-400" />;
      case 'success':
        return <Star className="w-5 h-5 text-purple-400" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-900/20';
      case 'preparation':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'warmup':
        return 'text-blue-400 bg-blue-900/20';
      case 'success':
        return 'text-purple-400 bg-purple-900/20';
      case 'fail':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'preparation':
        return 'Preparación';
      case 'warmup':
        return 'Calentamiento';
      case 'success':
        return 'Completado';
      case 'fail':
        return 'Fallido';
      default:
        return 'Desconocido';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400 bg-green-900/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'hard':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Medio';
      case 'hard':
        return 'Difícil';
      default:
        return 'Desconocido';
    }
  };

  const filteredEvents = worldEvents.filter(event => 
    selectedMap === 'all' || event.map === selectedMap
  );

  const maps = ['all', ...Array.from(new Set(worldEvents.map(event => event.map)))];

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
            Eventos Mundiales
          </h1>
          <p className="text-xl text-gray-300">
            Información en tiempo real sobre eventos mundiales de Guild Wars 2
          </p>
        </motion.div>

        {/* Current Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 inline-block">
            <p className="text-gray-400 text-sm">Hora Actual (UTC)</p>
            <p className="text-2xl font-bold text-white">
              {currentTime.toLocaleTimeString('en-US', { 
                timeZone: 'UTC',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </p>
          </div>
        </motion.div>

        {/* Map Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {maps.map((map) => (
              <button
                key={map}
                onClick={() => setSelectedMap(map)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                  selectedMap === map
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {map === 'all' ? 'Todos los Mapas' : map}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Events Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all duration-200"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">{event.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(event.status)}
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(event.status)}`}>
                    {getStatusLabel(event.status)}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-gray-400 text-xs">Mapa</p>
                    <p className="text-blue-400 font-semibold">{event.map}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-gray-400 text-xs">Oro/Hora</p>
                    <p className="text-yellow-400 font-semibold">{event.estimatedGoldPerHour}g</p>
                  </div>
                </div>
              </div>

              {/* Difficulty */}
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(event.difficulty)}`}>
                  {getDifficultyLabel(event.difficulty)}
                </span>
              </div>

              {/* Requirements */}
              <div className="mb-4">
                <p className="text-gray-400 text-xs mb-2">Requisitos:</p>
                <div className="flex flex-wrap gap-2">
                  {event.requirements.map((req, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                      {req}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rewards */}
              <div className="mb-4">
                <p className="text-gray-400 text-xs mb-2">Recompensas:</p>
                <div className="flex flex-wrap gap-2">
                  {event.rewards.map((reward, idx) => (
                    <span key={idx} className="px-2 py-1 bg-green-900/30 rounded text-xs text-green-300">
                      {reward}
                    </span>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <p className="text-gray-400 text-xs mb-2">Horarios (UTC):</p>
                <div className="grid grid-cols-4 gap-1">
                  {event.schedule.map((schedule, idx) => (
                    <span key={idx} className="text-xs text-gray-300 bg-gray-700 px-1 py-1 rounded text-center">
                      {schedule.time}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Consejos para Eventos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <Clock className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Puntualidad</h3>
              <p className="text-gray-400 text-sm">
                Llega 10-15 minutos antes del evento para asegurar tu lugar en el grupo.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <Users className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Coordinación</h3>
              <p className="text-gray-400 text-sm">
                Sigue las instrucciones del comandante y mantén la comunicación con el grupo.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <Star className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Builds</h3>
              <p className="text-gray-400 text-sm">
                Usa builds optimizadas para el evento específico y asegúrate de tener el equipo adecuado.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 