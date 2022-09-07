import { ServeOptions, UseConfig, WindowsMain } from "../types";
import { readConfigInfo, readPackJsonFile } from "./config";
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
  conf: UseConfig,
  packJson?: any
) {
  let pre: string | undefined;

  let input: string | undefined;

  if (typeof conf.main === "object") {
    const { preload, input: i } = conf.main as WindowsMain;
    input = i;
    if (preload) {
      pre = parse(preload).name + FilE_EXTENSION;
    }
  } else {
    input = conf.main;
  }

  log.success("app starts");

  const server = await createViteServer(root, conf);
  await server.listen();
  server.printUrls();

  const { port } = server.httpServer?.address() as AddressInfo;

  const outDir = await buildMain({
    root,
    config: conf,
    electronAssets: {
      loadUrl: server.resolvedUrls?.local[0] ?? `http:localhost://${port}`,
      mode: "development",
      preload: pre,
    },
  });

  const name = parse(input).name + FilE_EXTENSION;

  conf.watch
    ? await electronmonApp(outDir, name)
    : await createDevElectronApp(outDir, name, {
        close() {
          log.success("app close");
          process.exit(1);
        },
      });
}
