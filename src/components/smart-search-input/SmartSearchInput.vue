<script setup lang="ts">
import { computed } from "vue";
import SmartSearchInputClassic from "./SmartSearchInputClassic.vue";
import SmartSearchInputBold from "./SmartSearchInputBold.vue";
import type { FilterOption, FilterValue } from "./types";

const props = defineProps<{
  options: FilterOption[];
  layout?: "classic" | "bold";
}>();

const emit = defineEmits<{
  (e: "search", value: FilterValue): void;
  (e: "loadMore", filterKey: string): void;
  (e: "loadChildren", parentId: string): void;
}>();


const activeComponent = computed(() => {
  return props.layout === "bold"
    ? SmartSearchInputBold
    : SmartSearchInputClassic;
});
</script>

<template>
  <component
    :is="activeComponent"
    :options="options"
    @search="emit('search', $event)"
    @load-more="emit('loadMore', $event)"
    @load-children="emit('loadChildren', $event)"
  />
</template>
