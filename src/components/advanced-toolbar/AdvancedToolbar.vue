<script setup lang="ts">
import type { ToolbarAction } from "./types";
import ToolbarItem from "./ToolbarItem.vue";

defineProps<{
  primaryActions?: ToolbarAction[];
  secondaryActions?: ToolbarAction[];
}>();
</script>

<template>
  <div class="flex items-center justify-between">
    <!-- Primary Actions (Left) -->
    <div class="flex items-center gap-2">
      <ToolbarItem
        v-for="action in primaryActions"
        :key="action.key"
        :action="action"
      />
    </div>

    <div class="flex-1 flex justify-end px-4">
      <slot />
    </div>

    <!-- Secondary Actions (Right) -->
    <div class="flex items-center gap-2">
      <ToolbarItem
        v-for="action in secondaryActions"
        :key="action.key"
        :action="action"
      />
    </div>
  </div>
</template>
