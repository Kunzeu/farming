'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Info, Target, Gift } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

export default function OrphanOverviewPage() {
    const { t, lang } = useI18n();
    const [karmaEnrichment, setKarmaEnrichment] = useState<{ name: string, icon: string } | null>(null);

    useEffect(() => {
        const fetchItem = async () => {
            const apiLang = lang === 'es' ? 'es' : lang === 'de' ? 'de' : lang === 'fr' ? 'fr' : 'en';
            try {
                const res = await fetch(`https://api.guildwars2.com/v2/items/39332?lang=${apiLang}`);
                const data = await res.json();
                setKarmaEnrichment({ name: data.name, icon: data.icon });
            } catch (error) {
                console.error("Error fetching item 39332", error);
            }
        };
        fetchItem();
    }, [lang]);

    return (
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

                    <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 mt-6 flex items-start">
                        <Info className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div className="text-gray-300 text-sm leading-relaxed">
                            {t('wintersday.orphan.overview.tips.pvp.part1', 'TIP: Las instancias de las campanas, prueba de salto y el Juguetecalipsis son instancias de PvP. Abran los cofres saltarines de madera en Linde para que haga efecto el')}
                            <span className="inline-flex items-center mx-1 font-semibold text-white bg-black/30 px-2 py-0.5 rounded align-middle">
                                {karmaEnrichment && <Image src={karmaEnrichment.icon} alt={karmaEnrichment.name} width={16} height={16} className="mr-1.5 rounded-sm inline-block" />}
                                {karmaEnrichment ? karmaEnrichment.name : 'Karmic Enrichment'}
                            </span>
                            {t('wintersday.orphan.overview.tips.pvp.part2', '.')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
