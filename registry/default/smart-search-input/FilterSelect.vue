<script setup lang="ts">
import { computed, useAttrs } from "vue";
import type { SelectOption } from "../types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui";
import { cn } from "@/lib/utils";

const attrs = useAttrs();

defineOptions({
  inheritAttrs: false,
});

defineProps<{
  options?: SelectOption[];
  placeholder?: string;
}>();

const modelValue = defineModel<string | number>();

const emit = defineEmits<{
  (e: "search"): void;
}>();

// Auto-trigger search on change
const handleChange = (val: any) => {
  modelValue.value = val || "";
  emit("search");
};

const triggerClass = computed(() =>
  cn("w-50 rounded-none border focus:ring-0", attrs.class as string)
);
</script>

<template>
  <Select
    :model-value="String(modelValue || '')"
    @update:model-value="handleChange"
  >
    <SelectTrigger :class="triggerClass">
      <SelectValue
        :placeholder="placeholder || 'Select'"
      />
    </SelectTrigger>
    <SelectContent>
      <SelectItem
        v-for="option in options"
        :key="option.value"
        :value="String(option.value)"
      >
        {{ option.label }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
