import { createRequire } from "node:module";
import { join, resolve, parse } from "path";
import { CommonOptions, UseConfig } from "../types";
import { pathExist } from "./utils";
import { build } from "esbuild";
import { tmpdir } from "os";
import { mkdtemp, rmdir, symlink, unlink, writeFile } from "fs/promises";
import { e } from "vitest/dist/index-ea17aa0c";

export type fileType = "ts" | "js" | "json";

export type ConfigFileInfo = {
  type: fileType;
  path: string;
  name: string;
  isEMS?: boolean;
};

const configNames = [
  "create.electron.app.config.ts",
  "create.electron.app.config.js",
  "cea.config.ts",
  "cea.config.js",
];

export async function findConfigFile(
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
  const { ext, name } = parse(confTempPath);
  const fileType = ext.replace(".", "");

  return {
    type: fileType as fileType,
    path: resolve(confTempPath),
    name: name,
  };
}

const _require = createRequire(import.meta.url);

/**
 *
 * @param confinfo 配置文件路径 和 类型
 */
export async function resolveConfig<C>(
  confinfo: ConfigFileInfo,
  isEMS: boolean = false
): Promise<C | undefined> {
  if (confinfo.type === "js" || confinfo.type === "json") {
    //todo: 目前只简单处理下 CommonJS 的导出配置 并且支持导出一个默认函数
    const conf = await _require(confinfo.path);
    return typeof conf === "function" ? conf() : conf;
  }

  return undefined;
}

/**
 * 准备编译配置读取配置的环境
 */
export async function prepareEnvironment(root: string, conf: ConfigFileInfo) {
  const TEMP_DIR_NAME = "cea-temp-" + Date.now() + "-";
  let tempDirPath: string | undefined;
  try {
    tempDirPath = await mkdtemp(join(tmpdir(), TEMP_DIR_NAME));
  } catch (err) {
    console.log(err);
  }

  if (!tempDirPath) {
    throw new Error(`Failed to read configuration file`);
  }

  const rootModules = join(root, "node_modules");
  const appDistModules = join(tempDirPath, "node_modules");
  const configOutFile = join(
    tempDirPath,
    conf.isEMS ? conf.name + ".mjs" : conf.name + ".js"
  );

  await symlink(rootModules, appDistModules, "junction");

  await bundleConfigFile(conf.path, configOutFile, conf.isEMS);

  return {
    path: configOutFile,
    clear: async () => {
      await unlink(appDistModules);
      rmdir(tempDirPath as string);
    },
  };
}

export async function readConfigFile(opt: CommonOptions) {
  const { root, configFilePath } = opt;
  const pathinfo = await findConfigFile(root, configFilePath);
  const jsonConf = await readPackJsonFile(opt);

  if (jsonConf.type === "module") {
    pathinfo.isEMS = true;
  } else {
    pathinfo.isEMS = false;
  }

  const clear = await prepareEnvironment(root, pathinfo);

  // const conf = await resolveConfig<UseConfig>(pathinfo);
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
  const pathinfo = await findConfigFile(root, "package.json");
  return (await resolveConfig<any>(pathinfo))!;
}

export async function bundleConfigFile(
  input: string,
  outFile: string,
  isESM: boolean = false
) {
  const result = await build({
    entryPoints: [input],
    outfile: "out.js",
    target: ["node14.18", "node16"],
    platform: "node",
    write: false,
    bundle: true,
    format: isESM ? "esm" : "cjs",
    sourcemap: "inline",
    loader: {
      ".js": "js",
      ".ts": "ts",
    },
  });

  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from(result.outputFiles[0].text));
  return writeFile(outFile, data, { signal });
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
