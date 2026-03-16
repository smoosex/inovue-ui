# INOVUE UI

English | [中文](./README_zh.md)

INOVUE UI is a component workspace and demo site built with `Vue 3`, `Vite`, `Bun`, and `shadcn-vue`. It is designed for maintaining reusable components and publishing registry output for distribution.

## Components

### AdvancedTable

A feature-rich table component with column management, pagination, filtering, row selection, and expandable content.

### SmartSearchInput

A flexible filtering input that supports multiple filter types and composable search flows.

### DateTimeRangePicker

Date and date-time range picker components for reusable form scenarios.

### Toolbar

A toolbar and action composition component for list and table interfaces.

## Development

```bash
bun install
bun run dev
bun run build
```

## Registry Build

Generate registry files with:

```bash
bunx --bun shadcn-vue@latest build
```
