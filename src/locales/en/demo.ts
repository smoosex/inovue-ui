export default {
  languages: {
    en: "English",
    zhHans: "Chinese",
  },
  hero: {
    badge: "Built on shadcn-vue",
    title: "A few practical components built on shadcn-vue",
    description: "",
    installTitle: "Install commands",
    installDescription: "",
    diagramTitle: "Table suite built on shadcn-vue",
    nodeInput: "Input base",
    nodeDependsOn: "Depends on",
    nodePrimary: "Primary shell",
    nodeAction: "Parallel action",
  },
  sections: {
    label: "Component demos",
    advancedTable:
      "Data table with selection, filters, pagination, column settings, and expandable rows.",
    smartSearchInput:
      "Search input with multi-type filters, async options, and active filter tags.",
    dateTimeRangePicker:
      "Date and time selection with presets, localized calendar behavior, and inline values.",
    advancedToolbar:
      "Toolbar actions with primary and secondary slots for management interfaces.",
  },
  advancedTable: {
    mode: "Mixed mode with pagination toggle",
    columns: {
      name: "Name",
      email: "Email",
      role: "Role",
      status: "Status",
      lastLogin: "Last Login",
    },
    filters: {
      name: "Name",
      namePlaceholder: "Search name",
      email: "Email",
      emailPlaceholder: "Search email",
      role: "Role",
      status: "Status",
      all: "All",
      roles: {
        admin: "Admin",
        editor: "Editor",
        viewer: "Viewer",
      },
      statuses: {
        enabled: "Enabled",
        disabled: "Disabled",
      },
    },
    actions: {
      add: "Add",
      edit: "Edit",
      delete: "Delete",
      enableCrossPageSelection: "Enable cross-page selection",
      disableCrossPageSelection: "Disable cross-page selection",
      showColumns: "Show column settings",
      hideColumns: "Hide column settings",
      showPagination: "Show pagination",
      hidePagination: "Hide pagination",
      refresh: "Refresh",
    },
    rows: {
      childA: "Child A",
      childB: "Child B",
    },
    logs: {
      title: "Activity",
      login: "Signed in",
      statusChange: "Updated status",
      system: "System",
    },
  },
  smartSearchInput: {
    filters: {
      name: "Name",
      namePlaceholder: "Search name",
      users: "Users (paginated)",
      status: "Status",
      priority: "Priority (includes 0)",
      roles: "Role",
      departments: "Department",
      createdAt: "Created at",
      all: "All",
      statuses: {
        enabled: "Enabled",
        disabled: "Disabled",
      },
      priorities: {
        low: "0 - Low",
        medium: "1 - Medium",
        high: "2 - High",
      },
      roleOptions: {
        admin: "Admin",
        editor: "Editor",
        viewer: "Viewer",
      },
      departmentOptions: {
        tech: "Engineering",
        frontend: "Frontend",
        backend: "Backend",
        product: "Product",
        pd: "Product Design",
        ui: "UI Design",
      },
    },
    activeFilters: "Current filters:",
    userLabel: "User {index}",
  },
  dateTimeRangePicker: {
    submit: "Submit",
    dateTime: "Date time range picker (cancel rollback)",
    dateRange: "Date range picker",
    time: "Time input",
    currentValues: "Current values:",
    labels: {
      dateTime: "Date time range",
      dateRange: "Date range",
      time: "Time",
    },
  },
  advancedToolbar: {
    actions: {
      add: "Add",
      edit: "Edit",
      delete: "Delete",
      export: "Export",
      settings: "Settings",
    },
    sampleTitle: "Usage example",
    sampleDescription:
      "The Toolbar component provides primary actions on the left and secondary actions on the right. It supports icons, labels, variants, sizes, and icon-only actions.",
  },
};
