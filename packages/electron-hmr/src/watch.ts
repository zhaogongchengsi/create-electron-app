import { watch } from "fs/promises";

export interface WatchOptions {
  /**
   * 需要监听的目录
   */
  dir: string;

  /**
   * 根目录
   */
  root: string;

  /**
   * 需要忽略掉的文件
   */
  external: string[];
}

export async function startWatch(options: WatchOptions | string) {
  const on = (eventName: string, callback: (path: string) => void) => {};
  if (typeof options !== "string") {
    return { on };
  }

  const watcher = watch(options);
  for await (const event of watcher) console.log(event);

  return {
    on,
  };
}
