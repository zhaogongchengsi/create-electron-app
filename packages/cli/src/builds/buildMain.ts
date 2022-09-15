import { parse, resolve } from "path";
import { ElectronAssets, Mode, UseConfig } from "../../types";
import { buildPlan, esbuild } from "./esbuild";
import { identifyMainType } from "../config";
import { WatchMode } from "esbuild";

export type buildMainOption = {
  root: string;
  config: UseConfig;
  electronAssets?: ElectronAssets;
  mode?: Mode;
  isEsm?: boolean;
  watch?: WatchMode;
};

export async function buildMain({
  root,
  mode = "development",
  electronAssets,
  config,
  isEsm = false,
  watch = {
    onRebuild: (err: any, res: any) => {},
  },
}: buildMainOption) {
  const outdir = resolve(
    root,
    mode == "development" ? config.tempDirName! : config.outDir!
  );

  const entryPoints = identifyMainType(config.main);

  const ext = isEsm ? ".js" : ".cjs";

  await buildPlan(
    {
      entryPoints,
      outdir,
      format: isEsm ? "esm" : "cjs",
      define: {
        electronAssets: JSON.stringify(electronAssets),
      },
      target: "esnext",
      platform: "node",
      watch: mode === "development" ? watch : false,
      outExtension: { ".js": ext },
    },
    mode === "production" ? config.build : undefined
  );

  const { name } = parse(entryPoints[0]);

  return {
    outdir,
    ext: ext,
    name,
    base: name + ext,
  };
}
