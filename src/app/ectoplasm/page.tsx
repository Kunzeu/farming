'use client';
import dynamic from 'next/dynamic';
const Motion = dynamic(() => import('@/components/ectoplasm/EctoplasmMotion').then(m => m.default), { ssr: false });
import { useState, useEffect } from 'react';
import { 
  Table, 
  Layers, 
  TrendingUp, 
  BarChart3, 
  Info,
  Calculator,
  ArrowRight
} from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';
import Navigation from '@/components/layout/Navigation';
import Image from 'next/image';
import Link from 'next/link';

// IDs de los materiales
const MATERIAL_IDS = {
  ecto: 19721,
  dust: 24277,
  luckBlue: 45175,
  luckGreen: 45176,
  luckYellow: 45177,
  luckOrange: 45178,
  kitMaster: 23043,
  kitMystic: 23045,
  kitSilver: 67027,
};

const TABLE_DATA = [
  [8250, 15155, 60018, 3803, 368, 172],
  [1730, 3247, 12919, 737, 88, 30],
  [25000, 46527, 178616, 12158, 1231, 510],
  [15020, 27849, 107426, 7256, 741, 322],
  [15000, 28100, 107866, 7273, 672, 294],
  [15000, 27814, 107585, 7482, 659, 319],
  [20000, 37153, 142609, 9922, 925, 438],
];

const TOTALS = [100000, 185845, 717039, 48631, 4684, 2085];

export default function EctoplasmSalvagePage() {
  const { t, lang } = useI18n();
  usePageTitle(t('ectoplasm.title'), t('ectoplasm.title'));

  const [materialIcons, setMaterialIcons] = useState<Record<number, string>>({});
  const [materialNames, setMaterialNames] = useState<Record<number, string>>({});
  const [marketPrices, setMarketPrices] = useState<Record<number, { buy: number; sell: number }>>({});

  useEffect(() => {
    const fetchMaterialData = async () => {
      try {
        const itemIds = Object.values(MATERIAL_IDS).join(',');
        
        // Fetch Names and Icons
        const response = await fetch(`https://api.guildwars2.com/v2/items?ids=${itemIds}&lang=${lang}`);
        if (response.ok) {
          const items = await response.json();
          const icons: Record<number, string> = {};
          const names: Record<number, string> = {};
          items.forEach((item: any) => {
            icons[item.id] = item.icon;
            names[item.id] = item.name;
          });
          setMaterialIcons(icons);
          setMaterialNames(names);
        }

        // Fetch Market Prices
        const priceIds = [MATERIAL_IDS.ecto, MATERIAL_IDS.dust].join(',');
        const pricesResponse = await fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${priceIds}`);
        if (pricesResponse.ok) {
          const prices = await pricesResponse.json();
          const priceMap: Record<number, { buy: number; sell: number }> = {};
          prices.forEach((p: any) => {
            priceMap[p.id] = { buy: p.buys.unit_price, sell: p.sells.unit_price };
          });
          setMarketPrices(priceMap);
        }
      } catch (error) {
        console.error('Error fetching material data:', error);
      }
    };
    fetchMaterialData();
  }, [lang]);

  function formatPrice(copper: number) {
    if (!copper) return '...';
    const g = Math.floor(copper / 10000);
    const s = Math.floor((copper % 10000) / 100);
    const c = copper % 100;
    return (
      <span className="flex items-center gap-1">
        {g > 0 && <span className="text-amber-400">{g}g</span>}
        {s > 0 && <span className="text-slate-300">{s}s</span>}
        <span className="text-amber-600">{c}c</span>
      </span>
    );
  }

  function materialismIcon(id: number) {
    return materialIcons[id] || null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 flex flex-col">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 flex-1">


        {/* Header Section */}
        <div className="text-center mb-16">
          <Motion
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-4"
          >
            <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 mr-4">
              <Layers className="w-10 h-10 text-purple-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              <span 
                className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                {t('ectoplasm.title')}
              </span>
            </h1>
          </Motion>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
            {t('ectoplasm.subtitle')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: t('ectoplasm.table.ecto'), value: '100,000', icon: materialismIcon(MATERIAL_IDS.ecto), color: 'purple', subtitle: 'Tamaño de Muestra' },
            { label: t('ectoplasm.table.dust'), value: '185,845', icon: materialismIcon(MATERIAL_IDS.dust), color: 'blue', subtitle: '1.85 Media por Ecto' },
            { label: t('ectoplasm.totalLuck'), value: '772,439', icon: materialismIcon(MATERIAL_IDS.luckOrange), color: 'orange', subtitle: '7.72 Media por Ecto' },
          ].map((stat, i) => (
            <Motion
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 flex items-center gap-4 hover:border-slate-600/50 transition-all group"
            >
              <div className={`p-4 ${stat.color === 'orange' ? 'bg-amber-500/10' : stat.color === 'purple' ? 'bg-purple-500/10' : 'bg-blue-500/10'} rounded-xl group-hover:scale-110 transition-transform`}>
                {stat.icon ? (
                  <Image src={stat.icon} alt={stat.label} width={40} height={40} className="w-10 h-10" />
                ) : (
                  <TrendingUp className={`w-8 h-8 ${stat.color === 'orange' ? 'text-amber-400' : stat.color === 'purple' ? 'text-purple-400' : 'text-blue-400'}`} />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                <div className="flex flex-col">
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                  <p className="text-xs font-bold text-gray-500 uppercase mt-1">{stat.subtitle}</p>
                </div>
              </div>
            </Motion>
          ))}
        </div>

          {/* Profitability Analysis Section */}
          <Motion
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden"
          >
          {/* Subtle background icon */}
          <Layers className="absolute -right-8 -top-8 w-64 h-64 text-purple-500/5 rotate-12" />
          
          <div className="relative z-10 text-center mb-8">
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center justify-center gap-3">
              <Calculator className="w-6 h-6 text-blue-400" />
              Calculadora de Rentabilidad Directa
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative z-10">
            {/* 1 Ecto */}
            <div className="flex flex-col items-center gap-4 bg-slate-900/40 p-6 rounded-2xl border border-white/5 w-full md:w-64">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Inversión</span>
              <div className="relative group">
                <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                {materialIcons[MATERIAL_IDS.ecto] && <Image src={materialIcons[MATERIAL_IDS.ecto]} alt="" width={64} height={64} className="relative z-10" />}
              </div>
              <div className="text-center">
                <p className="text-white font-black text-lg">1 Ecto</p>
                <div className="font-mono mt-1">{formatPrice(marketPrices[MATERIAL_IDS.ecto]?.sell || 0)}</div>
              </div>
            </div>

            {/* Arrow + Kit */}
            <div className="flex flex-col items-center gap-2">
               <div className="p-3 bg-white/5 rounded-full border border-white/10">
                 <ArrowRight className="w-8 h-8 text-blue-400" />
               </div>
               <span className="text-[10px] font-bold text-slate-500 uppercase">Reciclar</span>
            </div>

            {/* Results */}
            <div className="flex flex-col items-center gap-4 bg-slate-900/40 p-6 rounded-2xl border border-white/5 w-full md:w-80">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Retorno Estimado</span>
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center">
                  {materialIcons[MATERIAL_IDS.dust] && <Image src={materialIcons[MATERIAL_IDS.dust]} alt="" width={48} height={48} />}
                  <span className="text-white font-bold mt-1">1.858 Polvos</span>
                </div>
                <div className="text-2xl font-light text-slate-600">+</div>
                <div className="flex flex-col items-center">
                  {materialIcons[MATERIAL_IDS.luckOrange] && <Image src={materialIcons[MATERIAL_IDS.luckOrange]} alt="" width={48} height={48} />}
                  <span className="text-amber-400 font-bold mt-1">104.8 Luck</span>
                </div>
              </div>
              <div className="text-center border-t border-white/5 pt-4 w-full">
                <div className="font-mono">{formatPrice(Math.floor((marketPrices[MATERIAL_IDS.dust]?.buy || 0) * 1.85845))}</div>
              </div>
            </div>
          </div>

          {/* Profit Indicator */}
          <div className="mt-8 flex flex-col items-center">
             <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl max-w-lg text-center">
               <p className="text-xs text-gray-400 font-medium leading-relaxed italic">
                 Comparativa basada en precios actuales (Venta de Ecto vs Compra de Polvo). 
                 <span className="text-blue-400 font-bold block mt-1 uppercase tracking-widest">⚠️ Recuerda restar el coste del kit seleccionado abajo</span>
               </p>
             </div>
          </div>
        </Motion>

        {/* Market Analysis Mini-Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
           <Motion 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex items-center justify-between"
           >
              <div className="flex items-center gap-3">
                {materialIcons[MATERIAL_IDS.ecto] && <Image src={materialIcons[MATERIAL_IDS.ecto]} alt="" width={32} height={32} />}
                <span className="text-gray-300 font-bold">{materialNames[MATERIAL_IDS.ecto] || 'Ecto'}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-500 uppercase font-bold">Mercado (Venta)</span>
                <span className="font-mono">{formatPrice(marketPrices[MATERIAL_IDS.ecto]?.sell || 0)}</span>
              </div>
           </Motion>
           <Motion 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50 flex items-center justify-between"
           >
              <div className="flex items-center gap-3">
                {materialIcons[MATERIAL_IDS.dust] && <Image src={materialIcons[MATERIAL_IDS.dust]} alt="" width={32} height={32} />}
                <span className="text-gray-300 font-bold">{materialNames[MATERIAL_IDS.dust] || 'Polvo T6'}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-500 uppercase font-bold">Mercado (Compra)</span>
                <span className="font-mono">{formatPrice(marketPrices[MATERIAL_IDS.dust]?.buy || 0)}</span>
                </div>
              </Motion>
        </div>

        {/* Salvage Kits Section */}
        <div className="mb-12">
          <Motion as="h3" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-white mb-6 flex items-center gap-3"
          >
            <BarChart3 className="w-6 h-6 text-purple-400" />
            {t('ectoplasm.kits.title')}
          </Motion>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'master', itemId: MATERIAL_IDS.kitMaster, color: 'yellow' },
              { id: 'mystic', itemId: MATERIAL_IDS.kitMystic, color: 'purple' },
              { id: 'silver', itemId: MATERIAL_IDS.kitSilver, color: 'slate' },
            ].map((kit, i) => (
              <Motion
                key={kit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
                className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-slate-900/50 rounded-xl">
                    {materialIcons[kit.itemId] && <Image src={materialIcons[kit.itemId]} alt="" width={40} height={40} />}
                  </div>
                  <div>
                    <h4 className="text-white font-bold">{t(`ectoplasm.kits.${kit.id}.name`)}</h4>
                    <p className="text-xs text-gray-500 font-medium uppercase">{t(`ectoplasm.kits.${kit.id}.desc`)}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg border border-slate-700/30">
                    <span className="text-gray-400 text-sm">{t('salvage.label.costPerUse')}</span>
                    <span className={`font-black ${kit.color === 'yellow' ? 'text-yellow-400' : kit.color === 'purple' ? 'text-purple-400' : 'text-gray-300'}`}>
                      {t(`ectoplasm.kits.${kit.id}.cost`)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                    <span className="text-blue-400/80 text-xs font-bold uppercase">{t('ectoplasm.kits.totalCost100k')}</span>
                    <span className="font-black text-white italic">
                      {t(`ectoplasm.kits.${kit.id}.total`)}
                    </span>
                  </div>
                </div>
                </Motion>
            ))}
          </div>
        </div>

        {/* Main Table Card */}
          <Motion
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl mb-12"
          >
          <div className="p-8 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30">
            <div className="flex items-center gap-3">
              <Table className="w-6 h-6 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">{t('ectoplasm.table.title')}</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-700/50">
              <Info className="w-3.5 h-3.5" />
              {t('ectoplasm.sampleData')}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/40">
                  <th className="px-8 py-5 text-sm font-black text-gray-400 uppercase tracking-wider border-b border-slate-700/50 w-24">#</th>
                  <th className="px-6 py-5 text-sm font-black text-gray-400 uppercase tracking-wider border-b border-slate-700/50">
                    <div className="flex items-center gap-2">
                      {materialIcons[MATERIAL_IDS.ecto] && <Image src={materialIcons[MATERIAL_IDS.ecto]} alt="" width={20} height={20} />}
                      {t('ectoplasm.table.ecto')}
                    </div>
                  </th>
                  <th className="px-6 py-5 text-sm font-black text-gray-400 uppercase tracking-wider border-b border-slate-700/50">
                    <div className="flex items-center gap-2 text-blue-300">
                      {materialIcons[MATERIAL_IDS.dust] && <Image src={materialIcons[MATERIAL_IDS.dust]} alt="" width={20} height={20} />}
                      {t('ectoplasm.table.dust')}
                    </div>
                  </th>
                  <th className="px-6 py-5 text-sm font-black text-gray-400 uppercase tracking-wider border-b border-slate-700/50">
                    <div className="flex items-center gap-2 text-blue-400">
                      {materialIcons[MATERIAL_IDS.luckBlue] && <Image src={materialIcons[MATERIAL_IDS.luckBlue]} alt="" width={20} height={20} />}
                      {t('ectoplasm.table.blueEssence')}
                    </div>
                  </th>
                  <th className="px-6 py-5 text-sm font-black text-gray-400 uppercase tracking-wider border-b border-slate-700/50">
                    <div className="flex items-center gap-2 text-green-400">
                      {materialIcons[MATERIAL_IDS.luckGreen] && <Image src={materialIcons[MATERIAL_IDS.luckGreen]} alt="" width={20} height={20} />}
                      {t('ectoplasm.table.greenEssence')}
                    </div>
                  </th>
                  <th className="px-6 py-5 text-sm font-black text-gray-400 uppercase tracking-wider border-b border-slate-700/50">
                    <div className="flex items-center gap-2 text-yellow-500">
                      {materialIcons[MATERIAL_IDS.luckYellow] && <Image src={materialIcons[MATERIAL_IDS.luckYellow]} alt="" width={20} height={20} />}
                      {t('ectoplasm.table.yellowEssence')}
                    </div>
                  </th>
                  <th className="px-6 py-5 text-sm font-black text-gray-400 uppercase tracking-wider border-b border-slate-700/50">
                    <div className="flex items-center gap-2 text-orange-500">
                      {materialIcons[MATERIAL_IDS.luckOrange] && <Image src={materialIcons[MATERIAL_IDS.luckOrange]} alt="" width={20} height={20} />}
                      {t('ectoplasm.table.orangeEssence')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                 {/* Totales Row at the Top just like in the image */}
                 <tr className="bg-blue-500/5 border-b-2 border-blue-500/20 group hover:bg-blue-500/10 transition-colors">
                  <td className="px-8 py-5 font-black text-blue-400 uppercase italic tracking-tighter">{t('ectoplasm.table.totals')}</td>
                  {TOTALS.map((total, idx) => (
                    <td key={idx} className="px-6 py-5 font-black text-xl text-white group-hover:scale-105 transition-transform origin-left">
                      {total.toLocaleString()}
                    </td>
                  ))}
                </tr>

                {TABLE_DATA.map((row, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-8 py-5 text-gray-500 font-mono text-sm">{rowIndex + 1}</td>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className={`px-6 py-5 font-medium ${cellIndex === 0 ? 'text-white' : 'text-gray-300'}`}>
                        {cell.toLocaleString()}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Motion>



        {/* Info Card */}
          <Motion
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 bg-blue-900/20 border border-blue-500/20 rounded-2xl p-6 flex gap-4 items-start"
          >
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Info className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h4 className="text-white font-bold mb-1">{t('ectoplasm.info.title')}</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('ectoplasm.info.content')}
            </p>
          </div>
        </Motion>
      </main>
    </div>
  );
}
