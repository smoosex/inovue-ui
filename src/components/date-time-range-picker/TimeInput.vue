<script setup lang="ts">
import { ref, watch, useId } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-vue-next";
import type { TimeParts } from "./types";

const inputId = useId();
const modelValue = defineModel<Date>();

const props = withDefaults(
  defineProps<{
    disabled?: boolean;
    class?: string;
  }>(),
  {
    disabled: false,
  }
);

const time = ref<TimeParts>({
  hours: 12,
  minutes: 0,
  ampm: "AM",
});

const syncFromValue = () => {
  if (modelValue.value) {
    const d = new Date(modelValue.value);
    const hours = d.getHours();
    time.value = {
      hours: hours % 12 === 0 ? 12 : hours % 12,
      minutes: d.getMinutes(),
      ampm: hours >= 12 ? "PM" : "AM",
    };
  }
};

watch(() => modelValue.value, syncFromValue, { immediate: true });

const updateTime = (newTime: TimeParts) => {
  if (props.disabled) return;

  const currentDate = modelValue.value
    ? new Date(modelValue.value)
    : new Date();
  const hours =
    newTime.ampm === "PM" && newTime.hours !== 12
      ? newTime.hours + 12
      : newTime.ampm === "AM" && newTime.hours === 12
      ? 0
      : newTime.hours;

  currentDate.setHours(hours);
  currentDate.setMinutes(newTime.minutes);
  currentDate.setSeconds(0);

  modelValue.value = currentDate;
  time.value = newTime;
};

const handleInputChange = (
  field: "hours" | "minutes",
  value: string | number
) => {
  if (props.disabled) return;

  const stringValue = String(value).replace(/\D/g, "");
  if (!stringValue) return;

  const numValue = parseInt(stringValue, 10);

  let newValue = numValue;
  if (field === "hours") {
    if (numValue < 1) newValue = 1;
    else if (numValue > 12) newValue = 12;
  } else if (field === "minutes") {
    if (numValue < 0) newValue = 0;
    else if (numValue > 59) newValue = 59;
  }

  updateTime({ ...time.value, [field]: newValue });
};

const handleAmPmToggle = () => {
  if (props.disabled) return;
  updateTime({ ...time.value, ampm: time.value.ampm === "AM" ? "PM" : "AM" });
};

const incrementHours = () => {
  if (props.disabled) return;
  const newHours = time.value.hours === 12 ? 1 : time.value.hours + 1;
  updateTime({ ...time.value, hours: newHours });
};

const decrementHours = () => {
  if (props.disabled) return;
  const newHours = time.value.hours === 1 ? 12 : time.value.hours - 1;
  updateTime({ ...time.value, hours: newHours });
};

const incrementMinutes = () => {
  if (props.disabled) return;
  const newMinutes = (time.value.minutes + 1) % 60;
  updateTime({ ...time.value, minutes: newMinutes });
};

const decrementMinutes = () => {
  if (props.disabled) return;
  const newMinutes = (time.value.minutes - 1 + 60) % 60;
  updateTime({ ...time.value, minutes: newMinutes });
};

const formatTimeValue = (value: number): string => {
  return value.toString().padStart(2, "0");
};
</script>

<template>
  <div
    :class="
      cn('flex items-center space-x-1 rounded-md border p-1', props.class)
    "
  >
    <div class="flex flex-col items-center">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="h-5 w-5"
        :disabled="disabled"
        @click="incrementHours"
      >
        <ChevronUp class="h-3 w-3" />
      </Button>
      <Input
        :id="`time-input-hours-${inputId}`"
        type="text"
        inputmode="numeric"
        :model-value="formatTimeValue(time.hours)"
        @update:model-value="handleInputChange('hours', $event)"
        class="w-7 border-0 text-center focus:outline-none focus:ring-0 p-0 disabled:opacity-50"
        :disabled="disabled"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="h-5 w-5"
        :disabled="disabled"
        @click="decrementHours"
      >
        <ChevronDown class="h-3 w-3" />
      </Button>
    </div>
    <span class="text-sm font-medium">:</span>
    <div class="flex flex-col items-center">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="h-5 w-5"
        :disabled="disabled"
        @click="incrementMinutes"
      >
        <ChevronUp class="h-3 w-3" />
      </Button>
      <Input
        :id="`time-input-minutes-${inputId}`"
        type="text"
        inputmode="numeric"
        :model-value="formatTimeValue(time.minutes)"
        @update:model-value="handleInputChange('minutes', $event)"
        class="w-7 border-0 text-center focus:outline-none focus:ring-0 p-0 disabled:opacity-50"
        :disabled="disabled"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        class="h-5 w-5"
        :disabled="disabled"
        @click="decrementMinutes"
      >
        <ChevronDown class="h-3 w-3" />
      </Button>
    </div>
    <Button
      type="button"
      variant="outline"
      size="sm"
      class="text-xs px-2 h-8"
      :disabled="disabled"
      @click="handleAmPmToggle"
    >
      {{ time.ampm }}
    </Button>
  </div>
</template>
