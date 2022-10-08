import { join, resolve } from "path";
import esbuild from "rollup-plugin-esbuild";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const resolvePath = (path) => resolve(join(process.cwd(), path));

export default async function () {
  const plugins = [
    nodeResolve(),
    commonjs(),
    json(),
    esbuild({
      // All options are optional
      include: /\.[jt]sx?$/, // default, inferred from `loaders` option
      exclude: /node_modules/, // default
      sourceMap: true, // default
      minify: process.env.NODE_ENV === "production",
      target: "esnext", // default, or 'es20XX', 'esnext'
      tsconfig: "tsconfig.json", // default
      loaders: {
        ".json": "json",
        ".ts": "ts",
        ".js": "js",
      },
    }),
  ];

  const external = [
    "cac",
    "electron",
    "esbuild",
    "vite",
    "@vitejs/plugin-legacy",
    "electron-builder",
    "electronmon",
    "chokidar",
  ];

  const input = resolvePath("./src/index.ts");

  const config = (format = "esm") => {
    return {
      input,
      output: {
        dir: resolvePath("dist"),
        entryFileNames: format === "esm" ? `index.mjs` : "index.cjs",
        format: format,
      },
      sourceMap: process.env.NODE_ENV === "development",
      external: external,
      plugins: plugins,
    };
  };

  return [config("esm"), config("cjs")];
}
