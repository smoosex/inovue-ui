<script setup lang="ts">
import { X } from "lucide-vue-next";

defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
  emit("click", event);
};
</script>

<template>
  <div
    v-if="visible"
    class="pointer-events-none absolute inset-y-px right-px z-10 w-10 overflow-hidden rounded-r-[calc(var(--radius)-1px)] opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100"
  >
    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-background/35 to-background/75 backdrop-blur-md" />
    <button
      type="button"
      class="pointer-events-auto absolute top-1/2 right-1.5 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-sm text-muted-foreground transition hover:bg-muted/70 hover:text-foreground"
      @click="handleClick"
    >
      <X class="h-3.5 w-3.5" />
    </button>
  </div>
</template>
