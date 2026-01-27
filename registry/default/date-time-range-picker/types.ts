export interface DateRange {
  from: Date;
  to: Date | undefined;
}

export interface DateTimeRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface Preset {
  name: string;
  label: string;
}

export const PRESETS: Preset[] = [
  { name: "today", label: "Today" },
  { name: "yesterday", label: "Yesterday" },
  { name: "last7", label: "Last 7 days" },
  { name: "last14", label: "Last 14 days" },
  { name: "last30", label: "Last 30 days" },
  { name: "thisWeek", label: "This Week" },
  { name: "lastWeek", label: "Last Week" },
  { name: "thisMonth", label: "This Month" },
  { name: "lastMonth", label: "Last Month" },
];

export interface DateParts {
  day: number;
  month: number;
  year: number;
}

export interface TimeParts {
  hours: number;
  minutes: number;
  ampm: "AM" | "PM";
}
