<script setup lang="ts">
import { X } from "lucide-vue-next";
import type { ActiveFilterItem } from "./types";

defineProps<{
  filters: ActiveFilterItem[];
}>();

const emit = defineEmits<{
  (e: "remove", key: string): void;
  (e: "clearAll"): void;
}>();
</script>

<template>
  <div v-if="filters.length" class="flex flex-wrap gap-2 items-center">
    <span class="text-sm text-muted-foreground">筛选条件：</span>
    <div
      v-for="item in filters"
      :key="item.key"
      class="flex items-center gap-1 px-2 py-1 text-sm bg-muted rounded-md"
    >
      <span class="truncate max-w-40">{{ item.label }}: {{ item.displayValue }}</span>
      <button
        class="hover:bg-muted-foreground/20 rounded p-0.5"
        @click="emit('remove', item.key)"
      >
        <X class="h-3 w-3" />
      </button>
    </div>
    <button
      class="text-xs text-muted-foreground hover:text-foreground"
      @click="emit('clearAll')"
    >
      清除全部
    </button>
  </div>
</template>
