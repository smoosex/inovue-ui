export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export type DateTimeRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export type Preset = {
  name: string;
  label: string;
};

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

export type DateParts = {
  day: number;
  month: number;
  year: number;
};

export type TimeParts = {
  hours: number;
  minutes: number;
  ampm: "AM" | "PM";
};
