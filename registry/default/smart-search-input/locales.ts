export type Locale = "en" | "zhHans";

const translations = {
  en: {
    selectColumn: "Select column",
  },
  zhHans: {
    selectColumn: "选择字段",
  },
} as const;

export function getI18nText(key: keyof typeof translations.en, locale: Locale) {
  return translations[locale][key] || translations.en[key];
}
