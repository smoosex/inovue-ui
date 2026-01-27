<script setup lang="ts">
import type { CSSProperties } from "vue";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const logoMaskStyle = computed<CSSProperties>(() => ({
  mask: `url(${APP_LOGO}) no-repeat center / contain`,
  WebkitMask: `url(${APP_LOGO}) no-repeat center / contain`,
}));
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton
        size="lg"
        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
      >
        <div
          class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-primary-foreground"
        >
          <div class="size-5 bg-primary" :style="logoMaskStyle" />
        </div>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-medium">
            {{ APP_NAME }}
          </span>
        </div>
        <LucideChevronsUpDown class="ml-auto" />
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
