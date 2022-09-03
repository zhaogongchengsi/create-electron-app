import { resolve } from "path";
import { isObject, isString } from "../utils";
import { ElectronAssets, UseConfig, WindowsMain } from "../../types";
import { esbuild } from "./esbuild";

export type buildMainOption = {
  root: string;
  config: UseConfig;
  electronAssets?: ElectronAssets;
  idDev?: boolean;
  isEsm?: boolean;
};

export async function buildMain({
  root,
  idDev = true,
  electronAssets,
  config,
  isEsm = false,
}: buildMainOption) {
  let entryPoints: string[] = [];
  const outDir = resolve(root, idDev ? config.tempDirName! : config.outDir!);

  if (isObject(config.main)) {
    const { input, preload } = config.main as WindowsMain;
    entryPoints = [input];
    if (preload) {
      entryPoints.push(preload);
    }
  }

  if (isString(config.main)) {
    entryPoints = [config.main as string];
  }

  await esbuild({
    input: entryPoints,
    outdir: outDir,
    format: isEsm ? "esm" : "cjs",
    electronAssets: electronAssets,
  });

  return outDir;
}
