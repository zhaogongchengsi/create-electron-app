import { ServeOptions } from "../types";
import { findconfigFile, resolveConfig } from "./config";

export async function createDevServer(options: ServeOptions) {
  const configPath = await findconfigFile(options.root, options.configFilePath);

  const useConfig = await resolveConfig(configPath);

  console.log(`dev server ...`, useConfig);
}
