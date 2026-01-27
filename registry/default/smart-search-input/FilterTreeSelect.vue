<script setup lang="ts">
import { computed, ref, useAttrs } from "vue";
import { ChevronsUpDown } from "lucide-vue-next";
import type { SelectOption } from "../types";
import FilterTreeSelectOption from "./FilterTreeSelectOption.vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandSeparator,
  CommandItem,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const attrs = useAttrs();

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  options?: SelectOption[];
  placeholder?: string;
  id?: string;
}>();

const modelValue = defineModel<(string | number)[]>("modelValue", {
  default: () => [],
});

const emit = defineEmits<{
  (e: "search"): void;
}>();

const open = ref(false);

const itemMap = computed(() => {
  const map = new Map<string, SelectOption>();
  const parentMap = new Map<string, SelectOption | null>();

  const traverse = (opts: SelectOption[], parent: SelectOption | null) => {
    opts.forEach((opt) => {
      map.set(String(opt.value), opt);
      parentMap.set(String(opt.value), parent);
      if (opt.children) {
        traverse(opt.children, opt);
      }
    });
  };
  traverse(props.options || [], null);
  return { map, parentMap };
});

const selectedLabels = computed(() => {
  if (!modelValue.value || modelValue.value.length === 0) return [];
  return modelValue.value.map(
    (v) => itemMap.value.map.get(String(v))?.label || String(v),
  );
});

const handleToggle = (val: string | number) => {
  const strVal = String(val);
  const currentSet = new Set(modelValue.value.map(String));
  const isSelecting = !currentSet.has(strVal);

  const { map, parentMap } = itemMap.value;
  const targetNode = map.get(strVal);
  if (!targetNode) return;

  const updateDescendants = (node: SelectOption, select: boolean) => {
    const nodeStrVal = String(node.value);
    if (select) currentSet.add(nodeStrVal);
    else currentSet.delete(nodeStrVal);

    if (node.children) {
      node.children.forEach((child) => void updateDescendants(child, select));
    }
  };
  updateDescendants(targetNode, isSelecting);

  let currentNode = targetNode;
  while (true) {
    const parent = parentMap.get(String(currentNode.value));
    if (!parent) break;

    const parentStrVal = String(parent.value);
    const siblings = parent.children || [];
    const allSiblingsSelected = siblings.every((sib) =>
      currentSet.has(String(sib.value)),
    );

    if (allSiblingsSelected) {
      currentSet.add(parentStrVal);
    } else {
      currentSet.delete(parentStrVal);
    }

    currentNode = parent;
  }

  modelValue.value = Array.from(currentSet);
};

const handleClear = () => {
  modelValue.value = [];
  emit("search");
};

const triggerClass = computed(() =>
  cn("w-50 justify-between rounded-none", attrs.class as string),
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
      >
        <div class="flex gap-1 text-left font-normal overflow-hidden flex-1">
          <span
            v-if="modelValue.length === 0"
            class="text-muted-foreground truncate"
            >{{ placeholder || "Select" }}</span
          >
          <template v-else-if="modelValue.length <= 3">
            <Badge
              v-for="(label, idx) in selectedLabels"
              :key="idx"
              variant="secondary"
              class="rounded-sm px-1.5 py-0 text-xs font-normal shrink-0"
            >
              {{ label }}
            </Badge>
          </template>
          <Badge
            v-else
            variant="secondary"
            class="rounded-sm px-1.5 py-0 text-xs font-normal"
          >
            {{ modelValue.length }} selected
          </Badge>
        </div>
        <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
    <PopoverContent
      class="p-0"
      style="width: var(--reka-popper-anchor-width)"
      align="start"
    >
      <Command>
        <CommandInput :id="id" :placeholder="placeholder" />
        <CommandList>
          <CommandEmpty>No results</CommandEmpty>
          <CommandGroup>
            <ScrollArea class="h-64">
              <FilterTreeSelectOption
                v-for="option in options"
                :key="option.value"
                :option="option"
                :selected-values="modelValue"
                @toggle="handleToggle"
              />
            </ScrollArea>
          </CommandGroup>
          <template v-if="modelValue.length > 0">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                :value="'{clear}'"
                class="justify-center text-center"
                @select="handleClear"
              >
                Clear filters
              </CommandItem>
            </CommandGroup>
          </template>
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</template>
