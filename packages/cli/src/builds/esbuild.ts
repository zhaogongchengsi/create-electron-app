import { build } from "esbuild";

export interface esbuildOptions {
  input: string[];
  outdir: string[];
  minify?: boolean;
  sourcemap?: boolean;
}

export async function esbuild({
  input,
  outdir,
  minify = false,
  sourcemap = false,
}: esbuildOptions) {
  build({
    entryPoints: input,
    outdir: "",
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
      electronAssets: JSON.stringify({
        preload: "./preload.js",
      }),
    },
    platform: "node",
    external: ["electron"],
  });
}
