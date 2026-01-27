<script setup lang="ts">
import { provide, type InjectionKey } from "vue";

export interface TimelineContext {
  align: "left" | "right";
}

const props = withDefaults(
  defineProps<{
    align?: "left" | "right";
  }>(),
  {
    align: "left",
  }
);

const timelineContext: TimelineContext = {
  align: props.align,
};

provide("timeline" as InjectionKey<TimelineContext> | string, timelineContext);
</script>

<template>
  <ul class="space-y-6 border-l-2 border-muted ml-3 pl-6">
    <slot />
  </ul>
</template>
