'use client';

import { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/contexts/I18nContext';
import { ChevronDown } from 'lucide-react';

const LANGS: { code: 'en' | 'de' | 'es' | 'fr'; labelKey: string; flag?: string }[] = [
  { code: 'en', labelKey: 'lang.english', flag: '🇬🇧' },
  { code: 'de', labelKey: 'lang.german', flag: '🇩🇪' },
  { code: 'es', labelKey: 'lang.spanish', flag: '🇪🇸' },
  { code: 'fr', labelKey: 'lang.french', flag: '🇫🇷' },
];

function Flag({ code, className }: { code: 'en' | 'de' | 'es' | 'fr'; className?: string }) {
  switch (code) {
    case 'de':
      return (
        <svg viewBox="0 0 5 3" className={className} aria-hidden="true">
          <rect width="5" height="3" fill="#000" />
          <rect width="5" height="2" y="1" fill="#DD0000" />
          <rect width="5" height="1" y="2" fill="#FFCE00" />
        </svg>
      );
    case 'fr':
      return (
        <svg viewBox="0 0 3 2" className={className} aria-hidden="true">
          <rect width="1" height="2" x="0" fill="#0055A4" />
          <rect width="1" height="2" x="1" fill="#FFFFFF" />
          <rect width="1" height="2" x="2" fill="#EF4135" />
        </svg>
      );
    case 'es':
      return (
        <svg viewBox="0 0 3 2" className={className} aria-hidden="true">
          <rect width="3" height="2" fill="#AA151B" />
          <rect width="3" height="1.2" y="0.4" fill="#F1BF00" />
        </svg>
      );
    case 'en':
    default:
      return (
        <svg viewBox="0 0 60 30" className={className} aria-hidden="true">
          <rect width="60" height="30" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
          <rect x="25" width="10" height="30" fill="#FFFFFF" />
          <rect y="10" width="60" height="10" fill="#FFFFFF" />
          <rect x="27" width="6" height="30" fill="#C8102E" />
          <rect y="12" width="60" height="6" fill="#C8102E" />
        </svg>
      );
  }
}

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
      {/* Desktop: inline flags */}
      <div className="hidden lg:flex items-center gap-2">
		{LANGS.map(option => (
			<button
				key={option.code}
				onClick={() => { setLang(option.code); }}
				className="text-lg transition-all"
				aria-label={t(option.labelKey)}
			>
				<span className={`block rounded-sm transition-all ${lang === option.code ? 'shadow-sm scale-110 opacity-100' : 'opacity-40 hover:opacity-100 hover:ring-1 ring-white/40'}`}>
					<Flag code={option.code} className="w-7 h-5" />
				</span>
			</button>
		))}
      </div>

      {/* Mobile: compact button + dropdown (flags only) */}
      <div className="lg:hidden">
        <button
          onClick={() => setOpen(v => !v)}
          className="inline-flex items-center justify-center bg-transparent text-white p-0"
          aria-label={t(current.labelKey)}
        >
          <Flag code={current.code} className="w-5 h-4" />
          <ChevronDown className={`w-4 h-4 ml-1 text-gray-300 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute mt-2 right-0 bg-gray-900/95 backdrop-blur border border-gray-700 rounded-md shadow-lg py-1 z-50">
            {LANGS.map(option => (
              <button
                key={option.code}
                onClick={() => { setLang(option.code); setOpen(false); }}
                className={`w-full text-center px-2 py-1 text-gray-200 hover:bg-gray-800 ${lang === option.code ? 'font-bold text-white' : ''}`}
                aria-label={t(option.labelKey)}
              >
                <Flag code={option.code} className="w-5 h-4" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


