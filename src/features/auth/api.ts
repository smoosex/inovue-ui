import http from "@/utils/http";
import type { Response } from "@/types";

export type LoginParams = {
  username: string;
  password: string;
};

export type LoginInfo = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  token: string;
};

/**
 * User login
 * @description Authenticates user credentials and returns JWT token
 */
export const LoginApi = (params: LoginParams): Promise<Response<LoginInfo>> => {
  return http.post("/auth/login", params);
};
