<script setup lang="ts">
import { ref, watch, useId, useTemplateRef } from "vue";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { DateParts } from "./types";

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

const monthRef = useTemplateRef<HTMLInputElement>("monthRef");
const dayRef = useTemplateRef<HTMLInputElement>("dayRef");
const yearRef = useTemplateRef<HTMLInputElement>("yearRef");

const date = ref<DateParts>({
  day: 1,
  month: 1,
  year: new Date().getFullYear(),
});

const initialDate = ref<DateParts>({ ...date.value });

const syncFromValue = () => {
  const d = modelValue.value ? new Date(modelValue.value) : new Date();
  date.value = {
    day: d.getDate(),
    month: d.getMonth() + 1,
    year: d.getFullYear(),
  };
  initialDate.value = { ...date.value };
};

watch(() => modelValue.value, syncFromValue, { immediate: true });

const validateDate = (field: keyof DateParts, value: number): boolean => {
  if (
    (field === "day" && (value < 1 || value > 31)) ||
    (field === "month" && (value < 1 || value > 12)) ||
    (field === "year" && (value < 1000 || value > 9999))
  ) {
    return false;
  }

  const newDate = { ...date.value, [field]: value };
  const d = new Date(newDate.year, newDate.month - 1, newDate.day);
  return (
    d.getFullYear() === newDate.year &&
    d.getMonth() + 1 === newDate.month &&
    d.getDate() === newDate.day
  );
};

const handleInputChange = (field: keyof DateParts, value: string | number) => {
  if (props.disabled) return;

  const stringValue = String(value);
  const newValue = stringValue ? Number(stringValue) : "";
  const isValid = typeof newValue === "number" && validateDate(field, newValue);

  date.value = { ...date.value, [field]: newValue };

  if (isValid) {
    modelValue.value = new Date(
      date.value.year,
      date.value.month - 1,
      date.value.day
    );
  }
};

const handleBlur = (field: keyof DateParts, e: FocusEvent) => {
  if (props.disabled) return;

  const target = e.target as HTMLInputElement;
  if (!target.value) {
    date.value = { ...initialDate.value };
    return;
  }

  const newValue = Number(target.value);
  const isValid = validateDate(field, newValue);

  if (!isValid) {
    date.value = { ...initialDate.value };
  } else {
    initialDate.value = { ...date.value, [field]: newValue };
  }
};

const handleKeyDown = (field: keyof DateParts, e: KeyboardEvent) => {
  if (props.disabled) return;

  if (e.metaKey || e.ctrlKey) return;

  if (
    !/^[0-9]$/.test(e.key) &&
    ![
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
      "Tab",
      "Backspace",
      "Enter",
    ].includes(e.key)
  ) {
    e.preventDefault();
    return;
  }

  const target = e.currentTarget as HTMLInputElement;

  if (e.key === "ArrowUp") {
    e.preventDefault();
    let newDate = { ...date.value };

    if (field === "day") {
      const daysInMonth = new Date(
        date.value.year,
        date.value.month,
        0
      ).getDate();
      if (date.value.day === daysInMonth) {
        newDate = { ...newDate, day: 1, month: (date.value.month % 12) + 1 };
        if (newDate.month === 1) newDate.year += 1;
      } else {
        newDate.day += 1;
      }
    }

    if (field === "month") {
      if (date.value.month === 12) {
        newDate = { ...newDate, month: 1, year: date.value.year + 1 };
      } else {
        newDate.month += 1;
      }
    }

    if (field === "year") {
      newDate.year += 1;
    }

    date.value = newDate;
    modelValue.value = new Date(newDate.year, newDate.month - 1, newDate.day);
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    let newDate = { ...date.value };

    if (field === "day") {
      if (date.value.day === 1) {
        newDate.month -= 1;
        if (newDate.month === 0) {
          newDate.month = 12;
          newDate.year -= 1;
        }
        newDate.day = new Date(newDate.year, newDate.month, 0).getDate();
      } else {
        newDate.day -= 1;
      }
    }

    if (field === "month") {
      if (date.value.month === 1) {
        newDate = { ...newDate, month: 12, year: date.value.year - 1 };
      } else {
        newDate.month -= 1;
      }
    }

    if (field === "year") {
      newDate.year -= 1;
    }

    date.value = newDate;
    modelValue.value = new Date(newDate.year, newDate.month - 1, newDate.day);
  }

  if (e.key === "ArrowRight") {
    if (
      target.selectionStart === target.value.length ||
      (target.selectionStart === 0 &&
        target.selectionEnd === target.value.length)
    ) {
      e.preventDefault();
      if (field === "month") dayRef.value?.focus();
      if (field === "day") yearRef.value?.focus();
    }
  } else if (e.key === "ArrowLeft") {
    if (
      target.selectionStart === 0 ||
      (target.selectionStart === 0 &&
        target.selectionEnd === target.value.length)
    ) {
      e.preventDefault();
      if (field === "day") monthRef.value?.focus();
      if (field === "year") dayRef.value?.focus();
    }
  }
};

const handleFocus = (e: FocusEvent) => {
  if (window.innerWidth > 1024) {
    (e.target as HTMLInputElement).select();
  }
};
</script>

<template>
  <div
    :class="cn('flex border rounded-lg items-center text-sm px-1', props.class)"
  >
    <Input
      :id="`date-input-month-${inputId}`"
      ref="monthRef"
      type="text"
      :max="12"
      :maxlength="2"
      :model-value="date.month.toString()"
      @update:model-value="handleInputChange('month', $event)"
      @keydown="handleKeyDown('month', $event)"
      @focus="handleFocus"
      @blur="handleBlur('month', $event)"
      class="p-0 outline-none w-6 border-none text-center"
      placeholder="M"
      :disabled="disabled"
    />
    <span class="opacity-20 -mx-px">/</span>
    <Input
      :id="`date-input-day-${inputId}`"
      ref="dayRef"
      type="text"
      :max="31"
      :maxlength="2"
      :model-value="date.day.toString()"
      @update:model-value="handleInputChange('day', $event)"
      @keydown="handleKeyDown('day', $event)"
      @focus="handleFocus"
      @blur="handleBlur('day', $event)"
      class="p-0 outline-none w-7 border-none text-center"
      placeholder="D"
      :disabled="disabled"
    />
    <span class="opacity-20 -mx-px">/</span>
    <Input
      :id="`date-input-year-${inputId}`"
      ref="yearRef"
      type="text"
      :max="9999"
      :maxlength="4"
      :model-value="date.year.toString()"
      @update:model-value="handleInputChange('year', $event)"
      @keydown="handleKeyDown('year', $event)"
      @focus="handleFocus"
      @blur="handleBlur('year', $event)"
      class="p-0 outline-none w-12 border-none text-center"
      placeholder="YYYY"
      :disabled="disabled"
    />
  </div>
</template>
