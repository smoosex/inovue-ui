<script setup lang="ts">
import type { Layout } from "@/stores/theme";

const themeStore = useThemeStore();

const currentLayoutIcon = computed(() =>
  themeStore.layouts.find((o) => o.value === themeStore.layout)?.icon,
);
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon">
        <component :is="currentLayoutIcon" class="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="option in themeStore.layouts"
        :key="option.value"
        @click="themeStore.setLayout(option.value as Layout)"
        class="flex items-center gap-3"
      >
        <component :is="option.icon" class="h-4 w-4" />
        <span>{{ option.label }}</span>
        <LucideCheck
          v-if="themeStore.layout === option.value"
          class="ml-auto h-4 w-4"
        />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
