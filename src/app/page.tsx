'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navigation from '@/components/layout/Navigation'
import { 
  Package, 
  Gift,
  Hammer,
  Route,
  Clock
} from 'lucide-react'

interface DashboardCard {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  color: string
  delay: number
}

export default function HomePage() {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navigation />
      
      {/* Hero Section */}
      <section className="px-6 py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              GW2 Farming Hub
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Your ultimate Guild Wars 2 farming companion
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Grid */}
      <section className="px-6 py-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Available Tools
          </h2>
          <p className="text-gray-400 text-center">
            Access to all available features and tools
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardCards.map((card) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: card.delay }}
            >
              <Link href={card.href}>
                <div className={`bg-gradient-to-br ${card.color} p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full`}>
                  <div className="flex items-center space-x-4">
                    <div className="text-white">
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {card.title}
                      </h3>
                      <p className="text-gray-100 text-sm">
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
  )
} 