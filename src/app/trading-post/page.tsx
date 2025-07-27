'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import ItemCard from '@/components/ui/ItemCard';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown,
  DollarSign
} from 'lucide-react';
import { 
  searchItems, 
  getItemPrices, 
  formatPrice,
  calculateProfitMargin 
} from '@/lib/gw2-api';
import { GW2Item, GW2Price } from '@/types/gw2';

export default function TradingPost() {
  const [items, setItems] = useState<GW2Item[]>([]);
  const [prices, setPrices] = useState<GW2Price[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'profit'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const searchResults = await searchItems(searchQuery);
      setItems(searchResults);
      
      if (searchResults.length > 0) {
        const itemIds = searchResults.map(item => item.id);
        const priceResults = await getItemPrices(itemIds);
        setPrices(priceResults);
      }
    } catch (error) {
      console.error('Error searching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriceForItem = (itemId: number) => {
    return prices.find(price => price.id === itemId);
  };

  const sortedItems = [...items].sort((a, b) => {
    const priceA = getPriceForItem(a.id);
    const priceB = getPriceForItem(b.id);
    
    switch (sortBy) {
      case 'name':
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      case 'price':
        if (!priceA || !priceB) return 0;
        const priceDiff = priceA.sells.unit_price - priceB.sells.unit_price;
        return sortOrder === 'asc' ? priceDiff : -priceDiff;
      case 'profit':
        if (!priceA || !priceB) return 0;
        const profitA = calculateProfitMargin(priceA.buys.unit_price, priceA.sells.unit_price);
        const profitB = calculateProfitMargin(priceB.buys.unit_price, priceB.sells.unit_price);
        return sortOrder === 'asc' ? profitA - profitB : profitB - profitA;
      default:
        return 0;
    }
  });

  const handleSort = (newSortBy: typeof sortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

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
            Trading Post
          </h1>
          <p className="text-xl text-gray-300">
            Precios en tiempo real del mercado de Guild Wars 2
          </p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar items por nombre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <Search className="w-5 h-5" />
                )}
                Buscar
              </button>
            </div>
          </div>
        </motion.div>

        {/* Sort Controls */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6"
          >
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => handleSort('name')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  sortBy === 'name' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <ArrowUpDown className="w-4 h-4" />
                Nombre
                {sortBy === 'name' && (
                  <span className="text-xs">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => handleSort('price')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  sortBy === 'price' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                Precio
                {sortBy === 'price' && (
                  <span className="text-xs">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => handleSort('profit')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  sortBy === 'profit' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Margen
                {sortBy === 'profit' && (
                  <span className="text-xs">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  <ItemCard
                    item={item}
                    price={getPriceForItem(item.id)}
                    showPrice={true}
                  />
                </motion.div>
              ))}
            </div>
          ) : searchQuery && !loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No se encontraron items que coincidan con tu búsqueda.</p>
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Busca items para ver sus precios en el Trading Post.</p>
            </div>
          )}
        </motion.div>

        {/* Market Stats */}
        {prices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Estadísticas del Mercado
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Precio Promedio</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      {formatPrice(
                        prices.reduce((sum, price) => sum + price.sells.unit_price, 0) / prices.length
                      )}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Margen Promedio</p>
                    <p className="text-2xl font-bold text-green-400">
                      {calculateProfitMargin(
                        prices.reduce((sum, price) => sum + price.buys.unit_price, 0) / prices.length,
                        prices.reduce((sum, price) => sum + price.sells.unit_price, 0) / prices.length
                      ).toFixed(1)}%
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Items Encontrados</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {items.length}
                    </p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
} 