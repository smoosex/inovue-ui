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
    <SidebarProvider
      class="flex flex-col bg-linear-150 from-accent via-primary to-accent"
    >
      <SiteHeader
        class="flex-none rounded-xl bg-background/40 backdrop-blur-sm shadow-sm border border-white/20 mt-2 mx-2"
        v-model:active-parent-id="activeParentId"
      />
      <div class="flex flex-1 overflow-hidden">
        <AppSidebar
          class="h-[calc(100svh-var(--header-height)-var(--spacing)*2)]! mt-2"
          :active-parent-id="activeParentId"
        />
        <SidebarInset
          class="flex-1 overflow-auto bg-background/40 backdrop-blur-sm border border-white/20 shadow-sm"
        >
          <div class="p-4 md:p-6 mb-6 flex items-center gap-4">
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
          <router-view />
        </SidebarInset>
      </div>
    </SidebarProvider>
  </div>
</template>
