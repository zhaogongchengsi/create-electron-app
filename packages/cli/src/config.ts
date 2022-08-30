import { createRequire } from "node:module";
import { join, resolve } from "path";
import { CommonOptions, UseConfig } from "../types";
import { pathExist } from "./utils";

export type fileType = "ts" | "js" | "json";

export type ConfigFileInfo = {
  type: fileType;
  path: string;
};

export async function findconfigFile(
  root: string,
  confPath: string
): Promise<ConfigFileInfo> {
  let fileType: fileType = "js";
  if (confPath.endsWith("ts")) {
    fileType = "ts";
  } else if (confPath.endsWith("json")) {
    fileType = "json";
  }
  const configPath = join(root, confPath);
  return {
    type: fileType,
    path: resolve(configPath),
  };
}

const _require = createRequire(import.meta.url);

/**
 *
 * @param confinfo 配置文件路径 和 类型
 */
export async function resolveConfig(
  confinfo: ConfigFileInfo
): Promise<UseConfig | undefined> {
  if (!(await pathExist(confinfo.path))) {
    // 配置文件不存在 则导出当前默认配置
    throw new Error(`${confinfo.path} path does not exist`);
  }

  if (confinfo.type === "js" || confinfo.type === "json") {
    //todo: 目前只简单处理下 CommonJS 的导出配置 并且支持导出一个默认函数
    const conf = await _require(confinfo.path);
    return typeof conf === "function" ? conf() : conf;
  }

  return undefined;
}

export async function readConfigFile({ root, configFilePath }: CommonOptions) {
  const pathinfo = await findconfigFile(root, configFilePath);
  const conf = await resolveConfig(pathinfo);
  // 若配置文件没有 则导出默认配置
  return conf;
}

export async function readPackJsonFile({ root }: CommonOptions) {
  const pathinfo = await findconfigFile(root, "package.json");
  return (await resolveConfig(pathinfo))!;
}

export function mergeConfig(...configs: UseConfig[]): UseConfig {
  return configs.reduce(
    (pre, cun) => {
      return Object.assign(pre, cun);
    },
    {
      main: [],
      renderer: [],
    }
  );
}
