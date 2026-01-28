<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue";
import { format } from "date-fns";
import { Plus, Pencil, Trash2 } from "lucide-vue-next";
import { AdvancedTable } from "@/components/advanced-table";
import type { Column } from "@/components/advanced-table";
import { AdvancedToolbar } from "@/components/advanced-toolbar";
import type { ToolbarAction } from "@/components/advanced-toolbar";
import {
  SmartSearchInput,
  ActiveFilterTags,
} from "@/components/smart-search-input";
import type {
  FilterOption,
  FilterValue,
  AnyFilterValue,
  ActiveFilterItem,
} from "@/components/smart-search-input";
import { GetUsersApi, type User } from "@/features/users/api";

const { locale } = useI18n();

const tableLocale = computed(() => (locale.value === "en" ? "en" : "zhHans"));

const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);
const selectedIds = ref<string[]>([]);
const showColumnToggle = ref(true);
const loading = ref(false);

const searchValue = ref<AnyFilterValue>();
const activeFilters = ref<ActiveFilterItem[]>([]);

const columns = reactive<Column[]>([
  { label: "ID", value: "id", show: true, originalIndex: 0, width: "80px" },
  { label: "姓名", value: "name", show: true, originalIndex: 1 },
  { label: "邮箱", value: "email", show: true, originalIndex: 2 },
  { label: "角色", value: "role", show: true, originalIndex: 3 },
  { label: "状态", value: "status", show: true, originalIndex: 4 },
  { label: "最后登录", value: "lastLogin", show: false, originalIndex: 5 },
]);

const filterOptions: FilterOption[] = [
  { label: "姓名", value: "name", type: "text", placeholder: "请输入姓名" },
  { label: "邮箱", value: "email", type: "text", placeholder: "请输入邮箱" },
  {
    label: "角色",
    value: "role",
    type: "select",
    options: [
      { label: "全部", value: "all" },
      { label: "管理员", value: "admin" },
      { label: "编辑", value: "editor" },
      { label: "查看", value: "viewer" },
    ],
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
];

const primaryActions: ToolbarAction[] = [
  {
    key: "add",
    label: "新增",
    icon: Plus,
    variant: "default",
  },
];

const mockData = ref<User[]>([]);

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await GetUsersApi({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
    });
    mockData.value = res.data.list;
    total.value = res.data.total;
  } finally {
    loading.value = false;
  }
};

const secondaryActions: ToolbarAction[] = [
  {
    key: "edit",
    label: "编辑",
    icon: Pencil,
    variant: "outline",
    disabled: computed(() => selectedIds.value.length !== 1).value,
  },
  {
    key: "delete",
    label: "删除",
    icon: Trash2,
    variant: "destructive",
    disabled: computed(() => selectedIds.value.length === 0).value,
  },
  {
    key: "column-toggle",
    label: computed(() =>
      showColumnToggle.value ? "隐藏列设置" : "显示列设置",
    ).value,
    variant: "outline",
    onClick: () => {
      showColumnToggle.value = !showColumnToggle.value;
    },
  },
  {
    key: "refresh",
    label: "刷新",
    variant: "outline",
    onClick: fetchUsers,
  },
];

const formatFilterValue = (value: any): string => {
  if (value && typeof value === "object") {
    if ("from" in value && "to" in value) {
      const from = value.from ? new Date(value.from) : null;
      const to = value.to ? new Date(value.to) : null;
      if (from && to) {
        return `${format(from, "yyyy-MM-dd")} ~ ${format(to, "yyyy-MM-dd")}`;
      } else if (from) {
        return `从 ${format(from, "yyyy-MM-dd")}`;
      } else if (to) {
        return `至 ${format(to, "yyyy-MM-dd")}`;
      }
    }
    return JSON.stringify(value);
  } else if (Array.isArray(value)) {
    return value.length > 0 ? `${value.length}项` : "";
  }
  return String(value);
};

const handleSearch = (filterValue: FilterValue) => {
  searchValue.value = filterValue.value;
  const option = filterOptions.find((o) => o.value === filterValue.key);
  if (option) {
    const displayValue = formatFilterValue(filterValue.value);
    if (displayValue && displayValue !== "未选择") {
      activeFilters.value = activeFilters.value.filter(
        (f) => f.key !== filterValue.key,
      );
      activeFilters.value.push({
        key: filterValue.key,
        label: option.label,
        value: filterValue.value,
        displayValue,
      });
    }
  }
  fetchUsers();
};

const handleRemoveFilter = () => {
  fetchUsers();
};

const handleClearAllFilters = () => {
  fetchUsers();
};

const handleRemoveFilterTag = () => {
  handleRemoveFilter();
};

watch([pageNum, pageSize], () => {
  fetchUsers();
});

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="flex flex-col flex-1 h-full space-y-2 overflow-hidden px-4 py-2">
    <!-- Toolbar with SmartSearchInput on the right side -->
    <AdvancedToolbar
      :primary-actions="primaryActions"
      :secondary-actions="secondaryActions"
    >
      <SmartSearchInput
        v-model="searchValue"
        v-model:active-filters="activeFilters"
        :options="filterOptions"
        :locale="tableLocale"
        @search="handleSearch"
      />
    </AdvancedToolbar>

    <!-- Active Filters (below toolbar) -->
    <ActiveFilterTags
      :filters="activeFilters"
      :locale="tableLocale"
      @remove="handleRemoveFilterTag"
      @clear-all="
        activeFilters = [];
        handleClearAllFilters();
      "
    />

    <!-- Content -->
    <div class="flex-1 overflow-hidden rounded-md flex flex-col">
      <AdvancedTable
        v-model:selected-ids="selectedIds"
        v-model:columns="columns"
        v-model:page-num="pageNum"
        v-model:page-size="pageSize"
        :data="mockData"
        :total="total"
        :loading="loading"
        :show-column-toggle="showColumnToggle"
        :locale="tableLocale"
        class="flex-1 min-h-0"
        @reset="fetchUsers"
      />
    </div>
  </div>
</template>
