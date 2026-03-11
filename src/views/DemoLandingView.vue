<script setup lang="ts">
import { computed, ref } from "vue";
import type { Component } from "vue";
import {
  CalendarDays,
  Check,
  Copy,
  Search,
  Table2,
  Terminal,
  Wrench,
} from "lucide-vue-next";
import { APP_NAME } from "@/config/constants";
import { demoNavigation } from "@/demo/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdvancedTableView from "./AdvancedTableView.vue";
import SmartSearchInputView from "./SmartSearchInputView.vue";
import DateTimeRangePickerView from "./DateTimeRangePickerView.vue";
import AdvancedToolbarView from "./AdvancedToolbarView.vue";

const sectionComponents: Record<string, Component> = {
  AdvancedTable: AdvancedTableView,
  SmartSearchInput: SmartSearchInputView,
  DateTimeRangePicker: DateTimeRangePickerView,
  AdvancedToolbar: AdvancedToolbarView,
};

const sections = computed(() =>
  demoNavigation.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      component: sectionComponents[item.name],
      groupTitle: group.title,
    })),
  ),
);

const { t } = useI18n();

const packageManager = ref<"pnpm" | "npm" | "yarn" | "bun">("bun");
const copiedCommandKey = ref("");

const installComponents = computed(() => [
  {
    key: "advanced-table",
    label: t("menu.components.dataDisplay.advancedTable"),
    packageName: "advanced-table",
  },
  {
    key: "smart-search-input",
    label: t("menu.components.input.smartSearchInput"),
    packageName: "smart-search-input",
  },
  {
    key: "date-time-range-picker",
    label: t("menu.components.input.dateTimeRangePicker"),
    packageName: "date-time-range-picker",
  },
  {
    key: "toolbar",
    label: t("menu.components.navigation.advancedToolbar"),
    packageName: "toolbar",
  },
]);

const commandPrefixes: Record<"pnpm" | "npm" | "yarn" | "bun", string> = {
  pnpm: "pnpm dlx shadcn-vue@latest add",
  npm: "npx shadcn-vue@latest add",
  yarn: "yarn dlx shadcn-vue@latest add",
  bun: "bunx --bun shadcn-vue@latest add",
};

const getInstallCommand = (
  manager: "pnpm" | "npm" | "yarn" | "bun",
  packageName: string,
) => `${commandPrefixes[manager]} ${packageName}`;

const handleCopyCommand = async (commandKey: string, command: string) => {
  await navigator.clipboard.writeText(command);
  copiedCommandKey.value = commandKey;
  window.setTimeout(() => {
    if (copiedCommandKey.value === commandKey) {
      copiedCommandKey.value = "";
    }
  }, 1500);
};
</script>

<template>
  <div class="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
    <section
      class="glass-hero relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-8 lg:px-12 lg:py-12"
    >
      <div class="absolute inset-y-0 right-0 hidden w-1/3 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.18),_transparent_65%)] lg:block" />

      <div class="relative flex flex-col gap-8">
        <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.92fr)] lg:items-start">
          <div class="flex flex-col gap-4 lg:h-full lg:pr-4">
            <div class="hero-diagram-title">
              {{ $t("demo.hero.diagramTitle") }}
            </div>

            <div class="hero-diagram">
            <svg
              class="hero-diagram-lines"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="hero-line-gradient-a" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="hsl(var(--primary) / 0.18)" />
                  <stop offset="48%" stop-color="hsl(0 0% 100% / 0.78)" />
                  <stop offset="100%" stop-color="hsl(var(--primary) / 0.22)" />
                </linearGradient>
                <linearGradient id="hero-line-gradient-b" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="hsl(var(--primary) / 0.16)" />
                  <stop offset="52%" stop-color="hsl(0 0% 100% / 0.72)" />
                  <stop offset="100%" stop-color="hsl(var(--primary) / 0.18)" />
                </linearGradient>
              </defs>
              <path
                class="hero-diagram-path"
                d="M29 22 C 38 22, 40 36, 40 46"
                stroke="url(#hero-line-gradient-a)"
              />
              <path
                class="hero-diagram-path"
                d="M46 54 C 58 56, 64 66, 69 74"
                stroke="url(#hero-line-gradient-b)"
              />
              <path
                class="hero-diagram-path"
                d="M78 24 C 78 36, 76 52, 71 72"
                stroke="url(#hero-line-gradient-a)"
              />
            </svg>

            <a href="#date-time-range-picker" class="hero-node hero-node-range">
              <span class="hero-node-orbit" />
              <span class="hero-node-icon">
                <CalendarDays class="h-4 w-4" />
              </span>
              <span class="hero-node-kicker">{{ $t("demo.hero.nodeInput") }}</span>
              <span class="hero-node-label">{{ $t("menu.components.input.dateTimeRangePicker") }}</span>
            </a>

            <a href="#smart-search-input" class="hero-node hero-node-search">
              <span class="hero-node-orbit" />
              <span class="hero-node-icon">
                <Search class="h-4 w-4" />
              </span>
              <span class="hero-node-kicker">{{ $t("demo.hero.nodeDependsOn") }}</span>
              <span class="hero-node-label">{{ $t("menu.components.input.smartSearchInput") }}</span>
            </a>

            <a href="#advanced-table" class="hero-node hero-node-table">
              <span class="hero-node-orbit" />
              <span class="hero-node-icon">
                <Table2 class="h-5 w-5" />
              </span>
              <span class="hero-node-kicker">{{ $t("demo.hero.nodePrimary") }}</span>
              <span class="hero-node-label">{{ $t("menu.components.dataDisplay.advancedTable") }}</span>
            </a>

            <a href="#advanced-toolbar" class="hero-node hero-node-toolbar">
              <span class="hero-node-orbit" />
              <span class="hero-node-icon">
                <Wrench class="h-4 w-4" />
              </span>
              <span class="hero-node-kicker">{{ $t("demo.hero.nodeAction") }}</span>
              <span class="hero-node-label">{{ $t("menu.components.navigation.advancedToolbar") }}</span>
            </a>
            </div>
          </div>

          <div class="glass-card rounded-[1.5rem] p-5">
            <div class="flex items-center gap-2 text-sm font-medium text-foreground">
              <Terminal class="h-4 w-4" />
              {{ $t("demo.hero.installTitle") }}
            </div>
            <div
              v-if="$t('demo.hero.installDescription')"
              class="mt-2 text-sm leading-6 text-muted-foreground"
            >
              {{ $t("demo.hero.installDescription") }}
            </div>

            <Tabs
              v-model="packageManager"
              class="w-full"
              :class="$t('demo.hero.installDescription') ? 'mt-4' : 'mt-3'"
              default-value="bun"
            >
              <TabsList class="grid h-auto w-full grid-cols-4 rounded-2xl bg-white/8 p-1 dark:bg-white/6">
                <TabsTrigger
                  value="pnpm"
                  class="rounded-xl px-3 py-2 text-xs font-medium data-[state=active]:bg-white/14"
                >
                  pnpm
                </TabsTrigger>
                <TabsTrigger
                  value="npm"
                  class="rounded-xl px-3 py-2 text-xs font-medium data-[state=active]:bg-white/14"
                >
                  npm
                </TabsTrigger>
                <TabsTrigger
                  value="yarn"
                  class="rounded-xl px-3 py-2 text-xs font-medium data-[state=active]:bg-white/14"
                >
                  yarn
                </TabsTrigger>
                <TabsTrigger
                  value="bun"
                  class="rounded-xl px-3 py-2 text-xs font-medium data-[state=active]:bg-white/14"
                >
                  bun
                </TabsTrigger>
              </TabsList>

              <TabsContent
                v-for="manager in ['pnpm', 'npm', 'yarn', 'bun']"
                :key="manager"
                :value="manager"
                class="mt-4 space-y-3"
              >
                <div
                  v-for="item in installComponents"
                  :key="`${manager}-${item.key}`"
                  class="rounded-2xl border border-white/10 bg-black/20 p-3 backdrop-blur-xl"
                >
                  <div class="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    {{ item.label }}
                  </div>
                  <div class="glass-code flex items-center justify-between gap-3 rounded-xl px-3 py-3">
                    <code class="hero-command-scroll min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs leading-6 text-foreground">
                      {{ getInstallCommand(manager as 'pnpm' | 'npm' | 'yarn' | 'bun', item.packageName) }}
                    </code>
                    <Button
                      size="icon"
                      variant="ghost"
                      class="shrink-0 rounded-xl"
                      @click="handleCopyCommand(`${manager}-${item.key}`, getInstallCommand(manager as 'pnpm' | 'npm' | 'yarn' | 'bun', item.packageName))"
                    >
                      <Check
                        v-if="copiedCommandKey === `${manager}-${item.key}`"
                        class="h-4 w-4"
                      />
                      <Copy v-else class="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>

    <section id="demo-sections" class="mt-10 space-y-10 lg:mt-14">
      <div class="space-y-2">
        <div class="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          {{ $t("demo.sections.label") }}
        </div>
        <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
          {{ APP_NAME }}
        </h2>
      </div>

      <section
        v-for="item in sections"
        :id="item.id"
        :key="item.id"
        class="scroll-mt-24"
      >
        <div class="glass-card overflow-hidden rounded-[1.75rem]">
          <div class="border-b border-white/25 bg-white/20 px-5 py-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground dark:border-white/10 dark:bg-white/5">
            {{ $t(item.title) }}
          </div>
          <component :is="item.component" embedded />
        </div>
      </section>
    </section>
  </div>
</template>
