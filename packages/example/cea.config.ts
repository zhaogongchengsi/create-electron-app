import { defineConfig } from "@zzhaon/create-electron-app";
import { resolve } from "path";

export default defineConfig(() => {
  return {
    main: {
      input: resolve("./main/index.ts"),
      preload: resolve("./main/preload.ts"),
    },
    vite: "./vite.config.ts",
    plugins: [],
  };
});
