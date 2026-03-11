<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark({
  storageKey: "inovue-ui-color-mode",
});

const toggleDark = useToggle(isDark);
</script>

<template>
  <Button variant="ghost" size="icon" @click="toggleDark()">
    <LucideSun v-if="!isDark" class="h-5 w-5" />
    <LucideMoon v-else class="h-5 w-5" />
  </Button>
</template>
