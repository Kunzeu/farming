'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Package, TrendingUp, TrendingDown, Calculator, ArrowLeft, RefreshCw, Info, BookOpen, ChevronDown } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Link from 'next/link';

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

// Datos base de materiales para Common Unidentified Gear
// Basado en datos de GW2 Wiki para Common Unidentified Gear
const baseMaterials: Omit<Material, 'sellPrice' | 'processedPrice'>[] = [
  { id: 19748, name: "Seda", icon: "", dropRate: 0.25, category: 'common' },
  { id: 19745, name: "Gasa", icon: "", dropRate: 0.02, category: 'fine' },
  { id: 19722, name: "Madera T5", icon: "", dropRate: 0.28, category: 'common' },
  { id: 19725, name: "Madera T6", icon: "", dropRate: 0.015, category: 'fine' },
  { id: 19729, name: "Cuero T5", icon: "", dropRate: 0.22, category: 'common' },
  { id: 19732, name: "Cuero T6", icon: "", dropRate: 0.012, category: 'fine' },
  { id: 19700, name: "Mithril", icon: "", dropRate: 0.35, category: 'common' },
  { id: 19701, name: "Orica​lco", icon: "", dropRate: 0.025, category: 'fine' },
  { id: 89140, name: "Mota", icon: "", dropRate: 0.85, category: 'common' },
  { id: 19721, name: "Ectos", icon: "", dropRate: 0.001, category: 'exotic' }
];

export default function UnidentifiedGearCommonPage() {
  const [quantity, setQuantity] = useState(250);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [results, setResults] = useState<SalvageResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const kitCost = 3; // Copper-Fed Salvage-o-Matic cost per use
  const [unidentifiedGearPrice, setUnidentifiedGearPrice] = useState<number | null>(null);

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
      
      // Obtener precio del Common Unidentified Gear (ID: 85016)
      const unidGearResponse = await fetch('https://api.guildwars2.com/v2/commerce/prices/85016');
      const unidGearData = await unidGearResponse.json();
      
      // Usar precio de compra (buys) para calcular costo real
      if (unidGearData.buys && unidGearData.buys.unit_price) {
        setUnidentifiedGearPrice(unidGearData.buys.unit_price);
      } else {
        console.warn('No se pudo obtener el precio de Common Unidentified Gear');
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
      const now = new Date();
      setLastUpdated(now);
      // setNextUpdate(new Date(now.getTime() + 120000)); // 2 minutos después
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
        const expectedQuantity = material.dropRate * quantity; // Sin redondear
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

  // Cargar precios al montar el componente y actualizar cada 2 minutos
  useEffect(() => {
    fetchPrices();
    
    // Actualizar precios automáticamente cada 2 minutos (120000 ms)
    const interval = setInterval(() => {
      fetchPrices();
    }, 120000);
    
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, [fetchPrices]);

  // Cálculos de resumen
  const totalMaterialsValue = results.reduce((sum, result) => sum + result.totalValue, 0);
  const totalKitCost = quantity * kitCost;
  const totalCost = unidentifiedGearPrice ? quantity * unidentifiedGearPrice : 0;
  const totalProfit = totalMaterialsValue - totalCost - totalKitCost;

  const formatCurrency = (copper: number) => {
    const roundedCopper = Math.round(copper);
    const gold = Math.floor(roundedCopper / 10000);
    const silver = Math.floor((roundedCopper % 10000) / 100);
    const copperRemainder = roundedCopper % 100;
    
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
        {/* Header con navegación */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/salvage" 
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver a Salvaging</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="https://render.guildwars2.com/file/E37A036C10C33E4242E568690CB2EA55AA65B915/1938436.png"
              alt="Piece of Common Unidentified Gear"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Unidentified Gear - Common</h1>
              <p className="text-gray-400">Calcula cuánto oro ganas al abrir y reciclar Piece of Common Unidentified Gear</p>
            </div>
          </div>
          
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <RefreshCw className="h-4 w-4" />
              <span>Última actualización: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
        </div>

        {/* Dropdown de navegación */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              <span>Common</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-10 min-w-[200px]">
                <Link href="/salvage/unidentified-gear/common">
                  <div className="px-4 py-3 hover:bg-slate-700 transition-colors cursor-pointer border-b border-slate-600 bg-blue-600/20">
                    <div className="flex items-center gap-3">
                      <Image
                        src="https://render.guildwars2.com/file/E37A036C10C33E4242E568690CB2EA55AA65B915/1938436.png"
                        alt="Common"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      <span className="text-white font-semibold">Common</span>
                    </div>
                  </div>
                </Link>
                <Link href="/salvage/unidentified-gear/masterwork">
                  <div className="px-4 py-3 hover:bg-slate-700 transition-colors cursor-pointer border-b border-slate-600">
                    <div className="flex items-center gap-3">
                      <Image
                        src="https://render.guildwars2.com/file/B147379DFC5430E207FCB742804E199EDF727719/1766400.png"
                        alt="Masterwork"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      <span className="text-white">Masterwork</span>
                    </div>
                  </div>
                </Link>
                <Link href="/salvage/unidentified-gear/rare">
                  <div className="px-4 py-3 hover:bg-slate-700 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Image
                        src="https://render.guildwars2.com/file/EF63A10BD2317CECCEA63A3B7E6555550B414C4E/1766399.png"
                        alt="Rare"
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                      <span className="text-white">Rare</span>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Información del item */}
        <div className="bg-slate-800 rounded-lg shadow-md p-6 mb-6 border border-slate-700">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="https://render.guildwars2.com/file/68A875CAEC167AE97D3B9248A1014999D40CAEF5/2075500.png"
              alt="Copper-Fed Salvage-o-Matic"
              width={48}
              height={48}
              className="w-12 h-12"
            />
            <div>
              <h2 className="text-xl font-semibold text-white">Copper-Fed Salvage-o-Matic</h2>
              <p className="text-gray-400">Kit recomendado para Common Unidentified Gear</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="text-gray-400">Costo por uso</div>
              <div className="text-white font-semibold">3 cobre</div>
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="text-gray-400">Drop rates</div>
              <div className="text-white font-semibold">Estimados</div>
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="text-gray-400">Rentabilidad</div>
              <div className="text-yellow-400 font-semibold">Baja-Moderada</div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-slate-800 rounded-lg shadow-md p-6 mb-6 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cantidad de Common Unidentified Gear
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-white bg-slate-700 font-medium"
                min="1"
                max="10000"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchPrices}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Actualizar Precios
              </button>
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
              <span className="font-semibold">Costo {quantity} Common Gear</span>
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
                      {Math.round(result.quantity)}
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
        <div className="mt-6 bg-green-900/20 border border-green-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-green-400 mt-0.5" />
            <div className="text-sm text-green-200">
              <strong>Nota:</strong> Los precios se obtienen en tiempo real desde la <a href="https://api.guildwars2.com/v2/commerce/prices" target="_blank" className="text-green-300 hover:text-green-100 underline">API de GW2</a>. 
              El &quot;Precio Procesado&quot; incluye las comisiones del Trading Post (15% de descuento sobre el precio de venta).
              El costo de Common Unidentified Gear usa el precio de compra actual del Trading Post.
              Los drop rates son estimados basados en datos de la comunidad para <strong>Piece of Common Unidentified Gear</strong> abierto y luego reciclado con <strong>Copper-Fed Salvage-o-Matic</strong>.
            </div>
          </div>
        </div>
        
        {/* Link a Wiki */}
        <div className="mt-4 text-center">
          <a 
            href="https://wiki.guildwars2.com/wiki/Piece_of_Common_Unidentified_Gear" 
            target="_blank" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            Ver en GW2 Wiki
          </a>
        </div>
      </div>
    </>
  );
} 