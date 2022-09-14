import { watch, WatchOptions } from "chokidar";

export function createWatch(path: string, opt?: WatchOptions) {
  const watcher = watch(path, opt);

  const log = console.log.bind(console);

  const start = (path: string) => {
    console.log("开始");
  };

  watcher
    .on("add", (path) => log(` add File ${path} has been added`))
    .on("change", (path) => log(` change File ${path} has been changed`))
    .on("unlink", (path) => log(` unlink File ${path} has been removed`));

  return watcher;
}






