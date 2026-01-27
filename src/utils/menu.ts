import MenuIconAbout from "~icons/menu-icon/about";
import MenuIconDashboard from "~icons/menu-icon/dashboard";
import MenuIconComponents from "~icons/menu-icon/components";
import LucideOrbit from "~icons/lucide/orbit";
import LucideTable from "~icons/lucide/table";
import LucideTextCursorInput from "~icons/lucide/text-cursor-input";
import LucideCompass from "~icons/lucide/compass";
import LucideLayoutDashboard from "~icons/lucide/layout-dashboard";
import LucideUsers from "~icons/lucide/users";

const IconMap: Record<string, typeof LucideOrbit> = {
  About: MenuIconAbout,
  Dashboard: MenuIconDashboard,
  Components: MenuIconComponents,
  DataDisplay: LucideTable,
  Input: LucideTextCursorInput,
  Navigation: LucideCompass,
  Overview: LucideLayoutDashboard,
  Team: LucideUsers,
};

export const transformIcon = (icon: string): typeof LucideOrbit => {
  return IconMap[icon] ?? LucideOrbit;
};
