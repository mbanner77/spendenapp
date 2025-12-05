'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations as defaultTranslations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Default context value for SSR
const defaultContextValue: LanguageContextType = {
  language: 'de',
  setLanguage: () => {},
  t: (key: string) => defaultTranslations['de']?.[key] || key,
};

const LanguageContext = createContext<LanguageContextType>(defaultContextValue);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('de');
  const [customTranslations, setCustomTranslations] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && defaultTranslations[savedLang]) {
      setLanguageState(savedLang);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0] as Language;
      if (defaultTranslations[browserLang]) {
        setLanguageState(browserLang);
      }
    }
    
    // Load custom translations from API
    fetch('/api/admin/translations')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.translations) {
          setCustomTranslations(data.translations);
        }
      })
      .catch(err => console.log('Could not load custom translations:', err));
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    // First check custom translations, then fall back to defaults
    return customTranslations[language]?.[key] 
      || defaultTranslations[language]?.[key] 
      || customTranslations['de']?.[key]
      || defaultTranslations['de'][key] 
      || key;
  };

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
