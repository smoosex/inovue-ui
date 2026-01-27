import { defineStore } from "pinia";

const AUTH_KEY = "app-auth";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const token = ref<string>("");
    const name = ref<string>("");
    const role = ref<string>("");
    const email = ref<string>("");
    const avatar = ref<string>("");

    const menuStore = useMenuStore();

    const setAuth = (
      newToken: string,
      newName: string,
      newRole: string,
      newEmail?: string,
      newAvatar?: string,
    ) => {
      token.value = newToken;
      name.value = newName;
      role.value = newRole;
      email.value = newEmail || "";
      avatar.value = newAvatar || "";
    };

    const clearAuth = () => {
      token.value = "";
      name.value = "";
      role.value = "";
      email.value = "";
      avatar.value = "";
      menuStore.clearMenus();
    };

    return {
      token,
      role,
      name,
      email,
      avatar,
      setAuth,
      clearAuth,
    };
  },
  {
    persist: { key: AUTH_KEY },
  },
);
