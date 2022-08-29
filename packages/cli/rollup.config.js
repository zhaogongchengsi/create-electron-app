import { join, resolve } from "path";
import esbuild from "rollup-plugin-esbuild";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const resolvePath = (path) => resolve(join(process.cwd(), path));

export default {
  input: resolvePath("./src/index.ts"),
  output: {
    file: "./dist/index.js",
    format: "es",
    intro: "#!/usr/bin/env node",
  },
  plugins: [
    nodeResolve(),
    commonjs(),
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
  ],
};
