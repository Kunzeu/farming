'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Navigation from '@/components/layout/Navigation';
import { ArrowLeft, Clock, Coins, Info, Calculator, Zap, Map as MapIcon, RotateCcw, ArrowUp, ArrowDown, ChevronsUpDown, HelpCircle, ShoppingCart, MapPin, Gift, Target, Youtube, Snowflake } from 'lucide-react';
import MarkdownText from '@/components/ui/MarkdownText';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';
import Link from 'next/link';

const WintersdayOrphanPage = () => {
    usePageTitle('wintersday.orphan.title', 'Ruta de los Huerfanitos');
    const { t, lang } = useI18n();
    const [selectedSection, setSelectedSection] = useState<string>('overview');

    // Item Data States
    const [wintersBlessingData, setWintersBlessingData] = useState<{ name: string, icon: string, wikiUrl: string } | null>(null);
    const [guildKarmaBannerData, setGuildKarmaBannerData] = useState<{ name: string, icon: string, wikiUrl: string } | null>(null);
    const [karmaBoosterData, setKarmaBoosterData] = useState<{ name: string, icon: string, wikiUrl: string } | null>(null);
    const [snowflakeGobblerData, setSnowflakeGobblerData] = useState<{ name: string, icon: string, wikiUrl: string } | null>(null);
    const [karmaEnrichmentData, setKarmaEnrichmentData] = useState<{ name: string, icon: string, wikiUrl: string } | null>(null);
    const [candyCornGobblerData, setCandyCornGobblerData] = useState<{ name: string, icon: string, wikiUrl: string } | null>(null);
    const [candyCaneGobblerData, setCandyCaneGobblerData] = useState<{ name: string, icon: string, wikiUrl: string } | null>(null);
    const [communityServiceTipsData, setCommunityServiceTipsData] = useState<{ name: string, icon: string, wikiUrl: string } | null>(null);
    const [celebrationBoosterData, setCelebrationBoosterData] = useState<{ name: string, icon: string, wikiUrl: string } | null>(null);
    const [spiritBannerData, setSpiritBannerData] = useState<{ name: string, icon: string, wikiUrl: string } | null>(null);
    const [guildKarmaBoostData, setGuildKarmaBoostData] = useState<{ name: string, icon: string, wikiUrl: string } | null>(null);

    // Calculator State
    const [prices, setPrices] = useState<Record<number, number>>({});
    const [items, setItems] = useState<Record<number, { name: string, icon: string }>>({});
    const [minPrice, setMinPrice] = useState<number>(0);

    const calculatorIds = [38448, 38450, 38449, 77579, 77630, 77643, 38463, 38458, 38469, 38467, 38461, 38471, 38460, 38465];

    useEffect(() => {
        const fetchCalculatorData = async () => {
            try {
                // Fetch Prices
                const ids = calculatorIds.join(',');
                const priceRes = await fetch(`https://api.guildwars2.com/v2/commerce/prices?ids=${ids}`);
                const priceData = await priceRes.json();
                const newPrices: Record<number, number> = {};
                let currentMinString = Infinity;

                priceData.forEach((p: any) => {
                    newPrices[p.id] = p.buys.unit_price; // Using Buy Price as 'Convenience' usually implies buying immediately? No, sell listing is "Buy Now". But usually you put buy orders if you plan. Let's use Sell Price (Buy Now) as the conservative "instant" cost, or Buy Price (Place Order) if specified. 
                    // Let's use Sell Price (what users pay instantly) to be safe, or show both?
                    // Typically 'Cost' implies Buying from TP. Buying instantly (tpsells) or ordering (tpbuys).
                    // Use Sell Price (unit_price from 'sells') for "Instant Buy".
                    // Wait, p.buys is "Buy Listings" (people wanting to buy). p.sells is "Sell Listings" (people selling).
                    // If I want to BUY, I pay the SELL listing price.
                    // So I should use p.sells.unit_price.
                    newPrices[p.id] = p.sells.unit_price;
                });
                setPrices(newPrices);

                // Calculate Min Total
                const quantities: Record<number, number> = {
                    38448: 4, 38449: 2, 38450: 1, 77579: 1, 77630: 1, 77643: 1,
                    38463: 1, 38458: 1, 38469: 1, 38467: 1, 38461: 1, 38471: 1, 38460: 1, 38465: 1
                };

                let min = Infinity;
                calculatorIds.forEach(id => {
                    if (newPrices[id]) {
                        const qty = quantities[id] || 1;
                        const total = newPrices[id] * qty * 30;
                        if (total < min) min = total;
                    }
                });
                setMinPrice(min === Infinity ? 0 : min);

                // Fetch Item Details (Name/Icon)
                const itemRes = await fetch(`https://api.guildwars2.com/v2/items?ids=${ids}&lang=${lang}`);
                const itemData = await itemRes.json();
                const newItems: Record<number, { name: string, icon: string }> = {};
                itemData.forEach((i: any) => {
                    newItems[i.id] = { name: i.name, icon: i.icon };
                });
                setItems(newItems);

            } catch (e) {
                console.error("Error fetching calculator data", e);
            }
        };

        if (selectedSection === 'calculator') {
            fetchCalculatorData();
        }
    }, [selectedSection, lang]);




    const sections = [
        { id: 'overview', label: t('wintersday.orphan.sections.overview', 'Resumen'), icon: Info },
        { id: 'preparation', label: t('wintersday.orphan.sections.preparation', 'Preparación'), icon: Zap },
        { id: 'route', label: t('wintersday.orphan.sections.route', 'Ruta'), icon: MapIcon },
        { id: 'calculator', label: t('wintersday.orphan.sections.calculator', 'Calculadora'), icon: Calculator },
    ];

    // Helper to build Wiki URLs
    const buildWikiUrl = (itemName: string) => {
        const langCode = lang === 'es' ? 'es' : lang === 'de' ? 'de' : lang === 'fr' ? 'fr' : 'en';
        const wikiBase = langCode === 'en' ? 'wiki.guildwars2.com' : `wiki-${langCode}.guildwars2.com`;
        return `https://${wikiBase}/wiki/${itemName.replace(/ /g, '_')}`;
    };

    // Generic fetch helper
    const fetchItemData = async (id: number, setter: (data: { name: string, icon: string, wikiUrl: string }) => void, fallbackName: string, fallbackIcon: string) => {
        const apiLang = lang === 'es' ? 'es' : lang === 'de' ? 'de' : lang === 'fr' ? 'fr' : 'en';
        try {
            const response = await fetch(`https://api.guildwars2.com/v2/items/${id}?lang=${apiLang}`);
            if (response.ok) {
                const data = await response.json();
                setter({
                    name: data.name,
                    icon: data.icon || fallbackIcon,
                    wikiUrl: buildWikiUrl(data.name)
                });
            } else {
                // Fallback if API fails
                setter({
                    name: fallbackName,
                    icon: fallbackIcon,
                    wikiUrl: buildWikiUrl(fallbackName)
                });
            }
        } catch (error) {
            console.error(`Error fetching item ${id}:`, error);
            setter({
                name: fallbackName,
                icon: fallbackIcon,
                wikiUrl: buildWikiUrl(fallbackName)
            });
        }
    };

    useEffect(() => {
        // Winter's Blessing (77656)
        fetchItemData(77656, setWintersBlessingData, t('wintersday.items.wintersBlessing'), 'https://wiki.guildwars2.com/images/3/36/Winter%27s_Blessing.png');

        // Guild Heroes Banner (39706)
        fetchItemData(39706, setGuildKarmaBannerData, t('wintersday.items.guildKarmaBanner'), 'https://wiki.guildwars2.com/images/9/90/Guild_Karma_Banner.png');

        // Communal Boost Bonfire (41741)
        fetchItemData(41741, setKarmaBoosterData, t('wintersday.items.karmaBooster'), 'https://wiki.guildwars2.com/images/thumb/7/75/Karma_Booster.png/48px-Karma_Booster.png');

        // Super Mixed Parfait (97933)
        fetchItemData(97933, setSnowflakeGobblerData, t('wintersday.items.snowflakeGobbler'), 'https://wiki.guildwars2.com/images/c/ca/Snowflake_Gobbler.png');

        // Karmic Enrichment (39332)
        fetchItemData(39332, setKarmaEnrichmentData, t('wintersday.items.karmaEnrichment'), 'https://wiki.guildwars2.com/images/e/e0/Karmic_Enrichment.png');

        // Peppermint Oil (77632)
        fetchItemData(77632, setCandyCornGobblerData, t('wintersday.items.candyCornGobbler'), 'https://wiki.guildwars2.com/images/3/33/Candy_Corn_Gobbler.png');

        // Candy Cane (77651)
        fetchItemData(77651, setCandyCaneGobblerData, t('wintersday.items.candyCaneGobbler'), 'https://wiki.guildwars2.com/images/3/33/Candy_Corn_Gobbler.png');

        // Celebration Booster (67393)
        fetchItemData(67393, setCelebrationBoosterData, t('wintersday.items.celebrationBooster'), 'https://wiki.guildwars2.com/images/thumb/5/5e/Celebration_Booster.png/48px-Celebration_Booster.png');

        // Spirit Banner (91146)
        fetchItemData(91146, setSpiritBannerData, t('wintersday.items.spiritBanner'), 'https://wiki.guildwars2.com/images/thumb/5/5e/Celebration_Booster.png/48px-Celebration_Booster.png');

        // Community Service Tips (Effect) -
        setCommunityServiceTipsData({
            name: t('wintersday.items.communityServiceTips', "Community Service Tips"),
            icon: 'https://wiki.guildwars2.com/images/4/4c/Story_Unlock-_Entanglement.png',
            wikiUrl: buildWikiUrl(t('wintersday.items.communityServiceTips', "Community Service Tips"))
        });

        // Guild Karma Bonus - Manual Set
        let guildKarmaWikiUrl = 'https://wiki.guildwars2.com/wiki/Guild_Karma_Bonus';
        if (lang === 'fr') {
            guildKarmaWikiUrl = 'https://wiki-fr.guildwars2.com/wiki/Augmentation_de_karma_de_guilde';
        } else if (lang === 'de') {
            guildKarmaWikiUrl = 'https://wiki-de.guildwars2.com/wiki/Gilden-Verst%C3%A4rkung:_Karma';
        }

        setGuildKarmaBoostData({
            name: t('wintersday.items.guildKarmaBonus', "Guild Karma Bonus"),
            icon: 'https://wiki.guildwars2.com/images/e/ec/Nourishment_%28Birthday_Blaster%29.png',
            wikiUrl: guildKarmaWikiUrl
        });



    }, [lang, t]);


    // Sorting State - Default: Cheapest (Total Ascending)
    const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'quantity' | 'price' | 'total', direction: 'asc' | 'desc' } | null>({ key: 'total', direction: 'asc' });

    // Handle Hash Navigation
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (sections.some(s => s.id === hash)) {
                setSelectedSection(hash);
            }
        };

        // Initial check
        handleHashChange();

        // Listen for changes
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleSectionChange = (startId: string) => {
        setSelectedSection(startId);
        window.location.hash = startId;
    };

    const handleSort = (key: 'name' | 'quantity' | 'price' | 'total') => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedItems = () => {
        const mappedItems = calculatorIds.map((id) => {
            const quantities: Record<number, number> = {
                38448: 4, 38449: 2, 38450: 1, 77579: 1, 77630: 1, 77643: 1,
                38463: 1, 38458: 1, 38469: 1, 38467: 1, 38461: 1, 38471: 1, 38460: 1, 38465: 1
            };
            const quantity = quantities[id] || 1;
            const price = prices[id] || 0;
            const total = price * quantity * 30;

            const names: Record<number, string> = {
                38448: "Ugly Wool Sock",
                38450: "Ugly Wool Sweater",
                38449: "Ugly Wool Hat",
                77579: "Tropical Peppermint Cake",
                77630: "Scoop of Mintberry Swirl Ice Cream",
                77643: "Peppermint Omnomberry Bar",
                38463: "Wooden Dagger Skin",
                38458: "Toy Staff Skin",
                38469: "Princess Wand Skin",
                38467: "Slingshot Skin",
                38461: "Pop Gun Skin",
                38471: "Bell Focus Skin",
                38460: "Toy Sword Skin",
                38465: "Toy Candy Cane Hammer Skin"
            };
            const name = items[id]?.name || names[id];

            return { id, name, quantity, price, total };
        });

        if (sortConfig !== null) {
            mappedItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return mappedItems;
    };

    const sortedItems = getSortedItems();

    return (
        <>
            <Navigation />
            <div
                className="min-h-screen relative"
                style={{
                    backgroundImage: 'url(/images/backgrounds/wintersday.webp)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                {/* Overlay oscuro para mejorar la legibilidad - Blue tint for Wintersday */}
                <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Contenido principal */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        {/* Botón Volver */}
                        <div className="flex justify-start mb-4">
                            <Link
                                href="/festivals/wintersday"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 hover:bg-gray-800/90 border border-cyan-500/30 text-white rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {t('festival.wintersday', 'Wintersday')}
                            </Link>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center drop-shadow-lg">
                            <span className="text-4xl mr-3">❄️</span>
                            {t('wintersday.orphan.title', 'Ruta de los Huerfanitos')}
                        </h1>

                        <p className="text-xl text-gray-200 max-w-4xl mx-auto leading-relaxed drop-shadow-md">
                            {t('wintersday.orphan.intro', 'Uno de los mejores eventos del festival...')}
                        </p>
                    </motion.div>

                    {/* Navigation Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-2 mb-8"
                    >
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => handleSectionChange(section.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${selectedSection === section.id
                                    ? 'bg-cyan-600/80 text-white border border-cyan-400/50 shadow-lg'
                                    : 'bg-gray-900/80 text-gray-300 hover:bg-gray-800/90 border border-cyan-500/20 hover:border-cyan-500/40'
                                    }`}
                            >
                                <section.icon className="w-4 h-4" />
                                {section.label}
                            </button>
                        ))}
                    </motion.div>

                    {/* Main Content Sections */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {/* Overview Section */}
                        {selectedSection === 'overview' && (
                            <div id="section-overview" className="space-y-8">
                                <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 shadow-2xl">
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                        <Info className="w-6 h-6 mr-3 text-cyan-400" />
                                        {t('wintersday.orphan.sections.overview', 'Resumen')}
                                    </h2>

                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-gray-200 mb-6 text-lg leading-relaxed">
                                            {t('wintersday.orphan.intro', 'Uno de los mejores eventos del festival del día invernal para ganar Karma rápidamente. Alimenta a los huérfanos repartidos por Linde de la Divinidad.')}
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
                                                <h3 className="text-white font-semibold mb-3 flex items-center">
                                                    <Target className="w-5 h-5 mr-2 text-cyan-400" />
                                                    {t('wintersday.orphan.overview.objective.title', 'Objetivo')}
                                                </h3>
                                                <p className="text-gray-300 text-sm">
                                                    {t('wintersday.orphan.overview.objective.text', 'Encontrar y dar regalos a los 30 huérfanos repartidos por Linde de la Divinidad diariamente.')}
                                                </p>
                                            </div>
                                            <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4">
                                                <h3 className="text-white font-semibold mb-3 flex items-center">
                                                    <Gift className="w-5 h-5 mr-2 text-purple-400" />
                                                    {t('wintersday.orphan.overview.rewards.title', 'Recompensas')}
                                                </h3>
                                                <p className="text-gray-300 text-sm">
                                                    {t('wintersday.orphan.overview.rewards.text', 'Enormes cantidades de Karma + Karma líquido. Es la fuente más eficiente de Karma del juego si se hace correctamente.')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Preparation Section (Boosters) */}
                        {selectedSection === 'preparation' && (
                            <div id="section-preparation" className="space-y-8">
                                <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 shadow-2xl">
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                        <Zap className="w-6 h-6 mr-3 text-cyan-400" />
                                        {t('wintersday.orphan.boosters.title', 'Potenciadores')}
                                    </h2>
                                    <p className="text-gray-200 mb-6 text-lg">
                                        {t('wintersday.orphan.boosters.intro', 'Maximiza tu ganancia de Karma...')}
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Winters Blessing - Highlighted */}
                                        {wintersBlessingData && (
                                            <a href={wintersBlessingData.wikiUrl} target="_blank" rel="noopener noreferrer"
                                                className="col-span-1 md:col-span-2 lg:col-span-1 bg-cyan-900/20 border border-cyan-500/40 rounded-lg p-4 hover:bg-cyan-900/30 transition-all group">
                                                <h3 className="text-cyan-300 font-semibold mb-3 flex items-center group-hover:text-cyan-200">
                                                    {wintersBlessingData.icon && (
                                                        <Image src={wintersBlessingData.icon} alt={wintersBlessingData.name} width={32} height={32} className="mr-3 rounded shadow-md" />
                                                    )}
                                                    {wintersBlessingData.name}
                                                </h3>
                                                <p className="text-gray-300 text-sm">
                                                    +10% Karma
                                                </p>
                                            </a>
                                        )}

                                        {/* Standard Boosters */}
                                        {[
                                            { data: communityServiceTipsData, desc: "+10% Karma", color: "purple" },
                                            {
                                                group: [celebrationBoosterData, karmaBoosterData],
                                                desc: " +50% Karma",
                                                color: "orange"
                                            },
                                            { data: guildKarmaBannerData, desc: "+15% Karma", color: "yellow" },
                                            { data: guildKarmaBoostData, desc: "+10% Karma", color: "green" },
                                            { data: karmaEnrichmentData, desc: "+15% Karma (Amulet)", color: "pink" },
                                            { data: snowflakeGobblerData, desc: "+15% Karma", color: "cyan" },
                                            { data: candyCornGobblerData, desc: "+10% Karma", color: "orange" },
                                            { data: candyCaneGobblerData, desc: "+10% Karma", color: "red" },
                                            { data: spiritBannerData, desc: "+10% Karma", color: "blue" },
                                        ].map((item, idx) => {
                                            if (item.group) {
                                                const validGroupItems = item.group.filter(g => g !== null);
                                                if (validGroupItems.length === 0) return null;

                                                return (
                                                    <div key={idx} className={`bg-gray-800/40 border border-gray-700 hover:border-${item.color}-500/50 rounded-lg p-4 transition-all hover:translate-y-[-2px] hover:shadow-lg flex flex-col justify-center`}>
                                                        {validGroupItems.map((groupItem: any, gIdx: number) => (
                                                            <div key={gIdx}>
                                                                {gIdx > 0 && (
                                                                    <div className="text-center text-xs text-gray-400 font-medium my-2">
                                                                        — {t('wintersday.common.or', 'O')} —
                                                                    </div>
                                                                )}
                                                                <a href={groupItem.wikiUrl} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
                                                                    <h3 className={`font-semibold mb-1 flex items-center text-gray-200 hover:text-${item.color}-300 transition-colors`}>
                                                                        {groupItem.icon && (
                                                                            <Image src={groupItem.icon} alt={groupItem.name} width={24} height={24} className="mr-3 rounded" />
                                                                        )}
                                                                        <span className="truncate text-sm">{groupItem.name}</span>
                                                                    </h3>
                                                                </a>
                                                            </div>
                                                        ))}
                                                        <p className="text-gray-400 text-xs ml-9 mt-1">
                                                            {item.desc}
                                                        </p>
                                                    </div>
                                                );
                                            }

                                            return item.data && (
                                                <a key={idx} href={item.data.wikiUrl} target="_blank" rel="noopener noreferrer"
                                                    className={`bg-gray-800/40 border border-gray-700 hover:border-${item.color}-500/50 rounded-lg p-4 transition-all hover:translate-y-[-2px] hover:shadow-lg`}>
                                                    <h3 className={`font-semibold mb-2 flex items-center text-gray-200 hover:text-${item.color}-300 transition-colors`}>
                                                        {item.data.icon && (
                                                            <Image src={item.data.icon} alt={item.data.name} width={24} height={24} className="mr-3 rounded" />
                                                        )}
                                                        <span className="truncate">{item.data.name}</span>
                                                    </h3>
                                                    <p className="text-gray-400 text-xs ml-9">
                                                        {item.desc}
                                                    </p>
                                                </a>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-8 text-center">
                                        <a
                                            href="https://wiki.guildwars2.com/wiki/Karma#Modifiers"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors border-b border-cyan-400/30 hover:border-cyan-300"
                                        >
                                            <Info className="w-4 h-4 mr-2" />
                                            {t('wintersday.orphan.boosters.allModifiers', 'Aquí encontrarás todos los potenciadores de Karma')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Route Section */}
                        {selectedSection === 'route' && (
                            <div id="section-route" className="space-y-8">
                                <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 shadow-2xl">
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                        <MapIcon className="w-6 h-6 mr-3 text-cyan-400" />
                                        {t('wintersday.orphan.map.title', 'Mapa de la Ruta')}
                                    </h2>

                                    <div className="w-full bg-black/60 rounded-xl overflow-hidden shadow-inner border border-cyan-700/30 flex items-center justify-center relative group">
                                        <Image
                                            src="/images/assets/Orphans_map.webp"
                                            alt="Orphans Route Map"
                                            width={1920}
                                            height={1080}
                                            className="w-full h-auto object-contain"
                                            priority
                                        />
                                    </div>

                                    <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-6 mt-6">
                                        <h3 className="text-cyan-300 font-semibold mb-4 flex items-center">
                                            <Info className="w-5 h-5 mr-2" />
                                            {t('wintersday.orphan.route.tips.title', 'Tips para la Ruta')}
                                        </h3>
                                        <ul className="space-y-2 text-gray-300 list-disc list-inside">
                                            <li>{t('wintersday.orphan.route.tips.list.buyGifts', 'Compra los regalos necesarios con anterioridad.')}</li>
                                            <li>{t('wintersday.orphan.route.tips.list.jumpingPuzzle', 'Recuerda hacer el puzzle de salto diario para extra karma.')}</li>
                                            <li>{t('wintersday.orphan.route.tips.list.lowerLevels', 'Algunos huérfanos están escondidos en niveles inferiores.')}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}


                        {/* Calculator Section */}
                        {selectedSection === 'calculator' && (
                            <div id="section-calculator" className="space-y-8">
                                <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 shadow-2xl">
                                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                        <Calculator className="w-6 h-6 mr-3 text-cyan-400" />
                                        {t('wintersday.calculator.title', 'Calculadora de Regalos')}
                                    </h2>
                                    <p className="text-gray-300 mb-6">
                                        {t('wintersday.calculator.desc', 'Compara el costo de obtener los Regalos Envueltos necesarios con diferentes objetos.')}
                                    </p>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-gray-300">
                                            <thead className="text-xs uppercase bg-cyan-900/20 text-cyan-300">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-l-lg cursor-pointer hover:bg-cyan-900/40 transition-colors group" onClick={() => handleSort('name')}>
                                                        <div className="flex items-center">
                                                            {t('wintersday.calculator.item', 'Objeto')}
                                                            {sortConfig?.key === 'name' ? (
                                                                sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />
                                                            ) : (
                                                                <ChevronsUpDown className="w-3 h-3 ml-1 text-gray-500 opacity-50" />
                                                            )}
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-center cursor-pointer hover:bg-cyan-900/40 transition-colors group" onClick={() => handleSort('quantity')}>
                                                        <div className="flex items-center justify-center">
                                                            {t('wintersday.calculator.quantity', 'Cantidad')}
                                                            {sortConfig?.key === 'quantity' ? (
                                                                sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />
                                                            ) : (
                                                                <ChevronsUpDown className="w-3 h-3 ml-1 text-gray-500 opacity-50" />
                                                            )}
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-right cursor-pointer hover:bg-cyan-900/40 transition-colors group" onClick={() => handleSort('price')}>
                                                        <div className="flex items-center justify-end">
                                                            {t('wintersday.calculator.price', 'Precio Unitario')}
                                                            {sortConfig?.key === 'price' ? (
                                                                sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />
                                                            ) : (
                                                                <ChevronsUpDown className="w-3 h-3 ml-1 text-gray-500 opacity-50" />
                                                            )}
                                                        </div>
                                                    </th>
                                                    <th className="px-4 py-3 text-right rounded-r-lg cursor-pointer hover:bg-cyan-900/40 transition-colors group" onClick={() => handleSort('total')}>
                                                        <div className="flex items-center justify-end">
                                                            {t('wintersday.calculator.total', 'Costo por 30')}
                                                            {sortConfig?.key === 'total' ? (
                                                                sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />
                                                            ) : (
                                                                <ChevronsUpDown className="w-3 h-3 ml-1 text-gray-500 opacity-50" />
                                                            )}
                                                        </div>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-800">
                                                {sortedItems.map((item) => {
                                                    const { id, quantity, price, total, name } = item;
                                                    const isCheapest = minPrice > 0 && total === minPrice;
                                                    const icon = items[id]?.icon;

                                                    return (
                                                        <tr key={id} className={`hover:bg-cyan-900/10 transition-colors ${isCheapest ? 'bg-green-900/20' : ''}`}>
                                                            <td className="px-4 py-4 flex items-center">
                                                                {icon && <Image src={icon} alt={name} width={32} height={32} className="mr-3 rounded" />}
                                                                <div>
                                                                    <div className={isCheapest ? 'text-green-400 font-semibold' : ''}>{name}</div>
                                                                </div>
                                                                {isCheapest && <span className="ml-2 text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded-full border border-green-700">{t('wintersday.calculator.cheapest', '¡Más Barato!')}</span>}
                                                            </td>
                                                            <td className="px-4 py-4 text-center font-mono text-gray-300">
                                                                {quantity}
                                                            </td>
                                                            <td className="px-4 py-4 text-right font-mono text-gray-400">
                                                                {price > 0 ? (
                                                                    <>
                                                                        {Math.floor(price / 10000) > 0 && <span className="text-yellow-500 mr-1">{Math.floor(price / 10000)}g</span>}
                                                                        {Math.floor((price % 10000) / 100) > 0 && <span className="text-gray-400 mr-1">{Math.floor((price % 10000) / 100)}s</span>}
                                                                        <span className="text-orange-400">{price % 100}c</span>
                                                                    </>
                                                                ) : '...'}
                                                            </td>
                                                            <td className="px-4 py-4 text-right font-mono font-medium text-white">
                                                                {price > 0 ? (
                                                                    <>
                                                                        {Math.floor(total / 10000) > 0 && <span className="text-yellow-500 mr-1">{Math.floor(total / 10000)}g</span>}
                                                                        {Math.floor((total % 10000) / 100) > 0 && <span className="text-gray-400 mr-1">{Math.floor((total % 10000) / 100)}s</span>}
                                                                        <span className="text-orange-400">{total % 100}c</span>
                                                                    </>
                                                                ) : '...'}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>

                                    </div>
                                    <div className="mt-4 text-xs text-gray-500 text-center">
                                        * {t('wintersday.calculator.disclaimer', 'Prices updated from Trading Post. Does not include Karma cost for Wrapping Paper (500 Karma each).')}
                                    </div>
                                </div>
                            </div>
                        )}

                    </motion.div>
                </div >
            </div >
        </>
    );
};

export default WintersdayOrphanPage;
