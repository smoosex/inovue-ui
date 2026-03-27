<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import { SmartSearchInput, ActiveFilterTags } from "@/components/smart-search-input";
import type { ActiveFilterItem, FilterOption } from "@/components/smart-search-input";

const props = withDefaults(
  defineProps<{
    embedded?: boolean;
  }>(),
  {
    embedded: false,
  },
);

const { locale, t } = useI18n();

const tableLocale = computed(() => (locale.value === "en" ? "en" : "zhHans"));

const generateUsers = (count: number, startIndex: number) => {
  return Array.from({ length: count }, (_, index) => ({
    label: t("demo.smartSearchInput.userLabel", {
      index: startIndex + index + 1,
    }),
    value: `user-${startIndex + index + 1}`,
  }));
};

const userPagination = reactive({
  page: 1,
  pageSize: 10,
  total: 50,
});

const userOptions = ref<{ label: string; value: string }[]>([]);
const userLoading = ref(false);
const activeFilters = ref<ActiveFilterItem[]>([]);

const loadUsers = async (isLoadMore = false) => {
  userLoading.value = true;

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const nextUsers = generateUsers(
    userPagination.pageSize,
    (userPagination.page - 1) * userPagination.pageSize,
  );

  userOptions.value = isLoadMore
    ? [...userOptions.value, ...nextUsers]
    : nextUsers;

  userLoading.value = false;
};

const filterOptions = computed<FilterOption[]>(() => [
  {
    label: t("demo.smartSearchInput.filters.name"),
    value: "name",
    type: "text",
    placeholder: t("demo.smartSearchInput.filters.namePlaceholder"),
  },
  {
    label: t("demo.smartSearchInput.filters.users"),
    value: "users",
    type: "select",
    options: userOptions.value,
    loading: userLoading.value,
    total: userPagination.total,
    currentPage: userPagination.page,
    pageSize: userPagination.pageSize,
    loadOptions: async () => {
      userPagination.page = 1;
      await loadUsers();
    },
    loadMore: async () => {
      if (userPagination.page * userPagination.pageSize >= userPagination.total) {
        return;
      }

      userPagination.page += 1;
      await loadUsers(true);
    },
  },
  {
    label: t("demo.smartSearchInput.filters.status"),
    value: "status",
    type: "select",
    options: [
      { label: t("demo.smartSearchInput.filters.all"), value: "all" },
      {
        label: t("demo.smartSearchInput.filters.statuses.enabled"),
        value: "enabled",
      },
      {
        label: t("demo.smartSearchInput.filters.statuses.disabled"),
        value: "disabled",
      },
    ],
  },
  {
    label: t("demo.smartSearchInput.filters.priority"),
    value: "priority",
    type: "select",
    options: [
      {
        label: t("demo.smartSearchInput.filters.priorities.low"),
        value: 0,
      },
      {
        label: t("demo.smartSearchInput.filters.priorities.medium"),
        value: 1,
      },
      {
        label: t("demo.smartSearchInput.filters.priorities.high"),
        value: 2,
      },
    ],
  },
  {
    label: t("demo.smartSearchInput.filters.roles"),
    value: "roles",
    type: "multi-select",
    options: [
      {
        label: t("demo.smartSearchInput.filters.roleOptions.admin"),
        value: "admin",
      },
      {
        label: t("demo.smartSearchInput.filters.roleOptions.editor"),
        value: "editor",
      },
      {
        label: t("demo.smartSearchInput.filters.roleOptions.viewer"),
        value: "viewer",
      },
    ],
  },
  {
    label: t("demo.smartSearchInput.filters.departments"),
    value: "departments",
    type: "tree-multi-select",
    options: [
      {
        label: t("demo.smartSearchInput.filters.departmentOptions.tech"),
        value: "tech",
        children: [
          {
            label: t("demo.smartSearchInput.filters.departmentOptions.frontend"),
            value: "frontend",
          },
          {
            label: t("demo.smartSearchInput.filters.departmentOptions.backend"),
            value: "backend",
          },
        ],
      },
      {
        label: t("demo.smartSearchInput.filters.departmentOptions.product"),
        value: "product",
        children: [
          {
            label: t("demo.smartSearchInput.filters.departmentOptions.pd"),
            value: "pd",
          },
          {
            label: t("demo.smartSearchInput.filters.departmentOptions.ui"),
            value: "ui",
          },
        ],
      },
    ],
  },
  {
    label: t("demo.smartSearchInput.filters.date"),
    value: "date",
    type: "date",
  },
  {
    label: t("demo.smartSearchInput.filters.dateRange"),
    value: "dateRange",
    type: "date-range",
  },
  {
    label: t("demo.smartSearchInput.filters.createdAt"),
    value: "createdAt",
    type: "date-time-range",
  },
]);

const handleSearch = () => {};

const handleRemoveFilter = (key: string) => {
  activeFilters.value = activeFilters.value.filter((filter) => filter.key !== key);
};
</script>

<template>
  <div
    class="flex min-h-0 flex-col"
    :class="props.embedded ? 'p-5' : 'h-full p-4'"
  >
    <div v-if="!props.embedded" class="flex items-center justify-between shrink-0">
      <h1 class="text-2xl font-bold">
        {{ $t("menu.components.input.smartSearchInput") }}
      </h1>
    </div>

    <div class="flex-1 space-y-4 overflow-auto" :class="props.embedded ? '' : 'mt-4'">
      <SmartSearchInput
        v-model:activeFilters="activeFilters"
        :options="filterOptions"
        :locale="tableLocale"
        @search="handleSearch"
      />

      <ActiveFilterTags
        :filters="activeFilters"
        @remove="handleRemoveFilter"
        @clear-all="activeFilters = []"
      />

      <div class="rounded-lg border bg-muted/20 p-4">
        <h3 class="mb-2 font-semibold">{{ $t("demo.smartSearchInput.activeFilters") }}</h3>
        <pre class="text-sm">{{ activeFilters }}</pre>
      </div>
    </div>
  </div>
</template>
