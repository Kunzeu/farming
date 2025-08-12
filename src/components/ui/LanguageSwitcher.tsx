'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '@/contexts/I18nContext';

const LANGS: { code: 'en' | 'de' | 'es' | 'fr'; labelKey: string; flag?: string }[] = [
  { code: 'en', labelKey: 'lang.english', flag: '🇬🇧' },
  { code: 'de', labelKey: 'lang.german', flag: '🇩🇪' },
  { code: 'es', labelKey: 'lang.spanish', flag: '🇪🇸' },
  { code: 'fr', labelKey: 'lang.french', flag: '🇫🇷' },
];

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = LANGS.find(l => l.code === lang) || LANGS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 bg-gray-900/80 hover:bg-gray-800/70 text-white px-3 py-2 rounded-md border border-gray-700 shadow"
      >
        <span className="text-lg">{current.flag ?? '🌐'}</span>
        <span className="text-sm font-semibold">{t(current.labelKey)}</span>
        <ChevronDown className={`w-4 h-4 text-gray-300 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute mt-2 right-0 w-44 bg-gray-900/95 backdrop-blur border border-gray-700 rounded-md shadow-lg py-2 z-50">
          {LANGS.map(option => (
            <button
              key={option.code}
              onClick={() => { setLang(option.code); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-800 ${lang === option.code ? 'font-bold text-white' : ''}`}
            >
              <span className="mr-2">{option.flag}</span>
              {t(option.labelKey)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


