'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import Image from 'next/image';
import { 
  Gift, 
  ShoppingBag, 
  Users, 
  Clock,
  Star,
  Zap,
  ArrowLeft,
  Coins,
  Trophy,
  Calendar
} from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import Link from 'next/link';

const OtrosPage = () => {
  const { t } = useI18n();
  const [selectedMethod, setSelectedMethod] = useState<string>('events');

  const otherMethods = [
    {
      id: 'events',
      name: 'Eventos y Festivales',
      description: 'Eventos especiales que otorgan Magia Volátil como recompensa',
      volatileMagic: '50-200 por evento',
      frequency: 'Estacional',
      difficulty: 'Fácil',
      examples: ['Festival de los Cuatro Vientos', 'Halloween', 'Lunar New Year', 'Wintersday'],
      tips: ['Participa en todos los eventos', 'Completa las colecciones', 'Usa boosters de festival']
    },
    {
      id: 'trading',
      name: 'Trading Post',
      description: 'Compra y venta de materiales que otorgan Magia Volátil al reciclar',
      volatileMagic: '10-50 por material',
      frequency: 'Constante',
      difficulty: 'Medio',
      examples: ['Cristales de difluorita', 'Mineral de kralkatita', 'Aparatos de Inquest'],
      tips: ['Monitorea precios', 'Compra en momentos bajos', 'Recicla inteligentemente']
    },
    {
      id: 'achievements',
      name: 'Logros y Colecciones',
      description: 'Completar logros específicos otorga Magia Volátil como recompensa',
      volatileMagic: '100-500 por logro',
      frequency: 'Una vez',
      difficulty: 'Medio',
      examples: ['Colección de LS4', 'Logros de mapa', 'Colecciones de armas'],
      tips: ['Enfócate en logros de LS4', 'Completa colecciones', 'Usa guías de logros']
    },
    {
      id: 'dungeons',
      name: 'Mazmorras y Fractales',
      description: 'Mazmorras específicas y fractales que otorgan Magia Volátil',
      volatileMagic: '25-100 por run',
      frequency: 'Diario',
      difficulty: 'Difícil',
      examples: ['Fractales T4', 'Mazmorras de LS4', 'CMs de fractales'],
      tips: ['Forma grupo estable', 'Optimiza tu build', 'Practica las mecánicas']
    }
  ];

  const seasonalEvents = [
    {
      name: 'Festival de los Cuatro Vientos',
      volatileMagic: '150-300 MV',
      duration: '2 semanas',
      bestActivities: ['Carreras de globos', 'Colección de monedas', 'Eventos de guild'],
      color: 'text-blue-400'
    },
    {
      name: 'Halloween',
      volatileMagic: '200-400 MV',
      duration: '3 semanas',
      bestActivities: ['Laberinto de Mad King', 'Trick or Treat', 'Eventos de guild'],
      color: 'text-orange-400'
    },
    {
      name: 'Lunar New Year',
      volatileMagic: '100-250 MV',
      duration: '2 semanas',
      bestActivities: ['Festival de dragones', 'Colección de linternas', 'Eventos de guild'],
      color: 'text-red-400'
    },
    {
      name: 'Wintersday',
      volatileMagic: '180-350 MV',
      duration: '3 semanas',
      bestActivities: ['Toboganes de nieve', 'Colección de regalos', 'Eventos de guild'],
      color: 'text-cyan-400'
    }
  ];

  const tradingTips = [
    {
      icon: ShoppingBag,
      title: 'Análisis de Mercado',
      description: 'Monitorea los precios de materiales que otorgan Magia Volátil al reciclar.'
    },
    {
      icon: Coins,
      title: 'Timing de Compra',
      description: 'Compra materiales cuando los precios estén en su punto más bajo.'
    },
    {
      icon: Gift,
      title: 'Recompensas de Eventos',
      description: 'Participa en eventos para obtener materiales gratis que puedes reciclar.'
    },
    {
      icon: Users,
      title: 'Red de Comerciantes',
      description: 'Únete a comunidades de trading para obtener mejores precios y oportunidades.'
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
              <Link href="/trophy" className="mr-4 p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                <ArrowLeft className="w-6 h-6 text-white" />
              </Link>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg">
                <Image 
                  src="/images/expansions/volatile-magic.png" 
                  alt="Otros" 
                  width={32} 
                  height={32} 
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🎯 Otros Métodos - Farming de Magia Volátil
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Descubre todas las formas alternativas de obtener Magia Volátil: eventos, trading, logros y más
            </p>
          </motion.div>

          {/* Métodos Alternativos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center">
              <Gift className="w-8 h-8 mr-3 text-blue-400" />
              Métodos Alternativos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {otherMethods.map((method) => (
                <div 
                  key={method.id}
                  className={`bg-gray-800/50 backdrop-blur-sm border rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                    selectedMethod === method.id 
                      ? 'border-blue-500 bg-blue-900/20' 
                      : 'border-gray-700 hover:border-blue-500/50'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{method.name}</h3>
                    <div className="flex items-center gap-2">
                      <Star className={`w-5 h-5 ${method.difficulty === 'Fácil' ? 'text-green-400' : method.difficulty === 'Medio' ? 'text-yellow-400' : 'text-red-400'}`} />
                      <span className="text-sm text-gray-400">{method.difficulty}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{method.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300 font-semibold">{method.volatileMagic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300">{method.frequency}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Ejemplos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {method.examples.map((example, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-semibold mb-2">Consejos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {method.tips.map((tip, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-700/30 text-blue-300 text-xs rounded border border-blue-500/30">
                            {tip}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Eventos Estacionales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              🎉 Eventos Estacionales y Recompensas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {seasonalEvents.map((event, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 text-center">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Calendar className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{event.name}</h3>
                  <p className={`font-bold mb-1 ${event.color}`}>{event.volatileMagic}</p>
                  <p className="text-gray-400 text-sm mb-2">{event.duration}</p>
                  <div className="text-xs text-gray-300">
                    {event.bestActivities.slice(0, 2).map((activity, idx) => (
                      <div key={idx} className="mb-1">• {activity}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Consejos de Trading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              💡 Consejos de Trading para Magia Volátil
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tradingTips.map((tip, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                      <tip.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-white font-semibold">{tip.title}</h3>
                  </div>
                  <p className="text-gray-300 text-sm">{tip.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Resumen de Métodos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-lg p-8 border border-blue-500/30"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              🎯 Resumen de Métodos por Semana
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                <h3 className="text-white font-semibold mb-2">Eventos</h3>
                <p className="text-2xl font-bold text-blue-400">200-800 MV/sem</p>
                <p className="text-gray-400 text-sm">Participación activa</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                <h3 className="text-white font-semibold mb-2">Trading</h3>
                <p className="text-2xl font-bold text-cyan-400">100-400 MV/sem</p>
                <p className="text-gray-400 text-sm">Con inversión</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                <h3 className="text-white font-semibold mb-2">Logros</h3>
                <p className="text-2xl font-bold text-purple-400">300-1000 MV</p>
                <p className="text-gray-400 text-sm">Una vez completados</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                <h3 className="text-white font-semibold mb-2">Mazmorras</h3>
                <p className="text-2xl font-bold text-orange-400">150-500 MV/sem</p>
                <p className="text-gray-400 text-sm">Runs diarias</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default OtrosPage;
