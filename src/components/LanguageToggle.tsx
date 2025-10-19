import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      aria-label="Toggle language"
    >
      <Languages className="w-4 h-4" />
      <span>{language === 'en' ? 'عربي' : 'English'}</span>
    </button>
  );
}
