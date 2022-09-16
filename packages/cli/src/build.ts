import { buildOptions } from "../types";
import { buildViteBundle } from "./builds/vite";
import { readConfigInfo, readPackJsonFile } from "./config";
import { buildApp, createTarget } from "./electron";
import { clearPackJson, createFile, createNodeModule } from "./utils";
import { buildMain } from "./builds";
import { CeaContext } from "./context";

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

  const ctx = new CeaContext({
    root: options.root,
    config: useConfig,
    packageJson: pack_json,
    mode: "production",
  });

  ctx.envPath();

  pack_json.build = settingBuildOptions({ output: ctx.exePath });

  const fileName = await buildCode(ctx);

  await prepareBuildEnvironment(
    ctx.runPath!,
    {
      main: fileName,
      root: options.root,
    },
    pack_json
  );

  ctx.logLevel.info("start building the app");

  const target = await createTarget();

  try {
    await buildApp({
      inputDir: ctx.runPath!,
      targets: target.createTarget(),
      config: pack_json.build,
    });
  } catch (err) {
    ctx.logLevel.error(err as Error);
  }

  ctx.logLevel.info("app build complete");
}

export async function buildCode(ctx: CeaContext) {
  const root = ctx.root;
  const config = ctx.config;

  const res = await buildViteBundle(root, config);

  if (res !== true) {
    throw new Error(`vite Build failed please try again`);
  }

  ctx.createElectronAssets();

  const fineInfo = await buildMain({
    ctx: ctx,
  });

  return fineInfo.base;
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
