'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import { 
  Calendar, 
  Star, 
  Coins, 
  Clock,
  TrendingUp,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { festivalDates, getFestivalStatus } from '@/lib/festival-dates';

const festivals = [
  {
    id: 'lunar',
    name: 'Lunar New Year Festival',
    description: 'The celebration of the new year in the Canthan calendar',
    icon: '🏮',
    color: 'from-red-500 to-yellow-600',
    status: getFestivalStatus(festivalDates.lunar.startDate, festivalDates.lunar.endDate),
    startDate: festivalDates.lunar.startDateFormatted,
    endDate: festivalDates.lunar.endDateFormatted,
    features: [
      'Lucky Envelopes',
      'Essence of Luck',
      'Dragon Ball Arena',
      'Fireworks'
    ],
    estimatedGoldPerHour: 18,
    difficulty: 'Easy',
    timeRequired: '2-3 hours',
    path: '/festivals/lunar'
  },
  {
    id: 'dragon-bash',
    name: 'Dragon Bash',
    description: 'Summer festival celebrating resistance against the Elder Dragons',
    icon: '🐉',
    color: 'from-purple-500 to-pink-600',
    status: getFestivalStatus(festivalDates['dragon-bash'].startDate, festivalDates['dragon-bash'].endDate),
    startDate: festivalDates['dragon-bash'].startDateFormatted,
    endDate: festivalDates['dragon-bash'].endDateFormatted,
    features: [
      'Holographic Dragon Minions',
      'Racing Events',
      'Festival Tokens',
      'Dragon-themed Rewards'
    ],
    estimatedGoldPerHour: 12,
    difficulty: 'Easy',
    timeRequired: '2-3 hours',
    path: '/festivals/dragon-bash'
  },
  {
    id: 'four-winds',
    name: 'Festival of the Four Winds',
    description: 'Summer festival with mount races and adventures',
    icon: '🪂',
    color: 'from-green-500 to-blue-600',
    status: getFestivalStatus(festivalDates['four-winds'].startDate, festivalDates['four-winds'].endDate),
    startDate: festivalDates['four-winds'].startDateFormatted,
    endDate: festivalDates['four-winds'].endDateFormatted,
    features: [
      'Mount Races',
      'Boss Blitz',
      'Queen\'s Gauntlet',
      'Scavenger Hunts'
    ],
    estimatedGoldPerHour: 10,
    difficulty: 'Medium',
    timeRequired: '3-4 hours',
    path: '/festivals/four-winds'
  },
  {
    id: 'halloween',
    name: 'Festival de Halloween',
    description: 'The terrifying festival of Mad King Thorn',
    icon: '🎃',
    color: 'from-orange-500 to-red-600',
    status: getFestivalStatus(festivalDates.halloween.startDate, festivalDates.halloween.endDate),
    startDate: festivalDates.halloween.startDateFormatted,
    endDate: festivalDates.halloween.endDateFormatted,
    features: [
      'Trick-or-Treat Bags',
      'Candy Corn',
      'Mad King\'s Labyrinth',
      'Clock Tower Puzzle'
    ],
    estimatedGoldPerHour: 15,
    difficulty: 'Easy',
    timeRequired: '2-3 hours',
    path: '/festivals/halloween'
  },
  {
    id: 'wintersday',
    name: 'Wintersday',
    description: 'Winter festival celebrating the new year in the Mouvelian calendar',
    icon: '❄️',
    color: 'from-blue-500 to-cyan-600',
    status: getFestivalStatus(festivalDates.wintersday.startDate, festivalDates.wintersday.endDate),
    startDate: festivalDates.wintersday.startDateFormatted,
    endDate: festivalDates.wintersday.endDateFormatted,
    features: [
      'Wintersday Gifts',
      'Winter Wonderland',
      'Bell Choir Ensemble',
      'Toypocalypse'
    ],
    estimatedGoldPerHour: 20,
    difficulty: 'Easy',
    timeRequired: '2-3 hours',
    path: '/festivals/wintersday'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-600 text-white';
    case 'upcoming':
      return 'bg-blue-600 text-white';
    case 'ended':
      return 'bg-gray-600 text-white';
    default:
      return 'bg-gray-600 text-white';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'upcoming':
      return 'Upcoming';
    case 'ended':
      return 'Ended';
    default:
      return 'Unknown';
  }
};

export default function FestivalsPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center">
              <Calendar className="w-8 h-8 mr-3 text-purple-400" />
              Guild Wars 2 Festivals
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Specific calculators and guides to maximize your profits during annual festivals
            </p>
          </motion.div>

                      {/* Festivals Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {festivals.map((festival, index) => (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="group">
                <Link href={festival.path}>
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${festival.color} rounded-lg flex items-center justify-center text-2xl`}>
                        {festival.icon}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(festival.status)}`}>
                        {getStatusLabel(festival.status)}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-400 transition-colors">
                      {festival.name}
                    </h3>

                    {/* Dates */}
                    <div className="flex items-center gap-2 mb-6">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-300 text-sm">
                        {festival.startDate} - {festival.endDate}
                      </span>
                    </div>

                    {/* CTA */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between">
                        <span className="text-purple-400 text-sm font-semibold">
                          View Calculator
                        </span>
                        <TrendingUp className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Información General */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 space-y-6">
            {/* What are Festivals? */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-5">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Info className="w-6 h-6 mr-3 text-blue-400" />
                What are Festivals?
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Festivals in Guild Wars 2 are seasonal celebrations that occur throughout the year. 
                Each festival has its own theme, unique activities, and special rewards. 
                These events typically last about 3 weeks and offer unique opportunities for 
                farming and obtaining exclusive items.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h3 className="text-white font-semibold mb-2">Unique Activities</h3>
                  <p className="text-gray-300 text-sm">
                    Each festival includes specific activities such as puzzles, races, combat events, and special events.
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h3 className="text-white font-semibold mb-2">Exclusive Items</h3>
                  <p className="text-gray-300 text-sm">
                    Skins, weapons, and other items that are only available during the festival.
                  </p>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h3 className="text-white font-semibold mb-2">Temporary Rewards</h3>
                  <p className="text-gray-300 text-sm">
                    Materials, currencies, and other resources that can be sold for gold on the Trading Post.
                  </p>
                </div>
              </div>
            </div>

            {/* Estrategias de Farming */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-5">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
                Festival Farming Strategies
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">During the Festival</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Participate in Activities</h4>
                        <p className="text-gray-300 text-sm">Complete daily activities to obtain consistent rewards.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Intensive Farming</h4>
                        <p className="text-gray-300 text-sm">Dedicate time to the most profitable activities of the festival.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">After the Festival</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Strategic Selling</h4>
                        <p className="text-gray-300 text-sm">Wait for prices to rise after the festival.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Market Analysis</h4>
                        <p className="text-gray-300 text-sm">Monitor prices to identify the best selling moment.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Earn Gold in Festivals */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-5">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Coins className="w-6 h-6 mr-3 text-yellow-400" />
                How to Earn Gold in Festivals?
              </h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Festivals are one of the best opportunities to generate gold in Guild Wars 2. 
                Each festival has specific farming methods that can generate between 20-30g per hour 
                depending on your efficiency and the festival in question.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">Main Methods</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Activity Farming</h4>
                        <p className="text-gray-300 text-sm">Repeatedly participate in the most profitable activities of the festival.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Container Opening</h4>
                        <p className="text-gray-300 text-sm">Open bags, envelopes, and other containers to obtain valuable items.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Material Selling</h4>
                        <p className="text-gray-300 text-sm">Sell festival-specific materials on the Trading Post.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-white">Advanced Strategies</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Storage</h4>
                        <p className="text-gray-300 text-sm">Save items to sell them in the next festival.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <h4 className="text-white font-semibold">Multiple Characters</h4>
                        <p className="text-gray-300 text-sm">Use several characters to maximize daily rewards.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
                <h4 className="text-yellow-300 font-semibold mb-2">💡 Pro Tip</h4>
                <p className="text-gray-300 text-sm">
                  The most profitable festivals are usually Halloween (Trick-or-Treat Bags) and Wintersday (Wintersday Gifts). 
                  These can generate 30-40g per hour with efficient farming. Use our specific calculators 
                  to determine the exact profitability of each activity.
                </p>
              </div>
            </div>

            {/* Consejos Generales */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-5">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Star className="w-6 h-6 mr-3 text-yellow-400" />
                General Tips
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-semibold">Planning</h4>
                      <p className="text-gray-300 text-sm">Research festivals in advance and prepare your characters.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-semibold">Diversification</h4>
                      <p className="text-gray-300 text-sm">Don&apos;t focus on just one activity, explore all options.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-semibold">Community</h4>
                      <p className="text-gray-300 text-sm">Join organized groups to maximize efficiency.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="text-white font-semibold">Enjoy</h4>
                      <p className="text-gray-300 text-sm">Remember that festivals are designed to be fun.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
} 