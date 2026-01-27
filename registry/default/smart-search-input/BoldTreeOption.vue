<script setup lang="ts">
import { computed } from "vue";
import { ChevronRight, ChevronDown, Loader2 } from "lucide-vue-next";
import type { SelectOption } from "../types";
import { Checkbox } from "@/components/ui/checkbox";

const props = defineProps<{
  option: SelectOption;
  selectedValues: Set<string | number>;
  expandedNodes: Set<string | number>;
  loadingNodes?: Set<string>;
  level?: number;
}>();

const emit = defineEmits<{
  (e: "toggle-select", value: string | number): void;
  (e: "toggle-expand", value: string | number): void;
}>();

const currentLevel = props.level || 0;

const isSelected = computed(() => props.selectedValues.has(props.option.value));
const isExpanded = computed(() => props.expandedNodes.has(props.option.value));
const isLoading = computed(() =>
  props.loadingNodes?.has(String(props.option.value))
);

const showExpand = computed(() => {
  return (
    (props.option.children && props.option.children.length > 0) ||
    isLoading.value
  );
});

const onRowClick = () => {
  emit("toggle-select", props.option.value);
};

const onExpandClick = () => {
  emit("toggle-expand", props.option.value);
};
</script>

<template>
  <div>
    <div
      class="flex items-center py-2 px-2 hover:bg-muted/50 cursor-pointer group transition-colors select-none"
      :style="{ paddingLeft: `${currentLevel * 16 + 8}px` }"
      @click.stop="onRowClick"
    >
      <button
        class="mr-1 h-5 w-5 shrink-0 rounded-sm hover:bg-muted flex items-center justify-center p-0 text-muted-foreground hover:text-foreground transition-colors"
        @click.stop="onExpandClick"
      >
        <Loader2 v-if="isLoading" class="h-3.5 w-3.5 animate-spin" />
        <template v-else-if="showExpand">
          <ChevronDown v-if="isExpanded" class="h-4 w-4" />
          <ChevronRight v-else class="h-4 w-4" />
        </template>
        <span v-else class="w-4"></span>
      </button>

      <Checkbox
        :model-value="isSelected"
        class="mr-2 pointer-events-none"
        tabindex="-1"
      />
      <span class="text-sm truncate">
        {{ option.label }}
      </span>
    </div>

    <!-- Recursive Children -->
    <div v-show="isExpanded && option.children && option.children.length > 0">
      <BoldTreeOption
        v-for="child in option.children"
        :key="child.value"
        :option="child"
        :selected-values="selectedValues"
        :expanded-nodes="expandedNodes"
        :loading-nodes="loadingNodes"
        :level="currentLevel + 1"
        @toggle-select="emit('toggle-select', $event)"
        @toggle-expand="emit('toggle-expand', $event)"
      />
    </div>
  </div>
</template>
