<script setup lang="ts">
import type { ToolbarAction } from "./types";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

defineProps<{
  action: ToolbarAction;
}>();
</script>

<template>
  <template v-if="action.show !== false">
    <!-- Icon Only Button with Tooltip -->
    <Tooltip v-if="action.isIconOnly">
      <TooltipTrigger as-child>
        <Button
          :variant="action.variant || 'outline'"
          :size="action.size || 'icon'"
          :disabled="action.disabled"
          @click="action.onClick"
        >
          <component :is="action.icon" class="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{{ action.tooltip || action.label }}</p>
      </TooltipContent>
    </Tooltip>

    <!-- Regular Button -->
    <Button
      v-else
      :variant="action.variant || 'default'"
      :size="action.size || 'sm'"
      :disabled="action.disabled"
      @click="action.onClick"
    >
      <component :is="action.icon" v-if="action.icon" class="h-4 w-4" />
      {{ action.label }}
    </Button>
  </template>
</template>
