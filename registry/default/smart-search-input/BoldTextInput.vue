<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ArrowLeft, Settings2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import type { FilterOption } from "../types";

const props = defineProps<{
  currentOption: FilterOption;
}>();

const emit = defineEmits<{
  (e: "search", value: string): void;
  (e: "back"): void;
}>();

const inputValue = ref("");
const inputRef = ref<HTMLInputElement | null>(null); // Use useTemplateRef in Vue 3.5+, keeping ref for now

// Focus on mount
onMounted(() => {
  inputRef.value?.focus();
});

const handleSearch = () => {
  if (!inputValue.value) return;
  emit("search", inputValue.value);
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

      <!-- Text Input -->
      <input
        ref="inputRef"
        v-model="inputValue"
        :id="`search-input-${currentOption.value}`"
        :name="`search-input-${currentOption.value}`"
        class="flex h-11 flex-1 rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground ml-2 min-w-[100px]"
        :placeholder="'Enter value...'"
        @keydown.enter="handleSearch"
      />
    </div>
  </div>
</template>
