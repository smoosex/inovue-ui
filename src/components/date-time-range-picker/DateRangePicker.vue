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
  endOfWeek,
  endOfMonth,
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
import { CheckIcon, ChevronRightIcon } from "@lucide/vue";
import { CalendarDate, type DateValue } from "@internationalized/date";
import { toDate } from "reka-ui/date";
import DateInput from "./DateInput.vue";
import type { DateRange } from "./types";
import type { DateRange as RekaDateRange } from "reka-ui";
import { PRESETS } from "./types";
import { GetI18nText, type Locale as I18nLocale } from "./locales";

const modelValue = defineModel<DateRange>();

const props = withDefaults(
  defineProps<{
    align?: "start" | "center" | "end";
    locale?: I18nLocale;
    class?: string;
  }>(),
  {
    align: "center",
    locale: "en",
  }
);

const emit = defineEmits<{
  update: [payload: { range: DateRange }];
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

const formatDate = (date: Date | undefined, locale: Locale): string => {
  if (!date || !isValid(date)) {
    return $t("selectDate");
  }
  return format(date, "PPP", { locale });
};

const isOpen = ref(false);
const range = ref<DateRange>({
  from: modelValue.value?.from,
  to: modelValue.value?.to,
});
const openedRange = ref<DateRange>({ ...range.value });
const selectedPreset = ref<string | undefined>(undefined);

const calendarRange = computed<RekaDateRange>({
  get: () => ({
    start: range.value.from
      ? dateToDateValue(range.value.from)
      : dateToDateValue(new Date()),
    end: range.value.to
      ? dateToDateValue(range.value.to)
      : undefined,
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
    range.value = {
      from: newVal?.from,
      to: newVal?.to,
    };
  },
);

const getPresetRange = (presetName: string): DateRange => {
  const now = new Date();
  const today = startOfDay(now);
  const endToday = endOfDay(now);

  switch (presetName) {
    case "today":
      return { from: today, to: endToday };
    case "yesterday": {
      const yesterday = subDays(today, 1);
      return {
        from: yesterday,
        to: endOfDay(yesterday),
      };
    }
    case "last7":
      return {
        from: subDays(today, 6),
        to: endToday,
      };
    case "last14":
      return {
        from: subDays(today, 13),
        to: endToday,
      };
    case "last30":
      return {
        from: subDays(today, 29),
        to: endToday,
      };
    case "thisWeek": {
      return {
        from: startOfWeek(today, { locale: currentLocale.value }),
        to: endToday,
      };
    }
    case "lastWeek": {
      const lastWeekStart = startOfWeek(subDays(today, 7), {
        locale: currentLocale.value,
      });
      return {
        from: lastWeekStart,
        to: endOfWeek(lastWeekStart, { locale: currentLocale.value }),
      };
    }
    case "thisMonth": {
      return {
        from: startOfMonth(today),
        to: endToday,
      };
    }
    case "lastMonth": {
      const lastMonth = subMonths(today, 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
      };
    }
    default:
      throw new Error(`Unknown date range preset: ${presetName}`);
  }
};

const setPreset = (preset: string) => {
  const newRange = getPresetRange(preset);
  if (!newRange.from) return;

  range.value = newRange;
  selectedPreset.value = preset;
  calendarRange.value = {
    start: dateToDateValue(newRange.from),
    end: newRange.to
      ? dateToDateValue(newRange.to)
      : dateToDateValue(newRange.from),
  };
};

const checkPreset = () => {
  if (!range.value.from) {
    selectedPreset.value = undefined;
    return;
  }

  for (const preset of PRESETS) {
    const presetRange = getPresetRange(preset.name);
    if (!presetRange.from) continue;

    if (
      isEqual(startOfDay(presetRange.from), startOfDay(range.value.from)) &&
      isEqual(
        endOfDay(presetRange.to ?? presetRange.from),
        endOfDay(range.value.to ?? range.value.from),
      )
    ) {
      selectedPreset.value = preset.name;
      return;
    }
  }
  selectedPreset.value = undefined;
};

const resetValues = () => {
  const fromDate = modelValue.value?.from;
  const toDate = modelValue.value?.to;
  range.value = { from: fromDate, to: toDate };
  selectedPreset.value = undefined;
};

const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
  if (!a || !b) return a === b;
  return (
    a.from?.getTime() === b.from?.getTime() &&
    a.to?.getTime() === b.to?.getTime()
  );
};

watch(isOpen, (newVal) => {
  if (newVal) {
    openedRange.value = { ...range.value };
  }
});

watch(range, checkPreset, { deep: true, immediate: true });

const handleFromDateChange = (date: Date | undefined) => {
  if (!date) return;
  const toDate =
    range.value.to == null || date > range.value.to ? date : range.value.to;
  range.value = { ...range.value, from: date, to: toDate };
};

const handleToDateChange = (date: Date | undefined) => {
  if (!date) return;
  const fromDate =
    !range.value.from || date < range.value.from ? date : range.value.from;
  range.value = { ...range.value, from: fromDate, to: date };
};

const handleCancel = () => {
  isOpen.value = false;
  resetValues();
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
            'w-full min-w-0 max-w-full justify-start overflow-hidden px-3 text-left font-normal',
            props.class,
          )
        "
      >
        <div class="flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-sm">
          <span class="min-w-0 truncate">
            {{ formatDate(range.from, currentLocale) }}
          </span>
          <template v-if="range.to">
            <ChevronRightIcon class="h-4 w-4 shrink-0" />
            <span class="min-w-0 truncate">
              {{ formatDate(range.to, currentLocale) }}
            </span>
          </template>
        </div>
      </Button>
    </PopoverTrigger>
    <PopoverContent
      class="flex w-auto flex-col overflow-hidden p-0"
      :align="align"
      :side-offset="4"
      style="max-height: min(90vh, var(--reka-popover-content-available-height));"
    >
      <div class="min-h-0 overflow-y-auto">
        <div class="flex flex-col gap-4 p-4 lg:flex-row">
          <div class="space-y-4">
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
              <DateInput
                :model-value="range.from"
                :locale="props.locale"
                @update:model-value="handleFromDateChange"
              />
              <ChevronRightIcon class="mx-2 h-4 w-4" />
              <DateInput
                :model-value="range.to"
                :locale="props.locale"
                @update:model-value="handleToDateChange"
              />
            </div>
          </div>

          <div class="space-y-2 lg:border-l lg:pl-4">
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
