<script setup lang="ts">
import ClassicLayout from "./ClassicLayout.vue";
import FrostedLayout from "./FrostedLayout.vue";
import ModernLayout from "./ModernLayout.vue";

const themeStore = useThemeStore();

const layoutComponent = computed(() => {
  switch (themeStore.layout) {
    case "frosted":
      return FrostedLayout;
    case "modern":
      return ModernLayout;
    default:
      return ClassicLayout;
  }
});
</script>

<template>
  <Transition name="layout-fade" mode="out-in">
    <component :is="layoutComponent" />
  </Transition>
</template>

<style>
.layout-fade-enter-active,
.layout-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.layout-fade-enter-from {
  opacity: 0;
  transform: scale(0.98);
}

.layout-fade-leave-to {
  opacity: 0;
  transform: scale(1.02);
}
</style>
