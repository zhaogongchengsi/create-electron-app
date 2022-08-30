import { ServeOptions, UseConfig, WindowsMain } from "../types";
import { readConfigFile } from "./config";
import { buildMain, createViteServer } from "./builds";

export async function createDevServer(options: ServeOptions) {
  const useConfig = await readConfigFile(options);
  if (!useConfig) return;

  const serve = await startServer(options.root, useConfig);
}

export async function startServer(root: string, conf: UseConfig) {
  const { preload } = conf.main as WindowsMain;
  const server = await createViteServer(root, conf);
  await server.listen();
  server.printUrls();
  const { port } = server.httpServer?.address() as { port: number };
  await buildMain(root, conf, {
    loadUrl: `http://localhost:${port}`,
    mode: "development",
    preload: `${preload}`,
  });
}
