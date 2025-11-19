'use client';

import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useI18n } from '@/contexts/I18nContext';
import { Trophy, ArrowRight } from 'lucide-react';

interface ContributionEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
}

const ContributionsPage = () => {
  usePageTitle('pageTitles.contributions', 'Contributions');
  const { t } = useI18n();

  const events: ContributionEvent[] = [
    {
      id: '1',
      slug: 'contribuciones-de-la-comunidad',
      title: 'Contribuciones de la Comunidad',
      description: 'Evento de contribuciones y donaciones de la comunidad de Guild Wars 2.',
      startDate: '2022-07-29',
      endDate: '2022-07-31',
      status: 'completed'
    }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h1 className="text-3xl font-bold">{t('pageTitles.contributions')}</h1>
          </div>

          <div className="space-y-6">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/contributions/${event.slug}`}
                className="block bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-purple-500 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                    <p className="text-gray-400 text-sm">{event.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContributionsPage;

