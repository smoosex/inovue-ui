---
name: feature-architecture
description: Feature-based code organization
paths: src/features/**/*, src/views/**/*
---

# Feature-Based Architecture

## Directory Structure

```
src/
├── features/           # Business logic modules
│   └── {feature}/
│       ├── api.ts           # API functions
│       ├── components/      # Feature-specific components
│       ├── composables/     # Composables
│       ├── index.ts         # Exports
│       └── types.ts         # Type definitions
│
├── views/              # Page components
│   └── {feature}/      # Optional, if only one page for feature
│       └── PageView.vue
```

## Rules

- **features/**: Contains business logic (API, components, composables, types)
- **views/**: Page skeletons that compose features
- Each feature should have an `index.ts` for exports
- Page views are named `{Feature}View.vue`
