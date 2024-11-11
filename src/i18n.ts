import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import fr from "./locales/fr.json";
import nl from "./locales/nl.json";

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  nl: { translation: nl },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    supportedLngs: ["fr", "en", "nl"],
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
