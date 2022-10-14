import { join, parse, resolve } from "path";
import {
  createServer,
  build,
  UserConfig,
  loadConfigFromFile,
  mergeConfig,
} from "vite";
import { UseConfig } from "../../types";
import { CeaContext } from "../context";

export type MergeOption = {
  root: string;
  outDir: string;
  isLegacy?: boolean;
  configFile?: string;
  configRoot?: string;
};

export async function createViteServer(root: string, { vite }: UseConfig) {
  const { dir, base } = parse(resolve(root, vite));

  const server = await createServer({
    root: dir,
    configFile: join(dir, base),
  });

  if (!server.httpServer) {
    throw new Error("HTTP server not available");
  }

  return server;
}

export async function buildViteBundle({ root, vite, runPath }: CeaContext) {
  const viteConfigFile = resolve(root, vite);
  const { dir } = parse(viteConfigFile);

  process.chdir(root);

  const viteConfig = await mergeViteConfig({
    root,
    outDir: runPath!,
    configFile: viteConfigFile,
    configRoot: dir,
  });

  try {
    const res = await build({
      root,
      mode: "production",
      base: "./",
      build: {
        ...viteConfig.build,
        outDir: runPath!,
      },
    });
    return res;
  } catch (err) {
    throw err;
  }
}

export async function mergeViteConfig({
  root,
  outDir,
  configFile,
  configRoot,
}: MergeOption) {
  const baseConfig: UserConfig = {
    root,
    base: "./",
    build: {
      outDir,
    },
  };

  const _config = await loadConfigFromFile(
    {
      command: "build",
      mode: "production",
    },
    configFile,
    configRoot
  );

  return mergeConfig(_config?.config!, baseConfig);
}
