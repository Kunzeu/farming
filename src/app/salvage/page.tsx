'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, BookOpen, Target, Coins, AlertTriangle, ChevronRight, Star, FileText, Wrench } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Link from 'next/link';

type SalvageSection = 'salvageables' | 'luck-calculator' | 'research-notes' | 'unidentified-gear';

export default function SalvagePage() {
  const [selectedSection, setSelectedSection] = useState<SalvageSection | null>(null);

  // Configuración de secciones de Salvaging
  const salvageSections = [
    {
      id: 'salvageables' as SalvageSection,
      name: 'Salvageables',
      description: 'Items que se pueden desmontar',
      icon: Package,
      color: 'blue',
      content: {
        title: '¿Qué se puede salvar?',
        description: 'Descubre qué tipos de items son rentables para desmontar y obtener materiales.',
        details: [
          'Equipamiento de diferentes rarezas',
          'Armas y armaduras',
          'Accesorios y joyas',
          'Items de crafting',
          'Materiales de eventos'
        ],
        tips: [
          'Investiga el valor del item completo vs materiales',
          'Usa el kit apropiado para cada tipo',
          'Monitorea los precios del Trading Post',
          'Considera el mercado de crafting'
        ]
      }
    },
    {
      id: 'luck-calculator' as SalvageSection,
      name: 'Salvaging Costs per 1000 Luck',
      description: 'Calculadora de costos por suerte',
      icon: Star,
      color: 'yellow',
      content: {
        title: 'Calculadora de Luck',
        description: 'Calcula los costos de salvaging en relación a la suerte obtenida.',
        details: [
          'Costo por 1000 puntos de suerte',
          'Eficiencia de diferentes kits',
          'Comparación de rentabilidad',
          'Optimización de recursos'
        ],
        tips: [
          'Usa kits apropiados para maximizar luck',
          'Considera el valor de los materiales obtenidos',
          'Balancea costos vs beneficios',
          'Monitorea los precios del mercado'
        ]
      }
    },
    {
      id: 'research-notes' as SalvageSection,
      name: 'Salvaging Costs per Research Note',
      description: 'Costos por notas de investigación',
      icon: FileText,
      color: 'green',
      content: {
        title: 'Research Notes Calculator',
        description: 'Calcula los costos de salvaging para obtener Research Notes.',
        details: [
          'Costo por Research Note',
          'Items que dan Research Notes',
          'Eficiencia de salvaging',
          'Comparación con compra directa'
        ],
        tips: [
          'Identifica items que dan Research Notes',
          'Calcula el costo por nota',
          'Compara con precios del Trading Post',
          'Optimiza tu estrategia de crafting'
        ]
      }
    },
    {
      id: 'unidentified-gear' as SalvageSection,
      name: 'Unidentified Gear',
      description: 'Calculadoras específicas de Unidentified Gear',
      icon: Wrench,
      color: 'purple',
      content: {
        title: 'Unidentified Gear Calculators',
        description: 'Calculadoras específicas para cada tipo de Unidentified Gear.',
        details: [
          'Masterwork Unidentified Gear',
          'Rare Unidentified Gear', 
          'Exotic Unidentified Gear',
          'Drop rates específicos',
          'Rentabilidad por tipo'
        ],
        tips: [
          'Identifica el gear antes de salvarlo',
          'Usa Runecrafter\'s Salvage-o-Matic para Masterwork',
          'Considera el precio de compra vs venta',
          'Monitorea los precios en tiempo real'
        ]
      }
    }
  ];

  return (
    <>
      <Navigation />
      <div className="max-w-6xl mx-auto p-8">
        {/* Header simplificado */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Package className="h-10 w-10 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Salvaging</h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Guía completa sobre salvaging en Guild Wars 2. Aprende técnicas, calcula rentabilidad y maximiza tus ganancias.
          </p>
        </div>
        
        {/* Información General simplificada */}
        <div className="bg-slate-800/50 rounded-xl p-8 mb-12 border border-slate-700/50">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">¿Qué es el Salvaging?</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              El <strong className="text-blue-400">salvaging</strong> es el proceso de desmontar equipamiento para obtener materiales. 
              Es una de las formas más rentables de obtener oro en Guild Wars 2, especialmente con ciertos tipos de items.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <Target className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Tipo de Kit</h3>
              <p className="text-gray-400 text-sm">Usa el kit apropiado para cada tipo de item</p>
            </div>
            <div className="text-center">
              <Coins className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Precios TP</h3>
              <p className="text-gray-400 text-sm">Monitorea los precios del Trading Post</p>
            </div>
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 text-orange-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Drop Rates</h3>
              <p className="text-gray-400 text-sm">Conoce las tasas de drop de materiales</p>
        </div>
            <div className="text-center">
              <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Valor vs Materiales</h3>
              <p className="text-gray-400 text-sm">Compara el valor del item completo</p>
      </div>
          </div>
        </div>
        
        {/* Secciones principales */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Secciones de Salvaging</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {salvageSections.map((section) => {
              const IconComponent = section.icon;
              const colorClasses = {
                blue: 'border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10',
                yellow: 'border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10',
                green: 'border-green-500/30 bg-green-500/5 hover:bg-green-500/10',
                purple: 'border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10'
              };
              
              return (
                <motion.div
                  key={section.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`border rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    colorClasses[section.color as keyof typeof colorClasses]
                  } ${selectedSection === section.id ? 'ring-2 ring-blue-400' : ''}`}
                  onClick={() => setSelectedSection(section.id)}
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-full border-2 border-${section.color}-400/30 bg-${section.color}-400/10 flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className={`h-8 w-8 text-${section.color}-400`} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{section.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{section.description}</p>
                    
                    <button className="w-full px-4 py-2 bg-slate-700/50 text-white rounded-lg hover:bg-slate-600/50 transition-colors flex items-center justify-center gap-2">
                      <span>Explorar</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Detalles de la sección seleccionada */}
        {selectedSection && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 rounded-xl p-8 mb-8 border border-slate-700/50"
          >
            {(() => {
              const selectedSectionData = salvageSections.find(s => s.id === selectedSection);
              if (!selectedSectionData) return null;
              
              const IconComponent = selectedSectionData.icon;
              
              return (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-full border-2 border-${selectedSectionData.color}-400/30 bg-${selectedSectionData.color}-400/10 flex items-center justify-center`}>
                        <IconComponent className={`h-8 w-8 text-${selectedSectionData.color}-400`} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-white">{selectedSectionData.content.title}</h3>
                        <p className="text-gray-400">{selectedSectionData.content.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedSection(null)}
                      className="text-gray-400 hover:text-white transition-colors text-2xl"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Características</h4>
                      <div className="space-y-3">
                        {selectedSectionData.content.details.map((detail, index) => (
                          <div key={index} className="flex items-center gap-3 text-gray-300">
                            <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                            <span>{detail}</span>
                          </div>
                        ))}
          </div>
        </div>
        
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Consejos</h4>
                      <div className="space-y-3">
                        {selectedSectionData.content.tips.map((tip, index) => (
                          <div key={index} className="flex items-start gap-3 text-gray-300">
                            <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm">{tip}</span>
                          </div>
                        ))}
          </div>
        </div>
      </div>

                  <div className="mt-8 pt-6 border-t border-slate-600/50">
                    <div className="flex gap-4 justify-center">
                      {selectedSectionData.id === 'unidentified-gear' ? (
                        <div className="flex gap-3">
                          <Link href="/salvage/unidentified-gear/common">
                            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              Common
                            </button>
                          </Link>
                          <Link href="/salvage/unidentified-gear/masterwork">
                            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                              Masterwork
                            </button>
                          </Link>
                          <Link href="/salvage/unidentified-gear/rare">
                            <button className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                              Rare
                            </button>
                          </Link>
                        </div>
                      ) : (
                        <Link href={`/salvage/${selectedSectionData.id}`}>
                          <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Abrir {selectedSectionData.name}
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* Información Adicional simplificada */}
        <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-6 text-center">Información Adicional</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">Salvage Kits</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><strong>Basic:</strong> Para items básicos</p>
                <p><strong>Master&apos;s:</strong> Mejor chance de ectos</p>
                <p><strong>Runecrafter&apos;s:</strong> Para unidentified gear</p>
                <p><strong>Black Lion:</strong> Máxima eficiencia</p>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">Estrategias</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>Investiga precios antes de salvarlo</p>
                <p>Considera el valor del item completo</p>
                <p>Usa el kit apropiado para cada tipo</p>
                <p>Monitorea los precios del Trading Post</p>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-4">Recursos</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p><a href="https://wiki.guildwars2.com/wiki/Salvage_kit" target="_blank" className="text-blue-400 hover:text-blue-300">GW2 Wiki - Salvage Kits</a></p>
                <p><a href="https://api.guildwars2.com/v2/commerce/prices" target="_blank" className="text-blue-400 hover:text-blue-300">API de Precios GW2</a></p>
                <p><a href="https://gw2efficiency.com/" target="_blank" className="text-blue-400 hover:text-blue-300">GW2 Efficiency</a></p>
              </div>
            </div>
          </div>
      </div>
    </div>
    </>
  );
}
