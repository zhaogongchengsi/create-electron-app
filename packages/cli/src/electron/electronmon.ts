import { ChildProcess, spawn, StdioOptions, exec } from "node:child_process";
import { DebugConfig, Extensions } from "../../types";
import { _reauire } from "../utils";
import pc from "picocolors";
import { resolve } from "node:path";
import { fileURLToPath } from "url";

const isStdReadable = (stream: any) => stream === process.stdin;
const isStdWritable = (stream: any) =>
  stream === process.stdout || stream === process.stderr;

export default class ElectronMon {
  cwd: string = process.cwd();
  config: any;
  private readonly ELECTRON = "electron";

  stdio = [process.stdin, process.stdout, process.stderr];

  env: Record<string, string> = {};

  debugConfig: DebugConfig | undefined = undefined;

  debugArgs: string[] = [];

  constructor(root: string, config?: any) {
    this.cwd = root;
    this.config = config;
    this.env = config.env;
    if (config.debugConfig) {
      this.debugConfig = config.debugConfig;
    }
  }

  private _process: ChildProcess | null = null;

  electronModule: any;

  private async createElectronProcess(args: string | string[]) {
    try {
      this.electronModule = await _reauire(this.ELECTRON);
    } catch (err) {
      throw new Error(
        `electron may not be installed, try running npm install electron --save-dev and try again`
      );
    }

    const stdioArg: StdioOptions = [
      isStdReadable(this.stdio[0]) ? "inherit" : "pipe",
      isStdWritable(this.stdio[1]) ? "inherit" : "pipe",
      isStdWritable(this.stdio[2]) ? "inherit" : "pipe",
      "ipc",
    ];

    const _args = [this.debugConfig ? `--inspect=${this.debugConfig.port}` : ""]
      .concat(typeof args != "string" ? args : [args])
      .filter(Boolean);

    const ls = spawn(this.electronModule, _args, {
      cwd: this.cwd,
      env: this.env ?? {},
      stdio: stdioArg,
    });

    this._process = ls;
  }

  fileName: string | undefined;
  async start(fileName: string) {
    this.fileName = fileName;
    await this.createElectronProcess(fileName);
    this._process?.on("message", (msg: string) => {
      if (msg === "_cea_:app-windows-all_close") {
        process.exit(0);
      }
    });
  }

  private killElectronProcess() {
    this._process?.removeAllListeners();
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
    this._process?.send("cea:restart");
    await this.close();
    await this.start(this.fileName!);
    await this.debugPrint();
  }

  async debugPrint() {
    if (!this.debugConfig) {
      return;
    }
    const { port, host } = this.debugConfig;
    if (!port) {
      return;
    }

    const url = (port: string | number) =>
      pc.blue(`http://${host ?? "localhost"}:${port}/json/list`);

    console.log(`
  🟢 ${url(port)}
  🟢 ${pc.dim(pc.green("devtoolsFrontendUrl"))} Is the debug path
    `);
  }

  async installExtension(extensions?: Extensions) {
    if (!extensions || extensions.length < 1) {
      return;
    }
    console.log(this._process);
    this._process?.send({
      type: "_cea_:app-windows-install_plugins",
      extensions: ["vue-dev-tools"],
    });
  }
}
