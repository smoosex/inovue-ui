<script setup lang="ts">
import { computed, ref } from "vue";
import { ArrowLeft, Settings2, Loader2 } from "lucide-vue-next";
import {
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import type { FilterOption } from "../types";

const props = defineProps<{
  currentOption: FilterOption;
}>();

const emit = defineEmits<{
  (e: "search", value: any): void;
  (e: "back"): void;
  (e: "loadMore", key: string): void;
}>();

const isLoadingMore = ref(false);

const handleSelectOption = (value: string | number) => {
  // Single select: immediate emit
  emit("search", value);
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

      <!-- Single Select Input Area -->
      <CommandInput
        :id="`search-select-${currentOption.value}`"
        :name="`search-select-${currentOption.value}`"
        class="border-none focus:ring-0 h-11 flex-1"
        :placeholder="'Filter options...'"
      />
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
          <span>{{ opt.label }}</span>
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
  </div>
</template>
