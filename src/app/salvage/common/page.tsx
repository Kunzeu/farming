'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Package, TrendingUp, TrendingDown, Calculator, ArrowLeft, RefreshCw, Info, BookOpen, ChevronDown } from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Link from 'next/link';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';

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
// Basado en datos actualizados de la tabla proporcionada
const baseMaterials: Omit<Material, 'sellPrice' | 'processedPrice'>[] = [
  { id: 19748, name: "Seda", icon: "", dropRate: 0.29826, category: 'common' },
  { id: 19745, name: "Gasa", icon: "", dropRate: 0.01596, category: 'fine' },
  { id: 19722, name: "Madera T5", icon: "", dropRate: 0.3687, category: 'common' },
  { id: 19725, name: "Madera T6", icon: "", dropRate: 0.03218, category: 'fine' },
  { id: 19729, name: "Cuero T5", icon: "", dropRate: 0.2394, category: 'common' },
  { id: 19732, name: "Cuero T6", icon: "", dropRate: 0.01618, category: 'fine' },
  { id: 19700, name: "Mithril", icon: "", dropRate: 0.43076, category: 'common' },
  { id: 19701, name: "Orica​lco", icon: "", dropRate: 0.03986, category: 'fine' },
  { id: 89140, name: "Mota", icon: "", dropRate: 0.11108, category: 'common' },
  { id: 89182, name: "Pain", icon: "", dropRate: 0.00042, category: 'fine' },
  { id: 89141, name: "Mejora", icon: "", dropRate: 0.00036, category: 'fine' },
  { id: 89098, name: "Control", icon: "", dropRate: 0.00014, category: 'fine' },
  { id: 89103, name: "Brillantez", icon: "", dropRate: 0.00046, category: 'fine' },
  { id: 89258, name: "Potencia", icon: "", dropRate: 0.00034, category: 'fine' },
  { id: 89216, name: "Habilidad", icon: "", dropRate: 0.00032, category: 'fine' },
  { id: 19721, name: "Ectos", icon: "", dropRate: 0.009054, category: 'exotic' }
];

export default function UnidentifiedGearCommonPage() {
  usePageTitle('pageTitles.salvageCommon', 'Salvage - Common');
  const { t, lang } = useI18n();
  const [quantity, setQuantity] = useState(250);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [results, setResults] = useState<SalvageResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);
  const kitCost = 3; // Copper-Fed Salvage-o-Matic cost per use
  const [unidentifiedGearPrice, setUnidentifiedGearPrice] = useState<number | null>(null);
  const [unidentifiedGearName, setUnidentifiedGearName] = useState<string | null>(null);
  const [wikiUrl, setWikiUrl] = useState<string>('');
  const [kitName, setKitName] = useState<string | null>(null);

  // Función para obtener precios desde GW2 API
  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      const itemIds = baseMaterials.map(m => m.id).join(',');
      
      // Obtener información básica de items con idioma
      const apiLang = lang === 'es' ? 'es' : lang === 'de' ? 'de' : lang === 'fr' ? 'fr' : 'en';
      const itemsResponse = await fetch(`https://api.guildwars2.com/v2/items?ids=${itemIds}&lang=${apiLang}`);
      const itemsData = await itemsResponse.json();
      
      // Obtener precios del Trading Post para materiales
      const pricesResponse = await fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${itemIds}`);
      const pricesData = await pricesResponse.json();
      
      // Obtener precio del Common Unidentified Gear (ID: 85016)
      const unidGearResponse = await fetch('https://api.guildwars2.com/v2/commerce/prices/85016');
      const unidGearData = await unidGearResponse.json();
      
      // Obtener nombre del Common Unidentified Gear
      const unidGearItemResponse = await fetch(`https://api.guildwars2.com/v2/items/85016?lang=${apiLang}`);
      const unidGearItemData = await unidGearItemResponse.json();
      setUnidentifiedGearName(unidGearItemData.name);
      
      // Obtener nombre del Copper-Fed Salvage-o-Matic (ID: 44602)
      const kitItemResponse = await fetch(`https://api.guildwars2.com/v2/items/44602?lang=${apiLang}`);
      const kitItemData = await kitItemResponse.json();
      setKitName(kitItemData.name);
      
      // Construir URL de Wiki basada en el idioma y nombre del item
      const buildWikiUrl = (itemName: string, language: string) => {
        // Para español, usar el enlace fijo en inglés
        if (language === 'es') {
          return t('salvagePages.wikiLinks.common', 'https://wiki.guildwars2.com/wiki/Piece_of_Common_Unidentified_Gear');
        }
        
        const encodedName = encodeURIComponent(itemName.replace(/ /g, '_'));
        switch (language) {
          case 'de':
            return `https://wiki-de.guildwars2.com/wiki/${encodedName}`;
          case 'fr':
            return `https://wiki-fr.guildwars2.com/wiki/${encodedName}`;
          default:
            return `https://wiki.guildwars2.com/wiki/${encodedName}`;
        }
      };
      
      setWikiUrl(buildWikiUrl(unidGearItemData.name, apiLang));
      
      // Usar precio de compra (buys) para calcular costo real
      if (unidGearData.buys && unidGearData.buys.unit_price) {
        setUnidentifiedGearPrice(unidGearData.buys.unit_price);
      } else {
    
      }
      
             // Combinar datos
       const materialsWithPrices: Material[] = baseMaterials.map(baseMaterial => {
         const itemData = itemsData.find((item: { id: number }) => item.id === baseMaterial.id);
         const priceData = pricesData.find((price: { id: number }) => price.id === baseMaterial.id);
         
                   // Determinar el porcentaje de procesamiento basado en el ID del material
          const getProcessingRate = (materialId: number) => {
            // Materiales que se calculan al 90% según la imagen proporcionada
            const materialsAt90 = [89182, 89141, 89098, 89103, 89258, 89216, 19721];
            
            if (materialsAt90.includes(materialId)) {
              return 0.90; // 90%
            } else {
              return 0.85; // 85% por defecto
            }
          };
         
                   const processingRate = getProcessingRate(baseMaterial.id);
         
         return {
           ...baseMaterial,
           name: itemData?.name || baseMaterial.name,
           icon: itemData?.icon || '',
           sellPrice: priceData?.sells?.unit_price || 0,
           processedPrice: Math.ceil((priceData?.sells?.unit_price || 0) * processingRate), // Precio después de fees TP
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
  }, [lang, t]);

  // Calcular resultados cuando cambien materiales o cantidad
  useEffect(() => {
    if (materials.length > 0) {
      const newResults: SalvageResult[] = materials.map(material => {
        // Los drop rates están en formato decimal (ej: 0.29826 = 29.826%)
        // Para calcular la cantidad esperada, multiplicamos por la cantidad
        const expectedQuantity = material.dropRate * quantity;
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
          <p className="text-gray-400">{t('salvage.loadingPrices', 'Loading prices from GW2 API...')}</p>
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
              className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 hover:bg-gray-800/90 border border-blue-500/30 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg">
              <ArrowLeft className="h-5 w-5" />
              <span>{t('salvageCommon.backToSalvaging', 'Back to Salvaging')}</span>
            </Link>
          </div>
          
          {/* Dropdown de navegación - MOVIDO ANTES DEL TÍTULO */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl border border-blue-400/30">
                <span className="font-semibold">{t('salvage.dropdown.common', 'Common')}</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-lg z-10 min-w-[200px] overflow-hidden">
                  <Link href="/salvage/common">
                    <div className="px-4 py-3 hover:bg-blue-600/20 transition-all duration-200 cursor-pointer border-b border-slate-600 bg-gradient-to-r from-blue-600/30 to-blue-500/20 hover:from-blue-600/40 hover:to-blue-500/30">
                      <div className="flex items-center gap-3">
                        <Image
                          src="https://render.guildwars2.com/file/E37A036C10C33E4242E568690CB2EA55AA65B915/1938436.png"
                          alt="Common"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        <span className="text-blue-200 font-semibold">{t('salvage.dropdown.common', 'Common')}</span>
                      </div>
                    </div>
                  </Link>
                  <Link href="/salvage/masterwork">
                    <div className="px-4 py-3 hover:bg-green-600/20 transition-all duration-200 cursor-pointer border-b border-slate-600 bg-gradient-to-r from-green-600/30 to-green-500/20 hover:from-green-600/40 hover:to-green-500/30">
                      <div className="flex items-center gap-3">
                        <Image
                          src="https://render.guildwars2.com/file/B147379DFC5430E207FCB742804E199EDF727719/1766400.png"
                          alt="Masterwork"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        <span className="text-green-200 font-semibold">{t('salvage.dropdown.masterwork', 'Masterwork')}</span>
                      </div>
                    </div>
                  </Link>
                  <Link href="/salvage/rare">
                    <div className="px-4 py-3 hover:bg-yellow-600/20 transition-all duration-200 cursor-pointer bg-gradient-to-r from-yellow-600/30 to-yellow-500/20 hover:from-yellow-600/40 hover:to-yellow-500/30">
                      <div className="flex items-center gap-3">
                        <Image
                          src="https://render.guildwars2.com/file/EF63A10BD2317CECCEA63A3B7E6555550B414C4E/1766399.png"
                          alt="Rare"
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        <span className="text-yellow-200 font-semibold">{t('salvage.dropdown.rare', 'Rare')}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Nota informativa - MOVIDA ARRIBA */}
          <div className="mb-4 bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-200 flex-1">
                <strong>{t('salvage.note.title', 'Note')}:</strong>
                <div className={`mt-1 ${!isNoteExpanded ? 'line-clamp-2 md:line-clamp-none' : ''}`}>
                  {t('salvageCommon.note', 'Prices are obtained in real-time from the GW2 API. The "Processed Price" includes Trading Post fees (15% discount on sell price). The cost of Unidentified Gear uses the current buy price from the Trading Post. Drop rates are based on official data from the GW2 Wiki for Piece of Common Unidentified Gear (Common) opened and then salvaged with Copper-Fed Salvage-o-Matic. Recommendation: Have an inventory of 280 slots to facilitate the process.')}
                </div>
                <button
                  onClick={() => setIsNoteExpanded(!isNoteExpanded)}
                  className="mt-2 text-blue-300 hover:text-blue-200 text-xs font-medium flex items-center gap-1 transition-colors md:hidden"
                >
                  {isNoteExpanded ? (
                    <>
                      <ChevronDown className="h-3 w-3 rotate-180" />
                      {t('salvage.note.showLess', 'Ver menos')}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3" />
                      {t('salvage.note.showMore', 'Ver más')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image
                src="https://render.guildwars2.com/file/E37A036C10C33E4242E568690CB2EA55AA65B915/1938436.png"
                alt="Piece of Common Unidentified Gear"
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <div>
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">{unidentifiedGearName || t('salvageCommon.title', 'Unidentified Gear - Common')}</h1>
                <p className="text-gray-400">{t('salvageCommon.description', 'Calculate how much gold you earn by opening and salvaging Piece of Common Unidentified Gear')}</p>
              </div>
            </div>
            
            {/* Botón GW2 Wiki */}
            <a 
              href={wikiUrl || t('salvagePages.wikiLinks.common', 'https://wiki.guildwars2.com/wiki/Piece_of_Common_Unidentified_Gear')} 
              target="_blank" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
              <BookOpen className="h-4 w-4" />
              {t('salvagePages.viewWiki', 'View Wiki')}
            </a>
          </div>
          
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <RefreshCw className="h-4 w-4" />
              <span>{t('salvagePages.lastUpdated', 'Last updated: {time}').replace('{time}', lastUpdated.toLocaleTimeString())}</span>
            </div>
          )}
        </div>

        {/* Información del item */}
        <div className="bg-slate-800 rounded-lg shadow-md p-6 mb-6 border border-slate-700">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="https://render.guildwars2.com/file/CC2004000FFDFCEF346AAE296FD0E858C0990548/619581.png"
              alt="Copper-Fed Salvage-o-Matic"
              width={48}
              height={48}
              className="w-12 h-12"
            />
            <div>
              <h2 className="text-xl font-semibold text-white">{kitName || t('salvageCommon.copperFedKit', 'Copper-Fed Salvage-o-Matic')}</h2>
              <p className="text-gray-400">{t('salvageCommon.recommendedKit', 'Recommended kit for Common Unidentified Gear')}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="text-gray-400">{t('salvagePages.costPerUse', 'Cost per use')}</div>
              <div className="text-white font-semibold flex items-center gap-1">
                3 <Image src="/images/expansions/Copper.png" alt="Copper" width={16} height={16} />
              </div>
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
                              <div className="text-gray-400">{t('salvagePages.dropRates', 'Drop rates')}</div>
                <div className="text-white font-semibold">{t('salvagePages.estimated', 'Estimated')}</div>
            </div>
            <div className="bg-slate-700 rounded-lg p-3">
              <div className="text-gray-400">{t('salvagePages.profitability', 'Profitability')}</div>
              <div className="text-blue-400 font-semibold">{t('salvagePages.low', 'Low')}</div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="bg-slate-800 rounded-lg shadow-md p-6 mb-6 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('salvageCommon.quantityLabel', 'Quantity of Common Unidentified Gear')}
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
                               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                {t('salvagePages.updatePrices', 'Update Prices')}
              </button>
            </div>
          </div>
        </div>

        {/* Resumen financiero */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700">
            <div className="flex items-center gap-2 text-blue-300 mb-2">
              <Calculator className="h-5 w-5" />
              <span className="font-semibold">{t('salvagePages.totalMaterialsValue', 'Total Materials Value')}</span>
            </div>
            <p className="text-2xl font-bold text-blue-200">{formatCurrency(totalMaterialsValue)}</p>
          </div>
          
          <div className="bg-red-900/30 rounded-lg p-4 border border-red-700">
            <div className="flex items-center gap-2 text-red-300 mb-2">
              <Package className="h-5 w-5" />
              <span className="font-semibold">{t('salvageCommon.costGear', 'Cost {quantity} Common Gear').replace('{quantity}', quantity.toString())}</span>
            </div>
            {unidentifiedGearPrice ? (
              <>
                <p className="text-2xl font-bold text-red-200">{formatCurrency(totalCost)}</p>
                <p className="text-xs text-red-400 mt-1">
                  {formatCurrency(unidentifiedGearPrice || 0)} {t('salvagePages.eachTP', 'each (TP)')}
                </p>
              </>
            ) : (
              <p className="text-lg text-red-300">{t('salvageCommon.loadingPrice', 'Loading price...')}</p>
            )}
          </div>
          
          <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-700">
            <div className="flex items-center gap-2 text-orange-300 mb-2">
              <Package className="h-5 w-5" />
              <span className="font-semibold">{t('salvagePages.kitCost', 'Kit Cost')}</span>
            </div>
            <p className="text-2xl font-bold text-orange-200">{formatCurrency(totalKitCost)}</p>
          </div>
          
          <div className={`rounded-lg p-4 border ${totalProfit >= 0 ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700'}`}>
            <div className={`flex items-center gap-2 mb-2 ${totalProfit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {totalProfit >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              <span className="font-semibold">{t('salvagePages.totalProfit', 'Total Profit')}</span>
            </div>
            <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-200' : 'text-red-200'}`}>
              {formatCurrency(Math.abs(totalProfit))}
            </p>
          </div>
        </div>
        {/* Indicador móvil encima de la tabla */}
        <div className="sm:hidden flex justify-center mb-3">
          <div className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-600 text-gray-200 shadow-md">
            <svg
              className="h-4 w-64 text-gray-200"
              viewBox="0 0 260 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker id="arrowHead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L6,3 L0,6 z" fill="currentColor" />
                </marker>
                <marker id="arrowHeadLeft" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M6,0 L0,3 L6,6 z" fill="currentColor" />
                </marker>
              </defs>
              <line x1="12" y1="8" x2="248" y2="8" stroke="currentColor" strokeWidth="2.5" markerStart="url(#arrowHeadLeft)" markerEnd="url(#arrowHead)" />
            </svg>
          </div>
        </div>

        {/* Tabla de materiales */}
        <div className="bg-slate-800 rounded-lg shadow-md overflow-hidden border border-slate-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {t('salvage.table.material', 'Material')}
                  </th>
                                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                     {t('salvage.table.matPerUnit', 'Mat per Unit')}
                   </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {t('salvage.table.sellPrice', 'Sell Price')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {t('salvage.table.processedPrice', 'Processed Price')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {t('salvage.table.quantity', 'Quantity')} ({quantity})
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {t('salvage.table.totalValue', 'Total Value')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-800 divide-y divide-slate-700">
                                 {results.map((result, index) => {
                   // Determinar el color de fondo basado en el material
                   const getRowBackgroundColor = (materialName: string) => {
                     switch (materialName) {
                       case 'Seda':
                       case 'Gasa':
                         return 'bg-blue-100/10'; // Azul claro/gris
                       case 'Madera T5':
                       case 'Madera T6':
                         return 'bg-orange-100/10'; // Naranja claro/melocotón
                       case 'Cuero T5':
                       case 'Cuero T6':
                         return 'bg-yellow-100/10'; // Amarillo claro
                       case 'Mithril':
                       case 'Orica​lco':
                         return 'bg-gray-100/10'; // Gris claro
                       case 'Mota':
                         return 'bg-green-100/10'; // Verde claro
                       case 'Pain':
                         return 'bg-red-100/20'; // Rojo
                       case 'Mejora':
                         return 'bg-yellow-100/20'; // Amarillo
                       case 'Control':
                         return 'bg-amber-100/20'; // Marrón
                       case 'Brillantez':
                         return 'bg-cyan-100/20'; // Cian/azul claro
                       case 'Potencia':
                         return 'bg-pink-100/20'; // Rosa
                       case 'Habilidad':
                         return 'bg-green-100/20'; // Verde
                       case 'Ectos':
                         return 'bg-purple-100/20'; // Púrpura
                       default:
                         return 'hover:bg-slate-700';
                     }
                   };

                   return (
                     <motion.tr
                       key={result.material.id}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: index * 0.05 }}
                       className={`${getRowBackgroundColor(result.material.name)} hover:bg-slate-700`}
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
                       {result.material.dropRate.toFixed(5)}
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
                   );
                 })}
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </>
  );
} 