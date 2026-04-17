<script setup lang="ts">
import type { ToolbarAction } from "./types";
import ToolbarItem from "./ToolbarItem.vue";

defineProps<{
  primaryActions?: ToolbarAction[];
  secondaryActions?: ToolbarAction[];
}>();
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 sm:gap-3">
    <div v-if="primaryActions?.length" class="flex min-w-0 flex-wrap items-center gap-2">
      <ToolbarItem
        v-for="action in primaryActions"
        :key="action.key"
        :action="action"
      />
    </div>

    <div
      v-if="$slots.default"
      class="flex min-w-0 max-w-full items-center sm:ml-auto"
    >
      <slot />
    </div>

    <div
      v-if="secondaryActions?.length"
      class="flex min-w-0 flex-wrap items-center gap-2"
      :class="!$slots.default ? 'sm:ml-auto' : ''"
    >
      <ToolbarItem
        v-for="action in secondaryActions"
        :key="action.key"
        :action="action"
      />
    </div>
  </div>
</template>
