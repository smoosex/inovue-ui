<script setup lang="ts">
import type { ToolbarAction } from "./types";
import ToolbarItem from "./ToolbarItem.vue";

defineProps<{
  primaryActions?: ToolbarAction[];
  secondaryActions?: ToolbarAction[];
}>();
</script>

<template>
  <div class="flex flex-wrap items-start gap-2 sm:gap-3">
    <div v-if="primaryActions?.length" class="flex min-w-0 flex-wrap items-center gap-2">
      <ToolbarItem
        v-for="action in primaryActions"
        :key="action.key"
        :action="action"
      />
    </div>

    <div
      class="order-3 flex w-full min-w-0 justify-stretch pt-1 lg:order-none lg:w-auto lg:flex-1 lg:justify-end lg:pt-0"
      :class="secondaryActions?.length ? 'lg:pl-4 lg:pr-4' : 'lg:pl-4 lg:pr-0'"
    >
      <slot />
    </div>

    <div
      v-if="secondaryActions?.length"
      class="flex min-w-0 flex-wrap items-center gap-2 lg:ml-auto"
    >
      <ToolbarItem
        v-for="action in secondaryActions"
        :key="action.key"
        :action="action"
      />
    </div>
  </div>
</template>
