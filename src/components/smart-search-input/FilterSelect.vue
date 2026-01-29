<script setup lang="ts">
import { computed, useAttrs, ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";
import { Loader2 } from "lucide-vue-next";
import type { SelectOption } from "./types";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const attrs = useAttrs();

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  options?: SelectOption[];
  placeholder?: string;
  loading?: boolean;
  hasMore?: boolean;
}>();

const modelValue = defineModel<string | number>();

const emit = defineEmits<{
  (e: "search"): void;
  (e: "load-more"): void;
}>();

// Auto-trigger search on change
const handleChange = (val: any) => {
  modelValue.value = val || "";
  emit("search");
};

const triggerClass = computed(() =>
  cn("w-50 rounded-none border focus:ring-0", attrs.class as string)
);

const sentinel = ref<HTMLElement | null>(null);

useIntersectionObserver(
  sentinel,
  ([{ isIntersecting }]) => {
    if (isIntersecting && props.hasMore && !props.loading) {
      emit("load-more");
    }
  },
  {
    threshold: 0.1,
  }
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

      <div
        v-if="hasMore || loading"
        ref="sentinel"
        class="flex items-center justify-center py-2 text-xs text-muted-foreground"
      >
        <Loader2 v-if="loading" class="h-3 w-3 animate-spin mr-2" />
        <span>{{ loading ? 'Loading...' : 'Load more' }}</span>
      </div>
    </SelectContent>
  </Select>
</template>
