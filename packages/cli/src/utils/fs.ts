import { access, mkdir, rm, symlink, unlink, writeFile } from "fs/promises";
import { constants } from "fs";
import { join } from "path";

/**
 *
 * @param path 判断一个路径是否存在
 * @returns boolean
 */
export async function pathExist(path: string) {
  try {
    await access(path, constants.R_OK | constants.W_OK);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 *
 * @param target 需要创建的软连接
 * @param source 软连接的源地址
 * @returns 删除软连接的方法
 * @description 创建一个软连接
 */
export async function createSystemLink(target: string, source: string) {
  await symlink(source, target, "junction");
  return async () => {
    await unlink(target);
  };
}

const NODE_MODULES = "node_modules";

/**
 *
 * @param target 需要创建 node_modules 的软连接
 * @param source node_modules 软连接的源地址
 * @returns 删除软连接的方法
 * @description 创建 node_modules 软连接
 */
export async function createNodeModule(target: string, source: string) {
  return createSystemLink(
    join(target, NODE_MODULES),
    join(source, NODE_MODULES)
  );
}

/**
 *
 * @param path 文件夹路径
 * @param buffer 文件内容
 * @param fileName 文件名 可选
 * @description 创建一个文件 并写入内容 若路径不存在则报错
 */
export async function createFile(path: string, buffer: any, fileName?: string) {
  const isExist = await pathExist(path);

  if (fileName && !isExist) {
    throw new Error(`${path} does not exist`);
  }

  const controller = new AbortController();
  const { signal } = controller;
  const data = new Uint8Array(Buffer.from(buffer));
  const outFile = fileName ? join(path, fileName) : path;
  await writeFile(outFile, data, { signal });
  return async () => {
    await unlink(outFile);
  };
}

/**
 *
 * @param path 文件夹路径
 * @param rebuild 是否覆盖 default = true
 * @description 创建一个文件夹 若是文件夹已经存在 并且 rebuild 为 true 则会删除文件夹后在创建一个空的文件夹 删除会清除内部所有的文件
 */
export async function createDir(path: string, rebuild: boolean = true) {
  const isExist = await pathExist(path);

  const clear = async () => {
    await rm(path, {
      recursive: true,
    });
  };

  if (!isExist) {
    await mkdir(path);
    return clear;
  }

  if (rebuild) {
    await clear();
    await mkdir(path);
    return clear;
  }
}
