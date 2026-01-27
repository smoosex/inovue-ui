import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import Icons from "unplugin-icons/vite";
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import IconsResolver from "unplugin-icons/resolver";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      vue(),
      tailwindcss(),
      AutoImport({
        imports: [
          "vue",
          "vue-router",
          {
            pinia: ["defineStore", "storeToRefs"],
          },
          {
            "vue-i18n": ["useI18n"],
          },
        ],
        dirs: ["./src/stores/**", "./src/config/**"],
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
            customCollections: ["sys-icon", "menu-icon"],
          }),
        ],
      }),
      Icons({
        autoInstall: true,
        customCollections: {
          "sys-icon": FileSystemIconLoader("./src/assets/icons", (svg) =>
            svg.replace(/^<svg /, '<svg fill="currentColor" '),
          ),
          "menu-icon": FileSystemIconLoader("./src/assets/icons/menu", (svg) =>
            svg.replace(/^<svg /, '<svg fill="currentColor" '),
          ),
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },

    server: {
      proxy:
        env.VITE_API_PROXY === "true"
          ? {
              [env.VITE_API_PREFIX]: {
                target: env.VITE_API_TARGET,
                changeOrigin: true,
                secure: false,
                rewrite: (path) =>
                  path.startsWith(env.VITE_API_PREFIX)
                    ? path.replace(
                        env.VITE_API_PREFIX,
                        env.VITE_API_REPLACEMENT,
                      )
                    : path,
              },
            }
          : undefined,
    },
  };
});
