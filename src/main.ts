import i18n from "@/plugins/i18n";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Styles
import "./style.css";

const app = createApp(App);

app.use(i18n);
app.mount("#app");
