import type { MenuItem } from "@/api/menu";

export const MenuData: MenuItem[] = [
  {
    id: "1",
    icon: "Dashboard",
    path: "/dashboard",
    name: "Dashboard",
    i18n_key: "menu.dashboard.self",
    show: true,
    children: [
      {
        id: "1-1",
        icon: "Overview",
        path: "/dashboard/overview",
        name: "Overview",
        i18n_key: "menu.dashboard.overview",
        show: true,
      },
    ],
  },
  {
    id: "2",
    icon: "Components",
    path: "/components",
    name: "Components",
    i18n_key: "menu.components.self",
    show: true,
    children: [
      {
        id: "2-1",
        icon: "DataDisplay",
        name: "Data Display",
        i18n_key: "menu.components.dataDisplay.self",
        show: true,
        children: [
          {
            id: "2-1-1",
            path: "/components/data-display/advanced-table",
            name: "AdvancedTable",
            i18n_key: "menu.components.dataDisplay.advancedTable",
            show: true,
          },
          {
            id: "2-1-2",
            path: "/components/data-display/timeline",
            name: "Timeline",
            i18n_key: "menu.components.dataDisplay.timeline",
            show: true,
          },
        ],
      },
      {
        id: "2-2",
        icon: "Input",
        name: "Input",
        i18n_key: "menu.components.input.self",
        show: true,
        children: [
          {
            id: "2-2-1",
            path: "/components/input/smart-search-input",
            name: "SmartSearchInput",
            i18n_key: "menu.components.input.smartSearchInput",
            show: true,
          },
          {
            id: "2-2-2",
            path: "/components/input/date-time-range-picker",
            name: "DateTimeRangePicker",
            i18n_key: "menu.components.input.dateTimeRangePicker",
            show: true,
          },
        ],
      },
      {
        id: "2-3",
        icon: "Navigation",
        name: "Navigation",
        i18n_key: "menu.components.navigation.self",
        show: true,
        children: [
          {
            id: "2-3-1",
            path: "/components/navigation/advanced-toolbar",
            name: "AdvancedToolbar",
            i18n_key: "menu.components.navigation.advancedToolbar",
            show: true,
          },
        ],
      },
    ],
  },
  {
    id: "3",
    icon: "About",
    path: "/about",
    name: "About",
    i18n_key: "menu.about.self",
    show: true,
    children: [
      {
        id: "3-1",
        icon: "Team",
        path: "/about/team",
        name: "Team",
        i18n_key: "menu.about.team",
        show: true,
      },
    ],
  },
];
