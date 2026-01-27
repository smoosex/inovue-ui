<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { Command as CommandIcon } from "lucide-vue-next";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Command } from "@/components/ui/command";

import type { FilterOption, FilterValue, FilterInputType } from "./types";
import BoldFieldSelector from "./components/BoldFieldSelector.vue";
import BoldTextInput from "./components/BoldTextInput.vue";
import BoldSingleSelect from "./components/BoldSingleSelect.vue";
import BoldMultiSelect from "./components/BoldMultiSelect.vue";
import BoldTreeSelect from "./components/BoldTreeSelect.vue";
import BoldDateTimeRangeInput from "./components/BoldDateTimeRangeInput.vue";

const props = defineProps<{
  options: FilterOption[];
}>();

const emit = defineEmits<{
  (e: "search", value: FilterValue): void;
  (e: "loadMore", filterKey: string): void;
  (e: "loadChildren", parentId: string): void;
}>();

// State
const isOpen = ref(false);
const selectedKey = ref<string | null>(null);

// Computed: Find the option object reactively from props
const currentOption = computed(() => {
  if (!selectedKey.value) return null;
  return props.options.find((opt) => opt.value === selectedKey.value) || null;
});

// Helpers
const getInputType = (type?: FilterInputType) => {
  if (!type || type === "text") return "text";
  if (type === "select") return "select";
  if (type === "multi-select") return "multi-select";
  if (type === "tree-multi-select") return "tree-multi-select";
  if (type === "date-time-range") return "date-time-range";
  return "complex";
};

// Dynamic Component Resolution
const activeInputComponent = computed(() => {
  if (!currentOption.value) return null;

  const type = getInputType(currentOption.value.type);
  switch (type) {
    case "text":
      return BoldTextInput;
    case "select":
      return BoldSingleSelect;
    case "multi-select":
      return BoldMultiSelect;
    case "tree-multi-select":
      return BoldTreeSelect;
    case "date-time-range":
      return BoldDateTimeRangeInput;
    default:
      return BoldTextInput;
  }
});

// Actions
const openDialog = () => {
  isOpen.value = true;
};

const handleFieldSelect = (option: FilterOption) => {
  selectedKey.value = option.value;
  // Trigger loadOptions if needed
  if (option.loadOptions) {
    option.loadOptions();
  }
};

const handleSearch = (value: any) => {
  if (!currentOption.value) return;

  const finalValue = currentOption.value.formatValue
    ? currentOption.value.formatValue(value)
    : value;

  emit("search", {
    key: currentOption.value.value,
    value: finalValue,
  });
  isOpen.value = false;
};

const handleBack = () => {
  selectedKey.value = null;
};

const handleLoadMore = (key: string) => {
  emit("loadMore", key);
};

const handleLoadChildren = (parentId: string) => {
  emit("loadChildren", parentId);
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    openDialog();
  }
};

const handleEscape = (e: KeyboardEvent) => {
  // If we are deep in a submenu (currentOption is set), go back instead of closing.
  if (currentOption.value) {
    e.preventDefault();
    handleBack();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <div>
    <!-- Trigger Capsule -->
    <button
      @click="openDialog"
      class="group flex items-center gap-2 px-3 py-1.5 rounded-full border bg-background/30 hover:bg-background/50 backdrop-blur-md text-sm text-muted-foreground transition-all duration-300 hover:w-64 w-48 shadow-sm hover:shadow-md hover:border-primary/30"
    >
      <CommandIcon
        class="w-3.5 h-3.5 opacity-70 group-hover:text-primary transition-colors"
      />
      <span class="truncate">Search...</span>
      <kbd
        class="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted/50 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 group-hover:bg-background transition-colors"
      >
        <span class="text-xs">⌘</span>K
      </kbd>
    </button>

    <!-- Command Palette Dialog -->
    <Dialog v-model:open="isOpen">
      <DialogContent
        :show-close-button="false"
        @escape-key-down="handleEscape"
        class="p-0"
        :class="[
          currentOption?.type === 'date-time-range'
            ? 'sm:max-w-182.5 sm:min-h-135'
            : 'sm:max-w-137.5',
        ]"
      >
        <DialogTitle class="sr-only">Search</DialogTitle>
        <DialogDescription class="sr-only">
          Type to search...
        </DialogDescription>

        <Command>
          <BoldFieldSelector
            v-if="!currentOption"
            :options="props.options"
            @select="handleFieldSelect"
          />
          <component
            v-else
            :is="activeInputComponent"
            :current-option="currentOption"
            @search="handleSearch"
            @load-more="handleLoadMore"
            @load-children="handleLoadChildren"
            @back="handleBack"
          />
        </Command>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
/* Optional animations */
</style>
