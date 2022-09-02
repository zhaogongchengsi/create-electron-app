import { UseConfig } from "@zzhaon/create-electron-app";

const config: UseConfig = {
  main: {
    input: "./main/index.ts",
    preload: "./main/preload.ts"
  },
  renderer: "./vite.config.ts"
};

export default config;
