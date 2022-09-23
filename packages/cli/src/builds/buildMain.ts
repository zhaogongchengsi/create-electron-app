import { parse } from "path";
import { buildPlan } from "./esbuild";
import { WatchMode } from "esbuild";
import { CeaContext } from "../context";

export type buildMainOption = {
  ctx: CeaContext;
  watch?: WatchMode;
};

const IMPORT_META_ENV_VAR = "import.meta.env";

export async function buildMain({
  ctx,
  watch = {
    onRebuild: (err: any, res: any) => {},
  },
}: buildMainOption) {
  const isEMS = ctx._isEms;
  const mode = ctx.mode;
  const ext = ctx._isEms ? ".js" : ".cjs";

  await buildPlan({
    entryPoints: ctx.entryPoints,
    outdir: ctx.runPath,
    bundle: true,
    format: isEMS ? "esm" : "cjs",
    define: {
      [IMPORT_META_ENV_VAR]: JSON.stringify({ ...ctx.env, ...ctx.eleAssets }),
    },
    metafile: true,
    target: "esnext",
    platform: "node",
    watch: mode === "development" ? watch : false,
    outExtension: { ".js": ext },
    plugins: ctx.config.plugins,
  });

  const { name } = parse(ctx.entryPoints[0]);

  return {
    outdir: ctx.runPath,
    ext: ext,
    name,
    base: name + ext,
  };
}
