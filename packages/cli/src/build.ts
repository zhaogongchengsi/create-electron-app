import { join, parse, relative } from "path";
import { buildOptions, UseConfig, WindowsMain } from "../types";
import { buildMain } from "./builds";
import { buildViteBundle } from "./builds/vite";
import { readConfigFile, readPackJsonFile } from "./config";
import { buildApp, createTarget } from "./electron";
import { clearPackJson, createFile, createNodeModule } from "./utils";
import { log } from "./utils/log";

export const settingBuildOptions = (options: any) => {
  return {
    directories: {
      output: options.output,
    },
  };
};

export async function build(options: buildOptions) {
  const useConfig = await readConfigFile(options);
  if (!useConfig) return;
  const envPath = join(options.root, useConfig.outDir!);
  const appOutDir = relative(envPath, join(options.root, useConfig.appOutDir!));
  const pack_json = await readPackJsonFile(options);

  pack_json.build = settingBuildOptions({ output: appOutDir });

  await buildCode(options.root, useConfig);

  log.success("Prepare the environment \n");

  await prepareBuildEnvironment(
    envPath,
    { ...options, ...useConfig },
    pack_json
  );

  log.success("ready to build the app... \n");

  await buildApp({
    inputDir: join(options.root, useConfig.outDir!),
    targets: createTarget().createTarget(),
    config: pack_json.build,
  });

  log.success("build complete");
}

export async function buildCode(root: string, conf: UseConfig) {
  const res = await buildViteBundle(root, conf);
  const { preload } = conf.main as WindowsMain;

  let pre;
  if (preload) {
    pre = parse(preload).name;
  }

  if (res !== true) {
    throw new Error(`vite Build failed please try again`);
  }

  await buildMain({
    root,
    config: conf,
    electronAssets: {
      mode: "production",
      loadUrl: "./index.html",
      preload: pre + ".js",
    },
    idDev: false,
  });
}

export async function prepareBuildEnvironment(
  envPath: string,
  opt: buildOptions & UseConfig,
  json: any = {}
) {
  const { input } = opt.main as WindowsMain;
  const { name } = parse(input);
  const PACKAGE_JSON = "package.json";
  json.main = name + ".js";

  const packAgeStr = clearPackJson(json);
  const rmFile = await createFile(envPath, packAgeStr, PACKAGE_JSON);
  const unLink = await createNodeModule(envPath, opt.root);

  return async () => {
    await rmFile();
    await unLink();
  };
}
