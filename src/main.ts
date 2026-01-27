// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Styles
import "./style.css";

async function enableMocking() {
  if (!import.meta.env.DEV || import.meta.env.VITE_API_MSW !== "true") {
    return;
  }

  const { worker } = await import("./mocks/browser");

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({
    onUnhandledRequest: "bypass",
  });
}

const app = createApp(App);

registerPlugins(app);

enableMocking().then(() => {
  app.mount("#app");
});
