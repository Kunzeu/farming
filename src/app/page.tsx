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
      title: "Farming Routes",
      description: "Discover the best routes to maximize your profits",
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
      description: "Optimize your salvaging for maximum profit",
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
              Your control center to optimize farming in Guild Wars 2
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
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            Available Tools
          </h2>
          <p className="text-gray-400 text-center">
            Access to all available features and tools
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {dashboardCards.map((card) => (
            <motion.div
              key={card.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: card.delay }}
            >
              <Link href={card.href}>
                <div className={`bg-gradient-to-br ${card.color} p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full group`}>
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                      {card.icon}
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-2">
                      {card.title}
                    </h3>
                    <p className="text-xs text-white/80 leading-relaxed">
                      {card.description}
                    </p>
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
