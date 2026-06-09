'use client';

import { useState } from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

interface SalvageInfoNoteProps {
  content: string;
}

export default function SalvageInfoNote({ content }: SalvageInfoNoteProps) {
  const { t } = useI18n();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-blue-500/30 bg-blue-950/30 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
        <div className="min-w-0 flex-1 text-sm leading-relaxed text-blue-100">
          <span className="font-medium text-blue-200">
            {t('salvage.note.title', 'Note')}
          </span>
          <div className={`mt-1 ${!expanded ? 'line-clamp-2 md:line-clamp-none' : ''}`}>
            {content}
          </div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-300 transition-colors hover:text-blue-200 md:hidden"
          >
            <ChevronDown className={`h-3 w-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            {expanded
              ? t('salvage.note.showLess', 'Ver menos')
              : t('salvage.note.showMore', 'Ver más')}
          </button>
        </div>
      </div>
    </div>
  );
}
