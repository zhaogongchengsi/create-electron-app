import { ServeOptions, UseConfig, WindowsMain } from "../types";
import { readConfigFile } from "./config";
import { buildMain } from "./builds";
import { join } from "path";
import { isArray, isObject, isString } from "./utils";

export async function createDevServer(options: ServeOptions) {
  const useConfig = await readConfigFile(options);
  if (!useConfig) return;
  const serve = await startServer(options.root, useConfig);
}

export async function startServer(root: string, conf: UseConfig) {
  await buildMain(root, conf);
}
