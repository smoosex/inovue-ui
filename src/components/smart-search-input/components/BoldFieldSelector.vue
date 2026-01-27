<script setup lang="ts">
import { Settings2 } from "lucide-vue-next";
import {
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import type { FilterOption } from "../types";

const props = defineProps<{
  options: FilterOption[];
}>();

const emit = defineEmits<{
  (e: "select", option: FilterOption): void;
}>();
</script>

<template>
  <div class="flex flex-col h-full">
    <CommandInput
      placeholder="Search fields..."
      id="bold-asset-search-input"
    />
    <CommandList>
      <CommandEmpty>No results</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem
          v-for="option in props.options"
          :key="option.value"
          :value="option.label"
          @select="emit('select', option)"
          class="cursor-pointer"
        >
          <div class="flex items-center gap-2 w-full">
            <Settings2 class="h-4 w-4 text-muted-foreground" />
            <span>{{ option.label }}</span>
            <span class="ml-auto text-xs text-muted-foreground opacity-50">{{
              option.type
            }}</span>
          </div>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </div>
</template>
