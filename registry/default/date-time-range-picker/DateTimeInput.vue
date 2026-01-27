<script setup lang="ts">
import { ref, watch } from "vue";
import { cn } from "@/lib/utils";
import DateInput from "./DateInput.vue";
import TimeInput from "./TimeInput.vue";

const modelValue = defineModel<Date>();

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    class?: string;
    label?: string;
  }>(),
  {
    disabled: false,
  }
);

const date = ref<Date>(modelValue.value || new Date());

watch(
  () => modelValue.value,
  (newVal) => {
    if (newVal) {
      date.value = new Date(newVal);
    }
  }
);

const handleDateChange = (newDate: Date | undefined) => {
  if (props.disabled || !newDate) return;

  const updatedDate = new Date(newDate);
  if (date.value) {
    updatedDate.setHours(
      date.value.getHours(),
      date.value.getMinutes(),
      date.value.getSeconds(),
      date.value.getMilliseconds()
    );
  }

  date.value = updatedDate;
  modelValue.value = updatedDate;
};

const handleTimeChange = (newTime: Date | undefined) => {
  if (props.disabled || !newTime) return;

  const updatedDate = new Date(date.value);
  updatedDate.setHours(
    newTime.getHours(),
    newTime.getMinutes(),
    newTime.getSeconds(),
    newTime.getMilliseconds()
  );

  date.value = updatedDate;
  modelValue.value = updatedDate;
};
</script>

<template>
  <div :class="cn('flex flex-col space-y-1', props.class)">
    <span v-if="label" class="text-xs text-muted-foreground">{{ label }}</span>
    <div class="flex flex-col sm:flex-row gap-2">
      <DateInput
        :model-value="date"
        :disabled="disabled"
        @update:model-value="handleDateChange"
      />
      <TimeInput
        :model-value="date"
        :disabled="disabled"
        @update:model-value="handleTimeChange"
      />
    </div>
  </div>
</template>
