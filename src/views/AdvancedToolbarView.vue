<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { Toolbar } from "@/components/toolbar";
import type { ToolbarAction } from "@/components/toolbar";
import {
  LucidePlus,
  LucideEdit,
  LucideTrash2,
  LucideDownload,
  LucideSettings,
} from "@lucide/vue";

const props = withDefaults(
  defineProps<{
    embedded?: boolean;
  }>(),
  {
    embedded: false,
  },
);

const { t } = useI18n();

const primaryActions = computed<ToolbarAction[]>(() => [
  {
    key: "add",
    label: t("demo.advancedToolbar.actions.add"),
    icon: LucidePlus,
    variant: "default",
    onClick: () => {},
  },
  {
    key: "edit",
    label: t("demo.advancedToolbar.actions.edit"),
    icon: LucideEdit,
    variant: "outline",
    onClick: () => {},
    show: true,
  },
  {
    key: "delete",
    label: t("demo.advancedToolbar.actions.delete"),
    icon: LucideTrash2,
    variant: "destructive",
    onClick: () => {},
    show: true,
  },
]);

const secondaryActions = computed<ToolbarAction[]>(() => [
  {
    key: "export",
    label: t("demo.advancedToolbar.actions.export"),
    icon: LucideDownload,
    variant: "outline",
    onClick: () => {},
    isIconOnly: false,
  },
  {
    key: "settings",
    tooltip: t("demo.advancedToolbar.actions.settings"),
    icon: LucideSettings,
    variant: "ghost",
    onClick: () => {},
    isIconOnly: true,
  },
]);
</script>

<template>
  <div
    class="flex min-h-0 flex-col"
    :class="props.embedded ? 'p-5' : 'h-full p-4'"
  >
    <div v-if="!props.embedded" class="flex items-center justify-between shrink-0">
      <h1 class="text-2xl font-bold">
        {{ $t("menu.components.navigation.advancedToolbar") }}
      </h1>
    </div>

    <Toolbar
      :primary-actions="primaryActions"
      :secondary-actions="secondaryActions"
      :class="props.embedded ? '' : 'mt-4'"
    />
  </div>
</template>
