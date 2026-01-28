<script setup lang="ts">
import { ref } from "vue";
import {
  DateTimeRangePicker,
  DateRangePicker,
  TimeInput,
} from "@/components/date-time-range-picker";
import type {
  DateTimeRange,
  DateRange,
} from "@/components/date-time-range-picker";
import { Button } from "@/components/ui/button";

const { locale } = useI18n();

const dateTimeRange = ref<DateTimeRange>({
  from: new Date(),
  to: new Date(),
});

const dateRange = ref<DateRange>({
  from: new Date(),
  to: new Date(),
});

const time = ref<Date>(new Date());

const handleSearch = () => {
  console.log("DateTimeRange:", dateTimeRange.value);
  console.log("DateRange:", dateRange.value);
  console.log("Time:", time.value);
};
</script>

<template>
  <div class="h-screen flex flex-col p-4 pt-0">
    <div class="flex items-center justify-between shrink-0">
      <h1 class="text-2xl font-bold">
        {{ $t("menu.components.input.dateTimeRangePicker") }}
      </h1>
      <Button variant="outline" size="sm" @click="handleSearch"> 提交 </Button>
    </div>

    <div class="flex-1 overflow-auto space-y-8 mt-4">
      <!-- DateTimeRangePicker -->
      <div class="space-y-2">
        <h2 class="text-lg font-semibold">日期时间范围选择器</h2>
        <DateTimeRangePicker
          v-model="dateTimeRange"
          :locale="locale === 'en' ? 'en' : 'zhHans'"
        />
      </div>

      <!-- DateRangePicker -->
      <div class="space-y-2">
        <h2 class="text-lg font-semibold">日期范围选择器</h2>
        <DateRangePicker
          v-model="dateRange"
          :locale="locale === 'en' ? 'en' : 'zhHans'"
        />
      </div>

      <!-- TimeInput -->
      <div class="space-y-2">
        <h2 class="text-lg font-semibold">时间输入</h2>
        <TimeInput v-model="time" />
      </div>

      <!-- 选中值展示 -->
      <div class="p-4 border rounded-lg bg-muted/20 space-y-2">
        <h3 class="font-semibold">当前选中值：</h3>
        <p class="text-sm">日期时间范围: {{ dateTimeRange }}</p>
        <p class="text-sm">日期范围: {{ dateRange }}</p>
        <p class="text-sm">时间: {{ time }}</p>
      </div>
    </div>
  </div>
</template>
