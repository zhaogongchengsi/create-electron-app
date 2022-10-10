import { defineConfig } from "@zzhaon/create-electron-app";
import { resolve } from "path";

export default defineConfig(async () => {
  return {
    main: {
      input: resolve("./main/index.ts"),
      preload: resolve("./main/preload.ts"),
    },
    vite: "./vite.config.ts",
    staticResource: "./public",
    debug: {
      port: 5678,
    },
    alias: {
      "@": resolve("./abc"),
    },
  };
});
