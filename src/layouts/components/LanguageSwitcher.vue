<script setup lang="ts">
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
        <LucideLanguages class="h-5 w-5" />
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
        <LucideCheck v-if="locale === lang.value" class="h-4 w-4" />
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
