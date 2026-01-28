<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./components/AppSidebar.vue";
import SiteHeader from "./components/SiteHeader.vue";
import AppBreadcrumb from "./components/AppBreadcrumb.vue";

const router = useRouter();
const route = useRoute();

const activeParentId = ref("1");
</script>

<template>
  <div
    class="[--header-height:calc(--spacing(14))] h-screen overflow-hidden flex flex-col"
  >
    <SidebarProvider class="flex flex-col">
      <SiteHeader
        class="flex-none shadow-sm border-b bg-background"
        layout="classic"
        v-model:active-parent-id="activeParentId"
      />
      <div class="flex flex-1 overflow-hidden">
        <AppSidebar
          layout="classic"
          :active-parent-id="activeParentId"
          class="h-[calc(100svh-var(--header-height))]!"
        />
        <SidebarInset class="flex-1 overflow-hidden">
          <div class="p-4 flex items-center gap-4">
            <Button
              v-if="route.meta.showBack"
              variant="outline"
              size="icon"
              @click="router.back()"
              class="h-8 w-8"
            >
              <ArrowLeft class="h-4 w-4" />
            </Button>
            <AppBreadcrumb />
          </div>
          <div class="flex-1 px-4 pb-2 overflow-auto">
            <router-view />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  </div>
</template>
