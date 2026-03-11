export type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: DemoUserRole;
  status: DemoUserStatus;
  lastLogin: string;
};

export type DemoUserRole = "admin" | "editor" | "viewer";
export type DemoUserStatus = "enabled" | "disabled";

const firstNames = [
  "Amy",
  "Ken",
  "Luna",
  "Milo",
  "Nina",
  "Owen",
  "Ruby",
  "Theo",
  "Iris",
  "Evan",
  "Cora",
  "Noah",
];

const lastNames = [
  "Parker",
  "Williams",
  "Zhang",
  "Chen",
  "Garcia",
  "Brown",
  "Davis",
  "Miller",
  "Taylor",
  "Anderson",
];

const roles: DemoUserRole[] = ["admin", "editor", "viewer"];
const statuses: DemoUserStatus[] = ["enabled", "disabled"];

const formatDate = (dayOffset: number) => {
  const date = new Date(2026, 2, 10 - dayOffset);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hour = `${9 + (dayOffset % 8)}`.padStart(2, "0");
  const minute = `${(dayOffset * 7) % 60}`.padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}`;
};

export const demoUsers: DemoUser[] = Array.from({ length: 48 }, (_, index) => {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[index % lastNames.length];
  const displayIndex = index + 1;

  return {
    id: `USR-${String(displayIndex).padStart(4, "0")}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName}.${lastName}.${displayIndex}@example.com`.toLowerCase(),
    role: roles[index % roles.length]!,
    status: statuses[index % statuses.length]!,
    lastLogin: formatDate(index),
  };
});
