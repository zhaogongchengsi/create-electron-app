import { watch, WatchOptions, FSWatcher } from "chokidar";
import { spawn, ChildProcessWithoutNullStreams } from "node:child_process";
import { _reauire, debounce } from "../utils";
import ElectronMon from "./electronmon";

export enum QuitName {
  exit = "exit",
  disconnect = "disconnect",
  SIGKILL = "SIGKILL",
  SIGHUP = "SIGHUP",
  SIGINT = "SIGINT",
  SIGTERM = "SIGTERM",
}

export default class {
  watcher: FSWatcher;

  isExit: boolean = false;

  private electronmon: ElectronMon | undefined;

  constructor(root: string, options?: WatchOptions) {
    this.watcher = watch(root, options);
    this.electronmon = new ElectronMon(root);
  }

  private add(path: string) {
    console.log(`watch add ${path}`);
  }

  private change(path: string) {
    console.log(`watch change ${path}`);
  }

  private error(error: Error) {
    console.log(`watch error ${error}`);
  }

  private raw(event: string, path: string, details: any) {
    console.log(`watch raw ${path}`);
  }

  private deleteFile(path: string) {
    console.log(`watch deleteFile ${path}`);
  }

  private ready(path: string) {
    console.log(`watch ready ${path}`);
  }

  private bindWatcherEvent() {
    const { watcher } = this;
    watcher
      .on("add", this.add)
      .on("addDir", this.add)
      .on("change", this.change)
      .on("unlink", this.deleteFile)
      .on("unlinkDir", this.deleteFile)
      .on("error", this.error)
      .on("ready", this.ready)
      .on("raw", this.raw);

    return this;
  }

  bindProcessEvent() {
    const exit = (code: string) => {
      console.log("当前进程退出" + code);
      process.removeAllListeners();
      this.electronmon?.close();

      
      process.exit(1);

      // this.closeElectronProcess();
    };

    process.on(QuitName.exit, function () {
      exit(QuitName.exit);
    });

    process.on(QuitName.disconnect, () => exit(QuitName.disconnect));
    process.on(QuitName.SIGKILL, () => exit(QuitName.SIGKILL));
    process.on(QuitName.SIGHUP, () => exit(QuitName.SIGHUP));
    process.on(QuitName.SIGINT, () => exit(QuitName.SIGINT));
    process.on(QuitName.SIGTERM, () => exit(QuitName.SIGTERM));
    return this;
  }

  async longTermRun(filename: string) {
    this.bindProcessEvent();
    await this.electronmon?.start(filename);
  }

  run() {}
}
