import { http, HttpResponse } from "msw";
import { LoginInfoData } from "../data";

const baseUrl = import.meta.env.VITE_API_PREFIX;

export const handlers = [
  http.post(`${baseUrl}/auth/login`, async ({ request }) => {
    const { username, password } = (await request.json()) as any;

    if (username === "smoose" && password === "smoose") {
      return HttpResponse.json({
        status: "000000",
        data: LoginInfoData,
        message: "Service executed successfully",
      });
    }

    return HttpResponse.json({
      status: "0000001",
      data: null,
      message: "Invalid username or password",
    });
  }),

  http.post(`${baseUrl}/auth/logout`, () => {
    return HttpResponse.json({
      status: "000000",
      data: null,
      message: "Service executed successfully",
    });
  }),
];
