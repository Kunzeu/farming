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
              Your platform to optimize farming in Guild Wars 2
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Simple and effective tools to maximize your profits and organize your playtime.
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
              View Routes
            </Link>
            <Link
              href="/daily-routine"
              className="px-8 py-4 border-2 border-blue-600 text-blue-400 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200"
            >
              Create Routine
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
            What is GW2 Farming Hub?
          </h2>
          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
            <p className="text-lg text-gray-300 leading-relaxed mb-6">
              We are a platform created by Guild Wars 2 players to help the community be more efficient in their farming activities.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Our goal is to provide simple and useful tools that let you make the most of your time in-game and maximize your profits.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
