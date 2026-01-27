import { LoginApi, type LoginParams } from "../api";
import { toast } from "vue-sonner";

export function useLogin() {
  const isLoading = ref(false);
  const router = useRouter();
  const { t } = useI18n();
  const authStore = useAuthStore();

  const handleLogin = async (data: LoginParams) => {
    isLoading.value = true;
    const res = await LoginApi(data);
    if (res.status === ERROR_CODE.SUCCESS) {
      authStore.setAuth(
        res.data.token,
        res.data?.name || "",
        res.data?.role || "",
        res.data?.email || "",
        res.data?.avatar || "",
      );

      toast.success(t("auth.login.success"), {
        description: t("auth.login.welcomeBack", {
          name: res.data?.name,
        }),
      });

      router.push({ name: "Dashboard" });
    } else {
      toast.error(t("auth.login.failed"), {
        description: res.message || t("auth.login.unknownError"),
      });
    }
    isLoading.value = false;
  };

  return {
    isLoading,
    handleLogin,
  };
}
