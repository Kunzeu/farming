'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import { 
  BookOpen, 
  Search, 
  Package, 
  MapPin,
  Calendar,
  Star,
  Info,
  Wrench,
  FileText
} from 'lucide-react';

interface GlossaryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  tips?: string[];
  relatedLinks?: { name: string; url: string }[];
}

export default function GlossaryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const glossaryItems: GlossaryItem[] = [
    // SALVAGING
    {
      id: 'salvaging',
      title: 'Salvaging',
             description: 'Salvaging is the process of recycling equipment to obtain materials. It is one of the most profitable ways to earn gold in Guild Wars 2, especially with certain types of items.',
      category: 'salvaging',
      icon: <Package className="h-6 w-6" />,
      color: 'blue',
      bgGradient: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      tips: [
        'Investiga precios antes de recicarlos',
        'Considera el valor del item completo',
        'Usa el kit apropiado para cada tipo'
      ],
      relatedLinks: [
        { name: 'GW2 Wiki - Salvage Kits', url: 'https://wiki.guildwars2.com/wiki/Salvage_kit' },
        { name: 'GW2 Wiki - Salvaging', url: 'https://wiki.guildwars2.com/wiki/Salvage' }
      ]
    },
    {
      id: 'unidentified-gear',
      title: 'Unidentified Gear',
             description: 'Unidentified equipment that can be salvaged to obtain specific materials. There are three types: Common (green), Masterwork (blue) and Rare (gold), each with different drop rates and profitability.',
      category: 'salvaging',
      icon: <Wrench className="h-6 w-6" />,
      color: 'purple',
      bgGradient: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      tips: [
        'Common: Usa Copper-Fed Salvage-o-Matic',
        'Masterwork: Usa Runecrafter\'s Salvage-o-Matic',
        'Rare: Usa Silver-Fed Salvage-o-Matic'
      ]
    },
    {
      id: 'salvage-kits',
      title: 'Salvage Kits',
             description: 'Specialized tools for recycling equipment. Each kit has different success rates and associated costs. Automatic kits are more convenient but more expensive.',
      category: 'salvaging',
      icon: <Wrench className="h-6 w-6" />,
      color: 'green',
      bgGradient: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      tips: [
        'Copper-Fed: Para items comunes y baratos',
        'Runecrafter\'s: Para items masterwork con runas',
        'Silver-Fed: Para items raros y exóticos'
      ]
    },
    {
      id: 'luck-calculator',
      title: 'Luck Calculator',
             description: 'Calculator to determine the cost per luck points obtained when salvaging items. Helps optimize which items to salvage to maximize luck gain efficiency.',
      category: 'salvaging',
      icon: <Star className="h-6 w-6" />,
      color: 'yellow',
      bgGradient: 'from-yellow-500/20 to-yellow-600/20',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400'
    },
    {
      id: 'research-notes',
      title: 'Research Notes',
             description: 'Research notes obtained by salvaging specific items. They are necessary for advanced crafting and can be a significant source of income.',
      category: 'salvaging',
      icon: <FileText className="h-6 w-6" />,
      color: 'green',
      bgGradient: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400'
    },

    // FARMING
    {
      id: 'farming-routes',
             title: 'Farming Routes',
       description: 'Optimized routes for collecting materials and earning gold efficiently. Each route has different requirements, difficulty and expected earnings per hour.',
      category: 'farming',
      icon: <MapPin className="h-6 w-6" />,
      color: 'green',
      bgGradient: 'from-green-500/20 to-green-600/20',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      tips: [
        'Rutas optimizadas para maximizar el oro por hora',
        'Planifica tus sesiones según eventos y metas diarias',
                 'Different types of content for all tastes'
      ]
    },

    // FESTIVALS
    {
      id: 'festivals',
             title: 'Festivals',
       description: 'Temporary events that offer unique content and special rewards. They are excellent opportunities to earn gold and exclusive items.',
      category: 'festivals',
      icon: <Calendar className="h-6 w-6" />,
      color: 'purple',
      bgGradient: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/30',
      textColor: 'text-purple-400',
      tips: [
        'Compra items antes del festival cuando los precios están bajos',
        'Vende items específicos cuando sus precios alcancen picos',
        'Participa en actividades únicas del festival'
      ]
    },


  ];

  const categories = [
         { id: 'all', name: 'All', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'salvaging', name: 'Salvaging', icon: <Package className="h-4 w-4" /> },
    { id: 'farming', name: 'Farming', icon: <MapPin className="h-4 w-4" /> },
    { id: 'festivals', name: 'Festivals', icon: <Calendar className="h-4 w-4" /> }
  ];

  const filteredItems = glossaryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            GW2 Glossary
          </h1>
          <p className="text-xl text-gray-300">
            Complete guide of important concepts and terms for earning gold in Guild Wars 2
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 border-blue-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </motion.div>

                 {/* Glossary Items */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2 }}
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
         >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`bg-gradient-to-br ${item.bgGradient} backdrop-blur-sm rounded-xl p-6 border ${item.borderColor} hover:scale-105 transition-transform duration-200`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-white/10 ${item.textColor}`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
              </div>
              
              <p className="text-gray-300 mb-4 leading-relaxed">
                {item.description}
              </p>

              {item.tips && item.tips.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Tips
                  </h4>
                  <ul className="space-y-1">
                    {item.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.relatedLinks && item.relatedLinks.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Related Links</h4>
                  <div className="space-y-1">
                    {item.relatedLinks.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 block"
                      >
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                         <p className="text-gray-400 text-lg">
               No concepts found matching your search.
             </p>
          </motion.div>
        )}
      </main>
    </div>
  );
} 