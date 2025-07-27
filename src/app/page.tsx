'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import ItemCard from '@/components/ui/ItemCard';
import { 
  TrendingUp, 
  Map, 
  Coins, 
  Sword,
  Search
} from 'lucide-react';
import { 
  getPopularFarmingItems, 
  getItemPrices, 
  formatPrice,
  calculateProfitMargin 
} from '@/lib/gw2-api';
import { GW2Item, GW2Price } from '@/types/gw2';

export default function Home() {
  const [popularItems, setPopularItems] = useState<GW2Item[]>([]);
  const [itemPrices, setItemPrices] = useState<GW2Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const items = await getPopularFarmingItems();
        setPopularItems(items);
        
        const itemIds = items.map(item => item.id);
        const prices = await getItemPrices(itemIds);
        setItemPrices(prices);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPriceForItem = (itemId: number) => {
    return itemPrices.find(price => price.id === itemId);
  };

  const filteredItems = popularItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    {
      title: 'Items Populares',
      value: popularItems.length.toString(),
      icon: TrendingUp,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/20'
    },
    {
      title: 'Precio Promedio',
      value: itemPrices.length > 0 ? formatPrice(
        itemPrices.reduce((sum, price) => sum + price.sells.unit_price, 0) / itemPrices.length
      ) : '0c',
      icon: Coins,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/20'
    },
    {
      title: 'Margen Promedio',
      value: itemPrices.length > 0 ? 
        `${calculateProfitMargin(
          itemPrices.reduce((sum, price) => sum + price.buys.unit_price, 0) / itemPrices.length,
          itemPrices.reduce((sum, price) => sum + price.sells.unit_price, 0) / itemPrices.length
        ).toFixed(1)}%` : '0%',
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-900/20'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            GW2 <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Farming Hub</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Tu centro de información para farming, precios del Trading Post, guías y todo lo relacionado con Guild Wars 2
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`${stat.bgColor} rounded-lg p-6 border border-gray-700`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </motion.div>

        {/* Items Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                >
                  <ItemCard
                    item={item}
                    price={getPriceForItem(item.id)}
                    showPrice={true}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Acciones Rápidas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Trading Post', description: 'Precios en tiempo real', icon: TrendingUp, href: '/trading-post' },
              { title: 'Rutas de Farming', description: 'Guías de farming', icon: Map, href: '/farming-routes' },
              { title: 'Builds', description: 'Builds meta', icon: Sword, href: '/builds' },
            ].map((action, index) => (
              <motion.a
                key={action.title}
                href={action.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all duration-200 text-center"
              >
                <action.icon className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">{action.title}</h3>
                <p className="text-gray-400 text-sm">{action.description}</p>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
