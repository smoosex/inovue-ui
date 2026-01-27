import { handlers as authHandlers } from "./auth";
import { handlers as menuHandlers } from "./menu";
import { handlers as usersHandlers } from "./users";

export const handlers = [...authHandlers, ...menuHandlers, ...usersHandlers];
