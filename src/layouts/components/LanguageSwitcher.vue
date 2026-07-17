<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { Check, Languages } from "@lucide/vue";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const { locale, t } = useI18n();

const languages = computed(() => [
  { value: "en", label: t("demo.languages.en") },
  { value: "zhHans", label: t("demo.languages.zhHans") },
] as const);

const setLanguage = (lang: "en" | "zhHans") => {
  locale.value = lang;
  localStorage.setItem("user-locale", lang);
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" size="icon">
        <Languages class="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem
        v-for="lang in languages"
        :key="lang.value"
        @click="setLanguage(lang.value)"
        class="flex items-center justify-between gap-2"
      >
        <span>{{ lang.label }}</span>
        <Check v-if="locale === lang.value" class="h-4 w-4" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
