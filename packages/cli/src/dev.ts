import { ServeOptions, UseConfig, WindowsMain } from "../types";
import { readConfigFile } from "./config";
import { buildMain, createViteServer } from "./builds";
import { join, parse } from "path";

export async function createDevServer(options: ServeOptions) {
  const useConfig = await readConfigFile(options);
  if (!useConfig) return;

  const serve = await startServer(options.root, useConfig);
}

export async function startServer(root: string, conf: UseConfig) {
  let pre: string | undefined;
  const { preload, input } = conf.main as WindowsMain;
  const server = await createViteServer(root, conf);
  await server.listen();
  server.printUrls();

  if (preload) {
    pre = parse(preload).base;
  }

  const { port } = server.httpServer?.address() as { port: number };
  const outDir = await buildMain(root, conf, {
    loadUrl: `http://localhost:${port}`,
    mode: "development",
    preload: `${pre}`,
  });

  // 执行器的执行路径
  console.log(join(outDir, parse(input).base));
}
