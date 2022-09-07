import { join, parse, relative } from "path";
import { buildOptions, ElectronAssets, UseConfig, WindowsMain } from "../types";
import { buildMain } from "./builds";
import { buildViteBundle } from "./builds/vite";
import { identifyMainType, readConfigInfo, readPackJsonFile } from "./config";
import { buildApp, createTarget } from "./electron";
import { clearPackJson, createFile, createNodeModule } from "./utils";
import { log } from "./utils/log";

const FilE_EXTENSION = ".cjs";

export const settingBuildOptions = (options: any) => {
  return {
    ...options.build,
    directories: {
      output: options.output,
    },
  };
};

export async function build(options: buildOptions) {
  const pack_json = await readPackJsonFile(options);

  const useConfig = await readConfigInfo(options, pack_json);

  if (!useConfig) return;
  const envPath = join(options.root, useConfig.outDir!);
  const appOutDir = relative(envPath, join(options.root, useConfig.appOutDir!));

  pack_json.build = settingBuildOptions({ output: appOutDir });

  await buildCode(options.root, useConfig);

  log.success("Prepare the environment \n");

  await prepareBuildEnvironment(
    envPath,
    { ...options, ...useConfig },
    pack_json
  );

  log.success("ready to build the app... \n");

  const target = await createTarget();

  await buildApp({
    inputDir: envPath,
    targets: target.createTarget(),
    config: pack_json.build,
  });

  log.success("build complete");
}

export async function buildCode(root: string, conf: UseConfig) {
  const res = await buildViteBundle(root, conf);
  const [_, preload] = identifyMainType(conf.main, {
    ext: "cjs",
  });

  const electronAssets: ElectronAssets = {
    mode: "production",
    loadUrl: "./index.html",
    preload: preload ? parse(preload).base : undefined,
  };

  if (res !== true) {
    throw new Error(`vite Build failed please try again`);
  }

  await buildMain({
    root,
    config: conf,
    electronAssets: electronAssets,
    isEsm: false,
    mode: "production",
  });
}

export async function prepareBuildEnvironment(
  envPath: string,
  opt: buildOptions & UseConfig,
  json: any = {}
) {
  const [input] = identifyMainType(opt.main);
  const PACKAGE_JSON = "package.json";
  json.main = parse(input).base;

  const packAgeStr = clearPackJson(json);
  const rmFile = await createFile(envPath, packAgeStr, PACKAGE_JSON);
  const unLink = await createNodeModule(envPath, opt.root);

  return async () => {
    await rmFile();
    await unLink();
  };
}
