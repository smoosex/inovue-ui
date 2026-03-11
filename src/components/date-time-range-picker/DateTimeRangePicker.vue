<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Button } from "@/components/ui/button";
import { RangeCalendar } from "@/components/ui/range-calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { CalendarIcon, CheckIcon, ChevronRightIcon } from "lucide-vue-next";
import { CalendarDate, type DateValue } from "@internationalized/date";
import { toDate } from "reka-ui/date";
import DateTimeInput from "./DateTimeInput.vue";
import type { DateTimeRange } from "./types";
import { PRESETS } from "./types";
import type { DateRange as RekaDateRange } from "reka-ui";
import { GetI18nText } from "./locales";

const modelValue = defineModel<DateTimeRange>();

const props = withDefaults(
  defineProps<{
    initialDateFrom?: Date | string;
    initialDateTo?: Date | string;
    align?: "start" | "center" | "end";
    locale?: "en" | "zhHans";
    class?: string;
  }>(),
  {
    align: "center",
    locale: "en",
  }
);

const emit = defineEmits<{
  update: [payload: { range: DateTimeRange }];
}>();

const currentLocale = computed<Locale>(() => {
  return props.locale === "zhHans" ? zhCN : enUS;
});

const calendarLocale = computed(() =>
  props.locale === "zhHans" ? "zh-CN" : "en-US",
);

const $t = (key: Parameters<typeof GetI18nText>[0]) =>
  GetI18nText(key, props.locale);


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

const getDateAdjustedForTimezone = (
  dateInput: Date | string | undefined
): Date | undefined => {
  if (!dateInput) return undefined;
  if (typeof dateInput === "string") {
    const parts = dateInput.split("-").map((part) => parseInt(part, 10));
    if (parts.length < 3 || parts.some(isNaN)) return undefined;
    return new Date(parts[0]!, parts[1]! - 1, parts[2]!);
  }
  return new Date(dateInput);
};

const formatDateTime = (
  date: Date | undefined,
  locale: Locale
): { date: string; time: string; hasDate: boolean } => {
  if (!date || !isValid(date)) {
    return {
      date: $t("selectDate"),
      time: "",
      hasDate: false,
    };
  }
  return {
    date: format(date, "PPP", { locale }),
    time: format(date, "p", { locale }),
    hasDate: true,
  };
};

const isOpen = ref(false);
const range = ref<DateTimeRange>({
  from:
    modelValue.value?.from || getDateAdjustedForTimezone(props.initialDateFrom),
  to: modelValue.value?.to || getDateAdjustedForTimezone(props.initialDateTo),
});
const openedRange = ref<DateTimeRange>({ ...range.value });
const selectedPreset = ref<string | undefined>(undefined);

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

watch(
  () => modelValue.value,
  (newVal) => {
    if (newVal) {
      range.value = { ...newVal };
    }
  }
);

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
        from: startOfWeek(today, { locale: currentLocale.value }),
        to: endToday,
      };
    case "lastWeek": {
      const lastWeekStart = startOfWeek(subDays(today, 7), {
        locale: currentLocale.value,
      });
      const lastWeekEnd = endOfWeek(lastWeekStart, {
        locale: currentLocale.value,
      });
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

const areRangesEqual = (a?: DateTimeRange, b?: DateTimeRange): boolean => {
  if (!a || !b) return a === b;
  return (
    isEqual(a.from || new Date(), b.from || new Date()) &&
    isEqual(a.to || new Date(), b.to || new Date())
  );
};

watch(isOpen, (newVal) => {
  if (newVal) {
    openedRange.value = { ...range.value };
  }
});

watch(range, checkPreset, { deep: true, immediate: true });

const handleFromDateTimeChange = (date: Date | undefined) => {
  if (!date) return;
  range.value = { ...range.value, from: date };
};

const handleToDateTimeChange = (date: Date | undefined) => {
  if (!date) return;
  range.value = { ...range.value, to: date };
};

const handleCancel = () => {
  isOpen.value = false;
  range.value = { ...openedRange.value };
};

const handleUpdate = () => {
  isOpen.value = false;
  if (!areRangesEqual(range.value, openedRange.value)) {
    modelValue.value = range.value;
    emit("update", { range: range.value });
  }
};
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn(
            'w-full sm:w-auto min-w-70 min-h-9 py-1 justify-start text-left font-normal',
            props.class
          )
        "
      >
        <CalendarIcon class="mr-2 h-4 w-4 shrink-0 self-center" />
        <template v-if="formatDateTime(range.from, currentLocale).hasDate">
          <div class="flex flex-col leading-none gap-0.5 text-[11px]">
            <span>{{ formatDateTime(range.from, currentLocale).date }}</span>
            <span class="text-muted-foreground">{{
              formatDateTime(range.from, currentLocale).time
            }}</span>
          </div>
        </template>
        <template v-else>
          <span class="text-sm text-muted-foreground">{{
            formatDateTime(range.from, currentLocale).date
          }}</span>
        </template>
        <template v-if="range.to">
          <ChevronRightIcon class="mx-2 h-4 w-4 shrink-0 self-center" />
          <div class="flex flex-col leading-none gap-0.5 text-[11px]">
            <span>{{ formatDateTime(range.to, currentLocale).date }}</span>
            <span class="text-muted-foreground">{{
              formatDateTime(range.to, currentLocale).time
            }}</span>
          </div>
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent
      class="flex w-auto flex-col overflow-hidden p-0"
      :align="align"
      :side-offset="4"
      style="max-height: min(90vh, var(--reka-popover-content-available-height));"
    >
      <div class="min-h-0 overflow-y-auto">
        <div class="flex flex-col gap-4 lg:flex-row">
          <div class="space-y-4 p-4">
            <div class="hidden lg:block">
              <RangeCalendar
                v-model="calendarRange"
                :number-of-months="2"
                :locale="calendarLocale"
                class="border rounded-md"
              />
            </div>

            <div class="lg:hidden">
              <RangeCalendar
                v-model="calendarRange"
                :number-of-months="1"
                :locale="calendarLocale"
                class="border rounded-md"
              />
            </div>

            <div class="flex items-center justify-between">
              <DateTimeInput
                :model-value="range.from"
                :label="$t('start')"
                :locale="props.locale"
                @update:model-value="handleFromDateTimeChange"
              />
              <ChevronRightIcon class="mx-2 h-4 w-4" />
              <DateTimeInput
                :model-value="range.to"
                :label="$t('end')"
                :locale="props.locale"
                @update:model-value="handleToDateTimeChange"
              />
            </div>
          </div>

          <div class="space-y-2 p-4 lg:border-l lg:pl-4">
            <h3 class="font-medium text-sm">
              {{ $t('presets') }}
            </h3>
            <div class="grid grid-cols-2 gap-1 lg:grid-cols-1">
              <Button
                v-for="preset in PRESETS"
                :key="preset.name"
                :class="
                  cn(
                    'justify-start',
                    selectedPreset === preset.name && 'bg-muted'
                  )
                "
                variant="ghost"
                @click="setPreset(preset.name)"
              >
                <CheckIcon
                  :class="
                    cn(
                      'mr-2 h-4 w-4',
                      selectedPreset === preset.name ? 'opacity-100' : 'opacity-0'
                    )
                  "
                />
                {{ $t(preset.name as Parameters<typeof GetI18nText>[0]) }}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex shrink-0 items-center justify-end gap-2 border-t bg-popover p-4">
        <Button variant="ghost" @click="handleCancel">{{ $t("cancel") }}</Button>
        <Button @click="handleUpdate">{{ $t("confirm") }}</Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
