import { ServeOptions, UseConfig } from "../types";
import { readConfigFile } from "./config";

export async function createDevServer(options: ServeOptions) {
  const useConfig = await readConfigFile(options);
  if (!useConfig) return;
  const serve = await startServer(useConfig);

  console.log(`dev server ...`, useConfig);
}

export async function startServer(conf: UseConfig) {}
