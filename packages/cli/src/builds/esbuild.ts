import { build } from "esbuild";
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
