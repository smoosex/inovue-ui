import { http, HttpResponse } from "msw";
import { UsersData, type User } from "../data";

const baseUrl = import.meta.env.VITE_API_PREFIX;

export const handlers = [
  http.get(`${baseUrl}/users`, ({ request }) => {
    const url = new URL(request.url);
    const pageNum = Number(url.searchParams.get("pageNum")) || 1;
    const pageSize = Number(url.searchParams.get("pageSize")) || 10;

    console.log(pageNum, pageSize);
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const list = UsersData.slice(start, end);

    return HttpResponse.json({
      status: "000000",
      data: {
        list: list as User[],
        total: UsersData.length,
      },
      message: "Service executed successfully",
    });
  }),
];
