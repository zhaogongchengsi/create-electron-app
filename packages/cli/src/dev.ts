import { ServeOptions } from "../types";
import { readConfigInfo, readPackJsonFile } from "./config";
import { buildMain, createViteServer } from "./builds";
import { log } from "./utils/log";
import { electronStart } from "./electron";
import { CeaContext } from "./context";
import { parseEnv } from "./env";

interface AddressInfo {
  address: string;
  family: string;
  port: number;
}

export async function createDevServer(options: ServeOptions) {
  const pack_json = await readPackJsonFile(options);
  const useConfig = await readConfigInfo(options, pack_json);

  if (!useConfig) return;


  console.log(useConfig)

  // const mode = "development";

  // const env = await parseEnv(options.root, mode);

  // const ctx = new CeaContext({
  //   root: options.root,
  //   config: useConfig,
  //   packageJson: pack_json,
  //   mode: mode,
  //   env,
  // });

  // ctx.envPath();

  // await startServer(ctx);
}

export async function startServer(ctx: CeaContext) {
  const server = await createViteServer(ctx.root, ctx.config);
  await server.listen();
  server.printUrls();

  const { port } = server.httpServer?.address() as AddressInfo;

  ctx.createElectronAssets(
    server.resolvedUrls?.local[0] ?? `http:localhost://${port}`
  );

  let electron: electronStart | undefined;

  const outDir = await buildMain({
    ctx: ctx,
    watch: {
      onRebuild: (err, res) => {
        if (!electron) return;
        if (!ctx.config) return;
        electron?.restart && electron.restart();
      },
    },
  });

  // ctx.logLevel.info("app starts");

  // electron = new electronStart(outDir.outdir!, {
  //   env: ctx.env,
  // });

  // await electron.start(outDir.base);
}
