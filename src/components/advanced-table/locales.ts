export type Locale = "en" | "zhHans";

export const translations = {
  en: {
    noResults: "No results.",
    perPage: "/ page",
    total: "Total:",
    toggleColumns: "Toggle columns",
    dragReorder: "Drag to reorder. Click + to add, X to remove.",
    availableColumns: "Available Columns",
    selectedColumns: "Selected Columns",
    searchPlaceholder: "Search...",
    noResultsFound: "No results found",
    noAvailableColumns: "No available columns",
    noSelectedColumns: "No selected columns",
    reset: "Reset",
    cancel: "Cancel",
    confirm: "Confirm",
    first: "First",
    previous: "Previous",
    next: "Next",
    last: "Last",
  },
  zhHans: {
    noResults: "暂无数据",
    perPage: "条/页",
    total: "总计：",
    toggleColumns: "切换列",
    dragReorder: "拖拽排序。点击 + 添加，X 移除。",
    availableColumns: "可用列",
    selectedColumns: "已选列",
    searchPlaceholder: "搜索...",
    noResultsFound: "未找到结果",
    noAvailableColumns: "没有可用列",
    noSelectedColumns: "没有已选列",
    reset: "重置",
    cancel: "取消",
    confirm: "确认",
    first: "首页",
    previous: "上一页",
    next: "下一页",
    last: "末页",
  },
} as const;

export function getI18nText(key: keyof typeof translations.en, locale: Locale): string {
  return translations[locale][key] ?? translations.en[key];
}
