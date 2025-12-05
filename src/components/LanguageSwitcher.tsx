'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { languages, Language } from '@/lib/translations';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/80 hover:bg-white border border-gray-200 text-gray-700 transition-all shadow-sm"
        aria-label="Change language"
      >
        <Globe size={18} className="text-realcore-gold" />
        <span className="text-lg">{currentLang.flag}</span>
        <span className="hidden sm:inline text-sm font-medium">{currentLang.code.toUpperCase()}</span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fadeInUp">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                language === lang.code ? 'bg-realcore-gold/10 text-realcore-gold' : 'text-gray-700'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
              {language === lang.code && (
                <span className="ml-auto text-realcore-gold">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
