<script setup lang="ts">
import { LoginForm } from "@/features/auth";

const themeStore = useThemeStore();
const gridBaseColor = computed(() => {
  return themeStore.isDark ? "#2a2a2a" : "#e5e5e5";
});
</script>

<template>
  <div
    class="relative min-h-screen flex items-center justify-center overflow-hidden bg-background"
  >
    <!-- Background -->
    <div class="absolute inset-0 z-0">
      <DotGrid
        :dot-size="5"
        :gap="16"
        :base-color="gridBaseColor"
        active-color="var(--primary)"
        :proximity="120"
        :speed-trigger="100"
        :shock-radius="250"
        :shock-strength="5"
        :max-speed="5000"
        :resistance="750"
        :return-duration="1.5"
        class-name="w-full h-full"
      />
    </div>

    <!-- Content -->
    <LoginForm />
  </div>
</template>
