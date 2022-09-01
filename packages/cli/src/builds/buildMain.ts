import { join } from "path";
import { isArray, isObject, isString } from "../utils";
import { ElectronAssets, UseConfig, WindowsMain } from "../../types";
import { esbuild } from "./esbuild";

export type buildMainOption = {
  root: string;
  config: UseConfig;
  electronAssets?: ElectronAssets;
  idDev?: boolean;
};

export async function buildMain({
  root,
  idDev = true,
  electronAssets,
  config,
}: buildMainOption) {
  let entryPoints: string[] = [];
  const outDir = join(root, idDev ? config.tempDirName! : config.outDir!);
  //   if (isArray(conf.main)) {
  //     entryPoints = (conf.main as WindowsMain)
  //       .map((item) => {
  //         if (item.preload) {
  //           return [item.input, item.preload];
  //         } else {
  //           return [item.input];
  //         }
  //       })
  //       .flat();
  //   }

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
    electronAssets: electronAssets,
  });

  return outDir;
}
