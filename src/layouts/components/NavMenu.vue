<script setup lang="ts">
import type { MenuItem } from "@/api/menu";
import { transformIcon } from "@/utils/menu";

const props = withDefaults(
  defineProps<{
    menus: MenuItem[];
    layout?: "classic" | "modern";
    activeParentId?: string;
  }>(),
  {
    layout: "modern",
  },
);

const route = useRoute();

const isActive = (path: string | undefined) => route.path === path;
</script>

<template>
  <div>
    <!-- Modern 模式：渲染 SidebarGroup（一级菜单） -->
    <SidebarGroup v-if="layout === 'modern'" v-for="item in menus">
      <SidebarGroupLabel>{{
        $t(item.i18n_key) || item.name
      }}</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible
          v-for="child in item.children"
          :key="child.id"
          class="group/collapsible"
          as-child
        >
          <SidebarMenuItem>
            <CollapsibleTrigger as-child>
              <SidebarMenuButton
                :tooltip="child.name"
                :is-active="isActive(child.path)"
              >
                <component :is="transformIcon(child.icon)" v-if="child.icon" />
                <RouterLink
                  v-if="!child.children?.length"
                  :to="child.path!"
                  class="flex items-center flex-1"
                >
                  {{ $t(child.i18n_key) || child.name }}
                </RouterLink>
                <span v-else class="flex-1">
                  {{ $t(child.i18n_key) || child.name }}
                </span>
                <LucideChevronRight
                  class="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                  v-if="child.children?.length"
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <!-- 三级菜单 -->
            <CollapsibleContent v-if="child.children?.length">
              <SidebarMenuSub>
                <SidebarMenuSubItem
                  v-for="grandChild in child.children"
                  :key="grandChild.id"
                >
                  <SidebarMenuSubButton
                    as-child
                    :is-active="isActive(grandChild.path)"
                  >
                    <RouterLink
                      :to="grandChild.path!"
                      class="flex items-center"
                    >
                      <span>{{
                        $t(grandChild.i18n_key) || grandChild.name
                      }}</span>
                    </RouterLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>

    <!-- Classic 模式：从二级菜单开始渲染（不渲染一级） -->
    <SidebarGroup v-else v-for="item in menus">
      <SidebarMenu>
        <Collapsible
          v-for="child in item.children"
          :key="child.id"
          class="group/collapsible"
          as-child
        >
          <SidebarMenuItem>
            <CollapsibleTrigger as-child>
              <SidebarMenuButton
                :tooltip="child.name"
                :is-active="isActive(child.path)"
              >
                <component :is="transformIcon(child.icon)" v-if="child.icon" />
                <RouterLink
                  v-if="!child.children?.length"
                  :to="child.path!"
                  class="flex items-center flex-1"
                >
                  {{ $t(child.i18n_key) || child.name }}
                </RouterLink>
                <span v-else class="flex-1">
                  {{ $t(child.i18n_key) || child.name }}
                </span>
                <LucideChevronRight
                  class="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                  v-if="child.children?.length"
                />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <!-- 三级菜单 -->
            <CollapsibleContent v-if="child.children?.length">
              <SidebarMenuSub>
                <SidebarMenuSubItem
                  v-for="grandChild in child.children"
                  :key="grandChild.id"
                >
                  <SidebarMenuSubButton
                    as-child
                    :is-active="isActive(grandChild.path)"
                  >
                    <RouterLink
                      :to="grandChild.path!"
                      class="flex items-center"
                    >
                      <span>{{
                        $t(grandChild.i18n_key) || grandChild.name
                      }}</span>
                    </RouterLink>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  </div>
</template>
