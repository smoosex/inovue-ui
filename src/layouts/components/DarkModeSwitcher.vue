<script setup lang="ts">
import { useDark, useToggle } from "@vueuse/core";
import { Moon, Sun } from "@lucide/vue";
import { Button } from "@/components/ui/button";

const isDark = useDark({
  storageKey: "inovue-ui-color-mode",
});

const toggleDark = useToggle(isDark);
</script>

<template>
  <Button variant="ghost" size="icon" @click="toggleDark()">
    <Sun v-if="!isDark" class="h-5 w-5" />
    <Moon v-else class="h-5 w-5" />
  </Button>
</template>
