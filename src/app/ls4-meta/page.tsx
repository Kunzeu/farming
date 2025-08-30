'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import Image from 'next/image';
import { 
  MapPin, 
  Coins, 
  Clock, 
  TrendingUp,
  Star,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import Link from 'next/link';

const LS4MetaPage = () => {
  const { t } = useI18n();
  const [selectedMap, setSelectedMap] = useState<string>('grothmar');

  const ls4Maps = [
    {
      id: 'grothmar',
      name: 'Valle de Grothmar',
      description: 'Mapa principal de la Temporada 4 con eventos meta y nodos de recursos abundantes',
      volatileMagic: '15-25 por nodo',
      events: ['Meta del Dragón', 'Eventos de Branded', 'Nodos de Cristal'],
      bestTime: 'Cada 2 horas',
      difficulty: 'Fácil'
    },
    {
      id: 'jahai',
      name: 'Acantilados de Jahai',
      description: 'Mapa con eventos meta intensos y recompensas de Magia Volátil garantizadas',
      volatileMagic: '20-30 por evento',
      events: ['Meta de Joko', 'Eventos de Awakened', 'Cofres del Héroe'],
      bestTime: 'Cada 3 horas',
      difficulty: 'Medio'
    },
    {
      id: 'kourna',
      name: 'Dominios de Kourna',
      description: 'Mapa con eventos de guerra y recompensas masivas de Magia Volátil',
      volatileMagic: '25-40 por meta',
      events: ['Meta de la Guerra', 'Eventos de Inquest', 'Cofres de Victoria'],
      bestTime: 'Cada 4 horas',
      difficulty: 'Difícil'
    },
    {
      id: 'sandswept',
      name: 'Islas de Arena Barridas',
      description: 'Mapa con eventos de investigación y nodos especiales de Magia Volátil',
      volatileMagic: '10-20 por nodo',
      events: ['Meta de Investigación', 'Eventos de Inquest', 'Nodos de Arena'],
      bestTime: 'Cada 2.5 horas',
      difficulty: 'Medio'
    }
  ];

  const farmingTips = [
    {
      icon: Clock,
      title: 'Timing Perfecto',
      description: 'Los eventos meta ocurren en horarios específicos. Usa /wiki para ver los tiempos exactos.'
    },
    {
      icon: MapPin,
      title: 'Rutas Optimizadas',
      description: 'Planifica tu ruta para maximizar la Magia Volátil por hora de juego.'
    },
    {
      icon: Coins,
      title: 'Recompensas Garantizadas',
      description: 'Los eventos meta siempre otorgan Magia Volátil, independientemente de tu contribución.'
    },
    {
      icon: TrendingUp,
      title: 'Stack de Boosters',
      description: 'Combina boosters de experiencia y magia para maximizar las recompensas.'
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-4">
              <Link href="/crafting" className="mr-4 p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                <ArrowLeft className="w-6 h-6 text-white" />
              </Link>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <Image 
                  src="/images/expansions/volatile-magic.png" 
                  alt="LS4 Meta" 
                  width={32} 
                  height={32} 
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              LS4 Meta - Farming de Magia Volátil
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Guía completa para maximizar la obtención de Magia Volátil en los eventos meta de la Temporada 4 del Mundo Viviente
            </p>
          </motion.div>

          {/* Mapas LS4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center">
              <MapPin className="w-8 h-8 mr-3 text-purple-400" />
              Mapas de la Temporada 4
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ls4Maps.map((map) => (
                <div 
                  key={map.id}
                  className={`bg-gray-800/50 backdrop-blur-sm border rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                    selectedMap === map.id 
                      ? 'border-purple-500 bg-purple-900/20' 
                      : 'border-gray-700 hover:border-purple-500/50'
                  }`}
                  onClick={() => setSelectedMap(map.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{map.name}</h3>
                    <div className="flex items-center gap-2">
                      <Star className={`w-5 h-5 ${map.difficulty === 'Fácil' ? 'text-green-400' : map.difficulty === 'Medio' ? 'text-yellow-400' : 'text-red-400'}`} />
                      <span className="text-sm text-gray-400">{map.difficulty}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{map.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300 font-semibold">{map.volatileMagic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300">{map.bestTime}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <h4 className="text-white font-semibold mb-2">Eventos principales:</h4>
                    <div className="flex flex-wrap gap-2">
                      {map.events.map((event, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                          {event}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Consejos de Farming */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              💡 Consejos para Maximizar Magia Volátil
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {farmingTips.map((tip, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                      <tip.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-white font-semibold">{tip.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm">{tip.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Resumen de Recompensas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg p-8 border border-purple-500/30"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              🎯 Resumen de Recompensas por Hora
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                <h3 className="text-white font-semibold mb-2">Farming Pasivo</h3>
                <p className="text-2xl font-bold text-yellow-400">150-250 MV/h</p>
                <p className="text-gray-400 text-sm">Solo nodos de recursos</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                <h3 className="text-white font-semibold mb-2">Eventos Meta</h3>
                <p className="text-2xl font-bold text-purple-400">300-500 MV/h</p>
                <p className="text-gray-400 text-sm">Participando en metas</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                <h3 className="text-white font-semibold mb-2">Farming Intensivo</h3>
                <p className="text-2xl font-bold text-pink-400">500-800 MV/h</p>
                <p className="text-gray-400 text-sm">Combinando todo</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LS4MetaPage;
