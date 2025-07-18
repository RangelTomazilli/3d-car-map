import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptTranslation from '../locales/pt/translation.json';
import enTranslation from '../locales/en/translation.json';
import esTranslation from '../locales/es/translation.json';

const resources = {
  pt: {
    translation: ptTranslation,
  },
  en: {
    translation: enTranslation,
  },
  es: {
    translation: esTranslation,
  },
} as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // idioma padrão
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false,
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;