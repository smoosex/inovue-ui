import type { RouteRecordRaw } from "vue-router";

const componentsRoutes: RouteRecordRaw[] = [
  {
    path: "components",
    name: "Components",
    meta: { title: "menu.components.self" },
    redirect: { name: "ComponentsDataDisplay" },
    children: [
      {
        path: "data-display",
        name: "ComponentsDataDisplay",
        meta: { title: "menu.components.dataDisplay.self" },
        redirect: { name: "AdvancedTable" },
        children: [
          {
            path: "advanced-table",
            name: "AdvancedTable",
            meta: { title: "menu.components.dataDisplay.advancedTable" },
            component: () => import("@/views/SkeletonView.vue"),
          },
          {
            path: "timeline",
            name: "Timeline",
            meta: { title: "menu.components.dataDisplay.timeline" },
            component: () => import("@/views/SkeletonView.vue"),
          },
        ],
      },
      {
        path: "input",
        name: "ComponentsInput",
        meta: { title: "menu.components.input.self" },
        redirect: { name: "SmartSearchInput" },
        children: [
          {
            path: "smart-search-input",
            name: "SmartSearchInput",
            meta: { title: "menu.components.input.smartSearchInput" },
            component: () => import("@/views/SkeletonView.vue"),
          },
          {
            path: "date-time-range-picker",
            name: "DateTimeRangePicker",
            meta: { title: "menu.components.input.dateTimeRangePicker" },
            component: () => import("@/views/SkeletonView.vue"),
          },
        ],
      },
      {
        path: "navigation",
        name: "ComponentsNavigation",
        meta: { title: "menu.components.navigation.self" },
        redirect: { name: "AdvancedToolbar" },
        children: [
          {
            path: "advanced-toolbar",
            name: "AdvancedToolbar",
            meta: { title: "menu.components.navigation.advancedToolbar" },
            component: () => import("@/views/SkeletonView.vue"),
          },
        ],
      },
    ],
  },
];

export default componentsRoutes;
