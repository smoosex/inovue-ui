# INOVUE UI

[English](./README.md) | 中文

INOVUE UI 是一个基于 `Vue 3`、`Vite`、`Bun` 和 `shadcn-vue` 的组件仓库与演示站点，用于维护可复用组件，并输出可发布的 registry 文件。

## 组件

### AdvancedTable

高级表格组件，支持列管理、分页、筛选、行选择和展开内容。

### SmartSearchInput

智能筛选输入组件，支持多种筛选类型和组合查询。

### DateTimeRangePicker

日期与日期时间范围选择组件，适用于可复用表单场景。

### Toolbar

工具栏与操作按钮组合组件，适合列表和表格界面。

## 开发

```bash
bun install
bun run dev
bun run build
```

## Registry 构建

生成 registry 文件：

```bash
bunx --bun shadcn-vue@latest build
```
