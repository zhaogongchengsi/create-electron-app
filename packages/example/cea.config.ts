import { UseConfig } from "@zzhaon/create-electron-app";
import { resolve } from "path";

import alias from "esbuild-plugin-alias";

export default (): UseConfig => {
  return {
    main: {
      input: resolve("./main/index.ts"),
      preload: resolve("./main/preload.ts"),
    },
    vite: "./vite.config.ts",
    plugins: [
      alias({
        "settings": resolve("./alias/env.ts"),
      }),
    ],
  };
};
