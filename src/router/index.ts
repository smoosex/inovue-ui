import { createWebHistory, createRouter } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import componentsRoutes from "./routes/components";

const routes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/LoginView.vue"),
  },
  {
    path: "/",
    redirect: { name: "Dashboard" },
    component: DefaultLayout,
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        meta: {
          title: "menu.dashboard.self",
        },
        redirect: { name: "DashboardOverview" },
        children: [
          {
            path: "overview",
            name: "DashboardOverview",
            meta: {
              title: "menu.dashboard.overview",
            },
            component: () => import("@/views/SkeletonView.vue"),
          },
        ],
      },
      ...componentsRoutes,
      {
        path: "about",
        name: "About",
        meta: {
          title: "menu.about.self",
        },
        redirect: { name: "AboutTeam" },
        children: [
          {
            path: "team",
            name: "AboutTeam",
            meta: {
              title: "menu.about.team",
            },
            component: () => import("@/views/SkeletonView.vue"),
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
