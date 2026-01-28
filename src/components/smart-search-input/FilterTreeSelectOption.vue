<script setup lang="ts">
import { computed, ref } from "vue";
import { ChevronRight, ChevronDown } from "lucide-vue-next";
import type { SelectOption } from "./types";
import { Checkbox } from "@/components/ui/checkbox";

const props = defineProps<{
  option: SelectOption;
  selectedValues: (string | number)[];
  level?: number;
}>();

const emit = defineEmits<{
  (e: "toggle", value: string | number): void;
}>();

const isExpanded = ref(false);
const currentLevel = props.level || 0;

const isSelected = computed(() =>
  props.selectedValues.includes(props.option.value)
);

const hasChildren = computed(
  () => props.option.children && props.option.children.length > 0
);

const handleToggleExpand = () => {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value;
  }
};

const handleCheckboxChange = () => {
  emit("toggle", props.option.value);
};

const handleChildToggle = (val: string | number) => {
  emit("toggle", val);
};
</script>

<template>
  <div>
    <div
      class="flex items-center py-1 px-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
      :style="{ paddingLeft: `${currentLevel * 16 + 8}px` }"
      @click.stop="handleToggleExpand"
    >
      <button
        v-if="hasChildren"
        class="mr-1 h-4 w-4 shrink-0 rounded-sm hover:bg-muted flex items-center justify-center p-0"
        @click.stop="handleToggleExpand"
      >
        <ChevronDown v-if="isExpanded" class="h-3 w-3" />
        <ChevronRight v-else class="h-3 w-3" />
      </button>
      <span v-else class="mr-1 w-4"></span>

      <Checkbox
        :id="`tree-node-${option.value}`"
        :model-value="isSelected"
        class="mr-2"
        @update:model-value="handleCheckboxChange"
      />

      <span class="text-sm select-none truncate">
        {{ option.label }}
      </span>
    </div>

    <div v-if="isExpanded && hasChildren">
      <FilterTreeSelectOption
        v-for="child in option.children"
        :key="child.value"
        :option="child"
        :selected-values="selectedValues"
        :level="currentLevel + 1"
        @toggle="handleChildToggle"
      />
    </div>
  </div>
</template>
