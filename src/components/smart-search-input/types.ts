import type { DateTimeRange } from "@/components/date-time-range-picker";

export type SelectOption = {
  label: string;
  value: string | number;
  id?: string; // province id
  children?: SelectOption[];
  childrenSize?: number;
};

export type FilterInputType =
  | "text"
  | "select"
  | "multi-select"
  | "tree-multi-select"
  | "date-time-range"
  | "cascade-select";

export type CascadeValue = {
  level1?: string;
  level2?: string;
};

export type FilterInputValueMap = {
  text: string;
  select: string | number;
  "multi-select": (string | number)[];
  "tree-multi-select": (string | number)[];
  "date-time-range": DateTimeRange;
  "cascade-select": CascadeValue;
};

export type AnyFilterValue = FilterInputValueMap[keyof FilterInputValueMap];

export type FilterOption = {
  label: string;
  value: string;
  type?: FilterInputType;
  options?: SelectOption[];
  placeholder?: string;
  total?: number;
  currentPage?: number;
  pageSize?: number;
  formatValue?: (value: any) => any;
  // For advanced filter in advancedSearch
  formatValueAdvanced?: (value: any) => any;
  // For cascade-select
  level1Label?: string;
  level2Label?: string;
  // Lazy loading callback - called when field is selected/mounted
  loadOptions?: () => Promise<void>;
  // Pagination callback
  loadMore?: () => Promise<void>;
  // Cascade select children loader
  loadChildren?: (parentId: string) => Promise<SelectOption[]>;
};

export type FilterValue<T = AnyFilterValue> = {
  key: string;
  value: T;
};
