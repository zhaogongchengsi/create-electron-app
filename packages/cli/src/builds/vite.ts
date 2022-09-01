import { join, parse } from "path";
import {
  createServer,
  build,
  UserConfig,
  loadConfigFromFile,
  mergeConfig,
} from "vite";
import { UseConfig } from "../../types";

export type MergeOption = {
  root: string;
  outDir: string;
  isLegacy?: boolean;
  configFile?: string;
  configRoot?: string;
};

export async function createViteServer(root: string, { renderer }: UseConfig) {
  const { dir, base } = parse(join(root, renderer));

  const server = await createServer({
    root: dir,
    configFile: join(dir, base),
  });

  if (!server.httpServer) {
    throw new Error("HTTP server not available");
  }

  return server;
}

export async function buildViteBundle(
  root: string,
  { renderer, outDir }: UseConfig
) {
  const viteConfigFile = join(root, renderer);
  const outdir = join(root, outDir ?? "dist");
  const { dir } = parse(viteConfigFile);

  process.chdir(root);

  const viteConfig = await mergeViteConfig({
    root,
    outDir: outdir,
    configFile: viteConfigFile,
    configRoot: dir,
  });

  try {
    await build({
      root,
      mode: "production",
      base: "./",
      build: {
        outDir,
        ...viteConfig.build,
      },
    });
  } catch (err) {
    return err;
  }
  return true;
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
