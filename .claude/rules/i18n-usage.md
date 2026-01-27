---
name: i18n-usage
description: Internationalization usage guidelines
paths: src/**/*.{ts,vue}
---

# i18n Guidelines

## In `<template>`

Use `$t()` directly without import or definition:

## In `<script setup>`

Define `const { t } = useI18n()` before use:

## Restrictions

**Do not use i18n in `src/components/`**

- Move i18n usage to views/pages or layouts
- Components should be i18n-agnostic and accept content via props
