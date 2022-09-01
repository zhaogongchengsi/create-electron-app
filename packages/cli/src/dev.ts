import { ServeOptions, UseConfig, WindowsMain } from "../types";
import { readConfigFile } from "./config";
import { buildMain, createViteServer } from "./builds";
import { parse } from "path";
import { createDevElectronApp } from "./electron";
import { log } from "./utils/log";

export async function createDevServer(options: ServeOptions) {
  const useConfig = await readConfigFile(options);

  if (!useConfig) return;

  await startServer(options.root, useConfig);
}

export async function startServer(root: string, conf: UseConfig) {
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
  const outDir = await buildMain(root, conf, {
    loadUrl: `http://localhost:${port}`,
    mode: "development",
    preload: pre,
  });

  await createDevElectronApp(outDir, parse(input).name, {
    close() {
      log.success("app close");
      process.exit(1);
    },
  });
}
