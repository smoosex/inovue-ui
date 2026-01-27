---
name: icon-usage
description: Icon usage guidelines
paths: src/**/*.{ts,vue}
---

# Icon Usage Guidelines

## Auto-import Collections

| Collection | Source                        | Prefix in Template     |
| ---------- | ----------------------------- | ---------------------- |
| lucide     | Lucide icons                  | `<Lucide{IconName}>`   |
| sys-icon   | `src/assets/icons/*.svg`      | `<SysIcon{IconName}>`  |
| menu-icon  | `src/assets/icons/menu/*.svg` | `<MenuIcon{IconName}>` |

## In `<template>`

No import needed:

```vue
<template>
  <LucideSearch />
  <SysIconHome />
  <MenuIconDashboard />
</template>
```

## In `<script setup>`

Import required:

```ts
import LucideSearch from "~icons/lucide/search";
import SysIconHome from "~icons/sys-icon/home";
import MenuIconDashboard from "~icons/menu-icon/dashboard";
```

## Restrictions

**Never use unplugin-icons in `src/components/`**

- You should use icon that from a public iconset
  for example:
  ```vue
  <script setup lang="ts">
  import { CircleIcon } from "lucide-vue-next";
  </script>
  ```
