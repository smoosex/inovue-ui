import http from "@/utils/http";
import type { Response } from "@/types";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
};

export type UsersParams = {
  pageNum: number;
  pageSize: number;
};

export type UsersResponse = {
  list: User[];
  total: number;
};

/**
 * Get users list
 * @description Retrieves paginated user list for table display
 */
export const GetUsersApi = (
  params: UsersParams,
): Promise<Response<UsersResponse>> => {
  return http.get("/users", { params });
};
