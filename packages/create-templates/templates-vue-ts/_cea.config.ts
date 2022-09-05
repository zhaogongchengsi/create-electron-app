import { UseConfig } from "@zzhaon/create-electron-app";

const config: UseConfig = {
  main: {
    input: "./main/index.ts",
    preload: "./main/preload.ts"
  },
  vite: "./vite.config.ts",
  watch: true
};

export default config;
