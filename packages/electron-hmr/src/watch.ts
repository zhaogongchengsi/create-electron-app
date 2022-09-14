import { watch, WatchOptions } from "chokidar";
import { resolve } from "path";

export interface HmrOptions extends WatchOptions {
  /**
   * 需要监听的目录
   */
  dir?: string;

  /**
   * 根目录
   */
  root: string;
}

export function createWatch(path: string, opt: HmrOptions) {
  const watcher = watch(path, opt);
  return watcher;
}
