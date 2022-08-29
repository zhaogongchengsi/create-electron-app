import { fstat } from "fs";
import { createRequire } from "node:module";
import { join, resolve } from "path";

export type fileType = "ts" | "js" | "json";

export type ConfigFileInfo = {
  type: fileType;
  path: string;
};

export interface UseConfig {}

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
  //todo: 目前只简单处理下 CommonJS 的导出配置 并且支持导出一个默认函数
  if (confinfo.type === "js") {
    const conf = await _require(confinfo.path);
    return typeof conf === "function" ? conf() : conf;
  }
  return undefined;
}
