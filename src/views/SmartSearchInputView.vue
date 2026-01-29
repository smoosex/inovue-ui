<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import { SmartSearchInput, ActiveFilterTags } from "@/components/smart-search-input";
import type { ActiveFilterItem, FilterOption } from "@/components/smart-search-input";

const { locale } = useI18n();

const tableLocale = computed(() => {
  return locale.value === "en" ? "en" : "zhHans";
});

// Mock user data generator
const generateUsers = (count: number, startIndex: number) => {
  console.log("Generating users...", count, startIndex);
  return Array.from({ length: count }, (_, i) => ({
    label: `User ${startIndex + i + 1}`,
    value: `user-${startIndex + i + 1}`,
  }));
};

const userPagination = reactive({
  page: 1,
  pageSize: 10,
  total: 50,
});

const loadUsers = async (isLoadMore = false) => {
  const userOption = filterOptions.find(o => o.value === 'users');
  if (!userOption) return;

  userOption.loading = true;

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const newUsers = generateUsers(
    userPagination.pageSize,
    (userPagination.page - 1) * userPagination.pageSize
  );

  if (isLoadMore) {
    userOption.options = [...(userOption.options || []), ...newUsers];
  } else {
    userOption.options = newUsers;
  }

  userOption.hasMore = (userOption.options?.length || 0) < userPagination.total;
  userOption.loading = false;
};

const filterOptions = reactive<FilterOption[]>([
  {
    label: "姓名",
    value: "name",
    type: "text",
    placeholder: "请输入姓名",
  },
  {
    label: "用户 (分页)",
    value: "users",
    type: "select",
    options: [],
    loading: false,
    hasMore: true,
    loadOptions: async () => {
      userPagination.page = 1;
      await loadUsers();
    },
    loadMore: async () => {
      if (userPagination.page * userPagination.pageSize >= userPagination.total) return;
      userPagination.page++;
      await loadUsers(true);
    }
  },
  {
    label: "状态",
    value: "status",
    type: "select",
    options: [
      { label: "全部", value: "all" },
      { label: "启用", value: "enabled" },
      { label: "禁用", value: "disabled" },
    ],
  },
  {
    label: "角色",
    value: "roles",
    type: "multi-select",
    options: [
      { label: "管理员", value: "admin" },
      { label: "编辑", value: "editor" },
      { label: "查看", value: "viewer" },
    ],
  },
  {
    label: "创建日期",
    value: "createdAt",
    type: "date-time-range",
  },
]);

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
