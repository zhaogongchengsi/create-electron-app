import { join, parse, relative, resolve } from "path";
import { UserConfig } from "vite";
import { ElectronAssets, Extensions, Mode, UseConfig } from "../../types";
import { identifyMainType, defaultConfig } from "../config";
import LogLevel from "./log";
import { createSystemLink, pathExist } from "../utils";
import { cp, unlink } from "fs/promises";

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

  env: Record<string, string> = {};

  resources: string = "public";
  resourcesPrefix: string = "#";

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

    this.envPath();
    this.initEnv(env);
    this.initHtml();

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
  }

  async initResources() {
    if (!this.config.staticResource) {
      return;
    }
    const resources = join(this.root, this.resources);
    const runres = join(this.runPath!, this.resources);
    if (this.mode === "development") {
      if (await pathExist(runres)) {
        await unlink(runres);
      }
      createSystemLink(runres, resources);
    } else {
      cp(resources, runres, {
        force: true,
        recursive: true,
        verbatimSymlinks: false,
      });
    }
  }

  private initEnv(env: any) {
    this.env = {
      ELECTRON_DISABLE_SECURITY_WARNINGS: `${
        this.config.electron?.warnings ?? true
      }`,
      ...env,
    };
  }

  private initHtml() {
    const {
      base,
      dir,
      root: r,
    } = parse(this.config.html ?? defaultConfig.html);
    this._html = relative(join(this.root, r, dir), base);
  }

  runPath: string | undefined;

  /**
   *
   * @param type 路径
   * @returns 运行的环境目录 开发时是运行的临时目录 打包时是构建的静态资源目录
   */
  private envPath() {
    const { outDir, tempDirName } = this.config;
    let path: string | undefined = "";

    if (this.mode === "development") {
      path = tempDirName ?? defaultConfig.tempDirName;
    } else if (this.mode === "production") {
      path = outDir ?? defaultConfig.outDir;
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
    return relative(
      this.runPath,
      join(this.root, this.config.appOutDir ?? defaultConfig.appOutDir)
    );
  }
}
