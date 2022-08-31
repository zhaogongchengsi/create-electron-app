import { join } from "path";
import { isArray, isObject, isString } from "../utils";
import { ElectronAssets, UseConfig, WindowsMain } from "../../types";
import { esbuild } from "./esbuild";

export async function buildMain(
  root: string,
  conf: UseConfig,
  electronAssets?: ElectronAssets
) {
  let entryPoints: string[] = [];
  const outDir = join(root, conf.outDir ?? "dist");
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

  if (isObject(conf.main)) {
    const { input, preload } = conf.main as WindowsMain;
    entryPoints = [input];
    if (preload) {
      entryPoints.push(preload);
    }
  }

  if (isString(conf.main)) {
    entryPoints = [conf.main as string];
  }

  await esbuild({
    input: entryPoints,
    outdir: outDir,
    electronAssets: electronAssets,
  });

  return outDir;
}
