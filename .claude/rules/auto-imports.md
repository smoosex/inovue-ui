---
name: auto-imports
description: Auto-import usage guidelines
paths: src/**/*.{ts,vue}
---

# Auto-import Guidelines

Use auto-import for all cases except manual import scenarios.

Auto-import available for:

| Source | Examples |
| ------ | -------- |
| Vue APIs | `ref`, `computed`, `watch`, `onMounted` |
| vue-router | `useRoute`, `useRouter`, `createRouter` |
| pinia | `defineStore`, `storeToRefs` |
| vue-i18n | `useI18n` |
| `src/stores/**` | `useThemeStore`, `useAuthStore` |
| `src/components/**` | `Button`, `Dialog`, `Input` |

# Manual Import Required

## 1. Inside `src/components/`

All files under `src/components/` must manually import all dependencies.

## 2. Type Definitions

Type definitions must be manually imported.
