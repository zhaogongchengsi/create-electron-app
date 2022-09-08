import { join, resolve, parse } from "path";
import {
  CommonOptions,
  esBuild,
  Main,
  OmitBuildField,
  UseConfig,
  WindowsMain,
} from "../types";
import {
  createFile,
  createNodeModule,
  findFiles,
  importConfig,
  isObject,
  isString,
  requireConfig,
} from "./utils";
import { build } from "esbuild";
import type { BuildOptions } from "esbuild";
import { tmpdir } from "os";
import { mkdtemp, rm } from "fs/promises";

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

const viteFileNamas = ["vite.config.js", "vite.config.ts"];

export async function findConfigFile(
  root: string,
  confPath: string
): Promise<ConfigFileInfo | undefined> {
  let confTempPath: undefined | string = undefined;
  if (confPath) {
    confTempPath = join(root, confPath);
  } else {
    const fileInfo = await findFiles(root, configNames);
    if (fileInfo.exist) {
      confTempPath = fileInfo.path;
    }
  }

  if (!confTempPath) {
    return undefined;
  }

  const { ext, name } = parse(confTempPath);
  const fileType = ext.replace(".", "");

  return {
    type: fileType as fileType,
    path: resolve(confTempPath),
    name: name,
  };
}

export async function resolveConfig<C>(
  fileinfo: ConfigFileInfo
): Promise<C | undefined> {
  let conf: C | undefined = undefined;

  const { isEMS, type, path } = fileinfo;

  if (!isEMS || type === "json") {
    conf = await requireConfig(path);
  } else if (isEMS) {
    conf = await importConfig(path);
  }

  return conf;
}

/**
 * 准备编译配置读取配置的环境
 */
export async function prepareEnvironment(root: string, conf: ConfigFileInfo) {
  const temp_dir_name = "cea-temp-" + Date.now() + "-";
  let tempDirPath: string | undefined;
  try {
    tempDirPath = await mkdtemp(join(tmpdir(), temp_dir_name));
  } catch (err) {
    console.error(err);
  }

  if (!tempDirPath) {
    throw new Error(`Failed to read configuration file`);
  }

  const configOutFile = join(
    tempDirPath,
    conf.isEMS ? conf.name + ".mjs" : conf.name + ".cjs"
  );

  const unlink = await createNodeModule(tempDirPath, root);

  const deleteConfigFile = await bundleConfigFile(
    conf.path,
    configOutFile,
    conf.isEMS
  );

  process.chdir(root);

  return {
    path: configOutFile,
    clear: async () => {
      await unlink();
      await deleteConfigFile();
      rm(tempDirPath as string, {
        recursive: true,
      });
    },
  };
}

export async function readConfigInfo(opt: CommonOptions, packJson: any) {
  const { root, configFilePath } = opt;

  const pathinfo = await findConfigFile(root, configFilePath);
  const { main, type } = packJson;

  if (pathinfo) {
    if (/\.m[jt]s$/.test(pathinfo.path)) {
      pathinfo.isEMS = true;
    } else if (/\.c[jt]s$/.test(pathinfo.path)) {
      pathinfo.isEMS = false;
    }
    if (type === "module") {
      pathinfo.isEMS = true;
    } else {
      pathinfo.isEMS = false;
    }

    const { clear, path } = await prepareEnvironment(root, pathinfo);
    pathinfo.path = path;

    const finalConf = await resolveConfig<UseConfig>(pathinfo);

    await clear();
    return mergeConfig(finalConf);
  } else {
    const viteFileinfo = await findFiles(root, viteFileNamas);
    if (viteFileinfo.exist) {
      return mergeConfig({
        main: {
          input: main,
        },
        vite: viteFileinfo.path,
      });
    }
  }
  return undefined;
}

export async function readPackJsonFile({ root }: CommonOptions) {
  const pathinfo = await findConfigFile(root, "package.json");
  pathinfo!.isEMS = false;
  return (await resolveConfig<any>(pathinfo!))!;
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

  return createFile(outFile, result.outputFiles[0].text);
}

/**
 *
 * @param configs 配置列表
 *
 * 合并所有的配置
 */
export function mergeConfig(...configs: (UseConfig | undefined)[]): UseConfig {
  function merge(pre: any, cun: any) {
    for (const key in cun) {
      if (Object.prototype.hasOwnProperty.call(cun, key)) {
        // Merge esbuild config with another strategy
        if (key === "build") {
          pre[key] = Object.assign(pre[key], cun[key]);
          continue;
        }

        if (typeof cun[key] !== "object") {
          pre[key] = cun[key];
          continue;
        }
        pre[key] = merge(pre[key], cun[key]);
      }
    }
    return pre;
  }

  return configs.reduce<UseConfig>(
    (pre, cun) => {
      if (cun) {
        return merge(pre, cun);
      }
      return pre;
    },
    {
      vite: "",
      main: {
        input: "",
      },
      watch: true,
      tempDirName: ".app",
      outDir: "dist",
      appOutDir: "releases",
    }
  );
}

export type MainOption = {
  ext?: "js" | "ts" | "cjs" | "mjs";
  root?: string;
};

/**
 *
 * @param main config.main
 * @description 返回一个数组 数组第一项为文件入口值 其他的为 preload 可能多个
 */
export function identifyMainType(
  main: Main,
  options?: MainOption
): [string, ...string[]] {
  let res: [string, ...string[]] = [""];

  const formatPath = (str: string) => {
    if (!options) {
      return str;
    }

    const pathinfo = parse(str);
    const { ext, root } = options;

    return (
      join(root ?? pathinfo.dir, pathinfo.name) +
      (ext ? "." + ext : pathinfo.ext)
    );
  };

  if (isObject(main)) {
    const { input, preload } = main as WindowsMain;
    res[0] = formatPath(input);
    if (preload) {
      res.push(formatPath(preload));
    }
  }

  if (isString(main)) {
    res[0] = formatPath(main as string);
  }

  if (!res[0] || res[0] === "") {
    throw new Error(
      `The main field entry file does not exist, please provide at least one`
    );
  }

  return res;
}

const ignoreOption: OmitBuildField[] = [
  "watch",
  "entryPoints",
  "outExtension",
  "write",
  "platform",
  "target",
  "outdir",
  "outbase",
];

const customBehavior = {
  define(target: esBuild, value: any) {
    const DEFINE = "define";
    //@ts-ignore
    delete value.electronAssets;
    return Object.assign(target[DEFINE]!, value);
  },
  external(target: esBuild, value: any) {
    const EXTERNAL = "external";
    return [].concat(target[EXTERNAL] as any).concat(value);
  },
};

export function mergeEsBuild(
  target: esBuild | BuildOptions,
  source: esBuild | BuildOptions
): esBuild {
  for (const [key, value] of Object.entries(source)) {
    if (ignoreOption.includes(key as OmitBuildField)) {
      //@ts-ignore
      delete source[key];
      continue;
    }

    if (key in customBehavior) {
      //@ts-ignore
      target[key] = customBehavior[key](target, value);
    }
    if (typeof value !== "object") {
      if (key in target) {
        (target as any)[key] = value;
      }
    }
  }

  return target;
}
