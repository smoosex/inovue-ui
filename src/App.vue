<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import { APP_NAME } from "@/config/constants";
import { demoNavigation } from "@/demo/navigation";
import DarkModeSwitcher from "@/layouts/components/DarkModeSwitcher.vue";
import LanguageSwitcher from "@/layouts/components/LanguageSwitcher.vue";
import DemoLandingView from "@/views/DemoLandingView.vue";
import "vue-sonner/style.css";

const navItems = computed(() => demoNavigation.flatMap((group) => group.items));

onMounted(() => {
  document.documentElement.classList.add("layout-frosted");
});

onUnmounted(() => {
  document.documentElement.classList.remove("layout-frosted");
});
</script>

<template>
  <TooltipProvider>
    <div class="min-h-screen">
      <header class="fixed inset-x-0 top-4 z-50 px-4 sm:px-6 lg:px-8">
        <div class="glass-nav mx-auto flex max-w-7xl items-center gap-4 rounded-[1.75rem] px-5 py-3 sm:px-6">
          <a
            href="#top"
            class="flex shrink-0 items-center gap-3 text-sm font-semibold tracking-[0.02em] text-foreground"
          >
            <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
              <span class="h-3 w-3 rotate-45 rounded-[0.2rem] bg-current" />
            </span>
            <span>{{ APP_NAME }}</span>
          </a>

          <nav class="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
            <a
              v-for="item in navItems"
              :key="item.id"
              :href="`#${item.id}`"
              class="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/8 hover:text-foreground dark:hover:bg-white/6"
            >
              {{ $t(item.title) }}
            </a>
          </nav>

          <div class="ml-auto flex shrink-0 items-center gap-2">
            <a
              href="https://github.com/smoosex/inovue-ui"
              target="_blank"
              rel="noreferrer"
              class="hidden rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            >
              GitHub
            </a>
            <div class="flex items-center gap-1 rounded-full border border-white/10 bg-white/6 px-1.5 py-1 dark:bg-white/4">
              <DarkModeSwitcher />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      <div id="top" class="pt-24 sm:pt-28">
        <DemoLandingView />
      </div>
    </div>
    <Toaster position="top-right" />
  </TooltipProvider>
</template>
