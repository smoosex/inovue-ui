import pinia from "../stores";
import router from "../router";
import i18n from "./i18n";

import type { App } from "vue";

export function registerPlugins(app: App) {
  app.use(pinia).use(router).use(i18n);
}
