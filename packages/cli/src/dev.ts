import { ServeOptions, UseConfig, WindowsMain } from "../types";
import { readConfigFile } from "./config";
import { esbuild } from "./builds";
import { join } from "path";
import { isArray, isObject, isString } from "./utils";

export async function createDevServer(options: ServeOptions) {
  const useConfig = await readConfigFile(options);
  if (!useConfig) return;
  const serve = await startServer(options.root, useConfig);
}

export async function startServer(root: string, conf: UseConfig) {
  let input: string[] = [];

  if (isArray(conf.main)) {
    input = (conf.main as WindowsMain[])
      .map((item) => {
        if (item.preload) {
          return [item.input, item.preload];
        } else {
          return [item.input];
        }
      })
      .flat();
  }

  if (isObject(conf.main)) {
    input = [(conf.main as WindowsMain).input];
  }

  if (isString(conf.main)) {
    input = [conf.main as string];
  }

  await esbuild({
    input: input,
    outdir: join(root, conf.outDir ?? "dist"),
    electronAssets: {},
  });
}
