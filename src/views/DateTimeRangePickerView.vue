<script setup lang="ts">
import { ref } from "vue";
import {
  DatePicker,
  DateTimeRangePicker,
  DateRangePicker,
  TimeInput,
} from "@/components/date-time-range-picker";
import type {
  DateTimeRange,
  DateRange,
} from "@/components/date-time-range-picker";

const props = withDefaults(
  defineProps<{
    embedded?: boolean;
  }>(),
  {
    embedded: false,
  },
);

const { locale } = useI18n();

const date = ref<Date | undefined>(new Date());

const dateTimeRange = ref<DateTimeRange>({
  from: new Date(),
  to: new Date(),
});

const dateRange = ref<DateRange>({
  from: new Date(),
  to: new Date(),
});

const time = ref<Date>(new Date());
</script>

<template>
  <div
    class="flex min-h-0 flex-col"
    :class="props.embedded ? 'p-5' : 'h-full p-4'"
  >
    <div
      class="flex items-center justify-between shrink-0"
      :class="props.embedded ? 'mb-4' : ''"
    >
      <h1 v-if="!props.embedded" class="text-2xl font-bold">
        {{ $t("menu.components.input.dateTimeRangePicker") }}
      </h1>
      <div v-else />
    </div>

    <div class="flex-1 space-y-8 overflow-auto" :class="props.embedded ? '' : 'mt-4'">
      <div class="space-y-2">
        <h2 class="text-lg font-semibold">{{ $t("demo.dateTimeRangePicker.date") }}</h2>
        <DatePicker
          v-model="date"
          :locale="locale === 'en' ? 'en' : 'zhHans'"
        />
      </div>

      <div class="space-y-2">
        <h2 class="text-lg font-semibold">{{ $t("demo.dateTimeRangePicker.dateTime") }}</h2>
        <DateTimeRangePicker
          v-model="dateTimeRange"
          :locale="locale === 'en' ? 'en' : 'zhHans'"
        />
      </div>

      <div class="space-y-2">
        <h2 class="text-lg font-semibold">{{ $t("demo.dateTimeRangePicker.dateRange") }}</h2>
        <DateRangePicker
          v-model="dateRange"
          :locale="locale === 'en' ? 'en' : 'zhHans'"
        />
      </div>

      <div class="space-y-2">
        <h2 class="text-lg font-semibold">{{ $t("demo.dateTimeRangePicker.time") }}</h2>
        <TimeInput v-model="time" :locale="locale === 'en' ? 'en' : 'zhHans'" />
      </div>

      <div class="space-y-2 rounded-lg border bg-muted/20 p-4">
        <h3 class="font-semibold">{{ $t("demo.dateTimeRangePicker.currentValues") }}</h3>
        <p class="text-sm">
          {{ $t("demo.dateTimeRangePicker.labels.date") }}: {{ date }}
        </p>
        <p class="text-sm">
          {{ $t("demo.dateTimeRangePicker.labels.dateTime") }}: {{ dateTimeRange }}
        </p>
        <p class="text-sm">
          {{ $t("demo.dateTimeRangePicker.labels.dateRange") }}: {{ dateRange }}
        </p>
        <p class="text-sm">
          {{ $t("demo.dateTimeRangePicker.labels.time") }}: {{ time }}
        </p>
      </div>
    </div>
  </div>
</template>
