'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/components/layout/Navigation'
import { 
  Package, 
  Gift,
  Hammer,
  Route,
  Clock
} from 'lucide-react'
import { usePageTitle } from '@/hooks/usePageTitle'

interface DashboardCard {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  color: string
  delay: number
}

export default function HomePage() {
  usePageTitle('Home');
  
  const dashboardCards: DashboardCard[] = [
    {
      title: "Farms",
      description: "Optimized routes for maximum efficiency",
      href: "/farming-routes",
      icon: <Route className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      delay: 0.1
    },
    {
      title: "Daily Routine",
      description: "Organize your daily activities efficiently",
      href: "/daily-routine",
      icon: <Clock className="w-8 h-8" />,
      color: "from-green-500 to-green-600",
      delay: 0.2
    },
    {
      title: "Salvaging",
      description: "Calculate profits from salvaging unidentified gear",
      href: "/salvage",
      icon: <Package className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600",
      delay: 0.3
    },
    {
      title: "Crafting",
      description: "Calculate crafting costs and benefits",
      href: "/crafting",
      icon: <Hammer className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      delay: 0.4
    },
    {
      title: "Festivals",
      description: "Information about events and festivals",
      href: "/festivals",
      icon: <Gift className="w-8 h-8" />,
      color: "from-pink-500 to-pink-600",
      delay: 0.5
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      
      {/* Container principal */}
      <div className="container mx-auto px-4 py-8">
        
        {/* Hero Section - Banner Promocional */}
        <section className="relative overflow-hidden rounded-xl mb-12 h-96">
          {/* Imagen de fondo de Visions of Eternity */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-xl"
            style={{
              backgroundImage: 'url(/images/backgrounds/voe-background.jpg)',
            }}
          >
            {/* Overlay mejorado */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/70 rounded-xl"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent rounded-xl"></div>
          </div>

          {/* Logo central */}
          <div className="absolute inset-0 flex items-center justify-center -mt-16">
            <Image 
              src="/images/backgrounds/gw2_release_logo_latest.webp" 
              alt="Guild Wars 2: Visions of Eternity"
              width={500}
              height={500}
              className="max-w-xs md:max-w-sm lg:max-w-md h-auto drop-shadow-2xl"
            />
          </div>

          {/* Contenido principal */}
          <div className="absolute bottom-8 left-0 right-0 text-center">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4">
        
                {/* Botón Purchase Now */}
                {/*<div className="pt-4">
                  <motion.a
                    href="http://guildwars2.go2cloud.org/aff_c?offer_id=28&aff_id=757"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Purchase Now
                  </motion.a>
                  
                  <div className="mt-4 flex justify-center">
                    <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full opacity-60"></div>
                  </div>
                </div> */}
              </motion.div>
            </div>
          </div>
        </section> 

        {/* Sección de herramientas principales */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-white mb-3 text-center">
              Available Tools
            </h2>
            <p className="text-gray-400 text-center max-w-2xl mx-auto">
              Access to all available features and tools for optimizing your Guild Wars 2 farming experience
            </p>
          </motion.div>

          {/* Grid de herramientas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardCards.map((card) => (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: card.delay }}
              >
                <Link href={card.href}>
                  <div className={`bg-gradient-to-br ${card.color} p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full border border-white/10`}>
                    <div className="flex items-center space-x-4">
                      <div className="text-white">
                        {card.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {card.title}
                        </h3>
                        <p className="text-gray-100 text-sm leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
} 