import { ServeOptions, UseConfig } from "../types";
import { readConfigInfo, readPackJsonFile } from "./config";
import { buildMain, createViteServer } from "./builds";
import { electronStart, useHooks } from "./electron";
import { CeaContext } from "./context";
import { parseEnv } from "./env";
import { join } from "path";

interface AddressInfo {
  address: string;
  family: string;
  port: number;
}

export async function createDevServer(options: ServeOptions) {
  const pack_json = await readPackJsonFile(options);
  const useConfig = await readConfigInfo(options, pack_json);

  if (!useConfig) return;

  await startServer(options, useConfig, pack_json);
}

export async function startServer(
  options: ServeOptions,
  useConfig: UseConfig,
  pack_json: any
) {
  const mode = "development";

  const env = await parseEnv(options.root, mode);

  const ctx = new CeaContext({
    root: options.root,
    config: useConfig,
    packageJson: pack_json,
    mode: mode,
    env,
  });

  const server = await createViteServer(ctx.root, ctx.config);
  await server.listen();
  server.printUrls();

  const { port } = server.httpServer?.address() as AddressInfo;

  ctx.createElectronAssets(
    server.resolvedUrls?.local[0] ?? `http://localhost:${port}`
  );

  let electron: electronStart | undefined;

  await buildMain(
    {
      ctx: ctx,
      pkg: pack_json,
    },
    async ({ seria, main }) => {
      if (seria === 1) {
        electron = new electronStart(main.outDir, ctx);
        await ctx.initResources();
        await electron.start(main.fileName);
      } else {
        electron?.restart();
      }
      await useHooks(main.path);
      await electron?.debugPrint();
    }
  );
}
