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
