import { parse, resolve } from "path";
import { ElectronAssets, Mode, UseConfig } from "../../types";
import { buildPlan, esbuild } from "./esbuild";
import { identifyMainType } from "../config";
import { WatchMode } from "esbuild";
import { CeaContext } from "../context";

export type buildMainOption = {
  ctx: CeaContext;
  watch?: WatchMode;
};

export async function buildMain({
  ctx,
  watch = {
    onRebuild: (err: any, res: any) => {},
  },
}: buildMainOption) {
  const isEMS = ctx._isEms;
  const mode = ctx.mode;
  const ext = ctx._isEms ? ".js" : ".cjs";

  await buildPlan(
    {
      entryPoints: ctx.entryPoints,
      outdir: ctx.runPath,
      format: isEMS ? "esm" : "cjs",
      define: {
        electronAssets: JSON.stringify(ctx.eleAssets),
        "import.mate.env": JSON.stringify(ctx.env),
      },
      target: "esnext",
      platform: "node",
      watch: mode === "development" ? watch : false,
      outExtension: { ".js": ext },
    },
    mode === "production" ? ctx.config.build : undefined
  );

  const { name } = parse(ctx.entryPoints[0]);

  return {
    outdir: ctx.runPath,
    ext: ext,
    name,
    base: name + ext,
  };
}
