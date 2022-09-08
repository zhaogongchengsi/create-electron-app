import { resolve } from "path";
import { isObject, isString } from "../utils";
import { ElectronAssets, Mode, UseConfig, WindowsMain } from "../../types";
import { buildPlan, esbuild } from "./esbuild";
import { identifyMainType } from "../config";

export type buildMainOption = {
  root: string;
  config: UseConfig;
  electronAssets?: ElectronAssets;
  mode?: Mode;
  isEsm?: boolean;
};

export async function buildMain({
  root,
  mode = "development",
  electronAssets,
  config,
  isEsm = false,
}: buildMainOption) {
  const outdir = resolve(
    root,
    mode == "development" ? config.tempDirName! : config.outDir!
  );

  const entryPoints = identifyMainType(config.main);

  // await esbuild({
  //   input: entryPoints,
  //   outdir: outDir,
  //   format: isEsm ? "esm" : "cjs",
  //   electronAssets: electronAssets,
  //   mode,
  // });

  await buildPlan(
    {
      entryPoints,
      outdir,
      format: isEsm ? "esm" : "cjs",
      define: {
        electronAssets: JSON.stringify(electronAssets),
      },
      watch: mode === "development",
    },
    config.build
  );

  return outdir;
}
