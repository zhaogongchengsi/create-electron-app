import { build } from "esbuild";

export type Format = "iife" | "cjs" | "esm";

export interface esbuildOptions {
  input: string[];
  outdir: string;
  minify?: boolean;
  sourcemap?: boolean;
  format?: Format;
  electronAssets: any;
}

export async function esbuild({
  input,
  outdir = "dist",
  minify = false,
  sourcemap = false,
  format = "cjs",
  electronAssets = {},
}: esbuildOptions) {
  return build({
    entryPoints: input,
    outdir: outdir,
    minify: minify,
    target: "esnext",
    bundle: true,
    sourcemap: sourcemap,
    format: format,
    loader: {
      ".ts": "ts",
      ".js": "js",
      ".json": "json",
      ".png": "file",
    },
    define: {
      electronAssets: JSON.stringify(electronAssets),
    },
    platform: "node",
    external: ["electron"],
  });
}
