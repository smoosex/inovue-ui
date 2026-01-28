<script setup lang="ts">
import AppSidebar from "./components/AppSidebar.vue";
import SiteHeader from "./components/SiteHeader.vue";
</script>

<template>
  <div class="h-screen flex">
    <SidebarProvider>
      <AppSidebar layout="modern" />
      <SidebarInset>
        <SiteHeader layout="modern" />
        <div class="flex-1 overflow-hidden px-4 pb-2">
          <router-view />
        </div>
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>
