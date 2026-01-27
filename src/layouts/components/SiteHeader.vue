<script setup lang="ts">
import ThemeSwitcher from "./ThemeSwitcher.vue";
import LayoutSwitcher from "./LayoutSwitcher.vue";
import LanguageSwitcher from "./LanguageSwitcher.vue";
import DarkModeSwitcher from "./DarkModeSwitcher.vue";
import UserCenter from "./UserCenter.vue";
import AppBreadcrumb from "./AppBreadcrumb.vue";
import type { CSSProperties } from "vue";
import type { MenuItem } from "@/api/menu";
import { useMenuStore } from "@/stores/menu";

const activeParentId = defineModel<string>("activeParentId");

const props = defineProps<{
  layout?: "classic" | "modern";
}>();

const logoMaskStyle = computed<CSSProperties>(() => ({
  mask: `url(${APP_LOGO}) no-repeat center / contain`,
  WebkitMask: `url(${APP_LOGO}) no-repeat center / contain`,
}));

const menuStore = useMenuStore();

const level1Menus = computed<MenuItem[]>(() => {
  return menuStore.menus.filter((m) => m.show && m.children?.length);
});

const handleParentClick = (id: string) => {
  activeParentId.value = id;
};
</script>

<template>
  <header
    class="sticky z-50 flex h-(--header-height) items-center gap-4 px-4"
    :class="layout === 'modern' ? 'h-16' : ''"
  >
    <!-- Modern: SidebarTrigger, Breadcrumb on left -->
    <template v-if="layout === 'modern'">
      <div class="flex items-center gap-2">
        <SidebarTrigger class="-ml-1" />
        <Separator orientation="vertical" class="h-4 mr-2" />
        <AppBreadcrumb />
      </div>
    </template>

    <!-- Classic: Logo + Level 1 Menu -->
    <template v-else>
      <div class="flex items-center gap-2">
        <div class="h-6 w-6 bg-primary" :style="logoMaskStyle" />
        <span class="font-bold text-xl">{{ APP_NAME }}</span>
      </div>
      <nav class="ml-6 flex items-center gap-1">
        <Button
          v-for="item in level1Menus"
          class="cursor-pointer"
          :key="item.id"
          variant="ghost"
          :class="{ 'bg-accent': activeParentId === item.id }"
          @click="handleParentClick(item.id)"
        >
          {{ $t(item.i18n_key) || item.name }}
        </Button>
      </nav>
    </template>

    <div class="ml-auto flex items-center gap-4">
      <!-- Theme Switcher -->
      <ThemeSwitcher />

      <!-- Layout Switcher -->
      <LayoutSwitcher />

      <!-- Dark Mode Switcher -->
      <DarkModeSwitcher />

      <!-- Language Switcher -->
      <LanguageSwitcher />

      <!-- Classic: User Center -->
      <template v-if="layout !== 'modern'">
        <UserCenter />
      </template>
    </div>
  </header>
</template>
