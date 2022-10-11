import { parse } from "path";
import { WatchMode, build } from "esbuild";
import { CeaContext } from "../context";
import {
  esbuildPlugingAlias,
  esbuildPlugingInjectFileScopeVariables,
  IMPORT_META_URE_VAR,
} from "./plugins";

export type buildMainOption = {
  ctx: CeaContext;
  watch?: WatchMode;
  pkg: any;
};

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

export async function buildMain({
  ctx,
  pkg = {},
  watch = {
    onRebuild: (err: any, res: any) => {},
  },
}: buildMainOption) {
  const isEMS = ctx._isEms;
  const mode = ctx.mode;
  const ext = isEMS ? ".js" : ".cjs";
  const isProduction = mode === "development";
  const { config } = ctx;

  const define = {
    ...config.define,
    [IMPORT_META_ENV_VAR]: JSON.stringify({
      ...ctx.env,
      ...ctx.eleAssets,
      PROD: mode === "production",
      DEV: mode === "development",
    })
  };

  const external = [
    "electron",
    ...Object.keys(pkg.dependencies),
    ...(isProduction ? [] : Object.keys(pkg.devDependencies)),
  ].concat(config.external ?? []);

  const sourcemap = config.sourcemap ? config.sourcemap : "both";

  const plugins = [
    esbuildPlugingAlias(config.alias, ctx.root),
    // esbuildPlugingInjectFileScopeVariables(),
  ];
  if (config.plugins && config.plugins.length > 0) {
    plugins.concat(config.plugins);
  }

  const target = ["node16", "chrome105"];

  const result = await build({
    entryPoints: ctx.entryPoints,
    outdir: ctx.runPath,
    format: isEMS ? "esm" : "cjs",
    watch: mode === "development" ? watch : false,
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

  const { name } = parse(ctx.entryPoints[0]);

  return {
    outdir: ctx.runPath,
    ext: ext,
    name,
    base: name + ext,
    metafile: result.metafile,
  };
}
