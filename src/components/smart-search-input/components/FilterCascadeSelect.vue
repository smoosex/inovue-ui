<script setup lang="ts">
import { computed, ref, useAttrs } from "vue";
import { ChevronRight, ChevronsUpDown } from "lucide-vue-next";
import type { SelectOption } from "../types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

const attrs = useAttrs();

defineOptions({
  inheritAttrs: false,
});

export type CascadeValue = {
  level1?: string;
  level2?: string;
};

const props = defineProps<{
  level1Options?: SelectOption[];
  placeholder?: string;
  id?: string;
  level1Label?: string;
  level2Label?: string;
  loadChildren?: (parentId: string) => Promise<SelectOption[]>;
}>();

const modelValue = defineModel<CascadeValue>("modelValue", {
  default: () => ({}),
});

const emit = defineEmits<{
  (e: "loadChildren", parentId: string): void;
}>();

const open = ref(false);
const activeLevel1 = ref<SelectOption | null>(null);
const level2Options = ref<SelectOption[]>([]);
const loadingLevel2 = ref(false);

// Display text for trigger
const displayText = computed(() => {
  if (!modelValue.value.level1) return "";

  const level1Item = props.level1Options?.find(
    (o) => String(o.value) === modelValue.value.level1
  );
  const level1Label = level1Item?.label || modelValue.value.level1;

  if (!modelValue.value.level2) return level1Label;

  const level2Item = level2Options.value.find(
    (o) => String(o.value) === modelValue.value.level2
  );
  const level2Label = level2Item?.label || modelValue.value.level2;

  return `${level1Label} / ${level2Label}`;
});

const handleLevel1Click = async (option: SelectOption) => {
  // Skip if same option clicked
  if (activeLevel1.value?.value === option.value) return;

  activeLevel1.value = option;
  level2Options.value = [];

  // Update model value
  modelValue.value = {
    level1: String(option.value),
    level2: undefined,
  };

  // Check if has children
  const hasChildren =
    (option.children && option.children.length > 0) ||
    option.childrenSize! > 0;

  if (!hasChildren) {
    // No children, close popover
    open.value = false;
  } else if (option.children && option.children.length > 0) {
    // Children already loaded
    level2Options.value = option.children;
  } else {
    // Load children
    const parentId = String(option.id);
    loadingLevel2.value = true;

    if (props.loadChildren) {
      // Use helper function
      try {
        const options = await props.loadChildren(parentId);
        level2Options.value = options;
      } catch (error) {
        console.error("Failed to load children", error);
      }
    } else {
      // Fallback to emit
      emit("loadChildren", parentId);
    }

    loadingLevel2.value = false;
  }
};

const handleLevel2Click = (option: SelectOption) => {
  modelValue.value = {
    level1: String(activeLevel1.value?.value),
    level2: String(option.value),
  };
  open.value = false;
};

// Method to set level2 options externally (deprecated buy kept for backward compatibility if needed)
const setLevel2Options = (options: SelectOption[]) => {
  level2Options.value = options;
  loadingLevel2.value = false;
};

defineExpose({
  setLevel2Options,
});

const triggerClass = computed(() =>
  cn("w-50 justify-between rounded-none", attrs.class as string)
);
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        role="combobox"
        :aria-expanded="open"
        :class="triggerClass"
        :id="id"
      >
        <span v-if="!displayText" class="text-muted-foreground truncate">
          {{ placeholder || "Select" }}
        </span>
        <Badge
          v-else
          variant="secondary"
          class="rounded-sm px-1.5 py-0 text-xs font-normal truncate max-w-full"
        >
          {{ displayText }}
        </Badge>
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-80 p-0" align="start">
      <div class="flex">
        <!-- Level 1 Column -->
        <div class="w-1/2 border-r">
          <div
            class="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b"
          >
            {{ level1Label }}
          </div>
          <ScrollArea class="h-64">
            <div
              v-for="option in level1Options"
              :key="option.value"
              class="flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-muted/50 transition-colors"
              :class="{
                'bg-muted': activeLevel1?.value === option.value,
                'text-primary': modelValue.level1 === String(option.value),
              }"
              @click="handleLevel1Click(option)"
            >
              <span class="text-sm truncate">{{ option.label }}</span>
              <ChevronRight
                v-if="(option as any).childrenSize > 0 || option.children?.length"
                class="h-4 w-4 shrink-0 opacity-50"
              />
            </div>
          </ScrollArea>
        </div>

        <!-- Level 2 Column -->
        <div class="w-1/2">
          <div
            class="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b"
          >
            {{ level2Label }}
          </div>
          <ScrollArea class="h-64">
            <div
              v-if="loadingLevel2"
              class="flex items-center justify-center h-20"
            >
              <span class="text-sm text-muted-foreground">{{
                "Loading"
              }}</span>
            </div>
            <template v-else-if="level2Options.length > 0">
              <div
                v-for="option in level2Options"
                :key="option.value"
                class="px-2 py-1.5 cursor-pointer hover:bg-muted/50 transition-colors"
                :class="{
                  'text-primary': modelValue.level2 === String(option.value),
                }"
                @click="handleLevel2Click(option)"
              >
                <span class="text-sm">{{ option.label }}</span>
              </div>
            </template>
            <div v-else class="flex items-center justify-center p-2">
              <span class="text-sm text-muted-foreground">
                {{
                  activeLevel1
                    ? "No data"
                    : "Select level 1 first"
                }}
              </span>
            </div>
          </ScrollArea>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
