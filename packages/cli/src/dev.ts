import { ServeOptions, UseConfig, WindowsMain } from "../types";
import { readConfigInfo, readPackJsonFile } from "./config";
import { buildMain, createViteServer } from "./builds";
import { parse } from "path";
import { createDevElectronApp } from "./electron";
import { log } from "./utils/log";

export async function createDevServer(options: ServeOptions) {
  const pack_json = await readPackJsonFile(options);
  const useConfig = await readConfigInfo(options, pack_json);

  if (!useConfig) return;

  await startServer(options.root, useConfig, pack_json);
}

export async function startServer(
  root: string,
  conf: UseConfig,
  packJson: any
) {
  let pre: string | undefined;
  const { preload, input } = conf.main as WindowsMain;

  log.success("app starts");

  const server = await createViteServer(root, conf);
  await server.listen();
  server.printUrls();

  if (preload) {
    pre = parse(preload).name;
  }

  const { port } = server.httpServer?.address() as { port: number };

  const outDir = await buildMain({
    root,
    config: conf,
    isEsm: packJson.type === "module",
    electronAssets: {
      loadUrl: `http://localhost:${port}`,
      mode: "development",
      preload: pre,
    },
  });

  await createDevElectronApp(outDir, parse(input).name, {
    close() {
      log.success("app close");
      process.exit(1);
    },
  });
}
