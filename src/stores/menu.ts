import { defineStore } from "pinia";
import type { MenuItem } from "@/api/menu";
import { GetMenuApi } from "@/api/menu";

const MENU_KEY = "app-menu";

export const useMenuStore = defineStore(
  "menu",
  () => {
    const menus = ref<MenuItem[]>([]);

    const isLoaded = ref(false);

    const setMenus = async (force = false) => {
      if (isLoaded.value && !force) return;

      const res = await GetMenuApi();
      if (res.status === ERROR_CODE.SUCCESS) {
        menus.value = res.data.filter((item) => item.show);
        isLoaded.value = true;
      }
    };

    const clearMenus = () => {
      menus.value = [];
      isLoaded.value = false;
    };

    return {
      menus,
      isLoaded,
      setMenus,
      clearMenus,
    };
  },
  {
    persist: {
      key: MENU_KEY,
    },
  },
);
