export type DemoNavItem = {
  name: string;
  id: string;
  title: string;
  description: string;
};

export type DemoNavGroup = {
  title: string;
  items: DemoNavItem[];
};

export const demoNavigation: DemoNavGroup[] = [
  {
    title: "menu.components.dataDisplay.self",
    items: [
      {
        name: "AdvancedTable",
        id: "advanced-table",
        title: "menu.components.dataDisplay.advancedTable",
        description: "demo.sections.advancedTable",
      },
    ],
  },
  {
    title: "menu.components.input.self",
    items: [
      {
        name: "SmartSearchInput",
        id: "smart-search-input",
        title: "menu.components.input.smartSearchInput",
        description: "demo.sections.smartSearchInput",
      },
      {
        name: "DateTimeRangePicker",
        id: "date-time-range-picker",
        title: "menu.components.input.dateTimeRangePicker",
        description: "demo.sections.dateTimeRangePicker",
      },
    ],
  },
  {
    title: "menu.components.navigation.self",
    items: [
      {
        name: "AdvancedToolbar",
        id: "advanced-toolbar",
        title: "menu.components.navigation.advancedToolbar",
        description: "demo.sections.advancedToolbar",
      },
    ],
  },
];
