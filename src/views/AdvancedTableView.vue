<script setup lang="ts">
import { ref, reactive, onMounted, watch, computed } from "vue";
import { Plus, Pencil, Trash2 } from "lucide-vue-next";
import { AdvancedTable } from "@/components/advanced-table";
import type {
  Column,
  FilterOption,
  ToolbarAction,
} from "@/components/advanced-table";
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
  {
    label: "ID",
    value: "id",
    show: true,
    originalIndex: 0,
    width: "80px",
  },
  {
    label: "姓名",
    value: "name",
    show: true,
    originalIndex: 1,
  },
  {
    label: "邮箱",
    value: "email",
    show: true,
    originalIndex: 2,
  },
  {
    label: "角色",
    value: "role",
    show: true,
    originalIndex: 3,
    width: "120px",
  },
  {
    label: "状态",
    value: "status",
    show: true,
    originalIndex: 4,
    width: "100px",
    fixed: "right",
  },
  {
    label: "最后登录",
    value: "lastLogin",
    show: false,
    originalIndex: 5,
  },
]);

type MixedRow = User & {
  expandMode: "children" | "slot" | false;
  logs?: { time: string; action: string; by: string }[];
  children?: User[];
};

const mixedRows = computed<MixedRow[]>(() =>
  mockData.value.map((row, index) => {
    const mode =
      index % 3 === 0 ? "children" : index % 3 === 1 ? "slot" : false;
    const children =
      mode === "children"
        ? [
            {
              ...row,
              id: `${row.id}-A`,
              name: `${row.name} (子行 A)`,
              email: row.email,
              role: row.role,
              status: row.status,
              lastLogin: row.lastLogin,
            },
            {
              ...row,
              id: `${row.id}-B`,
              name: `${row.name} (子行 B)`,
              email: row.email,
              role: row.role,
              status: row.status,
              lastLogin: row.lastLogin,
            },
          ]
        : [];
    const logs =
      mode === "slot"
        ? [
            {
              time: row.lastLogin,
              action: "登录",
              by: "系统",
            },
            {
              time: "2026-02-02 10:20",
              action: "修改状态",
              by: row.name,
            },
          ]
        : [];
    return { ...row, expandMode: mode, logs, children };
  }),
);

const expandModeForRow = (row: MixedRow) =>
  row.expandMode ? row.expandMode : row.children?.length ? "children" : false;

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
    <div class="text-sm font-semibold text-muted-foreground">
      混合模式（同一表格：子列展开 + 插槽展开 + 不可展开）
    </div>
    <div class="flex-1 overflow-hidden rounded-md flex flex-col">
      <AdvancedTable
        v-model:selected-ids="selectedIds"
        v-model:columns="columns"
        v-model:page-num="pageNum"
        v-model:page-size="pageSize"
        v-model:active-filters="activeFilters"
        :data="mixedRows"
        :total="total"
        :loading="loading"
        :show-column-toggle="showColumnToggle"
        :show-toolbar="true"
        :toolbar-primary-actions="primaryActions"
        :toolbar-secondary-actions="secondaryActions"
        :show-smart-search="true"
        :filter-options="filterOptions"
        :show-active-filters="true"
        :row-expand-mode="expandModeForRow"
        :show-expand="true"
        :locale="tableLocale"
        class="flex-1 min-h-0 h-[520px]"
        @search="handleSearch"
        @filter-remove="handleRemoveFilter"
        @filter-clear-all="handleClearAllFilters"
      >
        <template #expanded="{ row }">
          <div class="p-3 text-sm text-muted-foreground">
            <div class="mb-2 font-medium">操作记录</div>
            <div class="space-y-1">
              <div
                v-for="(log, index) in row.logs"
                :key="`${row.id}-${index}`"
                class="flex items-center gap-3"
              >
                <span class="w-36 text-xs text-muted-foreground">{{ log.time }}</span>
                <span class="flex-1">{{ log.action }}</span>
                <span class="text-xs">{{ log.by }}</span>
              </div>
            </div>
          </div>
        </template>
      </AdvancedTable>
    </div>
  </div>
</template>
