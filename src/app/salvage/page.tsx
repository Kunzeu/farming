'use client';


import { motion } from 'framer-motion';
import { Package, ChevronRight, Star, FileText, Wrench } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Link from 'next/link';

type SalvageSection = 'salvageables' | 'luck-calculator' | 'research-notes' | 'unidentified-gear';

export default function SalvagePage() {

  // Configuración de secciones de Salvaging
  const salvageSections = [
    {
      id: 'salvageables' as SalvageSection,
      name: 'Reciclables',
      description: 'Items que se pueden reciclar',
      icon: Package,
      color: 'blue',
      bgGradient: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      features: ['Equipamiento de diferentes rarezas', 'Armas y armaduras', 'Accesorios y joyas'],
      href: '/salvage/salvageables'
    },
    {
      id: 'luck-calculator' as SalvageSection,
      name: 'Luck Calculator',
      description: 'Calculadora de costos por suerte',
      icon: Star,
      color: 'yellow',
      bgGradient: 'from-yellow-500/20 to-yellow-600/20',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      features: ['Costo por 1000 puntos de suerte', 'Eficiencia de diferentes kits', 'Comparación de rentabilidad'],
      href: '/salvage/luck-calculator'
    },
    {
      id: 'research-notes' as SalvageSection,
      name: 'Research Notes',
      description: 'Costos por notas de investigación',
      icon: FileText,
      color: 'green',
      bgGradient: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      features: ['Costo por Research Note', 'Items que dan Research Notes', 'Eficiencia de salvaging'],
      href: '/salvage/research-notes'
    },
    {
      id: 'unidentified-gear' as SalvageSection,
      name: 'Unidentified Gear',
      description: 'Calculadoras específicas de Unidentified Gear',
      icon: Wrench,
      color: 'purple',
      bgGradient: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      features: ['Common, Masterwork, Rare', 'Drop rates específicos', 'Rentabilidad por tipo'],
      href: '/salvage/unidentified-gear'
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto p-6 sm:p-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg flex items-center justify-center">
                <Package className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Salvaging
              </h1>
            </motion.div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Guía completa sobre salvaging en Guild Wars 2. Aprende técnicas, calcula rentabilidad y maximiza tus ganancias.
            </p>
          </div>



          {/* Información General */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-slate-600/50"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-white mb-3">¿Qué es el Salvaging?</h2>
              <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                El <strong className="text-blue-400">salvaging</strong> es el proceso de reciclar equipamiento para obtener materiales. Es una de las formas más rentables de obtener oro en Guild Wars 2, especialmente con ciertos tipos de items.</p>
            </div>
          </motion.div>

          {/* Secciones principales */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Secciones de Reciclaje</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {salvageSections.map((section, index) => {
                const IconComponent = section.icon;
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={section.href}>
                      <div className={`group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${section.bgGradient} border ${section.borderColor} hover:scale-105 transition-all duration-300 cursor-pointer h-full`}>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Content */}
                        <div className="relative z-10">
                          {/* Icon */}
                          <div className={`w-14 h-14 bg-gradient-to-br from-${section.color}-500/30 to-${section.color}-600/30 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className={`h-7 w-7 ${section.textColor}`} />
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-bold text-white mb-2">{section.name}</h3>
                          <p className="text-sm text-gray-300 mb-4">{section.description}</p>

                          {/* Features */}
                          <div className="space-y-1 mb-4">
                            {section.features.slice(0, 2).map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full bg-${section.color}-400`}></div>
                                <span className="text-xs text-gray-300">{feature}</span>
                              </div>
                            ))}
                          </div>

                          {/* Button */}
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium text-sm">Explorar</span>
                            <ChevronRight className={`h-4 w-4 ${section.textColor} group-hover:translate-x-1 transition-transform duration-300`} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/50"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Consejos Pro</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Salvage Kits
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p><strong className="text-blue-400">Copper-Fed:</strong> Para Common Gear</p>
                  <p><strong className="text-green-400">Runecrafter&apos;s:</strong> Para Masterwork</p>
                  <p><strong className="text-yellow-400">Silver-Fed:</strong> Para Rare Gear</p>
                  <p><strong className="text-purple-400">Black Lion:</strong> Máxima eficiencia</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Estrategias
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    Investiga precios antes de salvarlo
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    Considera el valor del item completo
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    Usa el kit apropiado para cada tipo
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Recursos
                </h3>
                <div className="space-y-3 text-gray-300">
                  <p><a href="https://wiki.guildwars2.com/wiki/Salvage_kit" target="_blank" className="text-purple-400 hover:text-purple-300">GW2 Wiki - Salvage Kits</a></p>
                  <p><a href="https://wiki.guildwars2.com/wiki/Salvage" target="_blank" className="text-purple-400 hover:text-purple-300">GW2 Wiki - Salvaging</a></p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
