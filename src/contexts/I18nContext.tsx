'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type LangCode = 'en' | 'de' | 'es' | 'fr';

type Messages = Record<string, string | Record<string, string>>;

interface I18nContextValue {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

// Import estático de mensajes (Tree-shake friendly)
import en from '@/i18n/messages/en.json';
import de from '@/i18n/messages/de.json';
import es from '@/i18n/messages/es.json';
import fr from '@/i18n/messages/fr.json';

const LANG_STORAGE_KEY = 'tf_lang';

const ALL_MESSAGES: Record<LangCode, Messages> = { en, de, es, fr };

function detectInitialLang(): LangCode {
  // Para evitar hydration mismatch, usar siempre 'en' como valor inicial SSR/CSR
  return 'en';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(detectInitialLang());

  const setLang = (next: LangCode) => {
    setLangState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    }
  };

  useEffect(() => {
    // Al montar en cliente, resolver idioma real desde localStorage o navegador
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(LANG_STORAGE_KEY) as LangCode | null;
      if (stored && ALL_MESSAGES[stored]) {
        setLangState(stored);
      } else {
        const nav = navigator.language?.toLowerCase() || 'en';
        if (nav.startsWith('es')) setLangState('es');
        else if (nav.startsWith('de')) setLangState('de');
        else if (nav.startsWith('fr')) setLangState('fr');
        else setLangState('en');
      }
    }
  }, []);

  useEffect(() => {
    // Mantener <html lang="...">
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const messages = useMemo(() => ALL_MESSAGES[lang] || en, [lang]);

  const t = useMemo(() => {
    return (key: string, fallback?: string) => {
      const value = messages[key];
      if (typeof value === 'string') {
        return value;
      } else if (typeof value === 'object' && value !== null) {
        // Si es un objeto anidado, devolver la clave como fallback
        return fallback ?? key;
      }
      return fallback ?? key;
    };
  }, [messages]);

  const value = useMemo<I18nContextValue>(() => ({ lang, setLang, t }), [lang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}


