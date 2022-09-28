import { parse } from "path";
import { WatchMode, build } from "esbuild";
import { CeaContext } from "../context";

export type buildMainOption = {
  ctx: CeaContext;
  watch?: WatchMode;
};

const IMPORT_META_ENV_VAR = "import.meta.env";
const IMPORT_META_ENV_DEV_VAR = "import.meta.env.DEV";
const IMPORT_META_ENV_PROD_VAR = "import.meta.env.PROD";

const EXTERNAL = ["electron"];
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
  watch = {
    onRebuild: (err: any, res: any) => {},
  },
}: buildMainOption) {
  const isEMS = ctx._isEms;
  const mode = ctx.mode;
  const ext = isEMS ? ".js" : ".cjs";

  const { config } = ctx;

  const define = {
    [IMPORT_META_ENV_VAR]: JSON.stringify({ ...ctx.env, ...ctx.eleAssets }),
    [IMPORT_META_ENV_DEV_VAR]: mode === "development",
    [IMPORT_META_ENV_PROD_VAR]: mode === "production",
    ...config.define,
  };

  const external = EXTERNAL.concat(config.external ?? []);
  const sourcemap = config.sourcemap ? config.sourcemap : "both";

  const result = await build({
    entryPoints: ctx.entryPoints,
    outdir: ctx.runPath,
    format: isEMS ? "esm" : "cjs",
    watch: mode === "development" ? watch : false,
    target: "esnext",
    platform: "node",
    outExtension: { ".js": ext },
    loader: loader,
    allowOverwrite: true,
    bundle: true,
    metafile: true,
    plugins: config.plugins,
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
