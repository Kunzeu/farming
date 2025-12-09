'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Map as MapIcon, Info, AlertCircle } from 'lucide-react'; // Using AlertCircle for the guide section
import { useI18n } from '@/contexts/I18nContext';

export default function OrphanRoutePage() {
    const { t, lang } = useI18n();
    const [wrappingPaper, setWrappingPaper] = useState<{ name: string, icon: string } | null>(null);
    const [wrappedGift, setWrappedGift] = useState<{ name: string, icon: string } | null>(null);

    useEffect(() => {
        // Fetch specific items logic
        // 77612 Wrapping Paper
        // 77669 Wrapped Gift
        const fetchItems = async () => {
            const apiLang = lang === 'es' ? 'es' : lang === 'de' ? 'de' : lang === 'fr' ? 'fr' : 'en';
            try {
                const res = await fetch(`https://api.guildwars2.com/v2/items?ids=77612,77669&lang=${apiLang}`);
                const data = await res.json();
                data.forEach((item: any) => {
                    if (item.id === 77612) setWrappingPaper({ name: item.name, icon: item.icon });
                    if (item.id === 77669) setWrappedGift({ name: item.name, icon: item.icon });
                });
            } catch (error) {
                console.error("Error fetching guide items", error);
            }
        };

        fetchItems();
    }, [lang]);

    return (
        <div id="section-route" className="space-y-8">
            <div className="bg-gray-900/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-6 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <MapIcon className="w-6 h-6 mr-3 text-cyan-400" />
                    {t('wintersday.orphan.map.title', 'Mapa de la Ruta')}
                </h2>

                {/* Instructions Block */}
                <div className="bg-cyan-900/10 border-l-4 border-cyan-500 p-4 mb-6 rounded-r-lg">
                    <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-cyan-400 mr-3 mt-1 flex-shrink-0" />
                        <p className="text-gray-200 text-base leading-relaxed">
                            {t('wintersday.orphan.route.guide.part1', 'Debes comprar el objeto más barato en la')}
                            <Link href="/festivals/wintersday/Orphan/calculator" className="text-cyan-400 hover:text-cyan-300 underline mx-1 font-semibold">
                                {t('wintersday.orphan.route.guide.calculator', 'calculadora')}
                            </Link>
                            {t('wintersday.orphan.route.guide.part2', 'y hablar con Serafín del cuerpo de la caridad para comprar')}
                            <span className="inline-flex items-center mx-1 font-semibold text-white bg-black/30 px-2 py-0.5 rounded">
                                {wrappingPaper && <Image src={wrappingPaper.icon} alt={wrappingPaper.name} width={16} height={16} className="mr-1.5 rounded-sm" />}
                                {wrappingPaper ? wrappingPaper.name : 'Wrapping Paper'}
                            </span>
                            {t('wintersday.orphan.route.guide.part3', 'y fabricar el')}
                            <span className="inline-flex items-center mx-1 font-semibold text-white bg-black/30 px-2 py-0.5 rounded">
                                {wrappedGift && <Image src={wrappedGift.icon} alt={wrappedGift.name} width={16} height={16} className="mr-1.5 rounded-sm" />}
                                {wrappedGift ? wrappedGift.name : 'Wrapped Gift'}
                            </span>
                            {t('wintersday.orphan.route.guide.part4', 'para entregárselo a los huérfanos siguiendo esta ruta.')}
                        </p>
                    </div>
                </div>

                <div className="w-full bg-black/60 rounded-xl overflow-hidden shadow-inner border border-cyan-700/30 flex items-center justify-center relative group">
                    <Image
                        src="/images/assets/Orphans.webp"
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
    );
}
