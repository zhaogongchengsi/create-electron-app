import { UseConfig } from "@zzhaon/create-electron-app";

const conf: UseConfig = {
  main: {
    input: "./main/index.ts",
    preload: "./main/preload.ts",
  },
  vite: "./vite.config.ts",
  build: {},
};

export default conf;
