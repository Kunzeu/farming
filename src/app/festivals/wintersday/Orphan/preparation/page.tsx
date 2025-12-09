'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Zap, Info } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export default function OrphanPreparationPage() {
    const { t, lang } = useI18n();

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

    return (
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
    );
}
