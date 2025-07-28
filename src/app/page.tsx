'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navigation from '@/components/layout/Navigation'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navigation />
      
        {/* Hero Section */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              GW2 Farming Hub
          </h1>
            <p className="text-xl text-gray-300 mb-8">
              Tu plataforma para optimizar el farming en Guild Wars 2
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Herramientas simples y efectivas para maximizar tus ganancias y organizar tu tiempo de juego.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/farming-routes"
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Ver Rutas
            </Link>
            <Link
              href="/daily-routine"
              className="px-8 py-4 border-2 border-blue-600 text-blue-400 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200"
            >
              Crear Rutina
            </Link>
        </motion.div>
            </div>
      </section>

      {/* About Section */}
      <section className="px-6 py-16 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            ¿Qué es GW2 Farming Hub?
          </h2>
          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              Somos una plataforma creada por jugadores de Guild Wars 2 para ayudar 
              a la comunidad a ser más eficiente en sus actividades de farming.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Nuestro objetivo es proporcionar herramientas simples y útiles que te 
              permitan aprovechar mejor tu tiempo en el juego y maximizar tus ganancias.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
