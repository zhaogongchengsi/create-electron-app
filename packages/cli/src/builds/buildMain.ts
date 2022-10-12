import { join, parse } from "path";
import { build, BuildFailure, BuildResult } from "esbuild";
import { CeaContext } from "../context";
import { esbuildPlugingAlias } from "./plugins";

export type buildMainOption = {
  ctx: CeaContext;
  pkg: any;
};

export type Main = {
  outDir: string;
  fileName: string;
  path: string;
};

export interface buildInfo {
  seria: number;
  main: Main;
  result: BuildResult | null | undefined;
}

const IMPORT_META_ENV_VAR = "import.meta.env";

const loader = {
  ".ts": "ts",
  ".js": "js",
  ".json": "json",
  ".png": "file",
  ".jpeg": "file",
  ".svg": "file",
  ".jpg": "file",
} as const;

let seria = 1;

export async function buildMain(
  { ctx, pkg = {} }: buildMainOption,
  callback?: (info: buildInfo) => void
) {
  const isEMS = ctx._isEms;
  const mode = ctx.mode;
  const ext = isEMS ? ".js" : ".cjs";
  const isProduction = mode === "production";
  const { config } = ctx;

  const { name } = parse(ctx.entryPoints[0]);

  const define = {
    ...config.define,
    [IMPORT_META_ENV_VAR]: JSON.stringify({
      ...ctx.env,
      ...ctx.eleAssets,
      PROD: mode === "production",
      DEV: mode === "development",
    }),
  };

  const external = [
    "electron",
    ...Object.keys(pkg.dependencies),
    ...(isProduction ? [] : Object.keys(pkg.devDependencies)),
  ].concat(config.external ?? []);

  const sourcemap = config.sourcemap ? config.sourcemap : "both";

  const plugins = [esbuildPlugingAlias(config.alias, ctx.root)];
  if (config.plugins && config.plugins.length > 0) {
    plugins.concat(config.plugins);
  }

  const target = ["node16", "chrome105"];

  const watch =
    !isProduction && config.watch
      ? {
          onRebuild: (
            error: BuildFailure | null,
            result: BuildResult | null
          ) => {
            seria++;
            
            callback &&
              callback({
                seria,
                main: {
                  outDir: ctx.runPath!,
                  fileName: name + ext,
                  path: join(ctx.runPath!, name + ext),
                },
                result: result,
              });
          },
        }
      : undefined;

  const result = await build({
    entryPoints: ctx.entryPoints,
    outdir: ctx.runPath,
    format: isEMS ? "esm" : "cjs",
    watch,
    target,
    platform: "node",
    outExtension: { ".js": ext },
    loader: loader,
    allowOverwrite: true,
    bundle: true,
    metafile: true,
    plugins,
    sourcemap,
    define,
    external,
  });

  callback &&
    callback({
      seria,
      main: {
        outDir: ctx.runPath!,
        fileName: name + ext,
        path: join(ctx.runPath!, name + ext),
      },
      result: result,
    });

  return {
    outdir: ctx.runPath,
    ext: ext,
    name,
    base: name + ext,
    metafile: result.metafile,
  };
}

function watchHandler() {}
