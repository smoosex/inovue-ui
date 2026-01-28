<script setup lang="ts">
import { ref, computed } from "vue";
import { format } from "date-fns";
import { SmartSearchInput } from "@/components/smart-search-input";
import { ActiveFilterTags } from "@/components/smart-search-input";
import type {
  FilterOption,
  FilterValue,
  AnyFilterValue,
  ActiveFilterItem,
} from "@/components/smart-search-input";
import { Button } from "@/components/ui/button";

const { locale } = useI18n();

const tableLocale = computed(() => {
  return locale.value === "en" ? "en" : "zhHans";
});

const searchValue = ref<AnyFilterValue>();
const activeFilters = ref<ActiveFilterItem[]>([]);

const filterOptions: FilterOption[] = [
  {
    label: "姓名",
    value: "name",
    type: "text",
    placeholder: "请输入姓名",
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
];

const handleSearch = (filterValue: FilterValue) => {
  searchValue.value = filterValue.value;
  const option = filterOptions.find((o) => o.value === filterValue.key);
  if (option) {
    let displayValue: string;
    const value = filterValue.value as any;

    if (value && typeof value === "object") {
      // 日期范围
      if ("from" in value && "to" in value) {
        const from = value.from ? new Date(value.from) : null;
        const to = value.to ? new Date(value.to) : null;
        if (from && to) {
          displayValue = `${format(from, "yyyy-MM-dd")} ~ ${format(to, "yyyy-MM-dd")}`;
        } else if (from) {
          displayValue = `从 ${format(from, "yyyy-MM-dd")}`;
        } else if (to) {
          displayValue = `至 ${format(to, "yyyy-MM-dd")}`;
        } else {
          displayValue = "未选择";
        }
      } else {
        displayValue = JSON.stringify(value);
      }
    } else if (Array.isArray(value)) {
      displayValue = value.length > 0 ? `${value.length}项` : "";
    } else {
      displayValue = String(value);
    }

    if (displayValue && displayValue !== "未选择") {
      // 移除已存在的同key筛选，添加新的
      activeFilters.value = activeFilters.value.filter((f) => f.key !== filterValue.key);
      activeFilters.value.push({
        key: filterValue.key,
        label: option.label,
        value: filterValue.value,
        displayValue,
      });
    }
  }
  // 这里可以执行其他副作用（如发起搜索请求）
  console.log("Search triggered with filters:", activeFilters.value);
};
</script>

<template>
  <div class="h-screen flex flex-col p-4 pt-0">
    <div class="flex items-center justify-between shrink-0">
      <h1 class="text-2xl font-bold">
        {{ $t("menu.components.input.smartSearchInput") }}
      </h1>
      <Button variant="outline" size="sm" @click="handleSearch">
        搜索
      </Button>
    </div>

    <div class="flex-1 overflow-auto space-y-8 mt-4">
      <!-- SmartSearchInput -->
      <div class="space-y-2">
        <h2 class="text-lg font-semibold">智能搜索输入</h2>
        <SmartSearchInput
          v-model="searchValue"
          :options="filterOptions"
          :locale="tableLocale"
          @search="handleSearch"
        />

        <ActiveFilterTags
          :filters="activeFilters"
          @remove="(key) => (activeFilters = activeFilters.filter((f) => f.key !== key))"
          @clear-all="activeFilters = []"
        />
      </div>

      <!-- 选中值展示 -->
      <div class="p-4 border rounded-lg bg-muted/20">
        <h3 class="font-semibold mb-2">当前选中值：</h3>
        <pre class="text-sm">{{ searchValue }}</pre>
      </div>

      <!-- 说明 -->
      <div class="p-4 border rounded-lg bg-muted/20 space-y-2">
        <h3 class="font-semibold">使用说明</h3>
        <ul class="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>点击输入框展开筛选条件</li>
          <li>支持文本输入、下拉选择、多选、日期范围等类型</li>
          <li>点击右侧搜索图标执行搜索</li>
        </ul>
      </div>
    </div>
  </div>
</template>
