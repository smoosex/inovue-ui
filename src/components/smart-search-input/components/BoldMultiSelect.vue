<script setup lang="ts">
import { computed, ref } from "vue";
import { ArrowLeft, Settings2, Check, X, Loader2 } from "lucide-vue-next";
import {
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { FilterOption } from "../types";

const props = defineProps<{
  currentOption: FilterOption;
}>();

const emit = defineEmits<{
  (e: "search", value: any): void;
  (e: "back"): void;
  (e: "loadMore", key: string): void;
}>();

// State
const selectedValues = ref<Set<string | number>>(new Set());
const isLoadingMore = ref(false);

// Helper to get label for selected value
const getOptionLabel = (val: string | number) => {
  if (!props.currentOption.options) return val;
  const found = props.currentOption.options.find((opt) => opt.value === val);
  return found ? found.label : val;
};

const handleSelectOption = (value: string | number) => {
  // Toggle logic
  if (selectedValues.value.has(value)) {
    selectedValues.value.delete(value);
  } else {
    selectedValues.value.add(value);
  }
};

const handleSearch = () => {
  const rawValue = Array.from(selectedValues.value);
  emit("search", rawValue);
};

const removeTag = (value: string | number) => {
  selectedValues.value.delete(value);
};

const canLoadMore = computed(() => {
  const opt = props.currentOption;
  if (!opt || !opt.loadMore) return false;
  if (typeof opt.total === "number" && opt.currentPage && opt.pageSize) {
    return opt.currentPage * opt.pageSize < opt.total;
  }
  return true;
});

const handleLoadMore = async () => {
  if (isLoadingMore.value) return;
  isLoadingMore.value = true;
  try {
    if (props.currentOption.loadMore) {
      await props.currentOption.loadMore();
    }
    emit("loadMore", props.currentOption.value);
  } finally {
    isLoadingMore.value = false;
  }
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

      <!-- Multi-Select Input Area -->
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
          :id="`search-select-${currentOption.value}`"
          :name="`search-select-${currentOption.value}`"
          class="border-none focus:ring-0 h-9 min-w-[120px] flex-1 border-0 shadow-none px-1"
          :placeholder="'Filter...'"
        />
      </div>
    </div>

    <!-- Options List -->
    <CommandList>
      <CommandEmpty>No options</CommandEmpty>
      <CommandGroup heading="Options">
        <CommandItem
          v-for="opt in currentOption.options || []"
          :key="opt.value"
          :value="opt.label"
          @select="handleSelectOption(opt.value)"
          class="cursor-pointer"
        >
          <div class="flex items-center justify-between w-full">
            <span>{{ opt.label }}</span>
            <Check
              v-if="selectedValues.has(opt.value)"
              class="h-4 w-4 text-primary"
            />
          </div>
        </CommandItem>
        <!-- Load More Item -->
        <CommandItem
          v-if="canLoadMore"
          value="...load more..."
          @select="handleLoadMore"
          class="justify-center text-muted-foreground cursor-pointer"
        >
          <Loader2 v-if="isLoadingMore" class="h-4 w-4 animate-spin mr-2" />
          <span v-else>Load more</span>
        </CommandItem>
      </CommandGroup>
    </CommandList>

    <!-- Footer for Multi-Select: Apply Button -->
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
