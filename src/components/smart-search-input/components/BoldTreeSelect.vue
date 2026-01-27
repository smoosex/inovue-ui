<script setup lang="ts">
import { computed, ref } from "vue";
import { ArrowLeft, Settings2, X } from "lucide-vue-next";
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BoldTreeOption from "./BoldTreeOption.vue";
import type { FilterOption, SelectOption } from "../types";

const props = defineProps<{
  currentOption: FilterOption;
}>();

const emit = defineEmits<{
  (e: "search", value: any): void;
  (e: "back"): void;
  (e: "loadChildren", parentId: string): void;
}>();

// --- State ---
const selectedValues = ref<Set<string | number>>(new Set());
const expandedNodes = ref<Set<string | number>>(new Set());
const loadingNodes = ref<Set<string>>(new Set());

// --- The Brain: O(1) Lookups ---
const itemMap = computed(() => {
  const map = new Map<string, SelectOption>();
  const parentMap = new Map<string, SelectOption | null>();

  const traverse = (opts: SelectOption[], parent: SelectOption | null) => {
    opts.forEach((opt) => {
      const key = String(opt.value);
      map.set(key, opt);
      parentMap.set(key, parent);
      if (opt.children) {
        traverse(opt.children, opt);
      }
    });
  };
  traverse(props.currentOption.options || [], null);
  return { map, parentMap };
});

// --- Logic: Selection with Cascade ---
const handleToggleSelect = (val: string | number) => {
  const strVal = String(val);
  const { map, parentMap } = itemMap.value;
  const targetNode = map.get(strVal);

  if (!targetNode) return;

  // Determine intent: If currently NOT selected, we want to SELECT.
  // Note: If checking "Is Selected", we need to check if selectedValues has it.
  const isSelecting = !selectedValues.value.has(val);

  // 1. Downward Cascade (Select/Deselect all descendants)
  const updateDescendants = (node: SelectOption, select: boolean) => {
    if (select) selectedValues.value.add(node.value);
    else selectedValues.value.delete(node.value);

    if (node.children) {
      node.children.forEach((child) => updateDescendants(child, select));
    }
  };
  updateDescendants(targetNode, isSelecting);

  // 2. Upward Cascade (Update ancestors based on siblings)
  let currentNode = targetNode;
  while (true) {
    const parent = parentMap.get(String(currentNode.value));
    if (!parent) break;

    const siblings = parent.children || [];
    // Check if ALL siblings are selected
    const allSiblingsSelected = siblings.every((sib) =>
      selectedValues.value.has(sib.value)
    );

    if (allSiblingsSelected) {
      selectedValues.value.add(parent.value);
    } else {
      selectedValues.value.delete(parent.value);
    }

    currentNode = parent;
  }

  // Force reactivity (Vue 3 Set is reactive, but explicit assignment ensures deep watchers trigger if any)
  selectedValues.value = new Set(selectedValues.value);
};

// --- Logic: Expansion & Lazy Loading ---
const handleToggleExpand = async (val: string | number) => {
  const strVal = String(val);

  // Toggle State
  if (expandedNodes.value.has(val)) {
    expandedNodes.value.delete(val);
  } else {
    expandedNodes.value.add(val);

    // Lazy Loading Check
    const node = itemMap.value.map.get(strVal);
    if (node && (!node.children || node.children.length === 0)) {
      // If we have a loadChildren callback and no children, try loading
      if (props.currentOption.loadChildren) {
        loadingNodes.value.add(strVal);
        try {
          await props.currentOption.loadChildren(strVal);
          // Note: We count on reactivity of props.currentOption.options updating the tree
          // which will update itemMap automatically.
        } finally {
          loadingNodes.value.delete(strVal);
        }
      }
    }
  }
  // Force reactivity
  expandedNodes.value = new Set(expandedNodes.value);
};

// --- Helpers ---
const getOptionLabel = (val: string | number) => {
  return itemMap.value.map.get(String(val))?.label || val;
};

const removeTag = (value: string | number) => {
  handleToggleSelect(value); // Deselecting via tag behaves same as clicking row to OFF
};

const handleSearch = () => {
  const rawValue = Array.from(selectedValues.value);
  emit("search", rawValue);
};
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div
      class="flex items-center border-b px-2 min-h-12 shrink-0 gap-1 bg-muted/20 flex-wrap py-1"
    >
      <Button
        variant="ghost"
        size="icon"
        class="h-7 w-7 rounded-sm shrink-0"
        @click="emit('back')"
      >
        <ArrowLeft class="h-4 w-4" />
      </Button>
      <!-- Field Badge -->
      <div
        class="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-medium flex items-center gap-1 shrink-0"
      >
        <Settings2 class="h-3 w-3" />
        {{ currentOption.label }}
      </div>

      <!-- Tag Area -->
      <div class="flex flex-1 items-center flex-wrap gap-1 ml-1">
        <Badge
          v-for="val in selectedValues"
          :key="val"
          variant="secondary"
          class="h-6 gap-1 px-1.5 font-normal text-xs"
        >
          {{ getOptionLabel(val) }}
          <div @click.stop="removeTag(val)">
            <X
              class="h-3.5 w-3.5 opacity-50 hover:opacity-100 cursor-pointer ml-1 transition-opacity"
            />
          </div>
        </Badge>
        <CommandInput
          :id="`search-tree-${currentOption.value}`"
          :name="`search-tree-${currentOption.value}`"
          class="border-none focus:ring-0 h-9 min-w-[120px] flex-1 border-0 shadow-none px-1"
          :placeholder="'Filter nodes...'"
        />
      </div>
    </div>

    <!-- Tree List -->
    <CommandList>
      <CommandEmpty>No nodes</CommandEmpty>
      <CommandGroup>
        <BoldTreeOption
          v-for="opt in currentOption.options || []"
          :key="opt.value"
          :option="opt"
          :selected-values="selectedValues"
          :expanded-nodes="expandedNodes"
          :loading-nodes="loadingNodes"
          @toggle-select="handleToggleSelect"
          @toggle-expand="handleToggleExpand"
        />
      </CommandGroup>
    </CommandList>

    <!-- Footer -->
    <div
      v-if="selectedValues.size > 0"
      class="p-2 border-t bg-muted/10 flex justify-end gap-2"
    >
      <div class="flex items-center text-xs text-muted-foreground mr-auto px-2">
        {{ selectedValues.size }} selected
      </div>
      <Button size="sm" variant="default" @click="handleSearch">
        Apply
      </Button>
    </div>
  </div>
</template>
