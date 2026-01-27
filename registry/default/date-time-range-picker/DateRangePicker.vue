<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RangeCalendar } from "@/components/ui/range-calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDownIcon } from "lucide-vue-next";
import { CalendarDate, type DateValue } from "@internationalized/date";
import { toDate } from "reka-ui/date";
import DateInput from "./DateInput.vue";
import type { DateRange } from "./types";
import type { DateRange as RekaDateRange } from "reka-ui";
import { PRESETS } from "./types";

const modelValue = defineModel<DateRange>();

const props = withDefaults(
  defineProps<{
    align?: "start" | "center" | "end";
    locale?: string;
    class?: string;
  }>(),
  {
    align: "center",
    locale: "en-US",
  }
);

const emit = defineEmits<{
  update: [payload: { range: DateRange }];
}>();

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

const formatDate = (date: Date, locale = "en-us"): string => {
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const isOpen = ref(false);
const range = ref<DateRange>({
  from: modelValue.value?.from || new Date(new Date().setHours(0, 0, 0, 0)),
  to:
    modelValue.value?.to ||
    modelValue.value?.from ||
    new Date(new Date().setHours(0, 0, 0, 0)),
});
const openedRange = ref<DateRange>({ ...range.value });
const selectedPreset = ref<string | undefined>(undefined);

const calendarRange = computed<RekaDateRange>({
  get: () => ({
    start: dateToDateValue(range.value.from),
    end: range.value.to
      ? dateToDateValue(range.value.to)
      : dateToDateValue(range.value.from),
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
      range.value = {
        from: newVal.from,
        to: newVal.to || newVal.from,
      };
    }
  }
);

const getPresetRange = (presetName: string): DateRange => {
  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));
  const endToday = new Date(new Date().setHours(23, 59, 59, 999));

  switch (presetName) {
    case "today":
      return { from: today, to: endToday };
    case "yesterday": {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        from: yesterday,
        to: new Date(yesterday.setHours(23, 59, 59, 999)),
      };
    }
    case "last7":
      return {
        from: new Date(new Date().setDate(new Date().getDate() - 6)),
        to: endToday,
      };
    case "last14":
      return {
        from: new Date(new Date().setDate(new Date().getDate() - 13)),
        to: endToday,
      };
    case "last30":
      return {
        from: new Date(new Date().setDate(new Date().getDate() - 29)),
        to: endToday,
      };
    case "thisWeek": {
      const first = today.getDate() - today.getDay();
      return { from: new Date(new Date().setDate(first)), to: endToday };
    }
    case "lastWeek": {
      const t = new Date();
      const first = t.getDate() - t.getDay() - 7;
      const last = first + 6;
      return {
        from: new Date(new Date().setDate(first)),
        to: new Date(new Date().setDate(last)),
      };
    }
    case "thisMonth": {
      return {
        from: new Date(new Date().setDate(1)),
        to: endToday,
      };
    }
    case "lastMonth": {
      const lastMonth = new Date(
        new Date().setMonth(new Date().getMonth() - 1)
      );
      return {
        from: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
        to: new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0),
      };
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
    start: dateToDateValue(newRange.from),
    end: newRange.to
      ? dateToDateValue(newRange.to)
      : dateToDateValue(newRange.from),
  };
};

const checkPreset = () => {
  for (const preset of PRESETS) {
    const presetRange = getPresetRange(preset.name);
    if (
      presetRange.from.getTime() === range.value.from.getTime() &&
      presetRange.to?.getTime() === range.value.to?.getTime()
    ) {
      selectedPreset.value = preset.name;
      return;
    }
  }
  selectedPreset.value = undefined;
};

const resetValues = () => {
  const fromDate =
    modelValue.value?.from || new Date(new Date().setHours(0, 0, 0, 0));
  const toDate =
    modelValue.value?.to ||
    modelValue.value?.from ||
    new Date(new Date().setHours(0, 0, 0, 0));
  range.value = { from: fromDate, to: toDate };
  selectedPreset.value = undefined;
  calendarRange.value = {
    start: dateToDateValue(fromDate),
    end: dateToDateValue(toDate),
  };
};

const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
  if (!a || !b) return a === b;
  return (
    a.from.getTime() === b.from.getTime() &&
    (!a.to || !b.to || a.to.getTime() === b.to.getTime())
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
  const fromDate = date < range.value.from ? date : range.value.from;
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
            'w-full sm:w-75 justify-start text-left text-[11px] font-normal text-wrap',
            props.class
          )
        "
      >
        {{ formatDate(range.from, locale) }}
        <template v-if="range.to">
          <ChevronDownIcon class="mx-2 h-4 w-4" />
          {{ formatDate(range.to, locale) }}
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" :align="align" :side-offset="4">
      <div class="flex flex-col lg:flex-row gap-4 p-4">
        <!-- Calendar Section -->
        <div class="space-y-4">
          <div class="hidden lg:block">
            <!-- One RangeCalendar with 2 months for desktop -->
            <RangeCalendar
              v-model="calendarRange"
              :number-of-months="2"
              class="border rounded-md"
            />
          </div>

          <!-- Single month calendar for mobile -->
          <div class="lg:hidden">
            <RangeCalendar
              v-model="calendarRange"
              :number-of-months="1"
              class="border rounded-md"
            />
          </div>

          <div class="flex justify-between items-center">
            <DateInput
              :model-value="range.from"
              @update:model-value="handleFromDateChange"
            />
            <ChevronDownIcon class="mx-2 h-4 w-4" />
            <DateInput
              :model-value="range.to"
              @update:model-value="handleToDateChange"
            />
          </div>
        </div>

        <!-- Presets Section -->
        <div class="lg:border-l lg:pl-4 space-y-2">
          <h3 class="font-medium text-sm">
            Presets
          </h3>
          <div class="grid grid-cols-2 lg:grid-cols-1 gap-1">
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
              {{ preset.label }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="flex items-center justify-end gap-2 p-4 border-t">
        <Button variant="ghost" @click="handleCancel">Cancel</Button>
        <Button @click="handleUpdate">Confirm</Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
