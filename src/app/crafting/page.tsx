'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '@/components/layout/Navigation';
import ItemCard from '@/components/ui/ItemCard';
import { 
  Calculator, 
  Search, 
  TrendingUp, 
  DollarSign,
  Clock,
  Plus,
  Minus
} from 'lucide-react';
import { 
  getRecipe, 
  getItem, 
  getItemPrice, 
  formatPrice 
} from '@/lib/gw2-api';
import { GW2Recipe, GW2Item, GW2Price } from '@/types/gw2';

export default function Crafting() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<GW2Recipe | null>(null);
  const [recipeItem, setRecipeItem] = useState<GW2Item | null>(null);
  const [recipePrice, setRecipePrice] = useState<GW2Price | null>(null);
  const [ingredients, setIngredients] = useState<Array<{item: GW2Item, price: GW2Price | null, quantity: number}>>([]);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Recetas de ejemplo
  const exampleRecipes = [
    { id: 1, name: 'Orichalcum Ingot', type: 'Refinement', output: 'Orichalcum Ingot' },
    { id: 2, name: 'Ancient Wood Plank', type: 'Refinement', output: 'Ancient Wood Plank' },
    { id: 3, name: 'Gossamer Insignia', type: 'Crafting', output: 'Gossamer Insignia' },
    { id: 4, name: 'Deldrimor Steel Ingot', type: 'Refinement', output: 'Deldrimor Steel Ingot' },
    { id: 5, name: 'Spiritwood Plank', type: 'Refinement', output: 'Spiritwood Plank' },
  ];

  const calculateTotalCost = () => {
    return ingredients.reduce((total, ingredient) => {
      if (ingredient.price) {
        return total + (ingredient.price.buys.unit_price * ingredient.quantity);
      }
      return total;
    }, 0);
  };

  const calculateProfit = () => {
    if (!recipePrice) return 0;
    const totalCost = calculateTotalCost();
    const totalRevenue = recipePrice.sells.unit_price * quantity;
    return totalRevenue - totalCost;
  };

  const calculateProfitMargin = () => {
    const totalCost = calculateTotalCost();
    if (totalCost === 0) return 0;
    const profit = calculateProfit();
    return (profit / totalCost) * 100;
  };

  const handleRecipeSelect = async (recipeId: number) => {
    setLoading(true);
    try {
      const recipe = await getRecipe(recipeId);
      setSelectedRecipe(recipe);
      
      // Obtener información del item de salida
      const item = await getItem(recipe.output_item_id);
      setRecipeItem(item);
      
      const price = await getItemPrice(recipe.output_item_id);
      setRecipePrice(price);
      
      // Obtener información de los ingredientes
      const ingredientPromises = recipe.ingredients.map(async (ing) => {
        const item = await getItem(ing.item_id);
        const price = await getItemPrice(ing.item_id);
        return { item, price, quantity: ing.count };
      });
      
      const ingredientResults = await Promise.all(ingredientPromises);
      setIngredients(ingredientResults);
    } catch (error) {
      console.error('Error loading recipe:', error);
    } finally {
      setLoading(false);
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
            Calculadora de Crafting
          </h1>
          <p className="text-xl text-gray-300">
            Calcula costos, ganancias y optimiza tu crafting en Guild Wars 2
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recipe Selection */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Seleccionar Receta</h2>
              
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar recetas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Recipe List */}
              <div className="space-y-2">
                {exampleRecipes
                  .filter(recipe => recipe.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((recipe) => (
                    <button
                      key={recipe.id}
                      onClick={() => handleRecipeSelect(recipe.id)}
                      disabled={loading}
                      className="w-full text-left p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500 transition-all duration-200 disabled:opacity-50"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-white font-semibold">{recipe.name}</h3>
                          <p className="text-gray-400 text-sm">{recipe.type}</p>
                        </div>
                        <Calculator className="w-5 h-5 text-purple-400" />
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Quantity Control */}
            {selectedRecipe && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <h3 className="text-white font-semibold mb-4">Cantidad a Craftear</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <Minus className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-2xl font-bold text-white min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-white" />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Recipe Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : selectedRecipe && recipeItem ? (
              <>
                {/* Recipe Output */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-4">Resultado</h2>
                  <ItemCard
                    item={recipeItem}
                    price={recipePrice}
                    showPrice={true}
                  />
                </div>

                {/* Ingredients */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Ingredientes</h3>
                  <div className="space-y-4">
                    {ingredients.map((ingredient, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex-1">
                          <ItemCard
                            item={ingredient.item}
                            price={ingredient.price}
                            showPrice={true}
                          />
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-sm">Cantidad</p>
                          <p className="text-white font-bold">{ingredient.quantity * quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost Analysis */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-xl font-bold text-white mb-4">Análisis de Costos</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Costo Total:</span>
                      <span className="text-red-400 font-bold">
                        {formatPrice(calculateTotalCost() * quantity)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ingresos Esperados:</span>
                      <span className="text-green-400 font-bold">
                        {recipePrice ? formatPrice(recipePrice.sells.unit_price * quantity) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Ganancia:</span>
                      <span className={`font-bold ${calculateProfit() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatPrice(calculateProfit())}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Margen de Ganancia:</span>
                      <span className={`font-bold ${calculateProfitMargin() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {calculateProfitMargin().toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Calculator className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Selecciona una receta para ver el análisis de costos.</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Consejos para Crafting
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <TrendingUp className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Análisis de Mercado</h3>
              <p className="text-gray-400 text-sm">
                Siempre verifica los precios actuales antes de craftear. Los precios pueden cambiar rápidamente.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <Clock className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Timing</h3>
              <p className="text-gray-400 text-sm">
                Craftea durante las horas de baja actividad para obtener materiales más baratos.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <DollarSign className="w-8 h-8 text-yellow-400 mb-4" />
              <h3 className="text-white font-semibold mb-2">Escala</h3>
              <p className="text-gray-400 text-sm">
                Considera craftear en grandes cantidades para reducir costos de transacción.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 