<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css";

useThemeStore();
</script>

<template>
  <TooltipProvider>
    <router-view />
    <Toaster position="top-right" />
  </TooltipProvider>
</template>
