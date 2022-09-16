import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { _reauire } from "../utils";
import { resolve } from "path";

export default class ElectronMon {
  cwd: string = process.cwd();
  config: any;
  private readonly ELECTRON = "electron";

  env: Record<string, string> = {};

  constructor(root: string, config?: any) {
    this.cwd = root;
    this.config = config;
    this.env = config.env;
  }

  private _process: ChildProcessWithoutNullStreams | null = null;

  electronModule: any;

  private async createElectronProcess(args: string | string[]) {
    try {
      this.electronModule = await _reauire(this.ELECTRON);
    } catch (err) {
      throw new Error(
        `electron may not be installed, try running npm install electron --save-dev and try again`
      );
    }
    const _args = typeof args != "string" ? args : [args];
    const ls = spawn(this.electronModule, _args, {
      cwd: this.cwd,
      env: this.env ?? {},
    });
    this._process = ls;
  }

  fileName: string | undefined;
  async start(fileName: string) {
    this.fileName = fileName;
    await this.createElectronProcess(fileName);
  }

  private killElectronProcess() {
    return new Promise((resolve) => {
      this._process?.on("exit", () => {
        this._process = null;
        resolve(true);
      });
      this._process?.kill("SIGINT");
    });
  }

  async close() {
    await this.killElectronProcess();
  }

  async restart() {
    await this.close();
    await this.start(this.fileName!);
  }
}
