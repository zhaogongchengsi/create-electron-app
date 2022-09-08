import { UseConfig } from "@zzhaon/create-electron-app";
import { resolve } from "path";
import { markdownPlugin } from "esbuild-plugin-markdown";

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
      plugins: [markdownPlugin({})],
    },
  };
};
