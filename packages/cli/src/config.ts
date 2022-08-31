import { createRequire } from "node:module";
import { join, resolve, parse } from "path";
import { CommonOptions, UseConfig } from "../types";
import { pathExist } from "./utils";

export type fileType = "ts" | "js" | "json";

export type ConfigFileInfo = {
  type: fileType;
  path: string;
};

const configNames = [
  "create.electron.app.config.ts",
  "create.electron.app.config.js",
  "cea.config.ts",
  "cea.config.js",
];

export async function findconfigFile(
  root: string,
  confPath: string
): Promise<ConfigFileInfo> {
  let confTempPath: undefined | string = undefined;
  if (confPath) {
    confTempPath = join(root, confPath);
  } else {
    for await (const path of configNames) {
      const p = join(root, path);
      if (await pathExist(p)) {
        confTempPath = p;
        break;
      }
    }
  }

  if (!confTempPath) {
    throw new Error(`${confTempPath} path does not exist`);
  }

  const fileType = parse(confTempPath).ext.replace(".", "");

  return {
    type: fileType as fileType,
    path: resolve(confTempPath),
  };
}

const _require = createRequire(import.meta.url);

/**
 *
 * @param confinfo 配置文件路径 和 类型
 */
export async function resolveConfig<C>(
  confinfo: ConfigFileInfo
): Promise<C | undefined> {
  if (confinfo.type === "js" || confinfo.type === "json") {
    //todo: 目前只简单处理下 CommonJS 的导出配置 并且支持导出一个默认函数
    const conf = await _require(confinfo.path);
    return typeof conf === "function" ? conf() : conf;
  }

  return undefined;
}

export async function readConfigFile(opt: CommonOptions) {
  const { root, configFilePath } = opt;
  const pathinfo = await findconfigFile(root, configFilePath);
  // const conf = await resolveConfig<UseConfig>(pathinfo);
  // const jsonConf = await readPackJsonFile(opt);
  // 若配置文件没有 则导出默认配置
  // return mergeConfig(
  //   {
  //     main: jsonConf.main,
  //     renderer: "",
  //   },
  //   conf
  // );
}

export async function readPackJsonFile({ root }: CommonOptions) {
  const pathinfo = await findconfigFile(root, "package.json");
  return (await resolveConfig<any>(pathinfo))!;
}

/**
 *
 * @param configs 配置列表
 *
 * 合并所有的配置
 */
export function mergeConfig(...configs: (UseConfig | undefined)[]): UseConfig {
  return configs.reduce<UseConfig>(
    (pre, cun) => {
      if (cun) {
        return Object.assign(pre, cun);
      }
      return pre;
    },
    // 默认配置
    {
      main: {
        input: "",
      },
      renderer: "",
    }
  );
}
