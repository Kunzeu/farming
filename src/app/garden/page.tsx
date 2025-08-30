'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import Image from 'next/image';
import { 
  Leaf, 
  TreePine, 
  Flower2, 
  Clock,
  Star,
  Zap,
  ArrowLeft,
  MapPin,
  Coins
} from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';
import Link from 'next/link';

const JardinesPage = () => {
  const { t } = useI18n();
  const [selectedGarden, setSelectedGarden] = useState<string>('home');

  const gardens = [
    {
      id: 'home',
      name: 'Jardín de Casa',
      description: 'Jardín personal que puedes cultivar en tu casa de guild o casa personal',
      volatileMagic: '5-15 por cosecha',
      growthTime: '24-48 horas',
      difficulty: 'Fácil',
      requirements: ['Semillas de Magia Volátil', 'Agua', 'Fertilizante'],
      tips: ['Riega diariamente', 'Usa fertilizante premium', 'Cosecha en el momento óptimo']
    },
    {
      id: 'guild',
      name: 'Jardines de Guild',
      description: 'Jardines comunitarios en las salas de guild con nodos especiales',
      volatileMagic: '10-25 por nodo',
      growthTime: '12-24 horas',
      difficulty: 'Medio',
      requirements: ['Acceso a Guild', 'Contribución de Guild', 'Nodos desbloqueados'],
      tips: ['Coordina con tu guild', 'Participa en eventos', 'Mantén los nodos activos']
    },
    {
      id: 'world',
      name: 'Jardines del Mundo',
      description: 'Jardines especiales en mapas específicos con nodos raros',
      volatileMagic: '15-35 por nodo',
      growthTime: '6-12 horas',
      difficulty: 'Difícil',
      requirements: ['Nivel 80', 'Mapas desbloqueados', 'Herramientas de jardinería'],
      tips: ['Visita en horarios específicos', 'Lleva herramientas extra', 'Forma grupo para protección']
    },
    {
      id: 'seasonal',
      name: 'Jardines Estacionales',
      description: 'Jardines que aparecen durante eventos especiales y festivales',
      volatileMagic: '20-40 por evento',
      growthTime: 'Evento específico',
      difficulty: 'Medio',
      requirements: ['Participación en evento', 'Herramientas especiales', 'Timing correcto'],
      tips: ['Marca el calendario', 'Prepara recursos', 'Participa desde el inicio']
    }
  ];

  const gardeningTips = [
    {
      icon: Leaf,
      title: 'Cultivo Sostenible',
      description: 'Mantén un ciclo de cultivo constante para obtener Magia Volátil regularmente.'
    },
    {
      icon: Clock,
      title: 'Timing de Cosecha',
      description: 'Cosecha en el momento exacto para maximizar la cantidad de Magia Volátil.'
    },
    {
      icon: TreePine,
      title: 'Variedad de Plantas',
      description: 'Cultiva diferentes tipos de plantas para obtener diferentes cantidades de magia.'
    },
    {
      icon: Coins,
      title: 'Inversión Inteligente',
      description: 'Invierte en herramientas de jardinería de calidad para mejores resultados.'
    }
  ];

  const plantTypes = [
    {
      name: 'Cristales de Magia',
      volatileMagic: '15-25 MV',
      growthTime: '24 horas',
      rarity: 'Común',
      color: 'text-green-400'
    },
    {
      name: 'Flores de Volatilidad',
      volatileMagic: '25-35 MV',
      growthTime: '48 horas',
      rarity: 'Raro',
      color: 'text-blue-400'
    },
    {
      name: 'Árboles de Energía',
      volatileMagic: '35-50 MV',
      growthTime: '72 horas',
      rarity: 'Épico',
      color: 'text-purple-400'
    },
    {
      name: 'Plantas Legendarias',
      volatileMagic: '50-75 MV',
      growthTime: '96 horas',
      rarity: 'Legendario',
      color: 'text-orange-400'
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
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                <Image 
                  src="/images/expansions/volatile-magic.png" 
                  alt="Jardines" 
                  width={32} 
                  height={32} 
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🌱 Jardines - Farming de Magia Volátil
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Guía completa para cultivar y cosechar Magia Volátil en jardines personales, de guild y del mundo
            </p>
          </motion.div>

          {/* Tipos de Jardines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center flex items-center justify-center">
              <Leaf className="w-8 h-8 mr-3 text-green-400" />
              Tipos de Jardines
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gardens.map((garden) => (
                <div 
                  key={garden.id}
                  className={`bg-gray-800/50 backdrop-blur-sm border rounded-lg p-6 cursor-pointer transition-all duration-200 ${
                    selectedGarden === garden.id 
                      ? 'border-green-500 bg-green-900/20' 
                      : 'border-gray-700 hover:border-green-500/50'
                  }`}
                  onClick={() => setSelectedGarden(garden.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{garden.name}</h3>
                    <div className="flex items-center gap-2">
                      <Star className={`w-5 h-5 ${garden.difficulty === 'Fácil' ? 'text-green-400' : garden.difficulty === 'Medio' ? 'text-yellow-400' : 'text-red-400'}`} />
                      <span className="text-sm text-gray-400">{garden.difficulty}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{garden.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-300 font-semibold">{garden.volatileMagic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-blue-300">{garden.growthTime}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-white font-semibold mb-2">Requisitos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {garden.requirements.map((req, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-white font-semibold mb-2">Consejos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {garden.tips.map((tip, idx) => (
                          <span key={idx} className="px-2 py-1 bg-green-700/30 text-green-300 text-xs rounded border border-green-500/30">
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

          {/* Tipos de Plantas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12 bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              🌿 Tipos de Plantas y Recompensas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plantTypes.map((plant, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600 text-center">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Flower2 className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{plant.name}</h3>
                  <p className={`font-bold mb-1 ${plant.color}`}>{plant.volatileMagic}</p>
                  <p className="text-gray-400 text-sm mb-2">{plant.growthTime}</p>
                  <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded">
                    {plant.rarity}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Consejos de Jardinería */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-8"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              💡 Consejos de Jardinería para Magia Volátil
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {gardeningTips.map((tip, index) => (
                <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                      <tip.icon className="w-5 h-5 text-green-400" />
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
            transition={{ delay: 0.8 }}
            className="mt-12 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-lg p-8 border border-green-500/30"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              🎯 Resumen de Recompensas por Día
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                <h3 className="text-white font-semibold mb-2">Jardín Personal</h3>
                <p className="text-2xl font-bold text-green-400">50-150 MV/día</p>
                <p className="text-gray-400 text-sm">Con cultivo básico</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                <h3 className="text-white font-semibold mb-2">Jardines de Guild</h3>
                <p className="text-2xl font-bold text-emerald-400">100-300 MV/día</p>
                <p className="text-gray-400 text-sm">Con participación activa</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-600">
                <h3 className="text-white font-semibold mb-2">Jardines del Mundo</h3>
                <p className="text-2xl font-bold text-teal-400">200-500 MV/día</p>
                <p className="text-gray-400 text-sm">Con exploración intensiva</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default JardinesPage;
