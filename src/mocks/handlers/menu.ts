import { http, HttpResponse } from "msw";
import { MenuData } from "../data";

const baseUrl = import.meta.env.VITE_API_PREFIX;

export const handlers = [
  http.get(`${baseUrl}/menu`, () => {
    return HttpResponse.json({
      status: "000000",
      data: MenuData,
      message: "Service executed successfully",
    });
  }),
];
