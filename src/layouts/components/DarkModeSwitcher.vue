<script setup lang="ts">
const themeStore = useThemeStore();
</script>

<template>
  <Button variant="ghost" size="icon" @click="themeStore.toggleDark()">
    <LucideSun v-if="!themeStore.isDark" class="h-5 w-5" />
    <LucideMoon v-else class="h-5 w-5" />
  </Button>
</template>
