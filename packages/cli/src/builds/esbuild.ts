import { build } from "esbuild";

export interface esbuildOptions {
  input: string[];
  outdir: string;
  minify?: boolean;
  sourcemap?: boolean;
  electronAssets: any;
}

export async function esbuild({
  input,
  outdir = "dist",
  minify = false,
  sourcemap = false,
  electronAssets = {},
}: esbuildOptions) {
  return build({
    entryPoints: input,
    outdir: outdir,
    minify: minify,
    target: "esnext",
    bundle: true,
    sourcemap: sourcemap,
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
