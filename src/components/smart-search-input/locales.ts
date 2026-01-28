export type Locale = "en" | "zhHans";

const translations = {
  en: {
    selectColumn: "Select column",
    filterTag: "Filter Condition:",
    clearAll: "Clear All",
  },
  zhHans: {
    selectColumn: "选择字段",
    filterTag: "筛选条件：",
    clearAll: "清空",
  },
} as const;

export function GetI18nText(key: keyof typeof translations.en, locale: Locale) {
  return translations[locale][key] || translations.en[key];
}
