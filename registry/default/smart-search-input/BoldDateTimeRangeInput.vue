<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  ArrowLeft,
  Settings2,
  Calendar as CalendarIcon,
  Check as CheckIcon,
  ChevronRight,
} from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RangeCalendar } from "@/components/ui/range-calendar";
import { cn } from "@/lib/utils";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isEqual,
  isValid,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import { enUS, zhCN, type Locale } from "date-fns/locale";
import { CalendarDate, type DateValue } from "@internationalized/date";
import { toDate } from "reka-ui/date";
import type { DateRange as RekaDateRange } from "reka-ui";
import type {
  DateTimeRange,
  Preset,
} from "@/components/date-time-range-picker//types";
import DateTimeInput from "@/components/date-time-range-picker/DateTimeInput.vue";
import type { FilterOption } from "../types";

const props = defineProps<{
  currentOption: FilterOption;
}>();

const emit = defineEmits<{
  (e: "search", value: any): void;
  (e: "back"): void;
}>();

const locale = ref<string>("en");

const currentLocale = computed<Locale>(() => {
  return locale.value === "zhHans" ? zhCN : enUS;
});

const PRESETS: Preset[] = [
  { name: "today", label: "Today" },
  { name: "yesterday", label: "Yesterday" },
  { name: "last7", label: "Last 7 days" },
  { name: "last30", label: "Last 30 days" },
  { name: "thisMonth", label: "This Month" },
  { name: "lastMonth", label: "Last Month" },
];

const range = ref<DateTimeRange>({
  from: undefined,
  to: undefined,
});

const selectedPreset = ref<string | undefined>(undefined);

const dateToDateValue = (date: Date): DateValue => {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
};

const dateValueToDate = (dateValue: DateValue): Date => {
  return toDate(dateValue);
};

const calendarRange = computed<RekaDateRange>({
  get: () => ({
    start: range.value.from
      ? dateToDateValue(range.value.from)
      : dateToDateValue(new Date()),
    end: range.value.to ? dateToDateValue(range.value.to) : undefined,
  }),
  set: (newVal) => {
    if (newVal.start) {
      range.value = {
        from: dateValueToDate(newVal.start as DateValue),
        to: newVal.end ? dateValueToDate(newVal.end as DateValue) : undefined,
      };
    }
  },
});

const getPresetRange = (presetName: string): DateTimeRange => {
  const now = new Date();
  const today = startOfDay(now);
  const endToday = endOfDay(now);

  switch (presetName) {
    case "today":
      return { from: today, to: endToday };
    case "yesterday": {
      const yesterday = subDays(today, 1);
      return { from: yesterday, to: endOfDay(yesterday) };
    }
    case "last7":
      return { from: subDays(today, 6), to: endToday };
    case "last14":
      return { from: subDays(today, 13), to: endToday };
    case "last30":
      return { from: subDays(today, 29), to: endToday };
    case "thisWeek":
      return {
        from: startOfWeek(today, { weekStartsOn: 0 }),
        to: endToday,
      };
    case "lastWeek": {
      const lastWeekStart = startOfWeek(subDays(today, 7), { weekStartsOn: 0 });
      const lastWeekEnd = endOfWeek(lastWeekStart, { weekStartsOn: 0 });
      return { from: lastWeekStart, to: lastWeekEnd };
    }
    case "thisMonth":
      return { from: startOfMonth(today), to: endToday };
    case "lastMonth": {
      const lastMonth = subMonths(today, 1);
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) };
    }
    default:
      throw new Error(`Unknown date range preset: ${presetName}`);
  }
};

const setPreset = (preset: string) => {
  const newRange = getPresetRange(preset);
  range.value = newRange;
  selectedPreset.value = preset;
  calendarRange.value = {
    start: newRange.from
      ? dateToDateValue(newRange.from)
      : dateToDateValue(new Date()),
    end: newRange.to ? dateToDateValue(newRange.to) : undefined,
  };
};

const checkPreset = () => {
  if (!range.value.from || !range.value.to) return;

  for (const preset of PRESETS) {
    const presetRange = getPresetRange(preset.name);
    if (
      isEqual(startOfDay(range.value.from), startOfDay(presetRange.from!)) &&
      isEqual(endOfDay(range.value.to), endOfDay(presetRange.to!))
    ) {
      selectedPreset.value = preset.name;
      return;
    }
  }
  selectedPreset.value = undefined;
};

watch(range, checkPreset, { deep: true, immediate: true });

const handleFromDateTimeChange = (date: Date | undefined) => {
  if (!date) return;
  range.value = { ...range.value, from: date };
};

const handleToDateTimeChange = (date: Date | undefined) => {
  if (!date) return;
  range.value = { ...range.value, to: date };
};

const formatDisplayDate = (date: Date | undefined) => {
  if (!date || !isValid(date)) return "-";
  return format(date, "MMM dd, HH:mm", { locale: currentLocale.value });
};

const handleSearch = () => {
  emit("search", range.value);
};
</script>

<template>
  <div class="flex flex-col h-full overflow-hidden">
    <!-- Header -->
    <div
      class="flex items-center border-b px-2 min-h-12 shrink-0 gap-1 bg-muted/20 flex-wrap py-1"
    >
      <Button
        variant="ghost"
        size="icon"
        class="h-7 w-7 rounded-sm shrink-0"
        @click="emit('back')"
      >
        <ArrowLeft class="h-4 w-4" />
      </Button>
      <!-- Field Badge -->
      <div
        class="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-medium flex items-center gap-1 shrink-0"
      >
        <Settings2 class="h-3 w-3" />
        {{ currentOption.label }}
      </div>

      <!-- Current Range Text -->
      <div
        class="ml-2 flex items-center gap-2 text-xs text-muted-foreground bg-background/40 backdrop-blur-md border border-white/10 px-2 py-1 rounded-md shadow-sm"
      >
        <CalendarIcon class="h-3.5 w-3.5" />
        <span :class="{ 'text-foreground font-medium': range.from }">{{
          formatDisplayDate(range.from)
        }}</span>
        <ArrowLeft class="h-3 w-3 rotate-180" />
        <span :class="{ 'text-foreground font-medium': range.to }">{{
          formatDisplayDate(range.to)
        }}</span>
      </div>
    </div>

    <!-- Body: Two Columns -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Left: Calendar & Time -->
      <div class="flex-1 flex flex-col p-4 overflow-y-auto items-center">
         <div class="border border-white/10 rounded-md bg-transparent backdrop-blur-lg shadow-sm mb-4">
          <RangeCalendar
            v-model="calendarRange"
            :number-of-months="2"
            class="p-2"
          />
        </div>

        <div class="flex items-center px-6 justify-center mt-2">
          <DateTimeInput
            :model-value="range.from"
            @update:model-value="handleFromDateTimeChange"
            :label="'Start'"
          />
          <ChevronRight class="h-4 w-4 text-muted-foreground mt-4 opacity-50" />
          <DateTimeInput
            :model-value="range.to"
            @update:model-value="handleToDateTimeChange"
            :label="'End'"
          />
        </div>
      </div>

      <!-- Right: Presets -->
      <div class="w-36 border-l bg-muted/5 flex flex-col">
        <div class="p-2 text-xs font-medium text-muted-foreground border-b">
          Presets
        </div>
        <ScrollArea class="flex-1">
          <div class="p-2 space-y-1">
            <Button
              v-for="preset in PRESETS"
              :key="preset.name"
              variant="ghost"
              size="sm"
              :class="
                cn(
                  'w-full justify-start h-8 text-xs font-normal',
                  selectedPreset === preset.name && 'bg-primary/10 text-primary'
                )
              "
              @click="setPreset(preset.name)"
            >
              <CheckIcon
                class="mr-2 h-3.5 w-3.5 transition-opacity"
                :class="
                  selectedPreset === preset.name ? 'opacity-100' : 'opacity-0'
                "
              />
              {{ preset.label }}
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>

    <!-- Footer -->
    <div class="p-2 border-t bg-muted/10 flex justify-end gap-2 shrink-0">
      <Button
        size="sm"
        variant="default"
        @click="handleSearch"
        :disabled="!range.from || !range.to"
      >
        Apply
      </Button>
    </div>
  </div>
</template>
