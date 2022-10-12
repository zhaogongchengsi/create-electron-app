import {
  build,
  transform,
  Metafile,
  analyzeMetafile,
} from "esbuild";
import { Mode } from "../../types";

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
    watch: mode === "development",
    outExtension: { ".js": ".cjs" },
    platform: "node",
    external: ["electron"],
  });
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

export function printMetaFile(files?: Metafile) {
  if (files) return analyzeMetafile(files);
}
