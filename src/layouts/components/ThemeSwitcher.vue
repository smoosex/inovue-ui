<script setup lang="ts">
const themeStore = useThemeStore();
const { theme } = storeToRefs(themeStore);
const { setTheme, themes } = themeStore;
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon">
        <LucidePalette class="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="item in themes"
        :key="item.value"
        @click="setTheme(item.value)"
        class="flex items-center justify-between gap-2"
      >
        <div class="flex items-center gap-2">
          <div
            class="h-4 w-4 rounded-full border shadow-sm"
            :style="{ backgroundColor: item.color }"
          />
          <span>{{ item.label }}</span>
        </div>
        <LucideCheck v-if="theme === item.value" class="h-4 w-4" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
