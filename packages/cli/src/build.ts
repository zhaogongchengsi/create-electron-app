import { buildOptions } from "../types";
import { buildViteBundle } from "./builds/vite";
import { readConfigInfo, readPackJsonFile } from "./config";
import { buildApp, createTarget } from "./electron";
import { clearPackJson, createFile, createNodeModule } from "./utils";
import { buildMain, printMetaFile } from "./builds";
import { CeaContext } from "./context";
import { parseEnv } from "./env";

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

  let res;

  try {
    res = await Promise.all([buildViteBundle(ctx)]);
  } catch (err) {}
}

export async function buildCode(ctx: CeaContext, pack_json: any = {}) {
  ctx.createElectronAssets();

  const fineInfo = await buildMain({
    ctx: ctx,
    pkg: pack_json,
  });

  return fineInfo;
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
