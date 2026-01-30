<script setup lang="ts">
import { computed, useAttrs, ref } from "vue";
import { useIntersectionObserver, useVirtualList } from "@vueuse/core";
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

const props = withDefaults(
  defineProps<{
    options?: SelectOption[];
    placeholder?: string;
    loading?: boolean;
    total?: number;
    currentPage?: number;
    pageSize?: number;
  }>(),
  {
    currentPage: 1,
    pageSize: 20,
  }
);

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

const hasMore = computed(() => {
  return props.currentPage * props.pageSize < (props.total || 0);
});

const VIRTUAL_THRESHOLD = 50;

const shouldUseVirtual = computed(
  () => (props.options?.length || 0) > VIRTUAL_THRESHOLD
);

const { list, containerProps, wrapperProps } = useVirtualList(
  computed(() => props.options || []),
  {
    itemHeight: 32,
    overscan: 5,
  }
);

const sentinel = ref<HTMLElement | null>(null);

useIntersectionObserver(
  sentinel,
  ([{ isIntersecting }]) => {
    if (isIntersecting && hasMore.value && !props.loading) {
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
      <template v-if="options && options.length > 0">
        <div v-if="shouldUseVirtual" v-bind="containerProps" class="max-h-64 overflow-auto">
          <div v-bind="wrapperProps">
            <SelectItem
              v-for="{ data } in list"
              :key="data.value"
              :value="String(data.value)"
              :style="{ height: '32px' }"
            >
              {{ data.label }}
            </SelectItem>
          </div>
        </div>
        <template v-else>
          <SelectItem
            v-for="option in options"
            :key="option.value"
            :value="String(option.value)"
          >
            {{ option.label }}
          </SelectItem>
        </template>
      </template>

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
