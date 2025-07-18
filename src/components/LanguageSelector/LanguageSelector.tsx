import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelector.scss';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="language-selector" ref={dropdownRef}>
      <button 
        className="language-selector__trigger"
        onClick={toggleDropdown}
        title={`Current language: ${currentLanguage.nativeName}`}
      >
        <span className="language-selector__flag">{currentLanguage.flag}</span>
        <span className="language-selector__code">{currentLanguage.code.toUpperCase()}</span>
        <svg 
          className={`language-selector__chevron ${isOpen ? 'language-selector__chevron--open' : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </button>

      {isOpen && (
        <div className="language-selector__dropdown">
          {languages.map((language) => (
            <button
              key={language.code}
              className={`language-selector__option ${
                language.code === i18n.language ? 'language-selector__option--active' : ''
              }`}
              onClick={() => handleLanguageChange(language.code)}
            >
              <span className="language-selector__option-flag">{language.flag}</span>
              <div className="language-selector__option-text">
                <span className="language-selector__option-native">{language.nativeName}</span>
                <span className="language-selector__option-name">{language.name}</span>
              </div>
              {language.code === i18n.language && (
                <svg 
                  className="language-selector__check"
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;