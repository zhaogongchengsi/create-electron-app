import { ServeOptions, UseConfig, WindowsMain } from "../types";
import { identifyMainType, readConfigInfo, readPackJsonFile } from "./config";
import { buildMain, createViteServer } from "./builds";
import { parse } from "path";
import { createDevElectronApp, electronmonApp } from "./electron";
import { log } from "./utils/log";

const FilE_EXTENSION = ".cjs";

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
  const [input, preload] = identifyMainType(config.main, {
    root,
    ext: "cjs",
  });

  log.success("app starts");

  const server = await createViteServer(root, config);
  await server.listen();
  server.printUrls();

  const { port } = server.httpServer?.address() as AddressInfo;

  // let pre: string | undefined;
  // if (preload) {
  //   pre = parse(preload).name + FilE_EXTENSION;
  // }

  const outDir = await buildMain({
    root,
    config: config,
    electronAssets: {
      loadUrl: server.resolvedUrls?.local[0] ?? `http:localhost://${port}`,
      mode: "development",
      preload,
    },
  });

  const name = parse(input).name + FilE_EXTENSION;

  config.watch
    ? await electronmonApp(outDir, name)
    : await createDevElectronApp(outDir, name, {
        close() {
          log.success("app close");
          process.exit(1);
        },
      });
}
