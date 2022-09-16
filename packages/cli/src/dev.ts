import { ServeOptions, UseConfig } from "../types";
import { identifyMainType, readConfigInfo, readPackJsonFile } from "./config";
import { buildMain, createViteServer } from "./builds";
import { parse } from "path";
import { log } from "./utils/log";
import { electronStart } from "./electron";
import { CeaContext } from "./context";

interface AddressInfo {
  address: string;
  family: string;
  port: number;
}

export async function createDevServer(options: ServeOptions) {
  const pack_json = await readPackJsonFile(options);
  const useConfig = await readConfigInfo(options, pack_json);

  if (!useConfig) return;

  const ctx = new CeaContext({
    root: options.root,
    config: useConfig,
    packageJson: pack_json,
    mode: "development",
  });

  ctx.envPath();

  await startServer(ctx);
}

export async function startServer(ctx: CeaContext) {
  log.success("app starts");

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

  electron = new electronStart(outDir.outdir!);
  await electron.start(outDir.base);
}
