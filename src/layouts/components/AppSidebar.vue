<script setup lang="ts">
import type { SidebarProps } from "@/components/ui/sidebar";
import NavMenu from "./NavMenu.vue";
import AppLogo from "./AppLogo.vue";
import UserCenter from "./UserCenter.vue";
import { useMenuStore } from "@/stores/menu";

const props = withDefaults(
  defineProps<
    SidebarProps & {
      layout?: "classic" | "modern";
      activeParentId?: string;
    }
  >(),
  {
    variant: "inset",
    collapsible: "icon",
    layout: "classic",
  },
);

const menuStore = useMenuStore();

const filteredMenus = computed(() => {
  if (props.layout === "modern") return menuStore.menus;
  if (!props.activeParentId) return [];
  const parent = menuStore.menus.find((m) => m.id === props.activeParentId);
  return parent ? [parent] : [];
});

onMounted(() => {
  menuStore.setMenus();
});
</script>

<template>
  <Sidebar
    v-bind="props"
    :class="layout === 'classic' ? 'top-(--header-height)' : ''"
  >
    <!-- Modern: Header with Logo -->
    <SidebarHeader v-if="layout === 'modern'">
      <AppLogo />
    </SidebarHeader>

    <SidebarContent>
      <NavMenu :menus="filteredMenus" :layout="layout" />
    </SidebarContent>

    <SidebarFooter>
      <!-- Modern: UserCenter with SidebarMenu style -->
      <template v-if="layout === 'modern'">
        <UserCenter :layout="layout" />
      </template>
      <!-- Classic: SidebarTrigger -->
      <template v-else>
        <SidebarTrigger />
      </template>
    </SidebarFooter>
  </Sidebar>
</template>
