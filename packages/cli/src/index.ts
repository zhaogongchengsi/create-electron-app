import { build } from "./build";
import { createDevServer } from "./dev";
import { createCli } from "./cli";
import { mergeConfig, defineConfig } from "./config";

export type { fileType } from "./config";
export type { CeaContext } from './context/index'

export { build, createDevServer, createCli, mergeConfig, defineConfig };
