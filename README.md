# INOVUE UI

中文 / English

INOVUE UI 是一个基于 `Vue 3`、`Vite`、`Bun` 和 `shadcn-vue` 的组件仓库与演示站点，主要用于维护可复用组件，并输出对应的 registry 文件。

INOVUE UI is a component workspace and demo site built with `Vue 3`, `Vite`, `Bun`, and `shadcn-vue`, focused on reusable components and registry output.

## 组件 / Components

### AdvancedTable

高级表格组件，支持列管理、分页、筛选、行选择和展开内容。

Feature-rich table with column management, pagination, filtering, row selection, and expandable content.

### SmartSearchInput

智能筛选输入组件，支持多种筛选类型和组合查询。

Smart filtering input with multiple filter types and composable search flows.

### DateTimeRangePicker

日期与日期时间范围选择组件。

Date and date-time range picker components.

### Toolbar

工具栏与操作按钮组合组件。

Toolbar and action composition component.

## 开发 / Development

```bash
bun install
bun run dev
bun run build
```

## Registry Output

生成 registry 文件：

Generate registry files:

```bash
bunx --bun shadcn-vue@latest build
```
