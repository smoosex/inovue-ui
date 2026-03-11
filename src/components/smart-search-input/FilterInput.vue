<script setup lang="ts">
import { computed, useAttrs } from "vue";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { GetI18nText, type Locale } from "./locales";

const attrs = useAttrs();

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  placeholder?: string;
  id?: string;
  locale?: Locale;
}>();

const $t = (key: Parameters<typeof GetI18nText>[0]) =>
  GetI18nText(key, props.locale || "en");

const inputId =
  props.id || `filter-input-${Math.random().toString(36).slice(2)}`;

const modelValue = defineModel<string>({ required: true });

const emit = defineEmits<{
  (e: "search"): void;
}>();

const inputClass = computed(() =>
  cn(
    "w-full min-w-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0",
    attrs.class as string
  )
);
</script>

<template>
  <div class="relative flex w-full min-w-0 items-center">
    <Input
      :id="inputId"
      v-model="modelValue"
      :placeholder="placeholder || $t('search')"
      :class="inputClass"
      @keyup.enter="emit('search')"
    />
  </div>
</template>
