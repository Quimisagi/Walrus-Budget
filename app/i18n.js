import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3', // For Expo compatibility
    resources: {
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
      ja: {
        translation: require('./locales/ja.json'), 
      },
    },
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from xss
    },
  });

export default i18n;
