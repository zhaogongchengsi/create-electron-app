import { join, parse, relative, resolve } from "path";
import { UserConfig } from "vite";
import { ElectronAssets, Mode, UseConfig } from "../../types";
import { identifyMainType } from "../config";
import LogLevel from "./log";

type logfunc = (mag: string) => void;

export interface log {
  info: logfunc;
  warn: logfunc;
  error: (err: Error) => void;
  silent: logfunc;
}

export interface CeaContextOptions {
  root: string;
  config: UseConfig;
  packageJson?: any;
  mode?: Mode;
  log?: log;
  env?: Record<string, string>;
}

export class CeaContext {
  root: string;
  config: UseConfig;
  /**
   * 打包配置
   */
  build: any;
  /**
   * 开发运行模式
   */
  mode: Mode = "development";
  entryPoints: string[];
  _html: string = "index.html";
  _mian: string;
  _preload: string[];

  _isEms: boolean = false;

  _eleAssets: {
    main: string;
    preload: string | undefined;
  };

  /**
   * 日志
   */
  logLevel: log;

  env: Record<string, string>;

  constructor({
    root,
    config,
    packageJson = {},
    mode,
    log = new LogLevel(),
    env = {},
  }: CeaContextOptions) {
    this.root = root ?? process.cwd();
    this.config = config;
    this.build = packageJson.build ?? {};
    this.mode = mode ?? "development";
    this.logLevel = log;
    this.env = env;
    const { base, dir, root: r } = parse(this.config.html!);
    this._html = relative(join(this.root, r, dir), base);

    const entries = identifyMainType(config.main);

    this.entryPoints = entries;
    this._mian = entries[0];
    this._preload = entries.slice(1);

    const assEntries = identifyMainType(config.main, {
      root,
      ext: "cjs",
    });

    this._eleAssets = { main: assEntries[0], preload: assEntries[1] };

    this._isEms = false;
    // if (mode === "production") {
    //   this._isEms = false;
    // } else {
    //   if (packageJson.type === "module") {
    //     this._isEms = true;
    //   } else {
    //     this._isEms = false;
    //   }
    //   if (/\.m[jt]s$/.test(this._mian)) {
    //     this._isEms = true;
    //   } else if (/\.c[jt]s$/.test(this._mian)) {
    //     this._isEms = false;
    //   }
    // }
  }

  runPath: string | undefined;

  /**
   *
   * @param type 路径
   * @returns 运行的环境目录 开发时是运行的临时目录 打包时是构建的静态资源目录
   */
  envPath() {
    const { outDir, tempDirName } = this.config;
    let path: string | undefined = "";

    if (this.mode === "development") {
      path = tempDirName;
    } else if (this.mode === "production") {
      path = outDir;
    }

    this.runPath = resolve(this.root, path!);
    return this;
  }

  eleAssets: ElectronAssets | undefined;
  createElectronAssets(loadUrl?: string) {
    const preload: string | undefined = this._eleAssets.preload;
    let _loadUrl: string | undefined = this._html;
    if (this.mode === "development") {
      _loadUrl = loadUrl;
    }

    this.eleAssets = {
      mode: this.mode,
      loadUrl: _loadUrl!,
      preload: preload ? parse(preload).base : undefined,
    };

    return this;
  }

  set html(value: string) {
    this._html = value;
  }

  get html() {
    return this._html;
  }

  set entries(value) {
    throw new Error(`entries are readable`);
  }

  get entries() {
    return [this._mian].concat(this._preload);
  }

  _viteConfig: UserConfig | undefined;
  set viteConfig(value: UserConfig) {
    this._viteConfig = value;
  }

  get viteConfig(): UserConfig {
    if (this._viteConfig) {
      return this._viteConfig;
    }
    throw new Error(`viteConfig is undefined`);
  }

  set exePath(value) {
    throw new Error(`entries are readable`);
  }

  get exePath() {
    if (!this.runPath) {
      throw new Error(`outdir has not been set`);
    }
    return relative(this.runPath, join(this.root, this.config.appOutDir!));
  }
}
