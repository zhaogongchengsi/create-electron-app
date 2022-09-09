import { build, BuildOptions, transform } from "esbuild";
import { Mode } from "../../types";
import { mergeEsBuild } from "../config";

export type Format = "iife" | "cjs" | "esm";

export interface esbuildOptions {
  input: string[];
  outdir: string;
  minify?: boolean;
  sourcemap?: boolean;
  format?: Format;
  electronAssets: any;
  mode?: Mode;
}

const LOADER = {
  ".ts": "ts",
  ".js": "js",
  ".json": "json",
  ".png": "file",
  ".jpg": "file",
} as const;

export async function esbuild({
  input,
  outdir = "dist",
  minify = false,
  sourcemap = false,
  format = "cjs",
  electronAssets = {},
  mode = "development",
}: esbuildOptions) {
  return build({
    entryPoints: input,
    outdir: outdir,
    minify: minify,
    target: "esnext",
    bundle: true,
    sourcemap: sourcemap,
    format: format,
    loader: LOADER,
    define: {
      electronAssets: JSON.stringify(electronAssets),
    },
    watch: mode === "development",
    outExtension: { ".js": ".cjs" },
    platform: "node",
    external: ["electron"],
  });
}

/**
 *
 * @param baseOptions 构建后台带代码所需要的配置
 * @param userOpt 用户定义的配置
 * @returns Promise<BuildResult>
 */
export async function buildPlan(
  baseOptions: BuildOptions,
  userOpt?: BuildOptions
) {
  const cop = mergeEsBuild(baseOptions, userOpt ?? {});
  return build(cop);
}

export async function transformWithEsbuild(
  code: string,
  loader: "ts" | "js" = "js"
) {
  return transform(code, {
    target: "esnext",
    format: "cjs",
    loader: loader,
    platform: "node",
  });
}
