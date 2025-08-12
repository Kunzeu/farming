'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Navigation from '@/components/layout/Navigation'
import { Search, Calculator, BarChart3, Target, Percent, DollarSign, Package, X, Plus, Shield } from 'lucide-react'
import { GW2Item, GW2Price, GW2Listing } from '@/types/gw2'
import { searchItems, getItemPrices, formatPrice, getPopularFarmingItems, getItemsByCategory, getItemListings } from '@/lib/gw2-api'
import { useAuth } from '@/contexts/AuthContext'
import { usePageTitle } from '@/hooks/usePageTitle'

interface CalculatorData {
  buyTotalValue: number
  buyToPrice: number
  buyPercentSupply: number
  buyQuantity: number
}

interface CalculatorMetrics {
  buyTotalValue: {
    value: number
    avgPrice: number
    maxPrice: number
    quantity: number
    totalValue: number
    percentage: number
    breakEvenPrice: number
  }
  buyToPrice: {
    value: number
    avgPrice: number
    maxPrice: number
    quantity: number
    totalValue: number
    percentage: number
    breakEvenPrice: number
  }
  buyPercentSupply: {
    value: number
    avgPrice: number
    maxPrice: number
    quantity: number
    totalValue: number
    percentage: number
    breakEvenPrice: number
  }
  buyQuantity: {
    value: number
    avgPrice: number
    maxPrice: number
    quantity: number
    totalValue: number
    percentage: number
    breakEvenPrice: number
  }
}

export default function BuyoutPage() {
  const { user } = useAuth()
  usePageTitle('Buyout Calculator')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<GW2Item[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [popularItems, setPopularItems] = useState<GW2Item[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedItem, setSelectedItem] = useState<GW2Item | null>(null)
  const [selectedItemPrice, setSelectedItemPrice] = useState<GW2Price | null>(null)
  const [selectedItemListing, setSelectedItemListing] = useState<GW2Listing | null>(null)
  const [calculatorData, setCalculatorData] = useState<CalculatorData>({
    buyTotalValue: 1000000, // 100g en cobre
    buyToPrice: 1000, // 10s en cobre
    buyPercentSupply: 50, // 50% del suministro
    buyQuantity: 1000 // 1000 items
  })

  // Cargar items populares al montar el componente
  useEffect(() => {
    const loadPopularItems = async () => {
      try {
        const items = await getPopularFarmingItems()
        setPopularItems(items.slice(0, 8))
      } catch (error) {
        console.error('Error loading popular items:', error)
      }
    }
    loadPopularItems()
  }, [])

  // Buscar items con autocompletado
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    setIsSearching(true)
    try {
      const results = await searchItems(searchQuery)
      setSearchResults(results.slice(0, 8))
      setShowSearchResults(true)
    } catch (error) {
      console.error('Error searching items:', error)
    } finally {
      setIsSearching(false)
    }
  }, [searchQuery])

  // Buscar automáticamente mientras el usuario escribe
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch()
    }, 300) // Esperar 300ms después de que el usuario deje de escribir

    return () => clearTimeout(timeoutId)
  }, [searchQuery, handleSearch])

  // Seleccionar item para calcular
  const selectItemForCalculation = async (item: GW2Item) => {
    try {
      const [priceData, listingData] = await Promise.all([
        getItemPrices([item.id]),
        getItemListings(item.id)
      ])
      const price = priceData[0]
      
      if (price && price.sells.unit_price > 0) {
        setSelectedItem(item)
        setSelectedItemPrice(price)
        setSelectedItemListing(listingData)
        setShowSearchResults(false)
        setSearchQuery('')
      }
    } catch (error) {
      console.error('Error selecting item:', error)
    }
  }

  // Calcular métricas para cada calculadora
  const calculateMetrics = useCallback((): CalculatorMetrics | null => {
    if (!selectedItem || !selectedItemPrice || !selectedItemListing) return null

    const currentPrice = selectedItemPrice.sells.unit_price
    const availableSupply = selectedItemListing.sells.reduce((total, listing) => total + listing.quantity, 0)
    const { buyTotalValue, buyToPrice, buyPercentSupply, buyQuantity } = calculatorData

    // Función para calcular cuántos items se pueden comprar con un presupuesto
    const calculateItemsForBudget = (budget: number) => {
      let totalCost = 0
      let totalItems = 0
      
      for (const listing of selectedItemListing.sells) {
        const costForThisListing = listing.quantity * listing.unit_price
        if (totalCost + costForThisListing <= budget) {
          totalCost += costForThisListing
          totalItems += listing.quantity
        } else {
          const remainingBudget = budget - totalCost
          const itemsFromThisListing = Math.floor(remainingBudget / listing.unit_price)
          totalCost += itemsFromThisListing * listing.unit_price
          totalItems += itemsFromThisListing
          break
        }
      }
      
      return { totalItems, totalCost }
    }

    // Función para calcular cuántos items se pueden comprar hasta un precio máximo
    const calculateItemsUpToPrice = (maxPrice: number) => {
      let totalCost = 0
      let totalItems = 0
      
      for (const listing of selectedItemListing.sells) {
        if (listing.unit_price <= maxPrice) {
          totalCost += listing.quantity * listing.unit_price
          totalItems += listing.quantity
        } else {
          break
        }
      }
      
      return { totalItems, totalCost }
    }

         // Calculadora 1: Buy Total Value
     const { totalItems: itemsForBudget, totalCost: actualCost } = calculateItemsForBudget(buyTotalValue)
     
     // Calcular el precio máximo real de los items comprados
     let maxPriceForBudget = currentPrice
     let itemsBoughtSoFar = 0
     for (const listing of selectedItemListing.sells) {
       if (itemsBoughtSoFar >= itemsForBudget) break
       const itemsFromThisListing = Math.min(listing.quantity, itemsForBudget - itemsBoughtSoFar)
       if (itemsFromThisListing > 0) {
         maxPriceForBudget = listing.unit_price
         itemsBoughtSoFar += itemsFromThisListing
       }
     }
     
     const buyTotalValueMetrics = {
       value: buyTotalValue,
       avgPrice: itemsForBudget > 0 ? Math.floor(actualCost / itemsForBudget) : currentPrice,
       maxPrice: maxPriceForBudget,
       quantity: itemsForBudget,
       totalValue: actualCost,
       percentage: availableSupply > 0 ? (itemsForBudget / availableSupply) * 100 : 0,
       breakEvenPrice: currentPrice
     }

         // Calculadora 2: Buy to Price
     const { totalItems: itemsUpToPrice, totalCost: costUpToPrice } = calculateItemsUpToPrice(buyToPrice)
     
     // Para Buy to Price, el precio máximo es el precio objetivo
     const buyToPriceMetrics = {
       value: buyToPrice,
       avgPrice: itemsUpToPrice > 0 ? Math.floor(costUpToPrice / itemsUpToPrice) : currentPrice,
       maxPrice: buyToPrice, // El precio máximo es el precio objetivo ingresado
       quantity: itemsUpToPrice,
       totalValue: costUpToPrice,
       percentage: availableSupply > 0 ? (itemsUpToPrice / availableSupply) * 100 : 0,
       breakEvenPrice: currentPrice
     }

         // Calculadora 3: Buy % of Supply
     const targetQuantity = Math.floor(availableSupply * (buyPercentSupply / 100))
     let totalCostForPercentage = 0
     let itemsBought = 0
     let maxPriceForPercentage = currentPrice
     
     for (const listing of selectedItemListing.sells) {
       if (itemsBought >= targetQuantity) break
       
       const itemsToBuy = Math.min(listing.quantity, targetQuantity - itemsBought)
       if (itemsToBuy > 0) {
         totalCostForPercentage += itemsToBuy * listing.unit_price
         maxPriceForPercentage = listing.unit_price // El precio más alto de los items comprados
         itemsBought += itemsToBuy
       }
     }
     
     const buyPercentSupplyMetrics = {
       value: buyPercentSupply,
       avgPrice: itemsBought > 0 ? Math.floor(totalCostForPercentage / itemsBought) : currentPrice,
       maxPrice: maxPriceForPercentage,
       quantity: itemsBought,
       totalValue: totalCostForPercentage,
       percentage: buyPercentSupply,
       breakEvenPrice: currentPrice
     }

         // Calculadora 4: Buy Quantity
     let totalCostForQuantity = 0
     let itemsBoughtForQuantity = 0
     let maxPriceForQuantity = currentPrice
     
     for (const listing of selectedItemListing.sells) {
       if (itemsBoughtForQuantity >= buyQuantity) break
       
       const itemsToBuy = Math.min(listing.quantity, buyQuantity - itemsBoughtForQuantity)
       if (itemsToBuy > 0) {
         totalCostForQuantity += itemsToBuy * listing.unit_price
         maxPriceForQuantity = listing.unit_price // El precio más alto de los items comprados
         itemsBoughtForQuantity += itemsToBuy
       }
     }
     
     const buyQuantityMetrics = {
       value: buyQuantity,
       avgPrice: itemsBoughtForQuantity > 0 ? Math.floor(totalCostForQuantity / itemsBoughtForQuantity) : currentPrice,
       maxPrice: maxPriceForQuantity,
       quantity: itemsBoughtForQuantity,
       totalValue: totalCostForQuantity,
       percentage: availableSupply > 0 ? (itemsBoughtForQuantity / availableSupply) * 100 : 0,
       breakEvenPrice: currentPrice
     }

    return {
      buyTotalValue: buyTotalValueMetrics,
      buyToPrice: buyToPriceMetrics,
      buyPercentSupply: buyPercentSupplyMetrics,
      buyQuantity: buyQuantityMetrics
    }
  }, [selectedItem, selectedItemPrice, selectedItemListing, calculatorData])

  // Actualizar calculadora
  const updateCalculator = (field: keyof CalculatorData, value: number) => {
    setCalculatorData(prev => ({
      ...prev,
      [field]: Math.max(0, value)
    }))
  }



  // Buscar por categoría
  const handleCategorySearch = async (category: string) => {
    setIsSearching(true)
    setSelectedCategory(category)
    try {
      const results = await getItemsByCategory(category)
      setSearchResults(results.slice(0, 8))
      setShowSearchResults(true)
    } catch (error) {
      console.error('Error searching by category:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowSearchResults(false)
    setSelectedCategory('')
  }

  const metrics = calculateMetrics()

  // Verificar si el usuario es admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <Navigation />
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Shield className="w-24 h-24 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-white mb-4">Acceso Restringido</h1>
            <p className="text-gray-300 text-lg mb-6">
              Esta página solo está disponible para administradores.
            </p>
            <p className="text-gray-400">
              Necesitas permisos de administrador para acceder a la calculadora de buyout.
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Calculator className="w-8 h-8 text-cyan-400" />
            Buyout Calculator
          </h1>
                     <p className="text-gray-300 text-lg">
             Calcula el costo total de comprar items directamente del Trading Post
           </p>
           <p className="text-cyan-400 text-sm mt-2">
             Ejemplo: Por menos de 1000g puedes comprar el 81% de todos los Espárragos en el TP
           </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel de búsqueda */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-400" />
                Buscar Items
              </h2>
              
              <div className="space-y-4">
                                 <div className="relative">
                   <input
                     type="text"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder="Buscar items por nombre..."
                     className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                   />
                   <div className="absolute right-2 top-2 flex gap-1">
                     {searchQuery && (
                       <button
                         onClick={clearSearch}
                         className="p-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                       >
                         <X className="w-3 h-3 text-white" />
                       </button>
                     )}
                     {isSearching && (
                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-400"></div>
                     )}
                   </div>
                 </div>

                {/* Categorías populares */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Categorías:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['materials', 'ores', 'wood', 'festival'].map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategorySearch(category)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          selectedCategory === category
                            ? 'bg-cyan-600 text-white'
                            : 'bg-gray-600 text-gray-300 hover:bg-gray-500 hover:text-white'
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {isSearching && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Buscando...</p>
                  </div>
                )}

                                 {/* Resultados de búsqueda con autocompletado */}
                 {showSearchResults && searchResults.length > 0 && (
                   <div className="bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
                     <h3 className="text-white font-semibold mb-3">Sugerencias:</h3>
                     <div className="space-y-2">
                       {searchResults.map((item) => (
                         <motion.div
                           key={item.id}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className="flex items-center justify-between p-3 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors cursor-pointer"
                           onClick={() => selectItemForCalculation(item)}
                         >
                           <div className="flex items-center gap-3">
                             {item.icon && (
                               <img 
                                 src={item.icon} 
                                 alt={item.name}
                                 className="w-8 h-8 rounded"
                               />
                             )}
                             <div>
                               <p className="text-white font-medium text-sm">
                                 {item.name} <span className="text-cyan-400">[{item.id}]</span>
                               </p>
                               <p className="text-gray-300 text-xs">Nivel {item.level}</p>
                             </div>
                           </div>
                           <Plus className="w-4 h-4 text-cyan-400" />
                         </motion.div>
                       ))}
                     </div>
                   </div>
                 )}

                {showSearchResults && searchResults.length === 0 && !isSearching && (
                  <div className="text-center py-4">
                    <Package className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-gray-400">No se encontraron items</p>
                  </div>
                )}

                {/* Items populares */}
                {!showSearchResults && popularItems.length > 0 && (
                  <div>
                    <h3 className="text-white font-semibold mb-3">Items Populares:</h3>
                    <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                      {popularItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center justify-between p-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition-colors cursor-pointer"
                          onClick={() => selectItemForCalculation(item)}
                        >
                          <div className="flex items-center gap-2">
                            {item.icon && (
                              <img 
                                src={item.icon} 
                                alt={item.name}
                                className="w-6 h-6 rounded"
                              />
                            )}
                                                         <div>
                               <p className="text-white text-sm font-medium">
                                 {item.name} <span className="text-cyan-400">[{item.id}]</span>
                               </p>
                               <p className="text-gray-300 text-xs">Nivel {item.level}</p>
                             </div>
                          </div>
                          <Plus className="w-4 h-4 text-cyan-400" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Calculadoras */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3"
          >
            {!selectedItem ? (
              <div className="text-center py-12">
                <Calculator className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Selecciona un item para calcular</p>
                <p className="text-gray-500 text-sm">Busca y selecciona un item para ver las calculadoras</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Item seleccionado */}
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {selectedItem.icon && (
                        <img 
                          src={selectedItem.icon} 
                          alt={selectedItem.name}
                          className="w-16 h-16 rounded"
                        />
                      )}
                      <div>
                        <h3 className="text-white text-xl font-bold">{selectedItem.name}</h3>
                        <p className="text-gray-300">Nivel {selectedItem.level}</p>
                        {selectedItemPrice && (
                          <p className="text-cyan-400 font-semibold">
                            Precio actual: {formatPrice(selectedItemPrice.sells.unit_price)}
                          </p>
                        )}
                      </div>
                    </div>
                                         <button
                       onClick={() => {
                         setSelectedItem(null)
                         setSelectedItemPrice(null)
                         setSelectedItemListing(null)
                       }}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Grid de calculadoras */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Calculadora 1: Buy Total Value */}
                  <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <h3 className="text-white font-bold">Buy Total Value</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                                                 <label className="block text-gray-300 text-sm mb-2">Presupuesto Total (cobre)</label>
                        <input
                          type="number"
                          value={calculatorData.buyTotalValue}
                          onChange={(e) => updateCalculator('buyTotalValue', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-center font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="0"
                        />
                      </div>
                      
                      {metrics && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Buy Total Value:</span>
                            <span className="text-white">{formatPrice(metrics.buyTotalValue.value)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Avg Price:</span>
                            <span className="text-white">{formatPrice(metrics.buyTotalValue.avgPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Max Price:</span>
                            <span className="text-white">{formatPrice(metrics.buyTotalValue.maxPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Quantity:</span>
                            <span className="text-white">{metrics.buyTotalValue.quantity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Value:</span>
                            <span className="text-white">{formatPrice(metrics.buyTotalValue.totalValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Percentage:</span>
                            <span className="text-white">{metrics.buyTotalValue.percentage.toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Break Even Price:</span>
                            <span className="text-white">{formatPrice(metrics.buyTotalValue.breakEvenPrice)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Calculadora 2: Buy to Price */}
                  <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-blue-400" />
                      <h3 className="text-white font-bold">Buy to Price</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                                                 <label className="block text-gray-300 text-sm mb-2">Precio Máximo por Item (cobre)</label>
                        <input
                          type="number"
                          value={calculatorData.buyToPrice}
                          onChange={(e) => updateCalculator('buyToPrice', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-center font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="0"
                        />
                      </div>
                      
                      {metrics && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Buy to Price:</span>
                            <span className="text-white">{formatPrice(metrics.buyToPrice.value)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Avg Price:</span>
                            <span className="text-white">{formatPrice(metrics.buyToPrice.avgPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Max Price:</span>
                            <span className="text-white">{formatPrice(metrics.buyToPrice.maxPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Quantity:</span>
                            <span className="text-white">{metrics.buyToPrice.quantity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Value:</span>
                            <span className="text-white">{formatPrice(metrics.buyToPrice.totalValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Percentage:</span>
                            <span className="text-white">{metrics.buyToPrice.percentage.toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Break Even Price:</span>
                            <span className="text-white">{formatPrice(metrics.buyToPrice.breakEvenPrice)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Calculadora 3: Buy % of Supply */}
                  <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Percent className="w-5 h-5 text-purple-400" />
                      <h3 className="text-white font-bold">Buy % of Supply</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                                                 <label className="block text-gray-300 text-sm mb-2">Porcentaje del Suministro Total</label>
                        <input
                          type="number"
                          value={calculatorData.buyPercentSupply}
                          onChange={(e) => updateCalculator('buyPercentSupply', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-center font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </div>
                      
                      {metrics && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Buy % of Supply:</span>
                            <span className="text-white">{metrics.buyPercentSupply.value.toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Avg Price:</span>
                            <span className="text-white">{formatPrice(metrics.buyPercentSupply.avgPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Max Price:</span>
                            <span className="text-white">{formatPrice(metrics.buyPercentSupply.maxPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Quantity:</span>
                            <span className="text-white">{metrics.buyPercentSupply.quantity.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Value:</span>
                            <span className="text-white">{formatPrice(metrics.buyPercentSupply.totalValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Percentage:</span>
                            <span className="text-white">{metrics.buyPercentSupply.percentage.toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Break Even Price:</span>
                            <span className="text-white">{formatPrice(metrics.buyPercentSupply.breakEvenPrice)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Calculadora 4: Buy Quantity */}
                  <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <BarChart3 className="w-5 h-5 text-orange-400" />
                      <h3 className="text-white font-bold">Buy Quantity</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                                                 <label className="block text-gray-300 text-sm mb-2">Cantidad Total de Items</label>
                        <input
                          type="number"
                          value={calculatorData.buyQuantity}
                          onChange={(e) => updateCalculator('buyQuantity', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-center font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          placeholder="0"
                        />
                      </div>
                      
                      {metrics && (
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Buy Quantity:</span>
                            <span className="text-white">{metrics.buyQuantity.value}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Avg Price:</span>
                            <span className="text-white">{formatPrice(metrics.buyQuantity.avgPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Max Price:</span>
                            <span className="text-white">{formatPrice(metrics.buyQuantity.maxPrice)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Quantity:</span>
                            <span className="text-white">{metrics.buyQuantity.quantity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Value:</span>
                            <span className="text-white">{formatPrice(metrics.buyQuantity.totalValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Percentage:</span>
                            <span className="text-white">{metrics.buyQuantity.percentage.toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-300">Break Even Price:</span>
                            <span className="text-white">{formatPrice(metrics.buyQuantity.breakEvenPrice)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 text-green-400" />
                      <h4 className="text-white font-semibold">Información del Mercado</h4>
                    </div>
                                         {selectedItemPrice && selectedItemListing && (
                       <div className="space-y-1 text-sm">
                         <p className="text-gray-300">Suministro total: <span className="text-white">{selectedItemListing.sells.reduce((total, listing) => total + listing.quantity, 0).toLocaleString()}</span></p>
                         <p className="text-gray-300">Precio actual: <span className="text-white">{formatPrice(selectedItemPrice.sells.unit_price)}</span></p>
                         <p className="text-gray-300">Órdenes de venta: <span className="text-white">{selectedItemListing.sells.length}</span></p>
                       </div>
                     )}
                  </div>

                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="w-5 h-5 text-blue-400" />
                      <h4 className="text-white font-semibold">Compra Inmediata</h4>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Los precios mostrados son para compra directa del Trading Post
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
} 