# SmartSearchInput 组件文档

智能搜索输入组件，支持多种筛选类型、分页加载、虚拟滚动等功能。

## 目录

- [安装与导入](#安装与导入)
- [基础用法](#基础用法)
- [组件 API](#组件-api)
  - [SmartSearchInput](#smartsearchinput)
  - [ActiveFilterTags](#activefiltertags)
- [类型定义](#类型定义)
- [筛选类型详解](#筛选类型详解)
  - [text - 文本输入](#text---文本输入)
  - [select - 单选下拉](#select---单选下拉)
  - [multi-select - 多选下拉](#multi-select---多选下拉)
  - [tree-multi-select - 树形多选](#tree-multi-select---树形多选)
  - [date-time-range - 日期时间范围](#date-time-range---日期时间范围)
  - [cascade-select - 级联选择](#cascade-select---级联选择)
- [分页加载](#分页加载)
- [完整示例](#完整示例)

---

## 安装与导入

```ts
import { SmartSearchInput, ActiveFilterTags } from "@/components/smart-search-input";
import type {
  FilterOption,
  ActiveFilterItem,
  SelectOption,
  FilterValue,
  CascadeValue,
} from "@/components/smart-search-input";
```

---

## 基础用法

```vue
<script setup lang="ts">
import { ref, reactive } from "vue";
import { SmartSearchInput, ActiveFilterTags } from "@/components/smart-search-input";
import type { FilterOption, ActiveFilterItem, FilterValue } from "@/components/smart-search-input";

const filterOptions = reactive<FilterOption[]>([
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
]);

const activeFilters = ref<ActiveFilterItem[]>([]);

const handleSearch = (filter: FilterValue) => {
  console.log("搜索:", filter);
  // filter = { key: "name", value: "张三" }
};

const handleRemoveFilter = (key: string) => {
  activeFilters.value = activeFilters.value.filter((f) => f.key !== key);
};
</script>

<template>
  <SmartSearchInput
    :options="filterOptions"
    v-model:activeFilters="activeFilters"
    locale="zhHans"
    @search="handleSearch"
  />

  <ActiveFilterTags
    :filters="activeFilters"
    locale="zhHans"
    @remove="handleRemoveFilter"
    @clear-all="activeFilters = []"
  />
</template>
```

---

## 组件 API

### SmartSearchInput

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `options` | `FilterOption[]` | **必填** | 筛选选项配置 |
| `locale` | `"en" \| "zhHans"` | `"en"` | 国际化语言 |

#### v-model

| 名称 | 类型 | 说明 |
|------|------|------|
| `activeFilters` | `ActiveFilterItem[]` | 当前激活的筛选条件 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `search` | `FilterValue` | 点击搜索按钮或触发搜索时 |
| `loadMore` | `filterKey: string` | 加载更多时触发 |
| `loadChildren` | `parentId: string` | 级联选择加载子项时触发 |

---

### ActiveFilterTags

显示当前激活的筛选条件标签。

#### Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `locale` | `"en" \| "zhHans"` | `"en"` | 国际化语言 |

#### v-model

| 名称 | 类型 | 说明 |
|------|------|------|
| `filters` | `ActiveFilterItem[]` | 筛选条件列表 |

#### Events

| 事件 | 参数 | 说明 |
|------|------|------|
| `remove` | `key: string` | 移除单个筛选条件 |
| `clear-all` | - | 清除所有筛选条件 |

---

## 类型定义

### SelectOption

下拉选项类型。

```ts
type SelectOption = {
  label: string;           // 显示文本
  value: string | number;  // 选项值
  id?: string;             // 可选 ID（用于级联选择）
  children?: SelectOption[]; // 子选项（用于树形选择）
  childrenSize?: number;   // 子项数量（用于懒加载判断）
};
```

### FilterOption

筛选配置类型。

```ts
type FilterOption = {
  // 基础配置
  label: string;                    // 显示标签
  value: string;                    // 唯一键
  type?: FilterInputType;           // 输入类型，默认 "text"
  placeholder?: string;             // 占位符
  options?: SelectOption[];         // 下拉选项

  // 分页配置
  loading?: boolean;                // 加载状态
  total?: number;                   // 数据总数
  currentPage?: number;             // 当前页码
  pageSize?: number;                // 每页数量

  // 回调函数
  loadOptions?: () => Promise<void>;              // 懒加载选项
  loadMore?: () => Promise<void>;                 // 加载更多
  loadChildren?: (parentId: string) => Promise<SelectOption[]>; // 加载子项

  // 值格式化
  formatValue?: (value: any) => any;              // 格式化输出值
  formatValueAdvanced?: (value: any) => any;      // 高级搜索格式化

  // 级联选择专用
  level1Label?: string;             // 第一级标签
  level2Label?: string;             // 第二级标签
};
```

### FilterInputType

支持的输入类型。

```ts
type FilterInputType =
  | "text"              // 文本输入
  | "select"            // 单选下拉
  | "multi-select"      // 多选下拉
  | "tree-multi-select" // 树形多选
  | "date-time-range"   // 日期时间范围
  | "cascade-select";   // 级联选择
```

### FilterValue

搜索事件返回值类型。

```ts
type FilterValue<T = AnyFilterValue> = {
  key: string;   // 筛选键
  value: T;      // 筛选值
};
```

### ActiveFilterItem

激活的筛选条件类型。

```ts
type ActiveFilterItem = {
  key: string;          // 筛选键
  label: string;        // 显示标签
  value: unknown;       // 实际值
  displayValue: string; // 显示值
};
```

### CascadeValue

级联选择值类型。

```ts
type CascadeValue = {
  level1?: string;  // 第一级值
  level2?: string;  // 第二级值
};
```

---

## 筛选类型详解

### text - 文本输入

最基础的文本输入类型。

**值类型**: `string`

```ts
const filterOptions: FilterOption[] = [
  {
    label: "姓名",
    value: "name",
    type: "text",
    placeholder: "请输入姓名",
  },
  {
    label: "邮箱",
    value: "email",
    type: "text",
    placeholder: "请输入邮箱",
    formatValue: (value) => value.toLowerCase().trim(),
  },
];
```

---

### select - 单选下拉

单选下拉框，支持分页加载和虚拟滚动。

**值类型**: `string | number`

**特性**:
- 超过 50 项自动启用虚拟滚动
- 支持 `useIntersectionObserver` 自动加载更多

#### 静态选项

```ts
const filterOptions: FilterOption[] = [
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
```

#### 分页加载

```ts
const pagination = reactive({ page: 1, pageSize: 20, total: 0 });

const filterOptions = reactive<FilterOption[]>([
  {
    label: "用户",
    value: "userId",
    type: "select",
    options: [],
    loading: false,
    total: 0,
    currentPage: 1,
    pageSize: 20,
    loadOptions: async () => {
      pagination.page = 1;
      await loadUsers();
    },
    loadMore: async () => {
      if (pagination.page * pagination.pageSize >= pagination.total) return;
      pagination.page++;
      await loadUsers(true);
    },
  },
]);

const loadUsers = async (isLoadMore = false) => {
  const opt = filterOptions.find((o) => o.value === "userId")!;
  opt.loading = true;

  const { data, total } = await api.getUsers({
    page: pagination.page,
    pageSize: pagination.pageSize,
  });

  opt.options = isLoadMore ? [...(opt.options || []), ...data] : data;
  opt.total = total;
  opt.currentPage = pagination.page;
  opt.pageSize = pagination.pageSize;
  opt.loading = false;
};
```

---

### multi-select - 多选下拉

多选下拉框，支持分页加载和虚拟滚动。

**值类型**: `(string | number)[]`

**特性**:
- 超过 50 项自动启用虚拟滚动
- 支持 `useIntersectionObserver` 自动加载更多
- 选中项以 Badge 形式展示（≤3 个显示全部，>3 个显示数量）
- 内置搜索过滤
- 支持清除全部选中

```ts
const filterOptions: FilterOption[] = [
  {
    label: "角色",
    value: "roles",
    type: "multi-select",
    options: [
      { label: "管理员", value: "admin" },
      { label: "编辑", value: "editor" },
      { label: "查看者", value: "viewer" },
      { label: "访客", value: "guest" },
    ],
  },
];
```

#### 分页加载

与 `select` 类型相同，支持 `loadOptions`、`loadMore`、`total`、`currentPage`、`pageSize`、`loading` 等属性。

---

### tree-multi-select - 树形多选

树形结构的多选组件，支持父子联动。

**值类型**: `(string | number)[]`

**特性**:
- 选中父节点自动选中所有子节点
- 所有子节点选中时自动选中父节点
- 取消父节点自动取消所有子节点
- 内置搜索过滤
- 支持无限层级

```ts
const filterOptions: FilterOption[] = [
  {
    label: "部门",
    value: "departments",
    type: "tree-multi-select",
    options: [
      {
        label: "技术部",
        value: "tech",
        children: [
          { label: "前端组", value: "frontend" },
          { label: "后端组", value: "backend" },
          {
            label: "基础架构",
            value: "infra",
            children: [
              { label: "运维", value: "ops" },
              { label: "DBA", value: "dba" },
            ],
          },
        ],
      },
      {
        label: "产品部",
        value: "product",
        children: [
          { label: "产品设计", value: "pd" },
          { label: "UI设计", value: "ui" },
        ],
      },
    ],
  },
];
```

---

### date-time-range - 日期时间范围

日期时间范围选择器。

**值类型**: `{ from?: string; to?: string }`

```ts
const filterOptions: FilterOption[] = [
  {
    label: "创建时间",
    value: "createdAt",
    type: "date-time-range",
    placeholder: "选择时间范围",
  },
  {
    label: "更新时间",
    value: "updatedAt",
    type: "date-time-range",
    formatValue: (value) => ({
      startTime: value.from,
      endTime: value.to,
    }),
  },
];
```

---

### cascade-select - 级联选择

两级级联选择器，支持懒加载子项。

**值类型**: `{ level1?: string; level2?: string }`

**特性**:
- 左右两栏布局
- 支持懒加载第二级选项
- 如果第一级没有子项，选中后直接关闭

#### 静态选项

```ts
const filterOptions: FilterOption[] = [
  {
    label: "地区",
    value: "region",
    type: "cascade-select",
    level1Label: "省份",
    level2Label: "城市",
    options: [
      {
        label: "广东省",
        value: "gd",
        id: "gd",
        children: [
          { label: "广州市", value: "gz" },
          { label: "深圳市", value: "sz" },
          { label: "东莞市", value: "dg" },
        ],
      },
      {
        label: "浙江省",
        value: "zj",
        id: "zj",
        children: [
          { label: "杭州市", value: "hz" },
          { label: "宁波市", value: "nb" },
        ],
      },
    ],
  },
];
```

#### 懒加载子项

```ts
const filterOptions: FilterOption[] = [
  {
    label: "地区",
    value: "region",
    type: "cascade-select",
    level1Label: "省份",
    level2Label: "城市",
    options: [
      { label: "广东省", value: "gd", id: "440000", childrenSize: 21 },
      { label: "浙江省", value: "zj", id: "330000", childrenSize: 11 },
      { label: "北京市", value: "bj", id: "110000", childrenSize: 0 }, // 无子项
    ],
    loadChildren: async (parentId) => {
      const cities = await api.getCities(parentId);
      return cities.map((city) => ({
        label: city.name,
        value: city.code,
      }));
    },
  },
];
```

---

## 分页加载

所有下拉类型（`select`、`multi-select`）都支持分页加载。

### 配置属性

| 属性 | 类型 | 说明 |
|------|------|------|
| `loading` | `boolean` | 加载状态，显示 loading 图标 |
| `total` | `number` | 数据总数 |
| `currentPage` | `number` | 当前页码（默认 1） |
| `pageSize` | `number` | 每页数量（默认 20） |
| `loadOptions` | `() => Promise<void>` | 首次加载回调，切换到该筛选项时触发 |
| `loadMore` | `() => Promise<void>` | 加载更多回调，滚动到底部时自动触发 |

### hasMore 计算

组件内部根据 `currentPage * pageSize < total` 自动计算是否还有更多数据。

### 完整示例

```ts
const userPagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
});

const filterOptions = reactive<FilterOption[]>([
  {
    label: "用户",
    value: "userId",
    type: "select",
    options: [],
    loading: false,
    total: 0,
    currentPage: 1,
    pageSize: 20,

    loadOptions: async () => {
      userPagination.page = 1;
      await loadUsers();
    },

    loadMore: async () => {
      const hasMore =
        userPagination.page * userPagination.pageSize < userPagination.total;
      if (!hasMore) return;

      userPagination.page++;
      await loadUsers(true);
    },
  },
]);

const loadUsers = async (isLoadMore = false) => {
  const opt = filterOptions.find((o) => o.value === "userId")!;
  opt.loading = true;

  try {
    const response = await api.getUsers({
      page: userPagination.page,
      pageSize: userPagination.pageSize,
    });

    const newOptions = response.data.map((user) => ({
      label: user.name,
      value: user.id,
    }));

    if (isLoadMore) {
      opt.options = [...(opt.options || []), ...newOptions];
    } else {
      opt.options = newOptions;
    }

    userPagination.total = response.total;
    opt.total = response.total;
    opt.currentPage = userPagination.page;
    opt.pageSize = userPagination.pageSize;
  } finally {
    opt.loading = false;
  }
};
```

---

## 完整示例

```vue
<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { SmartSearchInput, ActiveFilterTags } from "@/components/smart-search-input";
import type {
  FilterOption,
  ActiveFilterItem,
  FilterValue,
  SelectOption,
} from "@/components/smart-search-input";

const { locale } = useI18n();

const tableLocale = computed(() => {
  return locale.value === "en" ? "en" : "zhHans";
});

// 用户分页状态
const userPagination = reactive({
  page: 1,
  pageSize: 20,
  total: 100,
});

// 模拟加载用户
const loadUsers = async (isLoadMore = false) => {
  const opt = filterOptions.find((o) => o.value === "userId")!;
  opt.loading = true;

  // 模拟 API 延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  const newUsers = Array.from({ length: userPagination.pageSize }, (_, i) => ({
    label: `用户 ${(userPagination.page - 1) * userPagination.pageSize + i + 1}`,
    value: `user-${(userPagination.page - 1) * userPagination.pageSize + i + 1}`,
  }));

  if (isLoadMore) {
    opt.options = [...(opt.options || []), ...newUsers];
  } else {
    opt.options = newUsers;
  }

  opt.total = userPagination.total;
  opt.currentPage = userPagination.page;
  opt.pageSize = userPagination.pageSize;
  opt.loading = false;
};

// 筛选配置
const filterOptions = reactive<FilterOption[]>([
  // 文本输入
  {
    label: "姓名",
    value: "name",
    type: "text",
    placeholder: "请输入姓名",
  },

  // 单选 - 分页加载
  {
    label: "用户",
    value: "userId",
    type: "select",
    options: [],
    loading: false,
    total: 0,
    currentPage: 1,
    pageSize: 20,
    loadOptions: async () => {
      userPagination.page = 1;
      await loadUsers();
    },
    loadMore: async () => {
      if (userPagination.page * userPagination.pageSize >= userPagination.total) return;
      userPagination.page++;
      await loadUsers(true);
    },
  },

  // 单选 - 静态选项
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

  // 多选
  {
    label: "角色",
    value: "roles",
    type: "multi-select",
    options: [
      { label: "管理员", value: "admin" },
      { label: "编辑", value: "editor" },
      { label: "查看者", value: "viewer" },
    ],
  },

  // 树形多选
  {
    label: "部门",
    value: "departments",
    type: "tree-multi-select",
    options: [
      {
        label: "技术部",
        value: "tech",
        children: [
          { label: "前端组", value: "frontend" },
          { label: "后端组", value: "backend" },
        ],
      },
      {
        label: "产品部",
        value: "product",
        children: [
          { label: "产品设计", value: "pd" },
          { label: "UI设计", value: "ui" },
        ],
      },
    ],
  },

  // 日期时间范围
  {
    label: "创建时间",
    value: "createdAt",
    type: "date-time-range",
  },

  // 级联选择
  {
    label: "地区",
    value: "region",
    type: "cascade-select",
    level1Label: "省份",
    level2Label: "城市",
    options: [
      {
        label: "广东省",
        value: "gd",
        id: "gd",
        children: [
          { label: "广州市", value: "gz" },
          { label: "深圳市", value: "sz" },
        ],
      },
      {
        label: "浙江省",
        value: "zj",
        id: "zj",
        children: [
          { label: "杭州市", value: "hz" },
          { label: "宁波市", value: "nb" },
        ],
      },
    ],
  },
]);

// 当前激活的筛选条件
const activeFilters = ref<ActiveFilterItem[]>([]);

// 搜索事件处理
const handleSearch = (filter: FilterValue) => {
  console.log("搜索:", filter);
  // 在这里调用 API 进行数据查询
};

// 移除单个筛选条件
const handleRemoveFilter = (key: string) => {
  activeFilters.value = activeFilters.value.filter((f) => f.key !== key);
  // 可以在这里重新触发搜索
};

// 清除所有筛选条件
const handleClearAll = () => {
  activeFilters.value = [];
  // 可以在这里重新触发搜索
};
</script>

<template>
  <div class="space-y-4">
    <SmartSearchInput
      :options="filterOptions"
      :locale="tableLocale"
      v-model:activeFilters="activeFilters"
      @search="handleSearch"
    />

    <ActiveFilterTags
      v-model:filters="activeFilters"
      :locale="tableLocale"
      @remove="handleRemoveFilter"
      @clear-all="handleClearAll"
    />

    <!-- 调试信息 -->
    <div class="p-4 border rounded-lg bg-muted/20">
      <h3 class="font-semibold mb-2">当前筛选条件：</h3>
      <pre class="text-sm">{{ JSON.stringify(activeFilters, null, 2) }}</pre>
    </div>
  </div>
</template>
```
