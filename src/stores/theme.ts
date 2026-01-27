import LucideMonitor from "~icons/lucide/monitor";
import LucideSparkles from "~icons/lucide/sparkles";
import LucideLayoutGrid from "~icons/lucide/layout-grid";
import { useDark, useToggle } from "@vueuse/core";

const THEME_KEY = "app-theme";

export type Theme =
  | "amethyst"
  | "bubblegum"
  | "catppuccin"
  | "claude"
  | "pastle-dreams"

export type ThemeOption = {
  label: string;
  value: Theme;
  color: string;
};

export const themes = [
  { label: "Amethyst", value: "amethyst" as const, color: "#a855f7" },
  { label: "Bubblegum", value: "bubblegum" as const, color: "#f9a8d4" },
  { label: "Catppuccin", value: "catppuccin" as const, color: "#f9a8d4" },
  { label: "Claude", value: "claude" as const, color: "#d97757" },
  { label: "Pastle Dreams", value: "pastle-dreams" as const, color: "#a78bfb" },
];

export type Layout = "classic" | "frosted" | "modern";

export type LayoutOption = {
  label: string;
  value: Layout;
  icon: Component;
};

export const layouts: LayoutOption[] = [
  { label: "Classic", value: "classic", icon: LucideMonitor },
  { label: "Frosted", value: "frosted", icon: LucideSparkles },
  { label: "Modern", value: "modern", icon: LucideLayoutGrid },
];

export const useThemeStore = defineStore(
  "theme",
  () => {
    const theme = ref<Theme>("claude");
    const layout = ref<Layout>("classic");
    const isDark = useDark();

    const root = document.documentElement;

    const applyClassPrefix = (prefix: string, current: string) => {
      const pattern = new RegExp(`^${prefix}-[\\w-]+$`);
      root.classList.forEach((cls) => {
        if (pattern.test(cls)) {
          root.classList.remove(cls);
        }
      });
      root.classList.add(`${prefix}-${current}`);
    };

    const applyTheme = (newTheme: Theme) => {
      applyClassPrefix("theme", newTheme);
    };

    const setTheme = (newTheme: Theme) => {
      theme.value = newTheme;
    };

    const setLayout = (newLayout: Layout) => {
      layout.value = newLayout;
    };

    const toggleDark = useToggle(isDark);

    watch(theme, applyTheme, { immediate: true });
    watch(layout, (v) => applyClassPrefix("layout", v), { immediate: true });

    return {
      theme,
      layout,
      isDark,
      themes,
      layouts,
      setTheme,
      setLayout,
      toggleDark,
    };
  },
  {
    persist: {
      key: THEME_KEY,
    },
  },
);
