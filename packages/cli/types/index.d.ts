import { BuildOptions as esbuildOpetions, Plugin } from "esbuild";
import { WatchOptions } from "chokidar";

export interface OutputOptions {
  /**
   * 临时执行的目录
   */
  tempDirName?: string;

  /**
   * app resource 输出目录
   */
  outDir?: string;

  /**
   * app xxx.exe 输出目录
   */
  appOutDir?: string;
}

export interface CommonOptions extends OutputOptions {
  /**
   *配置文件的路径
   */
  configFilePath: string;

  /**
   * 执行的目录 （execute directory）
   */
  root: string;
}

export interface ServeOptions extends CommonOptions {
  host?: number;
  port?: number;
  open?: boolean;
}

export interface buildOptions extends CommonOptions {}

export interface WindowsMain {
  input: string;
  preload?: string;
}

export interface WindowsRenderer {
  viteConfigFile: string;
}

export type Main = WindowsMain | string;
export type Renderer = string;

export interface Electron {
  /**
   * ELECTRON_DISABLE_SECURITY_WARNINGS=true
   */
  warnings?: boolean;
}

export interface StaticResource {
  prefix: string;
  path: string;
}

export interface DebugConfig {
  port?: number;
  host?: number;
}

export type Extensions = [];

export interface UseConfig extends OutputOptions {
  /**
   * entry file path
   */
  main: Main;

  /**
   * vite.config path
   */
  vite: string;

  /**
   *  hot update
   */
  watch?: boolean;

  /**
   * .html The default is index.html of the root directory
   */
  html?: string;

  /**
   * Static resource 静态资源
   */
  staticResource?: string;
  debug?: DebugConfig;
  extensions?: Extensions;
  electron?: Electron;

  // Let's configure esbuild

  plugins?: Plugin[];
  external?: string[];
  define?: Record<string, string>;
  sourcemap?: "both" | "external" | "inline" | "linked";
}

export type OmitBuildField =
  | "watch"
  | "entryPoints"
  | "outExtension"
  | "write"
  | "platform"
  | "target"
  | "outdir"
  | "outbase";

export type esBuild = Omit<esbuildOpetions, OmitBuildField>;

// drop
export interface ElectronAssets {
  mode: Mode;
  preload?: string;
  loadUrl: string | number;
}

export type Callbacks = {
  close?: (code: number | null) => void;
  data?: (data: any) => void;
};

export type Platforms = "win" | "mac" | "lin" | "all";
export type targets = Map<Platform, Map<Arch, Array<string>>>;
export type BuildAppOptions = {
  inputDir: string;
  config: string | Configuration | null;
  targets: targets;
};

export type Mode = "development" | "production";

export type ExportConfig = () => UseConfig | UseConfig;
