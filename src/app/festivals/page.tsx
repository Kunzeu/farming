'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import { 
  Calendar, 
  Star, 
  Coins, 
  Clock,
  TrendingUp,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { festivalDates, getFestivalStatus } from '@/lib/festival-dates';

const festivals = [
  {
    id: 'lunar',
    name: 'Festival de Año Nuevo Lunar',
    description: 'La celebración del año nuevo en el calendario Canthan',
    icon: '🏮',
    color: 'from-red-500 to-yellow-600',
    status: getFestivalStatus(festivalDates.lunar.startDate, festivalDates.lunar.endDate),
    startDate: festivalDates.lunar.startDateFormatted,
    endDate: festivalDates.lunar.endDateFormatted,
    features: [
      'Lucky Envelopes',
      'Essence of Luck',
      'Dragon Ball Arena',
      'Fireworks'
    ],
    estimatedGoldPerHour: 18,
    difficulty: 'Fácil',
    timeRequired: '2-3 horas',
    path: '/festivals/lunar'
  },
  {
    id: 'sab',
    name: 'Super Adventure Festival',
    description: 'La aventura pixelada en el mundo de Super Adventure Box',
    icon: '🎮',
    color: 'from-yellow-500 to-green-600',
    status: getFestivalStatus(festivalDates.sab.startDate, festivalDates.sab.endDate),
    startDate: festivalDates.sab.startDateFormatted,
    endDate: festivalDates.sab.endDateFormatted,
    features: [
      'Bauble Bubbles',
      'SAB Tokens',
      'World 1 & 2 Challenges',
      'Holographic Weapons'
    ],
    estimatedGoldPerHour: 14,
    difficulty: 'Medio',
    timeRequired: '3-4 horas',
    path: '/festivals/sab'
  },
  {
    id: 'dragon-bash',
    name: 'Dragon Bash',
    description: 'Festival de verano celebrando la resistencia contra los Elder Dragons',
    icon: '🐉',
    color: 'from-purple-500 to-pink-600',
    status: getFestivalStatus(festivalDates['dragon-bash'].startDate, festivalDates['dragon-bash'].endDate),
    startDate: festivalDates['dragon-bash'].startDateFormatted,
    endDate: festivalDates['dragon-bash'].endDateFormatted,
    features: [
      'Holographic Dragon Minions',
      'Racing Events',
      'Festival Tokens',
      'Dragon-themed Rewards'
    ],
    estimatedGoldPerHour: 12,
    difficulty: 'Fácil',
    timeRequired: '2-3 horas',
    path: '/festivals/dragon-bash'
  },
  {
    id: 'four-winds',
    name: 'Festival de los Cuatro Vientos',
    description: 'Festival de verano con carreras de monturas y aventuras',
    icon: '🪂',
    color: 'from-green-500 to-blue-600',
    status: getFestivalStatus(festivalDates['four-winds'].startDate, festivalDates['four-winds'].endDate),
    startDate: festivalDates['four-winds'].startDateFormatted,
    endDate: festivalDates['four-winds'].endDateFormatted,
    features: [
      'Mount Races',
      'Boss Blitz',
      'Queen\'s Gauntlet',
      'Scavenger Hunts'
    ],
    estimatedGoldPerHour: 10,
    difficulty: 'Medio',
    timeRequired: '3-4 horas',
    path: '/festivals/four-winds'
  },
  {
    id: 'halloween',
    name: 'Festival de Halloween',
    description: 'El terrorífico festival de Mad King Thorn',
    icon: '🎃',
    color: 'from-orange-500 to-red-600',
    status: getFestivalStatus(festivalDates.halloween.startDate, festivalDates.halloween.endDate),
    startDate: festivalDates.halloween.startDateFormatted,
    endDate: festivalDates.halloween.endDateFormatted,
    features: [
      'Trick-or-Treat Bags',
      'Candy Corn',
      'Mad King\'s Labyrinth',
      'Clock Tower Puzzle'
    ],
    estimatedGoldPerHour: 15,
    difficulty: 'Fácil',
    timeRequired: '2-3 horas',
    path: '/festivals/halloween'
  },
  {
    id: 'wintersday',
    name: 'Wintersday',
    description: 'Festival de invierno celebrando el año nuevo en el calendario Mouvelian',
    icon: '❄️',
    color: 'from-blue-500 to-cyan-600',
    status: getFestivalStatus(festivalDates.wintersday.startDate, festivalDates.wintersday.endDate),
    startDate: festivalDates.wintersday.startDateFormatted,
    endDate: festivalDates.wintersday.endDateFormatted,
    features: [
      'Wintersday Gifts',
      'Winter Wonderland',
      'Bell Choir Ensemble',
      'Toypocalypse'
    ],
    estimatedGoldPerHour: 20,
    difficulty: 'Fácil',
    timeRequired: '2-3 horas',
    path: '/festivals/wintersday'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-600 text-white';
    case 'upcoming':
      return 'bg-blue-600 text-white';
    case 'ended':
      return 'bg-gray-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Activo';
    case 'upcoming':
      return 'Próximo';
    case 'ended':
      return 'Finalizado';
    default:
      return 'Desconocido';
  }
};

export default function FestivalsPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <Calendar className="w-8 h-8 mr-3 text-purple-400" />
              Festivales de Guild Wars 2
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Calculadoras y guías específicas para maximizar tus ganancias durante los festivales anuales
            </p>
          </motion.div>

          {/* Festivales Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {festivals.map((festival, index) => (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group"
              >
                <Link href={festival.path}>
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${festival.color} rounded-lg flex items-center justify-center text-2xl`}>
                        {festival.icon}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(festival.status)}`}>
                        {getStatusLabel(festival.status)}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                      {festival.name}
                    </h3>

                    {/* Dates */}
                    <div className="flex items-center gap-2 mb-6">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-300 text-sm">
                        {festival.startDate} - {festival.endDate}
                      </span>
                    </div>

                    {/* CTA */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-400 text-sm font-semibold">
                          Ver Calculadora
                        </span>
                        <TrendingUp className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Información General */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 space-y-8"
          >
            {/* ¿Qué son los Festivales? */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Info className="w-6 h-6 mr-3 text-blue-400" />
                ¿Qué son los Festivales?
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Los festivales en Guild Wars 2 son celebraciones estacionales que ocurren durante todo el año. 
                Cada festival tiene su propia temática, actividades únicas y recompensas especiales. 
                Estos eventos suelen durar aproximadamente 3 semanas y ofrecen oportunidades únicas para 
                farming y obtención de items exclusivos.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Actividades Únicas</h3>
                  <p className="text-gray-300 text-sm">
                    Cada festival incluye actividades específicas como puzzles, carreras, combates y eventos especiales.
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Items Exclusivos</h3>
                  <p className="text-gray-300 text-sm">
                    Skins, armas, monturas y otros items que solo están disponibles durante el festival.
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Recompensas Temporales</h3>
                  <p className="text-gray-300 text-sm">
                    Materiales, monedas y otros recursos que pueden venderse por oro en el Trading Post.
                  </p>
                </div>
              </div>
            </div>

            {/* Estrategias de Farming */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
                Estrategias de Farming en Festivales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">Durante el Festival</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Participa en Actividades</h4>
                        <p className="text-gray-300 text-sm">Completa las actividades diarias para obtener recompensas consistentes.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Farming Intensivo</h4>
                        <p className="text-gray-300 text-sm">Dedica tiempo a las actividades más rentables del festival.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Compra Anticipada</h4>
                        <p className="text-gray-300 text-sm">Compra items cuando los precios estén bajos al inicio.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">Después del Festival</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Venta Estratégica</h4>
                        <p className="text-gray-300 text-sm">Espera a que los precios suban después del festival.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Almacenamiento</h4>
                        <p className="text-gray-300 text-sm">Guarda items para venderlos en el próximo festival.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Análisis de Mercado</h4>
                        <p className="text-gray-300 text-sm">Monitorea los precios para identificar el mejor momento de venta.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cómo Sacar Oro en Festivales */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Coins className="w-6 h-6 mr-3 text-yellow-400" />
                ¿Cómo Sacar Oro en Festivales?
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Los festivales son una de las mejores oportunidades para generar oro en Guild Wars 2. 
                Cada festival tiene métodos específicos de farming que pueden generar entre 10-20g por hora 
                dependiendo de tu eficiencia y el festival en cuestión.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">Métodos Principales</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Farming de Actividades</h4>
                        <p className="text-gray-300 text-sm">Participa repetidamente en las actividades más rentables del festival.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Apertura de Contenedores</h4>
                        <p className="text-gray-300 text-sm">Abre bolsas, sobres y otros contenedores para obtener items valiosos.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Venta de Materiales</h4>
                        <p className="text-gray-300 text-sm">Vende materiales específicos del festival en el Trading Post.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">Estrategias Avanzadas</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Compra y Venta</h4>
                        <p className="text-gray-300 text-sm">Compra items baratos durante el festival y véndelos después.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Almacenamiento</h4>
                        <p className="text-gray-300 text-sm">Guarda items para venderlos en el próximo festival.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Múltiples Personajes</h4>
                        <p className="text-gray-300 text-sm">Usa varios personajes para maximizar las recompensas diarias.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                <h4 className="text-yellow-300 font-semibold mb-2">💡 Consejo Pro</h4>
                <p className="text-gray-300 text-sm">
                  Los festivales más rentables suelen ser Halloween (Trick-or-Treat Bags) y Wintersday (Wintersday Gifts). 
                  Estos pueden generar 15-20g por hora con farming eficiente. Usa nuestras calculadoras específicas 
                  para determinar la rentabilidad exacta de cada actividad.
                </p>
              </div>
            </div>

            {/* Consejos Generales */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Star className="w-6 h-6 mr-3 text-yellow-400" />
                Consejos Generales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-semibold">Planificación</h4>
                      <p className="text-gray-300 text-sm">Investiga los festivales con anticipación y prepara tus personajes.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-semibold">Diversificación</h4>
                      <p className="text-gray-300 text-sm">No te enfoques solo en una actividad, explora todas las opciones.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-semibold">Comunidad</h4>
                      <p className="text-gray-300 text-sm">Únete a grupos organizados para maximizar la eficiencia.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-semibold">Disfruta</h4>
                      <p className="text-gray-300 text-sm">Recuerda que los festivales están diseñados para ser divertidos.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
} 