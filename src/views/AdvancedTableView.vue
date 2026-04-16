<script setup lang="ts">
import { ref, onMounted, watch, computed, watchEffect } from "vue";
import { Plus, Pencil, Trash2 } from "lucide-vue-next";
import { AdvancedTable } from "@/components/advanced-table";
import type {
  ActiveFilterItem,
  Column,
  FilterOption,
  ToolbarAction,
} from "@/components/advanced-table";
import type { DateRange } from "@/components/date-time-range-picker";
import {
  demoUsers,
  type DemoUser,
  type DemoUserRole,
  type DemoUserStatus,
} from "@/demo/fixtures/users";

const props = withDefaults(
  defineProps<{
    embedded?: boolean;
  }>(),
  {
    embedded: false,
  },
);

const { locale, t } = useI18n();

type DisplayUser = Omit<DemoUser, "role" | "status"> & {
  role: string;
  status: string;
};

type MixedRow = DisplayUser & {
  expandMode: "children" | "slot" | false;
  logs?: {
    time: string;
    action: string;
    by: string;
  }[];
  children?: DisplayUser[];
};

const tableLocale = computed(() => (locale.value === "en" ? "en" : "zhHans"));
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);
const selectedIds = ref<string[]>([]);
const selectionScope = ref<"cross-page" | "page">("cross-page");
const showColumnToggle = ref(true);
const showPagination = ref(true);
const showEmptyState = ref(false);
const loading = ref(false);
const activeFilters = ref<ActiveFilterItem[]>([]);
const pageData = ref<DemoUser[]>([]);

const columns = ref<Column[]>([
  {
    label: "ID",
    value: "id",
    show: true,
    originalIndex: 0,
    width: "80px",
  },
  {
    label: "",
    value: "name",
    show: true,
    originalIndex: 1,
  },
  {
    label: "",
    value: "email",
    show: true,
    originalIndex: 2,
  },
  {
    label: "",
    value: "role",
    show: true,
    originalIndex: 3,
    width: "120px",
  },
  {
    label: "",
    value: "status",
    show: true,
    originalIndex: 4,
    width: "100px",
    fixed: "right",
  },
  {
    label: "",
    value: "lastLogin",
    show: false,
    originalIndex: 5,
  },
]);

const roleLabels = computed<Record<DemoUserRole, string>>(() => ({
  admin: t("demo.advancedTable.filters.roles.admin"),
  editor: t("demo.advancedTable.filters.roles.editor"),
  viewer: t("demo.advancedTable.filters.roles.viewer"),
}));

const statusLabels = computed<Record<DemoUserStatus, string>>(() => ({
  enabled: t("demo.advancedTable.filters.statuses.enabled"),
  disabled: t("demo.advancedTable.filters.statuses.disabled"),
}));

watchEffect(() => {
  const labels: Record<string, string> = {
    id: "ID",
    name: t("demo.advancedTable.columns.name"),
    email: t("demo.advancedTable.columns.email"),
    role: t("demo.advancedTable.columns.role"),
    status: t("demo.advancedTable.columns.status"),
    lastLogin: t("demo.advancedTable.columns.lastLogin"),
  };

  columns.value.forEach((column) => {
    if (labels[column.value]) {
      column.label = labels[column.value]!;
    }
  });
});

const toDisplayUser = (user: DemoUser, childLabel?: string): DisplayUser => ({
  ...user,
  name: childLabel ? `${user.name} (${childLabel})` : user.name,
  role: roleLabels.value[user.role],
  status: statusLabels.value[user.status],
});

const parseDateTime = (value: string) => {
  const [datePart, timePart = "00:00"] = value.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = timePart.split(":").map(Number);

  return new Date(
    year || 0,
    (month || 1) - 1,
    day || 1,
    hours || 0,
    minutes || 0,
  );
};

const isValidDate = (value: unknown): value is Date =>
  value instanceof Date && !Number.isNaN(value.getTime());

const getStartOfDayTime = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const getEndOfDayTime = (date: Date) =>
  new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  ).getTime();

const mixedRows = computed<MixedRow[]>(() =>
  pageData.value.map((user, index) => {
    const row = toDisplayUser(user);
    const mode =
      index % 3 === 0 ? "children" : index % 3 === 1 ? "slot" : false;
    const children =
      mode === "children"
        ? [
            toDisplayUser(user, t("demo.advancedTable.rows.childA")),
            toDisplayUser(user, t("demo.advancedTable.rows.childB")),
          ]
        : [];
    const logs =
      mode === "slot"
        ? [
            {
              time: row.lastLogin,
              action: t("demo.advancedTable.logs.login"),
              by: t("demo.advancedTable.logs.system"),
            },
            {
              time: "2026-02-02 10:20",
              action: t("demo.advancedTable.logs.statusChange"),
              by: row.name,
            },
          ]
        : [];

    return { ...row, expandMode: mode, logs, children };
  }),
);

const expandModeForRow = (row: MixedRow) =>
  row.expandMode ? row.expandMode : row.children?.length ? "children" : false;

const filterOptions = computed<FilterOption[]>(() => [
  {
    label: t("demo.advancedTable.filters.name"),
    value: "name",
    type: "text",
    placeholder: t("demo.advancedTable.filters.namePlaceholder"),
  },
  {
    label: t("demo.advancedTable.filters.email"),
    value: "email",
    type: "text",
    placeholder: t("demo.advancedTable.filters.emailPlaceholder"),
  },
  {
    label: t("demo.advancedTable.filters.loginDate"),
    value: "lastLoginDate",
    type: "date",
  },
  {
    label: t("demo.advancedTable.filters.loginDateRange"),
    value: "lastLoginDateRange",
    type: "date-range",
  },
  {
    label: t("demo.advancedTable.filters.role"),
    value: "role",
    type: "select",
    options: [
      { label: t("demo.advancedTable.filters.all"), value: "all" },
      { label: t("demo.advancedTable.filters.roles.admin"), value: "admin" },
      { label: t("demo.advancedTable.filters.roles.editor"), value: "editor" },
      { label: t("demo.advancedTable.filters.roles.viewer"), value: "viewer" },
    ],
  },
  {
    label: t("demo.advancedTable.filters.status"),
    value: "status",
    type: "select",
    options: [
      { label: t("demo.advancedTable.filters.all"), value: "all" },
      {
        label: t("demo.advancedTable.filters.statuses.enabled"),
        value: "enabled",
      },
      {
        label: t("demo.advancedTable.filters.statuses.disabled"),
        value: "disabled",
      },
    ],
  },
]);

const primaryActions = computed<ToolbarAction[]>(() => [
  {
    key: "add",
    label: t("demo.advancedTable.actions.add"),
    icon: Plus,
    variant: "default",
  },
]);

const filterUsers = (users: DemoUser[]) => {
  return users.filter((user) =>
    activeFilters.value.every((filter) => {
      if (filter.value == null || filter.value === "" || filter.value === "all") {
        return true;
      }

      const loginDate = parseDateTime(user.lastLogin);

      switch (filter.key) {
        case "name":
          return user.name
            .toLowerCase()
            .includes(String(filter.value).toLowerCase());
        case "email":
          return user.email
            .toLowerCase()
            .includes(String(filter.value).toLowerCase());
        case "lastLoginDate": {
          if (!isValidDate(filter.value)) return true;
          return getStartOfDayTime(loginDate) === getStartOfDayTime(filter.value);
        }
        case "lastLoginDateRange": {
          const range = filter.value as DateRange;
          if (!isValidDate(range?.from)) return true;

          const fromTime = getStartOfDayTime(range.from);
          const toTime = isValidDate(range.to)
            ? getEndOfDayTime(range.to)
            : getEndOfDayTime(range.from);
          const currentTime = loginDate.getTime();

          return currentTime >= fromTime && currentTime <= toTime;
        }
        case "role":
          return user.role === String(filter.value);
        case "status":
          return user.status === String(filter.value);
        default:
          return true;
      }
    }),
  );
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    await new Promise((resolve) => window.setTimeout(resolve, 120));
    const filteredUsers = filterUsers(demoUsers);
    total.value = filteredUsers.length;

    const maxPage = Math.max(
      1,
      Math.ceil(filteredUsers.length / pageSize.value),
    );
    if (pageNum.value > maxPage) {
      pageNum.value = maxPage;
    }

    const start = (pageNum.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    pageData.value = filteredUsers.slice(start, end);
  } finally {
    loading.value = false;
  }
};

const secondaryActions = computed<ToolbarAction[]>(() => [
  {
    key: "edit",
    label: t("demo.advancedTable.actions.edit"),
    icon: Pencil,
    variant: "outline",
    disabled: selectedIds.value.length !== 1,
  },
  {
    key: "delete",
    label: t("demo.advancedTable.actions.delete"),
    icon: Trash2,
    variant: "destructive",
    disabled: selectedIds.value.length === 0,
  },
  {
    key: "selection-scope-toggle",
    label: selectionScope.value === "cross-page"
      ? t("demo.advancedTable.actions.disableCrossPageSelection")
      : t("demo.advancedTable.actions.enableCrossPageSelection"),
    variant: "outline",
    onClick: () => {
      selectionScope.value =
        selectionScope.value === "cross-page" ? "page" : "cross-page";
    },
  },
  {
    key: "column-toggle",
    label: showColumnToggle.value
      ? t("demo.advancedTable.actions.hideColumns")
      : t("demo.advancedTable.actions.showColumns"),
    variant: "outline",
    onClick: () => {
      showColumnToggle.value = !showColumnToggle.value;
    },
  },
  {
    key: "pagination-toggle",
    label: showPagination.value
      ? t("demo.advancedTable.actions.hidePagination")
      : t("demo.advancedTable.actions.showPagination"),
    variant: "outline",
    onClick: () => {
      showPagination.value = !showPagination.value;
    },
  },
  {
    key: "empty-state-toggle",
    label: showEmptyState.value
      ? t("demo.advancedTable.actions.hideEmptyState")
      : t("demo.advancedTable.actions.showEmptyState"),
    variant: "outline",
    onClick: () => {
      showEmptyState.value = !showEmptyState.value;
    },
  },
  {
    key: "refresh",
    label: t("demo.advancedTable.actions.refresh"),
    variant: "outline",
    onClick: fetchUsers,
  },
]);

const handleSearch = () => {
  pageNum.value = 1;
  fetchUsers();
};

const handleRemoveFilter = () => {
  pageNum.value = 1;
  fetchUsers();
};

const handleClearAllFilters = () => {
  pageNum.value = 1;
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
  <div
    class="flex flex-col space-y-2 overflow-hidden"
    :class="
      props.embedded
        ? 'h-[760px] max-h-[78vh] px-5 py-5'
        : 'flex-1 h-[760px] max-h-[78vh] px-4 py-2'
    "
  >
    <div class="text-sm font-semibold text-muted-foreground">
      {{ $t("demo.advancedTable.mode") }}
    </div>
    <div class="flex flex-1 flex-col overflow-hidden rounded-md">
      <AdvancedTable
        v-model:selected-ids="selectedIds"
        v-model:columns="columns"
        v-model:page-num="pageNum"
        v-model:page-size="pageSize"
        v-model:active-filters="activeFilters"
        :data="showEmptyState ? [] : mixedRows"
        :total="showEmptyState ? 0 : total"
        :loading="loading"
        :show-column-toggle="showColumnToggle"
        :selection-scope="selectionScope"
        :show-toolbar="true"
        :toolbar-primary-actions="primaryActions"
        :toolbar-secondary-actions="secondaryActions"
        :show-smart-search="true"
        :filter-options="filterOptions"
        :show-active-filters="true"
        :row-expand-mode="expandModeForRow"
        :show-expand="true"
        :show-pagination="showPagination"
        :locale="tableLocale"
        class="h-full min-h-0 flex-1"
        @search="handleSearch"
        @filter-remove="handleRemoveFilter"
        @filter-clear-all="handleClearAllFilters"
      >
        <template #expanded="{ row }">
          <div class="p-3 text-sm text-muted-foreground">
            <div class="mb-2 font-medium">{{ $t("demo.advancedTable.logs.title") }}</div>
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
