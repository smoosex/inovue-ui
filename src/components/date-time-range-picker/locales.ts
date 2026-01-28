export type Locale = "en" | "zhHans";

const translations = {
  en: {
    cancel: "Cancel",
    confirm: "Confirm",
    start: "Start",
    end: "End",
    presets: "Presets",
    apply: "Apply",
    today: "Today",
    yesterday: "Yesterday",
    last7: "Last 7 days",
    last14: "Last 14 days",
    last30: "Last 30 days",
    thisWeek: "This Week",
    lastWeek: "Last Week",
    thisMonth: "This Month",
    lastMonth: "Last Month",
  },
  zhHans: {
    cancel: "取消",
    confirm: "确认",
    start: "开始",
    end: "结束",
    presets: "快捷选项",
    apply: "应用",
    today: "今天",
    yesterday: "昨天",
    last7: "最近 7 天",
    last14: "最近 14 天",
    last30: "最近 30 天",
    thisWeek: "本周",
    lastWeek: "上周",
    thisMonth: "本月",
    lastMonth: "上月",
  },
} as const;

export function getI18nText(key: keyof typeof translations.en, locale: Locale) {
  return translations[locale][key] || translations.en[key];
}
