import { buildOptions } from "../types";
import { buildViteBundle } from "./builds/vite";
import { readConfigInfo, readPackJsonFile } from "./config";
import { buildApp } from "./electron";
import { createFile, createNodeModule } from "./utils";
import { buildMain } from "./builds";
import { CeaContext } from "./context";
import { parseEnv } from "./env";
import { relative } from "path";

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
  const unlink = await createNodeModule(ctx.runPath!, ctx.root);
  try {
    await buildApp(ctx.runPath!);
  } catch (e) {
    console.error(e);
  }

  await unlink();
  
}

export async function WriteBuildAppConfig(
  { runPath, pkg, appOutDir }: CeaContext,
  main?: string
) {
  const PACKAGE_JSON = "package.json";
  const outDir = relative(runPath!, appOutDir);

  const ELECTRON_MODULE_NAME = "electron";
  const BUILER_MODULE_MAMA = "electron-builder";

  const searchDep = (pkg: any, name: string) => {
    let value: string;
    if (pkg.dependencies[name]) {
      value = pkg.dependencies[name];
    } else {
      value = pkg.devDependencies[name];
    }

    if (!value) {
      throw new Error(`${name} depends on ${pkg} and does not exist`);
    }

    return value;
  };

  let electron: string = searchDep(pkg, ELECTRON_MODULE_NAME);
  let electronBuilder: string = searchDep(pkg, BUILER_MODULE_MAMA);

  delete pkg.dependencies;
  delete pkg.devDependencies;
  delete pkg.scripts;

  pkg.devDependencies = {
    // 锁定 electron 版本号
    [ELECTRON_MODULE_NAME]: electron.replace(/^\^/, ""),
    [BUILER_MODULE_MAMA]: electronBuilder,
  };

  pkg.main = main;
  pkg.build = {
    ...pkg.build,
    directories: {
      output: outDir,
    },
  };

  const packAgeStr = JSON.stringify(pkg);

  return await createFile(runPath!, packAgeStr, PACKAGE_JSON);
}
