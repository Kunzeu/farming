'use client';

import { motion } from 'framer-motion';
import { Wrench, Package, Star, Crown, ChevronRight } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Link from 'next/link';

export default function UnidentifiedGearPage() {
  const gearTypes = [
    {
      id: 'common',
      name: 'Common',
      fullName: 'Common Unidentified Gear',
      description: 'Equipamiento común con materiales básicos',
      icon: Package,
      color: 'blue',
      bgGradient: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      href: '/salvage/unidentified-gear/common',
      features: ['Materiales básicos', 'Bajo costo de entrada', 'Copper-Fed Kit recomendado']
    },
    {
      id: 'masterwork',
      name: 'Masterwork',
      fullName: 'Masterwork Unidentified Gear',
      description: 'Equipamiento maestro con materiales intermedios',
      icon: Star,
      color: 'green',
      bgGradient: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      href: '/salvage/unidentified-gear/masterwork',
      features: ['Materiales maestros', 'Runas y sigilos', 'Runecrafter\'s Kit recomendado']
    },
    {
      id: 'rare',
      name: 'Rare',
      fullName: 'Rare Unidentified Gear',
      description: 'Equipamiento raro con ectos y materiales valiosos',
      icon: Crown,
      color: 'yellow',
      bgGradient: 'from-yellow-500/20 to-yellow-600/20',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      href: '/salvage/unidentified-gear/rare',
      features: ['Ectos frecuentes', 'Materiales raros', 'Silver-Fed Kit recomendado']
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
              className="flex items-center justify-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg flex items-center justify-center">
                <Wrench className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Unidentified Gear
              </h1>
            </motion.div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Specific calculators to maximize your profits with each type of Unidentified Gear
            </p>
          </div>



          {/* Gear Types Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Selecciona tu tipo de Gear</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {gearTypes.map((gear, index) => {
                const IconComponent = gear.icon;
                return (
                  <motion.div
                    key={gear.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={gear.href}>
                      <div className={`group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${gear.bgGradient} border ${gear.borderColor} hover:scale-105 transition-all duration-300 cursor-pointer h-full`}>
                        {/* Background Pattern */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Content */}
                        <div className="relative z-10">
                          {/* Icon */}
                          <div className={`w-16 h-16 bg-gradient-to-br from-${gear.color}-500/30 to-${gear.color}-600/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className={`h-8 w-8 ${gear.textColor}`} />
                          </div>

                          {/* Title */}
                          <h3 className="text-2xl font-bold text-white mb-2">{gear.name}</h3>
                          <p className="text-gray-300 mb-6">{gear.description}</p>

                          {/* Features */}
                          <div className="space-y-2 mb-6">
                            {gear.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full bg-${gear.color}-400`}></div>
                                <span className="text-sm text-gray-300">{feature}</span>
                              </div>
                            ))}
                          </div>

                          {/* Button */}
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">Ver Calculadora</span>
                            <ChevronRight className={`h-5 w-5 ${gear.textColor} group-hover:translate-x-1 transition-transform duration-300`} />
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
             transition={{ delay: 0.4 }}
             className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-600/50">
             <h2 className="text-2xl font-bold text-white mb-6 text-center">Consejos Pro</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                 <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                   <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                   Estrategias de Mercado
                 </h3>
                 <div className="space-y-3 text-gray-300">
                   <p className="flex items-start gap-2">
                     <span className="text-purple-400">•</span>
                     Monitorea los precios del Trading Post en tiempo real
                   </p>
                   <p className="flex items-start gap-2">
                     <span className="text-purple-400">•</span>
                     Compra unidentified gear en lotes grandes para mejores precios
                   </p>
                 </div>
               </div>
               <div>
                 <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                   <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                   Optimización de Proceso
                 </h3>
                 <div className="space-y-3 text-gray-300">
                   <p className="flex items-start gap-2">
                     <span className="text-blue-400">•</span>
                     Identifica el unidentified gear antes de reciclarlo
                   </p>
                   <p className="flex items-start gap-2">
                     <span className="text-blue-400">•</span>
                     Tener un inventario de 280 slots para facilitar el proceso
                   </p>
                 </div>
               </div>
             </div>
           </motion.div>
        </div>
      </div>
    </>
  );
} 