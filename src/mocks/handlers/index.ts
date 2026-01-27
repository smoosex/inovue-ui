import { handlers as authHandlers } from "./auth";
import { handlers as menuHandlers } from "./menu";

export const handlers = [...authHandlers, ...menuHandlers];
