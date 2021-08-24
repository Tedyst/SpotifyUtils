import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';

if (!i18n.isInitialized) {
    i18n
        // detect user language
        // learn more: https://github.com/i18next/i18next-browser-languageDetector
        .use(LanguageDetector)
        // pass the i18n instance to react-i18next.
        .use(initReactI18next)
        // init i18next
        // for all options read: https://www.i18next.com/overview/configuration-options
        .init({
            debug: process.env.NODE_ENV === 'development',
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false, // not needed for react as it escapes by default
            },
            keySeparator: '.',
            resources: {
                en: {
                    translation: translationEN,
                },
                ro: {
                    translation: import('./locales/ro.json'),
                },
            },
        });
}
export default i18n;
