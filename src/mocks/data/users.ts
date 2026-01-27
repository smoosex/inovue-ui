import { faker } from "@faker-js/faker";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

export function generateUsers(count: number): User[] {
  const roles = ["管理员", "编辑", "查看"];
  const statuses = ["正常", "禁用"];

  return Array.from({ length: count }, () => ({
    id: faker.string.numeric(4).padStart(8, "USR-"),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: faker.helpers.arrayElement(roles),
    status: faker.helpers.arrayElement(statuses),
    lastLogin: faker.date.recent({ days: 30 }).toLocaleDateString("zh-CN"),
  }));
}

export const UsersData = generateUsers(100);
