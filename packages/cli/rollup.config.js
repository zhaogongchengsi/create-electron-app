import { join, resolve } from "path";
import esbuild from "rollup-plugin-esbuild";
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

  const indexConfig = {
    input: resolvePath("./src/index.ts"),
    output: {
      dir: resolvePath("dist"),
      entryFileNames: `index.js`,
      format: "es",
    },
    external: ["cac", "electron"],
    plugins: plugins,
  };

  const cliConfig = {
    input: resolvePath("./src/cli.ts"),
    output: {
      dir: resolvePath("bin"),
      entryFileNames: `index.js`,
      format: "es",
      intro: "#!/usr/bin/env node",
    },
    external: ["cac", "electron"],
    plugins: plugins,
  };

  return [indexConfig];
}
