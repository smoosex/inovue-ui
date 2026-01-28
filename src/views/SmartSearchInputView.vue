<script setup lang="ts">
import { computed, ref } from "vue";
import { SmartSearchInput, ActiveFilterTags } from "@/components/smart-search-input";
import type { ActiveFilterItem } from "@/components/smart-search-input";

const { locale } = useI18n();

const tableLocale = computed(() => {
  return locale.value === "en" ? "en" : "zhHans";
});

const filterOptions = [
  {
    label: "姓名",
    value: "name",
    type: "text" as const,
    placeholder: "请输入姓名",
  },
  {
    label: "状态",
    value: "status",
    type: "select" as const,
    options: [
      { label: "全部", value: "all" },
      { label: "启用", value: "enabled" },
      { label: "禁用", value: "disabled" },
    ],
  },
  {
    label: "角色",
    value: "roles",
    type: "multi-select" as const,
    options: [
      { label: "管理员", value: "admin" },
      { label: "编辑", value: "editor" },
      { label: "查看", value: "viewer" },
    ],
  },
  {
    label: "创建日期",
    value: "createdAt",
    type: "date-time-range" as const,
  },
];

const activeFilters = ref<ActiveFilterItem[]>([]);

const handleSearch = (filterValue: { key: string; value: unknown }) => {
  console.log("Search triggered:", filterValue);
};

const handleRemoveFilter = (key: string) => {
  activeFilters.value = activeFilters.value.filter((f) => f.key !== key);
};
</script>

<template>
  <div class="h-screen flex flex-col p-4 pt-0">
    <div class="flex items-center justify-between shrink-0">
      <h1 class="text-2xl font-bold">
        {{ $t("menu.components.input.smartSearchInput") }}
      </h1>
    </div>

    <div class="flex-1 overflow-auto space-y-4 mt-4">
      <SmartSearchInput
        :options="filterOptions"
        :locale="tableLocale"
        v-model:activeFilters="activeFilters"
        @search="handleSearch"
      />

      <ActiveFilterTags
        :filters="activeFilters"
        @remove="handleRemoveFilter"
        @clear-all="activeFilters = []"
      />

      <!-- 选中值展示 -->
      <div class="p-4 border rounded-lg bg-muted/20">
        <h3 class="font-semibold mb-2">当前筛选条件：</h3>
        <pre class="text-sm">{{ activeFilters }}</pre>
      </div>
    </div>
  </div>
</template>
