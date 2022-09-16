import { UseConfig } from "@zzhaon/create-electron-app";
import { resolve } from "path";

import { markdown } from "esbuild-plugin-markdown-import";

export default (): UseConfig => {
  return {
    main: {
      input: resolve("./main/index.ts"),
      preload: resolve("./main/preload.ts"),
    },
    vite: "./vite.config.ts",
    build: {
      sourcemap: "linked",
      minify: false,
      banner: {
        js: `/*comment*/`,
      },
      define: {
        testDefine: "abc",
      },
      plugins: [markdown({})],
    },
    html: "./src/index.html"
  };
};
