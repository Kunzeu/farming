'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Navigation from '@/components/layout/Navigation';
import { ArrowLeft, Info, Zap, Map as MapIcon, Calculator } from 'lucide-react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';

export default function WintersdayOrphanLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    usePageTitle('wintersday.orphan.title', 'Ruta de los Huerfanitos');
    const { t } = useI18n();
    const pathname = usePathname();

    // Determine active section based on pathname
    // /festivals/wintersday/Orphan -> overview
    // /festivals/wintersday/Orphan/preparation -> preparation
    // etc.
    const getLastSegment = (path: string) => {
        const parts = path.split('/');
        const last = parts[parts.length - 1];
        if (last === 'Orphan') return 'overview';
        return last;
    };

    const activeSection = getLastSegment(pathname);

    const sections = [
        { id: 'overview', label: t('wintersday.orphan.sections.overview', 'Resumen'), icon: Info, href: '/festivals/wintersday/Orphan/overview' },
        { id: 'preparation', label: t('wintersday.orphan.sections.preparation', 'Preparación'), icon: Zap, href: '/festivals/wintersday/Orphan/preparation' },
        { id: 'route', label: t('wintersday.orphan.sections.route', 'Ruta'), icon: MapIcon, href: '/festivals/wintersday/Orphan/route' },
        { id: 'calculator', label: t('wintersday.orphan.sections.calculator', 'Calculadora'), icon: Calculator, href: '/festivals/wintersday/Orphan/calculator' },
    ];

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
                            <Link
                                key={section.id}
                                href={section.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${activeSection === section.id
                                    ? 'bg-cyan-600/80 text-white border border-cyan-400/50 shadow-lg'
                                    : 'bg-gray-900/80 text-gray-300 hover:bg-gray-800/90 border border-cyan-500/20 hover:border-cyan-500/40'
                                    }`}
                            >
                                <section.icon className="w-4 h-4" />
                                {section.label}
                            </Link>
                        ))}
                    </motion.div>

                    {/* Main Content Sections */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </div >
            </div >
        </>
    );
}
