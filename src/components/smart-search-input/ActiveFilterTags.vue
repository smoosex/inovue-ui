<script setup lang="ts">
import { X } from "lucide-vue-next";
import type { ActiveFilterItem } from "./types";
import { GetI18nText, type Locale } from "./locales";

const props = withDefaults(
  defineProps<{
    locale?: Locale;
  }>(),
  {
    locale: "en",
  },
);

const filters = defineModel<ActiveFilterItem[]>("filters", { required: true });

const emit = defineEmits<{
  (e: "remove", key: string): void;
  (e: "clear-all"): void;
}>();

const $t = (key: Parameters<typeof GetI18nText>[0]) =>
  GetI18nText(key, props.locale);

const handleRemove = (key: string) => {
  filters.value = filters.value.filter((f) => f.key !== key);
  emit("remove", key);
};

const handleClearAll = () => {
  filters.value = [];
  emit("clear-all");
};
</script>

<template>
  <div v-if="filters.length" class="flex flex-wrap gap-2 items-center">
    <span class="text-sm text-muted-foreground">{{ $t("filterTag") }}</span>
    <div
      v-for="item in filters"
      :key="item.key"
      class="flex items-center gap-1 px-2 py-1 text-sm bg-muted rounded-md"
    >
      <span class="truncate max-w-40"
        >{{ item.label }}: {{ item.displayValue }}</span
      >
      <button
        class="hover:bg-muted-foreground/20 rounded p-0.5"
        @click="handleRemove(item.key)"
      >
        <X class="h-3 w-3" />
      </button>
    </div>
    <button
      class="text-xs text-muted-foreground hover:text-foreground"
      @click="handleClearAll"
    >
      {{ $t("clearAll") }}
    </button>
  </div>
</template>
