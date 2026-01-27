<script setup lang="ts">
import AppSidebar from "./components/AppSidebar.vue";
import SiteHeader from "./components/SiteHeader.vue";
</script>

<template>
  <div>
    <SidebarProvider>
      <AppSidebar layout="modern" />
      <SidebarInset>
        <SiteHeader layout="modern" />
        <router-view />
      </SidebarInset>
    </SidebarProvider>
  </div>
</template>
