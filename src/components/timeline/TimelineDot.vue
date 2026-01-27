<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes["class"];
    variant?: "default" | "primary" | "success" | "warning" | "danger";
  }>(),
  {
    variant: "default",
  }
);

const variantStyles: Record<string, string> = {
  default: "bg-border",
  primary: "bg-primary",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
};
</script>

<template>
  <div
    :class="
      cn(
        'absolute -left-[31px] mt-1.5 h-3 w-3 rounded-full border-2 border-background',
        variantStyles[variant],
        props.class
      )
    "
  />
</template>
