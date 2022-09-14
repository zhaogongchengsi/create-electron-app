import { join, resolve } from "path";
import esbuild from "rollup-plugin-esbuild";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

const resolvePath = (path) => resolve(join(process.cwd(), path));

const selectTsCompiler = () => {
  const { NODE_ENV } = process.env;
  return NODE_ENV === "production"
    ? typescript({
        declaration: true,
        declarationDir: "dist/types",
        sourceMap: true,
      })
    : esbuild({
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
      });
};

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
    sourceMap: process.env.NODE_ENV === "development",
    external: [
      "cac",
      "electron",
      "esbuild",
      "vite",
      "@vitejs/plugin-legacy",
      "electron-builder",
      "electronmon",
      "chokidar",
    ],
    plugins: plugins,
  };

  return [indexConfig];
}
