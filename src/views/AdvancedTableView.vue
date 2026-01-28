<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue";
import { Plus, Pencil, Trash2 } from "lucide-vue-next";
import { AdvancedTable } from "@/components/advanced-table";
import type { Column, FilterOption, ToolbarAction } from "@/components/advanced-table";
import { GetUsersApi, type User } from "@/features/users/api";

const { locale } = useI18n();

const tableLocale = computed(() => (locale.value === "en" ? "en" : "zhHans"));

const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);
const selectedIds = ref<string[]>([]);
const showColumnToggle = ref(true);
const loading = ref(false);

const activeFilters = ref<{ key: string; label: string; value: any; displayValue: string }[]>([]);

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

const handleSearch = () => {
  fetchUsers();
};

const handleRemoveFilter = () => {
  fetchUsers();
};

const handleClearAllFilters = () => {
  fetchUsers();
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
    <!-- Content -->
    <div class="flex-1 overflow-hidden rounded-md flex flex-col">
      <AdvancedTable
        v-model:selected-ids="selectedIds"
        v-model:columns="columns"
        v-model:page-num="pageNum"
        v-model:page-size="pageSize"
        v-model:active-filters="activeFilters"
        :data="mockData"
        :total="total"
        :loading="loading"
        :show-column-toggle="showColumnToggle"
        :show-toolbar="true"
        :toolbar-primary-actions="primaryActions"
        :toolbar-secondary-actions="secondaryActions"
        :show-smart-search="true"
        :filter-options="filterOptions"
        :show-active-filters="true"
        :locale="tableLocale"
        @search="handleSearch"
        @filter-remove="handleRemoveFilter"
        @filter-clear-all="handleClearAllFilters"
        class="flex-1 min-h-0"
      />
    </div>
  </div>
</template>
