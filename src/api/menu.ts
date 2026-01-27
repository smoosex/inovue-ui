import http from "@/utils/http";
import type { Response } from "@/types/response";

export type MenuItem = {
  id: string;
  i18n_key: string;
  name: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
  show: boolean;
  meta?: {
    [key: string]: unknown;
  };
};

/**
 * Get menu list
 * @description Retrieves navigation menu data for sidebar display
 */
export const GetMenuApi = (): Promise<Response<MenuItem[]>> => {
  return http.get("/menu");
};
