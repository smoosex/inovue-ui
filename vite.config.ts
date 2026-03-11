import path from "node:path";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({
      imports: [
        "vue",
        {
          "vue-i18n": ["useI18n"],
        },
      ],
      dirs: ["./src/config/**"],
      dts: "src/types/auto-imports.d.ts",
      vueTemplate: true,
    }),
    Components({
      dirs: ["src/components"],
      dts: "src/types/components.d.ts",
      deep: true,
      extensions: ["vue"],
      resolvers: [
        IconsResolver({
          prefix: false,
          enabledCollections: ["lucide"],
        }),
      ],
    }),
    Icons({
      autoInstall: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
