import { watch, WatchOptions, FSWatcher } from "chokidar";
import { spawn, ChildProcessWithoutNullStreams } from "node:child_process";
import { _reauire, debounce } from "../utils";

export enum QuitName {
  exit = "exit",
  disconnect = "disconnect",
  SIGKILL = "SIGKILL",
  SIGHUP = "SIGHUP",
  SIGINT = "SIGINT",
  SIGTERM = "SIGTERM",
}

export default class ElectronMon {
  watcher: FSWatcher;

  private readonly ELECTRON = "electron";

  constructor(path: string | readonly string[], options?: WatchOptions) {
    this.watcher = watch(path, options);
  }

  electron_process: ChildProcessWithoutNullStreams | undefined = undefined;

  /**
   * 创建一个 electron 的进程
   */
  private async createElectronProcess(
    root: string,
    args: string | string[] = "index.js"
  ) {
    let electronModule;
    try {
      electronModule = await _reauire(this.ELECTRON);
    } catch (err) {
      throw new Error(
        `electron may not be installed, try running npm install electron --save-dev and try again`
      );
    }

    const _args = typeof args != "string" ? args : [args];

    const ls = spawn(electronModule, _args, {
      cwd: root,
      shell: true,
    });

    this.electron_process = ls;
  }

  private add(path: string) {
    console.log(`watch add ${path}`);
  }

  private change(path: string) {
    console.log(`watch change ${path}`);
  }

  private error(error: Error) {
    console.log(`watch error ${error}`);
    this.exit();
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

  private close() {}

  async exit() {
    this.electron_process?.removeAllListeners();
    this.electron_process?.kill("SIGHUP");

    this.watcher.removeAllListeners();
    await this.watcher.close();

    process.removeAllListeners();

    process.exit(1);
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
      this.exit();
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

  bindElectronProcess() {
    const exit = (code: string) => {
      console.log("electron 进程退出" + code);
      this.exit();
    };
    this.electron_process?.on("exit", () => exit("electron_exit"));
    this.electron_process?.on("disconnect", () => exit("electron_disconnect"));
    this.electron_process?.on("close", () => exit("disconnect_close"));
    return this;
  }

  longTermRun(root: string, filename: string) {
    this.bindWatcherEvent().bindProcessEvent();
    this.createElectronProcess(root, filename)
      .then(() => {
        this.bindElectronProcess();
      })
      .catch((err) => {
        this.exit();
      });
  }

  run() {}
}
