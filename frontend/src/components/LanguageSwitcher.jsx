import React from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      {LANGUAGES.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-medium transition-colors ${
            i18n.resolvedLanguage === code
              ? 'bg-orange-500 text-white'
              : 'bg-white/20 text-white hover:bg-white/40'
          }`}
          aria-label={label}
        >
          <span>{flag}</span>
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;

