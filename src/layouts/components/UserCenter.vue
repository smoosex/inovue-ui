<script setup lang="ts">
import { toast } from "vue-sonner";

const props = withDefaults(
  defineProps<{
    layout?: "classic" | "frosted" | "modern";
  }>(),
  {
    layout: "classic",
  },
);

const authStore = useAuthStore();
const router = useRouter();
const { t } = useI18n();

const avatarFallback = computed(
  () => authStore.name?.charAt(0) ?? authStore.name ?? "U",
);

const handleLogout = async () => {
  authStore.clearAuth();
  toast.success(t("auth.logout.success"));
  router.push({ name: "Login" });
};
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="authStore.avatar" :alt="authStore.name" />
              <AvatarFallback class="rounded-lg">
                {{ avatarFallback }}
              </AvatarFallback>
            </Avatar>
            <div
              v-if="layout === 'modern'"
              class="grid flex-1 text-left text-sm leading-tight"
            >
              <span class="truncate font-medium">{{ authStore.name }}</span>
              <span class="truncate text-xs">{{ authStore.role }}</span>
            </div>
            <LucideChevronsUpDown
              v-if="layout === 'modern'"
              class="ml-auto size-4"
            />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
          align="end"
          :side-offset="4"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="authStore.avatar" :alt="authStore.name" />
                <AvatarFallback class="rounded-lg">
                  {{ avatarFallback }}
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ authStore.name }}</span>
                <span class="truncate text-xs">{{ authStore.role }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="text-destructive" @click="handleLogout">
            <LucideLogOut class="mr-2 h-4 w-4" />
            {{ $t("auth.logout.self") }}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
</template>
