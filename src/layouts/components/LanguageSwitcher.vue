<script setup lang="ts">
const { locale } = useI18n();

const languages = [
  { value: "en", label: "English" },
  { value: "zhHans", label: "中文" },
] as const;

const setLanguage = (lang: (typeof languages)[number]["value"]) => {
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
