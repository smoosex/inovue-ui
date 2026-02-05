# Advanced Table

`AdvancedTable` 是一个功能丰富的数据表格组件，支持列管理、分页、筛选、行选择、固定列、自动提示，以及行展开（数据驱动/插槽/混合模式）。

## 快速开始

```vue
<script setup lang="ts">
import { ref, reactive } from "vue";
import { AdvancedTable } from "@/components/advanced-table";
import type { Column } from "@/components/advanced-table";

const data = ref([
  { id: "USR-1", name: "Amy Parker", email: "amy@example.com", role: "管理员" },
  { id: "USR-2", name: "Ken Williams", email: "ken@example.com", role: "编辑" },
]);

const columns = reactive<Column[]>([
  { label: "ID", value: "id", show: true, originalIndex: 0 },
  { label: "姓名", value: "name", show: true, originalIndex: 1 },
  { label: "邮箱", value: "email", show: true, originalIndex: 2 },
  { label: "角色", value: "role", show: true, originalIndex: 3 },
]);

const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(data.value.length);
</script>

<template>
  <AdvancedTable
    v-model:columns="columns"
    v-model:page-num="pageNum"
    v-model:page-size="pageSize"
    :data="data"
    :total="total"
  />
</template>
```

## 行展开

`AdvancedTable` 支持两种展开方式：

1. **子列展开（children）**
2. **自定义插槽展开（expanded）**

### 1. 数据驱动展开（row.children）

当行数据中存在 `children` 时，会显示展开按钮，展开后按父列定义渲染子行内容。

```ts
type Row = {
  id: string;
  name: string;
  email: string;
  role: string;
  children?: Row[];
};

const data = ref<Row[]>([
  {
    id: "USR-1",
    name: "Amy Parker",
    email: "amy@example.com",
    role: "管理员",
    children: [
      { id: "USR-1-A", name: "Amy 子行 A", email: "amy.a@example.com", role: "管理员" },
      { id: "USR-1-B", name: "Amy 子行 B", email: "amy.b@example.com", role: "管理员" },
    ],
  },
]);
```

### 2. 插槽展开（expanded）

使用 `showExpand` 打开插槽展开模式，并通过 `expanded` 插槽渲染自定义内容。

```vue
<AdvancedTable
  v-model:columns="columns"
  v-model:page-num="pageNum"
  v-model:page-size="pageSize"
  :data="data"
  :total="total"
  :show-expand="true"
>
  <template #expanded="{ row }">
    <div class="p-3 text-sm text-muted-foreground">
      <div>联系人：{{ row.name }}</div>
      <div>邮箱：{{ row.email }}</div>
    </div>
  </template>
</AdvancedTable>
```

### 3. 混合模式（同一表格内按行决定展开方式）

使用 `rowExpandMode`，按行返回 `"children" | "slot" | false`：

```ts
type Row = {
  id: string;
  name: string;
  email: string;
  role: string;
  expandMode: "children" | "slot" | false;
  children?: Row[];
  logs?: { time: string; action: string; by: string }[];
};

const rowExpandMode = (row: Row) => row.expandMode;
```

```vue
<AdvancedTable
  v-model:columns="columns"
  v-model:page-num="pageNum"
  v-model:page-size="pageSize"
  :data="data"
  :total="total"
  :show-expand="true"
  :row-expand-mode="rowExpandMode"
>
  <template #expanded="{ row }">
    <div class="p-3 text-sm text-muted-foreground">
      <div class="mb-2 font-medium">操作记录</div>
      <div v-for="(log, index) in row.logs" :key="`${row.id}-${index}`">
        {{ log.time }} - {{ log.action }}（{{ log.by }}）
      </div>
    </div>
  </template>
</AdvancedTable>
```

混合模式下的优先级：
1. 若 `rowExpandMode` 存在，按行返回的结果决定展开方式
2. 否则若行数据存在 `children` 则使用数据驱动展开
3. 否则若 `showExpand=true` 则使用插槽展开

### 4. 控制某些行不可展开

```vue
<AdvancedTable
  v-model:columns="columns"
  v-model:page-num="pageNum"
  v-model:page-size="pageSize"
  :data="data"
  :total="total"
  :show-expand="true"
  :row-expandable="(row) => row.status === '启用'"
/>
```

## Props

- `data: T[]` 表格数据
- `total: number` 总条数
- `showCheckbox?: boolean` 是否显示选择框（默认 `true`）
- `showColumnToggle?: boolean` 是否显示列设置（默认 `true`）
- `showExpand?: boolean` 是否启用插槽展开（默认 `false`）
- `rowExpandable?: (row: T) => boolean` 控制某行是否可展开
- `rowExpandMode?: (row: T) => "children" | "slot" | false` 混合模式展开策略
- `showPagination?: boolean` 是否显示分页（默认 `true`）
- `loading?: boolean` 加载状态
- `rowKey?: string` 行主键字段（默认 `id`）
- `locale?: "en" | "zhHans"` 语言（默认 `en`）
- `onReset?: () => void` 列设置重置回调
- `showToolbar?: boolean` 是否显示工具栏
- `showSmartSearch?: boolean` 是否显示高级筛选
- `showActiveFilters?: boolean` 是否显示已选筛选
- `toolbarPrimaryActions?: ToolbarAction[]` 工具栏主按钮
- `toolbarSecondaryActions?: ToolbarAction[]` 工具栏次按钮
- `filterOptions?: FilterOption[]` 高级筛选配置

## Events

- `search` 触发筛选搜索，参数为 `FilterValue`
- `filter-remove` 删除筛选项，参数为 `key`
- `filter-clear-all` 清空筛选
- `row-expand-change` 行展开切换，参数 `{ row, expanded, key }`

## Slots

- `cell` 自定义单元格内容，参数 `{ row, column, text }`
- `expanded` 自定义展开内容，参数 `{ row }`

## Column 类型（重要字段）

```ts
type Column = {
  label: string;
  value: string;
  show: boolean;
  originalIndex?: number;
  hideInSetting?: boolean;
  width?: string;
  fixed?: "left" | "right";
  lock?: boolean;
  enableAutoTooltip?: boolean;
  ellipsis?: boolean;
};
```
