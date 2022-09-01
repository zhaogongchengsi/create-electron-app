import { parse } from "path";
import { buildOptions, UseConfig, WindowsMain } from "../types";
import { buildMain } from "./builds";
// import { buildMain } from "./builds";
import { buildViteBundle } from "./builds/vite";
import { readConfigFile } from "./config";

export async function build(options: buildOptions) {
  const useConfig = await readConfigFile(options);

  if (!useConfig) return;

  await buildPro(options.root, useConfig);
}

export async function buildPro(root: string, conf: UseConfig) {
  const res = await buildViteBundle(root, conf);
  const { preload } = conf.main as WindowsMain;

  let pre;
  if (preload) {
    pre = parse(preload).name;
  }

  if (res !== true) {
    throw new Error(`vite Build failed please try again`);
  }

  await buildMain(
    root,
    {
      ...conf,
      outDir: "dist",
    },
    {
      mode: "production",
      loadUrl: "./index.html",
      preload: pre,
    }
  );
}
