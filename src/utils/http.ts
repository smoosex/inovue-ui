import axios from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";

class Http {
  private instance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);

    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const authStore = useAuthStore();
        if (authStore.token) {
          config.headers = config.headers || {};
          config.headers["X-Access-Token"] = authStore.token;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (response.data?.error_code === ERROR_CODE.UNAUTHORIZED) {
          router.push({ name: "Login" });
        }
        return response.data;
      },
      (error) => {
        if (error.response?.status === 401) {
          const authStore = useAuthStore();
          authStore.clearAuth();
          router.push({ name: "Login" });
        }
        return Promise.reject(error);
      },
    );
  }

  request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config);
  }

  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config);
  }

  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.instance.post(url, data, config);
  }

  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.instance.put(url, data, config);
  }

  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }
}

export default new Http({
  baseURL: import.meta.env.VITE_API_PREFIX,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
