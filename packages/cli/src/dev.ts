import { ServeOptions, UseConfig } from "../types";
import { identifyMainType, readConfigInfo, readPackJsonFile } from "./config";
import { buildMain, createViteServer } from "./builds";
import { parse } from "path";
import { log } from "./utils/log";
import { electronStart } from "./electron";

interface AddressInfo {
  address: string;
  family: string;
  port: number;
}

export async function createDevServer(options: ServeOptions) {
  const pack_json = await readPackJsonFile(options);
  const useConfig = await readConfigInfo(options, pack_json);

  if (!useConfig) return;

  await startServer(options.root, useConfig, pack_json);
}

export async function startServer(
  root: string,
  config: UseConfig,
  packJson?: any
) {
  const [_, preload] = identifyMainType(config.main, {
    root,
    ext: "cjs",
  });

  log.success("app starts");

  const server = await createViteServer(root, config);
  await server.listen();
  server.printUrls();

  const { port } = server.httpServer?.address() as AddressInfo;

  let electron: electronStart | undefined;

  const outDir = await buildMain({
    root,
    config: config,
    electronAssets: {
      loadUrl: server.resolvedUrls?.local[0] ?? `http:localhost://${port}`,
      mode: "development",
      preload: parse(preload).base,
    },
    watch: {
      onRebuild: (err, res) => {
        if (!electron) return;
        if (!config.watch) return;
        electron?.restart && electron.restart();
      },
    },
    isEsm: false,
  });

  electron = new electronStart(outDir.outdir);

  await electron.start(outDir.base);
}
