import { buildOptions } from "../types";
import { buildViteBundle } from "./builds/vite";
import { readConfigInfo, readPackJsonFile } from "./config";
import { buildApp, createTarget } from "./electron";
import { createFile, createNodeModule } from "./utils";
import { buildMain, printMetaFile } from "./builds";
import { CeaContext } from "./context";
import { parseEnv } from "./env";
import { join, relative, resolve } from "path";

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
  const mode = "production";

  const env = await parseEnv(options.root, mode);

  const ctx = new CeaContext({
    root: options.root,
    config: useConfig,
    packageJson: pack_json,
    mode,
    env,
  });

  ctx.createElectronAssets();

  let mainRes;
  try {
    await buildViteBundle(ctx);
    mainRes = await buildMain(ctx);
  } catch (err) {
    console.error(err);
  }

  if (options.notBuildApp) {
    return;
  }

  await WriteBuildAppConfig(ctx, mainRes?.main.fileName);
}

export async function WriteBuildAppConfig(
  { runPath, pkg, appOutDir }: CeaContext,
  main?: string
) {
  const PACKAGE_JSON = "package.json";
  const outDir = relative(runPath!, appOutDir);

  delete pkg.dependencies;
  delete pkg.devDependencies;
  delete pkg.scripts;

  pkg.main = main;
  pkg.build.directories.outdir = outDir;

  const packAgeStr = JSON.stringify(pkg);
  return await createFile(runPath!, packAgeStr, PACKAGE_JSON);
}
