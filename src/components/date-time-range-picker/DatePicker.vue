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
import { format, isEqual, isValid, startOfDay } from "date-fns";
import { enUS, zhCN, type Locale } from "date-fns/locale";
import { CalendarIcon } from "lucide-vue-next";
import { CalendarDate, type DateValue } from "@internationalized/date";
import { toDate } from "reka-ui/date";
import type { DateRange as RekaDateRange } from "reka-ui";
import DateInput from "./DateInput.vue";
import { GetI18nText, type Locale as I18nLocale } from "./locales";

const modelValue = defineModel<Date>();

const props = withDefaults(
  defineProps<{
    align?: "start" | "center" | "end";
    locale?: I18nLocale;
    class?: string;
  }>(),
  {
    align: "center",
    locale: "en",
  },
);

const emit = defineEmits<{
  update: [payload: { date: Date | undefined }];
}>();

const currentLocale = computed<Locale>(() =>
  props.locale === "zhHans" ? zhCN : enUS,
);

const calendarLocale = computed(() =>
  props.locale === "zhHans" ? "zh-CN" : "en-US",
);

const $t = (key: Parameters<typeof GetI18nText>[0]) =>
  GetI18nText(key, props.locale);

const dateToDateValue = (date: Date): DateValue =>
  new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());

const dateValueToDate = (dateValue: DateValue): Date => toDate(dateValue);

const formatDate = (date: Date | undefined, locale: Locale): string => {
  if (!date || !isValid(date)) {
    return $t("selectDate");
  }

  return format(date, "PPP", { locale });
};

const getComparableTime = (date: Date | undefined) =>
  date ? startOfDay(date).getTime() : undefined;

const isSameDay = (left: Date | undefined, right: Date | undefined) => {
  if (!left || !right) return left === right;
  return isEqual(startOfDay(left), startOfDay(right));
};

const resolveSelectedDate = (
  start: Date,
  end: Date | undefined,
  currentDate: Date | undefined,
) => {
  if (!end) return start;
  if (!currentDate) return end;

  const currentTime = getComparableTime(currentDate);
  const startTime = getComparableTime(start);
  const endTime = getComparableTime(end);

  if (currentTime === startTime && currentTime !== endTime) {
    return end;
  }

  if (currentTime === endTime && currentTime !== startTime) {
    return start;
  }

  return end;
};

const isOpen = ref(false);
const selectedDate = ref<Date | undefined>(
  modelValue.value ? new Date(modelValue.value) : undefined,
);
const openedDate = ref<Date | undefined>(
  selectedDate.value ? new Date(selectedDate.value) : undefined,
);

const calendarValue = computed<RekaDateRange>({
  get: () => ({
    start: selectedDate.value
      ? dateToDateValue(selectedDate.value)
      : dateToDateValue(new Date()),
    end: undefined,
  }),
  set: (newVal) => {
    if (!newVal.start) return;

    const start = dateValueToDate(newVal.start as DateValue);
    const end = newVal.end
      ? dateValueToDate(newVal.end as DateValue)
      : undefined;

    selectedDate.value = resolveSelectedDate(start, end, selectedDate.value);
  },
});

watch(
  () => modelValue.value,
  (newVal) => {
    selectedDate.value = newVal ? new Date(newVal) : undefined;
  },
);

watch(isOpen, (nextOpen) => {
  if (nextOpen) {
    openedDate.value = selectedDate.value
      ? new Date(selectedDate.value)
      : undefined;
  }
});

const handleDateChange = (date: Date | undefined) => {
  if (!date) return;
  selectedDate.value = date;
};

const handleCancel = () => {
  isOpen.value = false;
  selectedDate.value = openedDate.value ? new Date(openedDate.value) : undefined;
};

const handleUpdate = () => {
  isOpen.value = false;
  if (isSameDay(selectedDate.value, openedDate.value)) {
    return;
  }

  modelValue.value = selectedDate.value
    ? new Date(selectedDate.value)
    : undefined;
  emit("update", { date: modelValue.value });
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
        <CalendarIcon class="mr-2 h-4 w-4 shrink-0" />
        <span class="min-w-0 truncate text-sm">
          {{ formatDate(selectedDate, currentLocale) }}
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent
      class="flex w-auto flex-col overflow-hidden p-0"
      :align="align"
      :side-offset="4"
      style="max-height: min(90vh, var(--reka-popover-content-available-height));"
    >
      <div class="min-h-0 overflow-y-auto p-4">
        <div class="space-y-4">
          <div class="hidden lg:block">
            <RangeCalendar
              v-model="calendarValue"
              :number-of-months="2"
              :locale="calendarLocale"
              class="rounded-md border"
            />
          </div>

          <div class="lg:hidden">
            <RangeCalendar
              v-model="calendarValue"
              :number-of-months="1"
              :locale="calendarLocale"
              class="rounded-md border"
            />
          </div>

          <DateInput
            :model-value="selectedDate"
            :locale="props.locale"
            @update:model-value="handleDateChange"
          />
        </div>
      </div>

      <div class="flex shrink-0 items-center justify-end gap-2 border-t bg-popover p-4">
        <Button variant="ghost" @click="handleCancel">{{ $t("cancel") }}</Button>
        <Button @click="handleUpdate">{{ $t("confirm") }}</Button>
      </div>
    </PopoverContent>
  </Popover>
</template>
