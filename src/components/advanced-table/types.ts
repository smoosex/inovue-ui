export type Column = {
  label: string;
  value: string;
  show: boolean;
  originalIndex?: number;
  hideInSetting?: boolean;
  width?: string;
  fixed?: "left" | "right";
  lock?: boolean;
  enableAutoTooltip?: boolean;
  ellipsis?: boolean;
};

export type { Locale } from "./locales";
export type { DateTimeRange } from "@/components/date-time-range-picker";
export type {
  FilterOption,
  FilterValue,
  ActiveFilterItem,
  AnyFilterValue,
  SelectOption,
  FilterInputType,
  CascadeValue,
} from "@/components/smart-search-input";

export type {
  ToolbarAction,
} from "@/components/toolbar";
