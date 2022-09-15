import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { _reauire } from "../utils";

export default class ElectronMon {
  cwd: string = process.cwd();
  config: any;
  private readonly ELECTRON = "electron";

  constructor(root: string, config?: any) {
    this.cwd = root;
    this.config - config;
  }

  private _process: ChildProcessWithoutNullStreams | null = null;

  private _controller: AbortController | undefined;

  private async createElectronProcess(args: string | string[]) {
    let electronModule;
    try {
      electronModule = await _reauire(this.ELECTRON);
    } catch (err) {
      throw new Error(
        `electron may not be installed, try running npm install electron --save-dev and try again`
      );
    }

    const _args = typeof args != "string" ? args : [args];

    const controller = new AbortController();
    const { signal } = controller;

    const ls = spawn(electronModule, _args, {
      cwd: this.cwd,
      shell: true,
      signal,
    });

    this._controller = controller;
    this._process = ls;
  }

  fileName: string | undefined;
  async start(fileName: string) {
    this.fileName = fileName;
    await this.createElectronProcess(fileName);

    this._process?.on("exit", () => {
      console.log("electronmon exit");
      this._process = null;
      this._controller = undefined;
    });
  }

  close() {
    this._process?.removeAllListeners();
    console.log("关闭子进程");
    this._process?.kill("SIGSTOP");
  }

  async restart() {
    this.close();
    await this.start(this.fileName!);
  }
}
