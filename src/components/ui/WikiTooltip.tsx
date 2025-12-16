'use client';

import { useState, useRef, useEffect } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useI18n } from '@/contexts/I18nContext';

interface WikiTooltipProps {
    itemId: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    itemData?: any | null;
    fallbackName?: string;
    className?: string;
    children: React.ReactNode;
}
interface ItemDetails {
    id: number;
    name: string;
    description?: string;
    type?: string;
    rarity?: string;
    level?: number;
    icon?: string;
    chat_link?: string;
    details?: {
        infix_upgrade?: {
            attributes: Array<{
                attribute: string;
                modifier: number;
            }>;
        };
    };
}

// Translations constants
const TRANSLATIONS: Record<string, Record<string, string>> = {
    en: {
        weapon: 'Weapon',
        rarity: 'Rarity',
        level: 'Level',
        legendary: 'Legendary',
        stats: 'Stats',
        Power: 'Power',
        Precision: 'Precision',
        Toughness: 'Toughness',
        Vitality: 'Vitality',
        ConditionDamage: 'Condition Damage',
        HealingPower: 'Healing Power',
        Concentration: 'Concentration',
        Expertise: 'Expertise',
        Ferocity: 'Ferocity',
        AgonyResistance: 'Agony Resistance',
    },
    es: {
        weapon: 'Arma',
        rarity: 'Rareza',
        level: 'Nivel',
        legendary: 'Legendario',
        stats: 'Estadísticas',
        Power: 'Poder',
        Precision: 'Precisión',
        Toughness: 'Dureza',
        Vitality: 'Vitalidad',
        ConditionDamage: 'Daño de condición',
        HealingPower: 'Poder de curación',
        Concentration: 'Concentración',
        Expertise: 'Experiencia',
        Ferocity: 'Ferocidad',
        AgonyResistance: 'Resistencia a la agonía',
    },
    de: {
        weapon: 'Waffe',
        rarity: 'Seltenheit',
        level: 'Stufe',
        legendary: 'Legendär',
        stats: 'Statistiken',
        Power: 'Kraft',
        Precision: 'Präzision',
        Toughness: 'Zähigkeit',
        Vitality: 'Vitalität',
        ConditionDamage: 'Zustandsschaden',
        HealingPower: 'Heilkraft',
        Concentration: 'Konzentration',
        Expertise: 'Fachwissen',
        Ferocity: 'Wildheit',
        AgonyResistance: 'Qual-Widerstand',
    },
    fr: {
        weapon: 'Arme',
        rarity: 'Rareté',
        level: 'Niveau',
        legendary: 'Légendaire',
        stats: 'Statistiques',
        Power: 'Puissance',
        Precision: 'Précision',
        Toughness: 'Robustesse',
        Vitality: 'Vitalité',
        ConditionDamage: 'Dégâts de condition',
        HealingPower: 'Puissance de soin',
        Concentration: 'Concentration',
        Expertise: 'Expertise',
        Ferocity: 'Férocité',
        AgonyResistance: 'Résistance à l\'agonie',
    },
};

export default function WikiTooltip({ itemId, itemData: initialItemData, fallbackName, className, children }: WikiTooltipProps) {
    const { lang } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // We use initialItemData if provided, otherwise we fetch it (though plan is to always provide it from page)
    const [fetchedData, setFetchedData] = useState<ItemDetails | null>(null);
    const [price, setPrice] = useState<number | null>(null);
    const [position, setPosition] = useState({ top: 0, left: 0 });

    const triggerRef = useRef<HTMLElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                tooltipRef.current &&
                !tooltipRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const fetchData = async () => {
        // If we already have price, assume we are done
        if (price !== null) return;

        setIsLoading(true);
        try {
            const promises = [];

            // 1. Fetch Item Details if not provided
            let dataPromise: Promise<any> | null = null;
            if (!initialItemData) {
                dataPromise = fetch(`https://api.guildwars2.com/v2/items/${itemId}?lang=${lang}`)
                    .then(res => res.ok ? res.json() : null)
                    .catch(() => null);
                promises.push(dataPromise);
            }

            // 2. Fetch Price (1 API Call)
            const pricePromise = fetch(`https://api.guildwars2.com/v2/commerce/prices/${itemId}`)
                .then(res => res.ok ? res.json() : null)
                .catch(() => null);
            promises.push(pricePromise);

            const results = await Promise.all(promises);

            if (!initialItemData && results[0]) {
                setFetchedData(results[0]);
            }

            const priceData = initialItemData ? results[0] : results[1];
            if (priceData) {
                setPrice(priceData.sells?.unit_price || 0);
            } else {
                setPrice(0); // Price not found or error
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isOpen) {
            if (triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                const scrollY = window.scrollY;

                let top = rect.bottom + scrollY + 8;
                let left = Math.min(rect.left, window.innerWidth - 320 - 16);
                if (left < 16) left = 16;
                if (rect.bottom + 450 > window.innerHeight + scrollY) {
                    top = rect.top + scrollY - 450;
                }

                setPosition({ top, left });
                fetchData();
            }
        }
        setIsOpen(!isOpen);
    };

    const getWikiUrl = (name: string, targetLang: string) => {
        if (!name && !itemId) return '#';

        // If target language is same as current fetching language (and we have name), use name
        if (targetLang === lang && name) {
            const normalizedName = name.replace(/ /g, '_');
            const subdomain = targetLang === 'en' ? 'wiki' : `wiki-${targetLang}`;
            return `https://${subdomain}.guildwars2.com/wiki/${normalizedName}`;
        }

        // Otherwise use Chat Code search which works universally without needing localized name
        // Chat code format [&AgH1LQAA] -> Base64 encode [0x02, count(1), itemId(4 bytes), 0x00]? 
        // Easier: use API provided chat_link if available, but API only gives it for current item.
        // Actually the wiki search supports searching by chat code! e.g. wiki.guildwars2.com/wiki/Special:Search/[&AgH1LQAA]
        // But we need to GENERATE the chat code if we don't have it for that specific language? 
        // Chat codes are language independent. So we can use the one from initialItemData.
        // If we don't have chat code, use ID search? Wiki supports "Item_ID" redirect usually?
        // Official Wiki: https://wiki.guildwars2.com/wiki/Special:Search/12345 often works or Property:Game_ID
        // Best fallback: `https://wiki.guildwars2.com/index.php?title=Special%3ASearch&search=${itemId}`

        // Better strategy for foreign wikis without name:
        // Use the chat link if we have it (API provides it).
        // If no chat link, try ID search.

        const subdomain = targetLang === 'en' ? 'wiki' : `wiki-${targetLang}`;

        if (initialItemData?.chat_link || fetchedData?.chat_link) {
            const chatLink = initialItemData?.chat_link || fetchedData?.chat_link;
            // Usar index.php?search para evitar problemas con caracteres especiales en la URL
            const encodedChatLink = encodeURIComponent(chatLink);
            return `https://${subdomain}.guildwars2.com/index.php?title=Special:Search&search=${encodedChatLink}`;
        }

        // Fallback to ID search if everything else fails
        return `https://${subdomain}.guildwars2.com/index.php?title=Special:Search&search=${itemId}`;
    };

    // Helper functions
    const getTranslation = (key: string, l: string) => TRANSLATIONS[l]?.[key] || TRANSLATIONS.en[key] || key;

    const translateRarity = (rarity: string | undefined, l: string) => {
        if (!rarity) return '';
        const rarityLower = rarity.toLowerCase();
        if (rarityLower === 'legendary') return getTranslation('legendary', l);
        return rarity;
    };

    const translateAttribute = (attribute: string, l: string) => {
        const normalized = attribute.replace(/\s+/g, '');
        const translation = getTranslation(normalized, l);
        return translation !== normalized ? translation : attribute.replace(/([A-Z])/g, ' $1').trim();
    };

    const convertCopperToCoins = (copper: number) => {
        const gold = Math.floor(copper / 10000);
        const silver = Math.floor((copper % 10000) / 100);
        const remainingCopper = copper % 100;
        return { gold, silver, copper: remainingCopper };
    };

    // Use passed data or fetched data
    const currentData = initialItemData || fetchedData;

    return (
        <>
            <span
                ref={triggerRef}
                onClick={handleToggle}
                className={`cursor-pointer inline-flex ${className || ''}`}
            >
                {children}
            </span>

            {isOpen && typeof document !== 'undefined' && createPortal(
                <div
                    ref={tooltipRef}
                    style={{
                        top: position.top,
                        left: position.left,
                        zIndex: 9999
                    }}
                    className="absolute bg-slate-800 border border-purple-500/50 rounded-lg shadow-xl p-4 w-80 animate-in fade-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {isLoading && !currentData ? (
                        // Only show full loader if we have absolutely no data. 
                        // If we have itemData but loading price, show itemData + price loader
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                        </div>
                    ) : currentData ? (
                        <>
                            {/* Header */}
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
                                {currentData.icon && (
                                    <Image
                                        src={currentData.icon}
                                        alt={currentData.name}
                                        width={32}
                                        height={32}
                                        className="w-8 h-8"
                                        unoptimized
                                    />
                                )}
                                <div className="flex-1">
                                    <h3 className="text-white font-semibold text-sm">{currentData.name}</h3>
                                    {currentData.type && (
                                        <p className="text-gray-400 text-xs">
                                            {currentData.type === 'Weapon' ? getTranslation('weapon', lang) : currentData.type}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {currentData.description && (
                                <div
                                    className="text-gray-300 text-xs mb-3 line-clamp-4"
                                    dangerouslySetInnerHTML={{ __html: currentData.description }}
                                />
                            )}

                            {/* Info: Rarity & Price */}
                            <div className="flex justify-between items-center mb-3 text-xs border-b border-gray-700 pb-2">
                                {currentData.rarity && (
                                    <span className="text-gray-400">
                                        {getTranslation('rarity', lang)}: <span className={`font-semibold ${currentData.rarity.toLowerCase() === 'legendary' ? 'text-purple-400' :
                                            currentData.rarity.toLowerCase() === 'ascended' ? 'text-pink-400' :
                                                currentData.rarity.toLowerCase() === 'exotic' ? 'text-orange-400' :
                                                    currentData.rarity.toLowerCase() === 'rare' ? 'text-yellow-400' :
                                                        currentData.rarity.toLowerCase() === 'masterwork' ? 'text-green-400' :
                                                            currentData.rarity.toLowerCase() === 'fine' ? 'text-blue-400' :
                                                                'text-gray-400'
                                            }`}>
                                            {translateRarity(currentData.rarity, lang)}
                                        </span>
                                    </span>
                                )}

                                {/* Price Display */}
                                {isLoading && price === null ? (
                                    <Loader2 className="w-3 h-3 text-gray-500 animate-spin" />
                                ) : price !== null && price > 0 ? (
                                    <div className="flex items-center gap-1">
                                        {(() => {
                                            const coins = convertCopperToCoins(price);
                                            return (
                                                <>
                                                    {coins.gold > 0 && (
                                                        <div className="flex items-center gap-0.5">
                                                            <span className="text-yellow-400 font-semibold">{coins.gold}</span>
                                                            <Image src="/images/expansions/Gold.webp" alt="Gold" width={12} height={12} className="w-3 h-3" unoptimized />
                                                        </div>
                                                    )}
                                                    {(coins.gold > 0 || coins.silver > 0) && (
                                                        <div className="flex items-center gap-0.5">
                                                            <span className="text-gray-300 font-semibold">{coins.silver}</span>
                                                            <Image src="/images/expansions/Silver.webp" alt="Silver" width={12} height={12} className="w-3 h-3" unoptimized />
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-0.5">
                                                        <span className="text-orange-400 font-semibold">{coins.copper}</span>
                                                        <Image src="/images/expansions/Copper.webp" alt="Copper" width={12} height={12} className="w-3 h-3" unoptimized />
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                ) : null}
                            </div>


                            {/* Wiki Links */}
                            <div className="border-t border-gray-700 pt-2">
                                <p className="text-gray-400 text-xs mb-2">Wiki:</p>
                                <div className="flex flex-wrap gap-2">
                                    {(['en', 'es', 'de', 'fr'] as const).map((l) => {
                                        return (
                                            <a
                                                key={l}
                                                href={getWikiUrl(currentData.name, l)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
                                            >
                                                {l.toUpperCase()}
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-400 py-2">
                            {fallbackName}
                        </div>
                    )}
                </div>,
                document.body
            )}
        </>
    );
}
