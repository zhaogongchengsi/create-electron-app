import { join, parse, relative, resolve } from "path";
import { buildOptions, ElectronAssets, UseConfig } from "../types";
import { buildViteBundle } from "./builds/vite";
import {
  identifyMainType,
  mergeEsBuild,
  readConfigInfo,
  readPackJsonFile,
} from "./config";
import { buildApp, createTarget } from "./electron";
import { clearPackJson, createFile, createNodeModule } from "./utils";
import { log } from "./utils/log";
import { build as esbuild } from "esbuild";

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

  const { name } = await buildCode(options.root, useConfig);

  log.success("Prepare the environment \n");

  await prepareBuildEnvironment(
    envPath,
    {
      main: name,
      root: options.root,
    },
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

export async function buildCode(root: string, config: UseConfig) {
  const res = await buildViteBundle(root, config);

  if (res !== true) {
    throw new Error(`vite Build failed please try again`);
  }

  const outdir = resolve(root, config.outDir!);
  const mode = "production";
  const isEsm = false;

  const [input, preload] = identifyMainType(config.main);

  const electronAssets: ElectronAssets = {
    mode,
    loadUrl: "./index.html",
    preload: preload ? parse(preload).base : undefined,
  };

  const cop = mergeEsBuild(
    {
      entryPoints: [input, preload],
      outdir,
      format: isEsm ? "esm" : "cjs",
      define: {
        electronAssets: JSON.stringify(electronAssets),
      },
      target: "esnext",
      platform: "node",
    },
    config.build ?? {}
  );

  await esbuild(cop);

  return {
    outdir,
    name: parse(input).name + ".js",
  };
}

export async function prepareBuildEnvironment(
  envPath: string,
  opt: {
    main: string;
    root: string;
  },
  json: any = {}
) {
  const PACKAGE_JSON = "package.json";
  json.main = opt.main;
  const packAgeStr = clearPackJson(json);
  const rmFile = await createFile(envPath, packAgeStr, PACKAGE_JSON);
  const unLink = await createNodeModule(envPath, opt.root);

  return async () => {
    await rmFile();
    await unLink();
  };
}
