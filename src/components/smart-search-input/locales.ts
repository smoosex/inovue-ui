export type Locale = "en" | "zhHans";

const translations = {
  en: {
    selectColumn: "Select column",
    filterTag: "Filter Condition:",
    clearAll: "Clear All",
    select: "Select",
    search: "Search",
    loading: "Loading...",
    loadMore: "Load more",
    noResults: "No results",
    clearFilters: "Clear filters",
    selected: "selected",
    noData: "No data",
    selectLevel1First: "Select level 1 first",
  },
  zhHans: {
    selectColumn: "选择字段",
    filterTag: "筛选条件：",
    clearAll: "清空",
    select: "请选择",
    search: "搜索",
    loading: "加载中...",
    loadMore: "加载更多",
    noResults: "无结果",
    clearFilters: "清空筛选",
    selected: "项已选",
    noData: "暂无数据",
    selectLevel1First: "请先选择一级",
  },
} as const;

export function GetI18nText(key: keyof typeof translations.en, locale: Locale) {
  return translations[locale][key] || translations.en[key];
}
