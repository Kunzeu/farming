'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Package, TrendingUp, TrendingDown, Calculator } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';

interface Material {
  id: number;
  name: string;
  icon: string;
  dropRate: number;
  sellPrice: number;
  processedPrice: number;
  category: 'common' | 'fine' | 'masterwork' | 'rare' | 'exotic';
}

interface SalvageResult {
  material: Material;
  quantity: number;
  totalValue: number;
}

// Datos base de materiales con sus drop rates y IDs de GW2 API
// Basado en: https://wiki.guildwars2.com/wiki/Piece_of_Unidentified_Gear/Salvage_Rate
// Salvage after identifying with Runecrafter's Salvage-o-Matic
const baseMaterials: Omit<Material, 'sellPrice' | 'processedPrice'>[] = [
  { id: 19748, name: "Seda", icon: "", dropRate: 0.34174, category: 'common' },
  { id: 19745, name: "Gasa", icon: "", dropRate: 0.01866, category: 'fine' },
  { id: 19722, name: "Madera T5", icon: "", dropRate: 0.36104, category: 'common' },
  { id: 19725, name: "Madera T6", icon: "", dropRate: 0.02806, category: 'fine' },
  { id: 19729, name: "Cuero T5", icon: "", dropRate: 0.27492, category: 'common' },
  { id: 19732, name: "Cuero T6", icon: "", dropRate: 0.0173, category: 'fine' },
  { id: 19700, name: "Mithril", icon: "", dropRate: 0.45640, category: 'common' },
  { id: 19701, name: "Orica​lco", icon: "", dropRate: 0.03854, category: 'fine' },
  { id: 89140, name: "Mota", icon: "", dropRate: 0.98114, category: 'common' },
  { id: 89182, name: "Dolor", icon: "", dropRate: 0.00378, category: 'rare' },
  { id: 89141, name: "Mejora", icon: "", dropRate: 0.00464, category: 'rare' },
  { id: 89098, name: "Control", icon: "", dropRate: 0.00192, category: 'rare' },
  { id: 89103, name: "Brillantez", icon: "", dropRate: 0.00438, category: 'rare' },
  { id: 89258, name: "Potencia", icon: "", dropRate: 0.00224, category: 'rare' },
  { id: 89216, name: "Habilidad", icon: "", dropRate: 0.0027, category: 'rare' },
  { id: 19721, name: "Ectos", icon: "", dropRate: 0.030708, category: 'exotic' }
];

export default function SalvagePage() {
  const [quantity, setQuantity] = useState(250);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [results, setResults] = useState<SalvageResult[]>([]);
  const [loading, setLoading] = useState(true);
  const kitCost = 30; // Runecrafter's Salvage-o-Matic cost per use (fixed)
  const [unidentifiedGearPrice, setUnidentifiedGearPrice] = useState<number | null>(null); // No default price

  // Función para obtener precios desde GW2 API
  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      const itemIds = baseMaterials.map(m => m.id).join(',');
      
      // Obtener información básica de items
      const itemsResponse = await fetch(`https://api.guildwars2.com/v2/items?ids=${itemIds}`);
      const itemsData = await itemsResponse.json();
      
      // Obtener precios del Trading Post para materiales
      const pricesResponse = await fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${itemIds}`);
      const pricesData = await pricesResponse.json();
      
      // Obtener precio del Unidentified Gear (ID: 84731)
      const unidGearResponse = await fetch('https://api.guildwars2.com/v2/commerce/prices/84731');
      const unidGearData = await unidGearResponse.json();
      
             // Usar precio de compra (buys) para calcular costo real
       if (unidGearData.buys && unidGearData.buys.unit_price) {
         setUnidentifiedGearPrice(unidGearData.buys.unit_price);
       } else {
         console.warn('No se pudo obtener el precio de Unidentified Gear');
       }
      
             // Combinar datos
       const materialsWithPrices: Material[] = baseMaterials.map(baseMaterial => {
         const itemData = itemsData.find((item: { id: number }) => item.id === baseMaterial.id);
         const priceData = pricesData.find((price: { id: number }) => price.id === baseMaterial.id);
        
        return {
          ...baseMaterial,
          name: itemData?.name || baseMaterial.name,
          icon: itemData?.icon || '',
          sellPrice: priceData?.sells?.unit_price || 0,
          processedPrice: Math.round((priceData?.sells?.unit_price || 0) * 0.85), // Precio después de fees TP
        };
      });
      
      setMaterials(materialsWithPrices);
    } catch (error) {
      console.error('Error fetching prices:', error);
      // Fallback con precios por defecto
      const fallbackMaterials: Material[] = baseMaterials.map(base => ({
        ...base,
        sellPrice: 0,
        processedPrice: 0
      }));
      setMaterials(fallbackMaterials);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calcular resultados cuando cambien materiales o cantidad
  useEffect(() => {
    if (materials.length > 0) {
      const newResults: SalvageResult[] = materials.map(material => {
        const expectedQuantity = Math.round(material.dropRate * quantity);
        const totalValue = expectedQuantity * material.processedPrice;
        
        return {
          material,
          quantity: expectedQuantity,
          totalValue
        };
      });
      
      setResults(newResults);
    }
  }, [materials, quantity]);

  // Cargar precios al montar el componente
  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  // Cálculos de resumen
  const totalMaterialsValue = results.reduce((sum, result) => sum + result.totalValue, 0);
  const totalKitCost = quantity * kitCost;
  const totalCost = unidentifiedGearPrice ? quantity * unidentifiedGearPrice : 0; // Costo real del Trading Post
  const totalProfit = totalMaterialsValue - totalCost - totalKitCost;

  const formatCurrency = (copper: number) => {
    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const copperRemainder = copper % 100;
    
    if (gold > 0) {
      return `${gold}g ${silver}s ${copperRemainder}c`;
    } else if (silver > 0) {
      return `${silver}s ${copperRemainder}c`;
    } else {
      return `${copperRemainder}c`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando precios desde GW2 API...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Package className="h-8 w-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">Calculadora de Salvage</h1>
        </div>
        <p className="text-gray-300 text-lg">
          Calcula las ganancias esperadas al desmontar <strong className="text-green-400">Piece of Unidentified Gear (Masterwork)</strong> identificados primero
        </p>
      </div>

      {/* Controles */}
      <div className="bg-slate-800 rounded-lg shadow-md p-6 mb-6 border border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cantidad de Unidentified Gear
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white bg-slate-700 font-medium"
              min="1"
              max="10000"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchPrices}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Actualizar Precios
            </button>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-slate-700 rounded-md border border-slate-600">
          <div className="flex items-center gap-3">
            <Image
              src="https://render.guildwars2.com/file/68A875CAEC167AE97D3B9248A1014999D40CAEF5/2075500.png"
              alt="Runecrafter's Salvage-o-Matic"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <p className="text-sm text-gray-300">Runecrafter&apos;s Salvage-o-Matic (30 cobre por uso)
            </p>
          </div>
        </div>
      </div>

      {/* Resumen financiero */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700">
          <div className="flex items-center gap-2 text-blue-300 mb-2">
            <Calculator className="h-5 w-5" />
            <span className="font-semibold">Valor Total Materiales</span>
          </div>
          <p className="text-2xl font-bold text-blue-200">{formatCurrency(totalMaterialsValue)}</p>
        </div>
        
        <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
          <div className="flex items-center gap-2 text-red-300 mb-2">
            <Package className="h-5 w-5" />
            <span className="font-semibold">Costo {quantity} Unid. Gear</span>
          </div>
          {unidentifiedGearPrice ? (
            <>
              <p className="text-2xl font-bold text-red-200">{formatCurrency(totalCost)}</p>
              <p className="text-xs text-red-400 mt-1">
                {formatCurrency(unidentifiedGearPrice || 0)} cada uno (TP)
              </p>
            </>
          ) : (
            <p className="text-lg text-red-300">Cargando precio...</p>
          )}
        </div>
        
        <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-700">
          <div className="flex items-center gap-2 text-orange-300 mb-2">
            <Package className="h-5 w-5" />
            <span className="font-semibold">Costo Kit</span>
          </div>
          <p className="text-2xl font-bold text-orange-200">{formatCurrency(totalKitCost)}</p>
        </div>
        
        <div className={`rounded-lg p-4 border ${totalProfit >= 0 ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700'}`}>
          <div className={`flex items-center gap-2 mb-2 ${totalProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            {totalProfit >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            <span className="font-semibold">Ganancia Total</span>
          </div>
          <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-200' : 'text-red-200'}`}>
            {formatCurrency(Math.abs(totalProfit))}
          </p>
        </div>
      </div>

      {/* Tabla de materiales */}
      <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden border border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Material
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Drop Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Precio Venta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Precio Procesado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Cantidad ({quantity})
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Valor Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {results.map((result, index) => (
                <motion.tr
                  key={result.material.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {result.material.icon && (
                        <Image 
                          src={result.material.icon} 
                          alt={result.material.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 mr-3"
                        />
                      )}
                      <span className="text-sm font-medium text-gray-200">
                        {result.material.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {(result.material.dropRate * 100).toFixed(3)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatCurrency(result.material.sellPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="text-green-400 font-medium">
                      {formatCurrency(result.material.processedPrice)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-medium">
                    {result.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-400">
                    {formatCurrency(result.totalValue)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nota informativa */}
      <div className="mt-6 bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <p className="text-sm text-blue-200">
                    <strong>Nota:</strong> Los precios se obtienen en tiempo real desde la <a href="https://api.guildwars2.com/v2/commerce/prices" target="_blank" className="text-blue-300 hover:text-blue-100 underline">API de GW2</a>. 
          El &quot;Precio Procesado&quot; incluye las comisiones del Trading Post (15% de descuento sobre el precio de venta).
          El costo de Unidentified Gear usa el precio de compra actual del Trading Post.
          Los drop rates están basados en datos oficiales de la <a href="https://wiki.guildwars2.com/wiki/Piece_of_Unidentified_Gear/Salvage_Rate" target="_blank" className="text-blue-300 hover:text-blue-100 underline">GW2 Wiki</a>{' '}
          para <strong>Piece of Unidentified Gear</strong> salvado con <strong>Runecrafter&apos;s Salvage-o-Matic</strong>.
        </p>
      </div>
    </div>
    </>
  );
}