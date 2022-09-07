import { BuildOptions as esbuildOpetions, Plugin } from "esbuild";

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

  electronAssets?: ElectronAssets;

  /**
   * Documentation https://esbuild.github.io/api/#build-api
   *
   * Not all configurations are valid
   */
  build?: esbuildOpetions;
}

interface build {
  minify?: boolean;
  /** Documentation: https://esbuild.github.io/plugins/ */
  plugins?: Plugin[];
  /** Documentation: https://esbuild.github.io/api/#define */
  define?: { [key: string]: string };
  /** Documentation: https://esbuild.github.io/api/#target */
  target: string | string[];
  sourcemap: boolean;
  /** Documentation: https://esbuild.github.io/api/#tsconfig */
  tsconfig?: string;
}

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
