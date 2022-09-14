import { ServeOptions, UseConfig } from "../types";
import { identifyMainType, readConfigInfo, readPackJsonFile } from "./config";
import { buildMain, createViteServer } from "./builds";
import { parse } from "path";
import { log } from "./utils/log";
import { ElectronMon } from "./electron";

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

  const outDir = await buildMain({
    root,
    config: config,
    electronAssets: {
      loadUrl: server.resolvedUrls?.local[0] ?? `http:localhost://${port}`,
      mode: "development",
      preload: parse(preload).base,
    },
    isEsm: false,
  });

  const watchOption =
    typeof config.watch === "object" ? config.watch : undefined;

  const electron = new ElectronMon(outDir, watchOption);

  const name = parse(input).base;

  config.watch ? electron.longTermRun(outDir, name) : console.log("启动");

  // config.watch
  //   ? createWatch(outDir)
  //   : await createDevElectronApp(outDir, name, {
  //       close() {
  //         log.success("app close");
  //         process.exit(1);
  //       },
  //     });
}
