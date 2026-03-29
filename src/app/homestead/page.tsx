'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';
import Navigation from '@/components/layout/Navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    Home,
    RefreshCw,
    ExternalLink,
    ChevronDown,
    TrendingDown,
    Warehouse,
    Pickaxe
} from 'lucide-react';

interface Ingredient {
    id: number;
    name: string;
    baseRequirement: number;
    efficiencyApplies: boolean;
    price?: { buy: number; sell: number };
    icon?: string;
}

interface RefinedMaterial {
    id: number;
    name: string;
    icon: string;
    efficiencyKey: 'wood' | 'metal' | 'fiber';
    ingredients: Ingredient[];
}

const REFINED_MATERIALS: RefinedMaterial[] = [
    {
        id: 103049,
        name: 'Refined Homestead Wood',
        icon: 'https://wiki.guildwars2.com/images/3/37/Refined_Homestead_Wood.png',
        efficiencyKey: 'wood',
        ingredients: [
            { id: 19722, name: 'Elder Wood Log', baseRequirement: 1, efficiencyApplies: false },
            { id: 19726, name: 'Soft Wood Log', baseRequirement: 3, efficiencyApplies: false },
            { id: 19725, name: 'Ancient Wood Log', baseRequirement: 0.5, efficiencyApplies: true },
            { id: 19723, name: 'Green Wood Log', baseRequirement: 5, efficiencyApplies: false },
            { id: 19727, name: 'Seasoned Wood Log', baseRequirement: 1, efficiencyApplies: false },
            { id: 19724, name: 'Hard Wood Log', baseRequirement: 1, efficiencyApplies: true },
        ]
    },
    {
        id: 102205,
        name: 'Refined Homestead Metal',
        icon: 'https://wiki.guildwars2.com/images/c/c1/Refined_Homestead_Metal.png',
        efficiencyKey: 'metal',
        ingredients: [
            { id: 19700, name: 'Mithril Ore', baseRequirement: 4, efficiencyApplies: false },
            { id: 19698, name: 'Gold Ore', baseRequirement: 8, efficiencyApplies: false },
            { id: 19697, name: 'Copper Ore', baseRequirement: 8, efficiencyApplies: false },
            { id: 19702, name: 'Platinum Ore', baseRequirement: 2, efficiencyApplies: true },
            { id: 19703, name: 'Silver Ore', baseRequirement: 20, efficiencyApplies: false },
            { id: 19699, name: 'Iron Ore', baseRequirement: 4, efficiencyApplies: false },
            { id: 19701, name: 'Orichalcum Ore', baseRequirement: 2, efficiencyApplies: true },
        ]
    },
    {
        id: 102306,
        name: 'Refined Homestead Fiber',
        icon: 'https://wiki.guildwars2.com/images/1/10/Refined_Homestead_Fiber.png',
        efficiencyKey: 'fiber',
        ingredients: [
            { id: 82866, name: 'Handful of Red Lentils', baseRequirement: 1, efficiencyApplies: true },
            { id: 12330, name: 'Zucchini', baseRequirement: 2, efficiencyApplies: true },
            { id: 12254, name: 'Raspberry', baseRequirement: 0.5, efficiencyApplies: true },
            { id: 12512, name: 'Artichoke', baseRequirement: 7, efficiencyApplies: true },
            { id: 12511, name: 'Butternut Squash', baseRequirement: 7, efficiencyApplies: true },
            { id: 12508, name: 'Leek', baseRequirement: 7, efficiencyApplies: true },
            { id: 12538, name: 'Sugar Pumpkin', baseRequirement: 8, efficiencyApplies: true },
            { id: 12243, name: 'Sage Leaf', baseRequirement: 0.5, efficiencyApplies: true },
            { id: 12533, name: 'Green Onion', baseRequirement: 6, efficiencyApplies: true },
            { id: 12332, name: 'Head of Cabbage', baseRequirement: 10, efficiencyApplies: true },
            { id: 12336, name: 'Dill Sprig', baseRequirement: 10, efficiencyApplies: true },
            { id: 12241, name: 'Spinach Leaf', baseRequirement: 1, efficiencyApplies: true },
            { id: 12534, name: 'Clove', baseRequirement: 1, efficiencyApplies: true },
            { id: 12510, name: 'Lotus Root', baseRequirement: 4, efficiencyApplies: true },
            { id: 12236, name: 'Black Peppercorn', baseRequirement: 0.5, efficiencyApplies: true },
            { id: 12234, name: 'Vanilla Bean', baseRequirement: 0.5, efficiencyApplies: true },
            { id: 66524, name: 'Nopal', baseRequirement: 6, efficiencyApplies: true },
            { id: 12532, name: 'Head of Cauliflower', baseRequirement: 8, efficiencyApplies: true },
            { id: 12128, name: 'Omnomberry', baseRequirement: 1, efficiencyApplies: true },
            { id: 12341, name: 'Grape', baseRequirement: 8, efficiencyApplies: true },
            { id: 12253, name: 'Strawberry', baseRequirement: 1, efficiencyApplies: true }, 
            { id: 74090, name: 'Pile of Flax Seeds', baseRequirement: 0.5, efficiencyApplies: true },
            { id: 12509, name: 'Seaweed', baseRequirement: 0.5, efficiencyApplies: true },
            { id: 12134, name: 'Carrot', baseRequirement: 1, efficiencyApplies: true },
            { id: 12547, name: 'Saffron Thread', baseRequirement: 0.5, efficiencyApplies: true },
            { id: 12545, name: 'Orrian Truffle', baseRequirement: 0.5, efficiencyApplies: true },
            { id: 12255, name: 'Blueberry', baseRequirement: 2, efficiencyApplies: true },
            { id: 12144, name: 'Snow Truffle', baseRequirement: 2, efficiencyApplies: true },
            { id: 12238, name: 'Head of Lettuce', baseRequirement: 0.5, efficiencyApplies: true },
            { id: 12142, name: 'Onion', baseRequirement: 0.5, efficiencyApplies: true },
            { id: 12162, name: 'Turnip', baseRequirement: 12, efficiencyApplies: true },
            { id: 12546, name: 'Lemongrass', baseRequirement: 4, efficiencyApplies: true },
            { id: 12507, name: 'Parsnip', baseRequirement: 7, efficiencyApplies: true },
            { id: 12537, name: 'Blackberry', baseRequirement: 1, efficiencyApplies: true },
            { id: 12342, name: 'Sesame Seed', baseRequirement: 2, efficiencyApplies: true },
            { id: 73504, name: 'Sawgill Mushroom', baseRequirement: 6, efficiencyApplies: true },
            { id: 36731, name: 'Passion Fruit', baseRequirement: 5, efficiencyApplies: true },
            { id: 73096, name: 'Pile of Allspice Berries', baseRequirement: 1, efficiencyApplies: true },
            { id: 12335, name: 'Rosemary Sprig', baseRequirement: 1, efficiencyApplies: true },
            { id: 12544, name: 'Ghost Pepper', baseRequirement: 1, efficiencyApplies: true },
            { id: 12135, name: 'Potato', baseRequirement: 4, efficiencyApplies: true },
            { id: 12536, name: 'Mint Leaf', baseRequirement: 7, efficiencyApplies: true },
            { id: 12334, name: 'Portobello Mushroomm', baseRequirement: 3.25, efficiencyApplies: true },

            { id: 12506, name: 'Tarragon Leaves', baseRequirement: 1, efficiencyApplies: true },
            { id: 12333, name: 'Kale Leaf', baseRequirement: 1, efficiencyApplies: true },
            { id: 12247, name: 'Bay Leaf', baseRequirement: 8, efficiencyApplies: true },
            { id: 12535, name: 'Rutabaga', baseRequirement: 1, efficiencyApplies: true },
            { id: 12331, name: 'Chili Pepper', baseRequirement: 2, efficiencyApplies: true },
            { id: 12248, name: 'Thyme Leaf', baseRequirement: 1, efficiencyApplies: true },
            { id: 12163, name: 'Head of Garlic', baseRequirement: 1, efficiencyApplies: true },
            { id: 12147, name: 'Mushroom', baseRequirement: 1, efficiencyApplies: true },
            { id: 12504, name: 'Cayenne Pepper', baseRequirement: 1, efficiencyApplies: true },
            { id: 73113, name: 'Cassava Root', baseRequirement: 1, efficiencyApplies: true },
            { id: 12329, name: 'Yam', baseRequirement: 8, efficiencyApplies: true },
            { id: 12161, name: 'Beet', baseRequirement: 15, efficiencyApplies: true },
            { id: 12244, name: 'Oregano Leaf', baseRequirement: 10, efficiencyApplies: true },
            { id: 66522, name: 'Prickly Pear', baseRequirement: 6, efficiencyApplies: true },

        ]
    }
];

const HomesteadPage = () => {
    usePageTitle('pageTitles.homestead', 'Homesteading');
    const { t, lang } = useI18n();
    const [prices, setPrices] = useState<Record<number, { buy: number; sell: number }>>({});
    const [icons, setIcons] = useState<Record<number, string>>({});
    const [names, setNames] = useState<Record<number, string>>({});
    const [loading, setLoading] = useState(true);
    const [efficiencies, setEfficiencies] = useState<Record<string, number>>({
        wood: 0,
        metal: 0,
        fiber: 0
    });

    const fetchMarketData = useCallback(async () => {
        try {
            setLoading(true);
            const allIds = [
                ...REFINED_MATERIALS.map(m => m.id),
                ...REFINED_MATERIALS.flatMap(m => m.ingredients.map(i => i.id))
            ];
            const uniqueIds = Array.from(new Set(allIds)).join(',');

            const [itemsRes, pricesRes] = await Promise.all([
                fetch(`https://api.guildwars2.com/v2/items?ids=${uniqueIds}&lang=${lang}`),
                fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${uniqueIds}`)
            ]);

            if (itemsRes.ok && pricesRes.ok) {
                const itemsData = await itemsRes.json();
                const pricesData = await pricesRes.json();

                const newIcons: Record<number, string> = {};
                const newNames: Record<number, string> = {};
                itemsData.forEach((item: any) => {
                    newIcons[item.id] = item.icon;
                    newNames[item.id] = item.name;
                });

                const newPrices: Record<number, { buy: number; sell: number }> = {};
                pricesData.forEach((price: any) => {
                    newPrices[price.id] = {
                        buy: price.buys.unit_price,
                        sell: price.sells.unit_price
                    };
                });

                setIcons(newIcons);
                setNames(newNames);
                setPrices(newPrices);
            }
        } catch (e) {
            console.error('Error fetching market data:', e);
        } finally {
            setLoading(false);
        }
    }, [lang]);

    useEffect(() => {
        fetchMarketData();
        const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchMarketData]);

    const formatGoldSilverCopper = (copper: number) => {
        if (copper === 0) return (
            <span className="flex items-center gap-1 font-mono text-white/50">
                0 <img src="https://wiki.guildwars2.com/images/e/eb/Copper_coin.png" alt="c" className="w-3 h-3" />
            </span>
        );

        const gold = Math.floor(copper / 10000);
        const silver = Math.floor((copper % 10000) / 100);
        const c = copper % 100;

        return (
            <span className="flex items-center gap-1.5 font-mono">
                {gold > 0 && (
                    <span className="flex items-center gap-0.5 text-yellow-400">
                        {gold} <img src="https://wiki.guildwars2.com/images/d/d1/Gold_coin.png" alt="g" className="w-3.5 h-3.5" />
                    </span>
                )}
                {(silver > 0 || gold > 0) && (
                    <span className="flex items-center gap-0.5 text-gray-300">
                        {silver.toString().padStart(gold > 0 ? 2 : 1, '0')} <img src="https://wiki.guildwars2.com/images/3/3c/Silver_coin.png" alt="s" className="w-3.5 h-3.5" />
                    </span>
                )}
                <span className="flex items-center gap-0.5 text-orange-400">
                    {c.toString().padStart(silver > 0 || gold > 0 ? 2 : 1, '0')} <img src="https://wiki.guildwars2.com/images/e/eb/Copper_coin.png" alt="c" className="w-3.5 h-3.5" />
                </span>
            </span>
        );
    };

    const calculateIngredientCost = (ing: Ingredient, efficiencyLevel: number) => {
        const requirement = ing.efficiencyApplies && efficiencyLevel > 0
            ? ing.baseRequirement / 2
            : ing.baseRequirement;
        const sellPrice = prices[ing.id]?.sell || 0;
        return {
            requirement,
            totalCost: requirement * sellPrice,
            buyPrice: prices[ing.id]?.buy || 0,
            sellPrice: sellPrice
        };
    };

    const getCheapestOption = (material: RefinedMaterial) => {
        const options = material.ingredients.map(ing => ({
            ...ing,
            cost: calculateIngredientCost(ing, efficiencies[material.efficiencyKey]).totalCost
        }));
        return options.sort((a, b) => a.cost - b.cost)[0];
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans">
            <Navigation />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 border-b border-white/5 pb-10"
                >
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic text-white flex items-center gap-4">
                            <Warehouse className="w-12 h-12 text-emerald-400" />
                            {t('homestead.forge', 'Homestead Forge')} <span className="text-emerald-500 not-italic font-light">Forge</span>
                        </h1>
                        <p className="text-white/40 text-lg max-w-xl">
                            {t('homestead.description', 'Real-time cost analysis for Refined Homestead materials. Find the most efficient way to farm your decorations.')}
                        </p>
                    </div>

                    <button
                        onClick={fetchMarketData}
                        disabled={loading}
                        className="group flex items-center gap-3 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                        {loading ? t('homestead.fetching', 'Fetching Prices...') : t('homestead.refresh', 'Refresh Market Data')}
                    </button>
                </motion.div>

                {/* Compact Overview Table (Wiki Style) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-12 bg-[#121212]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                >
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                <th className="py-4 px-6 md:px-10">{t('homestead.material', 'Material')}</th>
                                <th className="py-4 px-6 md:px-10 text-right">{t('homestead.cheapest', 'Cheapest Material')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {REFINED_MATERIALS.map((mat) => {
                                const cheapest = getCheapestOption(mat);
                                return (
                                    <tr key={mat.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                                        <td className="py-4 px-6 md:px-10">
                                            <div className="flex items-center gap-3">
                                                <Image src={mat.icon} alt={names[mat.id] || mat.name} width={24} height={24} className="rounded" />
                                                <span className="text-sm font-bold text-white tracking-tight">{names[mat.id] || mat.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 md:px-10">
                                            <div className="flex items-center justify-end gap-3 text-right">
                                                <div className="flex items-center gap-2">
                                                    {icons[cheapest.id] ? (
                                                        <Image src={icons[cheapest.id]} alt={names[cheapest.id] || cheapest.name} width={20} height={20} className="rounded-sm" />
                                                    ) : (
                                                        <div className="w-5 h-5 bg-white/5 rounded-sm animate-pulse" />
                                                    )}
                                                    <span className="text-xs font-medium text-white/50">{names[cheapest.id] || cheapest.name}</span>
                                                </div>
                                                <div className="min-w-[80px] flex justify-end">
                                                    {formatGoldSilverCopper(cheapest.cost)}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </motion.div>

                {/* Detailed Tables Section */}
                <div className="space-y-16">
                    {REFINED_MATERIALS.map((mat, idx) => (
                        <motion.div
                            key={mat.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-[#0c0c0c] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-3xl"
                        >
                            {/* Table Header Section */}
                            <div className="p-8 md:p-12 bg-gradient-to-br from-[#121212] to-transparent border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-emerald-500/10 rounded-[1.5rem] border border-emerald-500/20">
                                        <Image src={mat.icon} alt={names[mat.id] || mat.name} width={56} height={56} className="brightness-125 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-black text-white tracking-tight uppercase">{names[mat.id] || mat.name}</h2>
                                        <div className="flex items-center gap-3 mt-2">
                                            <a href={`https://wiki.guildwars2.com/wiki/${mat.name.replace(/ /g, '_')}`} target="_blank" className="text-white/20 hover:text-white/60 transition-colors"><ExternalLink size={14} /></a>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-black/40 p-4 rounded-2xl border border-white/5 shadow-inner">
                                    <div className="text-xs font-bold text-white/40 uppercase tracking-widest ml-2">{t('homestead.efficiency', 'Trade Efficiency:')}</div>
                                    <div className="relative">
                                        <select
                                            value={efficiencies[mat.efficiencyKey]}
                                            onChange={(e) => setEfficiencies(prev => ({ ...prev, [mat.efficiencyKey]: parseInt(e.target.value) }))}
                                            className="bg-[#151515] text-emerald-400 border border-emerald-500/30 rounded-xl px-4 py-2 text-sm font-bold appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/50 pr-10 hover:border-emerald-500/60 transition-all shadow-lg"
                                        >
                                            <option value={0}>{t('homestead.level0', 'Level 0')}</option>
                                            <option value={1}>{t('homestead.level1', 'Level 1 (Upgraded)')}</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-emerald-500/60" />
                                    </div>
                                </div>
                            </div>

                            {/* Table Content */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/[0.03] text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/10">
                                            <th className="py-6 px-10">{t('common.item', 'Item')}</th>
                                            <th className="py-6 px-6 text-center">{t('homestead.detail.buy', 'Buy Price')}</th>
                                            <th className="py-6 px-6 text-center">{t('homestead.detail.sell', 'Sell Price')}</th>
                                            <th className="py-6 px-6 text-center">{t('homestead.detail.required', 'Required')}</th>
                                            <th className="py-6 px-10 text-right">{t('homestead.detail.total', 'Total Cost')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mat.ingredients
                                            .map(ing => ({ ...ing, ...calculateIngredientCost(ing, efficiencies[mat.efficiencyKey]) }))
                                            .map((item, iIndex) => (
                                                <tr
                                                    key={`${item.id}-${iIndex}`}
                                                    className={`group transition-all duration-300 border-b border-white/[0.03] last:border-0 ${iIndex === 0 ? 'bg-emerald-500/[0.03] hover:bg-emerald-500/[0.06]' : 'hover:bg-white/[0.02]'}`}
                                                >
                                                    <td className="py-5 px-10">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative group/icon">
                                                                <div className={`absolute inset-0 blur-md opacity-20 transition-opacity ${iIndex === 0 ? 'bg-emerald-400 opacity-40' : 'bg-white/0 group-hover/icon:opacity-20'}`}></div>
                                                                {icons[item.id] ? (
                                                                    <Image
                                                                        src={icons[item.id]}
                                                                        alt={names[item.id] || item.name}
                                                                        width={36}
                                                                        height={36}
                                                                        className={`relative rounded border transition-all ${iIndex === 0 ? 'border-emerald-500/50 scale-110 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'border-white/10 group-hover:border-white/20'}`}
                                                                    />
                                                                ) : (
                                                                    <div className={`relative w-[36px] h-[36px] rounded border border-white/10 bg-white/5 animate-pulse ${iIndex === 0 ? 'scale-110' : ''}`} />
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className={`text-sm font-bold tracking-tight transition-colors ${iIndex === 0 ? 'text-emerald-400' : 'text-white/80 group-hover:text-white'}`}>
                                                                    {names[item.id] || item.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6 text-center">
                                                        <div className="flex justify-center scale-90 opacity-60 group-hover:opacity-100 transition-opacity">
                                                            {formatGoldSilverCopper(item.buyPrice)}
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6 text-center">
                                                        <div className="flex justify-center scale-90 opacity-80 group-hover:opacity-100 transition-opacity">
                                                            {formatGoldSilverCopper(item.sellPrice)}
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <span className={`text-sm font-black ${item.efficiencyApplies && efficiencies[mat.efficiencyKey] > 0 ? 'text-blue-400' : 'text-white/40'}`}>
                                                                {item.requirement.toFixed(2)}
                                                            </span>
                                                            {item.efficiencyApplies && efficiencies[mat.efficiencyKey] > 0 && (
                                                                <span className="text-[8px] font-black text-blue-500/60 uppercase tracking-tighter -mt-1">
                                                                    {t('homestead.detail.mastery', 'Mastery Active')}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-10 text-right">
                                                        <div className="flex justify-end font-bold scale-105">
                                                            {formatGoldSilverCopper(item.totalCost)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomesteadPage;
